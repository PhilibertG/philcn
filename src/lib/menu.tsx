import type { VirtualElement } from "@floating-ui/react-dom";
import * as React from "react";

import type { Align, Side } from "./anchored.ts";
import { cn } from "./cn.ts";
import { CollectionProvider, useCollectionEntry, useListNavigation } from "./collection.tsx";
import { composeEventHandlers, composeRefs } from "./compose.ts";
import { Floating } from "./floating.tsx";
import { useControllableState } from "./use-controllable-state.ts";
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
  /**
   * Closes this menu and everything it hangs from. Choosing an entry in a
   * submenu puts the whole stack away, not just the panel it was in.
   * Left out by a menu that has nothing above it.
   */
  closeAll?: (() => void) | undefined;
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
  const { setOpen, closeAll } = useMenuRoot("MenuItem");
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const key = useId();

  useCollectionEntry(key, node, node?.textContent ?? "", disabled);

  const choose = React.useCallback(() => {
    if (disabled) return;
    // A real event, so a caller can call preventDefault to keep the menu up.
    const event = new CustomEvent("philcn.select", { cancelable: true, bubbles: false });
    onSelect?.(event);
    if (!closeOnSelect || event.defaultPrevented) return;
    if (closeAll !== undefined) closeAll();
    else setOpen(false);
  }, [disabled, onSelect, closeOnSelect, setOpen, closeAll]);

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

/* ---------------------------------------------------------------------------
 * Submenus
 *
 * A menu inside a menu. The panel below hangs from its own entry rather than
 * from the trigger that opened the whole thing, so it gets its own root: the
 * open state, the anchor and the entry point are all local. What it keeps
 * from above is the way out — choosing an entry closes the whole stack.
 * ------------------------------------------------------------------------ */

interface SubValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Open on hover, after a short wait. */
  openSoon: () => void;
  /** Close shortly, leaving time for the pointer to travel to the panel. */
  closeSoon: () => void;
  /** The pointer made it: stay open. */
  keepOpen: () => void;
  trigger: HTMLElement | null;
  setTrigger: (node: HTMLElement | null) => void;
  entryPoint: React.MutableRefObject<"first" | "last" | null>;
}

const SubContext = React.createContext<SubValue | null>(null);

function useSub(component: string): SubValue {
  const context = React.useContext(SubContext);
  if (context === null) throw new Error(`${component} must be used inside a submenu`);
  return context;
}

export interface MenuSubProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  children?: React.ReactNode;
}

export function MenuSub({ open, defaultOpen, onOpenChange, children }: MenuSubProps) {
  const parent = useMenuRoot("MenuSub");
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [trigger, setTrigger] = React.useState<HTMLElement | null>(null);
  const entryPoint = React.useRef<"first" | "last" | null>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const contentId = `${useId()}-subcontent`;

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  // The whole stack goes away when the menu above it does.
  const parentOpen = parent.open;
  React.useEffect(() => {
    if (!parentOpen) setIsOpen(false);
  }, [parentOpen, setIsOpen]);

  const sub = React.useMemo<SubValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => {
        window.clearTimeout(timer.current);
        setIsOpen(next);
      },
      openSoon: () => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setIsOpen(true), 100);
      },
      closeSoon: () => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setIsOpen(false), 150);
      },
      keepOpen: () => window.clearTimeout(timer.current),
      trigger,
      setTrigger,
      entryPoint,
    }),
    [isOpen, setIsOpen, trigger],
  );

  const root = React.useMemo<MenuRootValue>(
    () => ({
      open: sub.open,
      setOpen: sub.setOpen,
      anchor: trigger,
      contentId,
      entryPoint,
      slot: parent.slot,
      closeAll: () => {
        sub.setOpen(false);
        if (parent.closeAll !== undefined) parent.closeAll();
        else parent.setOpen(false);
      },
    }),
    [sub, trigger, contentId, parent],
  );

  return (
    <SubContext.Provider value={sub}>
      <MenuRootProvider value={root}>{children}</MenuRootProvider>
    </SubContext.Provider>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="ml-auto size-4" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export interface MenuSubTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role"> {
  disabled?: boolean | undefined;
  inset?: boolean | undefined;
}

export const MenuSubTrigger = React.forwardRef<HTMLDivElement, MenuSubTriggerProps>(
  function MenuSubTrigger(
    {
      className,
      children,
      disabled = false,
      inset,
      onClick,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      ...props
    },
    ref,
  ) {
    const { slot, contentId } = useMenuRoot("MenuSubTrigger");
    const sub = useSub("MenuSubTrigger");
    const [node, setNode] = React.useState<HTMLDivElement | null>(null);
    const key = useId();

    // The trigger belongs to the list above it: the arrows reach it like any
    // other entry, and it is that list's business, not the submenu's.
    useCollectionEntry(key, node, node?.textContent ?? "", disabled);

    const setRef = React.useMemo(
      () =>
        composeRefs<HTMLDivElement>(ref, setNode, sub.setTrigger as (n: HTMLDivElement | null) => void),
      [ref, sub.setTrigger],
    );

    const openWith = (from: "first" | "last" | null) => {
      if (disabled) return;
      sub.entryPoint.current = from;
      sub.setOpen(true);
    };

    return (
      <div
        ref={setRef}
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        aria-expanded={sub.open}
        aria-controls={sub.open ? contentId : undefined}
        data-slot={`${slot}-sub-trigger`}
        data-state={sub.open ? "open" : "closed"}
        data-inset={inset === true ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        aria-disabled={disabled || undefined}
        onClick={composeEventHandlers(onClick, () => openWith("first"))}
        onKeyDown={composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
          if (event.key !== "ArrowRight" && event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          openWith("first");
        })}
        // Hovering an entry that has a submenu opens it, as a menu bar does.
        onPointerEnter={composeEventHandlers(
          onPointerEnter as React.PointerEventHandler<HTMLDivElement> | undefined,
          (event: React.PointerEvent<HTMLDivElement>) => {
            if (disabled) return;
            event.currentTarget.focus();
            sub.entryPoint.current = null;
            sub.openSoon();
          },
        )}
        onPointerLeave={composeEventHandlers(
          onPointerLeave as React.PointerEventHandler<HTMLDivElement> | undefined,
          () => sub.closeSoon(),
        )}
        // Walking past with the arrows puts an open submenu away again.
        onFocus={composeEventHandlers(onFocus, () => {
          if (sub.open) return;
          sub.keepOpen();
        })}
        className={cn(
          itemClasses,
          "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          inset === true && "pl-8",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRightIcon />
      </div>
    );
  },
);

export type MenuSubContentProps = MenuListProps;

export const MenuSubContent = React.forwardRef<HTMLDivElement, MenuSubContentProps>(
  function MenuSubContent(
    { className, side = "right", align = "start", sideOffset = -4, alignOffset = -4, onKeyDown, ...props },
    ref,
  ) {
    const sub = useSub("MenuSubContent");

    return (
      <MenuList
        ref={ref}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        onPointerEnter={() => sub.keepOpen()}
        onPointerLeave={() => sub.closeSoon()}
        onKeyDown={composeEventHandlers(
          onKeyDown as React.KeyboardEventHandler<HTMLDivElement> | undefined,
          (event: React.KeyboardEvent<HTMLDivElement>) => {
            // Left goes back where it came from; Escape puts this panel away
            // without disturbing the menu it opened from.
            if (event.key !== "ArrowLeft" && event.key !== "Escape") return;
            event.preventDefault();
            event.stopPropagation();
            sub.setOpen(false);
            sub.trigger?.focus();
          },
        )}
        className={cn("min-w-[8rem]", className)}
        {...props}
      />
    );
  },
);
