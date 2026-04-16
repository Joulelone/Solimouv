"use client";

import { Suspense } from "react";
import { CheckInClient } from "@/app/app/check-in/check-in-client";
import { AuthGuard } from "@/components/auth-guard";
import { FestivalShell } from "@/components/festival-shell";

export default function CheckInPage() {
  return (
    <AuthGuard>
      <FestivalShell title="Check-in stand" maxWidth="max-w-3xl">
        <Suspense
          fallback={
            <p className="text-sm text-slate-300">
              Chargement du mode check-in stand...
            </p>
          }
        >
          <CheckInClient />
        </Suspense>
      </FestivalShell>
    </AuthGuard>
  );
}
