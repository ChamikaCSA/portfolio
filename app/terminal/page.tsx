import type { Metadata } from "next";
import { Terminal } from "@/components/apps/Terminal";

export const metadata: Metadata = {
  title: "Terminal",
};

export default function TerminalPage() {
  return <Terminal />;
}
