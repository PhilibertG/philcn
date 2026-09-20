import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { buildRegistry, importsOf, packageOf } from "./registry.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("importsOf", () => {
  it("finds plain, type-only and re-exported imports", () => {
    const source = [
      'import * as React from "react";',
      'import { cn } from "./cn.ts";',
      'import type { Side } from "./anchored.ts";',
      'export { Button } from "./button.tsx";',
    ].join("\n");

    assert.deepEqual(importsOf(source), ["react", "./cn.ts", "./anchored.ts", "./button.tsx"]);
  });

  it("is not fooled by the word import inside a string", () => {
    assert.deepEqual(importsOf('const help = "run import from the menu";'), []);
  });
});

describe("packageOf", () => {
  it("reads a scoped package", () => {
    assert.equal(packageOf("@floating-ui/react-dom"), "@floating-ui/react-dom");
  });

  it("reads a plain package and its subpath", () => {
    assert.equal(packageOf("react"), "react");
    assert.equal(packageOf("react-dom/client"), "react-dom");
  });

  it("says nothing for a relative path", () => {
    assert.equal(packageOf("./cn.ts"), null);
  });
});

describe("buildRegistry", () => {
  const registry = buildRegistry(ROOT);

  it("lists every component in the ui folder", () => {
    assert.ok(registry["button"] !== undefined);
    assert.ok(registry["calendar"] !== undefined);
    assert.ok(Object.keys(registry).length > 30);
  });

  it("brings along the bricks a component needs", () => {
    assert.ok(registry["button"].files.includes("src/components/ui/button.tsx"));
    assert.ok(registry["button"].files.includes("src/lib/cn.ts"));
    assert.ok(registry["button"].files.includes("src/lib/slot.tsx"));
  });

  it("follows a brick that needs other bricks", () => {
    // The menu hangs off the floating panel, which hangs off the positioning
    // engine: asking for the menu has to bring all three.
    assert.ok(registry["dropdown-menu"].files.includes("src/lib/menu.tsx"));
    assert.ok(registry["dropdown-menu"].files.includes("src/lib/floating.tsx"));
    assert.ok(registry["dropdown-menu"].files.includes("src/lib/anchored.ts"));
  });

  it("names the components one component pulls in", () => {
    assert.deepEqual(registry["toggle-group"].components, ["toggle"]);
    assert.deepEqual(registry["button"].components, []);
  });

  it("names the packages the project will need", () => {
    // Every component joins class names; a component with declensions also
    // needs the one that builds them.
    assert.deepEqual(registry["button"].dependencies, [
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ]);
    // Only the ones that float need the positioning engine on top.
    assert.deepEqual(registry["dropdown-menu"].dependencies, [
      "@floating-ui/react-dom",
      "clsx",
      "tailwind-merge",
    ]);
    assert.ok(!registry["button"].dependencies.includes("@floating-ui/react-dom"));
  });

  it("never lists a file twice", () => {
    for (const entry of Object.values(registry)) {
      assert.equal(new Set(entry.files).size, entry.files.length);
    }
  });
});
