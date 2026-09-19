import * as React from "react";

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

  const value = React.useMemo<MenuRootValue & { setAnchor: typeof setAnchor }>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      anchor,
      setAnchor,
      contentId,
      entryPoint,
      slot: "dropdown-menu",
    }),
    [isOpen, setIsOpen, anchor, contentId],
  );

  return (
    <AnchorContext.Provider value={setAnchor}>
      <MenuRootProvider value={value}>{children}</MenuRootProvider>
    </AnchorContext.Provider>
  );
}

/** Lets the trigger hand its element to the root without widening the menu API. */
const AnchorContext = React.createContext<((node: HTMLElement | null) => void) | null>(null);

export interface DropdownMenuTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ asChild = false, render, onClick, onKeyDown, ...props }, ref) {
    const { open, setOpen, contentId, entryPoint } = useMenuRoot("DropdownMenuTrigger");
    const setAnchor = React.useContext(AnchorContext);

    const setRef = React.useMemo(
      () =>
        composeRefs<HTMLButtonElement>(
          ref,
          setAnchor as ((node: HTMLButtonElement | null) => void) | null ?? undefined,
        ),
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

export type DropdownMenuContentProps = MenuListProps;
export type DropdownMenuItemProps = MenuItemBaseProps;
export type DropdownMenuCheckboxItemProps = MenuCheckboxItemProps;
export type DropdownMenuRadioGroupProps = MenuRadioGroupProps;
export type DropdownMenuRadioItemProps = MenuRadioItemProps;
export type DropdownMenuSubProps = MenuSubProps;
export type DropdownMenuSubTriggerProps = MenuSubTriggerProps;
export type DropdownMenuSubContentProps = MenuSubContentProps;

const DropdownMenuContent = MenuList;
const DropdownMenuItem = MenuItem;
const DropdownMenuCheckboxItem = MenuCheckboxItem;
const DropdownMenuRadioGroup = MenuRadioGroup;
const DropdownMenuRadioItem = MenuRadioItem;
const DropdownMenuLabel = MenuLabel;
const DropdownMenuSeparator = MenuSeparator;
const DropdownMenuShortcut = MenuShortcut;
const DropdownMenuGroup = MenuGroup;
const DropdownMenuSub = MenuSub;
const DropdownMenuSubTrigger = MenuSubTrigger;
const DropdownMenuSubContent = MenuSubContent;

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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
