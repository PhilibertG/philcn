import { type Doc, exampleSource, propRows } from "@/lib/docs";

/**
 * A documentation page as Markdown, for a reader that is not a browser.
 *
 * An assistant asked to use philcn does better with the whole page as text —
 * the examples, the prop types, the warnings — than with a screenshot or a
 * guess. It is generated from the same data the page renders, so the two can
 * never say different things.
 */
export function docToMarkdown(doc: Doc): string {
  const lines: string[] = [];

  lines.push(`# ${doc.title}`, "", doc.summary, "", doc.description, "");

  lines.push("## Installation", "", "```bash", `npx philcn@latest add ${doc.slug}`, "```", "");

  lines.push("## Examples", "");
  for (const example of doc.examples) {
    lines.push(`### ${example.title}`, "", example.description, "");
    lines.push("```tsx", exampleSource(doc.slug, example.id), "```", "");
  }

  const rows = propRows(doc);
  lines.push("## Props", "");
  if (rows.length === 0) {
    lines.push(
      doc.element
        ? `None of its own. Everything is passed to the underlying \`<${doc.element}>\`.`
        : "None of its own.",
      "",
    );
  } else {
    lines.push("| Prop | Type | Required | What it does |", "| --- | --- | --- | --- |");
    for (const row of rows) {
      // A table row is one line, and a pipe inside it would start a new cell.
      // Backslashes are escaped first, or escaping the pipes would produce
      // pairs that cancel each other out.
      const type = row.type
        .replace(/\s+/g, " ")
        .replace(/\\/g, "\\\\")
        .replace(/\|/g, "\\|");
      lines.push(
        `| \`${row.component}.${row.name}\` | \`${type}\` | ${row.required ? "yes" : "no"} | ${row.description} |`,
      );
    }
    lines.push("");
    if (doc.element) {
      lines.push(`Everything else is passed to the underlying \`<${doc.element}>\`.`, "");
    }
  }

  if (doc.notes && doc.notes.length > 0) {
    lines.push("## Worth knowing", "");
    for (const note of doc.notes) lines.push(`- ${note}`);
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}
