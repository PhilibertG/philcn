import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeRefs } from "../../lib/compose.ts";
import {
  mergeRovingFocusProps,
  RovingFocusGroup,
  useRovingFocusItem,
} from "../../lib/roving-focus.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { type VariantProps } from "../../lib/variants.ts";
import { toggleVariants } from "./toggle.tsx";

type ToggleVariants = VariantProps<typeof toggleVariants>;

interface ToggleGroupContextValue extends ToggleVariants {
  type: "single" | "multiple";
  isPressed: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled: boolean;
  rovingFocus: boolean;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext(component: string): ToggleGroupContextValue {
  const context = React.useContext(ToggleGroupContext);
  if (context === null) throw new Error(`${component} must be used inside <ToggleGroup>`);
  return context;
}

interface ToggleGroupSharedProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "dir">,
    ToggleVariants {
  disabled?: boolean | undefined;
  orientation?: "horizontal" | "vertical" | undefined;
  /** Tab reaches the group once and the arrows move inside it. */
  rovingFocus?: boolean | undefined;
  loop?: boolean | undefined;
}

export interface ToggleGroupSingleProps extends ToggleGroupSharedProps {
  type: "single";
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}

export interface ToggleGroupMultipleProps extends ToggleGroupSharedProps {
  type: "multiple";
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onValueChange?: ((value: string[]) => void) | undefined;
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  props,
  ref,
) {
  // The selection props are pulled out by name so they never reach the DOM,
  // and read back below through the shape that matches `type`.
  const {
    className,
    children,
    type,
    variant,
    size,
    disabled = false,
    orientation = "horizontal",
    rovingFocus = true,
    loop = true,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...rest
  } = props as ToggleGroupSharedProps & {
    type: "single" | "multiple";
    value?: string | string[] | undefined;
    defaultValue?: string | string[] | undefined;
    onValueChange?: ((value: never) => void) | undefined;
  };

  const single = type === "single" ? (props as ToggleGroupSingleProps) : undefined;
  const multiple = type === "multiple" ? (props as ToggleGroupMultipleProps) : undefined;

  const [pressedValues, setPressedValues] = useControllableState<string[]>({
    prop:
      single !== undefined
        ? single.value === undefined
          ? undefined
          : single.value === ""
            ? []
            : [single.value]
        : multiple?.value,
    defaultProp:
      single !== undefined
        ? single.defaultValue === undefined || single.defaultValue === ""
          ? []
          : [single.defaultValue]
        : (multiple?.defaultValue ?? []),
    onChange: (next) => {
      if (single !== undefined) single.onValueChange?.(next[0] ?? "");
      else multiple?.onValueChange?.(next);
    },
  });

  const pressed = pressedValues ?? [];
  const pressedKey = pressed.join(",");

  const context = React.useMemo<ToggleGroupContextValue>(
    () => ({
      type,
      variant,
      size,
      disabled,
      rovingFocus,
      isPressed: (value: string) => pressed.includes(value),
      toggle: (value: string) => {
        if (type === "single") {
          // A single group works like a set of radio buttons, except that
          // pressing the chosen one again clears the choice.
          setPressedValues(pressed.includes(value) ? [] : [value]);
          return;
        }
        setPressedValues(
          pressed.includes(value) ? pressed.filter((item) => item !== value) : [...pressed, value],
        );
      },
    }),
    [pressedKey, pressed, setPressedValues, type, variant, size, disabled, rovingFocus],
  );

  const shared = {
    ref,
    role: type === "single" ? "radiogroup" : "group",
    "aria-orientation": orientation,
    "data-slot": "toggle-group",
    "data-variant": variant,
    "data-size": size,
    "data-disabled": disabled ? "" : undefined,
    className: cn(
      "group/toggle-group flex w-fit items-center rounded-md",
      "data-[variant=outline]:shadow-xs",
      className,
    ),
    ...(rest as React.ComponentPropsWithoutRef<"div">),
  };

  return (
    <ToggleGroupContext.Provider value={context}>
      {rovingFocus ? (
        <RovingFocusGroup orientation={orientation} loop={loop}>
          <div {...shared}>{children}</div>
        </RovingFocusGroup>
      ) : (
        <div {...shared}>{children}</div>
      )}
    </ToggleGroupContext.Provider>
  );
});

export interface ToggleGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "value">,
    ToggleVariants {
  value: string;
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem(
    {
      className,
      children,
      value,
      variant,
      size,
      disabled = false,
      onClick,
      onKeyDown,
      onFocus,
      onMouseDown,
      ...props
    },
    ref,
  ) {
    const context = useToggleGroupContext("ToggleGroupItem");
    const isDisabled = disabled || context.disabled;
    const pressed = context.isPressed(value);
    const single = context.type === "single";

    const classes = cn(
      toggleVariants({
        variant: context.variant ?? variant,
        size: context.size ?? size,
      }),
      // squared off and joined up inside the group
      "min-w-0 flex-1 shrink-0 rounded-none shadow-none",
      "first:rounded-l-md last:rounded-r-md",
      // the focus ring must sit above the neighbouring buttons
      "focus:z-10 focus-visible:z-10",
      "data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
      className,
    );

    const shared = {
      type: "button" as const,
      role: single ? "radio" : undefined,
      "aria-checked": single ? pressed : undefined,
      "aria-pressed": single ? undefined : pressed,
      disabled: isDisabled,
      "data-slot": "toggle-group-item",
      "data-state": pressed ? "on" : "off",
      "data-variant": context.variant ?? variant,
      "data-size": context.size ?? size,
      "data-disabled": isDisabled ? "" : undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented && !isDisabled) context.toggle(value);
      },
      className: classes,
    };

    if (!context.rovingFocus) {
      return (
        <button
          ref={ref}
          {...shared}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onMouseDown={onMouseDown}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <RovingFocusItem
        ref={ref}
        disabled={isDisabled}
        active={pressed}
        label={typeof children === "string" ? children : ""}
        shared={shared}
        own={{ onKeyDown, onFocus, onMouseDown }}
        {...props}
      >
        {children}
      </RovingFocusItem>
    );
  },
);

/**
 * The roving focus hook can only be called inside a group, and an item may be
 * rendered without one. Keeping it in its own component means the hook is
 * never called conditionally.
 */
const RovingFocusItem = React.forwardRef<
  HTMLButtonElement,
  {
    disabled: boolean;
    active: boolean;
    label: string;
    shared: Record<string, unknown>;
    own: {
      onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement> | undefined;
      onFocus?: React.FocusEventHandler<HTMLButtonElement> | undefined;
      onMouseDown?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    };
    children?: React.ReactNode;
  } & React.ComponentPropsWithoutRef<"button">
>(function RovingFocusItem({ disabled, active, label, shared, own, children, ...props }, ref) {
  const item = useRovingFocusItem<HTMLButtonElement>({ disabled, active, label });
  const rovingProps = mergeRovingFocusProps(item, own);
  const setRef = React.useMemo(() => composeRefs<HTMLButtonElement>(ref, item.ref), [ref, item.ref]);

  return (
    <button ref={setRef} {...shared} {...rovingProps} {...props}>
      {children}
    </button>
  );
});

export { ToggleGroup, ToggleGroupItem };
