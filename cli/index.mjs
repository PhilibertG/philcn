#!/usr/bin/env node
/**
 * philcn — the command that hands a component over.
 *
 * philcn is not a package you install and import from. `philcn add button`
 * writes button.tsx into your project, where it becomes your file: yours to
 * read, yours to change, and yours to hand to a teacher as your own work.
 *
 *   philcn list                  what there is
 *   philcn add button card       copy those in, with whatever they need
 *   philcn init                  write components.json and the theme
 *
 * Flags: --cwd <dir>  --overwrite  --dry-run  --yes
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { addCommand, detect, runCommand } from "./package-manager.mjs";
import { aliasesFrom, DEFAULT_ALIASES, rewriteFile, targetFor } from "./paths.mjs";
import { buildRegistry } from "./registry.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = resolve(HERE, "..");

function parseArgs(argv) {
  const flags = { overwrite: false, dryRun: false, yes: false, cwd: process.cwd() };
  const rest = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--overwrite") flags.overwrite = true;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--yes" || arg === "-y") flags.yes = true;
    else if (arg === "--cwd") {
      index += 1;
      flags.cwd = resolve(argv[index] ?? ".");
    } else if (arg !== undefined) rest.push(arg);
  }
  return { flags, rest };
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Turns an alias into a real folder. The project's tsconfig is asked first;
 * failing that, a `src` folder decides, which is where most setups put code.
 */
function aliasResolver(cwd) {
  const tsconfig =
    readJson(join(cwd, "tsconfig.json")) ?? readJson(join(cwd, "jsconfig.json")) ?? {};
  const paths = tsconfig.compilerOptions?.paths ?? {};

  return (alias) => {
    for (const [pattern, targets] of Object.entries(paths)) {
      if (!pattern.endsWith("/*")) continue;
      const prefix = pattern.slice(0, -1);
      if (!alias.startsWith(prefix)) continue;
      const target = Array.isArray(targets) ? targets[0] : targets;
      if (typeof target !== "string") continue;
      const base = target.replace(/\/\*$/, "").replace(/^\.\//, "");
      return join(base, alias.slice(prefix.length));
    }
    const inner = alias.replace(/^@\//, "");
    return existsSync(join(cwd, "src")) ? join("src", inner) : inner;
  };
}

// A CLI is often read through `head` or `less`, which close the pipe early.
// That is not an error worth a stack trace.
process.stdout.on("error", (error) => {
  if (error.code === "EPIPE") process.exit(0);
  throw error;
});

/** The package manager this project uses, so every message names it right. */
function managerIn(cwd) {
  return detect({
    agent: process.env["npm_config_user_agent"],
    exists: (file) => existsSync(join(cwd, file)),
  });
}

function say(message = "") {
  process.stdout.write(`${message}\n`);
}

function fail(message) {
  process.stderr.write(`philcn: ${message}\n`);
  process.exit(1);
}

/** Every file a set of components needs, with nothing listed twice. */
function filesFor(registry, names) {
  const files = new Set();
  const packages = new Set();
  const missing = [];

  for (const name of names) {
    const entry = registry[name];
    if (entry === undefined) {
      missing.push(name);
      continue;
    }
    for (const file of entry.files) files.add(file);
    for (const dependency of entry.dependencies) packages.add(dependency);
  }
  return { files: [...files].sort(), packages: [...packages].sort(), missing };
}

function commandList(registry) {
  const names = Object.keys(registry);
  say(`philcn — ${names.length} components`);
  say();
  for (const name of names) {
    const entry = registry[name];
    const needs = entry.components.length > 0 ? `  (brings ${entry.components.join(", ")})` : "";
    say(`  ${name}${needs}`);
  }
  say();
  say(`${runCommand(managerIn(process.cwd()), "philcn add <name…>")} to copy one in.`);
}

function commandAdd(registry, names, flags) {
  if (names.length === 0) fail("say which components to add, or run `philcn list`.");

  const { files, packages, missing } = filesFor(registry, names);
  if (missing.length > 0) {
    fail(`unknown component: ${missing.join(", ")}. Run \`philcn list\` to see them all.`);
  }

  const config = readJson(join(flags.cwd, "components.json"));
  const aliases = aliasesFrom(config);
  const resolveAlias = aliasResolver(flags.cwd);

  const written = [];
  const skipped = [];

  for (const file of files) {
    const source = readFileSync(join(SOURCE_ROOT, file), "utf8");
    const target = join(flags.cwd, targetFor(file, aliases, resolveAlias));

    if (existsSync(target) && !flags.overwrite) {
      skipped.push(target);
      continue;
    }
    if (!flags.dryRun) {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, rewriteFile(file, source, aliases));
    }
    written.push(target);
  }

  say(flags.dryRun ? "Would write:" : "Written:");
  for (const path of written) say(`  ${path.replace(`${flags.cwd}/`, "")}`);

  if (skipped.length > 0) {
    say();
    say("Left alone, already there (use --overwrite to replace):");
    for (const path of skipped) say(`  ${path.replace(`${flags.cwd}/`, "")}`);
  }

  if (packages.length > 0) {
    say();
    say(`These components need: ${addCommand(managerIn(flags.cwd), packages)}`);
  }
}

function commandInit(flags) {
  const target = join(flags.cwd, "components.json");
  if (existsSync(target) && !flags.overwrite) {
    fail("components.json is already there. Use --overwrite to replace it.");
  }

  // The stylesheet goes where the project keeps its source, and the config has
  // to name that same place: a path written down that points nowhere sends the
  // reader looking for a file that is not there.
  const stylesheet = existsSync(join(flags.cwd, "src"))
    ? join("src", "styles", "philcn.css")
    : join("styles", "philcn.css");

  const config = {
    $schema: "https://philcn.dev/schema.json",
    style: "default",
    tsx: true,
    tailwind: { css: stylesheet, baseColor: "neutral" },
    // Same shape as shadcn's file, plus one key of our own: `philcn` is the
    // folder the shared bricks go into, kept apart from the project's own lib.
    aliases: { components: "@/components", ui: "@/components/ui", lib: "@/lib", philcn: DEFAULT_ALIASES.lib },
  };

  if (!flags.dryRun) writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
  say(`${flags.dryRun ? "Would write" : "Written"}: components.json`);

  const css = join(flags.cwd, stylesheet);
  if (!existsSync(css)) {
    if (!flags.dryRun) {
      mkdirSync(dirname(css), { recursive: true });
      writeFileSync(css, readFileSync(join(SOURCE_ROOT, "src/styles/philcn.css"), "utf8"));
    }
    say(`${flags.dryRun ? "Would write" : "Written"}: ${css.replace(`${flags.cwd}/`, "")}`);
  }

  say();
  say("Import that stylesheet once, at the top of your app.");
  say(`Then: ${runCommand(managerIn(flags.cwd), "philcn add button")}`);
}

function main(argv) {
  const { flags, rest } = parseArgs(argv);
  const [command, ...names] = rest;

  if (command === undefined || command === "help" || command === "--help") {
    say("philcn <command>");
    say();
    say("  list                 show every component");
    say("  add <name…>          copy components into this project");
    say("  init                 write components.json and the theme");
    say();
    say("  --cwd <dir>  --overwrite  --dry-run");
    return;
  }

  if (command === "init") return commandInit(flags);

  const registry = buildRegistry(SOURCE_ROOT);
  if (command === "list") return commandList(registry);
  if (command === "add") return commandAdd(registry, names, flags);

  fail(`unknown command "${command}". Try \`philcn help\`.`);
}

main(process.argv.slice(2));
