import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@philcn/components/ui/navigation-menu.tsx";

const components = [
  { title: "Button", body: "The one people click." },
  { title: "Dialog", body: "A window over the page." },
  { title: "Command", body: "Type, and the list narrows." },
  { title: "Calendar", body: "Days, months and years." },
];

export default function NavigationMenuDefault() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-1 p-2 sm:grid-cols-2">
              {components.map((component) => (
                <li key={component.title}>
                  <NavigationMenuLink href={`/docs/${component.title.toLowerCase()}`}>
                    <div className="text-sm font-medium">{component.title}</div>
                    <p className="text-sm text-muted-foreground">{component.body}</p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs/installation" active>
            Installation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
