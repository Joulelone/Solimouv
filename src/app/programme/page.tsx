import type { Metadata } from "next";
import { ProgrammeClient } from "./programme-client";

export const metadata: Metadata = {
  title: "Programme",
  description:
    "Consultez le programme des ateliers et initiations sportives du festival Solimouv'.",
};

export default function ProgramPage() {
  return <ProgrammeClient />;
}
