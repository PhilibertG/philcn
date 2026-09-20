"use client";

import * as React from "react";

import { cn } from "../../lib/cn.ts";

type LoadStatus = "idle" | "loading" | "loaded" | "error";

const AvatarContext = React.createContext<{
  status: LoadStatus;
  setStatus: (status: LoadStatus) => void;
} | null>(null);

function useAvatarContext(component: string) {
  const context = React.useContext(AvatarContext);
  if (context === null) {
    throw new Error(`${component} must be used inside <Avatar>`);
  }
  return context;
}

const Avatar = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  function Avatar({ className, ...props }, ref) {
    const [status, setStatus] = React.useState<LoadStatus>("idle");
    const value = React.useMemo(() => ({ status, setStatus }), [status]);

    return (
      <AvatarContext.Provider value={value}>
        <span
          ref={ref}
          data-slot="avatar"
          className={cn(
            "relative flex size-8 shrink-0 overflow-hidden rounded-full bg-muted",
            className,
          )}
          {...props}
        />
      </AvatarContext.Provider>
    );
  },
);

const AvatarImage = React.forwardRef<HTMLImageElement, React.ComponentPropsWithoutRef<"img">>(
  function AvatarImage({ className, onLoad, onError, src, ...props }, ref) {
    const { status, setStatus } = useAvatarContext("AvatarImage");

    // Resolve the image out of band so the fallback can show while it loads,
    // and so a broken URL never leaves a torn image on screen.
    React.useEffect(() => {
      if (src === undefined || src === "") {
        setStatus("error");
        return;
      }

      let cancelled = false;
      setStatus("loading");

      const image = new window.Image();
      image.onload = () => {
        if (!cancelled) setStatus("loaded");
      };
      image.onerror = () => {
        if (!cancelled) setStatus("error");
      };
      image.src = src;

      return () => {
        cancelled = true;
      };
    }, [src, setStatus]);

    if (status !== "loaded") return null;

    return (
      <img
        ref={ref}
        src={src}
        data-slot="avatar-image"
        className={cn("aspect-square size-full object-cover animate-fade-in", className)}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );
  },
);

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Wait this many milliseconds before showing, to avoid a flash on fast loads. */
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className, delayMs, ...props }, ref) {
    const { status } = useAvatarContext("AvatarFallback");
    const [canRender, setCanRender] = React.useState(delayMs === undefined);

    React.useEffect(() => {
      if (delayMs === undefined) return;
      const timer = window.setTimeout(() => setCanRender(true), delayMs);
      return () => window.clearTimeout(timer);
    }, [delayMs]);

    if (status === "loaded" || !canRender) return null;

    return (
      <span
        ref={ref}
        data-slot="avatar-fallback"
        className={cn(
          "flex size-full items-center justify-center rounded-full bg-muted text-sm",
          className,
        )}
        {...props}
      />
    );
  },
);

export { Avatar, AvatarFallback, AvatarImage };
