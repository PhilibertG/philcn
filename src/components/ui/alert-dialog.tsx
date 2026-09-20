"use client";

import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { Overlay } from "../../lib/overlay.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";
import { buttonVariants } from "./button.tsx";

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext(component: string): AlertDialogContextValue {
  const context = React.useContext(AlertDialogContext);
  if (context === null) throw new Error(`${component} must be used inside <AlertDialog>`);
  return context;
}

export interface AlertDialogProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  children?: React.ReactNode;
}

/**
 * A dialog that interrupts to ask for a decision. Unlike a plain dialog it
 * cannot be dismissed by clicking outside — the user must choose.
 */
function AlertDialog({ open, defaultOpen, onOpenChange, children }: AlertDialogProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const baseId = useId();
  const value = React.useMemo<AlertDialogContextValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      contentId: `${baseId}-content`,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
    }),
    [isOpen, setIsOpen, baseId],
  );

  return <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>;
}

export interface AlertDialogTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger({ asChild = false, render, onClick, ...props }, ref) {
    const { open, setOpen, contentId } = useAlertDialogContext("AlertDialogTrigger");

    const shared = {
      "data-slot": "alert-dialog-trigger",
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
  },
);

export interface AlertDialogContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  container?: Element | DocumentFragment | null | undefined;
  overlayClassName?: string | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ className, children, ...props }, ref) {
    const { open, setOpen, contentId, titleId, descriptionId } =
      useAlertDialogContext("AlertDialogContent");

    return (
      <Overlay
        ref={ref}
        id={contentId}
        slot="alert-dialog"
        role="alertdialog"
        present={open}
        modal
        labelledBy={titleId}
        describedBy={descriptionId}
        // A decision is required: Escape is allowed, a stray click outside is not.
        dismissOnOutsideClick={false}
        onDismiss={() => setOpen(false)}
        className={cn(
          "left-1/2 top-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
          "gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
          "max-h-[calc(100dvh-2rem)] overflow-y-auto",
          "data-[state=open]:animate-content-in data-[state=closed]:animate-content-out",
          className,
        )}
        {...props}
      >
        {children}
      </Overlay>
    );
  },
);

function AlertDialogHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  function AlertDialogTitle({ className, id, ...props }, ref) {
    const { titleId } = useAlertDialogContext("AlertDialogTitle");
    return (
      <h2
        ref={ref}
        id={id ?? titleId}
        data-slot="alert-dialog-title"
        className={cn("text-lg font-semibold leading-none", className)}
        {...props}
      />
    );
  },
);

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function AlertDialogDescription({ className, id, ...props }, ref) {
  const { descriptionId } = useAlertDialogContext("AlertDialogDescription");
  return (
    <p
      ref={ref}
      id={id ?? descriptionId}
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function AlertDialogAction({ className, onClick, ...props }, ref) {
  const { setOpen } = useAlertDialogContext("AlertDialogAction");
  return (
    <button
      ref={ref}
      type="button"
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...props}
    />
  );
});

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function AlertDialogCancel({ className, onClick, ...props }, ref) {
  const { setOpen } = useAlertDialogContext("AlertDialogCancel");
  return (
    <button
      ref={ref}
      type="button"
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...props}
    />
  );
});

/** Kept for API compatibility: the portal is already inside AlertDialogContent. */
function AlertDialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

/** Kept for API compatibility: the backdrop is already inside AlertDialogContent. */
function AlertDialogOverlay(_props: React.ComponentPropsWithoutRef<"div">) {
  return null;
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
