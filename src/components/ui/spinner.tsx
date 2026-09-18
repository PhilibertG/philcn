import * as React from "react";

import { cn } from "../../lib/cn.ts";

/**
 * An indeterminate loading indicator. Announced to assistive technology as a
 * status, with a label that can be overridden through `aria-label`.
 */
const Spinner = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<"svg">>(
  function Spinner({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={cn("size-4 animate-spin", className)}
        {...props}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  },
);

export { Spinner };
