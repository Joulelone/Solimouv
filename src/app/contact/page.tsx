import type { Metadata } from "next";
import Link from "next/link";
import { PublicSiteShell } from "@/components/public-site-shell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'equipe Solimouv' et Up Sport! pour participer, proposer un partenariat ou poser une question.",
};

const socialLinks = [
  {
    label: "Site Up Sport!",
    href: "https://www.unispourlesport.paris/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/UpSport.UNis/?locale=fr_FR",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/unispourlesport/",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@upsportparis?_t=8poxlxiu0sk&_r=1",
  },
];

export default function ContactPage() {
  return (
    <PublicSiteShell>
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Contact</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Parlons de votre participation</h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Vous souhaitez participer au festival, proposer un atelier ou devenir partenaire ?
          Utilisez les canaux ci-dessous pour entrer en contact avec l&apos;equipe.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-xl font-semibold">Canaux de contact</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-cyan-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-300">
            Pour le suivi interne organisateurs, utilisez aussi l&apos;
            <Link href="/login" className="underline underline-offset-4">
              espace de connexion
            </Link>
            .
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-xl font-semibold">Demande rapide</h2>
          <form className="mt-3 space-y-3" aria-label="Formulaire de contact">
            <div>
              <label htmlFor="name" className="text-sm">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
                placeholder="vous@exemple.fr"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 w-full resize-y rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
                placeholder="Votre demande"
              />
            </div>
            <p className="text-xs text-slate-400">
              Ce formulaire est un point de collecte visuel du socle minimal. Le branchement
              backend peut etre ajoute ensuite selon votre choix technique.
            </p>
          </form>
        </article>
      </section>
    </PublicSiteShell>
  );
}
