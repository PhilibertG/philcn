# 001 — Animation polish

Commit at time of writing: `ad8548f`+ (phase 3 in progress)
Source: `improve-animations` audit, 18/09/2026. All seven findings accepted,
plus the two additive opportunities.

Constraint: no animation library may be introduced. Motion stays CSS-driven.

## Easing tokens (new)

Built-in CSS easings are too weak for deliberate motion. Two tokens, emitted
to `:root` by a non-inline `@theme` block so the animation tokens can
reference them:

| Token | Value | Used for |
| --- | --- | --- |
| `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | every dialog enter and exit |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | sheet slides (iOS-like) |

## 1. Exit curves — HIGH

`ease-in` starts slow, delaying the moment the eye is watching. Entering and
exiting both take `ease-out`.

| Token | Before | After |
| --- | --- | --- |
| `--animate-overlay-out` | `150ms ease-in` | `150ms var(--ease-out-strong)` |
| `--animate-content-out` | `150ms ease-in` | `150ms var(--ease-out-strong)` |
| `--animate-slide-out-{top,bottom,left,right}` | `250ms ease-in` | `250ms var(--ease-drawer)` |

Enter curves also move off the weak built-ins onto the same tokens. Durations
are unchanged — all already inside the 200–500ms modal budget.

## 2. Button transition list — HIGH

`transition-all` animates width, height and position, forcing a layout
recalculation every frame.

- Before: `transition-all`
- After: `transition-[color,background-color,border-color,box-shadow,transform,scale] duration-[160ms] ease-out`

  `scale` must be listed explicitly: Tailwind v4 compiles `scale-[0.97]` to the
  standalone `scale` property, so a list containing only `transform` leaves the
  press feedback un-animated.

## 3. Progress indicator — HIGH

- Before: `transition-all`
- After: `transition-transform duration-300 ease-out`

## 4. Press feedback — MEDIUM (divergence from shadcn)

Buttons give no tactile response. Catalog value: `scale(0.97)`, 160ms.

- Base gains `active:scale-[0.97]`
- `link` variant overrides with `active:scale-100` — a text link must not shrink

## 5. Reduced motion — MEDIUM

`animation: none !important` removed all feedback. Reduced motion means less
movement, not none: keep the fade, drop every translate and scale.

- Overlay, dialog content and sheet content fall back to
  `philcn-fade-in` / `philcn-fade-out` at `120ms`
- `[data-slot="button"]:active { scale: none; transform: none; }`

`Presence` still reads a real duration (120ms), so unmounting stays correct.

## 6. Border colour — LOW (divergence from shadcn)

The focus ring fades in while the border colour snaps.

- `transition-[color,box-shadow]` → `transition-[color,border-color,box-shadow]`
- Applies to `input.tsx`, `textarea.tsx`, `badge.tsx`

## 7. Avatar crossfade — additive (divergence from shadcn)

The initials are replaced by the image in one frame.

- New token `--animate-fade-in: philcn-fade-in 200ms var(--ease-out-strong)`
- `AvatarImage` gains `animate-fade-in`
- `Avatar` root gains `bg-muted`, so the fade happens over the circle rather
  than over transparency

## 8. Skeleton hand-off — additive

philcn cannot control the consumer's `loading ? <Skeleton/> : <Content/>`
swap. It exposes `animate-fade-in` for the content that replaces the skeleton,
demonstrated in the playground.

## Verification

Compile, run the tests, then feel-check in a real browser — the inspection
browser freezes animation clocks, so smoothness cannot be judged from here:

1. Open and close a dialog: the exit must feel as quick as the entrance.
2. Hold a button down: it must shrink slightly and spring back.
3. Turn on the system "reduce motion" setting: dialogs must still fade, never
   slide or zoom, and must still close.
4. Focus an input: border and ring must arrive together.
5. Reload the Navigation tab: the avatar image must fade in over the initials.
