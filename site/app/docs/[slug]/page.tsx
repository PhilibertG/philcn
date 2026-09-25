import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InstallCommand } from "@/components/docs/code";
import { ExampleSection } from "@/components/docs/example";
import { Toc } from "@/components/docs/toc";
import { docs, slugs } from "@/content/docs";
import { propRows } from "@/lib/docs";

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const doc = docs[(await params).slug];
  if (!doc) return {};
  return { title: `${doc.title} — philcn`, description: doc.summary };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const doc = docs[(await params).slug];
  if (!doc) notFound();

  const [first, ...rest] = doc.examples;
  const rows = propRows(doc);

  const toc = [
    ...doc.examples.map((example) => ({ id: example.id, title: example.title })),
    { id: "installation", title: "Installation" },
    { id: "props", title: "Props" },
    ...(doc.notes && doc.notes.length > 0 ? [{ id: "worth-knowing", title: "Worth knowing" }] : []),
  ];

  return (
    <div className="flex gap-12">
      <article className="grid min-w-0 flex-1 gap-10 xl:max-w-[840px]">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight">{doc.title}</h1>
        <p className="mt-2 text-lg text-brand-ink-soft">{doc.summary}</p>
      </header>

      {first ? <ExampleSection slug={doc.slug} example={first} /> : null}

      <p className="max-w-[70ch] text-brand-ink-soft">{doc.description}</p>

      <section id="installation" className="scroll-mt-28">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Installation</h2>
        <InstallCommand slug={doc.slug} />
        <p className="mt-2 text-sm text-brand-ink-soft">
          The file is written into your project. It is yours from then on — change it as you like.
        </p>
      </section>

      {rest.length > 0 ? (
        <section className="grid gap-8">
          <h2 className="text-xl font-semibold tracking-tight">Examples</h2>
          {rest.map((example) => (
            <ExampleSection key={example.id} slug={doc.slug} example={example} />
          ))}
        </section>
      ) : null}

      <section id="props" className="scroll-mt-28">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Props</h2>
        <div className="overflow-x-auto rounded-xl border border-brand-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-brand-canvas text-brand-ink-soft">
              <tr>
                <th className="px-4 py-2 font-medium">Prop</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">What it does</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.component}.${row.name}`} className="border-t border-brand-line align-top">
                  <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap">
                    <span className="text-brand-ink-soft">{row.component}.</span>
                    {row.name}
                    {row.required ? <span className="text-brand-primary"> *</span> : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-brand-ink-soft">{row.type}</td>
                  <td className="px-4 py-3">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-brand-ink-soft">
          Types are read from the library itself, so this table cannot describe an option the code no
          longer has.
          {doc.element ? (
            <> Everything else you pass goes straight to the underlying <code>&lt;{doc.element}&gt;</code>.</>
          ) : null}
        </p>
      </section>

      {doc.notes && doc.notes.length > 0 ? (
        <section id="worth-knowing" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Worth knowing</h2>
          <ul className="grid gap-2 text-brand-ink-soft">
            {doc.notes.map((note) => (
              <li key={note} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                <span className="max-w-[70ch]">{note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      </article>

      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
