import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">PWA</p>
          <h1 className="mt-3 text-3xl font-semibold">Mode hors ligne</h1>
          <p className="mt-3 text-slate-300">
            Tu es hors connexion. Reviens en ligne pour recuperer les dernieres
            donnees.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            Retour a l&apos;accueil
          </Link>
        </section>
      </main>
    </div>
  );
}
