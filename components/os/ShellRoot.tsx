"use client";

import { OsProvider } from "@/lib/os-context";
import { OsShell } from "@/components/os/Shell";

export function OsRoot({ children }: { children: React.ReactNode }) {
  return (
    <OsProvider>
      <OsShell>{children}</OsShell>
    </OsProvider>
  );
}
