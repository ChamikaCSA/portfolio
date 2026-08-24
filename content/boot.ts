import { BIOS_RELEASE } from "@/lib/bios";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { DOCK_SURFACES } from "@/lib/surfaces";

export type BootLine = {
  delay: number;
  left: string;
  right?: string;
  tone?: "dim" | "fg";
  mark?: "accent" | "flare";
  count?: number;
  countSuffix?: string;
};

export const BOOT_LINES: BootLine[] = [
  {
    delay: 140,
    left: `${profile.osName} BIOS  Release ${BIOS_RELEASE}`,
    tone: "fg",
  },
  {
    delay: 90,
    left: `Copyright (C) 2026  ${profile.name}.  All rights reserved.`,
    tone: "dim",
  },
  { delay: 70, left: `${profile.location}  ·  ${profile.timezone}`, tone: "dim" },
  { delay: 150, left: "" },
  { delay: 80, left: "CPU     overthinking @ 4.2GHz", right: "OK" },
  { delay: 140, left: "MEM     counting browser tabs", right: "LOL", count: 47, mark: "flare" },
  { delay: 85, left: "GPU     liquid ether (decorative)", right: "WOW", mark: "flare" },
  { delay: 80, left: "HID     hunting for ⌘K / Ctrl+K", right: "OK" },
  { delay: 80, left: "NET     pinging the Indian Ocean", right: "WET", mark: "flare" },
  { delay: 75, left: "A11Y    reduced-motion treaty", right: "OK" },
  { delay: 160, left: "" },
  { delay: 90, left: "Booting from surface 0 (home).", tone: "fg" },
  { delay: 70, left: "" },
  {
    delay: 55,
    left: "[    0.000] kernel: built for vibes, not uptime",
    tone: "dim",
  },
  {
    delay: 50,
    left: `[    0.041] dock: ${DOCK_SURFACES.length} apps, 0 standups`,
    tone: "dim",
  },
  {
    delay: 48,
    left: "[    0.088] about: hidden in the logo. press A",
    tone: "dim",
  },
  {
    delay: 48,
    left: "[    0.120] compose: drafts a note, then mailto",
    tone: "dim",
  },
  {
    delay: 48,
    left: "[    0.168] log: the glow follows your scroll. sorry.",
    tone: "dim",
  },
  {
    delay: 48,
    left: `[    0.210] work: ${featuredProjects.length} modules. please be gentle.`,
    tone: "dim",
  },
  {
    delay: 48,
    left: "[    0.251] stack: typescript, obviously",
    tone: "dim",
  },
  {
    delay: 48,
    left: `[    0.294] manifesto: ${profile.philosophy[0].slice(0, 42)}`,
    tone: "dim",
  },
  { delay: 150, left: "" },
  { delay: 80, left: "Init complete.", right: "READY", tone: "fg" },
];
