"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { MobileBurgerMenu } from "@/components/mobile-burger-menu";
import { auth } from "@/lib/firebase";

type FilterId =
  | "all"
  | "morning"
  | "afternoon"
  | "evening"
  | "beginner"
  | "handisport"
  | "family";

type Activity = {
  id: string;
  time: string;
  title: string;
  place: string;
  badge: string;
  badgeColor: string;
  tags: FilterId[];
};

const baseLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "A propos" },
  { href: "/programme", label: "Programme" },
  { href: "/associations", label: "Associations" },
  { href: "/contact", label: "Contact" },
  { href: "/passport", label: "Mon passeport" },
];

const filters: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "Tout" },
  { id: "morning", label: "Matin" },
  { id: "afternoon", label: "Apres-midi" },
  { id: "evening", label: "Soir" },
  { id: "beginner", label: "Debutants" },
  { id: "handisport", label: "Handisport" },
  { id: "family", label: "Famille" },
];

const activities: Activity[] = [
  {
    id: "badminton",
    time: "10h00",
    title: "Badminton decouverte",
    place: "Club Elan Nord - Terrain B",
    badge: "Debutants bienvenus",
    badgeColor: "bg-[#0558f6]",
    tags: ["morning", "beginner"],
  },
  {
    id: "yoga",
    time: "11h30",
    title: "Yoga & mobilite",
    place: "Zen Ensemble - Espace vert",
    badge: "Tous niveaux",
    badgeColor: "bg-[#05ad56]",
    tags: ["morning"],
  },
  {
    id: "basket",
    time: "14h00",
    title: "Basket initiation",
    place: "Gym Quartier Libre - Salle couverte",
    badge: "Initiation",
    badgeColor: "bg-[#ff5c29]",
    tags: ["afternoon", "beginner"],
  },
  {
    id: "velo",
    time: "15h30",
    title: "Velo adapte",
    place: "Roues pour Tous - Allee principale",
    badge: "Handisport",
    badgeColor: "bg-[#7f00b1]",
    tags: ["afternoon", "handisport"],
  },
  {
    id: "natation",
    time: "16h00",
    title: "Natation libre",
    place: "Aqua Solidaire - Piscine",
    badge: "Famille",
    badgeColor: "bg-[#ff8da4]",
    tags: ["evening", "family"],
  },
];

const defaultSelectedIds = new Set(["badminton", "yoga"]);

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

function PlusIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 3v12M3 9h12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3.5 8.2 2.8 2.8 6.2-6.4" />
    </svg>
  );
}

export function ProgrammeClient() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(defaultSelectedIds));

  const links = user
    ? [...baseLinks, { href: "/organisateur", label: "Espace organisateur" }, { href: "/app/dashboard", label: "Dashboard" }]
    : baseLinks;

  const filteredActivities = useMemo(() => {
    if (activeFilter === "all") {
      return activities;
    }
    return activities.filter((activity) => activity.tags.includes(activeFilter));
  }, [activeFilter]);

  const selectedCount = selectedIds.size;
  const remaining = Math.max(0, 3 - selectedCount);

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  function toggleActivity(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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

      <section className="border-b border-[#e0e0e0] bg-[#f2f2f2] px-5 py-2 lg:px-8 xl:px-12">
        <h1 className="text-[20px] font-bold leading-[30px] lg:text-[34px] lg:leading-[38px]">Programme</h1>
        <p className="mt-1 text-[13px] leading-[19.5px] text-[#9e9e9e]">Choisis tes activites</p>
      </section>

      <section className="overflow-x-auto bg-[#f2f2f2] px-5 py-4 lg:px-8 xl:px-12">
        <ul className="flex w-max gap-2 lg:w-full lg:flex-wrap">
          {filters.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <li key={filter.id}>
                <button
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`h-9 whitespace-nowrap rounded-full border px-4 text-[13px] font-medium ${
                    active
                      ? "border-[#0558f6] bg-[#0558f6] text-white"
                      : "border-[#e0e0e0] bg-white text-[#9e9e9e]"
                  }`}
                >
                  {filter.label}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-[#ff5c29] px-5 py-3 text-center text-white lg:px-8 xl:px-12">
        <p className="text-[16px] font-medium leading-[19.5px]">{selectedCount} activites selectionnees.</p>
        <p className="text-[16px] font-medium leading-[19.5px]">
          {remaining > 0 ? `Encore ${remaining} pour obtenir ta recompense` : "Recompense debloquee, bravo !"}
        </p>
      </section>

      <section className="bg-[#f2f2f2] px-5 pb-5 pt-5 lg:px-8 xl:px-12">
        <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredActivities.map((activity) => {
            const selected = selectedIds.has(activity.id);
            return (
              <article
                key={activity.id}
                className={`flex min-h-[98px] items-center gap-3 rounded-[20px] p-[15px] ${
                  selected ? "border-2 border-[#0558f6] bg-[#f0f5ff]" : "border border-[#e0e0e0] bg-white"
                }`}
              >
                <p className={`w-12 shrink-0 text-[14px] font-bold leading-[21px] lg:text-[16px] ${selected ? "text-[#0558f6]" : "text-[#9e9e9e]"}`}>
                  {activity.time}
                </p>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold leading-[21px] text-[#111111] lg:text-[18px]">
                    {activity.title}
                  </p>
                  <p className="mt-1 truncate text-[12px] leading-[18px] text-[#9e9e9e]">{activity.place}</p>
                  <span className={`mt-2 inline-flex h-[20px] items-center rounded-full px-2 text-[11px] font-medium text-white ${activity.badgeColor}`}>
                    {activity.badge}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleActivity(activity.id)}
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    selected
                      ? "border border-[#0558f6] bg-[#0558f6] text-white"
                      : "border border-[#e0e0e0] bg-white text-[#b8b8b8]"
                  }`}
                  aria-label={selected ? `Retirer ${activity.title}` : `Ajouter ${activity.title}`}
                >
                  {selected ? <CheckIcon /> : <PlusIcon />}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#e0e0e0] bg-[#f2f2f2] px-5 pb-5 pt-3 lg:px-8 xl:px-12">
        <div className="mx-auto w-full lg:mx-0 lg:max-w-[480px]">
          <Link
            href="/programme/mon-programme"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#0558f6] text-[16px] font-medium leading-6 text-white"
          >
            {"Creer mon programme ->"}
          </Link>
          <p className="mt-2 text-center text-[11px] leading-[16.5px] text-[#9e9e9e]">
            {selectedCount} activites - modifiable a tout moment
          </p>
        </div>
      </section>

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
