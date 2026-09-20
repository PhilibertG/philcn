"use client";

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.ts";

/** How many layers currently want the page frozen. */
let lockCount = 0;
let restore: (() => void) | null = null;

/**
 * Freezes page scrolling while a modal is open.
 *
 * Hiding the scrollbar makes the page jump sideways, so its width is added
 * back as padding. Nested modals share one lock, released by the last one.
 */
export function useScrollLock(enabled: boolean): void {
  useIsomorphicLayoutEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    lockCount += 1;

    if (lockCount === 1) {
      const body = document.body;
      const previousOverflow = body.style.overflow;
      const previousPaddingRight = body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        const current = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${current + scrollbarWidth}px`;
      }

      restore = () => {
        body.style.overflow = previousOverflow;
        body.style.paddingRight = previousPaddingRight;
      };
    }

    return () => {
      lockCount -= 1;
      if (lockCount === 0 && restore !== null) {
        restore();
        restore = null;
      }
    };
  }, [enabled]);
}
