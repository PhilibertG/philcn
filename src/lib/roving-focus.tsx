/**
 * Roving focus — a group of controls that the Tab key treats as one stop.
 *
 * In a row of tabs, radio buttons or toggles, tabbing should land on the group
 * once and the arrow keys should move inside it. That is the expected shape
 * for screen reader and keyboard users, and it keeps long toolbars out of the
 * way of everything after them.
 *
 * Exactly one entry carries `tabIndex={0}` at a time — the selected one when
 * there is a selection, the first usable one otherwise — and every other entry
 * carries `tabIndex={-1}`. Focusing an entry hands it the tab stop, so coming
 * back to the group returns to where the user left off.
 *
 * Menus do not use this: they trap the focus instead, and Tab closes them.
 */

import * as React from "react";

import {
  CollectionProvider,
  useCollection,
  useCollectionEntry,
  useListNavigation,
} from "./collection.tsx";
import { composeEventHandlers } from "./compose.ts";
import { useId } from "./use-id.ts";

interface RovingFocusValue {
  /** The entry the Tab key reaches. */
  tabbable: HTMLElement | null;
  /** Hand the tab stop to this entry. */
  claim: (node: HTMLElement) => void;
  /** Work out the tab stop again after the entries have changed. */
  refresh: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
}

const RovingFocusContext = React.createContext<RovingFocusValue | null>(null);

function useRovingFocus(component: string): RovingFocusValue {
  const context = React.useContext(RovingFocusContext);
  if (context === null) throw new Error(`${component} must be used inside a roving focus group`);
  return context;
}

export interface RovingFocusGroupProps {
  /** Which arrow keys move between entries. */
  orientation?: "horizontal" | "vertical" | undefined;
  /** Walking past the last entry comes back to the first. */
  loop?: boolean | undefined;
  /** Find an entry by typing its first letters. Off for a plain toolbar. */
  typeahead?: boolean | undefined;
  children?: React.ReactNode;
}

function RovingFocusProvider({
  orientation = "horizontal",
  loop = true,
  typeahead = false,
  children,
}: RovingFocusGroupProps) {
  const { getEntries } = useCollection("RovingFocusGroup");
  const { onKeyDown } = useListNavigation({ orientation, loop, typeahead });
  const [tabbable, setTabbable] = React.useState<HTMLElement | null>(null);

  // Keeps the tab stop on an entry that is still there and still usable.
  // The updater form matters — an entry claiming the stop from its own effect
  // runs first, and this then sees that claim rather than the value it replaced.
  const refresh = React.useCallback(() => {
    setTabbable((current) => {
      const entries = getEntries();
      if (current !== null && entries.some((entry) => entry.node === current && !entry.disabled)) {
        return current;
      }
      return entries.find((entry) => !entry.disabled)?.node ?? null;
    });
  }, [getEntries]);

  // Entries appear, disappear and switch to disabled at any time, and the tab
  // stop must never be left on one that is gone. Entries arriving on their own
  // do not re-render this provider, so each one calls `refresh` as it registers.
  React.useEffect(refresh);

  const claim = React.useCallback((node: HTMLElement) => setTabbable(node), []);

  const value = React.useMemo<RovingFocusValue>(
    () => ({ tabbable, claim, refresh, onKeyDown }),
    [tabbable, claim, refresh, onKeyDown],
  );

  return <RovingFocusContext.Provider value={value}>{children}</RovingFocusContext.Provider>;
}

/** Wraps the entries of one group. Put it around the list, not the whole component. */
function RovingFocusGroup(props: RovingFocusGroupProps) {
  return (
    <CollectionProvider>
      <RovingFocusProvider {...props} />
    </CollectionProvider>
  );
}

export interface UseRovingFocusItemOptions {
  disabled?: boolean | undefined;
  /** What the entry reads as, for finding it by typing. */
  label?: string | undefined;
  /** The selected entry keeps the tab stop, so Tab returns to the selection. */
  active?: boolean | undefined;
}

export interface RovingFocusItemProps<E extends HTMLElement> {
  ref: (node: E | null) => void;
  tabIndex: number;
  onKeyDown: React.KeyboardEventHandler<E>;
  onFocus: React.FocusEventHandler<E>;
  onMouseDown: React.MouseEventHandler<E>;
}

/** Props for one entry of the group. Spread them onto the focusable element. */
function useRovingFocusItem<E extends HTMLElement = HTMLElement>({
  disabled = false,
  label = "",
  active = false,
}: UseRovingFocusItemOptions = {}): RovingFocusItemProps<E> {
  const { tabbable, claim, refresh, onKeyDown } = useRovingFocus("useRovingFocusItem");
  const [node, setNode] = React.useState<E | null>(null);

  useCollectionEntry(useId(), node, label, disabled);

  // Registering does not tell the group anything by itself, so say so here:
  // without this a group with no selection would have no tab stop at all.
  React.useEffect(() => {
    if (node === null) return;
    refresh();
  }, [node, disabled, refresh]);

  React.useEffect(() => {
    if (!active || disabled || node === null) return;
    claim(node);
  }, [active, disabled, node, claim]);

  return {
    ref: setNode,
    tabIndex: !disabled && node !== null && node === tabbable ? 0 : -1,
    onKeyDown,
    onFocus: (event) => {
      if (disabled) return;
      claim(event.currentTarget);
    },
    // Safari does not focus a button when it is clicked, which would leave the
    // tab stop behind on whichever entry was used last.
    onMouseDown: (event) => {
      if (disabled || event.button !== 0) return;
      event.currentTarget.focus();
    },
  };
}

export interface RovingFocusOwnHandlers<E extends HTMLElement> {
  onKeyDown?: React.KeyboardEventHandler<E> | undefined;
  onFocus?: React.FocusEventHandler<E> | undefined;
  onMouseDown?: React.MouseEventHandler<E> | undefined;
}

/** Chains the caller's own handlers in front of the group's. */
function mergeRovingFocusProps<E extends HTMLElement>(
  item: RovingFocusItemProps<E>,
  own: RovingFocusOwnHandlers<E>,
): Omit<RovingFocusItemProps<E>, "ref"> {
  return {
    tabIndex: item.tabIndex,
    onKeyDown: composeEventHandlers<React.KeyboardEvent<E>>(own.onKeyDown, item.onKeyDown),
    onFocus: composeEventHandlers<React.FocusEvent<E>>(own.onFocus, item.onFocus),
    onMouseDown: composeEventHandlers<React.MouseEvent<E>>(own.onMouseDown, item.onMouseDown),
  };
}

export { mergeRovingFocusProps, RovingFocusGroup, useRovingFocusItem };
