import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { defaultCommandFilter, type CommandFilter } from "../../lib/command-filter.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { useId } from "../../lib/use-id.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog.tsx";

interface Registration {
  id: string;
  value: string;
  keywords: readonly string[] | undefined;
  disabled: boolean;
  group: string | undefined;
  /** Registration order, which is the order they were written in. */
  order: number;
}

interface Placement {
  visible: boolean;
  /** Where the entry sits once the best matches have been floated up. */
  rank: number;
}

interface CommandContextValue {
  search: string;
  setSearch: (search: string) => void;
  activeId: string | undefined;
  setActiveId: (id: string) => void;
  listId: string;
  registerItem: (registration: Registration) => void;
  unregisterItem: (id: string) => void;
  placementOf: (id: string) => Placement;
  /** How many entries survive the current search, across every group. */
  visibleCount: number;
  groupHasMatches: (group: string) => boolean;
  /** Runs the chosen entry's handler. */
  selectId: (id: string) => void;
  registerSelect: (id: string, handler: (value: string) => void) => void;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommandContext(component: string): CommandContextValue {
  const context = React.useContext(CommandContext);
  if (context === null) throw new Error(`${component} must be used inside <Command>`);
  return context;
}

const GroupContext = React.createContext<string | undefined>(undefined);

export interface CommandProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onSelect" | "defaultValue"> {
  /** Replace the matching rule. Return 0 to hide, a larger number to rank higher. */
  filter?: CommandFilter | undefined;
  /** The marked entry, when the page wants to drive it. */
  value?: string | undefined;
  defaultValue?: string | undefined;
  /** Called when the marker lands on another entry. */
  onValueChange?: ((value: string) => void) | undefined;
  /** Leave the list alone and filter it yourself. */
  shouldFilter?: boolean | undefined;
}

/**
 * A searchable list of commands.
 *
 * Unlike a menu, the focus never leaves the search box: the arrows move a
 * marker through the results instead, and the box tells assistive technology
 * which entry that marker is on. Typing would be impossible otherwise.
 */
const Command = React.forwardRef<HTMLDivElement, CommandProps>(function Command(
  {
    className,
    children,
    filter = defaultCommandFilter,
    shouldFilter = true,
    value: markedValue,
    defaultValue,
    onValueChange,
    ...props
  },
  ref,
) {
  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | undefined>(undefined);
  const [version, setVersion] = React.useState(0);

  const items = React.useRef(new Map<string, Registration>());
  const selects = React.useRef(new Map<string, (value: string) => void>());
  const counter = React.useRef(0);
  const listId = `${useId()}-list`;

  const registerItem = React.useCallback((registration: Registration) => {
    items.current.set(registration.id, registration);
    setVersion((current) => current + 1);
  }, []);

  const unregisterItem = React.useCallback((id: string) => {
    items.current.delete(id);
    selects.current.delete(id);
    setVersion((current) => current + 1);
  }, []);

  const registerSelect = React.useCallback((id: string, handler: (value: string) => void) => {
    selects.current.set(id, handler);
  }, []);

  // Recomputed whenever the search changes or an entry comes or goes.
  const placements = React.useMemo(() => {
    void version;
    const all = [...items.current.values()].sort((a, b) => a.order - b.order);
    const map = new Map<string, Placement>();

    if (!shouldFilter) {
      all.forEach((item, index) => map.set(item.id, { visible: true, rank: index }));
      return map;
    }

    const scored = all.map((item) => ({
      item,
      score: filter(item.value, search, item.keywords),
    }));

    // Sorting happens through CSS order, so the markup keeps the order it was
    // written in and only the eye sees the best matches move up.
    const kept = scored
      .filter((entry) => entry.score > 0)
      .sort((a, b) => (b.score === a.score ? a.item.order - b.item.order : b.score - a.score));

    for (const entry of scored) map.set(entry.item.id, { visible: false, rank: 0 });
    kept.forEach((entry, index) => map.set(entry.item.id, { visible: true, rank: index }));
    return map;
  }, [version, search, filter, shouldFilter]);

  /** Visible entries in the order they now read, skipping disabled ones. */
  const navigable = React.useMemo(() => {
    void version;
    return [...items.current.values()]
      .filter((item) => !item.disabled && placements.get(item.id)?.visible === true)
      .sort((a, b) => (placements.get(a.id)?.rank ?? 0) - (placements.get(b.id)?.rank ?? 0))
      .map((item) => item.id);
  }, [placements, version]);

  const visibleCount = React.useMemo(
    () => [...placements.values()].filter((placement) => placement.visible).length,
    [placements],
  );

  // The marker must always sit on something that is actually on screen.
  React.useEffect(() => {
    if (activeId !== undefined && navigable.includes(activeId)) return;
    setActiveId(navigable[0]);
  }, [navigable, activeId]);

  // The page may name the entry it wants marked, and be told when it moves.
  const wanted = markedValue ?? defaultValue;
  React.useEffect(() => {
    if (wanted === undefined) return;
    const match = [...items.current.values()].find((item) => item.value === wanted);
    if (match !== undefined) setActiveId(match.id);
  }, [wanted, version]);

  React.useEffect(() => {
    if (activeId === undefined || onValueChange === undefined) return;
    const item = items.current.get(activeId);
    if (item !== undefined) onValueChange(item.value);
  }, [activeId, onValueChange]);

  const selectId = React.useCallback((id: string) => {
    const item = items.current.get(id);
    if (item === undefined || item.disabled) return;
    selects.current.get(id)?.(item.value);
  }, []);

  const value = React.useMemo<CommandContextValue>(
    () => ({
      search,
      setSearch,
      activeId,
      setActiveId,
      listId,
      registerItem,
      unregisterItem,
      placementOf: (id: string) => placements.get(id) ?? { visible: true, rank: 0 },
      visibleCount,
      groupHasMatches: (group: string) =>
        [...items.current.values()].some(
          (item) => item.group === group && placements.get(item.id)?.visible === true,
        ),
      selectId,
      registerSelect,
    }),
    [
      search,
      activeId,
      listId,
      registerItem,
      unregisterItem,
      placements,
      visibleCount,
      selectId,
      registerSelect,
    ],
  );

  const move = (direction: 1 | -1 | "first" | "last") => {
    if (navigable.length === 0) return;
    if (direction === "first") {
      setActiveId(navigable[0]);
      return;
    }
    if (direction === "last") {
      setActiveId(navigable[navigable.length - 1]);
      return;
    }
    const current = activeId === undefined ? -1 : navigable.indexOf(activeId);
    const next = (current + direction + navigable.length) % navigable.length;
    setActiveId(navigable[next]);
  };

  return (
    <CommandContext.Provider value={value}>
      <div
        ref={ref}
        data-slot="command"
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          className,
        )}
        onKeyDown={composeEventHandlers(
          props.onKeyDown as React.KeyboardEventHandler<HTMLDivElement> | undefined,
          (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              move(1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              move(-1);
            } else if (event.key === "Home") {
              event.preventDefault();
              move("first");
            } else if (event.key === "End") {
              event.preventDefault();
              move("last");
            } else if (event.key === "Enter" && activeId !== undefined) {
              event.preventDefault();
              selectId(activeId);
            }
          },
        )}
        {...props}
      >
        <CounterContext.Provider value={counter}>{children}</CounterContext.Provider>
      </div>
    </CommandContext.Provider>
  );
});

/** Hands each entry the position it was written at. */
const CounterContext = React.createContext<React.MutableRefObject<number> | null>(null);

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 opacity-50"
      aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export interface CommandInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onChange"> {
  value?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { className, value, onValueChange, ...props },
  ref,
) {
  const { search, setSearch, activeId, listId } = useCommandContext("CommandInput");
  const text = value ?? search;

  return (
    <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
      <SearchIcon />
      <input
        ref={ref}
        data-slot="command-input"
        // The focus stays here while the arrows move through the list, so the
        // box has to say which entry is marked.
        role="combobox"
        aria-expanded="true"
        aria-controls={listId}
        aria-autocomplete="list"
        {...(activeId === undefined ? {} : { "aria-activedescendant": activeId })}
        value={text}
        onChange={(event) => {
          setSearch(event.target.value);
          onValueChange?.(event.target.value);
        }}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none",
          "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
});

const CommandList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function CommandList({ className, ...props }, ref) {
    const { listId } = useCommandContext("CommandList");
    return (
      <div
        ref={ref}
        id={listId}
        data-slot="command-list"
        role="listbox"
        className={cn("flex max-h-[300px] scroll-py-1 flex-col overflow-y-auto p-1", className)}
        {...props}
      />
    );
  },
);

/** Shown only when the search leaves nothing behind. */
function CommandEmpty({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { visibleCount } = useCommandContext("CommandEmpty");
  if (visibleCount > 0) return null;
  return (
    <div
      data-slot="command-empty"
      role="presentation"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  );
}

export interface CommandGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  heading?: React.ReactNode;
}

/** Disappears entirely when the search leaves none of its entries. */
function CommandGroup({ className, heading, children, ...props }: CommandGroupProps) {
  const { groupHasMatches } = useCommandContext("CommandGroup");
  const id = useId();
  const headingId = `${id}-heading`;
  const hasMatches = groupHasMatches(id);

  return (
    <GroupContext.Provider value={id}>
      <div
        data-slot="command-group"
        role="group"
        {...(heading === undefined ? {} : { "aria-labelledby": headingId })}
        hidden={!hasMatches}
        className={cn("flex flex-col overflow-hidden p-1 text-foreground", className)}
        {...props}
      >
        {heading === undefined ? null : (
          <div
            id={headingId}
            data-slot="command-group-heading"
            className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
          >
            {heading}
          </div>
        )}
        {children}
      </div>
    </GroupContext.Provider>
  );
}

export interface CommandItemProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> {
  /** What this entry is called for searching. Defaults to its text. */
  value?: string | undefined;
  /** Extra words that should also find it. */
  keywords?: readonly string[] | undefined;
  disabled?: boolean | undefined;
  onSelect?: ((value: string) => void) | undefined;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { className, children, value, keywords, disabled = false, onSelect, onClick, ...props },
  ref,
) {
  const command = useCommandContext("CommandItem");
  const group = React.useContext(GroupContext);
  const counter = React.useContext(CounterContext);
  const id = useId();

  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const order = React.useRef<number | null>(null);
  if (order.current === null && counter !== null) {
    order.current = counter.current;
    counter.current += 1;
  }

  const label = value ?? node?.textContent ?? "";
  const { registerItem, unregisterItem, registerSelect } = command;

  React.useEffect(() => {
    if (label === "") return;
    registerItem({
      id,
      value: label,
      keywords,
      disabled,
      group,
      order: order.current ?? 0,
    });
    return () => unregisterItem(id);
  }, [id, label, keywords, disabled, group, registerItem, unregisterItem]);

  React.useEffect(() => {
    registerSelect(id, (chosen) => onSelect?.(chosen));
  }, [id, onSelect, registerSelect]);

  const placement = command.placementOf(id);
  const active = command.activeId === id;

  const setRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      setNode(element);
      if (typeof ref === "function") ref(element);
      else if (ref !== null && ref !== undefined) ref.current = element;
    },
    [ref],
  );

  // A marked entry must stay on screen as the arrows run down a long list.
  React.useEffect(() => {
    if (!active || node === null) return;
    node.scrollIntoView({ block: "nearest" });
  }, [active, node]);

  return (
    <div
      ref={setRef}
      id={id}
      data-slot="command-item"
      role="option"
      aria-selected={active}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      data-selected={active ? "" : undefined}
      hidden={!placement.visible}
      style={{ order: placement.rank }}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
        "outline-none transition-colors",
        "data-[selected]:bg-accent data-[selected]:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      // Pointing at an entry marks it, so the mouse and the arrows agree.
      onPointerMove={() => {
        if (disabled || active) return;
        command.setActiveId(id);
      }}
      onClick={composeEventHandlers(onClick, () => {
        if (disabled) return;
        command.selectId(id);
      })}
      {...props}
    >
      {children}
    </div>
  );
});

function CommandSeparator({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="command-separator"
      role="separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface CommandDialogProps extends CommandProps {
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  title?: string | undefined;
  description?: string | undefined;
  showCloseButton?: boolean | undefined;
}

/** The command list inside a dialog — the usual command palette. */
function CommandDialog({
  open,
  onOpenChange,
  title = "Command palette",
  description = "Search for a command to run.",
  showCloseButton = false,
  className,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...(open === undefined ? {} : { open })} {...(onOpenChange === undefined ? {} : { onOpenChange })}>
      <DialogContent
        showCloseButton={showCloseButton}
        className="overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command className={cn("[&_[data-slot=command-input-wrapper]]:h-12", className)} {...props}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
