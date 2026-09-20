"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.ts";

export interface PortalProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Where to render. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null | undefined;
}

/**
 * Renders its children somewhere else in the page, outside the parent that
 * declared them. Needed so a dialog or a dropdown is not clipped by a parent
 * with `overflow: hidden`, and so it sits above everything else.
 */
const Portal = React.forwardRef<HTMLDivElement, PortalProps>(function Portal(
  { container: containerProp, ...props },
  ref,
) {
  // The document only exists in the browser, so the first render produces
  // nothing and the portal appears once mounted.
  const [mounted, setMounted] = React.useState(false);
  useIsomorphicLayoutEffect(() => setMounted(true), []);

  const container =
    containerProp ?? (mounted && typeof document !== "undefined" ? document.body : null);

  if (container === null) return null;

  return ReactDOM.createPortal(<div ref={ref} data-slot="portal" {...props} />, container);
});

export { Portal };
