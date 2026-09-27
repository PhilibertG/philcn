"use client";

import * as React from "react";

import { Button } from "@philcn/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@philcn/components/ui/dropdown-menu.tsx";

/**
 * Ticks and dots inside a menu. `closeOnSelect={false}` keeps the menu open
 * while several boxes are ticked, which is what a reader expects here.
 */
export default function DropdownMenuCheckboxes() {
  const [columns, setColumns] = React.useState(["version", "date"]);
  const [density, setDensity] = React.useState("comfortable");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        {["version", "date", "size"].map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            checked={columns.includes(column)}
            closeOnSelect={false}
            onCheckedChange={(checked) =>
              setColumns((current) =>
                checked ? [...current, column] : current.filter((name) => name !== column),
              )
            }
          >
            {column}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
