import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { Overlay } from "../../lib/overlay.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
  contentId: string;
  titleId: string;
  descriptionId: string;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(component: string): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (context === null) throw new Error(`${component} must be used inside <Dialog>`);
  return context;
}

export interface DialogProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** A modal dialog freezes the page behind it. */
  modal?: boolean | undefined;
  children?: React.ReactNode;
}

function Dialog({ open, defaultOpen, onOpenChange, modal = true, children }: DialogProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const baseId = useId();
  const value = React.useMemo<DialogContextValue>(
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

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ asChild = false, onClick, ...props }, ref) {
    const { open, setOpen, contentId } = useDialogContext("DialogTrigger");

    const shared = {
      "data-slot": "dialog-trigger",
      "data-state": open ? "open" : "closed",
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      onClick: composeEventHandlers(onClick, () => setOpen(true)),
      ...props,
    } as const;

    if (asChild) return <Slot ref={ref as React.Ref<HTMLElement>} {...shared} />;
    return <button ref={ref} type="button" {...shared} />;
  },
);

export interface DialogCloseProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { asChild = false, onClick, ...props },
  ref,
) {
  const { setOpen } = useDialogContext("DialogClose");

  const shared = {
    "data-slot": "dialog-close",
    onClick: composeEventHandlers(onClick, () => setOpen(false)),
    ...props,
  } as const;

  if (asChild) return <Slot ref={ref as React.Ref<HTMLElement>} {...shared} />;
  return <button ref={ref} type="button" {...shared} />;
});

/** The cross in the corner. */
function DialogCloseIcon() {
  return (
    <DialogClose
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
    </DialogClose>
  );
}

// `role` and `slot` are set by the dialog itself and must not be overridden.
export interface DialogContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  /** Where the dialog is rendered. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null | undefined;
  showCloseButton?: boolean | undefined;
  overlayClassName?: string | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
  onPointerDownOutside?: ((event: PointerEvent) => void) | undefined;
  onInteractOutside?: ((event: PointerEvent | FocusEvent) => void) | undefined;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, children, showCloseButton = true, ...props },
  ref,
) {
  const { open, setOpen, modal, contentId, titleId, descriptionId } =
    useDialogContext("DialogContent");

  return (
    <Overlay
      ref={ref}
      id={contentId}
      slot="dialog"
      role="dialog"
      present={open}
      modal={modal}
      labelledBy={titleId}
      describedBy={descriptionId}
      onDismiss={() => setOpen(false)}
      className={cn(
        "left-1/2 top-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
        "gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
        // Long content scrolls inside the dialog rather than running off the
        // screen where it cannot be reached.
        "max-h-[calc(100dvh-2rem)] overflow-y-auto",
        "data-[state=open]:animate-content-in data-[state=closed]:animate-content-out",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? <DialogCloseIcon /> : null}
    </Overlay>
  );
});

/** Kept for API compatibility: the portal is already inside DialogContent. */
function DialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

/** Kept for API compatibility: the backdrop is already inside DialogContent. */
function DialogOverlay(_props: React.ComponentPropsWithoutRef<"div">) {
  return null;
}

function DialogHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  function DialogTitle({ className, id, ...props }, ref) {
    const { titleId } = useDialogContext("DialogTitle");
    return (
      <h2
        ref={ref}
        id={id ?? titleId}
        data-slot="dialog-title"
        className={cn("text-lg font-semibold leading-none", className)}
        {...props}
      />
    );
  },
);

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function DialogDescription({ className, id, ...props }, ref) {
  const { descriptionId } = useDialogContext("DialogDescription");
  return (
    <p
      ref={ref}
      id={id ?? descriptionId}
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
