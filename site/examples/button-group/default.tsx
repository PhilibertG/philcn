import { Button } from "@philcn/components/ui/button.tsx";
import { ButtonGroup } from "@philcn/components/ui/button-group.tsx";

/**
 * Outlined buttons already carry a border, so joining them is enough: the two
 * borders meet and read as one line.
 */
export default function ButtonGroupDefault() {
  return (
    <ButtonGroup aria-label="Message actions">
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
    </ButtonGroup>
  );
}
