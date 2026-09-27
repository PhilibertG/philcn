import { Button } from "@philcn/components/ui/button.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@philcn/components/ui/empty.tsx";

export default function EmptyDefault() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
          </svg>
        </EmptyMedia>
        <EmptyTitle>No components yet</EmptyTitle>
        <EmptyDescription>Add your first component and it will show up here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Add a component</Button>
      </EmptyContent>
    </Empty>
  );
}
