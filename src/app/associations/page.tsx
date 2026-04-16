import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteShell } from "@/components/public-site-shell";

export const metadata: Metadata = {
  title: "Associations partenaires | Solimouv'",
  description:
    "Retrouvez les associations partenaires mobilisees autour du sport inclusif a Solimouv'.",
};

const partnerTypes = [
  {
    title: "Clubs de quartier",
    description:
      "Structures locales qui proposent des initiations ouvertes aux debutants et aux familles.",
  },
  {
    title: "Associations d'inclusion",
    description:
      "Acteurs engages aupres des publics refugies, eloignes du sport ou en situation de handicap.",
  },
  {
    title: "Collectifs jeunesse",
    description:
      "Organisations qui accompagnent les jeunes via le sport, la citoyennete et la prevention.",
  },
  {
    title: "Acteurs sante & prevention",
    description:
      "Partenaires qui interviennent sur les ateliers bien-etre, premiers secours et education sante.",
  },
];

export default function PartnersPage() {
  return (
    <PublicSiteShell currentPath="/associations">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Associations partenaires
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Un collectif engage</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Solimouv&apos; repose sur une dynamique collective. Lors de la premiere edition,
          13 associations ont contribue aux activites, a l&apos;accueil des publics et a la
          mediation sur le terrain.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {partnerTypes.map((partner) => (
          <article key={partner.title} className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <h2 className="text-lg font-semibold">{partner.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{partner.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-5">
        <h2 className="text-xl font-semibold">Vous souhaitez rejoindre le collectif ?</h2>
        <p className="mt-2 text-sm text-slate-300">
          Les associations sportives, sociales et de prevention peuvent proposer un atelier
          ou un stand pour les prochaines editions.
        </p>
        <p className="mt-3 text-sm text-slate-200">
          Contact partenariat:{" "}
          <Link className="underline underline-offset-4" href="/contact">
            page contact
          </Link>
        </p>
      </section>
    </PublicSiteShell>
  );
}
