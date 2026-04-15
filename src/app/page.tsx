import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          MVP Hackathon
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Socle PWA pret pour la DA et les features metier
        </h1>
        <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
          Cette base te donne une landing, une zone app protegee, Firebase Auth +
          Firestore et l&apos;installation PWA. On pourra brancher la direction
          artistique ensuite sans toucher au coeur technique.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            href="/login"
          >
            Se connecter
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            href="/app"
          >
            Ouvrir l&apos;app
          </Link>
        </div>
      </section>
    </main>
  );
}
