import * as React from "react";

import { cn } from "../../lib/cn.ts";

const Skeleton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function Skeleton({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        className={cn("animate-pulse rounded-md bg-accent", className)}
        {...props}
      />
    );
  },
);

export { Skeleton };
