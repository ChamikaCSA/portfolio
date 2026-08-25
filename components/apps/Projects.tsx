"use client";

import { useLayoutEffect, useRef, useState, type Ref } from "react";
import Link from "next/link";
import { Flip } from "gsap/Flip";
import { featuredProjects, type Project } from "@/content/projects";
import { gsap } from "@/lib/gsap";
import { headingForApp, hrefForApp, APP_PAGE } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { ShotFrame } from "@/components/apps/ShotFrame";
import { GithubIcon } from "@/components/os/brand-icons";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TextAnimate } from "@/components/ui/text-animate";
import GlareHover from "@/components/GlareHover";

gsap.registerPlugin(Flip);

function ProofMarks({ project }: { project: Project }) {
  if (!project.live && !project.href) return null;
  return (
    <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase">
      {project.live ? <span className="text-accent">live</span> : null}
      {project.href ? (
        <span className="inline-flex items-center gap-1 text-dim">
          <GithubIcon className="size-3" />
          repo
        </span>
      ) : null}
    </span>
  );
}

function PreviewBody({ project }: { project: Project }) {
  const shot = project.shots[0];

  return (
    <div className="flex flex-col">
      {shot ? (
        <ShotFrame shot={shot} index={0} compact className="w-full" />
      ) : null}
      <div className="flex flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
            {project.index}
            <span className="text-line-strong"> / </span>
            {String(featuredProjects.length).padStart(2, "0")}
          </p>
          <ProofMarks project={project} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {project.highlight}
        </p>
      </div>
    </div>
  );
}

function PreviewCard({
  project,
  reduced,
  cardRef,
  bodyRef,
}: {
  project: Project;
  reduced: boolean;
  cardRef: Ref<HTMLDivElement>;
  bodyRef: Ref<HTMLDivElement>;
}) {
  const inner = reduced ? (
    <div ref={bodyRef} key={project.slug}>
      <PreviewBody project={project} />
    </div>
  ) : (
    <GlareHover
      className="w-full rounded-2xl"
      glareColor="color-mix(in srgb, var(--fg) 14%, transparent)"
      glareOpacity={0.1}
      glareSize={220}
      transitionDuration={700}
    >
      <div ref={bodyRef} key={project.slug}>
        <PreviewBody project={project} />
      </div>
    </GlareHover>
  );

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl border border-line bg-background"
    >
      <MagicCard
        glowOnly
        gradientColor="var(--wash)"
        gradientOpacity={reduced ? 0 : 0.42}
        gradientFrom="var(--accent)"
        gradientTo="var(--flare)"
        className="rounded-2xl bg-transparent"
      >
        <Link
          href={hrefForApp(project.slug)}
          className="block outline-none focus-visible:ring-0"
          aria-label={`Open ${project.title}`}
        >
          {inner}
        </Link>
      </MagicCard>
      {reduced ? null : (
        <BorderBeam
          size={90}
          duration={7.5}
          borderWidth={1.5}
          colorFrom="var(--accent)"
          colorTo="var(--flare)"
        />
      )}
    </div>
  );
}

export function Projects() {
  const [active, setActive] = useState<Project>(featuredProjects[0]);
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const flipTween = useRef<gsap.core.Timeline | null>(null);

  const select = (project: Project) => {
    if (project.slug === active.slug) return;
    if (!reduced && cardRef.current) {
      flipTween.current?.kill();
      flipState.current = Flip.getState(cardRef.current);
    }
    setActive(project);
  };

  useLayoutEffect(() => {
    const card = cardRef.current;
    const state = flipState.current;
    if (!state || !card || reduced) return;
    flipState.current = null;

    flipTween.current = Flip.from(state, {
      duration: 0.4,
      ease: "power2.out",
      nested: true,
      onComplete: () => {
        gsap.set(card, { clearProps: "height,overflow" });
      },
    });

    if (bodyRef.current) {
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: "power2.out" },
      );
    }
  }, [active.slug, reduced]);

  return (
    <section className={`flex min-w-0 flex-col ${APP_PAGE}`}>
      <header>
        <div className="flex items-end justify-between gap-6">
          <TextAnimate
            as="h2"
            by="word"
            animation="blurInUp"
            startOnView={false}
            once
            className="font-serif text-4xl tracking-tight sm:text-5xl"
          >
            {headingForApp("projects")}
          </TextAnimate>
          <Stagger delay={STAGGER} className="hidden shrink-0 text-right md:block">
            <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
              <NumberTicker
                value={featuredProjects.length}
                className="font-mono text-[11px] tracking-[0.22em] text-muted"
              />{" "}
              projects
            </p>
          </Stagger>
        </div>
        <Stagger delay={STAGGER}>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Open a project to see how it shipped.
          </p>
        </Stagger>
        <Stagger delay={STAGGER}>
          <p className="mt-3 font-mono text-[11px] tracking-[0.22em] text-muted uppercase md:hidden">
            <NumberTicker
              value={featuredProjects.length}
              className="font-mono text-[11px] tracking-[0.22em] text-muted"
            />{" "}
            projects
          </p>
        </Stagger>
      </header>
      <div className="mt-8 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)]">
        <Stagger delay={STAGGER * 2}>
          <ul className="min-w-0 divide-y divide-line border-y border-line">
            {featuredProjects.map((project) => {
              const selected = active.slug === project.slug;
              return (
                <li key={project.slug}>
                  <Link
                    href={hrefForApp(project.slug)}
                    onMouseEnter={() => select(project)}
                    onFocus={() => select(project)}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-4 text-left transition-colors sm:gap-x-6",
                      selected ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    <span
                      className={cn(
                        "row-span-2 self-start pt-1.5 font-mono text-[11px] tracking-[0.16em]",
                        selected ? "text-accent" : "text-dim",
                      )}
                    >
                      {project.index}
                    </span>
                    <span className="min-w-0 font-serif text-2xl tracking-tight sm:text-3xl">
                      {project.title}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-dim">
                      {project.period}
                    </span>
                    <span className="min-w-0 font-mono text-[10px] tracking-[0.16em] text-dim uppercase sm:text-[11px] sm:tracking-[0.14em]">
                      {project.domain}
                    </span>
                    {project.live ? (
                      <span className="shrink-0 text-right font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                        live
                      </span>
                    ) : (
                      <span />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Stagger>

        <aside className="hidden min-w-0 lg:sticky lg:top-4 lg:block">
          <Stagger delay={STAGGER * 2}>
            <div aria-live="polite">
              <PreviewCard
                project={active}
                reduced={reduced}
                cardRef={cardRef}
                bodyRef={bodyRef}
              />
            </div>
          </Stagger>
        </aside>
      </div>
    </section>
  );
}
