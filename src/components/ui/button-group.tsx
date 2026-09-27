"use client";

import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Buttons that belong to one another, drawn as one control.
 *
 * The joining is done with the selectors below rather than by cloning the
 * children and rewriting their classes: a group has to work with whatever is
 * put in it — buttons, an input, a select's trigger, another group — and any
 * of those can come from a block someone pasted. Touching their props would
 * mean knowing all of them.
 *
 * Two rules do the work. The radius is dropped on the edges where two
 * children meet, so the outside corners stay round and the inside ones go
 * square; and every child after the first is pulled back by one pixel, so
 * two borders sitting side by side read as one line instead of two.
 *
 * A group that holds groups spaces them out instead of joining them, which
 * is how you make clusters.
 */
const buttonGroupVariants = cva(
  [
    "flex w-fit items-stretch",
    // One line where two borders meet.
    "[&>*:not(:first-child)]:-ms-px",
    // Anything in the group loses the roundness on the side it is joined on.
    "has-[>[data-slot=button-group]]:gap-2",
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          "flex-row",
          "[&>*:not(:first-child):not(:last-child)]:rounded-none",
          "[&>*:first-child:not(:last-child)]:rounded-e-none",
          "[&>*:last-child:not(:first-child)]:rounded-s-none",
        ],
        vertical: [
          "flex-col",
          // Vertically it is the top and bottom edges that meet, and the
          // pull-back is upwards.
          "[&>*:not(:first-child)]:-ms-0 [&>*:not(:first-child)]:-mt-px",
          "[&>*:not(:first-child):not(:last-child)]:rounded-none",
          "[&>*:first-child:not(:last-child)]:rounded-b-none",
          "[&>*:last-child:not(:first-child)]:rounded-t-none",
        ],
      },
    },
    defaultVariants: { orientation: "horizontal" },
  },
);

type Orientation = "horizontal" | "vertical";

/** Which way the group runs, so the separator inside it knows which line to draw. */
const ButtonGroupContext = React.createContext<Orientation>("horizontal");

export interface ButtonGroupProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { className, orientation = "horizontal", ...props },
  ref,
) {
  const direction: Orientation = orientation ?? "horizontal";

  return (
    <ButtonGroupContext.Provider value={direction}>
      <div
        ref={ref}
        role="group"
        data-slot="button-group"
        data-orientation={direction}
        className={cn(buttonGroupVariants({ orientation: direction }), className)}
        {...props}
      />
    </ButtonGroupContext.Provider>
  );
});

export interface ButtonGroupSeparatorProps extends React.ComponentPropsWithoutRef<"div"> {
  orientation?: Orientation | undefined;
}

/**
 * The line between two buttons of the group.
 *
 * It runs across the group, so in a row it is a vertical line and in a column
 * a horizontal one: it takes the group's own direction unless told otherwise.
 * Buttons with the `outline` variant already carry a border and need none of
 * this; the filled variants do.
 */
const ButtonGroupSeparator = React.forwardRef<HTMLDivElement, ButtonGroupSeparatorProps>(
  function ButtonGroupSeparator({ className, orientation, ...props }, ref) {
    const group = React.useContext(ButtonGroupContext);
    // Across the group, not along it.
    const direction = orientation ?? (group === "horizontal" ? "vertical" : "horizontal");

    return (
      <div
        ref={ref}
        role="none"
        data-slot="button-group-separator"
        data-orientation={direction}
        className={cn(
          "relative z-10 shrink-0 self-stretch bg-input",
          "data-[orientation=vertical]:w-px data-[orientation=horizontal]:h-px",
          "data-[orientation=horizontal]:w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface ButtonGroupTextProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean | undefined;
}

/**
 * A piece of the group that is read rather than pressed — a unit, a currency,
 * a label. It wears the same box as the buttons beside it so the group reads
 * as one control.
 */
const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  function ButtonGroupText({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="button-group-text"
        className={cn(
          "flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium",
          "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    );
  },
);

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
