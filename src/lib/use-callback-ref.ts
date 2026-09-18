import * as React from "react";

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.ts";

/**
 * Returns a function whose identity never changes but which always calls the
 * latest `callback`. Lets a handler be used in a dependency array without
 * re-running the effect on every render.
 */
export function useCallbackRef<Args extends unknown[], Result>(
  callback: ((...args: Args) => Result) | undefined,
): (...args: Args) => Result | undefined {
  const latest = React.useRef(callback);

  useIsomorphicLayoutEffect(() => {
    latest.current = callback;
  });

  return React.useCallback((...args: Args) => latest.current?.(...args), []);
}
