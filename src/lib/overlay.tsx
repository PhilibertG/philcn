import * as React from "react";

import { cn } from "./cn.ts";
import { DismissableLayer, useLayerState } from "./dismissable-layer.tsx";
import { FocusScope } from "./focus-scope.tsx";
import { Portal } from "./portal.tsx";
import { Presence } from "./presence.tsx";
import { useScrollLock } from "./use-scroll-lock.ts";

/**
 * The machinery every modal surface shares: a portal out of the page, a dimmed
 * backdrop, a focus trap, Escape and outside-click handling, a frozen page,
 * and an exit that is allowed to finish before the surface is removed.
 *
 * Dialog, AlertDialog and Sheet all sit on this, so a fix here reaches all
 * three instead of having to be repeated.
 */
// `role` and `slot` are narrowed here, so the div's own looser versions are
// removed first.
export interface OverlayProps extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  /** Whether the surface should be on screen. */
  present: boolean;
  /** Called when the user asks to leave: Escape, or a click outside. */
  onDismiss: () => void;
  /** A modal surface freezes the page and blocks clicks behind it. */
  modal?: boolean | undefined;
  /** `alertdialog` demands a decision and must not be dismissed by accident. */
  role?: "dialog" | "alertdialog" | undefined;
  /** Names the pieces in the markup, e.g. "dialog" gives data-slot="dialog-content". */
  slot: string;
  labelledBy: string;
  describedBy: string;
  /** A click outside closes the surface. Off for alert dialogs. */
  dismissOnOutsideClick?: boolean | undefined;
  /** Escape closes the surface. */
  dismissOnEscape?: boolean | undefined;
  container?: Element | DocumentFragment | null | undefined;
  overlayClassName?: string | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
  onPointerDownOutside?: ((event: PointerEvent) => void) | undefined;
  onInteractOutside?: ((event: PointerEvent | FocusEvent) => void) | undefined;
}

type SurfaceProps = Omit<OverlayProps, "present" | "onDismiss" | "container"> & {
  "data-state"?: string | undefined;
};

/** The backdrop and the surface, both aware of whether something covers them. */
const OverlaySurface = React.forwardRef<HTMLDivElement, SurfaceProps>(function OverlaySurface(
  {
    className,
    overlayClassName,
    children,
    slot,
    role = "dialog",
    modal = true,
    labelledBy,
    describedBy,
    "data-state": state,
    dismissOnOutsideClick: _outside,
    dismissOnEscape: _escape,
    onEscapeKeyDown: _onEscape,
    onPointerDownOutside: _onPointerDown,
    onInteractOutside: _onInteract,
    ...props
  },
  ref,
) {
  const { isTopmost } = useLayerState();
  const covered = !isTopmost;

  return (
    <>
      <div
        data-slot={`${slot}-overlay`}
        // Marks this as the backdrop: a click here counts as outside, even
        // though it sits inside the layer.
        data-layer-backdrop=""
        data-state={state}
        data-covered={covered ? "true" : undefined}
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
          // A surface opened on top covers this one: step aside rather than
          // stacking two dimmed backdrops.
          "transition-opacity duration-200 ease-out-strong data-[covered=true]:opacity-0",
          overlayClassName,
        )}
      />
      <FocusScope
        ref={ref}
        role={role}
        aria-modal={modal}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        data-slot={`${slot}-content`}
        data-state={state}
        data-covered={covered ? "true" : undefined}
        // A covered surface is out of reach: no focus trap, and hidden from
        // assistive technology until it comes back to the front.
        trapped={isTopmost}
        inert={covered}
        className={cn(
          "pointer-events-auto fixed z-50",
          // Recede when another surface opens on top, come back when it closes.
          "transition-[opacity,scale] duration-200 ease-out-strong",
          "data-[covered=true]:scale-95 data-[covered=true]:opacity-0",
          "data-[covered=true]:pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </FocusScope>
    </>
  );
});

/** Rendered by Overlay once Presence has decided it should be on screen. */
const OverlayImpl = React.forwardRef<
  HTMLDivElement,
  Omit<OverlayProps, "present"> & { "data-state"?: string }
>(function OverlayImpl(
  {
    onDismiss,
    modal = true,
    container,
    dismissOnOutsideClick = true,
    dismissOnEscape = true,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    slot,
    ...props
  },
  ref,
) {
  // Keyed on being mounted, not on the open flag: Presence keeps this alive
  // through the exit animation, and releasing the lock early brings the
  // scrollbar back mid-animation, shifting the page sideways.
  useScrollLock(modal);

  return (
    <Portal container={container} data-slot={`${slot}-portal`}>
      {/* display:contents keeps this listener out of the layout. */}
      <DismissableLayer
        style={{ display: "contents" }}
        disableOutsidePointerEvents={modal}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
        onInteractOutside={onInteractOutside}
        onDismiss={(reason) => {
          // An alert dialog demands a decision: Escape is allowed, a stray
          // click outside is not.
          if (reason === "escape" && !dismissOnEscape) return;
          if (reason === "outside" && !dismissOnOutsideClick) return;
          onDismiss();
        }}
      >
        <OverlaySurface ref={ref} slot={slot} modal={modal} {...props} />
      </DismissableLayer>
    </Portal>
  );
});

const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(function Overlay(
  { present, ...props },
  ref,
) {
  return (
    <Presence present={present}>
      <OverlayImpl ref={ref} {...props} />
    </Presence>
  );
});

export { Overlay };
