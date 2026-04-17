import type { Metadata } from "next";
import { MonProgrammeClient } from "./programme-result-client";

export const metadata: Metadata = {
  title: "Mon programme",
  description:
    "Retrouvez votre programme personnalise de la journee avec les ateliers ajoutes pendant le festival Solimouv'.",
};

export default function MonProgrammePage() {
  return <MonProgrammeClient />;
}
