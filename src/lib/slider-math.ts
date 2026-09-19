/**
 * Slider arithmetic: turning a position on screen into a value and back,
 * snapping to the step, and deciding which handle a click should move.
 *
 * Plain TypeScript, apart from nothing at all, so every rule is unit tested.
 */

export function clamp(value: number, min: number, max: number): number {
  if (min > max) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * The nearest allowed value. Steps are counted from `min`, not from zero:
 * a slider from 5 to 100 with a step of 10 allows 5, 15, 25…
 */
export function snapToStep(value: number, min: number, step: number): number {
  if (!(step > 0)) return value;
  const steps = Math.round((value - min) / step);
  const snapped = min + steps * step;
  // Steps like 0.1 do not divide cleanly in binary; rounding to the number of
  // decimals the step itself has keeps 0.30000000000000004 out of the output.
  const decimals = decimalsOf(step);
  return Number(snapped.toFixed(decimals));
}

function decimalsOf(step: number): number {
  const text = String(step);
  const dot = text.indexOf(".");
  if (dot === -1) return 0;
  return text.length - dot - 1;
}

/** Where a value sits on the track, from 0 at `min` to 1 at `max`. */
export function percentFor(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/** The value at a place on the track, snapped to the step. */
export function valueAt(percent: number, min: number, max: number, step: number): number {
  const raw = min + clamp(percent, 0, 1) * (max - min);
  return clamp(snapToStep(raw, min, step), min, max);
}

/**
 * The handle a click should move: the closest one, and on a tie the one that
 * lets the click do something — dragging the lower handle rightwards when
 * both sit on the same value would otherwise be impossible.
 */
export function closestIndex(values: readonly number[], target: number): number {
  if (values.length === 0) return -1;

  let best = 0;
  let bestDistance = Math.abs((values[0] as number) - target);

  for (let index = 1; index < values.length; index += 1) {
    const distance = Math.abs((values[index] as number) - target);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
      continue;
    }
    // Equal distance: pick the handle that moves towards the click.
    if (distance === bestDistance && target > (values[index] as number)) best = index;
  }
  return best;
}

export interface MoveInput {
  values: readonly number[];
  index: number;
  next: number;
  min: number;
  max: number;
  step: number;
  /** How many steps two handles must keep between them. */
  minStepsBetweenThumbs?: number;
}

/**
 * Moves one handle, keeping the row in order. Handles never cross: each one
 * stops against its neighbour, at the agreed distance.
 */
export function moveValue({
  values,
  index,
  next,
  min,
  max,
  step,
  minStepsBetweenThumbs = 0,
}: MoveInput): number[] {
  const result = [...values];
  if (index < 0 || index >= result.length) return result;

  const gap = minStepsBetweenThumbs * (step > 0 ? step : 0);
  const lower = index === 0 ? min : (result[index - 1] as number) + gap;
  const upper = index === result.length - 1 ? max : (result[index + 1] as number) - gap;

  result[index] = clamp(snapToStep(next, min, step), Math.max(min, lower), Math.min(max, upper));
  return result;
}
