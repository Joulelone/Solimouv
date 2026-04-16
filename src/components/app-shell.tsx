"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/components/auth-provider";

const links = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/passport", label: "Passeport" },
  { href: "/app/items", label: "Items" },
  { href: "/app/settings", label: "Parametres" },
];

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row">
          <aside className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 md:w-64 md:self-start">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">App</p>
            <p className="mt-2 text-sm text-slate-300">{user?.email}</p>
            <nav className="mt-4 flex flex-col gap-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="min-h-[480px] flex-1 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <div className="mt-5">{children}</div>
          </section>
        </div>
      </main>
    </div>
  );
}
