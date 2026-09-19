import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { useControllableState } from "../../lib/use-controllable-state.ts";

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "checked" | "defaultChecked" | "onChange"> {
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
  required?: boolean | undefined;
  /** Submits with the form under this name when switched on. */
  name?: string | undefined;
  value?: string | undefined;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
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
  const [state, setState] = useControllableState<boolean>({
    prop: checked,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
  });
  const on = state === true;

  return (
    <>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={on}
        aria-required={required || undefined}
        disabled={disabled}
        data-slot="switch"
        data-state={on ? "checked" : "unchecked"}
        data-disabled={disabled ? "" : undefined}
        onClick={composeEventHandlers(onClick, () => {
          if (disabled) return;
          setState(!on);
        })}
        // Enter must not submit the form from a switch.
        onKeyDown={composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
          if (event.key === "Enter") event.preventDefault();
        })}
        className={cn(
          "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center",
          "rounded-full border border-transparent shadow-xs",
          // deliberate divergence from shadcn: a clickable control shows a pointer
          "cursor-pointer",
          "transition-[color,background-color,border-color,box-shadow] duration-[160ms] ease-out",
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          "dark:data-[state=unchecked]:bg-input/80",
          // keyboard focus ring, never removed
          "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span
          data-slot="switch-thumb"
          data-state={on ? "checked" : "unchecked"}
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-background ring-0",
            "transition-transform duration-[160ms] ease-out",
            "data-[state=unchecked]:translate-x-0",
            "data-[state=checked]:translate-x-[calc(100%-2px)]",
            "dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
          )}
        />
      </button>
      {name === undefined ? null : (
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={on}
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

export { Switch };
