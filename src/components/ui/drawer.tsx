import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { axisOf, type DragDirection } from "../../lib/drag-dismiss.ts";
import { Overlay } from "../../lib/overlay.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useDragDismiss } from "../../lib/use-drag-dismiss.ts";
import { useId } from "../../lib/use-id.ts";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  modal: boolean;
  direction: DragDirection;
  contentId: string;
  titleId: string;
  descriptionId: string;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext(component: string): DrawerContextValue {
  const context = React.useContext(DrawerContext);
  if (context === null) throw new Error(`${component} must be used inside <Drawer>`);
  return context;
}

/** The way the panel is swiped away, which is also the edge it sits on. */
export type SwipeDirection = "up" | "right" | "down" | "left";

const EDGE_OF: Record<SwipeDirection, DragDirection> = {
  up: "top",
  down: "bottom",
  left: "left",
  right: "right",
};

export interface DrawerProps {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  modal?: boolean | undefined;
  /** Which edge the drawer sits on, named by the swipe that dismisses it. */
  swipeDirection?: SwipeDirection | undefined;
  /**
   * Older name for the same thing, using the edge instead of the swipe.
   * Accepted so code written against earlier shadcn releases still works.
   */
  direction?: DragDirection | undefined;
  children?: React.ReactNode;
}

/**
 * A panel anchored to an edge that can be dragged away to close.
 *
 * shadcn builds this on the `vaul` package. philcn cannot, so the gesture is
 * written here: the panel follows the finger, resists being pulled further
 * open, and closes on a flick or once dragged far enough.
 */
function Drawer({
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
  swipeDirection,
  direction,
  children,
}: DrawerProps) {
  const edge: DragDirection =
    swipeDirection !== undefined ? EDGE_OF[swipeDirection] : (direction ?? "bottom");

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const baseId = useId();
  const value = React.useMemo<DrawerContextValue>(
    () => ({
      open: isOpen === true,
      setOpen: (next: boolean) => setIsOpen(next),
      modal,
      direction: edge,
      contentId: `${baseId}-content`,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
    }),
    [isOpen, setIsOpen, modal, edge, baseId],
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export interface DrawerTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  function DrawerTrigger({ asChild = false, render, onClick, ...props }, ref) {
    const { open, setOpen, contentId } = useDrawerContext("DrawerTrigger");

    const shared = {
      "data-slot": "drawer-trigger",
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

export interface DrawerCloseProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(function DrawerClose(
  { asChild = false, render, onClick, ...props },
  ref,
) {
  const { setOpen } = useDrawerContext("DrawerClose");

  const shared = {
    "data-slot": "drawer-close",
    onClick: composeEventHandlers(onClick, () => setOpen(false)),
    ...props,
  } as const;

  const slotted = asChild || render !== undefined;
    if (slotted) {
      return <Slot ref={ref as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
  return <button ref={ref} type="button" {...shared} />;
});

const DIRECTION_CLASSES: Record<DragDirection, readonly string[]> = {
  bottom: [
    "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t",
    "data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom",
  ],
  top: [
    "inset-x-0 top-0 mb-24 max-h-[80vh] rounded-b-lg border-b",
    "data-[state=open]:animate-slide-in-top data-[state=closed]:animate-slide-out-top",
  ],
  right: [
    "inset-y-0 right-0 w-3/4 border-l sm:max-w-sm",
    "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right",
  ],
  left: [
    "inset-y-0 left-0 w-3/4 border-r sm:max-w-sm",
    "data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left",
  ],
};

/**
 * Where the grab bar sits: always on the edge facing into the screen, so it
 * reads as the thing to pull. Vertical drawers keep it in the flow; side
 * drawers place it against their inner edge.
 */
const HANDLE_CLASSES: Record<DragDirection, string> = {
  bottom: "mx-auto mt-4 h-2 w-[100px]",
  top: "order-last mx-auto mb-4 h-2 w-[100px]",
  right: "absolute left-2 top-1/2 h-[100px] w-2 -translate-y-1/2",
  left: "absolute right-2 top-1/2 h-[100px] w-2 -translate-y-1/2",
};

/** Turns an offset along the leaving axis into a CSS translate. */
function translateFor(direction: DragDirection, offset: number): string {
  const distance = `${direction === "top" || direction === "left" ? -offset : offset}px`;
  return axisOf(direction) === "y" ? `0 ${distance}` : `${distance} 0`;
}

export interface DrawerContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  container?: Element | DocumentFragment | null | undefined;
  /** The grab bar. Hidden when the drawer cannot be dragged. */
  showHandle?: boolean | undefined;
  /** Turn off drag-to-dismiss and keep the buttons only. */
  draggable?: boolean | undefined;
  overlayClassName?: string | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
  onPointerDownOutside?: ((event: PointerEvent) => void) | undefined;
  onInteractOutside?: ((event: PointerEvent | FocusEvent) => void) | undefined;
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  { className, children, showHandle, draggable = true, style, onTransitionEnd, ...props },
  ref,
) {
  const { open, setOpen, modal, direction, contentId, titleId, descriptionId } =
    useDrawerContext("DrawerContent");

  const drag = useDragDismiss({
    direction,
    enabled: draggable,
    onDismiss: () => setOpen(false),
  });

  // The gesture keeps its final offset until the panel is actually gone, so
  // it never flashes back into place. Clear it once that has happened.
  const { reset } = drag;
  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const moving = drag.isDragging || drag.isDismissing;
  const dragState = drag.isDragging ? "dragging" : drag.isDismissing ? "dismissing" : undefined;
  const withHandle = showHandle ?? draggable;

  return (
    <Overlay
      ref={ref}
      id={contentId}
      slot="drawer"
      role="dialog"
      present={open}
      modal={modal}
      labelledBy={titleId}
      describedBy={descriptionId}
      onDismiss={() => setOpen(false)}
      data-direction={direction}
      data-drag={dragState}
      overlayProps={{
        ...(dragState === undefined ? {} : { "data-drag": dragState }),
        // The backdrop lightens as the panel is pulled away, so the gesture
        // reads as reversible rather than as a switch that has already flipped.
        ...(moving ? { style: { opacity: 1 - drag.progress } } : {}),
      }}
      style={{
        ...style,
        ...(moving ? { translate: translateFor(direction, drag.offset) } : {}),
      }}
      onTransitionEnd={composeEventHandlers(
        onTransitionEnd as React.TransitionEventHandler<HTMLDivElement> | undefined,
        (event: React.TransitionEvent<HTMLDivElement>) => {
          if (event.propertyName !== "translate") return;
          if (drag.isDismissing) drag.finishDismiss();
        },
      )}
      className={cn(
        "flex h-auto flex-col bg-background",
        // The panel follows the finger with no transition; once let go, this
        // carries it home or out of view.
        "transition-[translate] duration-[250ms] ease-drawer",
        // The browser must not steal the gesture for its own scrolling.
        draggable && (axisOf(direction) === "y" ? "touch-pan-x" : "touch-pan-y"),
        DIRECTION_CLASSES[direction],
        // A drawer is anchored to an edge; shrinking it when covered would
        // pull it away from that edge. It only fades.
        "data-[covered=true]:scale-100",
        className,
      )}
      {...props}
      {...(draggable ? drag.handlers : {})}
    >
      {withHandle ? (
        <div
          data-slot="drawer-handle"
          aria-hidden="true"
          className={cn("shrink-0 rounded-full bg-muted", HANDLE_CLASSES[direction])}
        />
      ) : null}
      {children}
    </Overlay>
  );
});

function DrawerHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  function DrawerTitle({ className, id, ...props }, ref) {
    const { titleId } = useDrawerContext("DrawerTitle");
    return (
      <h2
        ref={ref}
        id={id ?? titleId}
        data-slot="drawer-title"
        className={cn("font-semibold text-foreground", className)}
        {...props}
      />
    );
  },
);

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p">
>(function DrawerDescription({ className, id, ...props }, ref) {
  const { descriptionId } = useDrawerContext("DrawerDescription");
  return (
    <p
      ref={ref}
      id={id ?? descriptionId}
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

/** Kept for API compatibility: the portal is already inside DrawerContent. */
function DrawerPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

/** Kept for API compatibility: the backdrop is already inside DrawerContent. */
function DrawerOverlay(_props: React.ComponentPropsWithoutRef<"div">) {
  return null;
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
