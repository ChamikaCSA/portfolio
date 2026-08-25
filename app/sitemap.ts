import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

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
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
  }));

  const projectPages = featuredProjects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
  }));

  return [...pages, ...projectPages];
}
