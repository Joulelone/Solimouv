"use client";

import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";

export default function SettingsPage() {
  const { user, isConfigured } = useAuth();

  return (
    <AppShell title="Parametres">
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Compte</p>
          <p className="mt-2 text-sm text-slate-100">
            Email: <span className="font-medium">{user?.email ?? "N/A"}</span>
          </p>
          <p className="mt-1 text-sm text-slate-100">
            UID: <span className="font-mono text-xs">{user?.uid ?? "N/A"}</span>
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Etat</p>
          <p className="mt-2 text-sm text-slate-200">
            Firebase: {isConfigured ? "configure" : "non configure"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Cette section sert de base pour ajouter preferences et profil.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
