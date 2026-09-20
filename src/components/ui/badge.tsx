import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { Slot } from "../../lib/slot.tsx";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden",
    "whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
    "transition-[color,border-color,box-shadow]",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  ],
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: [
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90",
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          "dark:bg-destructive/60",
        ],
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, asChild = false, render, ...props },
  ref,
) {
  const classes = cn(badgeVariants({ variant }), className);

  if (asChild || render !== undefined) {
    return (
      <Slot
        ref={ref as React.Ref<HTMLElement>}
        render={render}
        data-slot="badge"
        className={classes}
        {...props}
      />
    );
  }

  return <span ref={ref} data-slot="badge" className={classes} {...props} />;
});

export { Badge, badgeVariants };
