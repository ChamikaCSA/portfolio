import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/work", "/log", "/stack", "/about", "/compose"].map(
    (path) => ({
      url: `${site}${path || "/"}`,
      lastModified: now,
    }),
  );

  const modules = featuredProjects.map((project) => ({
    url: `${site}/work/${project.slug}`,
    lastModified: now,
  }));

  return [...pages, ...modules];
}
