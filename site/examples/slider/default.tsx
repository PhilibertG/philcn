import { Slider } from "@philcn/components/ui/slider.tsx";

export default function SliderDefault() {
  return <Slider defaultValue={[40]} max={100} step={1} className="w-full max-w-sm" />;
}
