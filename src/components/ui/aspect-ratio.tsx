import * as React from "react";

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Width divided by height. `16 / 9` for widescreen, `1` for a square. */
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 1, style, ...props },
  ref,
) {
  return <div ref={ref} data-slot="aspect-ratio" style={{ aspectRatio: ratio, ...style }} {...props} />;
});

export { AspectRatio };
