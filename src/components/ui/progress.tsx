import * as React from "react";

import { cn } from "../../lib/cn.ts";

export interface ProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Percentage between 0 and 100. Omit for an indeterminate bar. */
  value?: number | null | undefined;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { className, value, max = 100, ...props },
  ref,
) {
  const isDeterminate = typeof value === "number" && Number.isFinite(value);
  const clamped = isDeterminate ? Math.min(Math.max(value, 0), max) : 0;
  const percentage = isDeterminate && max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div
      ref={ref}
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      {...(isDeterminate ? { "aria-valuenow": clamped } : {})}
      data-state={isDeterminate ? "determinate" : "indeterminate"}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
});

export { Progress };
