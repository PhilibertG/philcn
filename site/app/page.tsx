import { Badge } from "@philcn/components/ui/badge.tsx";
import { Button } from "@philcn/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@philcn/components/ui/card.tsx";
import { Input } from "@philcn/components/ui/input.tsx";
import { Label } from "@philcn/components/ui/label.tsx";
import { Progress } from "@philcn/components/ui/progress.tsx";
import { Skeleton } from "@philcn/components/ui/skeleton.tsx";

import { HeroComposition } from "@/components/hero-composition";
import { HeroShader } from "@/components/hero-shader";
import {
  BoltIcon,
  GitHubIcon,
  HeartIcon,
  KeyboardIcon,
  LayersIcon,
  ReactIcon,
  TailwindIcon,
  TypeScriptIcon,
} from "@/components/icons";
import { SiteHeader, Wordmark } from "@/components/site-header";

const stack = [
  { icon: ReactIcon, label: "React" },
  { icon: TailwindIcon, label: "Tailwind CSS" },
  { icon: TypeScriptIcon, label: "TypeScript" },
  { icon: GitHubIcon, label: "GitHub" },
];

const figures = [
  { value: "40+", label: "Components" },
  { value: "169", label: "Tests passing" },
  { value: "0", label: "Lines copied" },
];

const values = [
  {
    icon: LayersIcon,
    title: "Accessible by default",
    body: "Every interactive component works from the keyboard alone and announces itself to a screen reader. None ships without it.",
  },
  {
    icon: BoltIcon,
    title: "Yours to keep",
    body: "Components land in your project as files you own — not a package you render from. Open them, read them, change them.",
  },
  {
    icon: KeyboardIcon,
    title: "Drop-in compatible",
    body: "Same component names, same props, same import paths as shadcn/ui. Paste one of their blocks and it runs.",
  },
  {
    icon: HeartIcon,
    title: "Written from nothing",
    body: "Not one line comes from another library. The names and the look are shared on purpose; the code underneath is original.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* ============================ hero ============================ */}
        <section className="relative overflow-hidden">
          <HeroShader className="pointer-events-none absolute inset-0 h-full w-full" />

          <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:pt-20">
            <div>
              <p className="rise flex items-center gap-2.5 text-[13px] font-medium tracking-[0.16em] text-brand-primary uppercase">
                <span className="size-1.5 rounded-full bg-brand-primary" aria-hidden />
                Open source
              </p>

              <h1
                className="rise mt-6 text-[clamp(2.75rem,6vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance"
                style={{ animationDelay: "70ms" }}
              >
                Beautiful components
                <br />
                for <span className="text-brand-primary">React.</span>
              </h1>

              <p
                className="rise mt-6 max-w-[34rem] text-lg leading-relaxed text-brand-ink-soft"
                style={{ animationDelay: "140ms" }}
              >
                A collection of accessible, customizable and design-focused components to
                build modern interfaces — your way. Small components, big possibilities.
              </p>

              <div
                className="rise mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "210ms" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-brand-ink px-7 text-[15px] shadow-[0_2px_10px_-2px_rgba(17,18,22,.4)] hover:bg-brand-ink/90"
                >
                  <a href="#library">
                    Get started
                    <span aria-hidden>→</span>
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 rounded-full border border-brand-line bg-white/70 px-7 text-[15px] backdrop-blur-sm hover:bg-white"
                >
                  <a href="#library">Browse components</a>
                </Button>
              </div>

              <ul
                className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-[15px] text-brand-ink-soft"
                style={{ animationDelay: "280ms" }}
              >
                {stack.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <Icon className="size-[19px] text-brand-ink/70" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <HeroComposition />
          </div>

          {/* ------------------------- figures ------------------------- */}
          <div className="relative mx-auto max-w-[1180px] px-6">
            <div className="flex flex-col gap-8 border-t border-brand-line/80 py-9 sm:flex-row sm:items-center">
              <div className="flex items-center gap-5">
                <span className="font-mono text-sm text-brand-primary">01</span>
                <span className="h-px w-10 bg-brand-line" aria-hidden />
                <p className="max-w-[16rem] text-sm leading-snug text-brand-ink-soft">
                  A modern foundation for your next project.
                </p>
              </div>

              <div className="flex gap-10 sm:ml-auto sm:gap-14">
                {figures.map((figure) => (
                  <div key={figure.label} className="text-center">
                    <div className="text-2xl font-semibold tracking-tight">{figure.value}</div>
                    <div className="mt-1 text-[13px] text-brand-ink-soft">{figure.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================== library =========================== */}
        <section id="library" className="mx-auto max-w-[1180px] scroll-mt-20 px-6 py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
            <div>
              <p className="text-[13px] font-medium tracking-[0.16em] text-brand-ink-soft uppercase">
                The library
              </p>
              <h2 className="mt-5 text-[clamp(2.25rem,4.5vw,3.4rem)] leading-[1.04] font-semibold tracking-[-0.04em]">
                Everything you need.
              </h2>
            </div>

            <div className="lg:pb-3">
              <p className="leading-relaxed text-brand-ink-soft">
                From the quiet pieces you never notice — button, input, card — to the ones
                that are hard to get right: dialogs, menus, a calendar, a command palette.
                Forty of them, each written by hand.
              </p>
              <a
                href="https://github.com/PhilibertG/philcn"
                className="mt-5 inline-flex items-center gap-2 font-medium text-brand-primary transition-transform duration-200 hover:translate-x-0.5"
              >
                Explore all components
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Real components, on philcn's own tokens — no site colours here, so
              what you see is what lands in your project. */}
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ShowcaseTile title="Cards and type" caption="card · badge">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Monthly report</CardTitle>
                  <CardDescription>September 2026</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Badge>shipped</Badge>
                  <Badge variant="secondary">40 components</Badge>
                </CardContent>
              </Card>
            </ShowcaseTile>

            <ShowcaseTile title="Forms" caption="label · input · button">
              <div className="grid w-full gap-3">
                <Label htmlFor="showcase-email">Email</Label>
                <Input id="showcase-email" placeholder="you@example.com" />
                <Button className="w-full">Subscribe</Button>
              </div>
            </ShowcaseTile>

            <ShowcaseTile title="Feedback" caption="progress · skeleton">
              <div className="grid w-full gap-4">
                <Progress value={68} />
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            </ShowcaseTile>
          </div>
        </section>

        {/* ============================ values ============================ */}
        <section
          id="values"
          className="border-t border-brand-line/80 bg-white/60 scroll-mt-20"
        >
          <div className="mx-auto max-w-[1180px] px-6 py-20">
            <p className="text-[13px] font-medium tracking-[0.16em] text-brand-ink-soft uppercase">
              What we stand for
            </p>

            <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {values.map(({ icon: Icon, title, body }) => (
                <article key={title} className="flex gap-4">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1.5 leading-relaxed text-brand-ink-soft">{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ============================ footer ============================ */}
      <footer className="border-t border-brand-line/80">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-6 py-10 text-sm text-brand-ink-soft sm:flex-row sm:items-center">
          <Wordmark className="text-lg text-brand-ink" />
          <span>A modern component library for React</span>
          <span className="sm:ml-auto">MIT — Philibert Gentien</span>
          <span className="font-mono text-xs">v0.3.1 · 2026</span>
        </div>
      </footer>
    </>
  );
}

/** A component demo, framed so the site's colours stop at its border. */
function ShowcaseTile({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_1px_2px_rgba(17,18,22,.04),0_16px_40px_-28px_rgba(17,18,22,.35)]">
      <figcaption className="flex items-baseline gap-3 border-b border-brand-line/80 px-5 py-3">
        <span className="text-sm font-medium">{title}</span>
        <span className="ml-auto font-mono text-[11px] text-brand-ink-soft">{caption}</span>
      </figcaption>
      <div className="flex min-h-[188px] items-center justify-center bg-background p-6 text-foreground">
        {children}
      </div>
    </figure>
  );
}
