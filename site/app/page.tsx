import { Button } from "@philcn/components/ui/button.tsx";

import { CopyCommand } from "@/components/copy-command";
import { DemoCanvas } from "@/components/demo-canvas";
import { HeroDemo } from "@/components/hero-demo";
import { ArrowIcon, GitHubIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";

const stats = [
  { value: "40", label: "components" },
  { value: "169", label: "tests, all passing" },
  { value: "0", label: "lines copied from anyone" },
  { value: "2", label: "runtime dependencies, both optional" },
];

const choices = [
  {
    title: "A pressed button gives way",
    body: "It shrinks to 97% over 160 milliseconds. shadcn gives no feedback to the touch at all. The link variant is left out of it — a line of text should not shrink.",
  },
  {
    title: "Clickable things say so",
    body: "Tailwind v4 dropped the pointer cursor on buttons and shadcn did not put it back. philcn does, on every element you are meant to click.",
  },
  {
    title: "Stacked dialogs step back",
    body: "Open a dialog over another and the one underneath fades and retreats instead of piling up — and goes inert, so focus and screen readers skip it until it returns.",
  },
  {
    title: "A tall dialog scrolls itself",
    body: "Taller than the window, it scrolls inside its own frame. In shadcn it overflows and the bottom becomes unreachable.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          <div className="site-grid pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28">
            <p className="site-rise font-mono text-xs tracking-widest text-site-faint uppercase">
              A React component library
            </p>

            <h1 className="site-rise mt-6 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-7xl" style={{ animationDelay: "60ms" }}>
              Written from scratch.
              <br />
              <span className="text-site-accent pr-[0.08em] italic">Compatible</span> on purpose.
            </h1>

            <p className="site-rise mt-7 max-w-xl text-lg leading-relaxed text-site-dim" style={{ animationDelay: "120ms" }}>
              philcn carries the same API as shadcn/ui: same component names, same props,
              same import paths. Paste one of their blocks and it runs. Not one line of
              their code is in here — every component was written, tested and named from
              nothing.
            </p>

            <div className="site-rise mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "180ms" }}>
              <CopyCommand command="npx philcn@latest add button" />

              <Button
                asChild
                size="lg"
                className="bg-site-accent text-site-bg shadow-none hover:bg-site-accent/90"
              >
                <a href="#demo">
                  See it running
                  <ArrowIcon className="size-4" />
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-site-dim hover:bg-site-bg-raised hover:text-site-fg"
              >
                <a href="https://github.com/PhilibertG/philcn">
                  <GitHubIcon className="size-4" />
                  Source
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section id="demo" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
            <div>
              <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
                Paste a shadcn block. It runs.
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-site-dim">
                Same component names, same props, same import path — philcn writes its
                files to <code className="font-mono text-site-fg">components/ui</code>, the
                place shadcn blocks already point at. Nothing to rename, nothing to adapt.
              </p>

              <CodeBlock caption="the card on the right, abridged" code={heroSource} />

              <p className="mt-6 leading-relaxed text-site-dim">
                The components arrive as files you own, not as a package you render from.
                Open them, read them, change them — that is the whole idea.
              </p>
            </div>

            <DemoCanvas label="app/page.tsx">
              <HeroDemo />
            </DemoCanvas>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section className="border-y border-site-line/70 bg-site-bg-raised/40">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="py-10 pr-6">
                <div className="font-display text-5xl tracking-tight text-site-accent">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm leading-snug text-site-dim text-balance">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section id="why" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              Why it
              <br />
              exists
            </h2>

            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-site-dim">
              <p>
                My school forbids front-end libraries that hand you finished widgets and
                dashboards. Writing your own is allowed — and is, in fairness, the point of
                the exercise.
              </p>
              <p>
                So philcn is the library I needed, built the only way that counted: from
                nothing. Names, behaviour and looks match shadcn/ui, because those are the
                parts nobody owns and the parts that make pasted code work. The
                implementation underneath is mine, line for line, and the public commit
                history is the proof.
              </p>
              <p className="text-site-fg">
                Every interactive component works from the keyboard alone and announces
                itself to a screen reader. No component ships without it.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section id="choices" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-28">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Where it parts ways
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-site-dim">
            Matching shadcn pixel for pixel is the rule. These are the deliberate
            exceptions — each one written down, so anything else that differs is a bug.
          </p>

          <div className="mt-12 grid gap-px border-t border-site-line/70 sm:grid-cols-2">
            {choices.map((choice) => (
              <article key={choice.title} className="border-b border-site-line/70 py-8 pr-8">
                <h3 className="font-display text-2xl tracking-tight">{choice.title}</h3>
                <p className="mt-3 leading-relaxed text-site-dim">{choice.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-site-line/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-site-faint sm:flex-row sm:items-center">
          <span className="font-display text-xl tracking-tight text-site-dim">philcn</span>
          <span>MIT — Philibert Gentien</span>
          <a
            href="https://github.com/PhilibertG/philcn"
            className="transition-colors duration-200 hover:text-site-fg sm:ml-auto"
          >
            github.com/PhilibertG/philcn
          </a>
        </div>
      </footer>
    </>
  );
}

const heroSource = `import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

<Card>
  <CardContent className="grid gap-5">
    <Label htmlFor="name">Name</Label>
    <Input id="name" value={name} onChange={onChange} />

    <Select value={framework} onValueChange={setFramework}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="next">Next.js</SelectItem>
      </SelectContent>
    </Select>

    <Switch checked={isPublic} onCheckedChange={setPublic} />
  </CardContent>

  <CardFooter>
    <Button className="w-full">Create project</Button>
  </CardFooter>
</Card>`;

function CodeBlock({ code, caption }: { code: string; caption: string }) {
  return (
    <figure className="mt-8">
      <pre className="site-scroll max-h-[22rem] overflow-auto rounded-xl border border-site-line bg-site-bg-raised/60 p-5 font-mono text-[12.5px] leading-6 text-site-dim">
        <code>{code}</code>
      </pre>
      <figcaption className="mt-3 font-mono text-[11px] tracking-widest text-site-faint uppercase">
        {caption}
      </figcaption>
    </figure>
  );
}
