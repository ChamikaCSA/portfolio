import type { Metadata } from "next";
import { NotFoundSurface } from "@/components/surfaces/NotFound";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return <NotFoundSurface />;
}
