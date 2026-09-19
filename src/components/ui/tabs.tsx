import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeRefs } from "../../lib/compose.ts";
import {
  mergeRovingFocusProps,
  RovingFocusGroup,
  useRovingFocusItem,
} from "../../lib/roving-focus.tsx";
import { useControllableState } from "../../lib/use-controllable-state.ts";
import { useId } from "../../lib/use-id.ts";

type Orientation = "horizontal" | "vertical";

interface TabsContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  orientation: Orientation;
  /** `automatic` selects a tab as soon as the focus reaches it. */
  activationMode: "automatic" | "manual";
  triggerId: (value: string) => string;
  contentId: (value: string) => string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (context === null) throw new Error(`${component} must be used inside <Tabs>`);
  return context;
}

export interface TabsProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange" | "dir"> {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  orientation?: Orientation | undefined;
  activationMode?: "automatic" | "manual" | undefined;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    className,
    value,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    activationMode = "automatic",
    ...props
  },
  ref,
) {
  const [selected, setSelected] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const baseId = useId();
  const context = React.useMemo<TabsContextValue>(
    () => ({
      value: selected,
      setValue: (next: string) => setSelected(next),
      orientation,
      activationMode,
      triggerId: (forValue) => `${baseId}-trigger-${forValue}`,
      contentId: (forValue) => `${baseId}-content-${forValue}`,
    }),
    [selected, setSelected, orientation, activationMode, baseId],
  );

  return (
    <TabsContext.Provider value={context}>
      <div
        ref={ref}
        data-slot="tabs"
        data-orientation={orientation}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </TabsContext.Provider>
  );
});

export interface TabsListProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Walking past the last tab comes back to the first. */
  loop?: boolean | undefined;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, loop = true, ...props },
  ref,
) {
  const { orientation } = useTabsContext("TabsList");

  return (
    <RovingFocusGroup orientation={orientation} loop={loop}>
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        data-slot="tabs-list"
        data-orientation={orientation}
        className={cn(
          "inline-flex h-9 w-fit items-center justify-center",
          "rounded-lg bg-muted p-[3px] text-muted-foreground",
          className,
        )}
        {...props}
      />
    </RovingFocusGroup>
  );
});

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { className, value, disabled = false, onKeyDown, onFocus, onMouseDown, onClick, children, ...props },
  ref,
) {
  const {
    value: selected,
    setValue,
    orientation,
    activationMode,
    triggerId,
    contentId,
  } = useTabsContext("TabsTrigger");
  const isSelected = selected === value;

  const item = useRovingFocusItem<HTMLButtonElement>({
    disabled,
    label: typeof children === "string" ? children : "",
    active: isSelected,
  });

  const rovingProps = mergeRovingFocusProps(item, {
    onKeyDown,
    onFocus: (event) => {
      onFocus?.(event);
      // Automatic activation is what a sighted keyboard user expects: the
      // panel follows the arrow keys. Manual waits for Enter or Space, which
      // suits panels that are expensive to show.
      if (!event.defaultPrevented && activationMode === "automatic" && !disabled) setValue(value);
    },
    onMouseDown,
  });

  const setRef = React.useMemo(
    () => composeRefs<HTMLButtonElement>(ref, item.ref),
    [ref, item.ref],
  );

  return (
    <button
      ref={setRef}
      type="button"
      role="tab"
      id={triggerId(value)}
      aria-selected={isSelected}
      aria-controls={contentId(value)}
      disabled={disabled}
      data-slot="tabs-trigger"
      data-state={isSelected ? "active" : "inactive"}
      data-orientation={orientation}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) setValue(value);
      }}
      className={cn(
        // layout
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5",
        "whitespace-nowrap rounded-md border border-transparent px-2 py-1",
        "text-sm font-medium text-foreground dark:text-muted-foreground",
        // deliberate divergence from shadcn: a clickable control shows a pointer
        "cursor-pointer",
        "transition-[color,background-color,border-color,box-shadow] duration-[160ms] ease-out",
        // selected
        "data-[state=active]:bg-background data-[state=active]:shadow-sm",
        "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30",
        "dark:data-[state=active]:text-foreground",
        // keyboard focus ring, never removed: a 3px halo plus a 1px outline,
        // which keeps the tab readable against the list's own background
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "focus-visible:outline-1 focus-visible:outline-ring",
        // disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // icons sized and inert unless the caller says otherwise
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...rovingProps}
      {...props}
    >
      {children}
    </button>
  );
});

export interface TabsContentProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  /** Keep the panel in the page even when its tab is not selected. */
  forceMount?: boolean | undefined;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, value, forceMount = false, ...props },
  ref,
) {
  const { value: selected, orientation, triggerId, contentId } = useTabsContext("TabsContent");
  const isSelected = selected === value;

  if (!isSelected && !forceMount) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={contentId(value)}
      aria-labelledby={triggerId(value)}
      hidden={!isSelected}
      // A panel is a landmark the user tabs into, not a control: it takes the
      // focus once, without a ring of its own.
      tabIndex={0}
      data-slot="tabs-content"
      data-state={isSelected ? "active" : "inactive"}
      data-orientation={orientation}
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
});

export { Tabs, TabsContent, TabsList, TabsTrigger };
