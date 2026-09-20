"use client";

import * as React from "react";

import { Badge } from "@philcn/components/ui/badge.tsx";
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
import { Label } from "@philcn/components/ui/label.tsx";
import { Switch } from "@philcn/components/ui/switch.tsx";

/**
 * Real philcn components, laid out as a panel of an application rather than
 * floating over a picture.
 *
 * Nothing here is an image: the palette filters as you type, the calendar
 * changes month, the switch flips. They wear philcn's own tokens and no site
 * colours at all, so what you see is what lands in your project.
 */
export function ComponentShowcase() {
  const [day, setDay] = React.useState<Date | undefined>(new Date(2026, 8, 17));
  const [publicRepo, setPublicRepo] = React.useState(true);
  const [notify, setNotify] = React.useState(false);

  return (
    <div className="rounded-2xl border border-brand-line bg-background p-5 text-foreground sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid gap-5">
          <div className="overflow-hidden rounded-xl border">
            <Command>
              <CommandInput placeholder="Search components…" />
              <CommandList className="max-h-[210px]">
                <CommandGroup heading="Components">
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

          <div className="grid gap-3 rounded-xl border p-4">
            <div className="flex items-center justify-between gap-6">
              <div className="grid gap-0.5">
                <Label htmlFor="showcase-public">Public repository</Label>
                <span className="text-xs text-muted-foreground">
                  Anyone can read the code.
                </span>
              </div>
              <Switch
                id="showcase-public"
                checked={publicRepo}
                onCheckedChange={setPublicRepo}
              />
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="grid gap-0.5">
                <Label htmlFor="showcase-notify">Release notes</Label>
                <span className="text-xs text-muted-foreground">Email me on a tag.</span>
              </div>
              <Switch id="showcase-notify" checked={notify} onCheckedChange={setNotify} />
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Button size="sm">Save changes</Button>
              <Badge variant="secondary">{publicRepo ? "public" : "private"}</Badge>
              {notify && <Badge>notified</Badge>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-2">
          <Calendar
            mode="single"
            selected={day}
            onSelect={setDay}
            defaultMonth={new Date(2026, 8, 1)}
          />
        </div>
      </div>
    </div>
  );
}
