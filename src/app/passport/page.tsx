"use client";

import { useMemo, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-provider";
import { FestivalShell } from "@/components/festival-shell";
import { usePassportScans } from "@/hooks/use-passport-scans";
import { FESTIVAL_STANDS } from "@/lib/festival-stands";

function formatPercent(value: number) {
  return Math.round(value * 100);
}

function buildQrImageUrl(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    value,
  )}`;
}

export default function PassportPage() {
  const { user, isConfigured } = useAuth();
  const { visitedStandIds, completion, loading, error } = usePassportScans(
    user?.uid,
  );
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const nextOrigin = window.location.origin;
    const frameId = window.requestAnimationFrame(() => {
      setOrigin(nextOrigin);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const checkInUrl = useMemo(() => {
    if (!origin || !user?.uid) {
      return "";
    }
    return `${origin}/check-in?user=${encodeURIComponent(user.uid)}`;
  }, [origin, user?.uid]);

  const qrImageUrl = useMemo(() => {
    if (!checkInUrl) {
      return "";
    }
    return buildQrImageUrl(checkInUrl);
  }, [checkInUrl]);

  const completeAllStands = completion.completed === completion.total;

  return (
    <AuthGuard>
      <FestivalShell title="Passeport festival" maxWidth="max-w-6xl">
        {!isConfigured ? (
          <p className="rounded-xl border border-amber-200/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Firebase non configure. Ajoute les variables env pour activer le passeport.
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-rose-200/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <h2 className="text-lg font-semibold">Mon QR personnel</h2>
            <p className="mt-2 text-sm text-slate-300">
              Montre ce QR a l&apos;animateur sur chaque stand pour valider ta
              participation.
            </p>

            <div className="mt-4 flex items-center justify-center rounded-xl border border-white/10 bg-white p-4">
              {qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImageUrl}
                  alt="QR code personnel du passeport Solimouv"
                  className="h-56 w-56"
                />
              ) : (
                <p className="text-sm text-slate-500">Generation du QR...</p>
              )}
            </div>

            <p className="mt-3 break-all rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 font-mono text-[11px] text-slate-300">
              {checkInUrl || "Chargement de l'URL de check-in..."}
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <h2 className="text-lg font-semibold">Progression gamifiee</h2>
            <p className="mt-2 text-sm text-slate-300">
              Objectif: completer les {completion.total} stands pour debloquer le lot
              final.
            </p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {completion.completed}/{completion.total} stands valides
                </span>
                <span>{formatPercent(completion.ratio)}%</span>
              </div>
              <div
                className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-800"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={completion.total}
                aria-valuenow={completion.completed}
              >
                <div
                  className="h-full rounded-full bg-cyan-300 transition-all"
                  style={{ width: `${formatPercent(completion.ratio)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-slate-900/60 p-3">
              {loading ? (
                <p className="text-sm text-slate-300">Chargement de ta progression...</p>
              ) : completeAllStands ? (
                <p className="text-sm font-medium text-emerald-300">
                  Bravo! Tous les stands sont valides. Tu peux reclamer ton lot.
                </p>
              ) : (
                <p className="text-sm text-slate-300">
                  Continue: il te reste {completion.total - completion.completed}{" "}
                  stand(s) a valider.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <h2 className="text-lg font-semibold">Stands du festival</h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FESTIVAL_STANDS.map((stand) => {
              const done = visitedStandIds.has(stand.id);
              return (
                <li
                  key={stand.id}
                  className={`rounded-lg border px-3 py-3 ${
                    done
                      ? "border-emerald-300/40 bg-emerald-300/10"
                      : "border-white/10 bg-slate-900/60"
                  }`}
                >
                  <p className="text-sm font-medium">{stand.name}</p>
                  <p className="mt-1 text-xs text-slate-300">
                    {stand.activity} - {stand.location}
                  </p>
                  <p className="mt-2 text-xs font-semibold">
                    {done ? "Valide" : "A faire"}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </FestivalShell>
    </AuthGuard>
  );
}
