import * as React from "react";

import { cn } from "../../lib/cn.ts";

export interface SeparatorProps extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
  /** A decorative separator is hidden from assistive technology. */
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, orientation = "horizontal", decorative = true, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="separator"
      data-orientation={orientation}
      role={decorative ? "none" : "separator"}
      {...(decorative ? {} : { "aria-orientation": orientation })}
      className={cn(
        "shrink-0 bg-border",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
});

export { Separator };
