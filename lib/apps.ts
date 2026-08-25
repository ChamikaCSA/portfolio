import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";

export const DOCK_APPS = [
  { id: "projects", label: "Projects", shortcut: "P" },
  { id: "experience", label: "Experience", shortcut: "E" },
  { id: "stack", label: "Stack", shortcut: "S" },
  { id: "contact", label: "Contact", shortcut: "C" },
] as const;

export const SYSTEM_APPS = [
  { id: "terminal", label: "Terminal", shortcut: "T" },
  { id: "settings", label: "Settings", shortcut: "," },
] as const;

export const APPS = [...DOCK_APPS, ...SYSTEM_APPS] as const;

export type DockAppId = (typeof DOCK_APPS)[number]["id"];

/** Shared content column so apps and chrome align. */
export const APP_WIDTH = "mx-auto w-full max-w-6xl px-5 sm:px-10";
export const APP_PAGE =
  "mx-auto w-full min-h-full max-w-6xl px-5 pb-12 pt-8 sm:px-10";
export const APP_SCROLL_ID = "os-app-scroll";

export const PALETTE_APPS = [
  { id: "home", label: "Home", hint: "app" },
  ...DOCK_APPS.map((item) => ({
    id: item.id,
    label: item.label,
    hint: "app",
  })),
  { id: "about", label: "About", hint: "app" },
  ...SYSTEM_APPS.map((item) => ({
    id: item.id,
    label: item.label,
    hint: "app",
  })),
  ...featuredProjects.map((project) => ({
    id: project.slug,
    label: project.title,
    hint: "project",
  })),
] as const;

export function isProject(id: string) {
  return featuredProjects.some((project) => project.slug === id);
}

export function isProjectsApp(id: string) {
  return id === "projects" || isProject(id);
}

export function appWindowKey(id: string) {
  if (isProjectsApp(id)) return "projects";
  return id;
}

export function labelForApp(id: string) {
  if (id === "home") return "Home";
  if (id === "about") return "About";
  if (id === "missing") return "Not found";
  const app = APPS.find((item) => item.id === id);
  if (app) return app.label;
  const project = featuredProjects.find((item) => item.slug === id);
  return project?.title ?? "Projects";
}

export function shortcutForApp(id: string) {
  if (id === "home") return "H";
  if (id === "about") return "A";
  return APPS.find((item) => item.id === id)?.shortcut;
}

export function menuAppName(id: string) {
  if (id === "home") return null;
  if (isProjectsApp(id)) return labelForApp("projects");
  if (id === "missing") return "Not found";
  return labelForApp(id);
}

/**
 * One chrome record per app.
 * Dock / menu / heading = portfolio language.
 * Title bar `{app} / {alias}` = OS nickname.
 */
const APP_CHROME: Record<
  string,
  { alias: string; heading: string; tone: "muted" | "accent" | "flare" }
> = {
  projects: { alias: "modules", heading: "Selected projects", tone: "muted" },
  experience: { alias: "log", heading: "My experience", tone: "flare" },
  stack: { alias: "packages", heading: "Tech stack", tone: "muted" },
  contact: { alias: "compose", heading: "Contact me", tone: "flare" },
  terminal: {
    alias: `${profile.userName}@${profile.osName}`,
    heading: "Live terminal",
    tone: "muted",
  },
  settings: { alias: "prefs", heading: "System settings", tone: "muted" },
  about: { alias: "notes", heading: "About me", tone: "muted" },
  missing: { alias: "404", heading: "Not found", tone: "muted" },
};

function chromeFor(id: string) {
  return APP_CHROME[id] ?? APP_CHROME[appWindowKey(id)];
}

export function headingForApp(id: string) {
  const project = featuredProjects.find((item) => item.slug === id);
  if (project) return project.title;
  return chromeFor(id)?.heading ?? labelForApp(id);
}

export function titleForApp(id: string): {
  text: string;
  tone: "muted" | "accent" | "flare";
} {
  const project = featuredProjects.find((item) => item.slug === id);
  if (project) {
    return {
      text: `${labelForApp("projects")} / ${project.index}${project.flagship ? " · flagship" : ""}`,
      tone: project.flagship ? "flare" : "accent",
    };
  }
  const name = labelForApp(id);
  const meta = chromeFor(id);
  if (!meta) return { text: name, tone: "muted" };
  return { text: `${name} / ${meta.alias}`, tone: meta.tone };
}

export function appFromPathname(pathname: string) {
  if (pathname === "/") return "home";
  if (pathname === "/projects") return "projects";
  const projectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (projectMatch) return projectMatch[1];
  if (pathname === "/experience") return "experience";
  if (pathname === "/stack") return "stack";
  if (pathname === "/contact") return "contact";
  if (pathname === "/terminal") return "terminal";
  if (pathname === "/settings") return "settings";
  if (pathname === "/about") return "about";
  return "missing";
}

export function hrefForApp(id: string) {
  if (id === "home") return "/";
  if (
    id === "projects" ||
    id === "experience" ||
    id === "stack" ||
    id === "contact" ||
    id === "about" ||
    id === "terminal" ||
    id === "settings"
  ) {
    return `/${id}`;
  }
  if (isProject(id)) return `/projects/${id}`;
  return "/";
}
