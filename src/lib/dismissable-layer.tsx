import * as React from "react";

import { composeRefs } from "./compose.ts";
import { useCallbackRef } from "./use-callback-ref.ts";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.ts";

/**
 * Every open layer, oldest first. Shared by the whole page so that Escape
 * closes only the topmost one: a dropdown inside a dialog must close on its
 * own, leaving the dialog open.
 */
const layers: HTMLElement[] = [];
const blockingLayers = new Set<HTMLElement>();
let restoreBodyPointerEvents: (() => void) | null = null;

/* The stack is shared module state, so React learns about changes through a
   subscription rather than a re-render of a common parent. */
const subscribers = new Set<() => void>();
let stackVersion = 0;

function subscribeToStack(listener: () => void): () => void {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
}

function getStackVersion(): number {
  return stackVersion;
}

function notifyStackChanged(): void {
  stackVersion += 1;
  for (const listener of subscribers) listener();
}

interface LayerState {
  /** False when another layer has opened on top of this one. */
  isTopmost: boolean;
}

const LayerContext = React.createContext<LayerState>({ isTopmost: true });

/**
 * Tells a layer's content whether it is still the one on top. A dialog that
 * is no longer topmost stays open and mounted, but can step out of the way.
 */
export function useLayerState(): LayerState {
  return React.useContext(LayerContext);
}

export interface DismissableLayerProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Makes everything behind this layer unclickable. Modal dialogs use this. */
  disableOutsidePointerEvents?: boolean | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
  onPointerDownOutside?: ((event: PointerEvent) => void) | undefined;
  onFocusOutside?: ((event: FocusEvent) => void) | undefined;
  /** Called for either kind of outside interaction. */
  onInteractOutside?: ((event: PointerEvent | FocusEvent) => void) | undefined;
  /** Called when the layer should close, unless a handler above prevented it. */
  onDismiss?: (() => void) | undefined;
}

/**
 * A box that knows when the user asked to leave it: Escape, a click outside,
 * or focus moving away. It never closes itself — it reports, and the owner
 * decides.
 */
const DismissableLayer = React.forwardRef<HTMLDivElement, DismissableLayerProps>(
  function DismissableLayer(
    {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      style,
      ...props
    },
    forwardedRef,
  ) {
    const [node, setNode] = React.useState<HTMLDivElement | null>(null);

    const version = React.useSyncExternalStore(
      subscribeToStack,
      getStackVersion,
      getStackVersion,
    );
    const layerState = React.useMemo<LayerState>(
      () => ({ isTopmost: node === null || layers[layers.length - 1] === node }),
      // `version` is the signal that the stack changed.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [node, version],
    );

    const handleEscapeKeyDown = useCallbackRef(onEscapeKeyDown);
    const handlePointerDownOutside = useCallbackRef(onPointerDownOutside);
    const handleFocusOutside = useCallbackRef(onFocusOutside);
    const handleInteractOutside = useCallbackRef(onInteractOutside);
    const handleDismiss = useCallbackRef(onDismiss);

    // Register in the shared stack for as long as the layer is mounted.
    useIsomorphicLayoutEffect(() => {
      if (node === null) return;

      layers.push(node);
      if (disableOutsidePointerEvents) blockingLayers.add(node);
      notifyStackChanged();

      if (blockingLayers.size > 0 && restoreBodyPointerEvents === null) {
        const body = document.body;
        const previous = body.style.pointerEvents;
        body.style.pointerEvents = "none";
        restoreBodyPointerEvents = () => {
          body.style.pointerEvents = previous;
        };
      }

      return () => {
        const index = layers.indexOf(node);
        if (index !== -1) layers.splice(index, 1);
        blockingLayers.delete(node);
        notifyStackChanged();

        if (blockingLayers.size === 0 && restoreBodyPointerEvents !== null) {
          restoreBodyPointerEvents();
          restoreBodyPointerEvents = null;
        }
      };
    }, [node, disableOutsidePointerEvents]);

    React.useEffect(() => {
      if (node === null) return;

      const isTopmost = () => layers[layers.length - 1] === node;

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape" || !isTopmost()) return;
        handleEscapeKeyDown(event);
        if (!event.defaultPrevented) handleDismiss();
      };

      const onPointerDown = (event: PointerEvent) => {
        const target = event.target;
        if (!(target instanceof Node) || node.contains(target)) return;
        // Only the layer on top reacts, so one click closes one layer.
        if (!isTopmost()) return;

        handlePointerDownOutside(event);
        handleInteractOutside(event);
        if (!event.defaultPrevented) handleDismiss();
      };

      const onFocusIn = (event: FocusEvent) => {
        const target = event.target;
        if (!(target instanceof Node) || node.contains(target)) return;
        if (!isTopmost()) return;

        handleFocusOutside(event);
        handleInteractOutside(event);
      };

      document.addEventListener("keydown", onKeyDown);
      // Capture phase, so a handler inside the page cannot swallow the click.
      document.addEventListener("pointerdown", onPointerDown, true);
      document.addEventListener("focusin", onFocusIn);

      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("pointerdown", onPointerDown, true);
        document.removeEventListener("focusin", onFocusIn);
      };
    }, [
      node,
      handleEscapeKeyDown,
      handlePointerDownOutside,
      handleFocusOutside,
      handleInteractOutside,
      handleDismiss,
    ]);

    return (
      <LayerContext.Provider value={layerState}>
        <div
          ref={composeRefs<HTMLDivElement>(forwardedRef, setNode)}
          data-slot="dismissable-layer"
          data-topmost={layerState.isTopmost ? "true" : "false"}
          // The page behind is made unclickable; this layer must stay clickable.
          style={{ pointerEvents: blockingLayers.size > 0 ? "auto" : undefined, ...style }}
          {...props}
        />
      </LayerContext.Provider>
    );
  },
);

export { DismissableLayer };
