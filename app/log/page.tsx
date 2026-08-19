import type { Metadata } from "next";
import { Log } from "@/components/surfaces/Log";

export const metadata: Metadata = {
  title: "Log",
};

export default function LogPage() {
  return <Log />;
}
