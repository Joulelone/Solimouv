"use client";

import { Suspense } from "react";
import { CheckInClient } from "@/app/app/check-in/check-in-client";
import { AuthGuard } from "@/components/auth-guard";

export default function CheckInPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0F0F0F] p-6 text-sm text-[rgba(255,255,255,0.7)]">
            Chargement du mode check-in stand...
          </div>
        }
      >
        <CheckInClient />
      </Suspense>
    </AuthGuard>
  );
}
