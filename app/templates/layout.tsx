import React from "react";

export const metadata = {
  title: "Tagelabs | Dream Site Preview",
  description: "Interactive live template preview",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-zinc-950 text-zinc-100">
      <body className="h-full min-h-screen font-sans antialiased selection:bg-cyan-500 selection:text-zinc-950">
        {/* Isolated container with no Tagelabs header or footer */}
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
