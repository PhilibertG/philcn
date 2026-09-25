import { Code } from "@/components/docs/code";
import { ExampleTabs } from "@/components/docs/example-tabs";
import { exampleSource, type Example } from "@/lib/docs";

/**
 * One example on a documentation page: a heading, a sentence, the component
 * running, and the file that produced it.
 *
 * The preview and the code are the same file. There is no way for them to
 * disagree, which is the whole reason the source is read from disk instead
 * of written into the page.
 */
export function ExampleSection({ slug, example }: { slug: string; example: Example }) {
  const { Component } = example;
  return (
    <section id={example.id} className="scroll-mt-28">
      <h3 className="text-lg font-semibold tracking-tight">{example.title}</h3>
      <p className="mt-1 mb-4 text-brand-ink-soft">{example.description}</p>
      <ExampleTabs
        preview={<Component />}
        code={<Code code={exampleSource(slug, example.id)} />}
      />
    </section>
  );
}
