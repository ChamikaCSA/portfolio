"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { featuredProjects } from "@/content/projects";
import { APP_SURFACES, hrefForSurface } from "@/lib/surfaces";
import { useOs } from "@/lib/os-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { FuzzyText } from "@/components/ui/fuzzy-text";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextAnimate } from "@/components/ui/text-animate";

const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  ...APP_SURFACES.map((item) => ({
    href: hrefForSurface(item.id),
    label: item.label,
  })),
  ...featuredProjects.map((project) => ({
    href: `/work/${project.slug}`,
    label: project.title,
  })),
];

const TRY = [
  { href: "/work", label: "Work" },
  { href: "/log", label: "Log" },
  { href: "/compose", label: "Compose" },
  { href: "/about", label: "About" },
];

function edits(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const grid = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      grid[i][j] =
        a[i - 1] === b[j - 1]
          ? grid[i - 1][j - 1]
          : 1 + Math.min(grid[i - 1][j], grid[i][j - 1], grid[i - 1][j - 1]);
    }
  }
  return grid[a.length][b.length];
}

function nearestRoute(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const tail = path.split("/").filter(Boolean).at(-1) ?? "";
  let best: (typeof ROUTES)[number] & { score: number } | null = null;

  for (const route of ROUTES) {
    const hrefTail = route.href.split("/").filter(Boolean).at(-1) ?? "";
    const score = Math.min(
      edits(path.toLowerCase(), route.href.toLowerCase()),
      edits(tail.toLowerCase(), hrefTail.toLowerCase()),
      edits(tail.toLowerCase(), route.label.toLowerCase()),
    );
    if (!best || score < best.score) best = { ...route, score };
  }

  if (!best || best.score === 0 || best.score > 2) return null;
  return best;
}

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
      {children}
    </p>
  );
}

export function NotFoundSurface() {
  const pathname = usePathname();
  const { setSurface } = useOs();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [ink, setInk] = useState("#c8f542");

  useEffect(() => {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (accent) setInk(accent);
  }, [resolvedTheme]);

  const path = pathname.replace(/\/+$/, "") || "/";
  const guess = useMemo(() => nearestRoute(path), [path]);

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-5 py-8 sm:px-10">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <Stagger>
          <p className="sr-only">404, surface not found</p>
          {reduced ? (
            <p className="font-serif text-6xl tracking-tight text-accent sm:text-7xl">
              404
            </p>
          ) : (
            <FuzzyText
              className="mx-auto max-w-full font-serif"
              fontFamily="inherit"
              fontSize="clamp(3.2rem, 10vw, 5.5rem)"
              fontWeight={400}
              color={ink}
              fuzzRange={8}
              enableHover
              baseIntensity={0.16}
              hoverIntensity={0.42}
            >
              404
            </FuzzyText>
          )}
        </Stagger>

        <TextAnimate
          as="h1"
          by="word"
          animation="blurInUp"
          startOnView={false}
          once
          className="mt-6 font-serif text-4xl tracking-tight sm:text-5xl"
        >
          Not found
        </TextAnimate>

        <Stagger delay={STAGGER}>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            This path is not a surface or a module.
          </p>
        </Stagger>

        <div className="mt-10 w-full space-y-8">
          <Stagger delay={STAGGER * 2}>
            <section>
              <Label>path</Label>
              <p className="mt-2 break-all font-mono text-[13px] text-fg">
                {path}
              </p>
            </section>
          </Stagger>

          {guess ? (
            <Stagger delay={STAGGER * 3}>
              <section>
                <Label>did you mean</Label>
                <Link
                  href={guess.href}
                  className="mt-2 inline-block text-[13px] text-muted transition-colors hover:text-accent"
                >
                  {guess.label}
                  <span className="ml-2 font-mono text-[11px] tracking-[0.08em] text-dim">
                    {guess.href}
                  </span>
                </Link>
              </section>
            </Stagger>
          ) : null}

          <Stagger delay={STAGGER * 4}>
            <section>
              <Label>try</Label>
              <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                {TRY.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-muted transition-colors hover:text-flare"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Stagger>

          <Stagger delay={STAGGER * 5}>
            <InteractiveHoverButton
              type="button"
              onClick={() => setSurface("home")}
              className="mt-2 h-11 rounded-2xl border border-line px-5 font-mono text-[11px] font-normal tracking-[0.2em] text-fg uppercase [&_svg]:size-3.5"
            >
              return home
            </InteractiveHoverButton>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
