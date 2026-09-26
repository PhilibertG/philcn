import { AspectRatio } from "@philcn/components/ui/aspect-ratio.tsx";

export default function AspectRatioDefault() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl bg-muted">
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#5271ff] to-[#a78bfa] text-sm font-medium text-white">
          16 / 9
        </div>
      </AspectRatio>
    </div>
  );
}
