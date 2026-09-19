import * as React from "react";

import { useCallbackRef } from "./use-callback-ref.ts";

export interface UseHoverOpenOptions {
  /**
   * Wait this long before opening, so passing the pointer over does nothing.
   *
   * A function is read when the pointer arrives rather than while rendering:
   * a tooltip only knows whether it may skip the wait at the moment it is
   * hovered, not when the page was built.
   */
  openDelay?: number | (() => number) | undefined;
  /** Wait this long before closing, so the pointer can travel to the panel. */
  closeDelay?: number | undefined;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean | undefined;
  /** Keyboard focus opens it too. True for tooltips, false for hover cards. */
  openOnFocus?: boolean | undefined;
}

export interface HoverOpenHandlers {
  onPointerEnter: React.PointerEventHandler<HTMLElement>;
  onPointerLeave: React.PointerEventHandler<HTMLElement>;
  onFocus: React.FocusEventHandler<HTMLElement>;
  onBlur: React.FocusEventHandler<HTMLElement>;
}

export interface UseHoverOpenResult {
  /** Put on the trigger. */
  triggerHandlers: HoverOpenHandlers;
  /** Put on the panel, so moving into it keeps it open. */
  contentHandlers: Pick<HoverOpenHandlers, "onPointerEnter" | "onPointerLeave">;
  /** Close at once, without waiting — used by Escape. */
  closeNow: () => void;
}

/**
 * Opening and closing on hover, with the two delays that make it bearable.
 *
 * Without the opening delay, every pointer crossing the trigger pops a panel
 * open. Without the closing delay, the panel vanishes the instant the pointer
 * leaves the trigger — and it can never be reached.
 *
 * A touch never opens anything: on a phone there is no hovering, and a tap
 * must reach the button rather than reveal a tooltip.
 */
export function useHoverOpen({
  openDelay = 700,
  closeDelay = 300,
  onOpenChange,
  disabled = false,
  openOnFocus = true,
}: UseHoverOpenOptions): UseHoverOpenResult {
  const handleOpenChange = useCallbackRef(onOpenChange);
  const timer = React.useRef<number | undefined>(undefined);

  const clear = React.useCallback(() => {
    if (timer.current !== undefined) {
      window.clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, []);

  // Nothing must fire after the component has gone.
  React.useEffect(() => clear, [clear]);

  const schedule = React.useCallback(
    (open: boolean, delay: number) => {
      clear();
      if (delay <= 0) {
        handleOpenChange(open);
        return;
      }
      timer.current = window.setTimeout(() => {
        timer.current = undefined;
        handleOpenChange(open);
      }, delay);
    },
    [clear, handleOpenChange],
  );

  const closeNow = React.useCallback(() => {
    clear();
    handleOpenChange(false);
  }, [clear, handleOpenChange]);

  const open = React.useCallback(
    (delay: number) => {
      if (disabled) return;
      schedule(true, delay);
    },
    [disabled, schedule],
  );

  const resolveOpenDelay = useCallbackRef(
    typeof openDelay === "function" ? openDelay : () => openDelay,
  );

  const triggerHandlers: HoverOpenHandlers = {
    onPointerEnter: (event) => {
      if (event.pointerType === "touch") return;
      open(resolveOpenDelay() ?? 0);
    },
    onPointerLeave: (event) => {
      if (event.pointerType === "touch") return;
      schedule(false, closeDelay);
    },
    onFocus: (event) => {
      if (!openOnFocus) return;
      // Only a keyboard visit opens it; a click already focuses the trigger.
      if (!event.target.matches(":focus-visible")) return;
      open(0);
    },
    onBlur: () => {
      if (!openOnFocus) return;
      closeNow();
    },
  };

  return {
    triggerHandlers,
    contentHandlers: {
      onPointerEnter: () => {
        if (disabled) return;
        clear();
      },
      onPointerLeave: (event) => {
        if (event.pointerType === "touch") return;
        schedule(false, closeDelay);
      },
    },
    closeNow,
  };
}
