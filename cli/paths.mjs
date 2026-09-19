/**
 * Where a copied file lands in the target project, and how its imports have
 * to be rewritten to still point at their neighbours once it is there.
 *
 * philcn's own files import each other by relative path with the extension
 * spelled out — that is what makes the repository run with no build step.
 * A project that receives them imports by alias and without extensions, which
 * is what every React setup expects.
 */

/** The default places, used when the project has no components.json. */
export const DEFAULT_ALIASES = {
  ui: "@/components/ui",
  lib: "@/lib/philcn",
};

export function aliasesFrom(config) {
  const aliases = config?.aliases ?? {};
  const ui = aliases.ui ?? (aliases.components ? `${aliases.components}/ui` : DEFAULT_ALIASES.ui);
  const lib = aliases.philcn ?? (aliases.lib ? `${aliases.lib}/philcn` : DEFAULT_ALIASES.lib);
  return { ui, lib };
}

/** Where one registry file goes, as a path inside the project. */
export function targetFor(file, aliases, resolveAlias) {
  if (file.startsWith("src/components/ui/")) {
    const name = file.slice("src/components/ui/".length);
    return `${resolveAlias(aliases.ui)}/${name}`;
  }
  if (file.startsWith("src/lib/")) {
    const name = file.slice("src/lib/".length);
    return `${resolveAlias(aliases.lib)}/${name}`;
  }
  if (file.startsWith("src/styles/")) {
    return file.slice("src/".length);
  }
  return file;
}

const RELATIVE = /(from\s+["'])(\.[^"']+)(["'])/g;

/**
 * Rewrites the relative imports of a copied file into the project's aliases
 * and drops the file extension. `self` says which folder this file landed in,
 * so an import of a neighbour still finds it.
 */
export function rewriteImports(source, aliases) {
  const self = aliases.self ?? aliases.ui;

  return source.replace(RELATIVE, (whole, before, specifier, after) => {
    const clean = specifier.replace(/\.tsx?$/, "");
    const name = clean.split("/").pop();
    if (name === undefined || name.length === 0) return whole;

    if (clean.includes("/lib/")) return `${before}${aliases.lib}/${name}${after}`;
    if (clean.includes("/components/ui/")) return `${before}${aliases.ui}/${name}${after}`;
    if (clean.startsWith("./")) return `${before}${self}/${name}${after}`;
    return `${before}${clean}${after}`;
  });
}

/** Rewrites one file, knowing which folder it was copied into. */
export function rewriteFile(file, source, aliases) {
  const self = file.startsWith("src/lib/") ? aliases.lib : aliases.ui;
  return rewriteImports(source, { ...aliases, self });
}
