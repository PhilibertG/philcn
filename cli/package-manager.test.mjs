import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addCommand,
  detect,
  fromLockfiles,
  fromUserAgent,
  runCommand,
} from "./package-manager.mjs";

describe("fromUserAgent", () => {
  it("reads each of the four", () => {
    assert.equal(fromUserAgent("npm/10.8.2 node/v22.0.0 linux x64"), "npm");
    assert.equal(fromUserAgent("pnpm/9.1.0 npm/? node/v22.0.0 linux x64"), "pnpm");
    assert.equal(fromUserAgent("yarn/4.1.0 npm/? node/v22.0.0 linux x64"), "yarn");
    assert.equal(fromUserAgent("bun/1.1.0 npm/? node/v22.0.0 linux x64"), "bun");
  });

  it("says nothing when there is nothing to read", () => {
    assert.equal(fromUserAgent(undefined), null);
    assert.equal(fromUserAgent(""), null);
    assert.equal(fromUserAgent("deno/1.0.0"), null);
  });
});

describe("fromLockfiles", () => {
  const only = (name) => (file) => file === name;

  it("recognises each lockfile", () => {
    assert.equal(fromLockfiles(only("bun.lockb")), "bun");
    assert.equal(fromLockfiles(only("bun.lock")), "bun");
    assert.equal(fromLockfiles(only("pnpm-lock.yaml")), "pnpm");
    assert.equal(fromLockfiles(only("yarn.lock")), "yarn");
    assert.equal(fromLockfiles(only("package-lock.json")), "npm");
  });

  it("prefers the first of the four when a project carries several", () => {
    // A project migrated from npm to pnpm often keeps both files around.
    assert.equal(
      fromLockfiles((file) => file === "pnpm-lock.yaml" || file === "package-lock.json"),
      "pnpm",
    );
  });

  it("says nothing when there is no lockfile", () => {
    assert.equal(fromLockfiles(() => false), null);
  });
});

describe("detect", () => {
  it("believes the manager that invoked it before the lockfile", () => {
    assert.equal(
      detect({ agent: "bun/1.1.0 npm/? node/v22", exists: (f) => f === "package-lock.json" }),
      "bun",
    );
  });

  it("falls back to the lockfile", () => {
    assert.equal(detect({ agent: undefined, exists: (f) => f === "yarn.lock" }), "yarn");
  });

  it("falls back to npm when nothing says otherwise", () => {
    assert.equal(detect({}), "npm");
    assert.equal(detect(), "npm");
  });
});

describe("addCommand", () => {
  it("speaks each manager's own wording", () => {
    assert.equal(addCommand("npm", ["react-hook-form"]), "npm install react-hook-form");
    assert.equal(addCommand("pnpm", ["react-hook-form"]), "pnpm add react-hook-form");
    assert.equal(addCommand("yarn", ["react-hook-form"]), "yarn add react-hook-form");
    assert.equal(addCommand("bun", ["react-hook-form"]), "bun add react-hook-form");
  });

  it("lists several packages at once", () => {
    assert.equal(addCommand("bun", ["a", "b"]), "bun add a b");
  });
});

describe("runCommand", () => {
  it("speaks each manager's one-off runner", () => {
    assert.equal(runCommand("npm", "philcn add button"), "npx philcn add button");
    assert.equal(runCommand("bun", "philcn add button"), "bunx philcn add button");
    assert.equal(runCommand("pnpm", "philcn add button"), "pnpm dlx philcn add button");
    assert.equal(runCommand("yarn", "philcn add button"), "yarn dlx philcn add button");
  });
});
