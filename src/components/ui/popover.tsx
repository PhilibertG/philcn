"use client";

import * as React from "react";

import type { Align, Side } from "../../lib/anchored.ts";
import { cn } from "../../lib/cn.ts";
import { composeEventHandlers, composeRefs } from "../../lib/compose.ts";
import { Floating } from "../../lib/floating.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLElement | null;
  setAnchor: (node: HTMLElement | null) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string): PopoverContextValue {
  const context = React.useContext(PopoverContext);
  if (context === null) throw new Error(`${component} must be used inside <Popover>`);
  return context;
}

export interface PopoverProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  children?: React.ReactNode;
}

function Popover({ open, defaultOpen, onOpenChange, children }: PopoverProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const baseId = useId();
  const value = React.useMemo<PopoverContextValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      anchor,
      setAnchor,
      contentId: `${baseId}-content`,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
    }),
    [isOpen, setIsOpen, anchor, baseId],
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

export interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ asChild = false, render, onClick, ...props }, ref) {
    const { open, setOpen, setAnchor, contentId } = usePopoverContext("PopoverTrigger");

    const setRef = React.useMemo(
      () => composeRefs<HTMLButtonElement>(ref, setAnchor as (node: HTMLButtonElement | null) => void),
      [ref, setAnchor],
    );

    const shared = {
      "data-slot": "popover-trigger",
      "data-state": open ? "open" : "closed",
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      onClick: composeEventHandlers(onClick, () => setOpen(!open)),
      ...props,
    } as const;

    if (asChild || render !== undefined) {
      return <Slot ref={setRef as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
    return <button ref={setRef} type="button" {...shared} />;
  },
);

/**
 * Attach the popover to something other than its trigger — a whole input
 * group, say, rather than the small button that opens it.
 */
const PopoverAnchor = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function PopoverAnchor(props, ref) {
    const { setAnchor } = usePopoverContext("PopoverAnchor");
    const setRef = React.useMemo(
      () => composeRefs<HTMLDivElement>(ref, setAnchor as (node: HTMLDivElement | null) => void),
      [ref, setAnchor],
    );
    return <div ref={setRef} data-slot="popover-anchor" {...props} />;
  },
);

export interface PopoverContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  side?: Side | undefined;
  align?: Align | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  container?: Element | DocumentFragment | null | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
  onPointerDownOutside?: ((event: PointerEvent) => void) | undefined;
  onInteractOutside?: ((event: PointerEvent | FocusEvent) => void) | undefined;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ className, align = "center", sideOffset = 4, ...props }, ref) {
    const { open, setOpen, anchor, contentId, titleId, descriptionId } =
      usePopoverContext("PopoverContent");

    return (
      <Floating
        ref={ref}
        id={contentId}
        slot="popover"
        role="dialog"
        present={open}
        anchor={anchor}
        align={align}
        sideOffset={sideOffset}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onDismiss={() => setOpen(false)}
        className={cn(
          "w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "data-[state=open]:animate-floating-in data-[state=closed]:animate-floating-out",
          className,
        )}
        {...props}
      />
    );
  },
);

function PopoverHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1.5 pb-4", className)}
      {...props}
    />
  );
}

const PopoverTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h4">>(
  function PopoverTitle({ className, id, ...props }, ref) {
    const { titleId } = usePopoverContext("PopoverTitle");
    return (
      <h4
        ref={ref}
        id={id ?? titleId}
        data-slot="popover-title"
        className={cn("font-medium leading-none", className)}
        {...props}
      />
    );
  },
);

const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function PopoverDescription({ className, id, ...props }, ref) {
  const { descriptionId } = usePopoverContext("PopoverDescription");
  return (
    <p
      ref={ref}
      id={id ?? descriptionId}
      data-slot="popover-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
