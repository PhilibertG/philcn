import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { variants, type VariantProps } from "../../lib/variants.ts";

const toggleVariants = variants(
  [
    // layout
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    // deliberate divergence from shadcn: a clickable control shows a pointer
    "cursor-pointer",
    "transition-[color,background-color,border-color,box-shadow] duration-[160ms] ease-out",
    "hover:bg-muted hover:text-muted-foreground",
    // pressed
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    // keyboard focus ring, never removed
    "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    // invalid and disabled
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "dark:aria-invalid:ring-destructive/40",
    "disabled:pointer-events-none disabled:opacity-50",
    // icons sized and inert unless the caller says otherwise
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: [
          "border border-input bg-transparent shadow-xs",
          "hover:bg-accent hover:text-accent-foreground",
        ],
      },
      size: {
        default: "h-9 min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ToggleProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange">,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean | undefined;
  defaultPressed?: boolean | undefined;
  onPressedChange?: ((pressed: boolean) => void) | undefined;
  /** Render the child element instead of a `<button>`, keeping these styles. */
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    className,
    variant,
    size,
    pressed,
    defaultPressed,
    onPressedChange,
    asChild = false,
    render,
    onClick,
    ...props
  },
  ref,
) {
  const [isPressed, setPressed] = useControllableState<boolean>({
    prop: pressed,
    defaultProp: defaultPressed ?? false,
    onChange: onPressedChange,
  });
  const on = isPressed === true;

  const shared = {
    "data-slot": "toggle",
    "data-state": on ? "on" : "off",
    "aria-pressed": on,
    "data-disabled": props.disabled === true ? "" : undefined,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) setPressed(!on);
    },
    className: cn(toggleVariants({ variant, size, className })),
    ...props,
  };

  if (asChild || render !== undefined) {
    return <Slot ref={ref as React.Ref<HTMLElement>} render={render} {...shared} />;
  }
  return <button ref={ref} type="button" {...shared} />;
});

export { Toggle, toggleVariants };
