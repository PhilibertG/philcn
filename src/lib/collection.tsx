import * as React from "react";

import {
  moveFor,
  nextIndex,
  typeaheadIndex,
  TYPEAHEAD_RESET_MS,
} from "./list-navigation.ts";

/**
 * A list keeping track of its own entries.
 *
 * A menu has to know what it contains to be driven by the keyboard, but its
 * entries are written by whoever uses it and can appear, disappear or be
 * reordered at any time. Each entry registers itself, and the list reads them
 * back in the order they appear on screen rather than the order they signed up.
 */
export interface CollectionEntry {
  node: HTMLElement;
  /** What the entry reads as, for finding it by typing. */
  label: string;
  disabled: boolean;
}

interface CollectionValue {
  register: (key: string, entry: CollectionEntry) => void;
  unregister: (key: string) => void;
  /** Entries in the order they appear on screen. */
  getEntries: () => CollectionEntry[];
}

const CollectionContext = React.createContext<CollectionValue | null>(null);

export function useCollection(component: string): CollectionValue {
  const context = React.useContext(CollectionContext);
  if (context === null) throw new Error(`${component} must be used inside a collection`);
  return context;
}

export function CollectionProvider({ children }: { children?: React.ReactNode }) {
  const entries = React.useRef(new Map<string, CollectionEntry>());

  const value = React.useMemo<CollectionValue>(
    () => ({
      register: (key, entry) => {
        entries.current.set(key, entry);
      },
      unregister: (key) => {
        entries.current.delete(key);
      },
      getEntries: () =>
        [...entries.current.values()]
          .filter((entry) => entry.node.isConnected)
          // Registration order follows mounting, which is not what the eye
          // sees once entries are added or moved. Ask the document instead.
          .sort((a, b) =>
            a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          ),
    }),
    [],
  );

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

/** Registers one entry for as long as it is on screen. */
export function useCollectionEntry(
  key: string,
  node: HTMLElement | null,
  label: string,
  disabled: boolean,
): void {
  const { register, unregister } = useCollection("CollectionItem");

  React.useEffect(() => {
    if (node === null) return;
    register(key, { node, label, disabled });
    return () => unregister(key);
  }, [key, node, label, disabled, register, unregister]);
}

export interface UseListNavigationOptions {
  orientation?: "vertical" | "horizontal" | undefined;
  /** Walking past the last entry comes back to the first. */
  loop?: boolean | undefined;
  /** Find an entry by typing its first letters. Off for a plain toolbar. */
  typeahead?: boolean | undefined;
  /** Called when Enter or Space is pressed on the focused entry. */
  onSelect?: ((node: HTMLElement) => void) | undefined;
}

/**
 * Driving a list from the keyboard: arrows, Home, End, and finding an entry
 * by typing the start of its name.
 */
export function useListNavigation({
  orientation = "vertical",
  loop = true,
  typeahead = true,
  onSelect,
}: UseListNavigationOptions = {}): {
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  focusFirst: () => void;
  focusLast: () => void;
} {
  const { getEntries } = useCollection("useListNavigation");
  const search = React.useRef("");
  const searchTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      if (searchTimer.current !== undefined) window.clearTimeout(searchTimer.current);
    },
    [],
  );

  const focusAt = React.useCallback((entries: CollectionEntry[], index: number) => {
    const entry = entries[index];
    if (entry === undefined) return;
    entry.node.focus({ preventScroll: false });
  }, []);

  const move = React.useCallback(
    (to: Parameters<typeof nextIndex>[0]["move"]) => {
      const entries = getEntries();
      const current = entries.findIndex((entry) => entry.node === document.activeElement);
      const disabled = entries.flatMap((entry, index) => (entry.disabled ? [index] : []));
      focusAt(entries, nextIndex({ current, count: entries.length, move: to, loop, disabled }));
    },
    [getEntries, focusAt, loop],
  );

  const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLElement>>(
    (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const to = moveFor(event.key, orientation);
      if (to !== null) {
        event.preventDefault();
        move(to);
        return;
      }

      if (onSelect !== undefined && (event.key === "Enter" || event.key === " ")) {
        const active = document.activeElement;
        if (active instanceof HTMLElement && getEntries().some((e) => e.node === active)) {
          event.preventDefault();
          onSelect(active);
        }
        return;
      }

      // A single printable character starts or continues a search.
      if (!typeahead || event.key.length !== 1 || event.key === " ") return;

      event.preventDefault();
      search.current += event.key;

      if (searchTimer.current !== undefined) window.clearTimeout(searchTimer.current);
      searchTimer.current = window.setTimeout(() => {
        search.current = "";
      }, TYPEAHEAD_RESET_MS);

      const entries = getEntries();
      const current = entries.findIndex((entry) => entry.node === document.activeElement);
      focusAt(
        entries,
        typeaheadIndex({
          search: search.current,
          labels: entries.map((entry) => entry.label),
          current,
          disabled: entries.flatMap((entry, index) => (entry.disabled ? [index] : [])),
        }),
      );
    },
    [orientation, move, onSelect, typeahead, getEntries, focusAt],
  );

  return {
    onKeyDown,
    focusFirst: React.useCallback(() => move("first"), [move]),
    focusLast: React.useCallback(() => move("last"), [move]),
  };
}
