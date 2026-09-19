import * as React from "react";

import type { Align, Side } from "../../lib/anchored.ts";
import { cn } from "../../lib/cn.ts";
import { CollectionProvider, useCollectionEntry, useListNavigation } from "../../lib/collection.tsx";
import { composeEventHandlers, composeRefs } from "../../lib/compose.ts";
import { Floating } from "../../lib/floating.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLElement | null;
  setAnchor: (node: HTMLElement | null) => void;
  contentId: string;
  /** Which end to focus when the menu is opened from the keyboard. */
  entryPoint: React.MutableRefObject<"first" | "last" | null>;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenuContext(component: string): MenuContextValue {
  const context = React.useContext(MenuContext);
  if (context === null) throw new Error(`${component} must be used inside <DropdownMenu>`);
  return context;
}

export interface DropdownMenuProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  children?: React.ReactNode;
}

function DropdownMenu({ open, defaultOpen, onOpenChange, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const entryPoint = React.useRef<"first" | "last" | null>(null);
  const contentId = `${useId()}-content`;

  const value = React.useMemo<MenuContextValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      anchor,
      setAnchor,
      contentId,
      entryPoint,
    }),
    [isOpen, setIsOpen, anchor, contentId],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export interface DropdownMenuTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ asChild = false, render, onClick, onKeyDown, ...props }, ref) {
    const { open, setOpen, setAnchor, contentId, entryPoint } =
      useMenuContext("DropdownMenuTrigger");

    const setRef = React.useMemo(
      () =>
        composeRefs<HTMLButtonElement>(ref, setAnchor as (node: HTMLButtonElement | null) => void),
      [ref, setAnchor],
    );

    const shared = {
      "data-slot": "dropdown-menu-trigger",
      "data-state": open ? "open" : "closed",
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      onClick: composeEventHandlers(onClick, () => {
        entryPoint.current = null;
        setOpen(!open);
      }),
      // Opening with an arrow lands on the near end of the list, the way a
      // keyboard user expects.
      onKeyDown: composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
        if (open) return;
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        entryPoint.current = event.key === "ArrowDown" ? "first" : "last";
        setOpen(true);
      }),
      ...props,
    } as const;

    if (asChild || render !== undefined) {
      return <Slot ref={setRef as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
    return <button ref={setRef} type="button" {...shared} />;
  },
);

export interface DropdownMenuContentProps
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

/** Inside the collection, so it can drive the entries it contains. */
const DropdownMenuList = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuList(
    { className, align = "start", sideOffset = 4, loop = true, onKeyDown, ...props },
    ref,
  ) {
    const { open, setOpen, anchor, contentId, entryPoint } = useMenuContext("DropdownMenuContent");
    const navigation = useListNavigation({ loop, orientation: "vertical" });
    const { focusFirst, focusLast } = navigation;

    return (
      <Floating
        ref={ref}
        id={contentId}
        slot="dropdown-menu"
        role="menu"
        present={open}
        anchor={anchor}
        align={align}
        sideOffset={sideOffset}
        onDismiss={() => setOpen(false)}
        // Tab must leave the menu rather than walk through it.
        trapFocus={false}
        // Opened with an arrow: land on the end the arrow pointed at. Opened
        // with the mouse: leave the focus on the box, so the first arrow
        // press goes to the first entry rather than the second.
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
  },
);

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(props, ref) {
    return (
      <CollectionProvider>
        <DropdownMenuList ref={ref} {...props} />
      </CollectionProvider>
    );
  },
);

const itemClasses = cn(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
  "outline-none transition-colors",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
);

interface ItemBaseProps extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "onSelect"> {
  disabled?: boolean | undefined;
  /** Called when the entry is chosen. Prevent the event to keep the menu open. */
  onSelect?: ((event: Event) => void) | undefined;
  /** Keep the menu open after choosing. A checkbox does this. */
  closeOnSelect?: boolean | undefined;
  inset?: boolean | undefined;
  variant?: "default" | "destructive" | undefined;
}

/** Shared behaviour of every kind of entry: registration, keyboard, choosing. */
function useMenuItem(
  role: string,
  { disabled = false, onSelect, closeOnSelect = true }: ItemBaseProps,
) {
  const { setOpen } = useMenuContext("DropdownMenuItem");
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

export interface DropdownMenuItemProps extends ItemBaseProps {}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { className, disabled, onSelect, closeOnSelect, inset, variant = "default", onClick, onKeyDown, ...props },
    ref,
  ) {
    const item = useMenuItem("menuitem", { disabled, onSelect, closeOnSelect });
    const setRef = React.useMemo(
      () => composeRefs<HTMLDivElement>(ref, item.setNode),
      [ref, item.setNode],
    );

    return (
      <div
        ref={setRef}
        data-slot="dropdown-menu-item"
        data-inset={inset ? "" : undefined}
        data-variant={variant}
        className={cn(
          itemClasses,
          inset === true && "pl-8",
          variant === "destructive" &&
            "text-destructive focus:bg-destructive/10 focus:text-destructive dark:focus:bg-destructive/20",
          className,
        )}
        onClick={composeEventHandlers(onClick, item.choose)}
        onKeyDown={composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          item.choose();
        })}
        {...item.props}
        {...props}
      />
    );
  },
);

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export interface DropdownMenuCheckboxItemProps extends ItemBaseProps {
  checked?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem(
    { className, children, checked = false, onCheckedChange, disabled, onSelect, onClick, onKeyDown, ...props },
    ref,
  ) {
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
        data-slot="dropdown-menu-checkbox-item"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(itemClasses, "pl-8", className)}
        onClick={composeEventHandlers(onClick, toggle)}
        onKeyDown={composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          toggle();
        })}
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

export interface DropdownMenuRadioGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}

function DropdownMenuRadioGroup({
  value,
  onValueChange,
  ...props
}: DropdownMenuRadioGroupProps) {
  const shared = React.useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  return (
    <RadioGroupContext.Provider value={shared}>
      <div data-slot="dropdown-menu-radio-group" role="group" {...props} />
    </RadioGroupContext.Provider>
  );
}

export interface DropdownMenuRadioItemProps extends ItemBaseProps {
  value: string;
}

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem(
    { className, children, value, disabled, onSelect, onClick, onKeyDown, ...props },
    ref,
  ) {
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
        data-slot="dropdown-menu-radio-item"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn(itemClasses, "pl-8", className)}
        onClick={composeEventHandlers(onClick, pick)}
        onKeyDown={composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          pick();
        })}
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

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { inset?: boolean | undefined }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset === true ? "" : undefined}
      className={cn("px-2 py-1.5 text-sm font-medium", inset === true && "pl-8", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      role="separator"
      aria-orientation="horizontal"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

function DropdownMenuGroup(props: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="dropdown-menu-group" role="group" {...props} />;
}

/** Kept for API compatibility: the portal is already inside the content. */
function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
};
