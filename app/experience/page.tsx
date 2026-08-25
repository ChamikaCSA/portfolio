import type { Metadata } from "next";
import { Experience } from "@/components/apps/Experience";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperiencePage() {
  return <Experience />;
}
