"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { getProject, getProjectNeighbors } from "@/content/projects";
import { hrefForApp, labelForApp, APP_PAGE } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { ShotFrame } from "@/components/apps/ShotFrame";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { GithubIcon } from "@/components/os/brand-icons";
import { Badge } from "@/components/ui/badge";
import { OsSpecularButton } from "@/components/ui/specular-button";
import { TextAnimate } from "@/components/ui/text-animate";

function Label({ children }: { children: string }) {
  return (
    <h3 className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
      {children}
    </h3>
  );
}

export function Case({ slug }: { slug: string }) {
  const project = getProject(slug);
  const neighbors = getProjectNeighbors(slug);

  if (!project || !neighbors) {
    return (
      <section className={APP_PAGE}>
        <Stagger>
          <p className="text-muted">Project not found.</p>
        </Stagger>
        <Stagger delay={STAGGER}>
          <Link
            href={hrefForApp("projects")}
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-accent uppercase transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.75} />
            Back to projects
          </Link>
        </Stagger>
      </section>
    );
  }

  const { prev, next, position, total } = neighbors;

  return (
    <article className={APP_PAGE}>
      <Stagger>
        <Link
          href={hrefForApp("projects")}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.75} />
          {labelForApp("projects")}
        </Link>
      </Stagger>

      <header className="mt-8 max-w-3xl">
        <Stagger delay={STAGGER}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
            <span>
              {project.index}
              <span className="text-line-strong"> / </span>
              {String(total).padStart(2, "0")}
            </span>
            <span className="text-line-strong">·</span>
            <span>{project.domain}</span>
            <span className="text-line-strong">·</span>
            <span>{project.period}</span>
            {project.flagship ? (
              <>
                <span className="text-line-strong">·</span>
                <span className="inline-flex items-center gap-1 text-flare">
                  <Flag className="size-3" strokeWidth={1.75} />
                  flagship
                </span>
              </>
            ) : null}
          </p>
        </Stagger>
        <TextAnimate
          as="h2"
          by="word"
          animation="blurInUp"
          startOnView={false}
          once
          className="mt-4 font-serif text-4xl tracking-tight sm:text-6xl"
        >
          {project.title}
        </TextAnimate>
        <Stagger delay={STAGGER * 2}>
          <p className="mt-3 text-base text-muted sm:text-lg">{project.subtitle}</p>
        </Stagger>
        <Stagger delay={STAGGER * 2}>
          <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-dim uppercase">
            {project.role}
          </p>
        </Stagger>
      </header>

      {project.shots.length ? (
        <Stagger delay={STAGGER * 3}>
          <section className="mt-10">
            <Label>stills</Label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {project.shots.map((shot, index) => (
                <ShotFrame key={shot.id} shot={shot} index={index} />
              ))}
            </div>
          </section>
        </Stagger>
      ) : null}

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:gap-16">
        <div className="min-w-0 max-w-3xl">
          <Stagger delay={STAGGER * 3}>
            <section>
              <Label>problem</Label>
              <p className="mt-3 text-base leading-relaxed text-fg/90">
                {project.problem}
              </p>
            </section>
          </Stagger>

          {project.architecture.length ? (
            <Stagger delay={STAGGER * 4}>
              <section className="mt-10">
                <Label>architecture</Label>
                <ol className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2">
                  {project.architecture.map((node, index) => (
                    <li key={node} className="flex items-center gap-1">
                      <span className="rounded-lg border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                        {node}
                      </span>
                      {index < project.architecture.length - 1 ? (
                        <ChevronRight
                          className="size-3 shrink-0 text-dim"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>
            </Stagger>
          ) : null}

          <section className="mt-10">
            <Stagger delay={STAGGER * 4}>
              <Label>what shipped</Label>
            </Stagger>
            <ol className="mt-5 space-y-5">
              {project.outcomes.map((outcome, index) => (
                <li key={outcome}>
                  <Stagger
                    delay={STAGGER * (5 + index)}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4"
                  >
                    <span
                      className={cn(
                        "font-mono text-[11px] tracking-[0.14em]",
                        index % 2 === 0 ? "text-accent" : "text-flare",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{outcome}</p>
                  </Stagger>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-10 lg:sticky lg:top-4">
          <Stagger delay={STAGGER * 4}>
            <section>
              <Label>stack</Label>
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
            <Stagger delay={STAGGER * 5}>
              <section>
                <Label>links</Label>
                <div className="mt-4 flex flex-col items-start gap-3">
                  {project.live ? (
                    <OsSpecularButton
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        live
                        <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
                      </span>
                    </OsSpecularButton>
                  ) : null}
                  {project.href ? (
                    <LiquidButton
                      asChild
                      hoverScale={1.02}
                      tapScale={0.98}
                      className="font-mono text-[11px] font-normal tracking-[0.18em] uppercase"
                    >
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        github
                        <GithubIcon className="size-3.5" />
                      </a>
                    </LiquidButton>
                  ) : null}
                </div>
              </section>
            </Stagger>
          ) : null}

          <Stagger delay={STAGGER * 6}>
            <nav aria-label="Other projects">
              <Label>projects</Label>
              <div className="mt-3 flex flex-col gap-1">
                {prev ? (
                  <Neighbor
                    href={hrefForApp(prev.slug)}
                    kicker="prev"
                    title={prev.title}
                    icon={ChevronLeft}
                  />
                ) : null}
                {next ? (
                  <Neighbor
                    href={hrefForApp(next.slug)}
                    kicker="next"
                    title={next.title}
                    icon={ChevronRight}
                  />
                ) : null}
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
                {String(position).padStart(2, "0")} of {String(total).padStart(2, "0")}
              </p>
            </nav>
          </Stagger>
        </aside>
      </div>
    </article>
  );
}

function Neighbor({
  href,
  kicker,
  title,
  icon: Icon,
}: {
  href: string;
  kicker: string;
  title: string;
  icon: typeof ChevronLeft;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-xl py-2 outline-none transition-colors",
        "hover:text-fg focus-visible:text-fg",
      )}
    >
      <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.18em] text-dim uppercase group-hover:text-flare">
        <Icon className="size-3" strokeWidth={1.75} />
        {kicker}
      </span>
      <span className="mt-1 block font-serif text-lg tracking-tight text-muted group-hover:text-fg">
        {title}
      </span>
    </Link>
  );
}
