"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { auth } from "@/lib/firebase";

type FeaturedWorkshop = {
  id: string;
  icon: string;
  title: string;
  schedule: string;
  badge: string;
  cardClassName: string;
  badgeClassName: string;
};

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
  { href: "/passport", label: "Mon passeport" },
];

const featuredWorkshops: FeaturedWorkshop[] = [
  {
    id: "badminton",
    icon: "BD",
    title: "Badminton decouverte",
    schedule: "10h00 - Club Elan Nord",
    badge: "Debutants bienvenus",
    cardClassName: "bg-[#0558F6] text-white",
    badgeClassName: "bg-white text-[#0558F6]",
  },
  {
    id: "yoga",
    icon: "YG",
    title: "Yoga & mobilite",
    schedule: "11h30 - Zen Ensemble",
    badge: "Tous niveaux",
    cardClassName: "bg-[#05AD56] text-white",
    badgeClassName: "bg-white text-[#05AD56]",
  },
  {
    id: "karate",
    icon: "KR",
    title: "Karate initiation",
    schedule: "14h00 - Gym Quartier Libre",
    badge: "Initiation",
    cardClassName: "bg-[#FF5C29] text-white",
    badgeClassName: "bg-white text-[#FF5C29]",
  },
  {
    id: "velo",
    icon: "VL",
    title: "Velo adapte",
    schedule: "15h30 - Roues pour Tous",
    badge: "Handisport",
    cardClassName: "bg-[#FF8DA4] text-white",
    badgeClassName: "bg-white text-[#FF8DA4]",
  },
  {
    id: "basket",
    icon: "BK",
    title: "Basket initiation",
    schedule: "16h00 - Aqua Solidaire",
    badge: "Famille",
    cardClassName: "bg-[#7F00B1] text-white",
    badgeClassName: "bg-white text-[#7F00B1]",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://solimouv.vercel.app";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Up Sport!",
  alternateName: "UN Is pour le sport",
  url: "https://www.unispourlesport.paris/",
  logo: `${siteUrl}/icon-512.png`,
  sameAs: [
    "https://www.facebook.com/UpSport.UNis/?locale=fr_FR",
    "https://www.instagram.com/unispourlesport/",
    "https://www.tiktok.com/@upsportparis",
  ],
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Festival Solimouv'",
  description:
    "Festival de sport inclusif organise par Up Sport! avec ateliers, initiations et animations accessibles.",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  organizer: {
    "@type": "Organization",
    name: "Up Sport!",
    url: "https://www.unispourlesport.paris/",
  },
  image: [`${siteUrl}/icon-512.png`],
  location: {
    "@type": "Place",
    name: "Paris",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
  },
};

function MobileMenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
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

export default function HomePage() {
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
    <div className="min-h-screen bg-[#f2f2f2] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <header className="relative z-20 border-b border-[#E0E0E0] bg-white">
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
                  onClick={handleSignOut}
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

      <main className="pb-[84px] lg:pb-0">
        <section className="px-4 pb-10 pt-6 lg:px-12 lg:pb-14 lg:pt-10">
          <div className="mx-auto w-full max-w-[1280px] lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
            <div className="max-w-[560px]">
              <h1 className="text-[38px] font-medium italic leading-6 text-[#FF5C29] lg:text-[52px] lg:leading-[52px]">
                LE SPORT POUR TOUS
              </h1>
              <p className="mt-5 text-[16px] leading-6 text-[#1C1B1B]">
                Le premier festival inclusif qui celebre le mouvement sous toutes ses formes.
                Decouvrez des ateliers adaptes et trouvez votre passion.
              </p>
              <Link
                href="/a-propos"
                className="mt-5 inline-flex items-center gap-2 rounded-[16px] bg-[#FF5C29] px-4 py-2 text-[16px] font-medium text-white transition hover:brightness-95"
              >
                <span>A propos de nous</span>
                <ArrowIcon className="h-[18px] w-[18px]" />
              </Link>
            </div>

            <div className="relative mx-auto mt-7 h-[315px] w-[320px] lg:mt-0 lg:h-[410px] lg:w-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma-rectangle.svg"
                alt="Atelier basket fauteuil"
                className="h-full w-full rotate-[8deg] rounded-[20px] object-cover shadow-[0_12px_26px_rgba(0,0,0,0.2)]"
              />
              <div className="absolute bottom-8 left-8 rotate-[8deg] rounded-[8px] bg-white px-4 py-2 shadow-md">
                <p className="text-[14px] italic leading-6 text-[#1C1B1B]">Prochain depart</p>
                <p className="text-[20px] font-medium leading-[16.5px] text-black">Atelier basket fauteuil</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 lg:px-12">
          <div className="mx-auto w-full max-w-[1280px]">
            <h2 className="text-[20px] font-medium leading-[16.5px] text-[#111111] lg:text-[34px] lg:leading-[38px]">
              Trouver mon sport
            </h2>
            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-[620px] text-[16px] leading-6 text-black">
                Notre algorithme vous connecte aux activites parfaites pour vos capacites.
              </p>
              <Link
                href="/programme"
                className="inline-flex items-center gap-2 text-[16px] font-medium text-[#FF5C29] transition hover:opacity-85"
              >
                <span>Voir tous les sports</span>
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 lg:px-12 lg:pb-10">
          <div className="mx-auto w-full max-w-[1280px]">
            <h2 className="text-[20px] font-medium leading-[16.5px] text-[#111111] lg:text-[34px] lg:leading-[38px]">
              Atelier a la une
            </h2>
            <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
              <div className="flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-3 xl:grid-cols-5">
                {featuredWorkshops.map((workshop) => (
                  <article
                    key={workshop.id}
                    className={`h-[170px] w-[191px] rounded-[16px] px-4 py-[18px] ${workshop.cardClassName}`}
                  >
                    <span className="inline-flex h-[41px] w-[41px] items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                      {workshop.icon}
                    </span>
                    <h3 className="mt-3 text-[16px] font-medium leading-6">{workshop.title}</h3>
                    <p className="text-[12px] leading-[18px] text-white/90">{workshop.schedule}</p>
                    <span
                      className={`mt-3 inline-flex h-[22px] w-full items-center justify-center rounded-[20px] px-[10px] text-[12px] font-medium ${workshop.badgeClassName}`}
                    >
                      {workshop.badge}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 lg:px-12 lg:pb-12">
          <div className="mx-auto w-full max-w-[1280px]">
            <article className="max-w-[620px] rounded-[16px] bg-[#C6DFF6] px-5 py-5">
              <h2 className="text-[32px] font-medium leading-[16.5px] text-black lg:text-[34px] lg:leading-[38px]">
                Carte
              </h2>
              <p className="mt-3 text-[16px] leading-6 text-black">
                Notre algorithme vous connecte aux activites parfaites pour vos capacites.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-[16px] bg-[#0558F6] px-4 py-2 text-[16px] font-medium text-white transition hover:brightness-95"
              >
                Ouvrir la carte
              </Link>
            </article>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e0e0e0] bg-white lg:hidden">
        <ul className="mx-auto flex h-[72px] w-full max-w-[640px] items-center justify-between px-[15.7px] sm:px-8">
          <li className="h-[59px] w-[60px]">
            <Link href="/" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <HomeIcon active />
              <span className="text-[11px] font-semibold leading-[16.5px] text-[#0558f6]">Accueil</span>
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
              <MapIcon />
              <span className="text-[11px] leading-[16.5px] text-[#9e9e9e]">Carte</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
