import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  [
    "relative grid w-full items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm",
    // an icon child turns the box into two columns
    "grid-cols-[0_1fr] has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  ],
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: [
          "bg-card text-destructive [&>svg]:text-current",
          "*:data-[slot=alert-description]:text-destructive/90",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type DivProps = React.ComponentPropsWithoutRef<"div">;

const Alert = React.forwardRef<HTMLDivElement, DivProps & VariantProps<typeof alertVariants>>(
  function Alert({ className, variant, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

const AlertTitle = React.forwardRef<HTMLDivElement, DivProps>(function AlertTitle(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  );
});

const AlertDescription = React.forwardRef<HTMLDivElement, DivProps>(function AlertDescription(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground",
        "[&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
});

export { Alert, AlertDescription, AlertTitle, alertVariants };
