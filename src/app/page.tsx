import Link from "next/link";
import { PublicSiteShell } from "@/components/public-site-shell";

export default function LandingPage() {
  return (
    <PublicSiteShell currentPath="/">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Festival Solimouv&apos;
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          Le sport pour toutes et tous, sans barrieres
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Solimouv&apos; est le festival du sport inclusif porte par Up Sport! et
          un collectif d&apos;associations parisiennes. Cette PWA presente la mission,
          le programme, les partenaires et les infos pratiques pour participer.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/programme"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Voir le programme
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Participants edition 1" value="+500" />
        <StatCard label="Associations partenaires" value="13" />
        <StatCard label="Benevoles mobilises" value="40+" />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        <QuickLink
          href="/a-propos"
          title="A propos"
          text="Comprendre la mission d'Up Sport! et la vision du festival Solimouv'."
        />
        <QuickLink
          href="/programme"
          title="Programme / Ateliers"
          text="Decouvrir les initiations sportives, ateliers de sensibilisation et temps forts."
        />
        <QuickLink
          href="/associations"
          title="Associations partenaires"
          text="Explorer les structures presentes et les activites inclusives proposees."
        />
        <QuickLink
          href="/contact"
          title="Contact"
          text="Poser une question, proposer un partenariat ou demander des informations."
        />
      </section>
    </PublicSiteShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </article>
  );
}

function QuickLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-slate-950/40 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-slate-900/70"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-300">{text}</p>
    </Link>
  );
}
