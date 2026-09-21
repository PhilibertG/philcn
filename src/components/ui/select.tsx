"use client";

import * as React from "react";

import type { Align, Side } from "../../lib/anchored.ts";
import { cn } from "../../lib/cn.ts";
import { CollectionProvider, useCollectionEntry, useListNavigation } from "../../lib/collection.tsx";
import { composeEventHandlers, composeRefs } from "../../lib/compose.ts";
import { Floating } from "../../lib/floating.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | undefined;
  setValue: (value: string) => void;
  anchor: HTMLElement | null;
  setAnchor: (node: HTMLElement | null) => void;
  disabled: boolean;
  contentId: string;
  triggerId: string;
  /** What each value reads as, so the trigger can show the chosen one. */
  registerLabel: (value: string, label: string) => void;
  labelFor: (value: string) => string | undefined;
  /** Bumped whenever a label is learned, so the trigger re-reads it. */
  labelVersion: number;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(component: string): SelectContextValue {
  const context = React.useContext(SelectContext);
  if (context === null) throw new Error(`${component} must be used inside <Select>`);
  return context;
}

export interface SelectProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  children?: React.ReactNode;
}

function Select({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled = false,
  children,
}: SelectProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [current, setCurrent] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [labelVersion, setLabelVersion] = React.useState(0);
  const labels = React.useRef(new Map<string, string>());

  const baseId = useId();

  const registerLabel = React.useCallback((itemValue: string, label: string) => {
    if (labels.current.get(itemValue) === label) return;
    labels.current.set(itemValue, label);
    // The trigger shows a label it did not render; tell it one arrived.
    setLabelVersion((version) => version + 1);
  }, []);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      value: current,
      setValue: (next: string) => {
        setCurrent(next);
        setIsOpen(false);
      },
      anchor,
      setAnchor,
      disabled,
      contentId: `${baseId}-content`,
      triggerId: `${baseId}-trigger`,
      registerLabel,
      labelFor: (itemValue: string) => labels.current.get(itemValue),
      labelVersion,
    }),
    [isOpen, setIsOpen, current, setCurrent, anchor, disabled, baseId, registerLabel, labelVersion],
  );

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4 opacity-50" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  size?: "sm" | "default" | undefined;
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(
    { className, children, size = "default", asChild = false, render, onClick, onKeyDown, ...props },
    ref,
  ) {
    const { open, setOpen, setAnchor, disabled, contentId, triggerId, value } =
      useSelectContext("SelectTrigger");

    const setRef = React.useMemo(
      () =>
        composeRefs<HTMLButtonElement>(ref, setAnchor as (node: HTMLButtonElement | null) => void),
      [ref, setAnchor],
    );

    const shared = {
      id: triggerId,
      "data-slot": "select-trigger",
      "data-size": size,
      "data-state": open ? "open" : "closed",
      "data-placeholder": value === undefined ? "" : undefined,
      // A select is a combobox: a control that reveals a list of options.
      role: "combobox",
      "aria-haspopup": "listbox",
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      disabled,
      onClick: composeEventHandlers(onClick, () => setOpen(!open)),
      onKeyDown: composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
        if (open) return;
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter" && event.key !== " ") {
          return;
        }
        event.preventDefault();
        setOpen(true);
      }),
      className: cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent",
        "px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none",
        "transition-[color,border-color,box-shadow] dark:bg-input/30 dark:hover:bg-input/50",
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        "data-[placeholder]:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "cursor-pointer *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      ),
      children: (
        <>
          {children}
          <ChevronIcon />
        </>
      ),
      ...props,
    } as const;

    if (asChild || render !== undefined) {
      return <Slot ref={setRef as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
    return <button ref={setRef} type="button" {...shared} />;
  },
);

export interface SelectValueProps extends React.ComponentPropsWithoutRef<"span"> {
  placeholder?: React.ReactNode;
}

/** Shows the chosen option's own text, or the placeholder when nothing is chosen. */
function SelectValue({ className, placeholder, ...props }: SelectValueProps) {
  const { value, labelFor } = useSelectContext("SelectValue");
  const label = value === undefined ? undefined : labelFor(value);

  return (
    <span data-slot="select-value" className={cn("truncate", className)} {...props}>
      {label ?? (value === undefined ? placeholder : value)}
    </span>
  );
}

export interface SelectContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  side?: Side | undefined;
  align?: Align | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  /** Kept for API compatibility; philcn always places the list beside the trigger. */
  position?: "popper" | "item-aligned" | undefined;
  container?: Element | DocumentFragment | null | undefined;
}

const SelectList = React.forwardRef<HTMLDivElement, SelectContentProps>(function SelectList(
  { className, align = "start", sideOffset = 4, onKeyDown, position: _position, children, ...props },
  ref,
) {
  const { open, setOpen, anchor, contentId, triggerId, value, labelFor } =
    useSelectContext("SelectContent");
  const navigation = useListNavigation({ orientation: "vertical" });
  const [list, setList] = React.useState<HTMLDivElement | null>(null);
  const setRef = React.useMemo(() => composeRefs<HTMLDivElement>(ref, setList), [ref]);

  // A list that has never been opened has no options on screen, so nothing
  // knows what "blueberry" reads as and the control would show the raw value.
  // Mounting the options out of sight lets each one say its own name. It is
  // dropped the moment the name is known, and never exists while open.
  const nameStillUnknown = !open && value !== undefined && labelFor(value) === undefined;

  return (
    <>
      {nameStillUnknown ? (
        <div hidden aria-hidden="true" data-slot="select-name-probe">
          {children}
        </div>
      ) : null}
      <Floating
        ref={setRef}
      id={contentId}
      slot="select"
      role="listbox"
      aria-labelledby={triggerId}
      present={open}
      anchor={anchor}
      align={align}
      sideOffset={sideOffset}
      // The list is never narrower than the control that opened it.
      matchAnchorWidth
      onDismiss={() => setOpen(false)}
      trapFocus={false}
      // Open on what is already chosen, so a keyboard user starts where they
      // left off rather than at the top of a long list.
      onMountAutoFocus={(event) => {
        if (value === undefined || list === null) return;
        // Scoped to this list: another select on the page may hold the same
        // value, and so may the hidden copy used to learn the names.
        const chosen = list.querySelector<HTMLElement>(
          `[data-slot="select-item"][data-value="${CSS.escape(value)}"]`,
        );
        if (chosen === null) return;
        event.preventDefault();
        chosen.focus({ preventScroll: false });
      }}
      onKeyDown={composeEventHandlers(
        onKeyDown as React.KeyboardEventHandler<HTMLDivElement> | undefined,
        (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Tab") {
            setOpen(false);
            return;
          }
          navigation.onKeyDown(event);
        },
      )}
      className={cn(
        "min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1",
        "max-h-[var(--philcn-available-height)] text-popover-foreground shadow-md outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=closed]:fill-mode-forwards",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      >
        {children}
      </Floating>
    </>
  );
});

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props, ref) {
    return (
      <CollectionProvider>
        <SelectList ref={ref} {...props} />
      </CollectionProvider>
    );
  },
);

export interface SelectItemProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "onSelect"> {
  value: string;
  disabled?: boolean | undefined;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, value, disabled = false, onClick, onKeyDown, ...props },
  ref,
) {
  const { value: chosen, setValue, registerLabel } = useSelectContext("SelectItem");
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const key = useId();
  const selected = chosen === value;

  const label = node?.textContent ?? "";
  useCollectionEntry(key, node, label, disabled);

  // The trigger has to show this option's text without rendering it.
  React.useEffect(() => {
    if (label === "") return;
    registerLabel(value, label);
  }, [value, label, registerLabel]);

  const setRef = React.useMemo(() => composeRefs<HTMLDivElement>(ref, setNode), [ref]);

  const pick = () => {
    if (disabled) return;
    setValue(value);
  };

  return (
    <div
      ref={setRef}
      data-slot="select-item"
      data-value={value}
      data-state={selected ? "checked" : "unchecked"}
      data-disabled={disabled ? "" : undefined}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      // Reachable with the arrows, never with Tab.
      tabIndex={-1}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm",
        "outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      onClick={composeEventHandlers(onClick, pick)}
      onKeyDown={composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        pick();
      })}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {selected ? <CheckIcon /> : null}
      </span>
      {children}
    </div>
  );
});

function SelectGroup(props: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="select-group" role="group" {...props} />;
}

function SelectLabel({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectSeparator({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="select-separator"
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/**
 * Kept for API compatibility. The list scrolls on its own and is never taller
 * than the space left on screen, so there is nothing for these to do.
 */
function SelectScrollUpButton(_props: React.ComponentPropsWithoutRef<"div">) {
  return null;
}

function SelectScrollDownButton(_props: React.ComponentPropsWithoutRef<"div">) {
  return null;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
