"use client";

import type { VirtualElement } from "@floating-ui/react-dom";
import * as React from "react";

import { composeEventHandlers } from "../../lib/compose.ts";
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
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  useMenuRoot,
  type MenuCheckboxItemProps,
  type MenuItemBaseProps,
  type MenuListProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuRootValue,
  type MenuSubContentProps,
  type MenuSubProps,
  type MenuSubTriggerProps,
} from "../../lib/menu.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

/** A bare point on screen, which is what a right-click gives us to hang from. */
function pointAnchor(x: number, y: number): VirtualElement {
  return {
    getBoundingClientRect: () =>
      ({
        x,
        y,
        width: 0,
        height: 0,
        top: y,
        right: x,
        bottom: y,
        left: x,
        toJSON: () => ({}),
      }) as DOMRect,
  };
}

const OpenAtContext = React.createContext<((x: number, y: number) => void) | null>(null);

export interface ContextMenuProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  children?: React.ReactNode;
}

/**
 * The menu that appears where you right-click. It hangs from the pointer
 * rather than from an element, so there is nothing to align to — the
 * top-left corner of the menu goes where the click was.
 */
function ContextMenu({ open, defaultOpen, onOpenChange, children }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [anchor, setAnchor] = React.useState<VirtualElement | null>(null);
  const entryPoint = React.useRef<"first" | "last" | null>(null);
  const contentId = `${useId()}-content`;

  const openAt = React.useCallback(
    (x: number, y: number) => {
      setAnchor(pointAnchor(x, y));
      entryPoint.current = null;
      setIsOpen(true);
    },
    [setIsOpen],
  );

  const value = React.useMemo<MenuRootValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      anchor,
      contentId,
      entryPoint,
      slot: "context-menu",
    }),
    [isOpen, setIsOpen, anchor, contentId],
  );

  return (
    <OpenAtContext.Provider value={openAt}>
      <MenuRootProvider value={value}>{children}</MenuRootProvider>
    </OpenAtContext.Provider>
  );
}

export interface ContextMenuTriggerProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
  disabled?: boolean | undefined;
}

const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger(
    { asChild = false, render, disabled = false, onContextMenu, onKeyDown, ...props },
    ref,
  ) {
    const { open, contentId } = useMenuRoot("ContextMenuTrigger");
    const openAt = React.useContext(OpenAtContext);

    const shared = {
      "data-slot": "context-menu-trigger",
      "data-state": open ? "open" : "closed",
      "data-disabled": disabled ? "" : undefined,
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      onContextMenu: composeEventHandlers(onContextMenu, (event: React.MouseEvent) => {
        if (disabled) return;
        // Replace the browser's own menu with this one.
        event.preventDefault();
        openAt?.(event.clientX, event.clientY);
      }),
      // A keyboard has no right button. The dedicated menu key, and the
      // Shift+F10 that stands in for it, must reach the same menu.
      onKeyDown: composeEventHandlers(onKeyDown, (event: React.KeyboardEvent) => {
        if (disabled) return;
        const isMenuKey = event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
        if (!isMenuKey) return;
        event.preventDefault();
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        openAt?.(rect.left, rect.bottom);
      }),
      ...props,
    } as const;

    if (asChild || render !== undefined) {
      return <Slot ref={ref as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
    return <div ref={ref} {...shared} />;
  },
);

export type ContextMenuContentProps = MenuListProps;
export type ContextMenuItemProps = MenuItemBaseProps;
export type ContextMenuCheckboxItemProps = MenuCheckboxItemProps;
export type ContextMenuRadioGroupProps = MenuRadioGroupProps;
export type ContextMenuRadioItemProps = MenuRadioItemProps;
export type ContextMenuSubProps = MenuSubProps;
export type ContextMenuSubTriggerProps = MenuSubTriggerProps;
export type ContextMenuSubContentProps = MenuSubContentProps;

/** Hangs from the click itself, so there is no gap to leave. */
const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ sideOffset = 0, align = "start", ...props }, ref) {
    return <MenuList ref={ref} sideOffset={sideOffset} align={align} {...props} />;
  },
);

const ContextMenuItem = MenuItem;
const ContextMenuCheckboxItem = MenuCheckboxItem;
const ContextMenuRadioGroup = MenuRadioGroup;
const ContextMenuRadioItem = MenuRadioItem;
const ContextMenuLabel = MenuLabel;
const ContextMenuSeparator = MenuSeparator;
const ContextMenuShortcut = MenuShortcut;
const ContextMenuGroup = MenuGroup;
const ContextMenuSub = MenuSub;
const ContextMenuSubTrigger = MenuSubTrigger;
const ContextMenuSubContent = MenuSubContent;

/** Kept for API compatibility: the portal is already inside the content. */
function ContextMenuPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
