import { Button } from "@philcn/components/ui/button.tsx";
import { ButtonGroup, ButtonGroupSeparator } from "@philcn/components/ui/button-group.tsx";

/**
 * Filled buttons have no border of their own, so the divider is drawn: without
 * it the group is one block of colour and the boundary disappears.
 */
export default function ButtonGroupWithSeparator() {
  return (
    <ButtonGroup aria-label="Clipboard">
      <Button>Copy</Button>
      <ButtonGroupSeparator />
      <Button>Paste</Button>
    </ButtonGroup>
  );
}
