import Link from "next/link";
import type { ReactNode } from "react";

const publicLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
];

export function PublicSiteShell({
  currentPath,
  children,
}: {
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-wide text-cyan-300">
            Solimouv&apos; x Up Sport!
          </Link>
          <nav aria-label="Navigation principale">
            <ul className="flex flex-wrap items-center justify-end gap-2">
              {publicLinks.map((link) => {
                const active = currentPath === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-cyan-300 text-slate-950"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

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
