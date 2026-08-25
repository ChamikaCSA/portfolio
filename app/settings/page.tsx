import type { Metadata } from "next";
import { Settings } from "@/components/apps/Settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Appearance, motion, and how the desktop feels on your machine.",
  alternates: { canonical: "/settings" },
};

export default function SettingsPage() {
  return <Settings />;
}
