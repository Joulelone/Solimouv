import { Suspense } from "react";
import type { Metadata } from "next";
import { MonProgrammeClient } from "./programme-result-client";

export const metadata: Metadata = {
  title: "Mon programme",
  description:
    "Retrouvez votre programme personnalise de la journee avec les ateliers ajoutes pendant le festival Solimouv'.",
};

export default function MonProgrammePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f2f2f2] p-6 text-sm text-[#6F7281]">
          Chargement du programme...
        </div>
      }
    >
      <MonProgrammeClient />
    </Suspense>
  );
}
