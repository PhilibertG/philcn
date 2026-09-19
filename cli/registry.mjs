/**
 * The registry: what philcn can hand over, and what each piece needs.
 *
 * It is read from the source itself rather than written by hand — a component
 * that starts importing a new brick brings it along on its own, and the list
 * can never drift from the code.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

/** Packages that a project using philcn already has. */
const ASSUMED = new Set(["react", "react-dom", "react/jsx-runtime"]);

const IMPORT = /(?:^|\n)\s*(?:import|export)\s[^;]*?from\s+["']([^"']+)["']/g;

/** Every module path a file pulls in, in the order they appear. */
export function importsOf(source) {
  const found = [];
  for (const match of source.matchAll(IMPORT)) {
    const path = match[1];
    if (path !== undefined) found.push(path);
  }
  return found;
}

/** The package a bare import belongs to: "@scope/name" or "name". */
export function packageOf(specifier) {
  if (specifier.startsWith(".")) return null;
  const parts = specifier.split("/");
  if (specifier.startsWith("@")) return parts.slice(0, 2).join("/");
  return parts[0] ?? null;
}

function readSource(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

/**
 * Walks the imports of one file and collects every philcn file it needs,
 * following bricks that bring in other bricks.
 */
function collect(entry, root, seen, npm) {
  const path = resolve(entry);
  if (seen.has(path)) return;
  const source = readSource(path);
  if (source === null) return;
  seen.add(path);

  for (const specifier of importsOf(source)) {
    if (!specifier.startsWith(".")) {
      const name = packageOf(specifier);
      if (name !== null && !ASSUMED.has(name)) npm.add(name);
      continue;
    }
    collect(resolve(dirname(path), specifier), root, seen, npm);
  }
}

/**
 * Reads the whole registry from a philcn checkout.
 *
 * Every entry says which files to copy, which other components it pulls in,
 * and which packages the project will need.
 */
export function buildRegistry(root) {
  const uiDir = join(root, "src", "components", "ui");
  const names = readdirSync(uiDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""))
    .sort();

  const registry = {};
  for (const name of names) {
    const seen = new Set();
    const npm = new Set();
    collect(join(uiDir, `${name}.tsx`), root, seen, npm);

    const files = [...seen].map((path) => relative(root, path)).sort();
    registry[name] = {
      name,
      files,
      components: files
        .filter((file) => file.startsWith("src/components/ui/"))
        .map((file) => file.slice("src/components/ui/".length).replace(/\.tsx$/, ""))
        .filter((other) => other !== name)
        .sort(),
      dependencies: [...npm].sort(),
    };
  }
  return registry;
}
