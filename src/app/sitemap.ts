import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://solimouv.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/a-propos", "/programme", "/programme/mon-programme", "/associations", "/contact", "/login"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
