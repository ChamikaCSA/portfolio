import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";

export const DOCK_SURFACES = [
  { id: "work", label: "Work", shortcut: "W" },
  { id: "log", label: "Log", shortcut: "L" },
  { id: "stack", label: "Stack", shortcut: "S" },
  { id: "compose", label: "Compose", shortcut: "C" },
] as const;

export const SYSTEM_SURFACES = [
  { id: "terminal", label: "Terminal", shortcut: "T" },
  { id: "settings", label: "Settings", shortcut: "," },
] as const;

export const APP_SURFACES = [...DOCK_SURFACES, ...SYSTEM_SURFACES] as const;

export type DockSurfaceId = (typeof DOCK_SURFACES)[number]["id"];

/** Shared content column so surfaces and chrome align. */
export const SURFACE_WIDTH = "mx-auto w-full max-w-6xl px-5 sm:px-10";
export const SURFACE_PAGE =
  "mx-auto w-full min-h-full max-w-6xl px-5 pb-12 pt-8 sm:px-10";
export const APP_SCROLL_ID = "os-app-scroll";

export const PALETTE_SURFACES = [
  { id: "home", label: "Home", hint: "surface" },
  ...DOCK_SURFACES.map((item) => ({
    id: item.id,
    label: item.label,
    hint: "surface",
  })),
  { id: "about", label: "About", hint: "surface" },
  ...SYSTEM_SURFACES.map((item) => ({
    id: item.id,
    label: item.label,
    hint: "surface",
  })),
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

export function appWindowKey(id: string) {
  if (isWorkSurface(id)) return "work";
  return id;
}

export function labelForSurface(id: string) {
  if (id === "home") return "Home";
  if (id === "about") return "About";
  if (id === "missing") return "Not found";
  const app = APP_SURFACES.find((item) => item.id === id);
  if (app) return app.label;
  const project = featuredProjects.find((item) => item.slug === id);
  return project?.title ?? "Module";
}

export function shortcutForSurface(id: string) {
  if (id === "home") return "H";
  if (id === "about") return "A";
  return APP_SURFACES.find((item) => item.id === id)?.shortcut;
}

export function menuAppName(id: string) {
  if (id === "home") return null;
  if (isWorkSurface(id)) return "Work";
  if (id === "missing") return "Not found";
  return labelForSurface(id);
}

/** Path-style chrome copy for the app window title bar. */
export function osLabelForSurface(id: string): {
  text: string;
  tone: "muted" | "accent" | "flare";
} {
  if (id === "work") return { text: "work / modules", tone: "muted" };
  if (id === "log") return { text: "journalctl / experience", tone: "flare" };
  if (id === "stack") return { text: "packages / installed", tone: "muted" };
  if (id === "compose")
    return { text: "compose / new message", tone: "flare" };
  if (id === "terminal")
    return {
      text: `tty / ${profile.userName}@${profile.osName}`,
      tone: "muted",
    };
  if (id === "settings") return { text: "prefs / system", tone: "muted" };
  if (id === "about") return { text: "about / system notes", tone: "muted" };
  if (id === "missing") return { text: "kernel / 404", tone: "muted" };
  const project = featuredProjects.find((item) => item.slug === id);
  if (project) {
    return {
      text: `module / ${project.index}${project.flagship ? " · flagship" : ""}`,
      tone: project.flagship ? "flare" : "accent",
    };
  }
  return { text: labelForSurface(id), tone: "muted" };
}

export function surfaceFromPathname(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname === "/work") return "work";
  const moduleMatch = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (moduleMatch) return moduleMatch[1];
  if (pathname === "/log") return "log";
  if (pathname === "/stack") return "stack";
  if (pathname === "/compose") return "compose";
  if (pathname === "/terminal") return "terminal";
  if (pathname === "/settings") return "settings";
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
    id === "about" ||
    id === "terminal" ||
    id === "settings"
  ) {
    return `/${id}`;
  }
  if (isProjectSurface(id)) return `/work/${id}`;
  return "/";
}
