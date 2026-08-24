"use client";

import Link from "next/link";
import { getProject, getProjectNeighbors } from "@/content/projects";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
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
      <section className={SURFACE_PAGE}>
        <Stagger>
          <p className="text-muted">Module not found.</p>
        </Stagger>
        <Stagger delay={STAGGER}>
          <Link
            href="/work"
            className="mt-4 inline-block font-mono text-[11px] tracking-[0.18em] text-accent uppercase transition-colors hover:text-fg"
          >
            Back to work
          </Link>
        </Stagger>
      </section>
    );
  }

  const { prev, next, position, total } = neighbors;

  return (
    <article className={SURFACE_PAGE}>
      <Stagger>
        <Link
          href="/work"
          className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
        >
          Work
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
                <span className="text-accent">flagship</span>
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
      </header>

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
                    <span className="font-mono text-[11px] tracking-[0.14em] text-accent">
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
                      live
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
                      </a>
                    </LiquidButton>
                  ) : null}
                </div>
              </section>
            </Stagger>
          ) : null}

          <Stagger delay={STAGGER * 6}>
            <nav aria-label="Other modules">
              <Label>modules</Label>
              <div className="mt-3 flex flex-col gap-1">
                {prev ? (
                  <Neighbor href={`/work/${prev.slug}`} kicker="prev" title={prev.title} />
                ) : null}
                {next ? (
                  <Neighbor href={`/work/${next.slug}`} kicker="next" title={next.title} />
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
}: {
  href: string;
  kicker: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-xl py-2 outline-none transition-colors",
        "hover:text-fg focus-visible:text-fg",
      )}
    >
      <span className="block font-mono text-[10px] tracking-[0.18em] text-dim uppercase group-hover:text-accent">
        {kicker}
      </span>
      <span className="mt-1 block font-serif text-lg tracking-tight text-muted group-hover:text-fg">
        {title}
      </span>
    </Link>
  );
}
