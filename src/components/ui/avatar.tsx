"use client";

import * as React from "react";

import { cn } from "../../lib/cn.ts";

type LoadStatus = "idle" | "loading" | "loaded" | "error";

/**
 * A value two components share, kept outside React state on purpose.
 *
 * The image reports its progress from a browser callback and from an effect.
 * Writing React state straight from an effect costs an extra render of the
 * whole avatar every time; writing here re-renders only whoever reads the
 * value, and `useSyncExternalStore` keeps that safe during hydration.
 */
interface Store<T> {
  read: () => T;
  write: (value: T) => void;
  subscribe: (onChange: () => void) => () => void;
}

function createStore<T>(initial: T): Store<T> {
  let current = initial;
  const listeners = new Set<() => void>();

  return {
    read: () => current,
    write: (value) => {
      if (Object.is(value, current)) return;
      current = value;
      for (const onChange of listeners) onChange();
    },
    subscribe: (onChange) => {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
  };
}

function useStore<T>(store: Store<T>, readOnServer: () => T): T {
  return React.useSyncExternalStore(store.subscribe, store.read, readOnServer);
}

/** Nothing has loaded during a server render, so the initials show there. */
const readIdle = (): LoadStatus => "idle";
const readNoUrl = (): string | undefined => undefined;

const AvatarContext = React.createContext<Store<LoadStatus> | null>(null);

function useAvatarStatusStore(component: string): Store<LoadStatus> {
  const context = React.useContext(AvatarContext);
  if (context === null) {
    throw new Error(`${component} must be used inside <Avatar>`);
  }
  return context;
}

const Avatar = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  function Avatar({ className, ...props }, ref) {
    const [store] = React.useState(() => createStore<LoadStatus>("idle"));

    return (
      <AvatarContext.Provider value={store}>
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
    const store = useAvatarStatusStore("AvatarImage");
    const status = useStore(store, readIdle);

    /**
     * React leaves the type of an image's `src` open for frameworks to widen —
     * Next.js, for one, accepts a `Blob`. Everything below needs a real URL, so
     * a blob is turned into one here and released as soon as it is no longer
     * on screen, which is what keeps it from leaking.
     */
    const [urlStore] = React.useState(() =>
      createStore<string | undefined>(typeof src === "string" ? src : undefined),
    );
    const url = useStore(urlStore, readNoUrl);

    React.useEffect(() => {
      const value: unknown = src;

      if (value === undefined || typeof value === "string") {
        urlStore.write(value);
        return;
      }
      if (typeof Blob !== "undefined" && value instanceof Blob) {
        const objectUrl = URL.createObjectURL(value);
        urlStore.write(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
      urlStore.write(undefined);
      return;
    }, [src, urlStore]);

    // Resolve the image out of band so the fallback can show while it loads,
    // and so a broken URL never leaves a torn image on screen.
    React.useEffect(() => {
      if (url === undefined || url === "") {
        store.write("error");
        return;
      }

      let cancelled = false;
      store.write("loading");

      const image = new window.Image();
      image.onload = () => {
        if (!cancelled) store.write("loaded");
      };
      image.onerror = () => {
        if (!cancelled) store.write("error");
      };
      image.src = url;

      return () => {
        cancelled = true;
      };
    }, [url, store]);

    if (status !== "loaded") return null;

    return (
      <img
        ref={ref}
        src={url}
        data-slot="avatar-image"
        className={cn("aspect-square size-full object-cover animate-in fade-in-0 duration-200", className)}
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
    const status = useStore(useAvatarStatusStore("AvatarFallback"), readIdle);
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
