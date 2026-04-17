import type { Metadata } from "next";
import { OrganisateurDashboardClient } from "./organisateur-dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard organisateur",
  description:
    "Tableau de bord organisateur pour suivre les inscriptions, scans et capacites en temps reel.",
};

export default function OrganisateurPage() {
  return <OrganisateurDashboardClient />;
}
