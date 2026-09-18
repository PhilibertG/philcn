import * as React from "react";

import { longestAnimationMs } from "./animation-time.ts";
import { composeRefs } from "./compose.ts";

export interface PresenceProps {
  /** Whether the content should be on screen. */
  present: boolean;
  /** A single element. It receives `data-state="open" | "closed"`. */
  children: React.ReactElement;
}

/**
 * Keeps an element mounted until its exit animation has finished.
 *
 * Without this, removing an element from the tree makes it vanish instantly
 * and the closing animation never plays. Presence sets `data-state="closed"`,
 * lets the animation run, and only then unmounts.
 *
 * Two safeguards, because an element stuck on screen is worse than a skipped
 * animation:
 *  - no animation, or one that never ends, unmounts straight away;
 *  - otherwise a timer matching the declared duration unmounts the element
 *    even if `animationend` never arrives — a throttled background tab and an
 *    interrupted animation both cause that.
 */
function Presence({ present, children }: PresenceProps): React.ReactElement | null {
  const [node, setNode] = React.useState<HTMLElement | null>(null);
  const [isRendered, setIsRendered] = React.useState(present);

  // Memoised per child ref: a fresh ref callback on every render would make
  // React detach and re-attach the node, flipping `node` to null and back and
  // restarting the effects below.
  const refCache = React.useRef(new Map<unknown, (node: HTMLElement | null) => void>());
  const setRef = React.useCallback((childRef: React.Ref<HTMLElement> | undefined) => {
    const cache = refCache.current;
    const existing = cache.get(childRef ?? null);
    if (existing !== undefined) return existing;
    const composed = composeRefs<HTMLElement>(setNode, childRef);
    cache.set(childRef ?? null, composed);
    return composed;
  }, []);

  React.useEffect(() => {
    if (present) setIsRendered(true);
  }, [present]);

  React.useEffect(() => {
    if (present || !isRendered) return;

    if (node === null) {
      setIsRendered(false);
      return;
    }

    const duration = longestAnimationMs(window.getComputedStyle(node));

    if (duration === 0 || duration === Number.POSITIVE_INFINITY) {
      setIsRendered(false);
      return;
    }

    const unmount = () => setIsRendered(false);

    // Ignore animations bubbling up from descendants.
    const handleEnd = (event: AnimationEvent) => {
      if (event.target === node) unmount();
    };

    node.addEventListener("animationend", handleEnd);
    node.addEventListener("animationcancel", handleEnd);
    // Small margin so a normally finishing animation wins the race.
    const timer = window.setTimeout(unmount, duration + 75);

    return () => {
      node.removeEventListener("animationend", handleEnd);
      node.removeEventListener("animationcancel", handleEnd);
      window.clearTimeout(timer);
    };
  }, [present, isRendered, node]);

  if (!isRendered) return null;

  const child = React.Children.only(children);
  const childRef = (child.props as { ref?: React.Ref<HTMLElement> }).ref;

  return React.cloneElement(child, {
    "data-state": present ? "open" : "closed",
    ref: setRef(childRef),
  } as Partial<unknown> & React.Attributes);
}

export { Presence };
