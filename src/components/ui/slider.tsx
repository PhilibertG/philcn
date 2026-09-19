import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { composeEventHandlers } from "../../lib/compose.ts";
import { closestIndex, moveValue, percentFor, valueAt } from "../../lib/slider-math.ts";
import { useControllableState } from "../../lib/use-controllable-state.ts";

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "dir"> {
  value?: number[] | undefined;
  defaultValue?: number[] | undefined;
  onValueChange?: ((value: number[]) => void) | undefined;
  /** Called once the handle is let go, rather than on every move. */
  onValueCommit?: ((value: number[]) => void) | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  /** How many steps two handles must keep between them. */
  minStepsBetweenThumbs?: number | undefined;
  orientation?: "horizontal" | "vertical" | undefined;
  disabled?: boolean | undefined;
  /** Submits with the form under this name. Several handles submit several times. */
  name?: string | undefined;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    className,
    value,
    defaultValue,
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
    orientation = "horizontal",
    disabled = false,
    name,
    onPointerDown,
    ...props
  },
  ref,
) {
  const [current, setCurrent] = useControllableState<number[]>({
    prop: value,
    defaultProp: defaultValue ?? [min],
    onChange: onValueChange,
  });

  const values = current ?? [min];
  const vertical = orientation === "vertical";

  const track = React.useRef<HTMLSpanElement | null>(null);
  const thumbs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const dragging = React.useRef<number | null>(null);
  // The values are read back when the handle is let go, without making the
  // pointer handlers depend on them.
  const latest = React.useRef(values);
  latest.current = values;

  /**
   * Moves one handle. The new row is worked out from the row as it stands at
   * that moment, not from the one this render was drawn with: a held-down
   * arrow key fires faster than React redraws, and reading the drawn value
   * would make every repeat land on the same place.
   */
  const set = React.useCallback(
    (index: number, next: number | ((value: number) => number)) => {
      setCurrent((previous) => {
        const values = previous ?? [min];
        const from = values[index] ?? min;
        return moveValue({
          values,
          index,
          next: typeof next === "function" ? next(from) : next,
          min,
          max,
          step,
          minStepsBetweenThumbs,
        });
      });
    },
    [setCurrent, min, max, step, minStepsBetweenThumbs],
  );

  /** Where the pointer is along the track, from 0 to 1. */
  const percentAt = React.useCallback(
    (event: { clientX: number; clientY: number }) => {
      const node = track.current;
      if (node === null) return 0;
      const rect = node.getBoundingClientRect();
      if (vertical) {
        if (rect.height === 0) return 0;
        // A vertical slider grows upwards: the bottom of the track is the
        // smallest value.
        return 1 - (event.clientY - rect.top) / rect.height;
      }
      if (rect.width === 0) return 0;
      return (event.clientX - rect.left) / rect.width;
    },
    [vertical],
  );

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const target = valueAt(percentAt(event), min, max, step);
    const index = closestIndex(latest.current, target);
    if (index === -1) return;

    dragging.current = index;
    // A capture keeps the moves coming even when the pointer leaves the
    // track. It can be refused — a synthetic event, a pointer already gone —
    // and the drag still works without it.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* no capture, the pointer handlers still fire while over the slider */
    }
    thumbs.current[index]?.focus();
    set(index, target);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const index = dragging.current;
    if (index === null) return;
    event.preventDefault();
    set(index, valueAt(percentAt(event), min, max, step));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current === null) return;
    dragging.current = null;
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* nothing to release */
    }
    onValueCommit?.(latest.current);
  };

  const onThumbKeyDown = (index: number) => (event: React.KeyboardEvent) => {
    if (disabled) return;
    const big = step * 10;

    const next = ((): number | ((value: number) => number) | null => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          return (value) => value + step;
        case "ArrowLeft":
        case "ArrowDown":
          return (value) => value - step;
        case "PageUp":
          return (value) => value + big;
        case "PageDown":
          return (value) => value - big;
        case "Home":
          return min;
        case "End":
          return max;
        default:
          return null;
      }
    })();

    if (next === null) return;
    event.preventDefault();
    set(index, next);
  };

  // The filled part of the track runs from the first handle to the last —
  // or from the start of the track when there is only one.
  const first = values.length > 1 ? percentFor(Math.min(...values), min, max) : 0;
  const last = percentFor(Math.max(...values), min, max);

  return (
    <div
      ref={ref}
      data-slot="slider"
      data-orientation={orientation}
      data-disabled={disabled ? "" : undefined}
      onPointerDown={composeEventHandlers(onPointerDown, startDrag)}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[disabled]:opacity-50",
        vertical && "h-full min-h-44 w-auto flex-col",
        className,
      )}
      {...props}
    >
      <span
        ref={track}
        data-slot="slider-track"
        data-orientation={orientation}
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted",
          vertical ? "h-full w-1.5" : "h-1.5 w-full",
        )}
      >
        <span
          data-slot="slider-range"
          data-orientation={orientation}
          className={cn("absolute bg-primary", vertical ? "w-full" : "h-full")}
          style={
            vertical
              ? { bottom: `${first * 100}%`, top: `${(1 - last) * 100}%` }
              : { left: `${first * 100}%`, right: `${(1 - last) * 100}%` }
          }
        />
      </span>

      {values.map((thumbValue, index) => {
        const percent = percentFor(thumbValue, min, max);
        return (
          <span
            key={index}
            ref={(node) => {
              thumbs.current[index] = node;
            }}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={thumbValue}
            aria-orientation={orientation}
            aria-disabled={disabled || undefined}
            data-slot="slider-thumb"
            data-orientation={orientation}
            onKeyDown={onThumbKeyDown(index)}
            onKeyUp={() => onValueCommit?.(latest.current)}
            className={cn(
              "absolute block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm",
              // deliberate divergence from shadcn: a draggable control shows a pointer
              "cursor-pointer",
              "transition-[color,box-shadow] duration-[160ms] ease-out",
              "hover:ring-4 hover:ring-ring/50",
              "outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
              "data-[disabled]:pointer-events-none",
            )}
            style={
              vertical
                ? { bottom: `${percent * 100}%`, left: "50%", translate: "-50% 50%" }
                : { left: `${percent * 100}%`, top: "50%", translate: "-50% -50%" }
            }
          />
        );
      })}

      {name === undefined
        ? null
        : values.map((thumbValue, index) => (
            <input
              key={index}
              type="hidden"
              name={values.length > 1 ? `${name}[]` : name}
              value={thumbValue}
            />
          ))}
    </div>
  );
});

export { Slider };
