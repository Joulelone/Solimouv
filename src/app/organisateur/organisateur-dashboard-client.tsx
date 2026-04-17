"use client";

import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-provider";
import { MobileBurgerMenu } from "@/components/mobile-burger-menu";
import { auth } from "@/lib/firebase";

type StatCard = {
  id: string;
  value: string;
  label: string;
  caption: string;
  iconColorClass: string;
  iconStroke: string;
};

type ActivityFill = {
  id: string;
  label: string;
  current: number;
  max: number;
  percent: number;
  barClass: string;
  textClass: string;
  icon: string;
};

type ScanEvent = {
  id: string;
  name: string;
  activity: string;
  ago: string;
  code: string;
  status: "ok" | "error";
};

const statCards: StatCard[] = [
  {
    id: "inscrits",
    value: "847",
    label: "Inscrits",
    caption: "+124 depuis 12h",
    iconColorClass: "bg-[rgba(5,88,246,0.18)]",
    iconStroke: "#0558F6",
  },
  {
    id: "scans",
    value: "447",
    label: "Scans effectues",
    caption: "70% de presence",
    iconColorClass: "bg-[rgba(5,173,86,0.18)]",
    iconStroke: "#05AD56",
  },
  {
    id: "activities",
    value: "5 / 5",
    label: "Activites actives",
    caption: "Toutes en cours",
    iconColorClass: "bg-[rgba(255,223,60,0.15)]",
    iconStroke: "#FFDF3C",
  },
  {
    id: "presence",
    value: "70%",
    label: "Taux de presence",
    caption: "Objectif : 70%",
    iconColorClass: "bg-[rgba(255,92,41,0.18)]",
    iconStroke: "#FF5C29",
  },
];

const activityFill: ActivityFill[] = [
  { id: "badminton", label: "Badminton", current: 68, max: 80, percent: 85, barClass: "bg-[#FFE63B]", textClass: "text-[#FFE63B]", icon: "BDM" },
  { id: "yoga", label: "Yoga", current: 54, max: 60, percent: 90, barClass: "bg-[#05AD56]", textClass: "text-[#05AD56]", icon: "YOG" },
  { id: "boxe", label: "Boxe", current: 72, max: 80, percent: 90, barClass: "bg-[#FF5C29]", textClass: "text-[#FF5C29]", icon: "BOX" },
  { id: "velo", label: "Velo", current: 38, max: 50, percent: 76, barClass: "bg-[#7F00B1]", textClass: "text-[#7F00B1]", icon: "VEL" },
  { id: "natation", label: "Natation", current: 80, max: 100, percent: 80, barClass: "bg-[#0558F6]", textClass: "text-[#0558F6]", icon: "NAT" },
];

const scans: ScanEvent[] = [
  { id: "lea-aubry", name: "Lea Aubry", activity: "Yoga & mobilite", ago: "il y a 1 min", code: "LA-2011", status: "ok" },
  { id: "theo-hamdi", name: "Theo Hamdi", activity: "Badminton decouverte", ago: "il y a 3 min", code: "TH-0847", status: "ok" },
  { id: "fatou-aw", name: "Fatou Aw", activity: "Boxe initiation", ago: "il y a 5 min", code: "FA-1193", status: "ok" },
  { id: "unknown-pass", name: "Pass inconnu", activity: "Pass non reconnu", ago: "il y a 8 min", code: "MA-3302", status: "error" },
  { id: "amara-mbaye", name: "Amara Mbaye", activity: "Natation libre", ago: "il y a 11 min", code: "AM-0561", status: "ok" },
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

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
      <path d="M7 10h8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.6V8l2.6 1.6" />
    </svg>
  );
}

function GridDotsIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="4" cy="4" r="1.1" />
      <circle cx="9" cy="4" r="1.1" />
      <circle cx="14" cy="4" r="1.1" />
      <circle cx="4" cy="9" r="1.1" />
      <circle cx="9" cy="9" r="1.1" />
      <circle cx="14" cy="9" r="1.1" />
      <circle cx="4" cy="14" r="1.1" />
      <circle cx="9" cy="14" r="1.1" />
      <circle cx="14" cy="14" r="1.1" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7V4h3M16 7V4h-3M4 13v3h3M16 13v3h-3" />
      <path d="M6 10h8" />
    </svg>
  );
}

function StatGlyph({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke={stroke} strokeWidth="1.8">
      <path d="M3 14h12M5.5 11V8.5M9 11V5.2M12.5 11V7" />
      <circle cx="5.5" cy="6.2" r="1.1" />
      <circle cx="9" cy="3.1" r="1.1" />
      <circle cx="12.5" cy="5.2" r="1.1" />
    </svg>
  );
}

function EventStatusDot({ status }: { status: "ok" | "error" }) {
  const colorClass = status === "ok" ? "bg-[#05AD56]" : "bg-[#FF5C29]";
  return <span className={`h-[7px] w-[7px] rounded-full ${colorClass}`} />;
}

export function OrganisateurDashboardClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0F0F0F] pb-[94px] text-white lg:pb-8">
        <header className="border-b border-[rgba(255,255,255,0.06)] bg-[#1A1A1A]">
          <div className="mx-auto w-full max-w-[1240px] px-4 lg:px-8">
            <div className="flex h-[84px] items-center justify-between">
              <div className="w-8 lg:hidden" />
              <Link href="/" className="inline-flex">
                <Image src="/figma-logo.svg" alt="Logo Solimouv" width={150} height={50} priority />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((state) => !state)}
                className="inline-flex h-8 w-8 items-center justify-center text-white"
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={menuOpen}
              >
                <MobileMenuIcon />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] py-3">
              <Link href="/" className="inline-flex items-center gap-3 text-white hover:opacity-90">
                <BackArrowIcon />
                <span>
                  <span className="block text-[16px] font-bold leading-[19.2px]">Dashboard</span>
                  <span className="block text-[11px] leading-[16.5px] text-[rgba(255,255,255,0.45)]">Vue Organisateur</span>
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-[5px] rounded-full border border-[rgba(5,173,86,0.3)] bg-[rgba(5,173,86,0.18)] px-3 py-1 text-[11px] font-semibold text-[#05AD56]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#05AD56]" />
                  LIVE
                </span>
                <button
                  type="button"
                  aria-label="Actions rapides"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(5,88,246,0.3)] bg-[rgba(5,88,246,0.18)] text-[#0558F6]"
                >
                  <GridDotsIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#0558F6] to-[#0A3FCC]">
            <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-3 lg:px-8">
              <div>
                <p className="text-[14px] font-bold leading-[21px]">Solimouv&apos; - 14 juin 2025</p>
                <p className="text-[12px] leading-[18px] text-[rgba(255,255,255,0.7)]">Parc de la Citadelle, Lille</p>
              </div>
              <p className="inline-flex items-center gap-1 text-[13px] text-[rgba(255,255,255,0.85)]">
                <ClockIcon />
                16h42
              </p>
            </div>
          </div>
        </header>

        <MobileBurgerMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          organizerHref="/organisateur"
          isAuthenticated={Boolean(user)}
          onSignOut={user ? handleSignOut : undefined}
        />

        <main className="mx-auto w-full max-w-[1240px] space-y-4 px-4 pt-4 lg:px-8">
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statCards.map((card) => (
              <article
                key={card.id}
                className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] p-4"
              >
                <span className={`inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] ${card.iconColorClass}`}>
                  <StatGlyph stroke={card.iconStroke} />
                </span>
                <p className="mt-3 text-[36px] font-bold leading-[30px] text-white">{card.value}</p>
                <p className="mt-2 text-[12px] font-medium leading-[18px] text-white">{card.label}</p>
                <p className="mt-1 text-[11px] leading-[16.5px] text-[rgba(255,255,255,0.45)]">{card.caption}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[15px] font-bold leading-[22.5px]">Inscriptions</h2>
                  <p className="text-[11px] leading-[16.5px] text-[rgba(255,255,255,0.45)]">Cumulatif sur la journee</p>
                </div>
                <span className="rounded-[8px] border border-[rgba(5,88,246,0.25)] bg-[rgba(5,88,246,0.18)] px-3 py-1 text-[12px] font-semibold text-[#0558F6]">
                  847 total
                </span>
              </div>

              <div className="mt-4 rounded-[12px] bg-[#151515] p-3">
                <svg viewBox="0 0 320 120" className="h-[140px] w-full">
                  <line x1="24" y1="95" x2="310" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="24" y1="72" x2="310" y2="72" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="24" y1="49" x2="310" y2="49" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="24" y1="26" x2="310" y2="26" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <path
                    d="M24 94 C47 92, 59 86, 75 82 C97 75, 111 68, 127 61 C144 56, 162 52, 178 51 C193 50, 207 39, 230 35 C253 30, 277 24, 310 20"
                    fill="none"
                    stroke="#0558F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0558F6" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#0558F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M24 94 C47 92, 59 86, 75 82 C97 75, 111 68, 127 61 C144 56, 162 52, 178 51 C193 50, 207 39, 230 35 C253 30, 277 24, 310 20 L310 96 L24 96 Z"
                    fill="url(#lineFade)"
                  />
                </svg>
                <div className="-mt-2 flex justify-between px-1 text-[10px] text-[rgba(255,255,255,0.35)]">
                  <span>8h</span><span>9h</span><span>10h</span><span>11h</span><span>12h</span><span>13h</span><span>14h</span><span>15h</span><span>16h</span><span>17h</span><span>18h</span>
                </div>
              </div>
            </article>

            <article className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] p-4">
              <h2 className="text-[15px] font-bold leading-[22.5px]">Remplissage par activite</h2>
              <p className="text-[11px] leading-[16.5px] text-[rgba(255,255,255,0.45)]">Scans - capacite max</p>
              <ul className="mt-3 space-y-3">
                {activityFill.map((item) => (
                  <li key={item.id}>
                    <div className="flex items-center justify-between text-[12px]">
                      <p className="text-white">
                        <span className="mr-2 inline-block min-w-[30px] rounded-[6px] bg-[rgba(255,255,255,0.08)] px-1.5 py-0.5 text-center text-[9px] font-semibold tracking-[0.04em] text-[rgba(255,255,255,0.7)]">{item.icon}</span>
                        {item.label}
                      </p>
                      <p className="text-[rgba(255,255,255,0.45)]">
                        {item.current}/{item.max}
                        <span className={`ml-2 font-semibold ${item.textClass}`}>{item.percent}%</span>
                      </p>
                    </div>
                    <div className="mt-1 h-[4px] rounded-full bg-[rgba(255,255,255,0.12)]">
                      <div className={`h-[4px] rounded-full ${item.barClass}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold leading-[22.5px]">Scans recents</h2>
                <p className="text-[11px] leading-[16.5px] text-[rgba(255,255,255,0.45)]">Derniers passages enregistres</p>
              </div>
              <Link href="/app/check-in" className="text-[12px] font-medium text-[#0558F6] hover:opacity-85">
                Scanner
              </Link>
            </div>

            <ul className="mt-3 space-y-2">
              {scans.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-[10px] p-[10px] ${item.status === "ok" ? "bg-[rgba(255,255,255,0.03)]" : "bg-[rgba(255,92,41,0.04)]"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-2xl ${
                        item.status === "ok" ? "bg-[rgba(5,173,86,0.18)]" : "bg-[rgba(255,92,41,0.18)]"
                      }`}
                    >
                      <EventStatusDot status={item.status} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-white">{item.name}</p>
                      <p className="truncate text-[11px] text-[rgba(255,255,255,0.45)]">{item.activity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[rgba(255,255,255,0.2)]">{item.ago}</p>
                      <p className="text-[10px] text-[rgba(255,255,255,0.45)]">{item.code}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="hidden lg:flex lg:justify-end">
            <Link
              href="/app/check-in"
              className="inline-flex h-[52px] min-w-[320px] items-center justify-center gap-2 rounded-full bg-[#0558F6] px-8 text-[16px] font-semibold text-white"
            >
              <ScanIcon />
              Scanner un Pass&apos;Sport
            </Link>
          </div>
        </main>

        <div className="fixed inset-x-0 bottom-3 px-4 lg:hidden">
          <div className="mx-auto max-w-[1240px]">
            <Link
              href="/app/check-in"
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#0558F6] text-[16px] font-semibold text-white shadow-[0px_10px_24px_rgba(5,88,246,0.35)]"
            >
              <ScanIcon />
              Scanner un Pass&apos;Sport
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

