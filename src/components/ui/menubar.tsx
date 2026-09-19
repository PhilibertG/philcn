import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers, composeRefs } from "../../lib/compose.ts";
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuList,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRootProvider,
  MenuSeparator,
  MenuShortcut,
  useMenuRoot,
  type MenuCheckboxItemProps,
  type MenuItemBaseProps,
  type MenuListProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuRootValue,
} from "../../lib/menu.tsx";
import {
  mergeRovingFocusProps,
  RovingFocusGroup,
  useRovingFocusItem,
} from "../../lib/roving-focus.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

interface MenubarContextValue {
  /** The menu that is open, by value. `null` when the bar is at rest. */
  openValue: string | null;
  setOpenValue: (value: string | null) => void;
  /** Which end of the list to focus when a menu opens from the keyboard. */
  entryPoint: React.MutableRefObject<"first" | "last" | null>;
  /** Every trigger, so the bar can walk from one menu to the next. */
  triggers: React.MutableRefObject<Map<string, HTMLElement>>;
  /** Opens the menu before or after the open one, in the order they appear. */
  moveMenu: (step: 1 | -1) => void;
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null);

function useMenubarContext(component: string): MenubarContextValue {
  const context = React.useContext(MenubarContext);
  if (context === null) throw new Error(`${component} must be used inside <Menubar>`);
  return context;
}

/** The value of the menu a trigger or a panel belongs to. */
const MenuValueContext = React.createContext<string | null>(null);

/** Lets a trigger hand its element to its menu without widening the menu API. */
const AnchorContext = React.createContext<((node: HTMLElement | null) => void) | null>(null);

export interface MenubarProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  loop?: boolean | undefined;
}

const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(function Menubar(
  { className, value, defaultValue, onValueChange, loop = true, ...props },
  ref,
) {
  const [openValue, setOpenValue] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue ?? "",
    onChange: onValueChange,
  });

  const entryPoint = React.useRef<"first" | "last" | null>(null);
  const triggers = React.useRef(new Map<string, HTMLElement>());

  const context = React.useMemo<MenubarContextValue>(() => {
    const setOpen = (next: string | null) => setOpenValue(next ?? "");

    return {
      openValue: openValue === undefined || openValue === "" ? null : openValue,
      setOpenValue: setOpen,
      entryPoint,
      triggers,
      moveMenu: (step) => {
        // Read the triggers in the order they appear on screen, not the order
        // they registered in: a menu can be added or moved at any time.
        const entries = [...triggers.current.entries()]
          .filter(([, node]) => node.isConnected)
          .sort(([, a], [, b]) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          );
        if (entries.length === 0) return;

        const current = entries.findIndex(([key]) => key === openValue);
        const next = (current + step + entries.length) % entries.length;
        const target = entries[next];
        if (target === undefined) return;
        entryPoint.current = null;
        setOpen(target[0]);
      },
    };
  }, [openValue, setOpenValue]);

  return (
    <MenubarContext.Provider value={context}>
      <RovingFocusGroup orientation="horizontal" loop={loop}>
        <div
          ref={ref}
          role="menubar"
          data-slot="menubar"
          className={cn(
            "flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs",
            className,
          )}
          {...props}
        />
      </RovingFocusGroup>
    </MenubarContext.Provider>
  );
});

export interface MenubarMenuProps {
  /** Names this menu, so the open one can be driven from outside. */
  value?: string | undefined;
  children?: React.ReactNode;
}

function MenubarMenu({ value, children }: MenubarMenuProps) {
  const menubar = useMenubarContext("MenubarMenu");
  const baseId = useId();
  const menuValue = value ?? baseId;
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const root = React.useMemo<MenuRootValue>(
    () => ({
      open: menubar.openValue === menuValue,
      setOpen: (next: boolean) => menubar.setOpenValue(next ? menuValue : null),
      anchor,
      contentId: `${baseId}-content`,
      entryPoint: menubar.entryPoint,
      slot: "menubar",
    }),
    [menubar, menuValue, anchor, baseId],
  );

  return (
    <MenuValueContext.Provider value={menuValue}>
      <AnchorContext.Provider value={setAnchor}>
        <MenuRootProvider value={root}>{children}</MenuRootProvider>
      </AnchorContext.Provider>
    </MenuValueContext.Provider>
  );
}

export interface MenubarTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const MenubarTrigger = React.forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  function MenubarTrigger(
    {
      className,
      asChild = false,
      render,
      disabled = false,
      children,
      onClick,
      onKeyDown,
      onFocus,
      onMouseDown,
      onPointerEnter,
      ...props
    },
    ref,
  ) {
    const menubar = useMenubarContext("MenubarTrigger");
    const { open, setOpen, contentId, entryPoint } = useMenuRoot("MenubarTrigger");
    const menuValue = React.useContext(MenuValueContext);
    const setAnchor = React.useContext(AnchorContext);

    const item = useRovingFocusItem<HTMLButtonElement>({
      disabled,
      active: open,
      label: typeof children === "string" ? children : "",
    });

    // The bar needs to know where each menu sits to walk from one to the next.
    const register = React.useCallback(
      (node: HTMLButtonElement | null) => {
        if (menuValue === null) return;
        if (node === null) menubar.triggers.current.delete(menuValue);
        else menubar.triggers.current.set(menuValue, node);
      },
      [menubar.triggers, menuValue],
    );

    const setRef = React.useMemo(
      () =>
        composeRefs<HTMLButtonElement>(
          ref,
          item.ref,
          register,
          setAnchor as ((node: HTMLButtonElement | null) => void) | undefined,
        ),
      [ref, item.ref, register, setAnchor],
    );

    const rovingProps = mergeRovingFocusProps(item, { onKeyDown, onFocus, onMouseDown });

    const shared = {
      "data-slot": "menubar-trigger",
      "data-state": open ? "open" : "closed",
      role: "menuitem" as const,
      "aria-haspopup": "menu" as const,
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      disabled,
      onClick: composeEventHandlers(onClick, () => {
        entryPoint.current = null;
        setOpen(!open);
      }),
      // Once one menu is open, the bar follows the pointer: moving across the
      // triggers swaps menus without a click, the way a desktop menu bar does.
      onPointerEnter: composeEventHandlers(
        onPointerEnter as React.PointerEventHandler<HTMLButtonElement> | undefined,
        (event: React.PointerEvent<HTMLButtonElement>) => {
          if (disabled || menubar.openValue === null || open) return;
          entryPoint.current = null;
          setOpen(true);
          event.currentTarget.focus();
        },
      ),
      className: cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium select-none",
        // deliberate divergence from shadcn: a clickable control shows a pointer
        "cursor-pointer",
        "transition-[color,background-color] duration-[160ms] ease-out",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      ),
      ...rovingProps,
      // Opening with an arrow lands on the near end of the list, the way a
      // keyboard user expects.
      onKeyDown: composeEventHandlers(
        rovingProps.onKeyDown,
        (event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (open) return;
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          entryPoint.current = event.key === "ArrowDown" ? "first" : "last";
          setOpen(true);
        },
      ),
      ...props,
    };

    if (asChild || render !== undefined) {
      return (
        <Slot ref={setRef as React.Ref<HTMLElement>} render={render} {...shared}>
          {children}
        </Slot>
      );
    }
    return (
      <button ref={setRef} type="button" {...shared}>
        {children}
      </button>
    );
  },
);

export type MenubarContentProps = MenuListProps;

const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  function MenubarContent(
    { className, align = "start", alignOffset = -4, sideOffset = 8, onKeyDown, ...props },
    ref,
  ) {
    const menubar = useMenubarContext("MenubarContent");

    return (
      <MenuList
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        // Left and right walk the bar while a menu is open; up and down stay
        // with the list, which handles them itself.
        onKeyDown={composeEventHandlers(
          onKeyDown as React.KeyboardEventHandler<HTMLDivElement> | undefined,
          (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            menubar.moveMenu(event.key === "ArrowRight" ? 1 : -1);
          },
        )}
        className={cn("min-w-[12rem]", className)}
        {...props}
      />
    );
  },
);

export type MenubarItemProps = MenuItemBaseProps;
export type MenubarCheckboxItemProps = MenuCheckboxItemProps;
export type MenubarRadioGroupProps = MenuRadioGroupProps;
export type MenubarRadioItemProps = MenuRadioItemProps;

const MenubarItem = MenuItem;
const MenubarCheckboxItem = MenuCheckboxItem;
const MenubarRadioGroup = MenuRadioGroup;
const MenubarRadioItem = MenuRadioItem;
const MenubarLabel = MenuLabel;
const MenubarSeparator = MenuSeparator;
const MenubarShortcut = MenuShortcut;
const MenubarGroup = MenuGroup;

/** Kept for API compatibility: the portal is already inside the content. */
function MenubarPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
};
