import type { Metadata } from "next";
import { PublicSiteShell } from "@/components/public-site-shell";

export const metadata: Metadata = {
  title: "Programme | Solimouv'",
  description:
    "Consultez le programme des ateliers et initiations sportives du festival Solimouv'.",
};

const schedule = [
  { time: "10:00", title: "Accueil des publics", details: "Orientation et presentation des espaces." },
  { time: "10:30", title: "Initiations sportives", details: "Decouverte multi-activites avec les associations." },
  { time: "13:00", title: "Pause conviviale", details: "Espace restauration et animations libres." },
  { time: "14:00", title: "Ateliers de sensibilisation", details: "Sport inclusif, sante et prevention." },
  { time: "16:00", title: "Premiers secours", details: "Atelier pratique ouvert a tous niveaux." },
  { time: "17:30", title: "Cloture collective", details: "Bilan de la journee et prises de contact." },
];

const workshops = [
  {
    name: "Ateliers sport inclusif",
    text: "Formats adaptes pour niveaux debutants et confirms, avec accompagnement pedagogique.",
  },
  {
    name: "Sensibilisation & prevention",
    text: "Sessions autour de l'inclusion, du vivre-ensemble et des bons reflexes sante.",
  },
  {
    name: "Orientation associative",
    text: "Rencontres avec les structures partenaires pour poursuivre la pratique apres le festival.",
  },
];

export default function ProgramPage() {
  return (
    <PublicSiteShell currentPath="/programme">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Programme / Ateliers</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Une journee active et inclusive</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Le festival alterne initiations sportives, ateliers de sensibilisation et temps de
          rencontre. Le programme est pense pour rester accessible a tous les profils de publics.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-5">
        <h2 className="text-xl font-semibold">Planning indicatif</h2>
        <ol className="mt-4 space-y-3">
          {schedule.map((slot) => (
            <li key={slot.time} className="rounded-lg border border-white/10 p-3">
              <p className="text-xs uppercase tracking-wide text-cyan-300">{slot.time}</p>
              <h3 className="mt-1 font-medium">{slot.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{slot.details}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {workshops.map((workshop) => (
          <article key={workshop.name} className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <h2 className="text-lg font-semibold">{workshop.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{workshop.text}</p>
          </article>
        ))}
      </section>
    </PublicSiteShell>
  );
}
