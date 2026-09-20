"use client";

import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers, composeRefs } from "../../lib/compose.ts";
import { getFocusableElements } from "../../lib/focusable.ts";
import { Portal } from "../../lib/portal.tsx";
import { Presence } from "../../lib/presence.tsx";
import {
  mergeRovingFocusProps,
  RovingFocusGroup,
  useRovingFocusItem,
} from "../../lib/roving-focus.tsx";
import { Slot } from "../../lib/slot.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";
import { useIsomorphicLayoutEffect } from "../../lib/use-isomorphic-layout-effect.ts";
import { cva } from "class-variance-authority";

interface NavigationMenuContextValue {
  /** The item whose panel is open, or `null`. */
  value: string | null;
  setValue: (value: string | null) => void;
  /** The item that was open just before, to work out which way to slide. */
  previousValue: React.MutableRefObject<string | null>;
  /** Set when a panel is opened from the keyboard: it then takes the focus. */
  focusOnOpen: React.MutableRefObject<boolean>;
  /** Panels are shown in a shared box below the bar unless this is off. */
  viewport: boolean;
  viewportNode: HTMLDivElement | null;
  setViewportNode: (node: HTMLDivElement | null) => void;
  /** Open this panel on hover, after the wait. */
  openWithDelay: (value: string) => void;
  /** Close shortly, leaving time for the pointer to travel to the panel. */
  scheduleClose: () => void;
  /** The pointer made it: stay open. */
  cancelClose: () => void;
  /** Every trigger, in the order they appear, to place the panels and arrow. */
  triggers: React.MutableRefObject<Map<string, HTMLElement>>;
  orderOf: (value: string | null) => number;
  rootId: string;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu(component: string): NavigationMenuContextValue {
  const context = React.useContext(NavigationMenuContext);
  if (context === null) throw new Error(`${component} must be used inside <NavigationMenu>`);
  return context;
}

interface ItemContextValue {
  value: string;
  open: boolean;
  triggerId: string;
  contentId: string;
  triggerNode: HTMLElement | null;
  setTriggerNode: (node: HTMLElement | null) => void;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItem(component: string): ItemContextValue {
  const context = React.useContext(ItemContext);
  if (context === null) throw new Error(`${component} must be used inside <NavigationMenuItem>`);
  return context;
}

export interface NavigationMenuProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "onChange" | "dir"> {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  /** Show the panels in one shared box below the bar. */
  viewport?: boolean | undefined;
  delayDuration?: number | undefined;
  skipDelayDuration?: number | undefined;
}

const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  {
    className,
    children,
    value,
    defaultValue,
    onValueChange,
    viewport = true,
    delayDuration = 200,
    skipDelayDuration = 300,
    ...props
  },
  ref,
) {
  const [openValue, setOpenValue] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue ?? "",
    onChange: onValueChange,
  });

  const current = openValue === undefined || openValue === "" ? null : openValue;
  const previousValue = React.useRef<string | null>(null);
  const focusOnOpen = React.useRef(false);
  const lastClosedAt = React.useRef(Number.NEGATIVE_INFINITY);
  const timer = React.useRef<number | undefined>(undefined);
  const triggers = React.useRef(new Map<string, HTMLElement>());
  const [viewportNode, setViewportNode] = React.useState<HTMLDivElement | null>(null);
  const rootId = useId();

  const context = React.useMemo<NavigationMenuContextValue>(
    () => ({
      value: current,
      setValue: (next: string | null) => {
        if (next === current) return;
        previousValue.current = current;
        if (next === null) lastClosedAt.current = Date.now();
        setOpenValue(next ?? "");
      },
      previousValue,
      focusOnOpen,
      viewport,
      viewportNode,
      setViewportNode,
      openWithDelay: (next: string) => {
        window.clearTimeout(timer.current);
        if (current === next) return;
        // Once one panel has been open, the next opens without the wait: going
        // along a bar should feel continuous rather than sticky.
        const wait =
          current !== null || Date.now() - lastClosedAt.current < skipDelayDuration
            ? 0
            : delayDuration;
        timer.current = window.setTimeout(() => {
          previousValue.current = current;
          setOpenValue(next);
        }, wait);
      },
      scheduleClose: () => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          previousValue.current = current;
          lastClosedAt.current = Date.now();
          setOpenValue("");
        }, 150);
      },
      cancelClose: () => window.clearTimeout(timer.current),
      triggers,
      orderOf: (forValue) => {
        if (forValue === null) return -1;
        return [...triggers.current.entries()]
          .filter(([, node]) => node.isConnected)
          .sort(([, a], [, b]) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          )
          .findIndex(([key]) => key === forValue);
      },
      rootId,
    }),
    [current, setOpenValue, viewport, viewportNode, delayDuration, skipDelayDuration, rootId],
  );

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <NavigationMenuContext.Provider value={context}>
      <nav
        ref={ref}
        aria-label="Main"
        data-slot="navigation-menu"
        data-viewport={viewport}
        // Tabbing out of the bar closes the open panel: leaving it behind
        // would hide the rest of the page for no reason.
        onBlur={(event) => {
          if (event.currentTarget.contains(event.relatedTarget)) return;
          window.clearTimeout(timer.current);
          if (current !== null) {
            previousValue.current = current;
            lastClosedAt.current = Date.now();
            setOpenValue("");
          }
        }}
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className,
        )}
        {...props}
      >
        {children}
        {viewport ? <NavigationMenuViewport /> : null}
      </nav>
    </NavigationMenuContext.Provider>
  );
});

const NavigationMenuList = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  function NavigationMenuList({ className, ...props }, ref) {
    return (
      <RovingFocusGroup orientation="horizontal" loop>
        <ul
          ref={ref}
          data-slot="navigation-menu-list"
          className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
          {...props}
        />
      </RovingFocusGroup>
    );
  },
);

export interface NavigationMenuItemProps extends React.ComponentPropsWithoutRef<"li"> {
  /** Names this item, so the open panel can be driven from outside. */
  value?: string | undefined;
}

const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  function NavigationMenuItem({ className, value, ...props }, ref) {
    const menu = useNavigationMenu("NavigationMenuItem");
    const baseId = useId();
    const itemValue = value ?? baseId;
    const [triggerNode, setTriggerNode] = React.useState<HTMLElement | null>(null);

    const context = React.useMemo<ItemContextValue>(
      () => ({
        value: itemValue,
        open: menu.value === itemValue,
        triggerId: `${baseId}-trigger`,
        contentId: `${baseId}-content`,
        triggerNode,
        setTriggerNode,
      }),
      [itemValue, menu.value, baseId, triggerNode],
    );

    return (
      <ItemContext.Provider value={context}>
        <li ref={ref} data-slot="navigation-menu-item" className={cn("relative", className)} {...props} />
      </ItemContext.Provider>
    );
  },
);

const navigationMenuTriggerStyle = cva([
  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2",
  "bg-background text-sm font-medium",
  // deliberate divergence from shadcn: a clickable control shows a pointer
  "cursor-pointer",
  "transition-[color,background-color,box-shadow] duration-[160ms] ease-out",
  "hover:bg-accent hover:text-accent-foreground",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground",
  "data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent",
  // keyboard focus ring, never removed
  "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
  "disabled:pointer-events-none disabled:opacity-50",
]);

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export interface NavigationMenuTriggerProps extends React.ComponentPropsWithoutRef<"button"> {}

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  function NavigationMenuTrigger(
    {
      className,
      children,
      disabled = false,
      onClick,
      onKeyDown,
      onFocus,
      onMouseDown,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref,
  ) {
    const menu = useNavigationMenu("NavigationMenuTrigger");
    const item = useItem("NavigationMenuTrigger");

    const roving = useRovingFocusItem<HTMLButtonElement>({
      disabled,
      active: item.open,
      label: typeof children === "string" ? children : "",
    });

    const register = React.useCallback(
      (node: HTMLButtonElement | null) => {
        if (node === null) menu.triggers.current.delete(item.value);
        else menu.triggers.current.set(item.value, node);
        item.setTriggerNode(node);
      },
      [menu.triggers, item],
    );

    const setRef = React.useMemo(
      () => composeRefs<HTMLButtonElement>(ref, roving.ref, register),
      [ref, roving.ref, register],
    );

    const rovingProps = mergeRovingFocusProps(roving, { onKeyDown, onFocus, onMouseDown });

    return (
      <button
        ref={setRef}
        type="button"
        id={item.triggerId}
        aria-expanded={item.open}
        aria-controls={item.open ? item.contentId : undefined}
        disabled={disabled}
        data-slot="navigation-menu-trigger"
        data-state={item.open ? "open" : "closed"}
        onClick={composeEventHandlers(onClick, () => {
          menu.setValue(item.open ? null : item.value);
        })}
        // Hovering opens the panel, as a navigation bar does; the focus alone
        // does not, so a keyboard user opens it with Enter or the down arrow.
        onPointerEnter={composeEventHandlers(
          onPointerEnter as React.PointerEventHandler<HTMLButtonElement> | undefined,
          () => {
            if (disabled) return;
            menu.openWithDelay(item.value);
          },
        )}
        onPointerLeave={composeEventHandlers(
          onPointerLeave as React.PointerEventHandler<HTMLButtonElement> | undefined,
          () => menu.scheduleClose(),
        )}
        className={cn(navigationMenuTriggerStyle(), "group", className)}
        {...rovingProps}
        onKeyDown={composeEventHandlers(
          rovingProps.onKeyDown,
          (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === "Escape" && item.open) {
              event.preventDefault();
              menu.setValue(null);
              return;
            }
            if (event.key !== "ArrowDown") return;
            event.preventDefault();

            // An open panel is already in the page and can be stepped into at
            // once; a closed one takes the focus as it appears.
            const panel = document.getElementById(item.contentId);
            if (item.open && panel !== null) {
              getFocusableElements(panel)[0]?.focus();
              return;
            }
            menu.focusOnOpen.current = true;
            menu.setValue(item.value);
          },
        )}
        {...props}
      >
        {children}{" "}
        <ChevronDownIcon
          className="relative top-px ml-1 size-3 transition-transform duration-300 group-data-[state=open]:rotate-180"
        />
      </button>
    );
  },
);

export interface NavigationMenuContentProps extends React.ComponentPropsWithoutRef<"div"> {
  forceMount?: boolean | undefined;
}

const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  function NavigationMenuContent(
    { className, forceMount = false, onPointerEnter, onPointerLeave, onKeyDown, ...props },
    ref,
  ) {
    const menu = useNavigationMenu("NavigationMenuContent");
    const item = useItem("NavigationMenuContent");

    // Which way the panel should come in: from the side the previous one was
    // on, so the movement follows the eye along the bar.
    const motion = (() => {
      if (menu.previousValue.current === null) return undefined;
      if (menu.previousValue.current === item.value) return "to-start";
      const from = menu.orderOf(menu.previousValue.current);
      const to = menu.orderOf(item.value);
      if (from === -1 || to === -1) return undefined;
      return from < to ? "from-end" : "from-start";
    })();

    const [panelNode, setPanelNode] = React.useState<HTMLDivElement | null>(null);
    const setPanelRef = React.useMemo(
      () => composeRefs<HTMLDivElement>(ref, setPanelNode),
      [ref],
    );

    // Opened with the down arrow, the panel takes the focus as soon as it is
    // in the page — which is a render later when it lives in the shared box.
    useIsomorphicLayoutEffect(() => {
      if (panelNode === null || !item.open || !menu.focusOnOpen.current) return;
      menu.focusOnOpen.current = false;
      getFocusableElements(panelNode)[0]?.focus();
    }, [panelNode, item.open, menu.focusOnOpen]);

    const panel = (
      <Presence present={item.open || forceMount}>
        <div
          ref={setPanelRef}
          id={item.contentId}
          aria-labelledby={item.triggerId}
          data-slot="navigation-menu-content"
          data-motion={motion}
          onPointerEnter={composeEventHandlers(
            onPointerEnter as React.PointerEventHandler<HTMLDivElement> | undefined,
            () => menu.cancelClose(),
          )}
          onPointerLeave={composeEventHandlers(
            onPointerLeave as React.PointerEventHandler<HTMLDivElement> | undefined,
            () => menu.scheduleClose(),
          )}
          onKeyDown={composeEventHandlers(
            onKeyDown as React.KeyboardEventHandler<HTMLDivElement> | undefined,
            (event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key !== "Escape") return;
              event.preventDefault();
              menu.setValue(null);
              item.triggerNode?.focus();
            },
          )}
          className={cn(
            "left-0 top-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
            "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in",
            "data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out data-[motion^=to-]:fill-mode-forwards",
            "data-[motion=from-start]:slide-in-from-left-52",
            "data-[motion=from-end]:slide-in-from-right-52",
            "data-[motion=to-start]:slide-out-to-left-52",
            "data-[motion=to-end]:slide-out-to-right-52",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:fill-mode-forwards",
            // shown in place rather than in the shared box below the bar
            "group-data-[viewport=false]/navigation-menu:top-full",
            "group-data-[viewport=false]/navigation-menu:mt-1.5",
            "group-data-[viewport=false]/navigation-menu:overflow-hidden",
            "group-data-[viewport=false]/navigation-menu:rounded-md",
            "group-data-[viewport=false]/navigation-menu:border",
            "group-data-[viewport=false]/navigation-menu:bg-popover",
            "group-data-[viewport=false]/navigation-menu:text-popover-foreground",
            "group-data-[viewport=false]/navigation-menu:shadow",
            className,
          )}
          {...props}
        />
      </Presence>
    );

    // With a shared box, the panel is written next to its trigger but shown
    // inside that box, which is elsewhere in the page.
    if (!menu.viewport) return panel;
    if (menu.viewportNode === null) return null;
    return <Portal container={menu.viewportNode}>{panel}</Portal>;
  },
);

const NavigationMenuViewport = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function NavigationMenuViewport({ className, style, ...props }, ref) {
    const menu = useNavigationMenu("NavigationMenuViewport");
    const [node, setNode] = React.useState<HTMLDivElement | null>(null);
    const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);

    const setRef = React.useMemo(
      () => composeRefs<HTMLDivElement>(ref, setNode, menu.setViewportNode),
      [ref, menu.setViewportNode],
    );

    // The box takes the size of the panel inside it, which is only known once
    // that panel has been laid out. It is measured and written down here.
    useIsomorphicLayoutEffect(() => {
      if (node === null) return;

      const measure = () => {
        const panel = node.querySelector<HTMLElement>(
          "[data-slot='navigation-menu-content'][data-state='open']",
        );
        if (panel === null) {
          setSize(null);
          return;
        }
        const rect = panel.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      };
      measure();

      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      const watcher = new MutationObserver(measure);
      watcher.observe(node, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
        watcher.disconnect();
      };
    }, [node, menu.value]);

    const open = menu.value !== null;

    return (
      <div className="absolute left-0 top-full isolate z-50 flex justify-center">
        <Presence present={open}>
          <div
            ref={setRef}
            data-slot="navigation-menu-viewport"
            onPointerEnter={() => menu.cancelClose()}
            onPointerLeave={() => menu.scheduleClose()}
            className={cn(
              "relative mt-1.5 w-full overflow-hidden rounded-md border bg-popover shadow",
              "h-[var(--philcn-navigation-menu-viewport-height)] origin-top text-popover-foreground",
              "md:w-[var(--philcn-navigation-menu-viewport-width)]",
              "data-[state=open]:animate-in data-[state=open]:zoom-in-90",
              "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fill-mode-forwards",
              className,
            )}
            style={{
              ...(size === null
                ? {}
                : ({
                    "--philcn-navigation-menu-viewport-width": `${size.width}px`,
                    "--philcn-navigation-menu-viewport-height": `${size.height}px`,
                    // Kept for code pasted from shadcn, which names them this way.
                    "--radix-navigation-menu-viewport-width": `${size.width}px`,
                    "--radix-navigation-menu-viewport-height": `${size.height}px`,
                  } as React.CSSProperties)),
              ...style,
            }}
            {...props}
          />
        </Presence>
      </div>
    );
  },
);

export interface NavigationMenuLinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "onSelect"> {
  active?: boolean | undefined;
  asChild?: boolean | undefined;
  /** Replace the rendered element with this one. Base UI's spelling of `asChild`. */
  render?: React.ReactElement | undefined;
  onSelect?: ((event: React.MouseEvent<HTMLElement>) => void) | undefined;
}

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  function NavigationMenuLink(
    { className, active, asChild = false, render, onClick, onSelect, ...props },
    ref,
  ) {
    const menu = useNavigationMenu("NavigationMenuLink");

    const shared = {
      "data-slot": "navigation-menu-link",
      "data-active": active === true ? "true" : undefined,
      "aria-current": active === true ? ("page" as const) : undefined,
      onClick: composeEventHandlers(onClick, (event: React.MouseEvent<HTMLElement>) => {
        onSelect?.(event);
        // Following a link closes the panel; nothing would otherwise.
        menu.setValue(null);
      }),
      className: cn(
        "flex flex-col gap-1 rounded-sm p-2 text-sm outline-none",
        "transition-[color,background-color,box-shadow] duration-[160ms] ease-out",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground",
        "data-[active=true]:hover:bg-accent data-[active=true]:focus:bg-accent",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      ),
      ...props,
    };

    if (asChild || render !== undefined) {
      return <Slot ref={ref as React.Ref<HTMLElement>} render={render} {...shared} />;
    }
    return <a ref={ref} {...shared} />;
  },
);

const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function NavigationMenuIndicator({ className, style, ...props }, ref) {
  const menu = useNavigationMenu("NavigationMenuIndicator");
  const [position, setPosition] = React.useState<{ left: number; width: number } | null>(null);
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const setRef = React.useMemo(() => composeRefs<HTMLDivElement>(ref, setNode), [ref]);

  // The arrow sits under the open trigger, so it has to be measured against
  // the list it belongs to rather than the page.
  useIsomorphicLayoutEffect(() => {
    if (menu.value === null || node === null) return;
    const trigger = menu.triggers.current.get(menu.value);
    const parent = node.offsetParent;
    if (trigger === undefined || parent === null) return;
    const triggerRect = trigger.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    setPosition({ left: triggerRect.left - parentRect.left, width: triggerRect.width });
  }, [menu.value, menu.triggers, node]);

  return (
    <Presence present={menu.value !== null}>
      <div
        ref={setRef}
        data-slot="navigation-menu-indicator"
        className={cn(
          "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
          "data-[state=open]:animate-in data-[state=open]:fade-in",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:fill-mode-forwards",
          className,
        )}
        style={{
          position: "absolute",
          ...(position === null ? {} : { left: position.left, width: position.width }),
          ...style,
        }}
        {...props}
      >
        <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
      </div>
    </Presence>
  );
});

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
