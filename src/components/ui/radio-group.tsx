"use client";

import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeRefs } from "../../lib/compose.ts";
import {
  mergeRovingFocusProps,
  RovingFocusGroup,
  useRovingFocusItem,
} from "../../lib/roving-focus.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";

interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  disabled: boolean;
  required: boolean;
  name: string | undefined;
  /**
   * A radio is checked as soon as the arrow keys reach it, but tabbing into
   * the group must leave the selection alone. This says which of the two
   * moved the focus.
   */
  arrowPressed: React.MutableRefObject<boolean>;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(component: string): RadioGroupContextValue {
  const context = React.useContext(RadioGroupContext);
  if (context === null) throw new Error(`${component} must be used inside <RadioGroup>`);
  return context;
}

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue" | "dir"> {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  /** Submits the chosen value under this name when the group is inside a form. */
  name?: string | undefined;
  orientation?: "horizontal" | "vertical" | undefined;
  loop?: boolean | undefined;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    className,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    required = false,
    name,
    orientation = "vertical",
    loop = true,
    onKeyDownCapture,
    onKeyUpCapture,
    ...props
  },
  ref,
) {
  const [selected, setSelected] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const arrowPressed = React.useRef(false);

  const context = React.useMemo<RadioGroupContextValue>(
    () => ({
      value: selected,
      setValue: (next: string) => setSelected(next),
      disabled,
      required,
      name,
      arrowPressed,
    }),
    [selected, setSelected, disabled, required, name],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <RovingFocusGroup orientation={orientation} loop={loop}>
        <div
          ref={ref}
          role="radiogroup"
          aria-required={required || undefined}
          aria-orientation={orientation}
          data-slot="radio-group"
          data-disabled={disabled ? "" : undefined}
          // Captured on the way down, before the focused radio handles the
          // key and moves the focus: the radio it lands on reads this flag
          // from its own focus handler, which runs in between.
          onKeyDownCapture={(event) => {
            onKeyDownCapture?.(event);
            if (event.key.startsWith("Arrow")) arrowPressed.current = true;
          }}
          onKeyUpCapture={(event) => {
            onKeyUpCapture?.(event);
            arrowPressed.current = false;
          }}
          className={cn("grid gap-3", className)}
          {...props}
        />
      </RovingFocusGroup>
    </RadioGroupContext.Provider>
  );
});

function CircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export interface RadioGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "value"> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem(
    { className, value, disabled = false, onClick, onKeyDown, onFocus, onMouseDown, ...props },
    ref,
  ) {
    const {
      value: selected,
      setValue,
      disabled: groupDisabled,
      required,
      name,
      arrowPressed,
    } = useRadioGroupContext("RadioGroupItem");

    const isDisabled = disabled || groupDisabled;
    const checked = selected === value;

    const item = useRovingFocusItem<HTMLButtonElement>({ disabled: isDisabled, active: checked });

    const rovingProps = mergeRovingFocusProps(item, {
      onKeyDown,
      onMouseDown,
      onFocus: (event) => {
        onFocus?.(event);
        // Reaching a radio with the arrow keys chooses it; arriving with Tab
        // only moves the focus.
        if (!event.defaultPrevented && arrowPressed.current && !isDisabled) setValue(value);
      },
    });

    const setRef = React.useMemo(
      () => composeRefs<HTMLButtonElement>(ref, item.ref),
      [ref, item.ref],
    );

    return (
      <>
        <button
          ref={setRef}
          type="button"
          role="radio"
          aria-checked={checked}
          disabled={isDisabled}
          data-slot="radio-group-item"
          data-state={checked ? "checked" : "unchecked"}
          data-disabled={isDisabled ? "" : undefined}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented && !isDisabled) setValue(value);
          }}
          className={cn(
            // shape
            "aspect-square size-4 shrink-0 rounded-full border border-input shadow-xs",
            "text-primary dark:bg-input/30",
            // deliberate divergence from shadcn: a clickable control shows a pointer
            "cursor-pointer",
            "transition-[color,background-color,border-color,box-shadow] duration-[160ms] ease-out",
            // keyboard focus ring, never removed
            "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            // invalid and disabled
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
            "dark:aria-invalid:ring-destructive/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...rovingProps}
          {...props}
        >
          {checked ? (
            <span
              data-slot="radio-group-indicator"
              data-state="checked"
              className="relative flex items-center justify-center"
            >
              <CircleIcon className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
            </span>
          ) : null}
        </button>
        {/* Named groups take part in form submission. The real radio is the
            button above; this one only carries the value to the form. */}
        {name === undefined ? null : (
          <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            required={required}
            disabled={isDisabled}
            tabIndex={-1}
            aria-hidden="true"
            readOnly
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              margin: 0,
              padding: 0,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        )}
      </>
    );
  },
);

export { RadioGroup, RadioGroupItem };
