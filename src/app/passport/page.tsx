"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-provider";
import { MobileBurgerMenu } from "@/components/mobile-burger-menu";
import { usePassportScans } from "@/hooks/use-passport-scans";
import { auth } from "@/lib/firebase";
import { FESTIVAL_STANDS } from "@/lib/festival-stands";

type StandCard = {
  id: string;
  name: string;
  place: string;
  time: string;
  done: boolean;
};

const STAND_EXTRA: Record<string, { place: string; time: string }> = {
  "basket-inclusif": { place: "Club Elan Nord", time: "10h00" },
  "football-solidaire": { place: "Zen Ensemble", time: "11h30" },
  "danse-urbaine": { place: "Gym Quartier Libre", time: "14h00" },
  "yoga-bien-etre": { place: "Roues pour Tous", time: "15h30" },
  "boxe-educative": { place: "Aqua Solidaire", time: "16h00" },
  "premiers-secours": { place: "Atelier Prevention", time: "16h30" },
};

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/contact", label: "Carte" },
  { href: "/passport", label: "Mon passeport" },
];

function buildQrImageUrl(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    value,
  )}`;
}

function getParticipantName(displayName: string | null | undefined, email: string | null | undefined) {
  if (displayName && displayName.trim().length > 0) {
    return displayName.trim();
  }

  if (!email) {
    return "Participant";
  }

  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (cleaned.length === 0) {
    return "Participant";
  }

  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(fullName: string) {
  const parts = fullName
    .split(" ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return "SP";
  }

  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
}

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
    <svg viewBox="0 0 22 22" className="h-6 w-6" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5h16v2.3a2 2 0 0 1 0 4.4V15.5H3v-2.3a2 2 0 0 0 0-4.4V6.5Z" />
      <path d="M12 6.5v2M12 10.2v1.6M12 13.5v2" />
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

export default function PassportPage() {
  const { user, isConfigured } = useAuth();
  const { visitedStandIds, loading, error } = usePassportScans(user?.uid);
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const links = useMemo(() => {
    if (user) {
      return [...baseLinks, { href: "/organisateur", label: "Espace organisateur" }];
    }

    return baseLinks;
  }, [user]);

  const checkInUrl =
    origin && user?.uid ? `${origin}/check-in?user=${encodeURIComponent(user.uid)}` : "";
  const qrImageUrl = checkInUrl ? buildQrImageUrl(checkInUrl) : "";

  const participantName = useMemo(
    () => getParticipantName(user?.displayName, user?.email),
    [user?.displayName, user?.email],
  );
  const initials = useMemo(() => getInitials(participantName), [participantName]);

  const standCards = useMemo<StandCard[]>(() => {
    const source = FESTIVAL_STANDS.slice(0, 5);
    return source.map((stand) => {
      const extra = STAND_EXTRA[stand.id] ?? {
        place: stand.location,
        time: "A definir",
      };

      return {
        id: stand.id,
        name: stand.name,
        place: extra.place,
        time: extra.time,
        done: visitedStandIds.has(stand.id),
      };
    });
  }, [visitedStandIds]);

  const completed = standCards.filter((card) => card.done).length;
  const total = standCards.length;
  const remaining = Math.max(0, total - completed);
  const progress = total === 0 ? 0 : (completed / total) * 100;

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f2f2f2] pb-[84px] text-[#111111] lg:pb-0">
        <div className="w-full">
          <div className="w-full bg-[#f2f2f2]">
            <header className="relative z-20 border-b border-[#E0E0E0] bg-white">
              <div className="relative h-[141px] px-5 lg:hidden">
                <div className="pt-6" />
                <div className="mt-3 flex items-center justify-between">
                  <div className="w-8" />
                  <Link href="/" className="inline-flex">
                    <Image src="/figma-logo.svg" alt="Logo Solimouv" width={151} height={54} priority />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((current) => !current)}
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
                      const active =
                        pathname === link.href ||
                        (link.href === "/organisateur" && pathname === "/check-in");
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

            <section className="border-y border-[#e0e0e0] bg-white px-5 py-[6px] lg:px-8">
              <h1 className="text-[30px] font-bold leading-[30px]">Mon pass&apos;sport</h1>
              <p className="text-[13px] leading-[19.5px] text-[#9e9e9e]">
                Presente ce QR Code aux referents
              </p>
            </section>

            <section className="rounded-b-[20px] bg-[#0558f6] px-6 py-6 sm:px-8 lg:rounded-none lg:px-8">
              <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-[14px] self-start sm:self-center lg:self-auto">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-[18px] font-bold text-[#0558f6]">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[30px] font-bold leading-[30px] text-white sm:text-[36px] sm:leading-[36px]">
                      {participantName}
                    </p>
                    <p className="mt-1 text-[13px] leading-[19.5px] text-white/75">Participant 2025</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex h-[130px] w-[132px] items-center justify-center rounded-[20px] bg-white p-3">
                    {qrImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrImageUrl}
                        alt="QR code personnel du passeport"
                        className="h-[106px] w-[106px]"
                      />
                    ) : (
                      <p className="text-xs text-[#9e9e9e]">Chargement...</p>
                    )}
                  </div>

                  <p className="mt-3 text-center text-[11px] leading-[16.5px] text-white/65">
                    Presente ce code aux animateurs
                  </p>
                </div>
              </div>
            </section>

            <section className="px-5 pt-6 lg:px-8">
              <h2 className="text-[30px] font-bold leading-[30px]">Ton parcours</h2>
              <p className="mt-1 text-[13px] leading-[19.5px] text-[#9e9e9e]">
                {completed} activites sur {total}
              </p>

              <div className="mt-3 h-2 w-full overflow-hidden rounded bg-[#e0e0e0]">
                <div
                  className="h-full rounded bg-[#05ad56] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            <section className="px-5 pb-0 pt-4 lg:px-8">
              <div className="grid grid-cols-2 gap-[8px] lg:grid-cols-3 xl:grid-cols-4">
                {standCards.map((stand) => (
                  <article
                    key={stand.id}
                    className={`h-[151px] rounded-[12px] border px-[12px] py-[15px] ${
                      stand.done
                        ? "border-[#05ad56] bg-[#f0fff7]"
                        : "border-[#e0e0e0] bg-white opacity-55"
                    }`}
                  >
                    <div className="h-[30px]" />
                    <p
                      className={`mt-[2px] text-[13px] leading-[19.5px] ${
                        stand.done ? "font-medium text-[#111111]" : "font-normal text-[#9e9e9e]"
                      }`}
                    >
                      {stand.name}
                    </p>
                    <p className="mt-[2px] text-[11px] leading-[16.5px] text-[#9e9e9e]">
                      {stand.place}
                    </p>
                    <p className="text-[11px] leading-[16.5px] text-[#9e9e9e]">{stand.time}</p>

                    <div
                      className={`mt-3 inline-flex h-[17px] items-center rounded-full px-2 py-[2px] text-[10px] leading-[15px] ${
                        stand.done ? "bg-[#05ad56] font-medium text-white" : "bg-[#f2f2f2] font-normal text-[#9e9e9e]"
                      }`}
                    >
                      {stand.done ? "Complete" : "A scanner"}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="px-5 pb-6 pt-4 lg:px-8">
              <h3 className="text-[14px] font-medium leading-[21px] text-[#111111]">Ta recompense</h3>
              <div className="mt-[10px] rounded-[12px] bg-[#ff5c29] px-4 pb-3 pt-4">
                <p className="flex items-start gap-[10px] text-[14px] font-medium leading-[19.6px] text-white">
                  <span aria-hidden>🏆</span>
                  <span>
                    {remaining > 0
                      ? `Plus que ${remaining} activites pour ta recompense exclusive Up Sport!`
                      : "Bravo, ta recompense exclusive Up Sport est debloquee!"}
                  </span>
                </p>
                <div className="mt-3 flex items-center justify-center gap-[6px]">
                  {Array.from({ length: total }).map((_, index) => {
                    const done = index < completed;
                    return (
                      <span
                        key={`dot-${index}`}
                        className={`h-3 w-3 rounded-full ${done ? "bg-[#7f00b1]" : "bg-white/40"}`}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            {!isConfigured ? (
              <section className="px-5 pb-4 lg:px-8">
                <p className="rounded-lg border border-amber-200/50 bg-amber-100 px-3 py-2 text-xs text-amber-700">
                  Firebase non configure. Ajoute les variables NEXT_PUBLIC_FIREBASE_*.
                </p>
              </section>
            ) : null}

            {error ? (
              <section className="px-5 pb-4 lg:px-8">
                <p className="rounded-lg border border-rose-300/70 bg-rose-100 px-3 py-2 text-xs text-rose-700">
                  {error}
                </p>
              </section>
            ) : null}

            {loading ? (
              <section className="px-5 pb-4 lg:px-8">
                <p className="text-xs text-[#9e9e9e]">Chargement de la progression...</p>
              </section>
            ) : null}

            {!loading && checkInUrl ? (
              <section className="px-5 pb-6 lg:px-8">
                <p className="break-all text-[10px] leading-[14px] text-[#9e9e9e]">
                  {checkInUrl}
                </p>
              </section>
            ) : null}
          </div>
        </div>
      </div>

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
              <PassIcon active />
              <span className="text-[11px] font-semibold leading-[16.5px] text-[#0558f6]">Mon Pass</span>
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
    </AuthGuard>
  );
}
