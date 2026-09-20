import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "philcn — beautiful components for React",
  description:
    "Small components. Big possibilities. A React component library written from scratch, carrying the same API as shadcn/ui.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* General Sans, the brand book's typeface. */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
