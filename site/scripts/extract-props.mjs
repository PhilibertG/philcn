/**
 * Reads the library's own types and writes down, for every component, the
 * props it really accepts and the type of each one.
 *
 * The documentation pages name the props worth explaining and write the
 * sentence that explains them; the type and whether it is required come from
 * here. A page can therefore never show a type the code has changed, and
 * naming a prop that no longer exists stops the build.
 *
 * Runs before `next build`. The result is generated, never committed.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { API, SymbolFlags } from "typescript/unstable/sync";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const componentsDir = join(root, "src/components/ui");
const outFile = resolve(here, "../generated/props.json");

const api = new API({ cwd: root });
const snapshot = api.updateSnapshot({ openProjects: [join(root, "tsconfig.json")] });
const project = snapshot.getProject(join(root, "tsconfig.json"));
if (!project) throw new Error("the library's tsconfig.json did not load");
const checker = project.checker;

/** The props of one exported component, as a map of name to type. */
function propsOf(type) {
  const props = {};
  for (const member of checker.getPropertiesOfType(type)) {
    const name = member.name;
    if (name.startsWith("__")) continue;
    props[name] = {
      type: checker.typeToString(checker.getTypeOfSymbol(member)).replace(/ \| undefined$/, ""),
      required: (member.flags & SymbolFlags.Optional) === 0,
    };
  }
  return props;
}

/** The type of what a component is called with, whichever shape it is written in. */
function propsTypeOf(symbol) {
  const type = checker.getTypeOfSymbol(symbol);
  const [signature] = checker.getSignaturesOfType(type, 0);
  const [parameter] = signature?.getParameters() ?? [];
  return parameter ? checker.getTypeOfSymbol(parameter) : null;
}

const result = {};
for (const fileName of readdirSync(componentsDir).filter((name) => name.endsWith(".tsx"))) {
  const source = project.program.getSourceFile(join(componentsDir, fileName));
  if (!source) continue;
  const moduleSymbol = checker.getSymbolAtLocation(source);
  if (!moduleSymbol) continue;

  const components = {};
  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    // Components are capitalised; the rest of an export list is types,
    // variant helpers and hooks, which the pages describe in prose.
    if (!/^[A-Z]/.test(exported.name)) continue;
    const propsType = propsTypeOf(exported);
    if (!propsType) continue;
    components[exported.name] = propsOf(propsType);
  }

  if (Object.keys(components).length > 0) {
    result[fileName.replace(/\.tsx$/, "")] = components;
  }
}

api.close();

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(result)}\n`);

const components = Object.values(result).reduce((total, file) => total + Object.keys(file).length, 0);
console.log(`props.json: ${components} components in ${Object.keys(result).length} files`);
