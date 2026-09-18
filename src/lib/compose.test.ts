import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cn } from "./cn.ts";
import { composeEventHandlers, composeRefs, mergeProps } from "./compose.ts";

describe("composeRefs", () => {
  it("calls every function ref", () => {
    const seen: string[] = [];
    const ref = composeRefs<string>(
      (node) => {
        seen.push(`a:${node}`);
      },
      (node) => {
        seen.push(`b:${node}`);
      },
    );
    ref("node");
    assert.deepEqual(seen, ["a:node", "b:node"]);
  });

  it("assigns object refs", () => {
    const objectRef: { current: string | null } = { current: null };
    composeRefs<string>(objectRef)("node");
    assert.equal(objectRef.current, "node");
  });

  it("mixes both forms and tolerates gaps", () => {
    const objectRef: { current: string | null } = { current: null };
    let fromFunction: string | null = null;
    composeRefs<string>(objectRef, undefined, (node) => {
      fromFunction = node;
    })("node");
    assert.equal(objectRef.current, "node");
    assert.equal(fromFunction, "node");
  });

  it("passes null through on unmount", () => {
    const objectRef: { current: string | null } = { current: "node" };
    composeRefs<string>(objectRef)(null);
    assert.equal(objectRef.current, null);
  });
});

describe("composeEventHandlers", () => {
  it("runs the caller's handler before ours", () => {
    const order: string[] = [];
    const handler = composeEventHandlers<{ defaultPrevented: boolean }>(
      () => order.push("theirs"),
      () => order.push("ours"),
    );
    handler({ defaultPrevented: false });
    assert.deepEqual(order, ["theirs", "ours"]);
  });

  it("lets the caller cancel the built-in behaviour", () => {
    let ours = false;
    const handler = composeEventHandlers<{ defaultPrevented: boolean }>(
      () => undefined,
      () => {
        ours = true;
      },
    );
    handler({ defaultPrevented: true });
    assert.equal(ours, false);
  });

  it("can be told to run anyway", () => {
    let ours = false;
    const handler = composeEventHandlers<{ defaultPrevented: boolean }>(
      () => undefined,
      () => {
        ours = true;
      },
      { checkForDefaultPrevented: false },
    );
    handler({ defaultPrevented: true });
    assert.equal(ours, true);
  });

  it("tolerates a missing handler on either side", () => {
    assert.doesNotThrow(() => {
      composeEventHandlers<{ defaultPrevented: boolean }>(undefined, undefined)({
        defaultPrevented: false,
      });
    });
  });
});

describe("mergeProps", () => {
  it("lets the child override a plain value", () => {
    const merged = mergeProps({ id: "slot" }, { id: "child" }, cn);
    assert.equal(merged["id"], "child");
  });

  it("keeps slot props the child does not set", () => {
    const merged = mergeProps({ id: "slot", role: "button" }, { id: "child" }, cn);
    assert.equal(merged["role"], "button");
  });

  it("chains event handlers, child first", () => {
    const order: string[] = [];
    const merged = mergeProps(
      { onClick: () => order.push("slot") },
      { onClick: () => order.push("child") },
      cn,
    );
    (merged["onClick"] as () => void)();
    assert.deepEqual(order, ["child", "slot"]);
  });

  it("keeps the slot handler when the child has none", () => {
    let called = false;
    const merged = mergeProps(
      {
        onClick: () => {
          called = true;
        },
      },
      {},
      cn,
    );
    (merged["onClick"] as () => void)();
    assert.equal(called, true);
  });

  it("merges className and resolves conflicts", () => {
    const merged = mergeProps({ className: "px-2 font-bold" }, { className: "px-4" }, cn);
    assert.equal(merged["className"], "font-bold px-4");
  });

  it("merges style, child wins per property", () => {
    const merged = mergeProps(
      { style: { color: "red", margin: 0 } },
      { style: { color: "blue" } },
      cn,
    );
    assert.deepEqual(merged["style"], { color: "blue", margin: 0 });
  });
});
