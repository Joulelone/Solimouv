"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { auth } from "@/lib/firebase";

type NearbyStand = {
  id: string;
  iconSrc: string;
  iconBackgroundClass: string;
  title: string;
  distance: string;
  tags: Array<{ label: string; className: string }>;
};

type Marker = {
  id: string;
  label: string;
  top: string;
  left: string;
  iconSrc?: string;
  iconAlt?: string;
  backgroundColor: string;
  size: "sm" | "md";
};

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
  { href: "/passport", label: "Mon passeport" },
];

const markers: Marker[] = [
  {
    id: "badminton",
    label: "Badminton",
    top: "20%",
    left: "30%",
    iconSrc: "/map/icon-badminton.png",
    iconAlt: "Icone badminton",
    backgroundColor: "#0043C2",
    size: "md",
  },
  {
    id: "yoga",
    label: "Yoga",
    top: "45%",
    left: "74%",
    iconSrc: "/map/icon-yoga.png",
    iconAlt: "Icone yoga",
    backgroundColor: "#9B32CD",
    size: "md",
  },
  {
    id: "boxe",
    label: "Boxe",
    top: "62%",
    left: "22%",
    iconSrc: "/map/icon-boxe.png",
    iconAlt: "Icone boxe",
    backgroundColor: "#BA1A1A",
    size: "md",
  },
  {
    id: "accessibilite",
    label: "Accessibilite",
    top: "75%",
    left: "52%",
    backgroundColor: "#FFDF3C",
    size: "sm",
  },
];

const nearbyStands: NearbyStand[] = [
  {
    id: "initiation-boxe",
    iconSrc: "/map/icon-boxe.png",
    iconBackgroundClass: "bg-[#FFDAD6]",
    title: "Initiation Boxe",
    distance: "2 min (150m)",
    tags: [
      { label: "Combat", className: "bg-[#F0EDEC] text-[#434656]" },
      { label: "Ouvert", className: "bg-[#75FD9B] text-[#007437]" },
    ],
  },
  {
    id: "yoga-doux",
    iconSrc: "/map/icon-yoga.png",
    iconBackgroundClass: "bg-[#9B32CD]",
    title: "Yoga doux",
    distance: "5 min (400m)",
    tags: [
      { label: "Zen", className: "bg-[rgba(255,141,164,0.2)] text-[#7F00B1]" },
      { label: "14:00", className: "bg-[#F0EDEC] text-[#434656]" },
    ],
  },
  {
    id: "tournoi-bad",
    iconSrc: "/map/icon-badminton.png",
    iconBackgroundClass: "bg-[#0558F6]",
    title: "Tournoi Bad",
    distance: "8 min (600m)",
    tags: [
      { label: "Raquette", className: "bg-[#F0EDEC] text-[#434656]" },
      { label: "En cours", className: "bg-[#75FD9B] text-[#007437]" },
    ],
  },
];

function MobileMenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  const stroke = active ? "#0558F6" : "#9E9E9E";
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke={stroke} strokeWidth="1.8">
      <path d="M3 10.2 11 3l8 7.2v8.3a.8.8 0 0 1-.8.8H3.8a.8.8 0 0 1-.8-.8V10.2Z" />
      <path d="M8.5 19v-6h5v6" />
    </svg>
  );
}

function PassIcon({ active }: { active?: boolean }) {
  const stroke = active ? "#0558F6" : "#9E9E9E";
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke={stroke} strokeWidth="1.8">
      <rect x="2.5" y="3.5" width="17" height="15" rx="2.5" />
      <path d="M12.5 3.5v15" />
      <circle cx="15.8" cy="8.5" r="0.7" fill={stroke} stroke="none" />
      <circle cx="15.8" cy="11" r="0.7" fill={stroke} stroke="none" />
      <circle cx="15.8" cy="13.5" r="0.7" fill={stroke} stroke="none" />
    </svg>
  );
}

function ProgramIcon({ active }: { active?: boolean }) {
  const stroke = active ? "#0558F6" : "#9E9E9E";
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke={stroke} strokeWidth="1.8">
      <rect x="2.5" y="3.5" width="17" height="15" rx="2.5" />
      <path d="M2.5 8h17" />
      <path d="M7 1.8v3.4M15 1.8v3.4" />
      <path d="M6.5 11.2h3M12.5 11.2h3M6.5 14.8h3M12.5 14.8h3" />
    </svg>
  );
}

function MapIcon({ active }: { active?: boolean }) {
  const stroke = active ? "#0558F6" : "#9E9E9E";
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke={stroke} strokeWidth="1.8">
      <path d="M3 4.3 8.8 2l4.4 2 5.8-2.3v16l-5.8 2.3-4.4-2L3 20.3v-16Z" />
      <path d="M8.8 2v16M13.2 4v16" />
    </svg>
  );
}

function LocationWalkIcon() {
  return (
    <Image src="/map/icon-distance.svg" alt="Distance" width={8} height={13} aria-hidden />
  );
}

function AccessibilityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#1c1b1b" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="4" r="2" fill="#1c1b1b" stroke="none" />
      <path d="M5 8h14" />
      <path d="m12 8-2 6" />
      <path d="m12 8 2 6" />
      <path d="m10 14-3 6" />
      <path d="m14 14 3 6" />
    </svg>
  );
}

function MarkerPin({ marker }: { marker: Marker }) {
  const sizeClass = marker.size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: marker.top, left: marker.left }}>
      <div className="flex flex-col items-center">
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full border-2 border-[#FCF9F8] shadow-md`}
          style={{ backgroundColor: marker.backgroundColor }}
        >
          {marker.id === "accessibilite" ? (
            <AccessibilityIcon />
          ) : (
            <Image src={marker.iconSrc ?? ""} alt={marker.iconAlt ?? ""} width={24} height={24} className="h-6 w-6 object-contain" />
          )}
        </div>
        {marker.id !== "accessibilite" ? (
          <span className="mt-1 rounded-full bg-[rgba(252,249,248,0.9)] px-2 py-[2px] text-[10px] font-bold text-[#1c1b1b]">
            {marker.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StandCard({ stand }: { stand: NearbyStand }) {
  return (
    <article className="min-w-[240px] rounded-none bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:min-w-0 lg:rounded-2xl">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stand.iconBackgroundClass}`}>
          <Image src={stand.iconSrc} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold leading-6 text-[#1C1B1B]">{stand.title}</h3>
          <p className="flex items-center gap-[6px] text-[13px] text-[#434656]">
            <LocationWalkIcon />
            <span>{stand.distance}</span>
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {stand.tags.map((tag) => (
          <span
            key={tag.label}
            className={`inline-flex rounded-full px-2 py-1 text-[11px] tracking-[0.04em] ${tag.className}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function ContactMapClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const links = useMemo(() => {
    if (user) {
      return [...baseLinks, { href: "/organisateur", label: "Espace organisateur" }, { href: "/app/dashboard", label: "Dashboard" }];
    }
    return baseLinks;
  }, [user]);

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#111111]">
      <header className="relative z-30 border-b border-[#E0E0E0] bg-white">
        <div className="relative h-[104px] px-4 lg:hidden">
          <div className="pt-3" />
          <div className="mt-3 flex items-center justify-between">
            <div className="w-8" />
            <Link href="/" className="inline-flex">
              <Image src="/figma-logo.svg" alt="Logo Solimouv" width={140} height={50} priority />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((state) => !state)}
              className="inline-flex h-8 w-8 items-center justify-center text-[#111111]"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              <MobileMenuIcon />
            </button>
          </div>
        </div>

        <div className="hidden h-[92px] items-center gap-6 px-8 xl:px-12 lg:flex">
          <Link href="/" className="shrink-0">
            <Image src="/figma-logo.svg" alt="Logo Solimouv" width={170} height={60} priority />
          </Link>

          <nav className="min-w-0 flex-1" aria-label="Navigation principale">
            <ul className="flex items-center gap-1 overflow-x-auto pb-1 text-sm">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="shrink-0">
                    <Link
                      href={link.href}
                      className={`inline-flex rounded-full px-4 py-2 font-medium transition ${
                        active ? "bg-[#0558F6] text-white" : "text-[#111111] hover:bg-[#F2F2F2]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <p className="max-w-[220px] truncate text-xs text-[#8A8A8A]">{user.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    void handleSignOut();
                  }}
                  className="rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#111111] hover:bg-[#F2F2F2]"
                >
                  Se deconnecter
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#111111] hover:bg-[#F2F2F2]"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[#E0E0E0] bg-white px-5 py-4 lg:hidden">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-3 py-2 text-sm font-medium ${
                      pathname === link.href ? "bg-[#F2F2F2] text-[#0558F6]" : "text-[#111111]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-[#E0E0E0] pt-4">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    void handleSignOut();
                  }}
                  className="rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#111111]"
                >
                  Se deconnecter
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#111111]"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative pb-[72px] lg:pb-0">
        <section className="relative h-[calc(100vh-104px-72px)] min-h-[620px] overflow-hidden lg:h-[calc(100vh-92px)] lg:min-h-[700px]">
          <Image src="/map/map-view.png" alt="Carte des stands Solimouv" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-[rgba(0,56,62,0.12)]" aria-hidden />

          <div className="absolute left-[55%] top-[47%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-12 w-12 rounded-full bg-[rgba(0,67,194,0.32)]" />
            <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0043C2]" />
          </div>

          {markers.map((marker) => (
            <MarkerPin key={marker.id} marker={marker} />
          ))}

          <section className="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-[#FCF9F8] pb-4 shadow-[0px_-8px_30px_0px_rgba(0,0,0,0.1)] lg:hidden" aria-label="Stands a proximite">
            <div className="flex justify-center pb-2 pt-3">
              <div className="h-1.5 w-12 rounded-full bg-[#DCD9D9]" />
            </div>
            <div className="px-6 pb-2">
              <h2 className="text-[36px] font-bold leading-[42px] text-[#1C1B1B]">Stands a proximite</h2>
            </div>
            <div className="overflow-x-auto px-6 pb-2">
              <div className="flex w-max gap-4">
                {nearbyStands.map((stand) => (
                  <StandCard key={stand.id} stand={stand} />
                ))}
              </div>
            </div>
          </section>

          <aside className="hidden lg:absolute lg:bottom-6 lg:right-6 lg:top-6 lg:flex lg:w-[390px] lg:flex-col lg:rounded-[24px] lg:bg-[#FCF9F8] lg:shadow-[0px_12px_35px_rgba(0,0,0,0.18)]">
            <div className="px-6 pb-2 pt-6">
              <h1 className="text-[34px] font-bold leading-[38px] text-[#1C1B1B]">Stands a proximite</h1>
              <p className="mt-2 text-sm text-[#434656]">Selection des ateliers ouverts autour de vous.</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
              {nearbyStands.map((stand) => (
                <StandCard key={stand.id} stand={stand} />
              ))}
            </div>
          </aside>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e0e0e0] bg-white lg:hidden">
        <ul className="mx-auto flex h-[72px] w-full max-w-[640px] items-center justify-between px-[15.7px] sm:px-8">
          <li className="h-[59px] w-[60px]">
            <Link href="/" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <HomeIcon />
              <span className="text-[11px] leading-[16.5px] text-[#9e9e9e]">Accueil</span>
            </Link>
          </li>
          <li className="h-[59px] w-[71px]">
            <Link href="/passport" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <PassIcon />
              <span className="text-[11px] leading-[16.5px] text-[#9e9e9e]">Mon Pass</span>
            </Link>
          </li>
          <li className="h-[59px] w-[81px]">
            <Link href="/programme" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <ProgramIcon />
              <span className="text-[11px] leading-[16.5px] text-[#9e9e9e]">Programme</span>
            </Link>
          </li>
          <li className="h-[59px] w-[52px]">
            <Link href="/contact" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <MapIcon active />
              <span className="text-[11px] font-semibold leading-[16.5px] text-[#0558f6]">Carte</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
