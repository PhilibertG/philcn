import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  clamp,
  closestIndex,
  moveValue,
  percentFor,
  snapToStep,
  valueAt,
} from "./slider-math.ts";

describe("clamp", () => {
  it("keeps a value inside its bounds", () => {
    assert.equal(clamp(5, 0, 10), 5);
    assert.equal(clamp(-3, 0, 10), 0);
    assert.equal(clamp(42, 0, 10), 10);
  });

  it("survives bounds given the wrong way round", () => {
    assert.equal(clamp(5, 10, 0), 10);
  });
});

describe("snapToStep", () => {
  it("rounds to the nearest step", () => {
    assert.equal(snapToStep(12, 0, 5), 10);
    assert.equal(snapToStep(13, 0, 5), 15);
  });

  it("counts steps from the minimum, not from zero", () => {
    assert.equal(snapToStep(12, 5, 10), 15);
    assert.equal(snapToStep(9, 5, 10), 5);
  });

  it("keeps binary rounding out of the result", () => {
    assert.equal(snapToStep(0.3, 0, 0.1), 0.3);
    assert.equal(snapToStep(0.7000000001, 0, 0.1), 0.7);
  });

  it("leaves the value alone when there is no step", () => {
    assert.equal(snapToStep(3.14159, 0, 0), 3.14159);
  });
});

describe("percentFor", () => {
  it("places a value along the track", () => {
    assert.equal(percentFor(0, 0, 100), 0);
    assert.equal(percentFor(50, 0, 100), 0.5);
    assert.equal(percentFor(100, 0, 100), 1);
  });

  it("handles a range that does not start at zero", () => {
    assert.equal(percentFor(15, 10, 20), 0.5);
  });

  it("never leaves the track", () => {
    assert.equal(percentFor(-10, 0, 100), 0);
    assert.equal(percentFor(200, 0, 100), 1);
  });

  it("returns zero for an empty range", () => {
    assert.equal(percentFor(5, 5, 5), 0);
  });
});

describe("valueAt", () => {
  it("reads a position back as a value", () => {
    assert.equal(valueAt(0.5, 0, 100, 1), 50);
    assert.equal(valueAt(0, 0, 100, 1), 0);
    assert.equal(valueAt(1, 0, 100, 1), 100);
  });

  it("snaps to the step", () => {
    assert.equal(valueAt(0.44, 0, 100, 10), 40);
    assert.equal(valueAt(0.46, 0, 100, 10), 50);
  });

  it("stays inside the range even past the ends", () => {
    assert.equal(valueAt(-1, 0, 100, 1), 0);
    assert.equal(valueAt(2, 0, 100, 1), 100);
  });
});

describe("closestIndex", () => {
  it("finds the nearest handle", () => {
    assert.equal(closestIndex([20, 80], 30), 0);
    assert.equal(closestIndex([20, 80], 70), 1);
  });

  it("moves the handle that can travel when two sit together", () => {
    // Both at 50: clicking to the right must move the upper one.
    assert.equal(closestIndex([50, 50], 80), 1);
    // Clicking to the left must move the lower one.
    assert.equal(closestIndex([50, 50], 20), 0);
  });

  it("says so when there is nothing to move", () => {
    assert.equal(closestIndex([], 10), -1);
  });
});

describe("moveValue", () => {
  it("moves one handle and leaves the others alone", () => {
    assert.deepEqual(moveValue({ values: [20, 80], index: 0, next: 30, min: 0, max: 100, step: 1 }), [
      30, 80,
    ]);
  });

  it("stops a handle against its neighbour", () => {
    assert.deepEqual(moveValue({ values: [20, 80], index: 0, next: 95, min: 0, max: 100, step: 1 }), [
      80, 80,
    ]);
    assert.deepEqual(moveValue({ values: [20, 80], index: 1, next: 5, min: 0, max: 100, step: 1 }), [
      20, 20,
    ]);
  });

  it("keeps the agreed gap between two handles", () => {
    assert.deepEqual(
      moveValue({
        values: [20, 80],
        index: 0,
        next: 95,
        min: 0,
        max: 100,
        step: 1,
        minStepsBetweenThumbs: 10,
      }),
      [70, 80],
    );
  });

  it("stays inside the range", () => {
    assert.deepEqual(moveValue({ values: [50], index: 0, next: 999, min: 0, max: 100, step: 1 }), [
      100,
    ]);
    assert.deepEqual(moveValue({ values: [50], index: 0, next: -999, min: 0, max: 100, step: 1 }), [
      0,
    ]);
  });

  it("ignores a handle that does not exist", () => {
    assert.deepEqual(moveValue({ values: [50], index: 3, next: 10, min: 0, max: 100, step: 1 }), [
      50,
    ]);
  });
});
