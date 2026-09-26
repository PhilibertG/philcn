import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * What a documentation page is made of, and where its pieces come from.
 *
 * Nothing here is written twice: an example is a real file that the page both
 * renders and shows, and a prop's type is read from the library's own types.
 * The only thing written by hand is the sentence that explains why you would
 * use the thing.
 */
export type Example = {
  /** The file under `examples/<component>/`, without its extension. */
  id: string;
  title: string;
  description: string;
  /** The example itself, imported so the page can run it. */
  Component: React.ComponentType;
};

export type PropNote = {
  /** The exported component the prop belongs to, e.g. `DialogContent`. */
  component: string;
  name: string;
  description: string;
};

export type Doc = {
  slug: string;
  title: string;
  /** One line, shown under the title and in the sidebar's tooltip. */
  summary: string;
  /** The paragraph under the first example. Plain sentences, no jargon. */
  description: string;
  /** The element the rest of the props go to, e.g. `button`. */
  element?: string;
  examples: Example[];
  props: PropNote[];
  /** Anything worth knowing that the props cannot say. */
  notes?: string[];
};

type PropType = { type: string; required: boolean };
type Props = Record<string, Record<string, Record<string, PropType>>>;

let cache: Props | null = null;

/**
 * The generated table of every prop of every component.
 *
 * Read from disk rather than imported: it is 3.5 MB of types, and a page
 * needs a dozen lines of it. Reading it here keeps it out of what the browser
 * is sent.
 */
function allProps(): Props {
  if (!cache) {
    const file = join(process.cwd(), "generated/props.json");
    cache = JSON.parse(readFileSync(file, "utf8")) as Props;
  }
  return cache;
}

export type PropRow = PropNote & PropType;

/**
 * The rows of a page's prop table, each one carrying the type the library
 * really declares. A prop the code no longer has stops the build here, which
 * is the point: a page cannot drift away from the component it describes.
 */
export function propRows(doc: Doc): PropRow[] {
  const file = allProps()[doc.slug];
  if (!file) throw new Error(`No extracted props for "${doc.slug}". Run npm run prebuild.`);

  return doc.props.map((note) => {
    const component = file[note.component];
    if (!component) {
      throw new Error(`"${note.component}" is not exported by ${doc.slug}.tsx`);
    }
    const prop = component[note.name];
    if (!prop) {
      throw new Error(`"${note.component}" has no prop "${note.name}" any more (${doc.slug}).`);
    }
    return { ...note, ...prop };
  });
}

/**
 * The source of an example, exactly the file the page just rendered — with
 * one substitution.
 *
 * The site imports the components from the library's own folder, through an
 * alias of its own. A reader's project has them under `@/components/ui`,
 * which is where `philcn add` writes them, so that is what the code shows.
 * Anything else would be an import that does not exist in their project.
 */
export function exampleSource(slug: string, id: string): string {
  const source = readFileSync(join(process.cwd(), "examples", slug, `${id}.tsx`), "utf8");
  return source
    .replace(/@philcn\/components\/ui\/([\w-]+)\.tsx/g, "@/components/ui/$1")
    .trimEnd();
}
