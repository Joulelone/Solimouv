"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { useUserItems } from "@/hooks/use-user-items";

export default function DashboardPage() {
  const { user, isConfigured } = useAuth();
  const { items, loading, error } = useUserItems(user?.uid);

  const total = items.length;
  const done = items.filter((item) => item.done).length;
  const todo = total - done;

  return (
    <AppShell title="Dashboard">
      {!isConfigured ? (
        <p className="rounded-xl border border-amber-200/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Firebase non configure. Ajoute les variables env pour activer la data.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-200/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total items" value={total} />
        <StatCard label="A faire" value={todo} />
        <StatCard label="Termines" value={done} />
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Derniers items
          </h2>
          <Link
            href="/app/items"
            className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            Gerer
          </Link>
        </div>

        {loading ? (
          <p className="mt-3 text-sm text-slate-400">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Aucun item pour le moment.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {items.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm"
              >
                <span
                  className={
                    item.done ? "text-slate-400 line-through" : "text-slate-100"
                  }
                >
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Mode evenement
        </h2>
        <p className="mt-3 text-sm text-slate-300">
          Active le passeport QR des participants et le check-in des stands pendant
          le festival.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/passport"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Ouvrir mon passeport
          </Link>
          <Link
            href="/organisateur"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            Ouvrir espace organisateur
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
