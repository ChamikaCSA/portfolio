"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { featuredProjects, type Project } from "@/content/projects";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { OsLabel } from "@/components/fx/OsLabel";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { Badge } from "@/components/ui/badge";
import { ElectricBorder } from "@/components/ui/electric-border";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Separator } from "@/components/ui/separator";
import { TextAnimate } from "@/components/ui/text-animate";
import GlareHover from "@/components/GlareHover";

function PreviewBody({ project }: { project: Project }) {
  return (
    <div className="p-8">
      <Stagger key={`${project.slug}-label`} delay={STAGGER * 0}>
        <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          preview
        </p>
      </Stagger>
      <Stagger key={`${project.slug}-title`} delay={STAGGER * 1}>
        <h3 className="mt-4 font-serif text-3xl tracking-tight">{project.title}</h3>
      </Stagger>
      <Stagger key={`${project.slug}-sub`} delay={STAGGER * 2}>
        <p className="mt-2 text-sm text-muted">{project.subtitle}</p>
      </Stagger>
      <Stagger key={`${project.slug}-problem`} delay={STAGGER * 3}>
        <p className="mt-5 text-sm leading-relaxed text-muted">{project.problem}</p>
      </Stagger>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((item, index) => (
          <Stagger key={`${project.slug}-${item}`} delay={STAGGER * (4 + index)}>
            <Badge
              variant="outline"
              className="border-line font-mono text-[10px] tracking-[0.14em] text-dim uppercase"
            >
              {item}
            </Badge>
          </Stagger>
        ))}
      </div>
      {project.flagship ? (
        <Stagger
          key={`${project.slug}-flag`}
          delay={STAGGER * (4 + Math.min(5, project.stack.length))}
        >
          <Badge className="mt-8 bg-accent font-mono text-[10px] tracking-[0.18em] text-[var(--accent-ink)] uppercase">
            flagship
          </Badge>
        </Stagger>
      ) : null}
    </div>
  );
}

export function Work() {
  const [active, setActive] = useState<Project>(featuredProjects[0]);
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [accent, setAccent] = useState("#c8f542");

  useEffect(() => {
    const next = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (next.startsWith("#")) setAccent(next);
  }, [resolvedTheme]);

  return (
    <section className={`flex flex-col ${SURFACE_PAGE}`}>
      <header className="flex items-end justify-between gap-6 pb-4">
        <div>
          <OsLabel text="work / modules" />
          <TextAnimate
            as="h2"
            by="word"
            animation="blurInUp"
            className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl"
          >
            Selected systems
          </TextAnimate>
          <Stagger delay={STAGGER}>
            <p className="mt-3 font-mono text-[11px] tracking-[0.22em] text-muted uppercase md:hidden">
              <NumberTicker
                value={featuredProjects.length}
                className="font-mono text-[11px] tracking-[0.22em] text-muted"
              />{" "}
              selected
            </p>
          </Stagger>
        </div>
        <Stagger delay={STAGGER} className="hidden text-right md:block">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
            <NumberTicker
              value={featuredProjects.length}
              className="font-mono text-[11px] tracking-[0.22em] text-muted"
            />{" "}
            selected
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
            A few systems I built end to end.
          </p>
        </Stagger>
      </header>
      <Separator className="bg-line" />

      <div className="grid items-start gap-8 pt-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <ul>
          {featuredProjects.map((project, index) => {
            const selected = active.slug === project.slug;
            return (
              <li key={project.slug}>
                <Stagger delay={STAGGER * (2 + index)}>
                  <MagicCard
                    glowOnly
                    gradientColor="var(--wash)"
                    gradientOpacity={reduced ? 0 : 0.48}
                    gradientFrom="var(--accent)"
                    gradientTo="var(--muted)"
                    className="rounded-2xl bg-transparent"
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      onMouseEnter={() => setActive(project)}
                      onFocus={() => setActive(project)}
                      className="flex w-full items-baseline gap-4 px-4 py-5 text-left sm:gap-6 sm:px-5"
                    >
                      <span className="w-8 shrink-0 font-mono text-[11px] tracking-[0.16em] text-dim">
                        {project.index}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-serif text-2xl tracking-tight sm:text-3xl ${
                            selected ? "text-fg" : "text-muted"
                          }`}
                        >
                          {project.title}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] tracking-[0.16em] text-dim uppercase sm:hidden">
                          {project.domain}
                        </span>
                      </span>
                      <span className="hidden min-w-0 flex-1 font-mono text-[11px] tracking-[0.14em] text-dim uppercase sm:block">
                        {project.domain}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-dim">
                        {project.period}
                      </span>
                    </Link>
                  </MagicCard>
                </Stagger>
              </li>
            );
          })}
        </ul>

        <aside className="hidden lg:sticky lg:top-20 lg:block">
          {reduced ? (
            <div className="overflow-hidden rounded-2xl border border-line glass">
              <PreviewBody project={active} />
            </div>
          ) : (
            <Stagger delay={STAGGER * 2} blur={false}>
              <ElectricBorder
                color={accent}
                speed={0.4}
                chaos={0.1}
                borderRadius={16}
                className="bg-transparent"
              >
                <div className="overflow-hidden rounded-2xl glass">
                  <GlareHover
                    className="w-full rounded-2xl"
                    glareColor="color-mix(in srgb, var(--fg) 14%, transparent)"
                    glareOpacity={0.1}
                    glareSize={220}
                    transitionDuration={700}
                  >
                    <PreviewBody project={active} />
                  </GlareHover>
                </div>
              </ElectricBorder>
            </Stagger>
          )}
        </aside>
      </div>
    </section>
  );
}
