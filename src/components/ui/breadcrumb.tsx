import * as React from "react";

import { cn } from "../../lib/cn.ts";
import { Slot } from "../../lib/slot.tsx";

const Breadcrumb = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
  function Breadcrumb(props, ref) {
    return <nav ref={ref} data-slot="breadcrumb" aria-label="breadcrumb" {...props} />;
  },
);

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  function BreadcrumbList({ className, ...props }, ref) {
    return (
      <ol
        ref={ref}
        data-slot="breadcrumb-list"
        className={cn(
          "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
          className,
        )}
        {...props}
      />
    );
  },
);

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  function BreadcrumbItem({ className, ...props }, ref) {
    return (
      <li
        ref={ref}
        data-slot="breadcrumb-item"
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
      />
    );
  },
);

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, asChild = false, ...props }, ref) {
    const classes = cn("transition-colors hover:text-foreground", className);

    if (asChild) {
      return <Slot ref={ref as React.Ref<HTMLElement>} data-slot="breadcrumb-link" className={classes} {...props} />;
    }

    return <a ref={ref} data-slot="breadcrumb-link" className={classes} {...props} />;
  },
);

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  function BreadcrumbPage({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        data-slot="breadcrumb-page"
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("font-normal text-foreground", className)}
        {...props}
      />
    );
  },
);

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
