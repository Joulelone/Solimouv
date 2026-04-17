import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Workshop = {
  id: string;
  icon: string;
  title: string;
  schedule: string;
  badge: string;
  badgeClassName: string;
};

const workshops: Workshop[] = [
  {
    id: "badminton",
    icon: "BD",
    title: "Badminton decouverte",
    schedule: "10h00 - Club Elan Nord",
    badge: "Debutants bienvenus",
    badgeClassName: "bg-[#7F00B1] text-white",
  },
  {
    id: "yoga",
    icon: "YG",
    title: "Yoga & mobilite",
    schedule: "11h30 - Zen Ensemble",
    badge: "Tous niveaux",
    badgeClassName: "bg-[#FF8DA4] text-white",
  },
  {
    id: "boxe",
    icon: "BX",
    title: "Boxe initiation",
    schedule: "14h00 - Gym Quartier Libre",
    badge: "Initiation",
    badgeClassName: "bg-[#FF5C29] text-white",
  },
  {
    id: "velo",
    icon: "VL",
    title: "Velo adapte",
    schedule: "15h30 - Roues pour Tous",
    badge: "Handisport",
    badgeClassName: "bg-[#7F00B1] text-white",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Landing",
  description: "Landing page Solimouv' avec acces direct a la connexion et inscription.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FCF9F8] pb-[106px] text-[#111111] lg:pb-0">
      <header className="border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto flex h-[90px] w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:h-[98px] lg:px-8">
          <Link href="/landing" className="inline-flex items-center">
            <Image src="/figma-logo.svg" alt="Logo Solimouv" width={160} height={54} priority />
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold hover:bg-[#F2F2F2]"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-full bg-[#0558F6] px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
            >
              Inscription
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-14">
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-[560px]">
              <p className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#FF5C29]">
                Festival inclusif
              </p>
              <h1 className="mt-3 text-[40px] font-bold leading-[42px] text-[#FF5C29] sm:text-[52px] sm:leading-[54px]">
                LE SPORT POUR TOUS
              </h1>
              <p className="mt-5 text-[19px] leading-8 text-[#1C1B1B]">
                Le premier festival inclusif qui celebre le mouvement sous toutes ses formes.
                Decouvre des ateliers adaptes et trouve ta passion.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login?mode=register"
                  className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-[#FF5C29] px-6 text-[16px] font-bold text-white hover:brightness-95"
                >
                  Tu as envie de faire du sport
                  <ArrowIcon />
                </Link>
                <Link
                  href="/programme"
                  className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full border border-[#D1D5DB] px-6 text-[16px] font-semibold hover:bg-white"
                >
                  Voir le programme
                </Link>
              </div>
            </div>

            <article className="relative overflow-hidden rounded-[20px] bg-black shadow-[0_18px_44px_-24px_rgba(0,0,0,0.55)]">
              <Image
                src="/figma-rectangle.svg"
                alt="Atelier sportif inclusif"
                width={620}
                height={410}
                className="h-[280px] w-full object-cover sm:h-[340px] lg:h-[410px]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.55)_100%)]" />
              <p className="absolute bottom-5 left-5 right-5 text-[13px] leading-5 text-white/95 sm:text-[15px]">
                Festival sportif inclusif - 14 juin 2025 - Parc de la Citadelle, Lille
              </p>
            </article>
          </div>
        </section>

        <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
          <div className="mx-auto w-full max-w-[1200px]">
            <h2 className="text-[30px] font-bold leading-[34px] lg:text-[36px] lg:leading-[40px]">
              Les ateliers du festival
            </h2>
            <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <div className="flex w-max gap-3 lg:grid lg:w-full lg:grid-cols-4">
                {workshops.map((workshop) => (
                  <article
                    key={workshop.id}
                    className="h-[178px] w-[220px] rounded-[14px] border border-[#E0E0E0] bg-white p-4 lg:h-[190px] lg:w-auto"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-xs font-bold text-[#111111]">
                      {workshop.icon}
                    </span>
                    <h3 className="mt-4 text-[19px] font-bold leading-[22px] text-[#111111]">
                      {workshop.title}
                    </h3>
                    <p className="mt-2 text-[13px] text-[#9E9E9E]">{workshop.schedule}</p>
                    <span
                      className={`mt-4 inline-flex rounded-full px-3 py-[6px] text-[11px] font-semibold ${workshop.badgeClassName}`}
                    >
                      {workshop.badge}
                    </span>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8 hidden lg:flex">
              <Link
                href="/login?mode=register"
                className="inline-flex h-[58px] items-center justify-center gap-2 rounded-full bg-[#0558F6] px-8 text-[17px] font-bold text-white shadow-[0_16px_30px_-16px_rgba(5,88,246,0.45)] hover:brightness-95"
              >
                Rejoins-nous
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-[linear-gradient(180deg,rgba(252,249,248,0)_0%,#FCF9F8_35%,#FCF9F8_100%)] px-4 pb-6 pt-5 sm:px-6 lg:hidden">
        <Link
          href="/login?mode=register"
          className="mx-auto inline-flex h-[56px] w-full max-w-[1200px] items-center justify-center gap-2 rounded-full bg-[#0558F6] text-[17px] font-bold text-white shadow-[0_12px_24px_-10px_rgba(5,88,246,0.45)]"
        >
          Rejoins-nous
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}

