"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { auth } from "@/lib/firebase";

type Workshop = {
  icon: string;
  title: string;
  schedule: string;
  badge: string;
  cardClassName: string;
  badgeClassName: string;
};

type Story = {
  initials: string;
  name: string;
  age: string;
  chips: string[];
  quote: string;
  avatarClassName: string;
  chipClassName: string;
};

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
  { href: "/passport", label: "Mon passeport" },
];

const workshops: Workshop[] = [
  {
    icon: "BD",
    title: "Badminton decouverte",
    schedule: "10h00 - Club Elan Nord",
    badge: "Debutants bienvenus",
    cardClassName: "bg-[#0657F5] text-white",
    badgeClassName: "bg-white text-[#0558F6]",
  },
  {
    icon: "YG",
    title: "Yoga & mobilite",
    schedule: "11h30 - Zen Ensemble",
    badge: "Tous niveaux",
    cardClassName: "bg-[#0AAD56] text-white",
    badgeClassName: "bg-white text-[#05AD56]",
  },
  {
    icon: "BX",
    title: "Boxe initiation",
    schedule: "14h00 - Gym Quartier Libre",
    badge: "Initiation",
    cardClassName: "bg-[#FF5C29] text-white",
    badgeClassName: "bg-white text-[#FF5C29]",
  },
  {
    icon: "VL",
    title: "Velo adapte",
    schedule: "15h30 - Roues pour Tous",
    badge: "Handisport",
    cardClassName: "bg-[#7F00B1] text-white",
    badgeClassName: "bg-white text-[#7F00B1]",
  },
  {
    icon: "NT",
    title: "Natation libre",
    schedule: "16h00 - Aqua Solidaire",
    badge: "Famille",
    cardClassName: "bg-[#FF8DA4] text-white",
    badgeClassName: "bg-white text-[#FF8DA4]",
  },
];

const stories: Story[] = [
  {
    initials: "AM",
    name: "Amara",
    age: "22 ans",
    chips: ["Yoga", "Refugiee"],
    quote: "Je n avais jamais pense que le sport pouvait m aider autant.",
    avatarClassName: "bg-[#FFDF3C] text-[#111111]",
    chipClassName: "bg-[#FFDF3C21] text-[#D3AF00]",
  },
  {
    initials: "TH",
    name: "Theo",
    age: "17 ans",
    chips: ["Velo adapte", "Handisport"],
    quote: "Le velo adapte m a montre que mes limites c est moi qui les fixe.",
    avatarClassName: "bg-[#FF5C29] text-white",
    chipClassName: "bg-[#FF5C2921] text-[#FF5C29]",
  },
  {
    initials: "FA",
    name: "Fatou",
    age: "24 ans",
    chips: ["Boxe", "Quartier prioritaire"],
    quote: "J avais peur du regard des autres. La bas, personne ne juge.",
    avatarClassName: "bg-[#7F00B1] text-white",
    chipClassName: "bg-[#7F00B121] text-[#7F00B1]",
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
    <div className="min-h-screen bg-[#EFECEF] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <div className="w-full bg-white">
        <header className="relative z-20 border-b border-[#E0E0E0] bg-white">
          <div className="relative h-[141px] px-5 lg:hidden">
            <p className="pt-6 text-xs text-[#B5B5B5]">Home</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="w-8" />
              <Link href="/" className="inline-flex">
                <Image
                  src="/figma-logo.svg"
                  alt="Logo Solimouv"
                  width={151}
                  height={54}
                  priority
                />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((state) => !state)}
                className="inline-flex h-8 w-8 items-center justify-center text-[#111111]"
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={menuOpen}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
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

        <main className="pb-[86px] lg:pb-0">
          <section className="relative h-[517px] overflow-hidden rounded-b-[20px] bg-[#6B5AA0] lg:h-[clamp(360px,42vw,620px)] lg:rounded-none">
            <Image
              src="/figma-rectangle.svg"
              alt="Visuel hero Solimouv"
              fill
              priority
              className="object-cover object-center lg:object-contain lg:object-center"
              sizes="100vw"
            />
          </section>

          <section className="bg-[#FADDDD] px-5 pb-11 pt-9 lg:px-12 lg:py-14">
            <p className="mx-auto max-w-[760px] text-center text-[30px] font-medium leading-tight lg:text-[36px]">
              Decouvre un terrain de jeu ou personne n est sur la touche.
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/passport"
                className="inline-flex h-10 min-w-[215px] items-center justify-center rounded-full bg-[#FF5C29] px-6 text-lg font-semibold text-white transition hover:brightness-95 lg:h-12 lg:min-w-[280px]"
              >
                C est quoi Solimouv ?
              </Link>
            </div>
          </section>

          <section className="px-5 pb-10 pt-12 lg:px-12 lg:pt-14">
            <h2 className="text-[34px] font-bold leading-tight lg:text-[42px]">
              Les ateliers du festival
            </h2>
            <div className="-mx-5 mt-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
              <div className="flex w-max gap-3 lg:grid lg:w-full lg:grid-cols-3 xl:grid-cols-5">
                {workshops.map((workshop) => (
                  <article
                    key={workshop.title}
                    className={`h-[170px] w-[174px] rounded-[20px] border border-[#E0E0E0] px-[15px] py-[18px] lg:w-auto ${workshop.cardClassName}`}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                      {workshop.icon}
                    </span>
                    <h3 className="mt-3 text-sm font-bold leading-[18px]">{workshop.title}</h3>
                    <p className="mt-1 text-xs text-white/90">{workshop.schedule}</p>
                    <span className={`mt-5 inline-flex h-[22px] items-center rounded-full px-[10px] text-[11px] font-medium ${workshop.badgeClassName}`}>
                      {workshop.badge}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-t-[20px] bg-[#FADDDD] px-5 pb-10 pt-8 lg:px-12 lg:py-12">
            <h2 className="text-[20px] font-bold lg:text-[36px]">Ils ont trouve leur sport</h2>
            <p className="mt-1 text-[13px] text-[#777777] lg:text-base">
              Des parcours qui nous ressemblent
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {stories.map((story) => (
                <article key={`${story.name}-${story.age}`} className="rounded-xl border border-[#E0E0E0] bg-white px-4 pb-4 pt-[17px]">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${story.avatarClassName}`}>
                      {story.initials}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold">
                        {story.name}, {story.age}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {story.chips.map((chip) => (
                          <span key={chip} className={`inline-flex h-[20px] items-center rounded-full px-2 text-[11px] ${story.chipClassName}`}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] italic leading-5 text-[#9E9E9E]">{story.quote}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="bg-[#0558F6] px-5 pb-5 pt-5 lg:px-12 lg:pb-10 lg:pt-9">
            <h2 className="text-[18px] font-bold text-white lg:text-[30px]">
              Restez informes du festival
            </h2>
            <form className="mt-4 grid gap-[10px] lg:max-w-[520px]">
              <input
                type="email"
                placeholder="Votre email"
                className="h-12 w-full rounded-[8px] border border-white bg-white px-[14px] text-sm text-[#111111] placeholder:text-[#11111180] focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button type="button" className="h-11 w-full rounded-full bg-[#FF5C29] text-sm font-semibold text-white transition hover:brightness-95">
                S inscrire
              </button>
            </form>
          </section>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E0E0E0] bg-white lg:hidden">
          <ul className="mx-auto grid h-[72px] w-full max-w-[390px] grid-cols-4 px-2">
            <li className="flex">
              <Link href="/" className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-[#0558F6]">
                <span className="text-sm">ACC</span>
                Accueil
              </Link>
            </li>
            <li className="flex">
              <Link href="/passport" className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] text-[#9E9E9E]">
                <span className="text-sm">PAS</span>
                Mon Pass
              </Link>
            </li>
            <li className="flex">
              <Link href="/programme" className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] text-[#9E9E9E]">
                <span className="text-sm">PRO</span>
                Programme
              </Link>
            </li>
            <li className="flex">
              <Link href="/contact" className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] text-[#9E9E9E]">
                <span className="text-sm">MAP</span>
                Carte
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
