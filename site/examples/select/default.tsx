import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@philcn/components/ui/select.tsx";

export default function SelectDefault() {
  return (
    <Select defaultValue="medium">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Pick a size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="small">Small</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="large">Large</SelectItem>
      </SelectContent>
    </Select>
  );
}
