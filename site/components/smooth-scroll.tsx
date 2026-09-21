"use client";

import Lenis from "lenis";
import * as React from "react";

/**
 * Smooth, eased scrolling for the whole page, through Lenis.
 *
 * It is the site's, not the library's: philcn never ships it. Three things
 * are set on purpose:
 * - someone who has asked their system to reduce motion keeps the browser's
 *   own scrolling, untouched;
 * - anything that scrolls on its own — the command palette's list — keeps
 *   scrolling itself instead of having the wheel taken by the page;
 * - in-page links land below the pinned navigation rather than under it.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      allowNestedScroll: true,
      anchors: { offset: -96 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
