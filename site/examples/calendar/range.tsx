"use client";

import * as React from "react";

import { Calendar, type DateRange } from "@philcn/components/ui/calendar.tsx";

/** Two months side by side, and a stretch of days rather than one. */
export default function CalendarRange() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 8, 12),
    to: new Date(2026, 8, 19),
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="rounded-xl border border-border"
    />
  );
}
