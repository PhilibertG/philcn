import type { Metadata } from "next";

import { Code } from "@/components/docs/code";
import { CommandTabs } from "@/components/docs/command-tabs";
import { Pager } from "@/components/docs/pager";
import { Toc } from "@/components/docs/toc";

export const metadata: Metadata = {
  title: "Installation — philcn",
  description: "Set a project up, then copy in the components you need.",
};

/** The same command in the four package managers, coloured on the server. */
async function Command({ args }: { args: string }) {
  const managers = [
    { name: "npm", command: `npx philcn@latest ${args}` },
    { name: "pnpm", command: `pnpm dlx philcn@latest ${args}` },
    { name: "yarn", command: `yarn dlx philcn@latest ${args}` },
    { name: "bun", command: `bunx philcn@latest ${args}` },
  ];

  return (
    <CommandTabs
      managers={await Promise.all(
        managers.map(async (manager) => ({
          name: manager.name,
          code: <Code code={manager.command} lang="bash" />,
        })),
      )}
    />
  );
}

const toc = [
  { id: "what-you-need", title: "What you need" },
  { id: "set-up", title: "Set the project up" },
  { id: "the-stylesheet", title: "The stylesheet" },
  { id: "add-components", title: "Add components" },
  { id: "packages", title: "Packages" },
  { id: "from-shadcn", title: "Coming from shadcn" },
  { id: "every-line", title: "Carrying every line" },
];

export default function InstallationPage() {
  return (
    <div className="flex gap-12">
      <article className="mx-auto grid w-full min-w-0 gap-10 text-[15px] xl:max-w-[760px]">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight">Installation</h1>
          <p className="mt-2 text-lg text-brand-ink-soft">
            philcn is not a package you install. The command copies source files into your project,
            where they become yours.
          </p>
        </header>

        <section id="what-you-need" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">What you need</h2>
          <ul className="grid gap-2 text-brand-ink-soft">
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>A React project — React 19 or later.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>Tailwind CSS v4. The components are written in its classes.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>TypeScript, if you want the types. The files are .tsx.</span>
            </li>
          </ul>
        </section>

        <section id="set-up" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Set the project up</h2>
          <p className="mb-4 text-brand-ink-soft">Once per project:</p>
          <Command args="init" />
          <p className="mt-4 text-brand-ink-soft">It writes three things:</p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-brand-line">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <tr className="align-top">
                  <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap">components.json</td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    Where your components live and which aliases they use. The same file shadcn
                    reads, so a project already set up for shadcn keeps working.
                  </td>
                </tr>
                <tr className="border-t border-brand-line align-top">
                  <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap">philcn.css</td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    The theme: colours, radii and animations, for light and dark.
                  </td>
                </tr>
                <tr className="border-t border-brand-line align-top">
                  <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap">lib/utils.ts</td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    Holds <code>cn</code>, which every component and every pasted block uses. A
                    project that already has this file keeps its own.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="the-stylesheet" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">The stylesheet</h2>
          <p className="mb-4 text-brand-ink-soft">
            Import it once, wherever your application brings in its CSS. It opens with two lines,
            and the second one matters:
          </p>
          <Code lang="css" code={`@import "tailwindcss";\n@import "philcn/source.css";`} />
          <p className="mt-3 text-brand-ink-soft">
            The second line tells Tailwind to look inside the installed package. Some of the shared
            behaviour carries Tailwind classes, and Tailwind does not scan <code>node_modules</code>{" "}
            on its own — without that line, menus and dialogs arrive unstyled. <code>init</code>{" "}
            writes it for you.
          </p>
        </section>

        <section id="add-components" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Add components</h2>
          <Command args="add button dialog" />
          <p className="mt-4 text-brand-ink-soft">
            Each one lands in your own source tree, with its imports rewritten to your aliases. From
            then on the file is yours: change it, and nothing will overwrite it.
          </p>
          <p className="mt-3 text-brand-ink-soft">
            To see everything on offer, ask for the list:
          </p>
          <div className="mt-3">
            <Command args="list" />
          </div>
        </section>

        <section id="packages" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Packages</h2>
          <p className="text-brand-ink-soft">
            philcn has two dependencies, both optional, and the command tells you when a component
            needs one:
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-brand-line">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <tr className="align-top">
                  <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap">
                    @floating-ui/react-dom
                  </td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    Works out where a floating panel goes and what it does when the window edge is
                    in the way. Needed by anything that floats: Popover, Tooltip, Select, the menus.
                  </td>
                </tr>
                <tr className="border-t border-brand-line align-top">
                  <td className="px-4 py-3 font-mono text-[13px] whitespace-nowrap">
                    react-hook-form
                  </td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    The machinery of a form: values, touched fields, validation. Needed by{" "}
                    <code>Form</code> alone.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-brand-ink-soft">
            Neither draws anything. A project using nothing that floats and no form installs neither.
          </p>
        </section>

        <section id="from-shadcn" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Coming from shadcn</h2>
          <p className="mb-4 text-brand-ink-soft">
            The API is the same on purpose: same component names, same props. A block copied from
            shadcn that imports from <code>@/components/ui/…</code> — which is most of them — needs
            no change at all, once <code>philcn add</code> has written those files. A block copied
            out of their registry carries a registry path, and that is the one line to change:
          </p>
          <Code
            code={`import { Button } from "@/registry/new-york/ui/button"
// becomes
import { Button } from "@/components/ui/button"`}
          />
          <p className="mt-3 text-brand-ink-soft">
            Both spellings of the render-as-something-else prop are accepted: <code>asChild</code>,
            from blocks written against Radix, and <code>render</code>, from the current shadcn
            documentation. Neither vintage of a block has to be rewritten.
          </p>
        </section>

        <section id="every-line" className="scroll-mt-28">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Carrying every line</h2>
          <p className="mb-4 text-brand-ink-soft">
            By default the shared behaviour behind a component — focus traps, portals, keyboard
            navigation — is imported from the <code>philcn</code> package rather than copied, the
            same way a shadcn component imports Radix. If a project has to hold every line it runs,
            ask for the copies too:
          </p>
          <Command args="add dialog --standalone" />
          <p className="mt-3 text-brand-ink-soft">
            Nothing is then imported from <code>philcn</code> at runtime.
          </p>
        </section>
        <Pager slug="installation" />
      </article>

      <aside className="sticky top-24 hidden h-fit w-56 shrink-0 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
