import type { Metadata } from "next";
import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title: "A propos",
  description:
    "Decouvrez Up Sport!, les valeurs du festival Solimouv' et les publics accompagnes.",
};

export default function AboutPage() {
  return <AboutClient />;
}
