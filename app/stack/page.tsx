import type { Metadata } from "next";
import { Stack } from "@/components/apps/Stack";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "Languages, frameworks, and tools behind the work — Next.js, Flutter, NestJS, and the rest of the kit.",
  alternates: { canonical: "/stack" },
};

export default function StackPage() {
  return <Stack />;
}
