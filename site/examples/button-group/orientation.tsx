import { Button } from "@philcn/components/ui/button.tsx";
import { ButtonGroup, ButtonGroupText } from "@philcn/components/ui/button-group.tsx";
import { Input } from "@philcn/components/ui/input.tsx";

/** A column, and a row holding something that is read rather than pressed. */
export default function ButtonGroupOrientation() {
  return (
    <div className="flex items-start gap-8">
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="outline" size="icon" aria-label="Zoom in">
          +
        </Button>
        <Button variant="outline" size="icon" aria-label="Zoom out">
          −
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <ButtonGroupText>$</ButtonGroupText>
        <Input defaultValue="19.00" className="w-28 rounded-none" />
        <Button variant="outline">Apply</Button>
      </ButtonGroup>
    </div>
  );
}
