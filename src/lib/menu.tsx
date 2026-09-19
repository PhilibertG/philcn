import type { VirtualElement } from "@floating-ui/react-dom";
import * as React from "react";

import type { Align, Side } from "./anchored.ts";
import { cn } from "./cn.ts";
import { CollectionProvider, useCollectionEntry, useListNavigation } from "./collection.tsx";
import { composeEventHandlers, composeRefs } from "./compose.ts";
import { Floating } from "./floating.tsx";
import { useId } from "./use-id.ts";

/**
 * Everything a menu does once it is open, shared by the menu you click open
 * and the one you right-click open. They differ only in what triggers them
 * and what they hang from; the list, its keyboard handling and its entries
 * are the same, so they live here and a fix reaches both.
 */
export interface MenuRootValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLElement | VirtualElement | null;
  contentId: string;
  /** Which end to focus when the menu is opened from the keyboard. */
  entryPoint: React.MutableRefObject<"first" | "last" | null>;
  /** Names the pieces in the markup: "dropdown-menu", "context-menu"… */
  slot: string;
}

const MenuRootContext = React.createContext<MenuRootValue | null>(null);

export function useMenuRoot(component: string): MenuRootValue {
  const context = React.useContext(MenuRootContext);
  if (context === null) throw new Error(`${component} must be used inside a menu`);
  return context;
}

export function MenuRootProvider({
  value,
  children,
}: {
  value: MenuRootValue;
  children?: React.ReactNode;
}) {
  return <MenuRootContext.Provider value={value}>{children}</MenuRootContext.Provider>;
}

export interface MenuListProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  side?: Side | undefined;
  align?: Align | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  loop?: boolean | undefined;
  container?: Element | DocumentFragment | null | undefined;
}

/** The open menu itself. Must sit inside a collection to drive its entries. */
const MenuListInner = React.forwardRef<HTMLDivElement, MenuListProps>(function MenuListInner(
  { className, align = "start", sideOffset = 4, loop = true, onKeyDown, ...props },
  ref,
) {
  const { open, setOpen, anchor, contentId, entryPoint, slot } = useMenuRoot("MenuContent");
  const navigation = useListNavigation({ loop, orientation: "vertical" });
  const { focusFirst, focusLast } = navigation;

  return (
    <Floating
      ref={ref}
      id={contentId}
      slot={slot}
      role="menu"
      present={open}
      anchor={anchor}
      align={align}
      sideOffset={sideOffset}
      onDismiss={() => setOpen(false)}
      // Tab must leave the menu rather than walk through it.
      trapFocus={false}
      // Opened with an arrow: land on the end the arrow pointed at. Opened
      // with the mouse: leave the focus on the box, so the first arrow press
      // goes to the first entry rather than the second.
      onMountAutoFocus={(event) => {
        const from = entryPoint.current;
        entryPoint.current = null;
        if (from === null) return;
        event.preventDefault();
        if (from === "first") focusFirst();
        else focusLast();
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
        "data-[state=open]:animate-floating-in data-[state=closed]:animate-floating-out",
        className,
      )}
      {...props}
    />
  );
});

export const MenuList = React.forwardRef<HTMLDivElement, MenuListProps>(function MenuList(
  props,
  ref,
) {
  return (
    <CollectionProvider>
      <MenuListInner ref={ref} {...props} />
    </CollectionProvider>
  );
});

const itemClasses = cn(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
  "outline-none transition-colors",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
);

export interface MenuItemBaseProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "onSelect"> {
  disabled?: boolean | undefined;
  /** Called when the entry is chosen. Prevent the event to keep the menu open. */
  onSelect?: ((event: Event) => void) | undefined;
  /** Keep the menu open after choosing. A checkbox does this. */
  closeOnSelect?: boolean | undefined;
  inset?: boolean | undefined;
  variant?: "default" | "destructive" | undefined;
}

/** Registration, keyboard and choosing — shared by every kind of entry. */
function useMenuItem(
  role: string,
  { disabled = false, onSelect, closeOnSelect = true }: MenuItemBaseProps,
) {
  const { setOpen } = useMenuRoot("MenuItem");
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const key = useId();

  useCollectionEntry(key, node, node?.textContent ?? "", disabled);

  const choose = React.useCallback(() => {
    if (disabled) return;
    // A real event, so a caller can call preventDefault to keep the menu up.
    const event = new CustomEvent("philcn.select", { cancelable: true, bubbles: false });
    onSelect?.(event);
    if (closeOnSelect && !event.defaultPrevented) setOpen(false);
  }, [disabled, onSelect, closeOnSelect, setOpen]);

  return {
    setNode,
    choose,
    props: {
      role,
      // Every entry is reachable with the arrows, none with Tab.
      tabIndex: -1,
      "data-disabled": disabled ? "" : undefined,
      "aria-disabled": disabled || undefined,
    } as const,
  };
}

/** Enter and Space choose the focused entry. */
function chooseOnKey(choose: () => void) {
  return (event: React.KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    choose();
  };
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemBaseProps>(function MenuItem(
  {
    className,
    disabled,
    onSelect,
    closeOnSelect,
    inset,
    variant = "default",
    onClick,
    onKeyDown,
    ...props
  },
  ref,
) {
  const { slot } = useMenuRoot("MenuItem");
  const item = useMenuItem("menuitem", { disabled, onSelect, closeOnSelect });
  const setRef = React.useMemo(
    () => composeRefs<HTMLDivElement>(ref, item.setNode),
    [ref, item.setNode],
  );

  return (
    <div
      ref={setRef}
      data-slot={`${slot}-item`}
      data-inset={inset === true ? "" : undefined}
      data-variant={variant}
      className={cn(
        itemClasses,
        inset === true && "pl-8",
        variant === "destructive" &&
          "text-destructive focus:bg-destructive/10 focus:text-destructive dark:focus:bg-destructive/20",
        className,
      )}
      onClick={composeEventHandlers(onClick, item.choose)}
      onKeyDown={composeEventHandlers(onKeyDown, chooseOnKey(item.choose))}
      {...item.props}
      {...props}
    />
  );
});

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export interface MenuCheckboxItemProps extends MenuItemBaseProps {
  checked?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
}

export const MenuCheckboxItem = React.forwardRef<HTMLDivElement, MenuCheckboxItemProps>(
  function MenuCheckboxItem(
    {
      className,
      children,
      checked = false,
      onCheckedChange,
      disabled,
      onSelect,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const { slot } = useMenuRoot("MenuCheckboxItem");
    // Ticking a box leaves the menu open: several may be wanted.
    const item = useMenuItem("menuitemcheckbox", { disabled, onSelect, closeOnSelect: false });
    const setRef = React.useMemo(
      () => composeRefs<HTMLDivElement>(ref, item.setNode),
      [ref, item.setNode],
    );

    const toggle = () => {
      if (disabled === true) return;
      onCheckedChange?.(!checked);
      item.choose();
    };

    return (
      <div
        ref={setRef}
        data-slot={`${slot}-checkbox-item`}
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(itemClasses, "pl-8", className)}
        onClick={composeEventHandlers(onClick, toggle)}
        onKeyDown={composeEventHandlers(onKeyDown, chooseOnKey(toggle))}
        {...item.props}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          {checked ? <CheckIcon /> : null}
        </span>
        {children}
      </div>
    );
  },
);

interface RadioGroupValue {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
}

const RadioGroupContext = React.createContext<RadioGroupValue>({
  value: undefined,
  onValueChange: undefined,
});

export interface MenuRadioGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}

export function MenuRadioGroup({ value, onValueChange, ...props }: MenuRadioGroupProps) {
  const { slot } = useMenuRoot("MenuRadioGroup");
  const shared = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  return (
    <RadioGroupContext.Provider value={shared}>
      <div data-slot={`${slot}-radio-group`} role="group" {...props} />
    </RadioGroupContext.Provider>
  );
}

export interface MenuRadioItemProps extends MenuItemBaseProps {
  value: string;
}

export const MenuRadioItem = React.forwardRef<HTMLDivElement, MenuRadioItemProps>(
  function MenuRadioItem(
    { className, children, value, disabled, onSelect, onClick, onKeyDown, ...props },
    ref,
  ) {
    const { slot } = useMenuRoot("MenuRadioItem");
    const group = React.useContext(RadioGroupContext);
    const checked = group.value === value;
    const item = useMenuItem("menuitemradio", { disabled, onSelect, closeOnSelect: true });
    const setRef = React.useMemo(
      () => composeRefs<HTMLDivElement>(ref, item.setNode),
      [ref, item.setNode],
    );

    const pick = () => {
      if (disabled === true) return;
      group.onValueChange?.(value);
      item.choose();
    };

    return (
      <div
        ref={setRef}
        data-slot={`${slot}-radio-item`}
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(itemClasses, "pl-8", className)}
        onClick={composeEventHandlers(onClick, pick)}
        onKeyDown={composeEventHandlers(onKeyDown, chooseOnKey(pick))}
        {...item.props}
        {...props}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          {checked ? <span className="size-2 rounded-full bg-current" /> : null}
        </span>
        {children}
      </div>
    );
  },
);

export function MenuLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { inset?: boolean | undefined }) {
  const { slot } = useMenuRoot("MenuLabel");
  return (
    <div
      data-slot={`${slot}-label`}
      data-inset={inset === true ? "" : undefined}
      className={cn("px-2 py-1.5 text-sm font-medium", inset === true && "pl-8", className)}
      {...props}
    />
  );
}

export function MenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { slot } = useMenuRoot("MenuSeparator");
  return (
    <div
      data-slot={`${slot}-separator`}
      role="separator"
      aria-orientation="horizontal"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export function MenuShortcut({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  const { slot } = useMenuRoot("MenuShortcut");
  return (
    <span
      data-slot={`${slot}-shortcut`}
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

export function MenuGroup(props: React.ComponentPropsWithoutRef<"div">) {
  const { slot } = useMenuRoot("MenuGroup");
  return <div data-slot={`${slot}-group`} role="group" {...props} />;
}
