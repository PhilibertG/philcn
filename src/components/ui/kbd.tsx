import * as React from "react";

import { cn } from "../../lib/cn.ts";

type SpanProps = React.ComponentPropsWithoutRef<"span">;

const Kbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"kbd">>(function Kbd(
  { className, ...props },
  ref,
) {
  return (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center",
        "gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
});

const KbdGroup = React.forwardRef<HTMLSpanElement, SpanProps>(function KbdGroup(
  { className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
});

export { Kbd, KbdGroup };
