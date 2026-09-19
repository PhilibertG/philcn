import * as React from "react";

import type { Align, Side } from "../../lib/anchored.ts";
import { cn } from "../../lib/cn.ts";
import { composeRefs } from "../../lib/compose.ts";
import { Floating } from "../../lib/floating.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useHoverOpen } from "../../lib/use-hover-open.ts";
import { useId } from "../../lib/use-id.ts";

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLElement | null;
  setAnchor: (node: HTMLElement | null) => void;
  contentId: string;
  triggerHandlers: ReturnType<typeof useHoverOpen>["triggerHandlers"];
  contentHandlers: ReturnType<typeof useHoverOpen>["contentHandlers"];
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

function useHoverCardContext(component: string): HoverCardContextValue {
  const context = React.useContext(HoverCardContext);
  if (context === null) throw new Error(`${component} must be used inside <HoverCard>`);
  return context;
}

export interface HoverCardProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  openDelay?: number | undefined;
  closeDelay?: number | undefined;
  children?: React.ReactNode;
}

/**
 * A card that appears when the pointer rests on a link — a profile preview,
 * say. Unlike a tooltip it can hold real content, so the pointer is given
 * time to travel into it.
 */
function HoverCard({
  open,
  defaultOpen,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  children,
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const contentId = `${useId()}-content`;

  const { triggerHandlers, contentHandlers, closeNow } = useHoverOpen({
    openDelay,
    closeDelay,
    onOpenChange: (next) => setIsOpen(next),
    // A hover card holds links and buttons; opening it on every tab stop
    // would get in the way.
    openOnFocus: false,
  });

  const value = React.useMemo<HoverCardContextValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => {
        if (next) setIsOpen(true);
        else closeNow();
      },
      anchor,
      setAnchor,
      contentId,
      triggerHandlers,
      contentHandlers,
    }),
    [isOpen, setIsOpen, closeNow, anchor, contentId, triggerHandlers, contentHandlers],
  );

  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>;
}

export interface HoverCardTriggerProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const HoverCardTrigger = React.forwardRef<HTMLAnchorElement, HoverCardTriggerProps>(
  function HoverCardTrigger({ asChild = false, render, ...props }, ref) {
    const { open, setAnchor, triggerHandlers } = useHoverCardContext("HoverCardTrigger");

    const setRef = React.useMemo(
      () =>
        composeRefs<HTMLAnchorElement>(ref, setAnchor as (node: HTMLAnchorElement | null) => void),
      [ref, setAnchor],
    );

    const shared = {
      "data-slot": "hover-card-trigger",
      "data-state": open ? "open" : "closed",
      ...triggerHandlers,
      ...props,
    } as const;

    if (asChild || render !== undefined) {
      return <Slot ref={setRef as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
    return <a ref={setRef} {...shared} />;
  },
);

export interface HoverCardContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  side?: Side | undefined;
  align?: Align | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  container?: Element | DocumentFragment | null | undefined;
}

const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  function HoverCardContent({ className, align = "center", sideOffset = 4, ...props }, ref) {
    const { open, setOpen, anchor, contentId, contentHandlers } =
      useHoverCardContext("HoverCardContent");

    return (
      <Floating
        ref={ref}
        id={contentId}
        slot="hover-card"
        present={open}
        anchor={anchor}
        align={align}
        sideOffset={sideOffset}
        onDismiss={() => setOpen(false)}
        // It appeared because the pointer rested there, not because anything
        // was chosen: stealing focus would be wrong.
        autoFocus={false}
        trapFocus={false}
        {...contentHandlers}
        className={cn(
          "w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "data-[state=open]:animate-floating-in data-[state=closed]:animate-floating-out",
          className,
        )}
        {...props}
      />
    );
  },
);

export { HoverCard, HoverCardContent, HoverCardTrigger };
