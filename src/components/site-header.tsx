"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { auth } from "@/lib/firebase";

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
  { href: "/passport", label: "Mon passeport" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const links = user
    ? [
        ...baseLinks,
        { href: "/organisateur", label: "Espace organisateur" },
        { href: "/app/dashboard", label: "Dashboard" },
      ]
    : baseLinks;

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-wide text-cyan-300">
          Solimouv&apos; x Up Sport!
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex flex-wrap items-center justify-end gap-2">
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

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <p className="hidden text-xs text-slate-400 sm:block">{user.email}</p>
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
    </header>
  );
}
