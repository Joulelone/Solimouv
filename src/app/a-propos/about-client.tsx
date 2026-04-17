"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MobileBurgerMenu } from "@/components/mobile-burger-menu";
import { auth } from "@/lib/firebase";

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/contact", label: "Carte" },
  { href: "/passport", label: "Mon passeport" },
];

const partners = [
  "Fondation PiLeJe",
  "Forca Foundation",
  "Sine Qua Non",
  "Yoga & Sport with Refugees",
  "Alice Milliat",
  "Kainos",
  "UNASS",
  "Moove toi",
  "Novosport",
  "UFOLEP 75",
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

function HomeIcon() {
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke="#A7A7A7" strokeWidth="1.8">
      <path d="M3 10.2 11 3l8 7.2v8.3a.8.8 0 0 1-.8.8H3.8a.8.8 0 0 1-.8-.8V10.2Z" />
      <path d="M8.5 19v-6h5v6" />
    </svg>
  );
}

function PassIcon() {
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke="#A7A7A7" strokeWidth="1.8">
      <rect x="2.5" y="3.5" width="17" height="15" rx="2.5" />
      <path d="M12.5 3.5v15" />
      <circle cx="15.8" cy="8.5" r="0.7" fill="#A7A7A7" stroke="none" />
      <circle cx="15.8" cy="11" r="0.7" fill="#A7A7A7" stroke="none" />
      <circle cx="15.8" cy="13.5" r="0.7" fill="#A7A7A7" stroke="none" />
    </svg>
  );
}

function ProgramIcon() {
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke="#A7A7A7" strokeWidth="1.8">
      <rect x="2.5" y="3.5" width="17" height="15" rx="2.5" />
      <path d="M2.5 8h17" />
      <path d="M7 1.8v3.4M15 1.8v3.4" />
      <path d="M6.5 11.2h3M12.5 11.2h3M6.5 14.8h3M12.5 14.8h3" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px]" fill="none" stroke="#A7A7A7" strokeWidth="1.8">
      <path d="M3 4.3 8.8 2l4.4 2 5.8-2.3v16l-5.8 2.3-4.4-2L3 20.3v-16Z" />
      <path d="M8.8 2v16M13.2 4v16" />
    </svg>
  );
}

function InclusionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#05AD56" strokeWidth="1.9">
      <circle cx="7" cy="7" r="2" fill="#05AD56" stroke="none" />
      <circle cx="17" cy="7" r="2" fill="#05AD56" stroke="none" />
      <path d="M3.5 16.5c1.1-2.4 3-3.5 5.5-3.5s4.4 1.1 5.5 3.5" />
      <path d="M11.5 16.5c.9-1.9 2.4-2.9 4.5-2.9s3.6 1 4.5 2.9" />
    </svg>
  );
}

function AccessIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#FF5C29" strokeWidth="1.9">
      <circle cx="12" cy="4" r="2" fill="#FF5C29" stroke="none" />
      <path d="M5 8h14" />
      <path d="m12 8-2 6" />
      <path d="m12 8 2 6" />
      <path d="m10 14-3 6" />
      <path d="m14 14 3 6" />
    </svg>
  );
}

function SolidarityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#7F00B1" strokeWidth="1.9">
      <path d="m12 20-1.5-1.3C6 14.8 3 12.2 3 8.9A4.9 4.9 0 0 1 7.9 4c1.7 0 3.4.8 4.1 2.1A5 5 0 0 1 16.1 4 4.9 4.9 0 0 1 21 8.9c0 3.3-3 5.9-7.5 9.8L12 20Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="white" strokeWidth="1.9">
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="white" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="white">
      <path d="M14.6 8.4V6.7c0-.8.5-1.2 1.4-1.2h1.2V2.2h-2.3c-2.7 0-4.3 1.6-4.3 4.3v1.9H8.4v3.5h2.2v9.9h4V11.9h2.4l.4-3.5h-2.8Z" />
    </svg>
  );
}

export function AboutClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const links = useMemo(() => {
    if (user) {
      return [...baseLinks, { href: "/organisateur", label: "Espace organisateur" }];
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
    <div className="min-h-screen bg-[#F2F2F2] pb-[84px] text-[#111111] lg:pb-0">
      <header className="relative z-20 border-b border-[#E0E0E0] bg-white">
        <div className="relative h-[104px] px-4 lg:hidden">
          <div className="pt-3" />
          <div className="mt-3 flex items-center justify-between">
            <div className="w-8" />
            <Link href="/" className="inline-flex">
              <Image src="/figma-logo.svg" alt="Logo Solimouv" width={150} height={50} priority />
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
      </header>
      <MobileBurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        organizerHref={user ? "/organisateur" : "/login"}
        isAuthenticated={Boolean(user)}
        onSignOut={user ? handleSignOut : undefined}
      />

      <main className="px-4 pb-8 pt-6 lg:px-12">
        <div className="mx-auto w-full max-w-[1220px] space-y-8">
          <section className="relative rounded-[22px] bg-white px-4 py-6 lg:px-8 lg:py-8">
            <Image
              src="/hero-karate.svg"
              alt="Illustration sportive"
              width={95}
              height={143}
              className="absolute right-4 top-6 hidden md:block"
            />
            <p className="max-w-[560px] text-[24px] italic leading-6 text-[#FF5C29]">
              Up Sport !<br />
              Le sport comme levier d&apos;inclusion
            </p>
            <p className="mt-4 max-w-[730px] text-[16px] leading-6 text-[#111111]">
              Fondee en 2016, Up Sport ! est une association sportive parisienne qui s&apos;engage au quotidien
              pour rendre la pratique physique accessible a tous. Nous voyons le sport comme un outil de lien
              social, de dignite et d&apos;autonomie pour les personnes en situation de vulnerabilite.
            </p>
          </section>

          <section className="rounded-[22px] bg-white px-4 py-6 lg:px-8">
            <h2 className="text-[18px] font-semibold leading-[27px] text-[#1C1B1B]">Up Sport ! en chiffres</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <article className="rounded-[20px] bg-[#0558F6] p-6 text-white">
                <p className="text-[16px]">
                  <span className="font-bold">250</span> personnes
                </p>
                <p className="mt-1 text-[14px] text-[#F2F2F2]">accompagnees en moyenne chaque semaine.</p>
              </article>
              <article className="rounded-[20px] bg-[#05AD56] p-6 text-white">
                <p className="text-[16px]">
                  <span className="font-bold">30</span> seances
                </p>
                <p className="mt-1 text-[14px] text-[#E0E0E0]">hebdomadaires pour bouger ensemble.</p>
              </article>
              <article className="rounded-[20px] bg-[#7F00B1] p-6 text-white">
                <p className="text-[16px]">
                  <span className="font-bold">4</span> combats
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#F0EDEC] px-3 py-1 text-[12px] text-[#7F00B1]">Public feminin</span>
                  <span className="rounded-full bg-[#F0EDEC] px-3 py-1 text-[12px] text-[#7F00B1]">Public exclu</span>
                  <span className="rounded-full bg-[#F0EDEC] px-3 py-1 text-[12px] text-[#7F00B1]">Sport sante</span>
                  <span className="rounded-full bg-white px-3 py-1 text-[12px] text-[#7F00B1]">Insertion pro</span>
                </div>
              </article>
            </div>
          </section>

          <section className="rounded-[22px] bg-white px-4 py-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-10">
              <div className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(5,173,86,0.13)]">
                  <InclusionIcon />
                </span>
                <p className="mt-2 text-[16px] font-bold">Inclusion</p>
              </div>
              <div className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,92,41,0.2)]">
                  <AccessIcon />
                </span>
                <p className="mt-2 text-[16px] font-bold">Accessibilite</p>
              </div>
              <div className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(127,0,177,0.2)]">
                  <SolidarityIcon />
                </span>
                <p className="mt-2 text-[16px] font-bold">Solidarite</p>
              </div>
            </div>

            <div className="mt-7 flex justify-center">
              <Image src="/figma-logo.svg" alt="Logo Solimouv" width={150} height={52} />
            </div>
            <p className="mx-auto mt-4 max-w-[760px] text-[16px] leading-6 text-[#111111]">
              Ne de la volonte d&apos;Up Sport ! et d&apos;un collectif d&apos;associations partenaires, Solimouv&apos; est
              l&apos;evenement phare du sport inclusif a Paris. Une celebration de la diversite ou chacun trouve
              sa place, sur le terrain comme en dehors.
            </p>
          </section>

          <section className="rounded-[22px] bg-white px-4 py-6 lg:px-8">
            <h3 className="text-[20px] font-semibold leading-[24px] text-[#111111]">Edition 1 - Juillet 2025</h3>
            <p className="mt-3 text-[16px] leading-6 text-black">
              Notre evenement inaugural a reuni des participants de tous horizons autour d&apos;ateliers adaptes.
            </p>
            <p className="mt-2 text-[16px] font-medium leading-6 text-[#FF5C29]">Un succes solidaire</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[#0558F6] px-3 py-1 text-[11px] text-white">+500 participants</span>
              <span className="rounded-full bg-[#FF8DA4] px-3 py-1 text-[11px] text-[#F4F4F5]">13 associations partenaires</span>
              <span className="rounded-full bg-[#05AD56] px-3 py-1 text-[11px] text-[#FCF9F8]">40 benevoles</span>
            </div>
          </section>

          <section className="rounded-[22px] bg-white px-4 py-6 lg:px-8">
            <h3 className="text-center text-[18px] font-semibold leading-[27px] text-[#1C1B1B]">Nos Partenaires</h3>
            <div className="mt-4 overflow-x-auto pb-1">
              <div className="flex w-max gap-1.5">
                {partners.map((partner) => (
                  <span key={partner} className="rounded-[20px] bg-[#FF5C29] px-3 py-1 text-[14px] font-medium text-white">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[40px] bg-[#FCF9F8] px-6 py-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <h3 className="text-[18px] font-semibold leading-[27px] text-[#1C1B1B]">Nous Contacter</h3>
            <form className="mt-4 space-y-4" aria-label="Formulaire de contact">
              <div>
                <label htmlFor="fullName" className="text-[14px] font-medium leading-5 text-[#434656]">
                  Nom complet
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Votre nom"
                  className="mt-1 h-[50px] w-full rounded-[32px] border border-transparent bg-[#F6F3F2] px-4 text-[16px] text-[#111111] outline-none placeholder:text-[#C3C5D8] focus:border-[#0558F6]"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-[14px] font-medium leading-5 text-[#434656]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="mt-1 h-[50px] w-full rounded-[32px] border border-transparent bg-[#F6F3F2] px-4 text-[16px] text-[#111111] outline-none placeholder:text-[#C3C5D8] focus:border-[#0558F6]"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-[14px] font-medium leading-5 text-[#434656]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="mt-1 w-full resize-y rounded-[32px] border border-transparent bg-[#F6F3F2] px-4 py-3 text-[16px] text-[#111111] outline-none placeholder:text-[#C3C5D8] focus:border-[#0558F6]"
                />
              </div>
              <button
                type="button"
                className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#0558F6] text-[16px] font-medium text-white transition hover:brightness-95"
              >
                Envoyer mon message
              </button>
            </form>
          </section>

          <section className="flex items-center justify-center gap-12 pb-1">
            <a
              href="https://www.instagram.com/unispourlesport/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[8px] bg-[#FF7D54]"
              aria-label="Instagram Up Sport"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/UpSport.UNis/?locale=fr_FR"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[6px] bg-[#FF7D54]"
              aria-label="Facebook Up Sport"
            >
              <FacebookIcon />
            </a>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e0e0e0] bg-white lg:hidden">
        <ul className="mx-auto flex h-[72px] w-full max-w-[640px] items-center justify-between px-[15.7px] sm:px-8">
          <li className="h-[59px] w-[60px]">
            <Link href="/" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <HomeIcon />
              <span className="text-[11px] leading-[16.5px] text-[#A7A7A7]">Accueil</span>
            </Link>
          </li>
          <li className="h-[59px] w-[71px]">
            <Link href="/passport" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <PassIcon />
              <span className="text-[11px] leading-[16.5px] text-[#A7A7A7]">Mon Pass</span>
            </Link>
          </li>
          <li className="h-[59px] w-[81px]">
            <Link href="/programme" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <ProgramIcon />
              <span className="text-[11px] leading-[16.5px] text-[#A7A7A7]">Programme</span>
            </Link>
          </li>
          <li className="h-[59px] w-[52px]">
            <Link href="/contact" className="flex h-full flex-col items-center justify-center gap-[3.75px] px-3 pb-2 pt-[8.25px]">
              <MapIcon />
              <span className="text-[11px] leading-[16.5px] text-[#A7A7A7]">Carte</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
