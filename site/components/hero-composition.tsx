"use client";

import * as React from "react";

import { Button } from "@philcn/components/ui/button.tsx";
import { Calendar } from "@philcn/components/ui/calendar.tsx";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@philcn/components/ui/command.tsx";
import { Switch } from "@philcn/components/ui/switch.tsx";

import { ArrowIcon, CodeIcon } from "./icons";

/**
 * The pieces floating over the shader.
 *
 * None of them is a picture: the palette filters as you type, the calendar
 * changes month, the switch flips. They are the same components `philcn add`
 * writes into a project, wearing a frosted panel so the field shows through.
 */

/** A caption on a hairline, pointing at the piece next to it. */
function Leader({
  children,
  side,
  className,
}: {
  children: React.ReactNode;
  side: "left" | "right";
  className?: string;
}) {
  return (
    <div className={`hidden items-start gap-3 lg:flex ${className ?? ""}`}>
      {side === "right" && (
        <span
          className="leader mt-2 h-px w-12 shrink-0"
          style={{ ["--leader-to" as string]: "left" }}
          aria-hidden
        />
      )}
      <p className="text-[13px] leading-snug text-brand-ink-soft">{children}</p>
      {side === "left" && (
        <span
          className="leader mt-2 h-px w-12 shrink-0"
          style={{ ["--leader-to" as string]: "right" }}
          aria-hidden
        />
      )}
    </div>
  );
}

export function HeroComposition() {
  const [publicRepo, setPublicRepo] = React.useState(true);
  const [day, setDay] = React.useState<Date | undefined>(new Date(2026, 8, 17));

  return (
    <div className="relative min-h-[540px] w-full select-none">
      {/* ---- command palette ------------------------------------------- */}
      <div
        className="float glass absolute top-4 right-0 w-[330px] overflow-hidden rounded-2xl sm:right-8 lg:right-14"
        style={{ ["--tilt" as string]: "-1.5deg", ["--float-duration" as string]: "11s" }}
      >
        <Command className="bg-transparent text-brand-ink">
          <CommandInput placeholder="Search components…" className="text-brand-ink" />
          <CommandList className="max-h-[188px]">
            <CommandGroup>
              <CommandItem value="button">
                Button
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
              <CommandItem value="dialog">Dialog</CommandItem>
              <CommandItem value="select">Select</CommandItem>
              <CommandItem value="date picker">Date Picker</CommandItem>
              <CommandItem value="command">Command</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      {/* ---- calendar ---------------------------------------------------- */}
      <div
        className="float glass absolute top-[236px] right-10 rounded-2xl p-2 sm:right-20 lg:right-28"
        style={{ ["--tilt" as string]: "1.5deg", ["--float-duration" as string]: "13s" }}
      >
        <Calendar
          mode="single"
          selected={day}
          onSelect={setDay}
          defaultMonth={new Date(2026, 8, 1)}
          className="bg-transparent"
        />
      </div>

      {/* ---- switch ------------------------------------------------------ */}
      <div
        className="float glass absolute top-[196px] left-2 rounded-full px-5 py-4 sm:left-10"
        style={{ ["--tilt" as string]: "2deg", ["--float-duration" as string]: "9s" }}
      >
        <Switch
          checked={publicRepo}
          onCheckedChange={setPublicRepo}
          aria-label="A philcn switch"
          className="scale-150 data-[state=checked]:bg-brand-primary"
        />
      </div>

      {/* ---- button ------------------------------------------------------ */}
      <div
        className="float absolute top-[320px] left-0 sm:left-6"
        style={{ ["--tilt" as string]: "-2deg", ["--float-duration" as string]: "10.5s" }}
      >
        <Button
          size="lg"
          className="rounded-full bg-brand-ink px-7 shadow-[0_18px_40px_-14px_rgba(17,18,22,.55)]"
        >
          Button
          <ArrowIcon className="size-4" />
        </Button>
      </div>

      {/* ---- code tile --------------------------------------------------- */}
      <div
        className="float glass absolute top-[110px] right-0 grid size-[72px] place-items-center rounded-2xl lg:right-2"
        style={{ ["--tilt" as string]: "6deg", ["--float-duration" as string]: "12s" }}
      >
        <CodeIcon className="size-7 text-brand-primary" />
      </div>

      {/* ---- captions ---------------------------------------------------- */}
      <Leader side="left" className="absolute top-[150px] left-0 w-[110px]">
        Flexible
        <br />
        by design.
      </Leader>
      <Leader side="right" className="absolute top-[60px] right-[-130px] w-[150px]">
        From idea
        <br />
        to interface.
      </Leader>
      <Leader side="right" className="absolute top-[430px] right-[-150px] w-[170px]">
        Small components.
        <br />
        Big possibilities.
      </Leader>
    </div>
  );
}
