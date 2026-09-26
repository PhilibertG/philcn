import { Skeleton } from "@philcn/components/ui/skeleton.tsx";

/** The shape of what is coming, so the page does not jump when it lands. */
export default function SkeletonDefault() {
  return (
    <div className="flex w-full max-w-sm items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
