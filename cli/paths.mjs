/**
 * Where a copied file lands in the target project, and how its imports have to
 * be rewritten to still find what they need once it is there.
 *
 * philcn's own files import each other by relative path with the extension
 * spelled out — that is what makes the repository run with no build step. A
 * project that receives them imports by alias, which is what every React setup
 * expects.
 *
 * Two ways of handing a component over:
 *
 *  - by default only the component is copied, and the shared behaviour is
 *    imported from the `philcn` package, so the project ends up shaped like a
 *    shadcn project: `components/ui/*` and one `lib/utils.ts`;
 *  - `--standalone` copies everything, shared behaviour included, for a project
 *    that has to carry all of its own code.
 */

/** The default places, used when the project has no components.json. */
export const DEFAULT_ALIASES = {
  ui: "@/components/ui",
  lib: "@/lib/philcn",
  utils: "@/lib/utils",
};

/** The package the shared behaviour is imported from. */
export const PACKAGE = "philcn";

export function aliasesFrom(config) {
  const aliases = config?.aliases ?? {};
  const ui = aliases.ui ?? (aliases.components ? `${aliases.components}/ui` : DEFAULT_ALIASES.ui);
  const lib = aliases.philcn ?? (aliases.lib ? `${aliases.lib}/philcn` : DEFAULT_ALIASES.lib);
  const utils = aliases.utils ?? (aliases.lib ? `${aliases.lib}/utils` : DEFAULT_ALIASES.utils);
  return { ui, lib, utils };
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
  return file;
}

const RELATIVE = /(from\s+["'])(\.[^"']+)(["'])/g;

/** The module at the end of a relative path, without its extension. */
function moduleName(specifier) {
  const clean = specifier.replace(/\.tsx?$/, "");
  const name = clean.split("/").pop();
  return name === undefined || name.length === 0 ? null : { clean, name };
}

/**
 * Rewrites the imports of a copied component so the shared behaviour comes
 * from the package and `cn` comes from the project's own utils file — the same
 * two places a shadcn component reads from.
 */
export function rewriteForPackage(source, aliases) {
  return source.replace(RELATIVE, (whole, before, specifier, after) => {
    const parsed = moduleName(specifier);
    if (parsed === null) return whole;
    const { clean, name } = parsed;

    // `cn` lives where shadcn puts it, so a block pasted from their site finds
    // it at the path it expects.
    if (name === "cn") return `${before}${aliases.utils}${after}`;
    if (clean.includes("/lib/")) return `${before}${PACKAGE}/${name}${after}`;
    if (clean.includes("/components/ui/")) return `${before}${aliases.ui}/${name}${after}`;
    if (clean.startsWith("./")) return `${before}${aliases.ui}/${name}${after}`;
    return `${before}${clean}${after}`;
  });
}

/**
 * Rewrites a file copied along with everything it needs. `self` says which
 * folder this file landed in, so an import of a neighbour still finds it.
 */
export function rewriteStandalone(source, aliases) {
  const self = aliases.self ?? aliases.ui;

  return source.replace(RELATIVE, (whole, before, specifier, after) => {
    const parsed = moduleName(specifier);
    if (parsed === null) return whole;
    const { clean, name } = parsed;

    // `cn` reads from the project's utils file either way: it is the one place
    // a pasted shadcn block expects to find it.
    if (name === "cn") return `${before}${aliases.utils}${after}`;
    if (clean.includes("/lib/")) return `${before}${aliases.lib}/${name}${after}`;
    if (clean.includes("/components/ui/")) return `${before}${aliases.ui}/${name}${after}`;
    if (clean.startsWith("./")) return `${before}${self}/${name}${after}`;
    return `${before}${clean}${after}`;
  });
}

/** Rewrites one file, knowing where it landed and how it was handed over. */
export function rewriteFile(file, source, aliases, { standalone = false } = {}) {
  if (!standalone) return rewriteForPackage(source, aliases);
  const self = file.startsWith("src/lib/") ? aliases.lib : aliases.ui;
  return rewriteStandalone(source, { ...aliases, self });
}

/**
 * Points Tailwind at philcn's compiled code.
 *
 * The shared behaviour — menus, overlays, floating panels — is imported from
 * the package rather than copied in, and some of it carries Tailwind classes.
 * Tailwind never looks inside node_modules on its own, so without this import
 * those classes are missing from the build and the components render with
 * nothing behind their class names.
 *
 * A project installed with `--standalone` keeps the shared files in its own
 * folders, where Tailwind already sees them, so it is left out there.
 */
export function withPackageSource(theme, { standalone = false } = {}) {
  if (standalone) return theme;

  const line = `@import "${PACKAGE}/source.css";`;
  if (theme.includes(line)) return theme;

  // Straight after the Tailwind import, so the two read as one thought.
  const lines = theme.split("\n");
  const at = lines.findIndex((entry) => entry.trim().startsWith('@import "tailwindcss"'));
  if (at === -1) return `${line}\n${theme}`;

  lines.splice(at + 1, 0, line);
  return lines.join("\n");
}
