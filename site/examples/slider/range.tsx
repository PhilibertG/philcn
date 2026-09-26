"use client";

import * as React from "react";

import { Slider } from "@philcn/components/ui/slider.tsx";

/**
 * Two handles make a range. `minStepsBetweenThumbs` keeps them from crossing
 * or landing on top of each other.
 */
export default function SliderRange() {
  const [range, setRange] = React.useState([20, 70]);

  return (
    <div className="grid w-full max-w-sm gap-3">
      <Slider value={range} onValueChange={setRange} max={100} step={5} minStepsBetweenThumbs={1} />
      <p className="text-center text-sm text-brand-ink-soft">
        {range[0]} to {range[1]}
      </p>
    </div>
  );
}
