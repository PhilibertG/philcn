import * as React from "react";

import { composeRefs } from "./compose.ts";
import { getFocusableElements } from "./focusable.ts";
import { useCallbackRef } from "./use-callback-ref.ts";

export interface FocusScopeProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Keep Tab inside this box. */
  trapped?: boolean | undefined;
  /** Move focus inside on mount, and back out on unmount. */
  autoFocus?: boolean | undefined;
  onMountAutoFocus?: ((event: Event) => void) | undefined;
  onUnmountAutoFocus?: ((event: Event) => void) | undefined;
}

/**
 * Keeps keyboard focus inside a dialog and gives it back afterwards.
 *
 * Without this, Tab walks out of an open dialog and into the page behind it —
 * a screen reader user ends up reading content they cannot see.
 */
const FocusScope = React.forwardRef<HTMLDivElement, FocusScopeProps>(function FocusScope(
  { trapped = true, autoFocus = true, onMountAutoFocus, onUnmountAutoFocus, tabIndex, ...props },
  forwardedRef,
) {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);

  // Memoised on purpose. A fresh ref callback on every render makes React
  // detach the old one with null and re-attach the new one, so `node` flips
  // to null and back. That re-runs the effects below, and the auto-focus
  // cleanup hands focus back to the page a moment after taking it.
  const setRef = React.useMemo(
    () => composeRefs<HTMLDivElement>(forwardedRef, setNode),
    [forwardedRef],
  );

  const handleMountAutoFocus = useCallbackRef(onMountAutoFocus);
  const handleUnmountAutoFocus = useCallbackRef(onUnmountAutoFocus);

  React.useEffect(() => {
    if (node === null || !autoFocus) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const mountEvent = new CustomEvent("focusScope.autoFocusOnMount", { cancelable: true });
    handleMountAutoFocus(mountEvent);

    let retry: number | undefined;

    if (!mountEvent.defaultPrevented) {
      const [first] = getFocusableElements(node);
      // Nothing focusable inside: focus the box itself so the keyboard has a
      // starting point and a screen reader announces the dialog.
      const target = first ?? node;

      const take = () => target.focus({ preventScroll: true });
      take();

      // focus() fails silently when the element is momentarily unreachable —
      // still being inserted, or inside a subtree another layer has just made
      // inert. One more attempt on the next task settles it.
      if (document.activeElement !== target) {
        retry = window.setTimeout(take, 0);
      }
    }

    return () => {
      if (retry !== undefined) window.clearTimeout(retry);

      const unmountEvent = new CustomEvent("focusScope.autoFocusOnUnmount", { cancelable: true });
      handleUnmountAutoFocus(unmountEvent);

      if (unmountEvent.defaultPrevented || previouslyFocused === null) return;

      // Restore straight away. requestAnimationFrame is not used here: it does
      // not fire in a hidden or throttled tab, and focus would never come back.
      const restore = () => {
        if (previouslyFocused.isConnected) previouslyFocused.focus({ preventScroll: true });
      };

      restore();

      // A layer closing at the same moment can steal focus back to the body,
      // so try once more on the next task.
      if (document.activeElement !== previouslyFocused) {
        window.setTimeout(restore, 0);
      }
    };
  }, [node, autoFocus, handleMountAutoFocus, handleUnmountAutoFocus]);

  React.useEffect(() => {
    if (node === null || !trapped) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;

      const focusable = getFocusableElements(node);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (first === undefined || last === undefined) {
        // Nothing to move to: keep focus where it is rather than losing it.
        event.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }

      const active = document.activeElement;

      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
        return;
      }

      if (!event.shiftKey && (active === last || !node.contains(active))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [node, trapped]);

  return (
    <div
      ref={setRef}
      data-slot="focus-scope"
      tabIndex={tabIndex ?? -1}
      {...props}
    />
  );
});

export { FocusScope };
