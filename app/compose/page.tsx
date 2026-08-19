import type { Metadata } from "next";
import { Compose } from "@/components/surfaces/Compose";

export const metadata: Metadata = {
  title: "Compose",
};

export default function ComposePage() {
  return <Compose />;
}
