"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Middleware,
  type VirtualElement,
} from "@floating-ui/react-dom";
import * as React from "react";

import { fromPlacement, toPlacement, transformOriginFor, type Align, type Side } from "./anchored.ts";
import { cn } from "./cn.ts";
import { composeRefs } from "./compose.ts";
import { DismissableLayer } from "./dismissable-layer.tsx";
import { FocusScope } from "./focus-scope.tsx";
import { Portal } from "./portal.tsx";
import { Presence } from "./presence.tsx";

/**
 * A panel attached to something else on the page: a popover, a menu, a
 * tooltip. It is placed beside its anchor, moved out of the way when it would
 * run off the screen, and follows the anchor when the page scrolls.
 *
 * The placing itself is delegated to a positioning engine — pure arithmetic,
 * no interface of its own.
 */
export interface FloatingProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "role" | "slot"> {
  /** Whether the panel should be on screen. */
  present: boolean;
  /**
   * What the panel is attached to: an element, or a bare point on screen for
   * a menu opened by right-clicking.
   */
  anchor: HTMLElement | VirtualElement | null;
  onDismiss: () => void;
  /** Names the pieces in the markup, e.g. "popover" gives data-slot="popover-content". */
  slot: string;
  role?: string | undefined;
  side?: Side | undefined;
  align?: Align | undefined;
  /** Gap between the panel and its anchor, in pixels. */
  sideOffset?: number | undefined;
  /** Shift along the anchor's edge, in pixels. */
  alignOffset?: number | undefined;
  /** Move the panel when it would run off the screen. */
  avoidCollisions?: boolean | undefined;
  /** Keep at least this many pixels between the panel and the screen edge. */
  collisionPadding?: number | undefined;
  /** Give the panel the same width as its anchor. A select needs this. */
  matchAnchorWidth?: boolean | undefined;
  trapFocus?: boolean | undefined;
  autoFocus?: boolean | undefined;
  /**
   * Fired once the panel and everything in it are on screen. Prevent it to
   * place the focus yourself — a menu puts it on an entry, not on the box.
   */
  onMountAutoFocus?: ((event: Event) => void) | undefined;
  onUnmountAutoFocus?: ((event: Event) => void) | undefined;
  dismissOnOutsideClick?: boolean | undefined;
  dismissOnEscape?: boolean | undefined;
  container?: Element | DocumentFragment | null | undefined;
  onEscapeKeyDown?: ((event: KeyboardEvent) => void) | undefined;
  onPointerDownOutside?: ((event: PointerEvent) => void) | undefined;
  onInteractOutside?: ((event: PointerEvent | FocusEvent) => void) | undefined;
}

type ImplProps = Omit<FloatingProps, "present"> & { "data-state"?: string | undefined };

const FloatingImpl = React.forwardRef<HTMLDivElement, ImplProps>(function FloatingImpl(
  {
    anchor,
    onDismiss,
    slot,
    role,
    side = "bottom",
    align = "center",
    sideOffset = 4,
    alignOffset = 0,
    avoidCollisions = true,
    collisionPadding = 8,
    matchAnchorWidth = false,
    trapFocus = false,
    autoFocus = true,
    onMountAutoFocus,
    onUnmountAutoFocus,
    dismissOnOutsideClick = true,
    dismissOnEscape = true,
    container,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    className,
    style,
    children,
    "data-state": state,
    ...props
  },
  forwardedRef,
) {
  const middleware = React.useMemo(() => {
    const list: Middleware[] = [offset({ mainAxis: sideOffset, crossAxis: alignOffset })];
    if (avoidCollisions) {
      list.push(flip({ padding: collisionPadding }));
      list.push(shift({ padding: collisionPadding }));
    }
    list.push(
      size({
        padding: collisionPadding,
        apply({ rects, availableWidth, availableHeight, elements }) {
          // Published so a panel can size itself against its anchor or the
          // space left on screen. The radix-prefixed names are aliases, so
          // classes copied from shadcn keep working.
          const values: Record<string, string> = {
            "--philcn-anchor-width": `${rects.reference.width}px`,
            "--philcn-anchor-height": `${rects.reference.height}px`,
            "--philcn-available-width": `${availableWidth}px`,
            "--philcn-available-height": `${availableHeight}px`,
            "--radix-popper-anchor-width": `${rects.reference.width}px`,
            "--radix-popper-available-width": `${availableWidth}px`,
            "--radix-popper-available-height": `${availableHeight}px`,
          };
          for (const [name, value] of Object.entries(values)) {
            elements.floating.style.setProperty(name, value);
          }
          if (matchAnchorWidth) {
            elements.floating.style.width = `${rects.reference.width}px`;
          }
        },
      }),
    );
    return list;
  }, [sideOffset, alignOffset, avoidCollisions, collisionPadding, matchAnchorWidth]);

  const { refs, floatingStyles, placement } = useFloating({
    placement: toPlacement(side, align),
    // Keeps the panel glued to its anchor while the page scrolls or resizes.
    whileElementsMounted: autoUpdate,
    middleware,
  });

  const { setReference } = refs;
  React.useLayoutEffect(() => {
    setReference(anchor);
  }, [anchor, setReference]);

  const resolved = fromPlacement(placement);
  const setFloating = refs.setFloating;
  const setRef = React.useMemo(
    () => composeRefs<HTMLDivElement>(forwardedRef, setFloating),
    [forwardedRef, setFloating],
  );

  return (
    <Portal container={container} data-slot={`${slot}-portal`}>
      {/* display:contents keeps this listener out of the layout. */}
      <DismissableLayer
        style={{ display: "contents" }}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
        onInteractOutside={onInteractOutside}
        onDismiss={(reason) => {
          if (reason === "escape" && !dismissOnEscape) return;
          if (reason === "outside" && !dismissOnOutsideClick) return;
          onDismiss();
        }}
      >
        <FocusScope
          ref={setRef}
          {...(role === undefined ? {} : { role })}
          data-slot={`${slot}-content`}
          data-state={state}
          data-side={resolved.side}
          data-align={resolved.align}
          trapped={trapFocus}
          autoFocus={autoFocus}
          onMountAutoFocus={onMountAutoFocus}
          onUnmountAutoFocus={onUnmountAutoFocus}
          className={cn("z-50", className)}
          style={{
            ...floatingStyles,
            // The panel grows out of the corner nearest its anchor, so it
            // looks like it came from there rather than from nowhere.
            transformOrigin: transformOriginFor(placement),
            ...style,
          }}
          {...props}
        >
          {children}
        </FocusScope>
      </DismissableLayer>
    </Portal>
  );
});

const Floating = React.forwardRef<HTMLDivElement, FloatingProps>(function Floating(
  { present, ...props },
  ref,
) {
  return (
    <Presence present={present}>
      <FloatingImpl ref={ref} {...props} />
    </Presence>
  );
});

export { Floating };
