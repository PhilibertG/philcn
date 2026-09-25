import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@philcn/components/ui/select.tsx";

export default function SelectGrouped() {
  return (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Pick a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="paris">Paris</SelectItem>
          <SelectItem value="lisbon">Lisbon</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>America</SelectLabel>
          <SelectItem value="montreal">Montréal</SelectItem>
          <SelectItem value="lima" disabled>
            Lima
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
