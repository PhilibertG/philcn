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

import { ComponentShowcase } from "@/components/component-showcase";
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
import { ShaderCanvas } from "@/components/shader-canvas";
import { beams } from "@/components/shaders";
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
      <SiteHeader />

      {/* ====================== hero card, on ink ====================== */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#0A0B0F] sm:rounded-[36px]">
        <ShaderCanvas
          fragment={beams.fragment}
          fallback={beams.fallback}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* The top of the card is darkened so the navigation, which has no
            fill of its own until the page scrolls, stays readable over the
            brightest beams. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,11,15,.88) 0%, rgba(10,11,15,.55) 45%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* The beams run bright; this keeps the words on top of them
            readable without dimming the whole card. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 52% at 50% 52%, rgba(10,11,15,.78) 0%, rgba(10,11,15,.52) 45%, transparent 78%)",
          }}
          aria-hidden
        />

        {/* Text only, and the card stops a little short of the window, so
            the next one shows beneath it and says there is more to come. */}
        <div className="relative z-10 flex min-h-[86svh] flex-col justify-center px-6 pt-28 pb-16 lg:px-20">
          <div className="mx-auto max-w-[46rem] text-center">

            <h1
              className="rise text-[clamp(2.9rem,6.4vw,5.2rem)] leading-[0.96] font-semibold tracking-[-0.05em] text-balance text-white"
              style={{ animationDelay: "70ms" }}
            >
              Beautiful components
              <br />
              for <span className="text-brand-accent">React.</span>
            </h1>

            <p
              className="rise mx-auto mt-7 max-w-[34rem] text-lg leading-relaxed text-white/60"
              style={{ animationDelay: "140ms" }}
            >
              A collection of accessible, customizable and design-focused components to
              build modern interfaces — your way. Small components, big possibilities.
            </p>

            <div
              className="rise mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ animationDelay: "210ms" }}
            >
              <PillLink href="#library">Get started</PillLink>
              <PillLink href="https://github.com/PhilibertG/philcn" tone="light">
                Browse components
              </PillLink>
            </div>
          </div>

          {/* The strip along the foot of the card. */}
          {/* <div className="mx-7 flex flex-col gap-7 border-t border-white/10 py-7 sm:mx-10 sm:flex-row sm:items-center">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px] text-white/55">
              {stack.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <Icon className="size-[19px] text-white/45" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex gap-9 sm:ml-auto sm:gap-12">
              {figures.map((figure) => (
                <div key={figure.label}>
                  <div className="text-2xl font-semibold tracking-tight text-white">
                    {figure.value}
                  </div>
                  <div className="mt-0.5 text-[13px] text-white/50">{figure.label}</div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </section>

      {/* ================= library card, in the light ================= */}
      <section
        id="library"
        className="mt-2 scroll-mt-24 rounded-[28px] bg-brand-surface px-6 py-16 sm:mt-3 sm:rounded-[36px] sm:py-20 sm:px-10 lg:px-16"
      >
        {/* Content keeps a fixed measure and sits in the middle of the card:
            the wider the screen, the wider the margins, never the lines. */}
        <div className="mx-auto w-full max-w-content">
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

          {/* Not a picture: everything below is running. */}
          <div className="mt-12">
            <ComponentShowcase />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
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
        </div>
      </section>

      {/* ========================== values card ========================== */}
      <section
        id="why"
        className="mt-2 scroll-mt-24 rounded-[28px] bg-[#16171d] px-6 py-16 text-white sm:mt-3 sm:rounded-[36px] sm:py-20 sm:px-10 lg:px-16"
      >
        {/* Content keeps a fixed measure and sits in the middle of the card:
            the wider the screen, the wider the margins, never the lines. */}
        <div className="mx-auto w-full max-w-content">
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
        </div>
      </section>

      {/* ============================ footer ============================ */}
      <footer className="relative overflow-hidden px-6 pt-16 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-content flex-col gap-5 pb-10 text-sm text-white/45 sm:flex-row sm:items-center">
          <Wordmark className="text-lg text-white" />
          <span>A modern component library for React</span>
          <span className="sm:ml-auto">MIT — Philibert Gentien</span>
          <span className="font-mono text-xs">v0.3.1 · 2026</span>
        </div>

        {/* The name, once, large enough to be felt rather than read, and
            cropped by the edge of the page. */}
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
