import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { stackLayers } from "@/content/stack";
import { APPS } from "@/lib/apps";

export type TermRow = { key: string; value: string };

export type TermAction =
  | { kind: "print"; lines: string[]; tone?: "out" | "err" }
  | { kind: "table"; rows: TermRow[] }
  | { kind: "open"; id: string }
  | { kind: "theme"; value: "light" | "dark" | "system" }
  | { kind: "clear" }
  | { kind: "cv" }
  | { kind: "exit" };

const APP_ALIASES: Record<string, string> = {
  home: "home",
  desktop: "home",
  about: "about",
  projects: "projects",
  project: "projects",
  modules: "projects",
  experience: "experience",
  log: "experience",
  stack: "stack",
  contact: "contact",
  compose: "contact",
  terminal: "terminal",
  tty: "terminal",
  settings: "settings",
  prefs: "settings",
};

const COMMANDS = [
  "help",
  "whoami",
  "ls",
  "open",
  "stack",
  "contact",
  "experience",
  "cv",
  "resume",
  "theme",
  "date",
  "clear",
  "cls",
  "exit",
  "quit",
  "logout",
  "pwd",
  "cd",
  "neofetch",
  "fetch",
] as const;

const HELP: TermRow[] = [
  { key: "help", value: "this list" },
  { key: "whoami", value: "identity" },
  { key: "ls", value: "apps and projects" },
  { key: "open <app>", value: "open an app or project" },
  { key: "stack", value: "installed packages" },
  { key: "contact", value: "open contact" },
  { key: "cv", value: "resume" },
  { key: "theme", value: "light, dark, or system" },
  { key: "date", value: "Colombo time" },
  { key: "pwd", value: "working directory" },
  { key: "clear", value: "wipe the scrollback" },
  { key: "exit", value: "return home" },
];

const OPEN_TARGETS = [
  "home",
  "about",
  ...APPS.map((item) => item.id),
  ...featuredProjects.map((item) => item.slug),
];

function resolveOpen(name: string) {
  const key = name.toLowerCase();
  if (APP_ALIASES[key]) return APP_ALIASES[key];
  const app = APPS.find((item) => item.id === key);
  if (app) return app.id;
  const project = featuredProjects.find(
    (item) => item.slug === key || item.title.toLowerCase() === key,
  );
  return project?.slug ?? null;
}

function commonPrefix(items: string[]) {
  if (items.length === 0) return "";
  let prefix = items[0];
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

export function autocomplete(line: string): {
  value: string;
  hint?: string;
} {
  const endsWithSpace = /\s$/.test(line);
  const parts = line.trim().split(/\s+/).filter(Boolean);
  const cmd = (parts[0] ?? "").toLowerCase();

  if (parts.length <= 1 && !endsWithSpace) {
    const matches = COMMANDS.filter((name) => name.startsWith(cmd));
    if (matches.length === 1) {
      const name = matches[0];
      const spaced = name === "open" || name === "theme" ? `${name} ` : name;
      return { value: spaced };
    }
    if (matches.length > 1) {
      return {
        value: commonPrefix(matches),
        hint: matches.join("  "),
      };
    }
    return { value: line };
  }

  if (cmd === "open" || cmd === "theme") {
    const pool =
      cmd === "theme" ? ["light", "dark", "system"] : [...OPEN_TARGETS];
    const arg = endsWithSpace ? "" : (parts[1] ?? "").toLowerCase();
    const matches = pool.filter((name) => name.startsWith(arg));
    if (matches.length === 1) return { value: `${cmd} ${matches[0]}` };
    if (matches.length > 1) {
      return {
        value: `${cmd} ${commonPrefix(matches)}`,
        hint: matches.join("  "),
      };
    }
  }

  return { value: line };
}

export function runCommand(input: string): TermAction {
  const trimmed = input.trim();
  if (!trimmed) return { kind: "print", lines: [] };

  const [raw, ...rest] = trimmed.split(/\s+/);
  const cmd = raw.toLowerCase();
  const arg = rest.join(" ");

  if (cmd === "help" || cmd === "?") {
    return { kind: "table", rows: HELP };
  }

  if (cmd === "clear" || cmd === "cls") {
    return { kind: "clear" };
  }

  if (cmd === "exit" || cmd === "quit" || cmd === "logout") {
    return { kind: "exit" };
  }

  if (cmd === "cv" || cmd === "resume") {
    return { kind: "cv" };
  }

  if (cmd === "contact") {
    return { kind: "open", id: "contact" };
  }

  if (cmd === "experience") {
    return { kind: "open", id: "experience" };
  }

  if (cmd === "pwd" || cmd === "cd") {
    return { kind: "print", lines: [`/Users/${profile.userName}`] };
  }

  if (cmd === "whoami") {
    return {
      kind: "table",
      rows: [
        { key: "name", value: profile.name },
        { key: "role", value: profile.role },
        { key: "where", value: profile.location },
        { key: "status", value: profile.availability },
        { key: "mail", value: profile.email },
      ],
    };
  }

  if (cmd === "date") {
    const now = new Date().toLocaleString("en-LK", {
      timeZone: profile.timezone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return { kind: "print", lines: [`${now}  ${profile.timezone}`] };
  }

  if (cmd === "ls") {
    const apps = [
      "home",
      "about",
      ...APPS.map((item) => item.id),
    ].join("  ");
    const projects = featuredProjects.map((item) => item.slug).join("  ");
    return {
      kind: "print",
      lines: ["apps/", `  ${apps}`, "projects/", `  ${projects}`],
    };
  }

  if (cmd === "stack") {
    return {
      kind: "table",
      rows: stackLayers.map((layer) => ({
        key: layer.label,
        value: layer.packages.join(", "),
      })),
    };
  }

  if (cmd === "open") {
    if (!arg) {
      return {
        kind: "print",
        tone: "err",
        lines: ["usage: open <app>", "try: open projects"],
      };
    }
    const id = resolveOpen(arg);
    if (!id) {
      return {
        kind: "print",
        tone: "err",
        lines: [`open: ${arg}: no such app`, "try: ls"],
      };
    }
    return { kind: "open", id };
  }

  if (cmd === "theme") {
    const value = arg.toLowerCase();
    if (value === "light" || value === "dark" || value === "system") {
      return { kind: "theme", value };
    }
    return {
      kind: "print",
      tone: "err",
      lines: ["usage: theme light|dark|system"],
    };
  }

  if (cmd === "neofetch" || cmd === "fetch") {
    return {
      kind: "table",
      rows: [
        { key: "os", value: `${profile.osName}  ${profile.name}` },
        { key: "user", value: profile.userName },
        { key: "host", value: profile.location },
        { key: "shell", value: "tty" },
        { key: "stack", value: stackLayers[1]?.packages[0] ?? "Next.js" },
        { key: "mail", value: profile.email },
      ],
    };
  }

  return {
    kind: "print",
    tone: "err",
    lines: [`command not found: ${raw}`, "try: help"],
  };
}
