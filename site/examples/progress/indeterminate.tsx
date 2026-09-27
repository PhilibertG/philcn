import { Progress } from "@philcn/components/ui/progress.tsx";

/** Without a value, the bar says "something is happening" and nothing more. */
export default function ProgressIndeterminate() {
  return <Progress value={null} className="w-full max-w-sm" />;
}
