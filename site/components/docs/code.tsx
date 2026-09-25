import { highlight, type Language } from "@/lib/highlight";

/**
 * A block of code, coloured at build time.
 *
 * The markup Shiki returns is trusted: it is produced here, from a file in
 * this repository, and never from anything a visitor sends.
 */
export async function Code({
  code,
  lang = "tsx",
  className = "",
}: {
  code: string;
  lang?: Language;
  className?: string;
}) {
  const html = await highlight(code, lang);
  return (
    <div
      className={`code-block overflow-x-auto rounded-xl border border-brand-line bg-brand-canvas p-4 text-[13px] leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** The one-line command that puts a component in a project. */
export async function InstallCommand({ slug }: { slug: string }) {
  return <Code code={`npx philcn@latest add ${slug}`} lang="bash" />;
}
