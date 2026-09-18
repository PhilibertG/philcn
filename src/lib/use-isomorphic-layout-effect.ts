import * as React from "react";

/**
 * `useLayoutEffect` warns when it runs on a server, where there is no layout
 * to measure. This falls back to `useEffect` there.
 */
export const useIsomorphicLayoutEffect =
  typeof globalThis.document !== "undefined" ? React.useLayoutEffect : React.useEffect;
