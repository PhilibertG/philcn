import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@philcn/components/ui/table.tsx";

const releases = [
  { version: "0.4.2", date: "24 Sep 2026", components: 40 },
  { version: "0.4.1", date: "21 Sep 2026", components: 40 },
  { version: "0.4.0", date: "20 Sep 2026", components: 40 },
];

export default function TableDefault() {
  return (
    <Table>
      <TableCaption>Recent releases.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Version</TableHead>
          <TableHead>Published</TableHead>
          <TableHead className="text-right">Components</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {releases.map((release) => (
          <TableRow key={release.version}>
            <TableCell className="font-medium">{release.version}</TableCell>
            <TableCell>{release.date}</TableCell>
            <TableCell className="text-right">{release.components}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Latest</TableCell>
          <TableCell className="text-right">0.4.2</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
