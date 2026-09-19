import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fromPlacement, toPlacement, transformOriginFor } from "./anchored.ts";

describe("toPlacement", () => {
  it("drops the alignment when it is centred", () => {
    assert.equal(toPlacement("bottom", "center"), "bottom");
    assert.equal(toPlacement("left", "center"), "left");
  });

  it("joins a side and an alignment", () => {
    assert.equal(toPlacement("bottom", "start"), "bottom-start");
    assert.equal(toPlacement("right", "end"), "right-end");
  });
});

describe("fromPlacement", () => {
  it("reads a bare side as centred", () => {
    assert.deepEqual(fromPlacement("top"), { side: "top", align: "center" });
  });

  it("reads a side and an alignment", () => {
    assert.deepEqual(fromPlacement("bottom-start"), { side: "bottom", align: "start" });
    assert.deepEqual(fromPlacement("left-end"), { side: "left", align: "end" });
  });

  it("falls back to bottom centre for anything unexpected", () => {
    assert.deepEqual(fromPlacement(""), { side: "bottom", align: "center" });
    assert.deepEqual(fromPlacement("bottom-middle"), { side: "bottom", align: "center" });
  });
});

describe("transformOriginFor", () => {
  it("grows from the edge facing the trigger", () => {
    assert.equal(transformOriginFor("bottom"), "top center");
    assert.equal(transformOriginFor("top"), "bottom center");
    assert.equal(transformOriginFor("right"), "center left");
    assert.equal(transformOriginFor("left"), "center right");
  });

  it("grows from the nearest corner when aligned to one end", () => {
    assert.equal(transformOriginFor("bottom-start"), "top left");
    assert.equal(transformOriginFor("bottom-end"), "top right");
    assert.equal(transformOriginFor("top-start"), "bottom left");
    assert.equal(transformOriginFor("right-start"), "top left");
    assert.equal(transformOriginFor("left-end"), "bottom right");
  });

  it("never grows from its own centre", () => {
    for (const placement of ["top", "bottom", "left", "right", "bottom-start", "left-end"]) {
      assert.notEqual(transformOriginFor(placement), "center center");
    }
  });
});
