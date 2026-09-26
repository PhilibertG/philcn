import { Button } from "@philcn/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@philcn/components/ui/tooltip.tsx";

/**
 * The provider holds the shared delay: the first tooltip waits, and the ones
 * you move to straight afterwards appear at once.
 */
export default function TooltipDefault() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-3">
        {["Copy", "Share", "Delete"].map((label) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                {label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label} this release</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
