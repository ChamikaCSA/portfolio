import type { Metadata } from "next";
import { Terminal } from "@/components/apps/Terminal";

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "An interactive shell into the portfolio — commands, files, and the long way around.",
  alternates: { canonical: "/terminal" },
};

export default function TerminalPage() {
  return <Terminal />;
}
