import type { Metadata } from "next";
import ContactMapClient from "./contact-map-client";

export const metadata: Metadata = {
  title: "Carte | Solimouv",
  description:
    "Carte interactive Solimouv pour localiser les stands et ateliers a proximite pendant le festival.",
};

export default function ContactPage() {
  return <ContactMapClient />;
}
