"use client";

import { FormEvent, useState } from "react";
import { Download } from "lucide-react";
import { profile } from "@/content/profile";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { LiquidButton } from "@/components/animate-ui/components/buttons/liquid";
import { OsLabel } from "@/components/fx/OsLabel";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TextAnimate } from "@/components/ui/text-animate";

export function Compose() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);

    const payload = { name, from, message };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { mailto?: string; error?: string };
      if (!res.ok) {
        setStatus(data.error ?? "Could not send.");
        return;
      }
      await copyEmail();
      if (data.mailto) {
        window.location.href = data.mailto;
      }
      setStatus("Copied email · opening mail client.");
    } catch {
      const subject = encodeURIComponent(`Portfolio — ${name || "Hello"}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${from}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("Mail client fallback.");
    }
  };

  return (
    <section className={SURFACE_PAGE}>
      <OsLabel text="compose / new message" />
      <TextAnimate
        as="h2"
        by="word"
        animation="blurInUp"
        className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl"
      >
        Write
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 text-sm text-muted">{profile.availabilityDetail}</p>
      </Stagger>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] lg:gap-12">
        <Stagger delay={STAGGER * 2}>
          <form
            onSubmit={onSubmit}
            className="overflow-hidden rounded-2xl border border-line glass"
          >
            <Field label="to" value={profile.email} readOnly />
            <Separator className="bg-line" />
            <Field
              label="from"
              value={from}
              onChange={setFrom}
              placeholder="you@email.com"
              type="email"
              required
            />
            <Separator className="bg-line" />
            <Field
              label="name"
              value={name}
              onChange={setName}
              placeholder="Your name"
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
                placeholder="Message"
                className="min-h-40 resize-none rounded-none border-0 bg-transparent px-4 py-4 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 border-t border-line p-2">
              <LiquidButton
                type="submit"
                hoverScale={1.02}
                tapScale={0.98}
                className="font-mono text-[11px] font-normal tracking-[0.18em] uppercase"
              >
                send
              </LiquidButton>
            </div>
          </form>
          {status ? (
            <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-accent">
              {status}
            </p>
          ) : null}
        </Stagger>

        <Stagger delay={STAGGER * 3}>
          <aside className="lg:sticky lg:top-20">
            <p className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
              direct
            </p>
            <ul className="mt-4 space-y-4 font-mono text-[11px] text-muted">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.18em] text-dim uppercase">
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
                  className="h-auto w-auto cursor-pointer justify-start gap-1.5 rounded-none px-0 font-mono text-[11px] tracking-normal text-muted hover:bg-transparent hover:text-accent dark:hover:bg-transparent dark:hover:text-accent"
                >
                  {copied ? "copied" : profile.email}
                </CopyButton>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.18em] text-dim uppercase">
                  phone
                </span>
                <a href={profile.phoneHref} className="tracking-[0.04em] hover:text-accent">
                  {profile.phone}
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.18em] text-dim uppercase">
                  github
                </span>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="uppercase tracking-[0.16em] hover:text-accent"
                >
                  ChamikaCSA
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.18em] text-dim uppercase">
                  linkedin
                </span>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="uppercase tracking-[0.16em] hover:text-accent"
                >
                  chamika-sa
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.18em] text-dim uppercase">
                  cv
                </span>
                <a
                  href={profile.resumePath}
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em] hover:text-accent"
                >
                  <Download className="size-3.5" />
                  download
                </a>
              </li>
            </ul>
          </aside>
        </Stagger>
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
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="flex items-center gap-4 px-4 py-3">
      <span className="w-12 shrink-0 font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
        {label}
      </span>
      <Input
        type={type}
        required={required}
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-8 rounded-none border-0 bg-transparent px-0 shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
      />
    </label>
  );
}
