import { basics } from "@/content/docs/basics";
import { forms } from "@/content/docs/forms";
import { overlays } from "@/content/docs/overlays";
import type { Doc } from "@/lib/docs";

/**
 * The pages that are written, gathered from one file per group.
 *
 * A component missing from here is still listed in the sidebar, marked as
 * not documented yet. Everything mechanical — the type of a prop, whether it
 * is required, the code of an example — is read from the library and from the
 * example files. What is written by hand is what a machine cannot know: why
 * you would reach for the thing, and what will bite you.
 */
export const docs: Record<string, Doc> = {
  ...basics,
  ...forms,
  ...overlays,
};

export const slugs = Object.keys(docs);
