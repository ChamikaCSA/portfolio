"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import { profile } from "@/content/profile";
import { buildComposeMailto } from "@/lib/compose-mail";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { MagicCard } from "@/components/ui/magic-card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TextAnimate } from "@/components/ui/text-animate";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
      {children}
    </p>
  );
}

function DirectLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="text-[13px] tracking-normal text-muted transition-colors hover:text-flare"
    >
      {children}
    </a>
  );
}

export function Compose() {
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* mailto still works if clipboard is blocked */
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    await copyEmail();
    window.location.href = buildComposeMailto(name, message);
    setBusy(false);
  };

  const aside = (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-4">
      <Stagger delay={STAGGER * 3}>
        <section>
          <Label>direct</Label>
          <ul className="mt-4 space-y-4">
            <li className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
                email
              </span>
              <CopyButton
                type="button"
                content={profile.email}
                variant="ghost"
                size="xs"
                hoverScale={1}
                tapScale={1}
                copied={copied}
                onCopiedChange={(value) => setCopied(value)}
                className="h-auto w-auto max-w-full cursor-pointer justify-start gap-1.5 rounded-none px-0 font-mono text-[13px] font-normal tracking-normal text-muted hover:bg-transparent hover:text-flare dark:hover:bg-transparent dark:hover:text-flare"
              >
                {profile.email}
              </CopyButton>
            </li>
            <li className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
                phone
              </span>
              <DirectLink href={profile.phoneHref}>{profile.phone}</DirectLink>
            </li>
            <li className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
                where
              </span>
              <p className="text-[13px] text-muted">{profile.location}</p>
            </li>
          </ul>
        </section>
      </Stagger>

      <Stagger delay={STAGGER * 5}>
        <section>
          <Label>file</Label>
          <div className="mt-4">
            <DirectLink href={profile.resumePath}>
              <span className="inline-flex items-center gap-1.5">
                <Download className="size-3.5" />
                CV
              </span>
            </DirectLink>
          </div>
        </section>
      </Stagger>

      <Stagger delay={STAGGER * 6}>
        <section>
          <Label>network</Label>
          <ul className="mt-4 space-y-3">
            <li>
              <DirectLink href={profile.links.github} external>
                GitHub
              </DirectLink>
            </li>
            <li>
              <DirectLink href={profile.links.linkedin} external>
                LinkedIn
              </DirectLink>
            </li>
          </ul>
        </section>
      </Stagger>
    </aside>
  );

  return (
    <section className={SURFACE_PAGE}>
      <TextAnimate
        as="h2"
        by="word"
        animation="blurInUp"
        startOnView={false}
        once
        className="font-serif text-4xl tracking-tight sm:text-5xl"
      >
        Compose
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {profile.availabilityDetail} Based in {profile.location}. Write a
          note and it opens in your mail app, already addressed.
        </p>
      </Stagger>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,16rem)] lg:gap-12">
        <Stagger delay={STAGGER * 2}>
          <MagicCard
            className="w-full rounded-2xl p-0"
            gradientSize={200}
            gradientFrom="var(--accent)"
            gradientTo="var(--flare)"
            gradientColor="var(--flare-dim)"
            gradientOpacity={reduced ? 0 : 0.22}
          >
            <form onSubmit={onSubmit}>
              <Field label="to" value={profile.email} readOnly />
              <Separator className="bg-line" />
              <Field
                label="name"
                value={name}
                onChange={setName}
                placeholder="Your name"
                autoComplete="name"
                required
              />
              <Separator className="bg-line" />
              <label className="block">
                <span className="sr-only">Message</span>
                <Textarea
                  required
                  rows={8}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="A role, a project, or a hello."
                  className="min-h-40 resize-none rounded-none border-0 bg-transparent px-4 py-4 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
                />
              </label>
              <div className="flex flex-wrap items-center gap-3 border-t border-line p-2">
                <LiquidButton
                  type="submit"
                  disabled={busy}
                  hoverScale={1.02}
                  tapScale={0.98}
                  className="font-mono text-[11px] font-normal tracking-[0.18em] uppercase disabled:opacity-50"
                >
                  {busy ? "opening" : "open mail"}
                </LiquidButton>
              </div>
            </form>
          </MagicCard>
        </Stagger>

        {aside}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  readOnly,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
}) {
  const id = `compose-${label}`;
  return (
    <label className="flex items-center gap-4 px-4 py-3" htmlFor={id}>
      <span className="w-12 shrink-0 font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
        {label}
      </span>
      <Input
        id={id}
        type={type}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-8 rounded-none border-0 bg-transparent px-0 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
      />
    </label>
  );
}
