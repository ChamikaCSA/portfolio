"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const home = pathname === "/";

  if (reduced || !home) {
    return <div className={home ? "h-full" : undefined}>{children}</div>;
  }

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
