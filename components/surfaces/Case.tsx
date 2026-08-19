"use client";

import Link from "next/link";
import { getProject } from "@/content/projects";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { OsLabel } from "@/components/fx/OsLabel";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OsSpecularButton } from "@/components/ui/specular-button";
import { TextAnimate } from "@/components/ui/text-animate";

export function Case({ slug }: { slug: string }) {
  const project = getProject(slug);

  if (!project) {
    return (
      <section className={SURFACE_PAGE}>
        <p className="text-muted">Module not found.</p>
        <Link
          href="/work"
          className="mt-4 inline-block font-mono text-[11px] tracking-[0.18em] text-accent uppercase transition-colors hover:text-fg"
        >
          ← work
        </Link>
      </section>
    );
  }

  return (
    <article className={SURFACE_PAGE}>
      <Link
        href="/work"
        className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
      >
        ← work
      </Link>

      <OsLabel
        text={`module / ${project.index}${project.flagship ? " · flagship" : ""}`}
        className="mt-8"
        tone="accent"
      />
      <TextAnimate
        as="h2"
        by="word"
        animation="blurInUp"
        className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl"
      >
        {project.title}
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 text-muted">
          {project.subtitle} · {project.period}
        </p>
      </Stagger>

      <Stagger delay={STAGGER * 2}>
        <section className="mt-12">
          <h3 className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
            problem
          </h3>
          <p className="mt-3 text-base leading-relaxed text-fg/90">{project.problem}</p>
        </section>
      </Stagger>

      <section className="mt-10">
        <Stagger delay={STAGGER * 3}>
          <h3 className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
            what shipped
          </h3>
        </Stagger>
        <ul className="mt-4 space-y-3">
          {project.outcomes.map((outcome, index) => (
            <li key={outcome}>
              <Stagger
                delay={STAGGER * (4 + index)}
                className="border-l border-line pl-4 text-sm leading-relaxed text-muted"
              >
                {outcome}
              </Stagger>
            </li>
          ))}
        </ul>
      </section>

      <Stagger delay={STAGGER * (4 + project.outcomes.length)}>
        <section className="mt-10">
          <h3 className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
            stack
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="border-line font-mono text-[10px] tracking-[0.14em] text-muted uppercase"
              >
                {item}
              </Badge>
            ))}
          </div>
        </section>
      </Stagger>

      {project.href || project.live ? (
        <Stagger delay={STAGGER * (5 + project.outcomes.length)}>
          <Separator className="mt-10 bg-line" />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.href ? (
              <LiquidButton
                asChild
                hoverScale={1.02}
                tapScale={0.98}
                className="font-mono text-[11px] font-normal tracking-[0.18em] uppercase"
              >
                <a href={project.href} target="_blank" rel="noreferrer">
                  github
                </a>
              </LiquidButton>
            ) : null}
            {project.live ? (
              <OsSpecularButton
                href={project.live}
                target="_blank"
                rel="noreferrer"
              >
                live
              </OsSpecularButton>
            ) : null}
          </div>
        </Stagger>
      ) : null}
    </article>
  );
}
