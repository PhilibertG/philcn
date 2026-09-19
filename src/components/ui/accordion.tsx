import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { CollectionProvider, useCollectionEntry, useListNavigation } from "../../lib/collection.tsx";
import { composeRefs } from "../../lib/compose.ts";
import { Presence } from "../../lib/presence.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";
import { useIsomorphicLayoutEffect } from "../../lib/use-isomorphic-layout-effect.ts";

type Orientation = "horizontal" | "vertical";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled: boolean;
  orientation: Orientation;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (context === null) throw new Error(`${component} must be used inside <Accordion>`);
  return context;
}

interface ItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItemContext(component: string): ItemContextValue {
  const context = React.useContext(ItemContext);
  if (context === null) throw new Error(`${component} must be used inside <AccordionItem>`);
  return context;
}

interface AccordionSharedProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "dir"> {
  /** Turns off every section at once. */
  disabled?: boolean | undefined;
  orientation?: Orientation | undefined;
}

export interface AccordionSingleProps extends AccordionSharedProps {
  type: "single";
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  /** Allows the open section to be closed again, leaving none open. */
  collapsible?: boolean | undefined;
}

export interface AccordionMultipleProps extends AccordionSharedProps {
  type: "multiple";
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onValueChange?: ((value: string[]) => void) | undefined;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  // The selection props are pulled out by name so they never reach the DOM,
  // and read back below through the shape that matches `type`.
  const {
    className,
    type,
    disabled = false,
    orientation = "vertical",
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    collapsible: _collapsible,
    ...rest
  } = props as AccordionSharedProps & {
    type: "single" | "multiple";
    value?: string | string[] | undefined;
    defaultValue?: string | string[] | undefined;
    onValueChange?: ((value: never) => void) | undefined;
    collapsible?: boolean | undefined;
  };

  // A single accordion holds one string, a multiple one holds a list.
  const single = type === "single" ? (props as AccordionSingleProps) : undefined;
  const multiple = type === "multiple" ? (props as AccordionMultipleProps) : undefined;

  const [openValues, setOpenValues] = useControllableState<string[]>({
    prop:
      single !== undefined
        ? single.value === undefined
          ? undefined
          : single.value === ""
            ? []
            : [single.value]
        : multiple?.value,
    defaultProp:
      single !== undefined
        ? single.defaultValue === undefined || single.defaultValue === ""
          ? []
          : [single.defaultValue]
        : (multiple?.defaultValue ?? []),
    onChange: (next) => {
      if (single !== undefined) single.onValueChange?.(next[0] ?? "");
      else multiple?.onValueChange?.(next);
    },
  });

  const open = openValues ?? [];
  const collapsible = single?.collapsible ?? false;
  // A stable key for the selection: the array itself is rebuilt on every
  // render, which would make the context change for nothing.
  const openKey = open.join(",");

  const context = React.useMemo<AccordionContextValue>(
    () => ({
      isOpen: (value: string) => open.includes(value),
      toggle: (value: string) => {
        if (type === "single") {
          const isOpen = open.includes(value);
          if (isOpen && !collapsible) return;
          setOpenValues(isOpen ? [] : [value]);
          return;
        }
        setOpenValues(
          open.includes(value) ? open.filter((item) => item !== value) : [...open, value],
        );
      },
      disabled,
      orientation,
    }),
    [openKey, open, setOpenValues, type, collapsible, disabled, orientation],
  );

  const divProps = rest as React.ComponentPropsWithoutRef<"div">;

  return (
    <AccordionContext.Provider value={context}>
      <CollectionProvider>
        <div
          ref={ref}
          data-slot="accordion"
          data-orientation={orientation}
          className={cn(className)}
          {...divProps}
        />
      </CollectionProvider>
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  disabled?: boolean | undefined;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, value, disabled = false, ...props },
  ref,
) {
  const { isOpen, disabled: groupDisabled, orientation } = useAccordionContext("AccordionItem");
  const baseId = useId();
  const open = isOpen(value);

  const context = React.useMemo<ItemContextValue>(
    () => ({
      value,
      open,
      disabled: disabled || groupDisabled,
      triggerId: `${baseId}-trigger`,
      contentId: `${baseId}-content`,
    }),
    [value, open, disabled, groupDisabled, baseId],
  );

  return (
    <ItemContext.Provider value={context}>
      <div
        ref={ref}
        data-slot="accordion-item"
        data-state={open ? "open" : "closed"}
        data-orientation={orientation}
        data-disabled={context.disabled ? "" : undefined}
        className={cn("border-b last:border-b-0", className)}
        {...props}
      />
    </ItemContext.Provider>
  );
});

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

const AccordionHeader = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h3">>(
  function AccordionHeader({ className, ...props }, ref) {
    const { open, disabled } = useItemContext("AccordionHeader");
    const { orientation } = useAccordionContext("AccordionHeader");
    return (
      <h3
        ref={ref}
        data-slot="accordion-header"
        data-state={open ? "open" : "closed"}
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        className={cn("flex", className)}
        {...props}
      />
    );
  },
);

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<"button"> {}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, onClick, onKeyDown, ...props }, ref) {
    const { toggle, orientation } = useAccordionContext("AccordionTrigger");
    const { value, open, disabled, triggerId, contentId } = useItemContext("AccordionTrigger");

    // Every header stays in the page's tab sequence — that is the expected
    // shape for an accordion — and the arrow keys jump from one to the next.
    const [node, setNode] = React.useState<HTMLButtonElement | null>(null);
    useCollectionEntry(triggerId, node, typeof children === "string" ? children : "", disabled);
    const { onKeyDown: navigate } = useListNavigation({ orientation, typeahead: false });

    const setRef = React.useMemo(() => composeRefs<HTMLButtonElement>(ref, setNode), [ref]);

    return (
      <AccordionHeader>
        <button
          ref={setRef}
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={contentId}
          disabled={disabled}
          data-slot="accordion-trigger"
          data-state={open ? "open" : "closed"}
          data-orientation={orientation}
          data-disabled={disabled ? "" : undefined}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented && !disabled) toggle(value);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) navigate(event);
          }}
          className={cn(
            // layout
            "flex flex-1 items-start justify-between gap-4 rounded-md py-4",
            "text-left text-sm font-medium",
            // deliberate divergence from shadcn: a clickable control shows a pointer
            "cursor-pointer",
            "transition-[color,border-color,box-shadow] duration-[160ms] ease-out",
            "hover:underline",
            // keyboard focus ring, never removed
            "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            // disabled
            "disabled:pointer-events-none disabled:opacity-50",
            // the chevron turns over when the panel is open
            "[&[data-state=open]>svg]:rotate-180",
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200" />
        </button>
      </AccordionHeader>
    );
  },
);

export interface AccordionContentProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Keep the panel in the page even when it is closed. */
  forceMount?: boolean | undefined;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, forceMount = false, ...props }, ref) {
    const { orientation } = useAccordionContext("AccordionContent");
    const { open, disabled, triggerId, contentId } = useItemContext("AccordionContent");

    const [panel, setPanel] = React.useState<HTMLDivElement | null>(null);
    const inner = React.useRef<HTMLDivElement | null>(null);

    // A panel unfolds from nothing to its own height, and that height is only
    // known once the content is laid out. It is measured here and handed to
    // the keyframes as a CSS variable. A resize observer keeps it right when
    // the content itself changes — an image loading, a list growing.
    useIsomorphicLayoutEffect(() => {
      const content = inner.current;
      if (panel === null || content === null) return;

      const measure = () => {
        panel.style.setProperty(
          "--philcn-accordion-height",
          `${content.getBoundingClientRect().height}px`,
        );
      };
      measure();

      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(content);
      return () => observer.disconnect();
    }, [panel]);

    const setRef = React.useMemo(() => composeRefs<HTMLDivElement>(ref, setPanel), [ref]);

    return (
      <Presence present={open || forceMount}>
        <div
          ref={setRef}
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          data-slot="accordion-content"
          data-orientation={orientation}
          data-disabled={disabled ? "" : undefined}
          className={cn(
            "overflow-hidden text-sm",
            "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
          )}
          {...props}
        >
          <div ref={inner} className={cn("pb-4 pt-0", className)}>
            {children}
          </div>
        </div>
      </Presence>
    );
  },
);

export { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger };
