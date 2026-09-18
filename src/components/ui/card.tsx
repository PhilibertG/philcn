import * as React from "react";

import { cn } from "../../lib/cn.ts";

type DivProps = React.ComponentPropsWithoutRef<"div">;

const Card = React.forwardRef<HTMLDivElement, DivProps>(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef<HTMLDivElement, DivProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
        // an action in the header turns the row into two columns
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
});

const CardTitle = React.forwardRef<HTMLDivElement, DivProps>(function CardTitle(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
});

const CardDescription = React.forwardRef<HTMLDivElement, DivProps>(function CardDescription(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

const CardAction = React.forwardRef<HTMLDivElement, DivProps>(function CardAction(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
});

const CardContent = React.forwardRef<HTMLDivElement, DivProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} data-slot="card-content" className={cn("px-6", className)} {...props} />;
});

const CardFooter = React.forwardRef<HTMLDivElement, DivProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
});

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
