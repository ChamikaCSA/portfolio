import type { Metadata } from "next";
import { About } from "@/components/surfaces/About";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return <About />;
}
