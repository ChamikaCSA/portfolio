"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const toggleClass =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-sm bg-transparent text-muted transition-colors hover:text-accent [&_svg]:size-3.5";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextTheme = resolvedTheme === "light" ? "dark" : "light";

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(toggleClass, className)}
      />
    );
  }

  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <AnimatedThemeToggler
            theme={resolvedTheme === "light" ? "light" : "dark"}
            onThemeChange={setTheme}
            duration={500}
            className={cn(toggleClass, className)}
            aria-label={`Switch to ${nextTheme} theme`}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        theme <span className="ml-1.5 text-dim">{nextTheme}</span>
      </TooltipContent>
    </Tooltip>
  );
}
