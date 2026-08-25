import type { Metadata } from "next";
import { Experience } from "@/components/apps/Experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Internships, roles, and the path from IIT / University of Westminster to shipping production systems.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return <Experience />;
}
