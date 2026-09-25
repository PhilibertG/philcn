import type { Route } from "next";
import { redirect } from "next/navigation";

/** Nothing to read at /docs itself yet: send the reader to the first page. */
export default function DocsIndex() {
  redirect("/docs/button" as Route);
}
