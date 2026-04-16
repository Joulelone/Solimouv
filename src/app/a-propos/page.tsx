import type { Metadata } from "next";
import { PublicSiteShell } from "@/components/public-site-shell";

export const metadata: Metadata = {
  title: "A propos | Solimouv'",
  description:
    "Decouvrez Up Sport!, les valeurs du festival Solimouv' et les publics accompagnes.",
};

const values = ["Mixite", "Solidarite", "Citoyennete", "Bienveillance"];
const audiences = [
  "Familles",
  "Jeunes",
  "Seniors",
  "Personnes refugiees",
  "Communaute LGBTQIA+",
  "Personnes eloignees du sport",
  "Personnes en situation de handicap",
];

export default function AboutPage() {
  return (
    <PublicSiteShell currentPath="/a-propos">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">A propos</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Up Sport! et Solimouv&apos;</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Up Sport! est une association sportive parisienne fondee en 2016. Elle agit
          pour rendre la pratique sportive accessible aux personnes en situation de
          vulnerabilite sociale. Solimouv&apos; est le festival qui prolonge cette mission
          avec un format ouvert au grand public.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-xl font-semibold">Mission</h2>
          <p className="mt-3 text-sm text-slate-300">
            Proposer une pratique sportive inclusive, accessible et intergenerationnelle,
            quel que soit le parcours de vie des participantes et participants.
          </p>
          <p className="mt-3 text-sm text-slate-300">
            L&apos;association accompagne en moyenne 250 personnes par semaine a travers une
            trentaine de seances hebdomadaires.
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-xl font-semibold">Valeurs</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-200">
            {values.map((value) => (
              <li key={value} className="rounded-lg border border-white/10 px-3 py-2">
                {value}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-5">
        <h2 className="text-xl font-semibold">Publics concernes</h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((audience) => (
            <li key={audience} className="rounded-lg border border-white/10 px-3 py-2 text-sm">
              {audience}
            </li>
          ))}
        </ul>
      </section>
    </PublicSiteShell>
  );
}
