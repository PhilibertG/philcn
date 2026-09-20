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

import { HeroBackdrop } from "@/components/hero-backdrop";
import { HeroComposition } from "@/components/hero-composition";
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
import { PillLink, SiteHeader, Wordmark } from "@/components/site-header";

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
    <div className="p-2 sm:p-3" id="top">
      {/* =========================== hero card =========================== */}
      <section className="relative overflow-hidden rounded-[28px] bg-brand-canvas sm:rounded-[36px]">
        <HeroBackdrop />

        <div className="relative z-10">
          <SiteHeader />

          <div className="grid items-center gap-12 px-7 pt-14 pb-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:pt-16">
            <div>
              <p className="rise flex items-center gap-2.5 text-[13px] font-medium tracking-[0.16em] text-brand-primary uppercase">
                <span className="size-1.5 rounded-full bg-brand-primary" aria-hidden />
                Open source
              </p>

              <h1
                className="rise mt-6 text-[clamp(2.75rem,5.6vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-balance"
                style={{ animationDelay: "70ms" }}
              >
                Beautiful components
                <br />
                for <span className="text-brand-primary">React.</span>
              </h1>

              <p
                className="rise mt-6 max-w-[32rem] text-lg leading-relaxed text-brand-ink-soft"
                style={{ animationDelay: "140ms" }}
              >
                A collection of accessible, customizable and design-focused components to
                build modern interfaces — your way. Small components, big possibilities.
              </p>

              <div
                className="rise mt-9 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "210ms" }}
              >
                <PillLink href="#library">Get started</PillLink>
                <PillLink href="https://github.com/PhilibertG/philcn" tone="light">
                  Browse components
                </PillLink>
              </div>
            </div>

            <HeroComposition />
          </div>

          {/* The strip along the foot of the card, the way Sparrow lays it out. */}
          <div className="mx-7 flex flex-col gap-7 border-t border-brand-line/80 py-7 sm:mx-10 sm:flex-row sm:items-center">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px] text-brand-ink-soft">
              {stack.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <Icon className="size-[19px] text-brand-ink/70" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex gap-9 sm:ml-auto sm:gap-12">
              {figures.map((figure) => (
                <div key={figure.label}>
                  <div className="text-2xl font-semibold tracking-tight">{figure.value}</div>
                  <div className="mt-0.5 text-[13px] text-brand-ink-soft">{figure.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= library card ========================= */}
      <section
        id="library"
        className="mt-2 scroll-mt-4 rounded-[28px] bg-brand-surface px-7 py-16 sm:mt-3 sm:rounded-[36px] sm:px-10 sm:py-20"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <div>
            <p className="text-[13px] font-medium tracking-[0.16em] text-brand-ink-soft uppercase">
              The library
            </p>
            <h2 className="mt-5 text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.045em]">
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
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* ========================== values card ========================== */}
      <section
        id="why"
        className="mt-2 scroll-mt-4 rounded-[28px] bg-[#16171d] px-7 py-16 text-white sm:mt-3 sm:rounded-[36px] sm:px-10 sm:py-20"
      >
        <p className="text-[13px] font-medium tracking-[0.16em] text-white/45 uppercase">
          What we stand for
        </p>
        <h2 className="mt-5 max-w-[18ch] text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.045em]">
          Written by hand, on purpose.
        </h2>

        <div className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, body }) => (
            <article key={title} className="flex gap-4">
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-accent">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <p className="mt-1.5 leading-relaxed text-white/55">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============================ footer ============================ */}
      <footer className="relative overflow-hidden px-7 pt-16 sm:px-10">
        <div className="flex flex-col gap-5 pb-10 text-sm text-white/45 sm:flex-row sm:items-center">
          <Wordmark className="text-lg text-white" />
          <span>A modern component library for React</span>
          <span className="sm:ml-auto">MIT — Philibert Gentien</span>
          <span className="font-mono text-xs">v0.3.1 · 2026</span>
        </div>

        {/* The name, once, at the very bottom — large enough to be felt rather
            than read, and cropped by the edge of the page. */}
        <div className="bleed-mark -mb-[0.18em] translate-y-[0.06em] text-center whitespace-nowrap">
          philcn<span className="text-brand-primary/25">.</span>
        </div>
      </footer>
    </div>
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
    <figure className="overflow-hidden rounded-2xl border border-brand-line bg-brand-canvas">
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
