import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Solimouv' - Festival du sport pour tous",
    short_name: "Solimouv'",
    description:
      "Application officielle du festival Solimouv' par Up Sport! : programme, associations et informations utiles.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f2",
    theme_color: "#0558f6",
    orientation: "any",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
