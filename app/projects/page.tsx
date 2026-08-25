import type { Metadata } from "next";
import { Projects } from "@/components/apps/Projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected web and mobile work — federated learning, realtime coaching, and product engineering.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <Projects />;
}
