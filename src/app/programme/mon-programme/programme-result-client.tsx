"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MobileBurgerMenu } from "@/components/mobile-burger-menu";
import { auth } from "@/lib/firebase";
import {
  defaultProgrammeActivityIds,
  getProgrammeActivityById,
  normalizeProgrammeActivityIds,
  programmeActivities,
  type ProgrammeActivity,
  type ProgrammeActivityId,
} from "@/lib/programme-data";
import {
  resolveProgrammeSelection,
  writeProgrammeSelectionToStorage,
} from "@/lib/programme-selection";

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/contact", label: "Carte" },
  { href: "/passport", label: "Mon passeport" },
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

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#FFFFFF" />
      <path d="m6.2 10.2 2.4 2.4 5.2-5.3" stroke="#0558F6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddedCheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
      <path d="m2.2 6.3 2.2 2.1 5-5" stroke="#006D34" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapLinkIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-[14px] w-[14px]" fill="none" aria-hidden>
      <path d="M1.4 2.8 5 1.4l3 1.4 3.8-1.4v9.8L8 12.6l-3-1.4-3.6 1.4V2.8Z" stroke="#0558F6" strokeWidth="1.2" />
      <path d="M5 1.4v9.8M8 2.8v9.8" stroke="#0558F6" strokeWidth="1.2" />
    </svg>
  );
}

function TimelineCard({ item }: { item: ProgrammeActivity }) {
  return (
    <div className="relative">
      <div className="absolute -left-[30px] top-6 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#F6F3F2] bg-[#0558F6]">
        <span className="h-2 w-2 rounded-full bg-white" />
      </div>
      <article className="rounded-[28px] bg-[#FCF9F8] p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold leading-5 text-[#0558F6]">{item.timeRange}</p>
            <h3 className="mt-1 text-[20px] font-semibold leading-6 text-[#1C1B1B]">{item.title}</h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,109,52,0.1)] px-3 py-1 text-xs font-bold text-[#006D34]">
            Ajoute
            <AddedCheckIcon />
          </span>
        </div>
        <p className="mt-3 text-[16px] font-medium leading-6 text-[#434656]">{item.place}</p>
        <Link href={`/contact?atelier=${item.id}`} className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#0558F6] hover:opacity-85">
          <MapLinkIcon />
          Voir sur la carte
        </Link>
      </article>
    </div>
  );
}

export function MonProgrammeClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const activitiesParam = searchParams.get("activities");

  const links = useMemo(() => {
    if (user) {
      return [
        ...baseLinks,
        { href: "/organisateur", label: "Espace organisateur" },
      ];
    }
    return baseLinks;
  }, [user]);

  const selectedIds = useMemo(() => {
    const resolved = resolveProgrammeSelection(activitiesParam);
    if (resolved.length > 0) {
      return resolved;
    }
    return defaultProgrammeActivityIds;
  }, [activitiesParam]);

  const selectedActivities = useMemo(() => {
    return selectedIds
      .map((activityId) => getProgrammeActivityById(activityId))
      .filter((activity): activity is ProgrammeActivity => activity !== null);
  }, [selectedIds]);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const suggestedActivity = useMemo(() => {
    return programmeActivities.find((activity) => !selectedIdSet.has(activity.id)) ?? null;
  }, [selectedIdSet]);

  const rewardGoal = 5;
  const remainingForReward = Math.max(0, rewardGoal - selectedActivities.length);

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  function handleAddActivity(activityId: ProgrammeActivityId) {
    const nextSelection = normalizeProgrammeActivityIds([...selectedIds, activityId]);
    writeProgrammeSelectionToStorage(nextSelection);

    const params = new URLSearchParams(searchParams.toString());
    params.set("activities", nextSelection.join(","));
    router.push(`/programme/mon-programme?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-[84px] text-[#111111] lg:pb-0">
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
                const active = pathname === link.href || (pathname.startsWith("/programme/") && link.href === "/programme");
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

      <main className="px-5 pb-8 pt-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-[1260px] lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <section>
            <h1 className="text-[28px] font-semibold leading-[42px] tracking-[-0.7px] text-[#1C1B1B] lg:text-[36px] lg:leading-[44px]">
              Ton programme - 14 juin
            </h1>

            <div className="mt-6 flex items-center gap-3 rounded-[32px] bg-[#0558F6] px-4 py-4 text-white shadow-[0px_8px_24px_-8px_rgba(5,88,246,0.4)]">
              <CheckCircleIcon />
              <p className="text-[16px] font-medium leading-6">Programme cree!</p>
            </div>

            {selectedActivities.length > 0 ? (
              <div className="relative mt-8 space-y-8 pl-9">
                <div className="absolute bottom-4 left-[11px] top-8 w-[2px] bg-[rgba(5,88,246,0.2)]" aria-hidden />
                {selectedActivities.map((item) => (
                  <TimelineCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[24px] border border-[#E0E0E0] bg-white p-5">
                <p className="text-[16px] font-semibold text-[#1C1B1B]">Aucune activite selectionnee</p>
                <p className="mt-2 text-[14px] leading-5 text-[#6F7281]">
                  Retourne dans la page Programme et appuie sur + pour ajouter tes ateliers.
                </p>
                <Link
                  href="/programme"
                  className="mt-4 inline-flex rounded-full bg-[#0558F6] px-5 py-2 text-[14px] font-semibold text-white"
                >
                  Choisir mes activites
                </Link>
              </div>
            )}
          </section>

          <aside className="mt-8 lg:mt-2">
            <h2 className="text-[18px] font-bold leading-7 text-[#1C1B1B]">Suggestion pour toi</h2>

            {suggestedActivity ? (
              <article className="mt-5 rounded-[32px] bg-[#0558F6] p-5 text-white">
                <p className="text-[14px] font-bold leading-5 text-[#F2F2F2]">{suggestedActivity.timeRange}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[18px] font-bold leading-7 text-[#FCF9F8]">{suggestedActivity.title}</h3>
                    <p className="mt-2 text-[14px] font-medium leading-5 text-[#E0E0E0]">{suggestedActivity.place}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddActivity(suggestedActivity.id)}
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-white bg-white px-6 text-[14px] font-bold text-[#FF5C29]"
                  >
                    Ajouter
                  </button>
                </div>
              </article>
            ) : (
              <article className="mt-5 rounded-[24px] border border-[#E0E0E0] bg-white p-5 text-[#1C1B1B]">
                Toutes les activites disponibles sont deja ajoutees.
              </article>
            )}

            <article className="mt-5 rounded-[12px] bg-[#FF5C29] px-4 pb-3 pt-4">
              <div className="flex items-start gap-2">
                <span className="text-[14px] font-bold uppercase leading-[20px] text-[#0A0A0A]">Trophee</span>
                <p className="text-[14px] font-medium leading-[19.6px] text-white">
                  {remainingForReward > 0
                    ? `Plus que ${remainingForReward} activites pour ta recompense exclusive Up Sport!`
                    : "Recompense exclusive debloquee, bravo!"}
                </p>
              </div>
              <div className="mt-3 flex justify-center gap-1.5">
                {Array.from({ length: rewardGoal }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-3 w-3 rounded-full ${index < selectedActivities.length ? "bg-[#7F00B1]" : "bg-[rgba(255,255,255,0.4)]"}`}
                  />
                ))}
              </div>
            </article>
          </aside>
        </div>
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
              <ProgramIcon active />
              <span className="text-[11px] font-semibold leading-[16.5px] text-[#0558f6]">Programme</span>
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
