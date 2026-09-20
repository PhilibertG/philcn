# Design decisions

Why philcn is built the way it is. Written down as the project went along, so
the reasoning survives the code.

## Why this library exists

School projects forbid front-end libraries that ship ready-made widgets and
dashboards — NuxtUI, UntitledUI, shadcn/ui and the like. Writing your own is
allowed, and is a better exercise anyway. philcn is that: a component library
written from scratch, for my own projects.

## Compatible on purpose, original in fact

The API deliberately mirrors shadcn/ui: same component names, same props, same
visual result. A component or a block copied from the shadcn site works here by
changing a single import line.

The implementation is entirely original. No line of code is copied from shadcn
or from any other library, and no third-party component library is installed.
What is reused is what nobody owns: **API names**, **design values** (colour
tokens, radii, spacing) and **appearance**. Those are conventions, not code.

Being open about the compatibility is the defensible position. Hiding it would
not be.

## Dependencies

The rule I gave myself: a package that ships **user-interface components** is
out, even an unstyled one — that is the whole point of writing this library.
A package that ships **pure mechanics with no interface** is in, if it earns
its place.

Two dependencies qualify, and both are **optional**: a project installs them
only if it uses the components that need them.

| Package | What it does | Who needs it |
| --- | --- | --- |
| `@floating-ui/react-dom` | works out where a floating panel should sit, and flips it when it would run off screen | Popover, Tooltip, Select, menus, HoverCard, NavigationMenu |
| `react-hook-form` | holds what a form is doing: values, touched fields, validation | `Form` only |

Neither draws anything.

Three popular packages were ruled out by that rule, and the behaviour was
written by hand instead:

- **`react-day-picker`** — ships a finished calendar. `Calendar` is written
  here, on top of a small tested date module.
- **`cmdk`** — ships a finished command palette. `Command` is written here.
- **`vaul`** — ships a finished drawer. `Drawer`'s drag-to-dismiss is written
  here, with the arithmetic in its own unit-tested file.

## Shared bricks rather than repeated code

Six components would each need a focus trap, six would each need arrow-key
navigation. Instead, the behaviour lives once in `src/lib/` and the components
are thin:

| Brick | What it owns | Used by |
| --- | --- | --- |
| `overlay.tsx` | portal, dimmed backdrop, focus trap, Escape, outside click, frozen page, animated exit | Dialog, AlertDialog, Sheet, Drawer |
| `floating.tsx` | placement beside an anchor, collision flipping, follow on scroll | every floating panel |
| `menu.tsx` | the open menu: list, entries, submenus, keyboard | DropdownMenu, ContextMenu, Menubar |
| `roving-focus.tsx` | Tab enters a group once, arrows move inside it | Tabs, RadioGroup, ToggleGroup, Menubar, NavigationMenu |
| `collection.tsx` + `list-navigation.ts` | entries that register themselves, and the arrow/Home/End/typeahead rules | every list |
| `presence.tsx` | keeps an element mounted until its exit animation has finished | everything that closes |

A fix made in a brick reaches every component that stands on it.

## Rules over reflexes: the tested modules

Anything that is arithmetic rather than rendering is pulled out into a plain
TypeScript file with unit tests — no React, no DOM:

- `slider-math.ts` — value to position and back, snapping to the step, which
  handle a click should move, handles that must not cross.
- `calendar-math.ts` — the month grid, leap years, ranges, week starts.
- `drag-dismiss.ts` — how far and how fast a drawer must be dragged to close.
- `list-navigation.ts` — what each key does, and what happens at the ends.
- `command-filter.ts` — accent-insensitive search and ranking.

These are the parts that are easy to get subtly wrong and impossible to verify
by looking at the screen.

## Deliberate differences from shadcn

The goal is a visually identical result. These are the only accepted
exceptions; anything else is a bug.

- **Pointer cursor on clickable controls.** Tailwind v4 dropped the default
  pointer cursor and shadcn does not put it back. philcn does, on buttons and
  on every clickable control. No effect on a disabled control.
- **Press feedback.** A pressed button shrinks to 97% over 160 ms. shadcn gives
  no tactile feedback. Text links are excluded — a link should not shrink.
- **Focus border fades in.** `border-color` is in the animated property list of
  fields, badges and buttons. In shadcn the border jumps while the ring fades.
- **Avatar image fades in** over 200 ms instead of replacing the initials in one
  frame.
- **Stacked dialogs.** When a dialog opens on top of another, the one
  underneath stays open but steps back and fades, and returns when the top one
  closes. It is also made inert: no focus trap, invisible to screen readers
  while it is covered. shadcn stacks them visually.
- **Dialogs scroll inside themselves** when taller than the screen. In shadcn
  the bottom becomes unreachable.
- **The drawer does not scale the page behind it.** `vaul` does; reproducing it
  means transforming a container around the whole application, which is too
  intrusive for a library you copy into an existing project.
- **Animations are defined in `philcn.css`** rather than pulled from
  `tw-animate-css`. One less package, and the durations stay editable. Two
  easing tokens: `--ease-out-strong` for dialogs, `--ease-drawer` for sheets.
- **`SelectScrollUpButton` and `SelectScrollDownButton` render nothing.** They
  exist for API compatibility; the list scrolls on its own and never grows past
  the space available on screen.

## Both spellings of `asChild`

shadcn now publishes three implementations — Base UI, Radix and React Aria —
which disagree on how to replace a trigger's element. philcn accepts both
spellings, so code pasted from either works:

```tsx
<Button asChild><a href="/">Home</a></Button>   // Radix
<Button render={<a href="/">Home</a>} />        // Base UI
```

## Accessibility is not a later pass

No interactive component ships without keyboard operation and a visible focus
ring. Every list is driven by the arrow keys, every group is a single Tab stop,
every control announces its state. This is checked as each component is
written, not audited at the end.

## Two components that are not components

`Combobox` and `DatePicker` have no file here, because they have none in shadcn
either. They are compositions: a `Command` inside a `Popover`, and a `Calendar`
inside a `Popover`. The examples in the playground show both.

## Distribution

philcn is not a package you install and import from. The `philcn` command
copies the source of a component into your project, where it becomes your file:
yours to read, yours to change. The registry is read from the source itself
rather than written by hand, so a component that starts depending on a new
brick brings it along automatically.

Versions are cut by a robot from the commit labels, and nothing is published
until a release pull request is merged by hand. See
[RELEASE.md](RELEASE.md).
