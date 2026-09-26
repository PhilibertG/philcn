import { Tabs, TabsContent, TabsList, TabsTrigger } from "@philcn/components/ui/tabs.tsx";

/** Tab reaches the row once; the arrow keys move between the tabs. */
export default function TabsDefault() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="team" disabled>
          Team
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
        Your name and the address we write to.
      </TabsContent>
      <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
        Change it here. You will be signed out everywhere else.
      </TabsContent>
    </Tabs>
  );
}
