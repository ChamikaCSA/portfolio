import { profile } from "@/content/profile";

export function buildComposeMailto(name: string, message: string) {
  const who = name.trim();
  const note = message.trim();
  const subject = `Hello from ${who}`;
  const body = [`Hi ${profile.firstName},`, "", note, "", who].join("\n");

  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
