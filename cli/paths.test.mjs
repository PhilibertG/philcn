import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { aliasesFrom, DEFAULT_ALIASES, rewriteFile, targetFor } from "./paths.mjs";

const aliases = { ui: "@/components/ui", lib: "@/lib/philcn" };
const resolveAlias = (alias) => alias.replace(/^@\//, "src/");

describe("aliasesFrom", () => {
  it("falls back to the usual places", () => {
    assert.deepEqual(aliasesFrom(null), DEFAULT_ALIASES);
    assert.deepEqual(aliasesFrom({}), DEFAULT_ALIASES);
  });

  it("reads a components.json written by philcn", () => {
    const config = { aliases: { ui: "@/ui", lib: "@/lib", philcn: "@/lib/philcn" } };
    assert.deepEqual(aliasesFrom(config), { ui: "@/ui", lib: "@/lib/philcn" });
  });

  it("puts the bricks in their own folder under a shadcn lib alias", () => {
    const config = { aliases: { components: "@/components", lib: "@/lib" } };
    assert.deepEqual(aliasesFrom(config), { ui: "@/components/ui", lib: "@/lib/philcn" });
  });
});

describe("targetFor", () => {
  it("sends a component to the ui folder", () => {
    assert.equal(
      targetFor("src/components/ui/button.tsx", aliases, resolveAlias),
      "src/components/ui/button.tsx",
    );
  });

  it("sends a brick to the philcn folder", () => {
    assert.equal(targetFor("src/lib/cn.ts", aliases, resolveAlias), "src/lib/philcn/cn.ts");
  });
});

describe("rewriteFile", () => {
  it("turns a component's imports into aliases and drops the extension", () => {
    const source = [
      'import * as React from "react";',
      'import { cn } from "../../lib/cn.ts";',
      'import { Button } from "./button.tsx";',
    ].join("\n");

    assert.equal(
      rewriteFile("src/components/ui/alert-dialog.tsx", source, aliases),
      [
        'import * as React from "react";',
        'import { cn } from "@/lib/philcn/cn";',
        'import { Button } from "@/components/ui/button";',
      ].join("\n"),
    );
  });

  it("keeps a brick's neighbours in the brick folder", () => {
    const source = 'import { cn } from "./cn.ts";\nimport { Floating } from "./floating.tsx";';
    assert.equal(
      rewriteFile("src/lib/menu.tsx", source, aliases),
      'import { cn } from "@/lib/philcn/cn";\nimport { Floating } from "@/lib/philcn/floating";',
    );
  });

  it("leaves packages alone", () => {
    const source = 'import { useFloating } from "@floating-ui/react-dom";';
    assert.equal(rewriteFile("src/lib/floating.tsx", source, aliases), source);
  });

  it("rewrites a type-only import too", () => {
    const source = 'import type { Side } from "../../lib/anchored.ts";';
    assert.equal(
      rewriteFile("src/components/ui/popover.tsx", source, aliases),
      'import type { Side } from "@/lib/philcn/anchored";',
    );
  });
});
