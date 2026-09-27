import { Tabs, TabsContent, TabsList, TabsTrigger } from "@philcn/components/ui/tabs.tsx";

/**
 * With `activationMode="manual"` the arrow keys move the focus without
 * changing the panel; Enter or Space chooses. Use it when opening a panel
 * costs something — a request, a chart being drawn.
 */
export default function TabsManual() {
  return (
    <Tabs defaultValue="daily" activationMode="manual" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
      <TabsContent value="daily" className="pt-3 text-sm text-muted-foreground">
        Yesterday: 1 240 downloads.
      </TabsContent>
      <TabsContent value="weekly" className="pt-3 text-sm text-muted-foreground">
        Last week: 8 903 downloads.
      </TabsContent>
      <TabsContent value="monthly" className="pt-3 text-sm text-muted-foreground">
        Last month: 34 012 downloads.
      </TabsContent>
    </Tabs>
  );
}
