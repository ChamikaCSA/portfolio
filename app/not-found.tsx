import type { Metadata } from "next";
import { NotFound as NotFoundApp } from "@/components/apps/NotFound";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundApp />;
}
