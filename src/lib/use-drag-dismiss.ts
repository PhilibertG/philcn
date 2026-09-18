import * as React from "react";

import {
  axisOf,
  leavingSign,
  offsetFor,
  shouldDismiss,
  velocityFrom,
  type DragDirection,
  type VelocitySample,
} from "./drag-dismiss.ts";
import { useCallbackRef } from "./use-callback-ref.ts";

/**
 * Whether the gesture should scroll the content instead of moving the panel.
 *
 * Dragging down inside a list that is already scrolled must scroll the list,
 * not drag the drawer away. Only once the list is back at its edge does the
 * gesture belong to the drawer.
 */
function scrollTakesPrecedence(
  target: Element | null,
  root: Element,
  direction: DragDirection,
): boolean {
  const vertical = axisOf(direction) === "y";
  const leaving = leavingSign(direction);

  let element: Element | null = target;
  while (element !== null && element !== root.parentElement) {
    const styles = window.getComputedStyle(element);
    const overflow = vertical ? styles.overflowY : styles.overflowX;

    if (overflow === "auto" || overflow === "scroll") {
      const position = vertical ? element.scrollTop : element.scrollLeft;
      const extent = vertical
        ? element.scrollHeight - element.clientHeight
        : element.scrollWidth - element.clientWidth;

      // Leaving "forwards" consumes a backwards scroll, and the reverse.
      const remaining = leaving === 1 ? position : extent - position;
      if (remaining > 1) return true;
    }

    element = element.parentElement;
  }

  return false;
}

export interface UseDragDismissOptions {
  direction: DragDirection;
  /** Called once the panel has finished travelling out of view. */
  onDismiss: () => void;
  enabled?: boolean | undefined;
}

export interface DragDismissState {
  /** Distance from the resting place, in pixels. Negative means over-opened. */
  offset: number;
  isDragging: boolean;
  /** True from the moment a dismissal is decided until the panel is gone. */
  isDismissing: boolean;
  /** 0 at rest, 1 fully gone — the backdrop fades with this. */
  progress: number;
  /** Size of the panel along the drag axis, measured when the drag began. */
  dimension: number;
}

export interface UseDragDismissResult extends DragDismissState {
  handlers: {
    onPointerDown: React.PointerEventHandler<HTMLElement>;
    onPointerMove: React.PointerEventHandler<HTMLElement>;
    onPointerUp: React.PointerEventHandler<HTMLElement>;
    onPointerCancel: React.PointerEventHandler<HTMLElement>;
  };
  /** Call when the exit transition has finished. */
  finishDismiss: () => void;
}

/** Matches the transition declared on the drawer content. */
export const EXIT_MS = 250;

/**
 * How far the pointer must travel before this counts as a drag.
 *
 * Nothing is captured below it. Capturing on contact would redirect the
 * click to the panel, and a tap on Close or Cancel would never reach the
 * button.
 */
export const DRAG_THRESHOLD_PX = 4;

const REST: DragDismissState = {
  offset: 0,
  isDragging: false,
  isDismissing: false,
  progress: 0,
  dimension: 0,
};

export function useDragDismiss({
  direction,
  onDismiss,
  enabled = true,
}: UseDragDismissOptions): UseDragDismissResult {
  const [state, setState] = React.useState<DragDismissState>(REST);

  const handleDismiss = useCallbackRef(onDismiss);
  const origin = React.useRef<{ position: number; dimension: number; armed: boolean } | null>(
    null,
  );
  const samples = React.useRef<VelocitySample[]>([]);

  const readPosition = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) =>
      axisOf(direction) === "y" ? event.clientY : event.clientX,
    [direction],
  );

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      // Ignore secondary mouse buttons; touch and pen report button 0 too.
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const root = event.currentTarget;
      const target = event.target instanceof Element ? event.target : null;
      if (scrollTakesPrecedence(target, root, direction)) return;

      const rect = root.getBoundingClientRect();
      const dimension = axisOf(direction) === "y" ? rect.height : rect.width;
      const position = readPosition(event);

      // Watch, but claim nothing yet: this may still turn out to be a tap.
      origin.current = { position, dimension, armed: false };
      samples.current = [];
    },
    [enabled, direction, readPosition],
  );

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const started = origin.current;
      if (started === null) return;

      const position = readPosition(event);

      if (!started.armed) {
        if (Math.abs(position - started.position) < DRAG_THRESHOLD_PX) return;

        // The threshold is crossed: this is a drag. Re-base the origin here so
        // the panel starts moving from where it is, without a jump.
        started.armed = true;
        started.position = position;
        samples.current = [{ position: 0, time: event.timeStamp }];

        // Capture keeps the gesture alive if the finger leaves the panel. It is
        // refused for pointers the browser does not know, such as a synthetic
        // event in a test; the drag still works without it.
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* no capture available */
        }
      }

      const travel = (position - started.position) * leavingSign(direction);
      const offset = offsetFor(travel, started.dimension);

      samples.current.push({ position: travel, time: event.timeStamp });
      if (samples.current.length > 12) samples.current.shift();

      setState({
        offset,
        dimension: started.dimension,
        isDragging: true,
        isDismissing: false,
        progress: started.dimension > 0 ? Math.min(Math.max(offset, 0) / started.dimension, 1) : 0,
      });
    },
    [direction, readPosition],
  );

  const settle = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const started = origin.current;
      if (started === null) return;

      origin.current = null;

      // Never crossed the threshold: that was a tap, and the click below must
      // reach whatever was tapped.
      if (!started.armed) return;

      try {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      } catch {
        /* nothing to release */
      }

      const travel = (readPosition(event) - started.position) * leavingSign(direction);
      const offset = offsetFor(travel, started.dimension);
      const velocity = velocityFrom(samples.current);
      samples.current = [];

      const decision = shouldDismiss({ offset, dimension: started.dimension, velocity });

      if (decision.dismiss) {
        setState({
          offset: started.dimension,
          dimension: started.dimension,
          isDragging: false,
          isDismissing: true,
          progress: 1,
        });
        return;
      }

      setState({ ...REST, dimension: started.dimension });
    },
    [direction, readPosition],
  );

  const finishDismiss = React.useCallback(() => {
    setState((current) => (current.isDismissing ? REST : current));
    handleDismiss();
  }, [handleDismiss]);

  /**
   * The exit is normally ended by the transition reporting that it finished.
   * That report never arrives in a throttled tab, or when the panel happens to
   * already be where it is heading — and the drawer would then hang half off
   * the screen, with the page still frozen behind it. This closes it anyway.
   */
  React.useEffect(() => {
    if (!state.isDismissing) return;
    const timer = window.setTimeout(finishDismiss, EXIT_MS + 75);
    return () => window.clearTimeout(timer);
  }, [state.isDismissing, finishDismiss]);

  return {
    ...state,
    finishDismiss,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: settle,
      onPointerCancel: settle,
    },
  };
}
