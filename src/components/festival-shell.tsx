"use client";

import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function FestivalShell({
  title,
  maxWidth = "max-w-6xl",
  children,
}: {
  title: string;
  maxWidth?: "max-w-3xl" | "max-w-6xl";
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <section
          className={`mx-auto w-full ${maxWidth} rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8`}
        >
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <div className="mt-5">{children}</div>
        </section>
      </main>
    </div>
  );
}
