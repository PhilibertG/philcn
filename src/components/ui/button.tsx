import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { Slot } from "../../lib/slot.tsx";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    // layout
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    // deliberate divergence from shadcn: buttons show a pointer cursor
    "cursor-pointer",
    "rounded-md text-sm font-medium",
    // Only the properties that actually change. `transition-all` would also
    // animate width, height and position, forcing a layout recalculation
    // every frame.
    // `scale` is its own CSS property in Tailwind v4, not part of `transform`;
    // leaving it out makes the press feedback snap instead of animating.
    "transition-[color,background-color,border-color,box-shadow,transform,scale]",
    "duration-[160ms] ease-out",
    // deliberate divergence from shadcn: a pressed button gives way
    "active:scale-[0.97]",
    // icons sized and inert unless the caller says otherwise
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
    // keyboard focus ring, never removed
    "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    // disabled and invalid states
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "dark:aria-invalid:ring-destructive/40",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: [
          "bg-destructive text-white shadow-xs hover:bg-destructive/90",
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          "dark:bg-destructive/60",
        ],
        outline: [
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
          "dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ],
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // a text link must not shrink when pressed
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a `<button>`, keeping these styles. */
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, render, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild || render !== undefined) {
    return (
      <Slot
        ref={ref as React.Ref<HTMLElement>}
        render={render}
        data-slot="button"
        className={classes}
        {...props}
      />
    );
  }

  return <button ref={ref} data-slot="button" className={classes} {...props} />;
});

export { Button, buttonVariants };
