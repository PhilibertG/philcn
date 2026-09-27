import { Button } from "@philcn/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@philcn/components/ui/popover.tsx";

/**
 * `side` and `align` are a preference, not an order: when the window edge is
 * in the way the panel flips to the other side rather than being cut off.
 */
export default function PopoverPlacement() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} align="center" className="w-40 text-sm">
            Opens on the {side}.
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
