"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { auth } from "@/lib/firebase";

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/contact", label: "Carte" },
  { href: "/passport", label: "Mon passeport" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user
    ? [
        ...baseLinks,
        { href: "/organisateur", label: "Espace organisateur" },
      ]
    : baseLinks;

  const compactLinks = user
    ? [
        { href: "/", label: "Accueil" },
        { href: "/programme", label: "Programme" },
        { href: "/passport", label: "Mon passeport" },
        { href: "/organisateur", label: "Organisateur" },
      ]
    : [
        { href: "/", label: "Accueil" },
        { href: "/programme", label: "Programme" },
        { href: "/passport", label: "Mon passeport" },
      ];

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold tracking-wide text-cyan-300">
            Solimouv&apos; x Up Sport!
          </Link>

          <nav aria-label="Navigation principale" className="hidden xl:block">
            <ul className="flex items-center justify-end gap-2">
              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href === "/organisateur" && pathname === "/check-in");
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

          <nav aria-label="Navigation compacte" className="hidden lg:block xl:hidden">
            <ul className="flex items-center justify-end gap-2">
              {compactLinks.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href === "/organisateur" && pathname === "/check-in");
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

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <p className="hidden text-xs text-slate-400 2xl:block">{user.email}</p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-white/10 xl:text-sm"
                >
                  Se deconnecter
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10"
              >
                Connexion
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-slate-100 hover:bg-white/10 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 py-3 lg:hidden">
            <nav aria-label="Navigation mobile">
              <ul className="flex flex-col gap-1">
                {links.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href === "/organisateur" && pathname === "/check-in");
                  return (
                    <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
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

            <div className="mt-3 flex items-center gap-2">
              {user ? (
                <>
                  <p className="truncate text-xs text-slate-400">{user.email}</p>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10"
                  >
                    Se deconnecter
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
