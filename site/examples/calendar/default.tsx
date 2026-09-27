"use client";

import * as React from "react";

import { Calendar } from "@philcn/components/ui/calendar.tsx";

export default function CalendarDefault() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 8, 17));

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-xl border border-border"
    />
  );
}
