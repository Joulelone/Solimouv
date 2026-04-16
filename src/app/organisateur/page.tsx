"use client";

import { Suspense } from "react";
import { CheckInClient } from "@/app/app/check-in/check-in-client";
import { AuthGuard } from "@/components/auth-guard";
import { FestivalShell } from "@/components/festival-shell";

export default function OrganisateurPage() {
  return (
    <AuthGuard>
      <FestivalShell title="Espace organisateur" maxWidth="max-w-3xl">
        <Suspense
          fallback={
            <p className="text-sm text-slate-300">
              Chargement de l&apos;espace organisateur...
            </p>
          }
        >
          <CheckInClient />
        </Suspense>
      </FestivalShell>
    </AuthGuard>
  );
}
