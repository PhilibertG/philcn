"use client";

import * as React from "react";

import type { Align, Side } from "../../lib/anchored.ts";
import { cn } from "../../lib/cn.ts";
import { composeRefs } from "../../lib/compose.ts";
import { Floating } from "../../lib/floating.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useHoverOpen } from "../../lib/use-hover-open.ts";
import { useId } from "../../lib/use-id.ts";

interface ProviderValue {
  delayDuration: number;
  /**
   * Once a tooltip has been seen, the next one within this window opens at
   * once. Waiting again for every button in a toolbar is maddening.
   */
  skipDelayDuration: number;
  isSkipping: () => boolean;
  reportClosed: () => void;
}

const TooltipProviderContext = React.createContext<ProviderValue | null>(null);

export interface TooltipProviderProps {
  delayDuration?: number | undefined;
  skipDelayDuration?: number | undefined;
  children?: React.ReactNode;
}

function TooltipProvider({
  delayDuration = 700,
  skipDelayDuration = 300,
  children,
}: TooltipProviderProps) {
  const lastClosedAt = React.useRef<number>(Number.NEGATIVE_INFINITY);

  const value = React.useMemo<ProviderValue>(
    () => ({
      delayDuration,
      skipDelayDuration,
      isSkipping: () => Date.now() - lastClosedAt.current < skipDelayDuration,
      reportClosed: () => {
        lastClosedAt.current = Date.now();
      },
    }),
    [delayDuration, skipDelayDuration],
  );

  return (
    <TooltipProviderContext.Provider value={value}>{children}</TooltipProviderContext.Provider>
  );
}

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLElement | null;
  setAnchor: (node: HTMLElement | null) => void;
  contentId: string;
  triggerHandlers: ReturnType<typeof useHoverOpen>["triggerHandlers"];
  contentHandlers: ReturnType<typeof useHoverOpen>["contentHandlers"];
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltipContext(component: string): TooltipContextValue {
  const context = React.useContext(TooltipContext);
  if (context === null) throw new Error(`${component} must be used inside <Tooltip>`);
  return context;
}

export interface TooltipProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  delayDuration?: number | undefined;
  disableHoverableContent?: boolean | undefined;
  children?: React.ReactNode;
}

function Tooltip({ open, defaultOpen, onOpenChange, delayDuration, children }: TooltipProps) {
  const provider = React.useContext(TooltipProviderContext);
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const contentId = `${useId()}-content`;

  const delay = delayDuration ?? provider?.delayDuration ?? 700;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setIsOpen(next);
      if (!next) provider?.reportClosed();
    },
    [setIsOpen, provider],
  );

  const { triggerHandlers, contentHandlers, closeNow } = useHoverOpen({
    // Read when the pointer arrives, not while rendering: whether another
    // tooltip was just on screen is only knowable at that moment.
    openDelay: () => (provider?.isSkipping() === true ? 0 : delay),
    closeDelay: 0,
    onOpenChange: handleOpenChange,
  });

  const value = React.useMemo<TooltipContextValue>(
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

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

export interface TooltipTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  function TooltipTrigger({ asChild = false, render, ...props }, ref) {
    const { open, setAnchor, contentId, triggerHandlers } = useTooltipContext("TooltipTrigger");

    const setRef = React.useMemo(
      () =>
        composeRefs<HTMLButtonElement>(ref, setAnchor as (node: HTMLButtonElement | null) => void),
      [ref, setAnchor],
    );

    const shared = {
      "data-slot": "tooltip-trigger",
      "data-state": open ? "open" : "closed",
      // The tooltip describes the control rather than naming it.
      "aria-describedby": open ? contentId : undefined,
      ...triggerHandlers,
      ...props,
    } as const;

    if (asChild || render !== undefined) {
      return <Slot ref={setRef as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
    return <button ref={setRef} type="button" {...shared} />;
  },
);

export interface TooltipContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  side?: Side | undefined;
  align?: Align | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  container?: Element | DocumentFragment | null | undefined;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent({ className, sideOffset = 4, ...props }, ref) {
    const { open, setOpen, anchor, contentId, contentHandlers } =
      useTooltipContext("TooltipContent");

    return (
      <Floating
        ref={ref}
        id={contentId}
        slot="tooltip"
        role="tooltip"
        present={open}
        anchor={anchor}
        sideOffset={sideOffset}
        onDismiss={() => setOpen(false)}
        // A tooltip is never focused and never swallows a click: it explains
        // the control, it is not a place to go.
        autoFocus={false}
        trapFocus={false}
        dismissOnOutsideClick={false}
        {...contentHandlers}
        className={cn(
          "pointer-events-none w-fit rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=closed]:fill-mode-forwards",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    );
  },
);

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
