import { Button } from "@philcn/components/ui/button.tsx";
import { Spinner } from "@philcn/components/ui/spinner.tsx";

export default function SpinnerDefault() {
  return (
    <div className="flex items-center gap-6">
      <Spinner />
      <Spinner className="size-8 text-brand-primary" />
      <Button disabled>
        <Spinner />
        Saving
      </Button>
    </div>
  );
}
