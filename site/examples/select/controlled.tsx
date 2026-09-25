"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@philcn/components/ui/select.tsx";

/**
 * With `value` and `onValueChange` the choice lives in your own state, which
 * is what you want when something else on the page has to react to it.
 */
export default function SelectControlled() {
  const [language, setLanguage] = React.useState("ts");

  return (
    <div className="grid gap-3 text-center">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[220px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ts">TypeScript</SelectItem>
          <SelectItem value="js">JavaScript</SelectItem>
          <SelectItem value="rs">Rust</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-brand-ink-soft">Chosen: {language}</p>
    </div>
  );
}
