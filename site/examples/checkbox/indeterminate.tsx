"use client";

import * as React from "react";

import { Checkbox } from "@philcn/components/ui/checkbox.tsx";
import { Label } from "@philcn/components/ui/label.tsx";

const items = ["Button", "Dialog", "Select"];

/**
 * A parent box that is neither ticked nor empty: "some of them". The state is
 * the string "indeterminate", and it is announced as mixed.
 */
export default function CheckboxIndeterminate() {
  const [chosen, setChosen] = React.useState<string[]>(["Button"]);
  const all = chosen.length === items.length;
  const some = chosen.length > 0 && !all;

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <Checkbox
          id="all"
          checked={some ? "indeterminate" : all}
          onCheckedChange={(checked) => setChosen(checked === true ? items : [])}
        />
        <Label htmlFor="all">All components</Label>
      </div>
      <div className="ml-6 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <Checkbox
              id={item}
              checked={chosen.includes(item)}
              onCheckedChange={(checked) =>
                setChosen((current) =>
                  checked === true ? [...current, item] : current.filter((name) => name !== item),
                )
              }
            />
            <Label htmlFor={item}>{item}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
