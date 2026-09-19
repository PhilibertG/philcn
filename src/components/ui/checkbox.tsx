import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { useControllableState } from "../../lib/use-controllable-state.ts";

/** A box can also be half-ticked: some of what it stands for is selected. */
export type CheckedState = boolean | "indeterminate";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "checked" | "defaultChecked" | "onChange"> {
  checked?: CheckedState | undefined;
  defaultChecked?: CheckedState | undefined;
  onCheckedChange?: ((checked: CheckedState) => void) | undefined;
  required?: boolean | undefined;
  /** Submits with the form under this name when ticked. */
  name?: string | undefined;
  value?: string | undefined;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    className,
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    required = false,
    name,
    value = "on",
    onClick,
    onKeyDown,
    ...props
  },
  ref,
) {
  const [state, setState] = useControllableState<CheckedState>({
    prop: checked,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
  });

  const current: CheckedState = state ?? false;
  const isChecked = current === true;

  const toggle = () => {
    if (disabled) return;
    // Half-ticked is a state a box is put into, never one it lands on by
    // being clicked: clicking it fills it in.
    setState(current === true ? false : true);
  };

  return (
    <>
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={current === "indeterminate" ? "mixed" : isChecked}
        aria-required={required || undefined}
        disabled={disabled}
        data-slot="checkbox"
        data-state={
          current === "indeterminate" ? "indeterminate" : isChecked ? "checked" : "unchecked"
        }
        data-disabled={disabled ? "" : undefined}
        onClick={composeEventHandlers(onClick, toggle)}
        // A button already answers to Space; Enter must not submit the form
        // from a checkbox, which is what a plain button would do.
        onKeyDown={composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
          if (event.key === "Enter") event.preventDefault();
        })}
        className={cn(
          "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs dark:bg-input/30",
          // deliberate divergence from shadcn: a clickable control shows a pointer
          "cursor-pointer",
          "transition-[color,background-color,border-color,box-shadow] duration-[160ms] ease-out",
          // ticked
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
          "data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary",
          "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
          "data-[state=indeterminate]:text-primary-foreground",
          // keyboard focus ring, never removed
          "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          // invalid and disabled
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          "dark:aria-invalid:ring-destructive/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span
          data-slot="checkbox-indicator"
          data-state={
            current === "indeterminate" ? "indeterminate" : isChecked ? "checked" : "unchecked"
          }
          className="flex items-center justify-center text-current"
        >
          {current === "indeterminate" ? <MinusIcon /> : isChecked ? <CheckIcon /> : null}
        </span>
      </button>
      {/* Named boxes take part in form submission. The real control is the
          button above; this one only carries the value to the form. */}
      {name === undefined ? null : (
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          required={required}
          disabled={disabled}
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
});

export { Checkbox };
