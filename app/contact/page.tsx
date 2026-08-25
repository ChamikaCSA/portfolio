import type { Metadata } from "next";
import { Contact } from "@/components/apps/Contact";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `${profile.availabilityDetail} Email, GitHub, LinkedIn, and a note from ${profile.location}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
