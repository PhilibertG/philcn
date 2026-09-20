"use client";

import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { Overlay } from "../../lib/overlay.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
  contentId: string;
  titleId: string;
  descriptionId: string;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext(component: string): SheetContextValue {
  const context = React.useContext(SheetContext);
  if (context === null) throw new Error(`${component} must be used inside <Sheet>`);
  return context;
}

export interface SheetProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  modal?: boolean | undefined;
  children?: React.ReactNode;
}

/** A panel that slides in from one edge of the screen. */
function Sheet({ open, defaultOpen, onOpenChange, modal = true, children }: SheetProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const baseId = useId();
  const value = React.useMemo<SheetContextValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      modal,
      contentId: `${baseId}-content`,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
    }),
    [isOpen, setIsOpen, modal, baseId],
  );

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

export interface SheetTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(function SheetTrigger(
  { asChild = false, render, onClick, ...props },
  ref,
) {
  const { open, setOpen, contentId } = useSheetContext("SheetTrigger");

  const shared = {
    "data-slot": "sheet-trigger",
    "data-state": open ? "open" : "closed",
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? contentId : undefined,
    onClick: composeEventHandlers(onClick, () => setOpen(true)),
    ...props,
  } as const;

  const slotted = asChild || render !== undefined;
    if (slotted) {
      return <Slot ref={ref as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
  return <button ref={ref} type="button" {...shared} />;
});

export interface SheetCloseProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(function SheetClose(
  { asChild = false, render, onClick, ...props },
  ref,
) {
  const { setOpen } = useSheetContext("SheetClose");

  const shared = {
    "data-slot": "sheet-close",
    onClick: composeEventHandlers(onClick, () => setOpen(false)),
    ...props,
  } as const;

  const slotted = asChild || render !== undefined;
    if (slotted) {
      return <Slot ref={ref as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
  return <button ref={ref} type="button" {...shared} />;
});

const SIDE_CLASSES = {
  right: [
    "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right",
  ],
  left: [
    "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    "data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left",
  ],
  top: [
    "inset-x-0 top-0 h-auto border-b",
    "data-[state=open]:animate-slide-in-top data-[state=closed]:animate-slide-out-top",
  ],
  bottom: [
    "inset-x-0 bottom-0 h-auto border-t",
    "data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom",
  ],
} as const;

export type SheetSide = keyof typeof SIDE_CLASSES;

export interface SheetContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  /** Which edge the panel slides in from. */
  side?: SheetSide | undefined;
  container?: Element | DocumentFragment | null | undefined;
  showCloseButton?: boolean | undefined;
  overlayClassName?: string | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
  onPointerDownOutside?: ((event: PointerEvent) => void) | undefined;
  onInteractOutside?: ((event: PointerEvent | FocusEvent) => void) | undefined;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { className, children, side = "right", showCloseButton = true, ...props },
  ref,
) {
  const { open, setOpen, modal, contentId, titleId, descriptionId } =
    useSheetContext("SheetContent");

  return (
    <Overlay
      ref={ref}
      id={contentId}
      slot="sheet"
      role="dialog"
      present={open}
      modal={modal}
      labelledBy={titleId}
      describedBy={descriptionId}
      onDismiss={() => setOpen(false)}
      data-side={side}
      className={cn(
        "flex flex-col gap-4 overflow-y-auto bg-background shadow-lg",
        SIDE_CLASSES[side],
        // A sheet is anchored to an edge; shrinking it when covered would pull
        // it away from that edge. It only fades.
        "data-[covered=true]:scale-100",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <SheetClose
          aria-label="Close"
          className={cn(
            "absolute right-4 top-4 cursor-pointer rounded-xs opacity-70 transition-opacity",
            "hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px]",
            "focus-visible:ring-ring/50 disabled:pointer-events-none",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </SheetClose>
      ) : null}
    </Overlay>
  );
});

function SheetHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  function SheetTitle({ className, id, ...props }, ref) {
    const { titleId } = useSheetContext("SheetTitle");
    return (
      <h2
        ref={ref}
        id={id ?? titleId}
        data-slot="sheet-title"
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    );
  },
);

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function SheetDescription({ className, id, ...props }, ref) {
  const { descriptionId } = useSheetContext("SheetDescription");
  return (
    <p
      ref={ref}
      id={id ?? descriptionId}
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

/** Kept for API compatibility: the portal is already inside SheetContent. */
function SheetPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

/** Kept for API compatibility: the backdrop is already inside SheetContent. */
function SheetOverlay(_props: React.ComponentPropsWithoutRef<"div">) {
  return null;
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
