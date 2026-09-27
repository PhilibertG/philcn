import { Button } from "@philcn/components/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@philcn/components/ui/card.tsx";
import { Input } from "@philcn/components/ui/input.tsx";
import { Label } from "@philcn/components/ui/label.tsx";

export default function CardDefault() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>It starts empty. You can rename it later.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Import
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="card-name">Name</Label>
        <Input id="card-name" placeholder="philcn" />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  );
}
