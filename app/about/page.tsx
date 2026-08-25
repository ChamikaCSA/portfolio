import type { Metadata } from "next";
import { About } from "@/components/apps/About";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.manifesto} ${profile.role} based in ${profile.location}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <About />;
}
