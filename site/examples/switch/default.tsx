import { Label } from "@philcn/components/ui/label.tsx";
import { Switch } from "@philcn/components/ui/switch.tsx";

export default function SwitchDefault() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications">Email me about releases</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="beta" />
        <Label htmlFor="beta">Try the beta</Label>
      </div>
    </div>
  );
}
