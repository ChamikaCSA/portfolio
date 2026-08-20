"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Flip } from "gsap/Flip";
import { featuredProjects, type Project } from "@/content/projects";
import { gsap } from "@/lib/gsap";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TextAnimate } from "@/components/ui/text-animate";
import GlareHover from "@/components/GlareHover";

gsap.registerPlugin(Flip);

function PreviewBody({ project }: { project: Project }) {
  return (
    <div className="p-8">
      <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
        preview
      </p>
      <h3 className="mt-4 font-serif text-3xl tracking-tight">{project.title}</h3>
      <p className="mt-2 text-sm text-muted">{project.subtitle}</p>
      <p className="mt-5 text-sm leading-relaxed text-muted">{project.problem}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((item) => (
          <Badge
            key={item}
            variant="outline"
            className="border-line font-mono text-[10px] tracking-[0.14em] text-dim uppercase"
          >
            {item}
          </Badge>
        ))}
      </div>
      {project.flagship ? (
        <Badge className="mt-8 bg-accent font-mono text-[10px] tracking-[0.18em] text-[var(--accent-ink)] uppercase">
          flagship
        </Badge>
      ) : null}
    </div>
  );
}

export function Work() {
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

  const preview = (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl border border-line glass"
    >
      <MagicCard
        glowOnly
        gradientColor="var(--wash)"
        gradientOpacity={reduced ? 0 : 0.42}
        gradientFrom="var(--accent)"
        gradientTo="var(--muted)"
        className="rounded-2xl bg-transparent"
      >
        {reduced ? (
          <div ref={bodyRef} key={active.slug}>
            <PreviewBody project={active} />
          </div>
        ) : (
          <GlareHover
            className="w-full rounded-2xl"
            glareColor="color-mix(in srgb, var(--fg) 14%, transparent)"
            glareOpacity={0.1}
            glareSize={220}
            transitionDuration={700}
          >
            <div ref={bodyRef} key={active.slug}>
              <PreviewBody project={active} />
            </div>
          </GlareHover>
        )}
      </MagicCard>
      {reduced ? null : (
        <BorderBeam
          size={90}
          duration={7.5}
          borderWidth={1.5}
          colorFrom="var(--accent)"
          colorTo="color-mix(in srgb, var(--accent) 20%, transparent)"
        />
      )}
    </div>
  );

  return (
    <section className={`flex min-w-0 flex-col ${SURFACE_PAGE}`}>
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
            Selected systems
          </TextAnimate>
          <Stagger delay={STAGGER} className="hidden shrink-0 text-right md:block">
            <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
              <NumberTicker
                value={featuredProjects.length}
                className="font-mono text-[11px] tracking-[0.22em] text-muted"
              />{" "}
              selected
            </p>
          </Stagger>
        </div>
        <Stagger delay={STAGGER}>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            A few systems I built end to end.
          </p>
        </Stagger>
        <Stagger delay={STAGGER}>
          <p className="mt-3 font-mono text-[11px] tracking-[0.22em] text-muted uppercase md:hidden">
            <NumberTicker
              value={featuredProjects.length}
              className="font-mono text-[11px] tracking-[0.22em] text-muted"
            />{" "}
            selected
          </p>
        </Stagger>
      </header>
      <div className="mt-8 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <ul className="min-w-0">
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
                    className="min-w-0 rounded-2xl bg-transparent"
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      onMouseEnter={() => select(project)}
                      onFocus={() => select(project)}
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

        <aside className="hidden min-w-0 lg:sticky lg:top-4 lg:block">
          <Stagger delay={STAGGER * 2}>
            {preview}
          </Stagger>
        </aside>
      </div>
    </section>
  );
}
