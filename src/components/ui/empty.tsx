import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { cva, type VariantProps } from "class-variance-authority";

type DivProps = React.ComponentPropsWithoutRef<"div">;

const Empty = React.forwardRef<HTMLDivElement, DivProps>(function Empty(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance",
        "rounded-lg border border-dashed p-6 text-center md:p-12",
        className,
      )}
      {...props}
    />
  );
});

const EmptyHeader = React.forwardRef<HTMLDivElement, DivProps>(function EmptyHeader(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2 text-center", className)}
      {...props}
    />
  );
});

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-10 rounded-lg bg-muted text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  DivProps & VariantProps<typeof emptyMediaVariants>
>(function EmptyMedia({ className, variant, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="empty-media"
      data-variant={variant ?? "default"}
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  );
});

const EmptyTitle = React.forwardRef<HTMLDivElement, DivProps>(function EmptyTitle(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  );
});

const EmptyDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  function EmptyDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        data-slot="empty-description"
        className={cn(
          "text-sm/relaxed text-muted-foreground",
          "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

const EmptyContent = React.forwardRef<HTMLDivElement, DivProps>(function EmptyContent(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="empty-content"
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        className,
      )}
      {...props}
    />
  );
});

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  emptyMediaVariants,
};
