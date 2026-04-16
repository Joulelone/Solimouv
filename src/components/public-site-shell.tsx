import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function PublicSiteShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          {children}
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Festival Solimouv&apos; - sport inclusif a Paris</p>
          <div className="flex items-center gap-3">
            <Link href="/login" className="underline underline-offset-4 hover:text-slate-200">
              Espace organisateurs
            </Link>
            <a
              href="https://www.unispourlesport.paris/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-slate-200"
            >
              Site Up Sport!
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
