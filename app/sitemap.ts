import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/projects",
    "/experience",
    "/stack",
    "/about",
    "/contact",
    "/terminal",
    "/settings",
  ].map((path) => ({
    url: `${site}${path || "/"}`,
    lastModified: now,
  }));

  const projectPages = featuredProjects.map((project) => ({
    url: `${site}/projects/${project.slug}`,
    lastModified: now,
  }));

  return [...pages, ...projectPages];
}
