"use client";

import * as React from "react";

import { Progress } from "@philcn/components/ui/progress.tsx";

export default function ProgressDefault() {
  const [value, setValue] = React.useState(35);

  return (
    <div className="grid w-full max-w-sm gap-4">
      <Progress value={value} />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        aria-label="Progress"
      />
    </div>
  );
}
