import type { Metadata } from "next";
import { Stack } from "@/components/surfaces/Stack";

export const metadata: Metadata = {
  title: "Stack",
};

export default function StackPage() {
  return <Stack />;
}
