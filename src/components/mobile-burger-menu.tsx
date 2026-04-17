"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";

type MobileBurgerMenuProps = {
  open: boolean;
  onClose: () => void;
  organizerHref: string;
  isAuthenticated: boolean;
  onSignOut?: () => void | Promise<void>;
};

type MenuRow = {
  href: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
};

function HomeRowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9.2 10 3l7 6.2v7a.8.8 0 0 1-.8.8H3.8a.8.8 0 0 1-.8-.8v-7Z" />
      <path d="M8.2 17v-4.8h3.6V17" />
    </svg>
  );
}

function CalendarRowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="3.5" width="15" height="14" rx="2.2" />
      <path d="M2.5 7.6h15M6 1.8v3M14 1.8v3" />
    </svg>
  );
}

function PassRowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="4" width="15" height="12" rx="2.2" />
      <path d="M2.5 8h15" />
    </svg>
  );
}

function MapRowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 18s5-5.1 5-9a5 5 0 1 0-10 0c0 3.9 5 9 5 9Z" />
      <circle cx="10" cy="9" r="1.8" />
    </svg>
  );
}

function InfoRowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 8.5V14M10 6h.01" />
    </svg>
  );
}

function OrganizerRowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17V8.5h5V17M12 17V3h5v14M3 8.5h14" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3 13 13M13 3 3 13" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 19v-1.8a3.7 3.7 0 0 0-3.7-3.7H7.7A3.7 3.7 0 0 0 4 17.2V19" />
      <circle cx="9.5" cy="7.8" r="3.2" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 16.5v2.5A2.5 2.5 0 0 1 11.5 21h-6A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3h6A2.5 2.5 0 0 1 14 5.5V8" />
      <path d="m10.5 12 10 0M17.5 8.5 21 12l-3.5 3.5" />
    </svg>
  );
}

export function MobileBurgerMenu({
  open,
  onClose,
  organizerHref,
  isAuthenticated,
  onSignOut,
}: MobileBurgerMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEsc);
    };
  }, [onClose, open]);

  const rows = useMemo<MenuRow[]>(
    () => [
      { href: "/", title: "Accueil", subtitle: "Page principale", icon: <HomeRowIcon /> },
      { href: "/programme", title: "Programme", subtitle: "Toutes les activites", icon: <CalendarRowIcon /> },
      { href: "/passport", title: "Mon Pass'Sport", subtitle: "Mon pass & QR code", icon: <PassRowIcon /> },
      { href: "/contact", title: "Carte du site", subtitle: "Se reperer sur le festival", icon: <MapRowIcon /> },
      { href: "/a-propos", title: "A propos", subtitle: "Solimouv' & partenaires", icon: <InfoRowIcon /> },
      { href: organizerHref, title: "Mode organisateur", subtitle: "Espace organisateur", icon: <OrganizerRowIcon /> },
    ],
    [organizerHref],
  );

  function isActive(href: string) {
    if (href === "/programme") {
      return pathname.startsWith("/programme");
    }
    if (href === "/organisateur") {
      return pathname === "/organisateur" || pathname === "/check-in";
    }
    return pathname === href;
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] bg-[rgba(17,17,17,0.58)] backdrop-blur-[2px] lg:hidden"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal mobile"
        className="ml-auto flex h-full w-full max-w-[390px] flex-col bg-white shadow-[-12px_0px_40px_0px_rgba(0,0,0,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-14 items-center justify-between border-b border-[#f0f0f0] pl-5 pr-5">
          <Link href="/" onClick={onClose} className="inline-flex">
            <Image src="/figma-logo.svg" alt="Logo Solimouv" width={100} height={34} priority />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#F2F2F2] text-[#111111]"
            aria-label="Fermer le menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="pt-6" aria-label="Navigation mobile">
          <ul>
            {rows.map((row) => {
              const active = isActive(row.href);
              return (
                <li key={`${row.href}-${row.title}`}>
                  <Link
                    href={row.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-[60px] items-center gap-[14px] px-6 py-[10px] ${
                      active ? "bg-[#FAFAFA]" : ""
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2F2F2] text-[#A7A7A7]">
                      {row.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium leading-[19.5px] text-[#111111]">
                        {row.title}
                      </span>
                      <span className="block truncate text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
                        {row.subtitle}
                      </span>
                    </span>
                    <span className="text-[#D4D4D4]">
                      <ChevronRightIcon />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8 px-5">
          {isAuthenticated && onSignOut ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                void onSignOut();
              }}
              className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#FF5C29] px-3 text-[16px] font-semibold text-white"
            >
              <SignOutIcon />
              Se deconnecter
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#FF5C29] px-3 text-[16px] font-semibold text-white"
            >
              <UserPlusIcon />
              S&apos;inscrire au festival
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
