import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  axisOf,
  DISTANCE_RATIO,
  FLICK_VELOCITY,
  leavingSign,
  offsetFor,
  rubberBand,
  shouldDismiss,
  velocityFrom,
} from "./drag-dismiss.ts";

describe("direction geometry", () => {
  it("maps a direction to its axis", () => {
    assert.equal(axisOf("bottom"), "y");
    assert.equal(axisOf("top"), "y");
    assert.equal(axisOf("left"), "x");
    assert.equal(axisOf("right"), "x");
  });

  it("knows which way is leaving", () => {
    assert.equal(leavingSign("bottom"), 1);
    assert.equal(leavingSign("right"), 1);
    assert.equal(leavingSign("top"), -1);
    assert.equal(leavingSign("left"), -1);
  });
});

describe("rubberBand", () => {
  it("returns nothing for no travel", () => {
    assert.equal(rubberBand(0, 400), 0);
  });

  it("gives less than the distance asked for", () => {
    assert.ok(rubberBand(100, 400) < 100);
  });

  it("resists more the further it goes", () => {
    const first = rubberBand(50, 400) - rubberBand(0, 400);
    const later = rubberBand(250, 400) - rubberBand(200, 400);
    assert.ok(later < first, "resistance must rise, not stay constant");
  });

  it("never exceeds the panel's own size", () => {
    assert.ok(rubberBand(100000, 400) < 400);
  });

  it("copes with a zero-sized panel", () => {
    assert.equal(rubberBand(100, 0), 0);
  });
});

describe("offsetFor", () => {
  it("follows travel towards leaving exactly", () => {
    assert.equal(offsetFor(120, 400), 120);
  });

  it("resists travel the other way", () => {
    const resisted = offsetFor(-120, 400);
    assert.ok(resisted < 0, "still moves");
    assert.ok(resisted > -120, "but less than asked");
  });

  it("stays put when nothing moved", () => {
    assert.equal(offsetFor(0, 400), 0);
  });
});

describe("shouldDismiss", () => {
  const panel = { dimension: 400 };

  it("dismisses on a flick, however short", () => {
    const decision = shouldDismiss({ ...panel, offset: 10, velocity: FLICK_VELOCITY + 0.05 });
    assert.deepEqual(decision, { dismiss: true, reason: "flick" });
  });

  it("dismisses once dragged past a quarter of the panel", () => {
    const decision = shouldDismiss({
      ...panel,
      offset: panel.dimension * DISTANCE_RATIO + 1,
      velocity: 0,
    });
    assert.deepEqual(decision, { dismiss: true, reason: "distance" });
  });

  it("holds on when dragged slowly and not far enough", () => {
    const decision = shouldDismiss({ ...panel, offset: 40, velocity: 0.01 });
    assert.deepEqual(decision, { dismiss: false, reason: "held" });
  });

  it("holds on when flicked back, even from far away", () => {
    const decision = shouldDismiss({ ...panel, offset: 300, velocity: -0.4 });
    assert.deepEqual(decision, { dismiss: false, reason: "returned" });
  });

  it("holds on when the panel has no measurable size", () => {
    assert.equal(shouldDismiss({ offset: 500, dimension: 0, velocity: 0 }).dismiss, false);
  });
});

describe("velocityFrom", () => {
  it("returns nothing without samples", () => {
    assert.equal(velocityFrom([]), 0);
  });

  it("returns nothing from a single sample", () => {
    assert.equal(velocityFrom([{ position: 10, time: 0 }]), 0);
  });

  it("measures pixels per millisecond", () => {
    const speed = velocityFrom([
      { position: 0, time: 0 },
      { position: 50, time: 100 },
    ]);
    assert.equal(speed, 0.5);
  });

  it("is negative when travelling back", () => {
    assert.ok(
      velocityFrom([
        { position: 100, time: 0 },
        { position: 40, time: 100 },
      ]) < 0,
    );
  });

  it("ignores a long pause before a flick", () => {
    const afterPause = velocityFrom([
      { position: 0, time: 0 },
      { position: 5, time: 900 },
      { position: 75, time: 1000 },
    ]);
    // Over the whole gesture this is 0.075; over the last stretch it is 0.7.
    assert.ok(afterPause > FLICK_VELOCITY, `expected a flick, measured ${afterPause}`);
  });

  it("copes with samples sharing a timestamp", () => {
    assert.equal(
      velocityFrom([
        { position: 0, time: 5 },
        { position: 40, time: 5 },
      ]),
      0,
    );
  });
});
