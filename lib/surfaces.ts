import { featuredProjects } from "@/content/projects";

export const DOCK_SURFACES = [
  { id: "home", label: "Home", shortcut: "H" },
  { id: "work", label: "Work", shortcut: "W" },
  { id: "log", label: "Log", shortcut: "L" },
  { id: "stack", label: "Stack", shortcut: "S" },
  { id: "compose", label: "Compose", shortcut: "C" },
] as const;

export type DockSurfaceId = (typeof DOCK_SURFACES)[number]["id"];

/** Shared content column so surfaces and chrome align. */
export const SURFACE_WIDTH = "mx-auto w-full max-w-6xl px-5 sm:px-10";
export const SURFACE_PAGE =
  "mx-auto w-full min-h-[calc(100svh-6.5rem)] max-w-6xl px-5 pb-10 pt-16 sm:px-10";

export const PALETTE_SURFACES = [
  ...DOCK_SURFACES.map((item) => ({
    id: item.id,
    label: item.label,
    hint: "surface",
  })),
  { id: "about", label: "About", hint: "surface" },
  ...featuredProjects.map((project) => ({
    id: project.slug,
    label: project.title,
    hint: "module",
  })),
] as const;

export function isProjectSurface(id: string) {
  return featuredProjects.some((project) => project.slug === id);
}

export function isWorkSurface(id: string) {
  return id === "work" || isProjectSurface(id);
}

export function surfaceFromPathname(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname === "/work") return "work";
  const moduleMatch = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (moduleMatch) return moduleMatch[1];
  if (pathname === "/log") return "log";
  if (pathname === "/stack") return "stack";
  if (pathname === "/compose") return "compose";
  if (pathname === "/about") return "about";
  return "missing";
}

export function hrefForSurface(id: string) {
  if (id === "home") return "/";
  if (
    id === "work" ||
    id === "log" ||
    id === "stack" ||
    id === "compose" ||
    id === "about"
  ) {
    return `/${id}`;
  }
  if (isProjectSurface(id)) return `/work/${id}`;
  return "/";
}
