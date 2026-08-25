"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import { profile } from "@/content/profile";
import { useOs } from "@/lib/os-context";
import { APP_SCROLL_ID } from "@/lib/apps";
import { autocomplete, runCommand, type TermRow } from "@/lib/terminal";
import { cn } from "@/lib/utils";

type Line =
  | { kind: "in"; text: string }
  | { kind: "out"; text: string }
  | { kind: "err"; text: string }
  | { kind: "table"; rows: TermRow[] };

const PROMPT_HOST = `${profile.userName}@${profile.osName}`;

const BANNER: Line[] = [
  { kind: "out", text: "type help. tab completes. ↑ previous command." },
];

export function Terminal() {
  const { setApp } = useOs();
  const { setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const histIndexRef = useRef(-1);
  const draftRef = useRef("");
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<Line[]>(BANNER);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const node = document.getElementById(APP_SCROLL_ID);
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  const remember = (command: string) => {
    const history = historyRef.current;
    if (history[history.length - 1] !== command) history.push(command);
    histIndexRef.current = -1;
    draftRef.current = "";
  };

  const apply = (input: string) => {
    const next: Line[] = [...lines, { kind: "in", text: input }];
    const action = runCommand(input);

    if (action.kind === "clear") {
      setLines([]);
      return;
    }

    if (action.kind === "print" && action.lines.length) {
      const tone = action.tone === "err" ? "err" : "out";
      next.push(...action.lines.map((text) => ({ kind: tone, text }) as Line));
    }

    if (action.kind === "table") {
      next.push({ kind: "table", rows: action.rows });
    }

    if (action.kind === "open") {
      next.push({ kind: "out", text: `opening ${action.id}` });
      setLines(next);
      window.setTimeout(() => setApp(action.id), 80);
      return;
    }

    if (action.kind === "exit") {
      next.push({ kind: "out", text: "logout" });
      setLines(next);
      window.setTimeout(() => setApp("home"), 80);
      return;
    }

    if (action.kind === "theme") {
      next.push({ kind: "out", text: `theme ${action.value}` });
      setLines(next);
      setTheme(action.value);
      return;
    }

    if (action.kind === "cv") {
      next.push({ kind: "out", text: "opening cv" });
      setLines(next);
      window.open(profile.resumePath, "_blank", "noopener,noreferrer");
      return;
    }

    setLines(next);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const input = value.trim();
    if (!input) return;
    remember(input);
    setValue("");
    apply(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "l" && event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      setLines([]);
      return;
    }

    if (event.key === "c" && event.ctrlKey && !event.metaKey && !event.shiftKey) {
      if (value) {
        event.preventDefault();
        setValue("");
        histIndexRef.current = -1;
        draftRef.current = "";
      }
      return;
    }

    if (event.key === "u" && event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      setValue("");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const result = autocomplete(value);
      setValue(result.value);
      if (result.hint && result.hint !== value) {
        setLines((current) => [...current, { kind: "out", text: result.hint! }]);
      }
      return;
    }

    const history = historyRef.current;
    if (event.key === "ArrowUp") {
      if (history.length === 0) return;
      event.preventDefault();
      if (histIndexRef.current === -1) draftRef.current = value;
      const next = Math.min(
        history.length - 1,
        histIndexRef.current + 1,
      );
      histIndexRef.current = next;
      setValue(history[history.length - 1 - next]);
      return;
    }

    if (event.key === "ArrowDown") {
      if (histIndexRef.current === -1) return;
      event.preventDefault();
      const next = histIndexRef.current - 1;
      histIndexRef.current = next;
      setValue(next < 0 ? draftRef.current : history[history.length - 1 - next]);
    }
  };

  const focusInput = () => {
    const sel = window.getSelection();
    if (sel && sel.toString()) return;
    inputRef.current?.focus();
  };

  return (
    <section
      className="flex min-h-full flex-col px-5 py-5 sm:px-10"
      onClick={focusInput}
    >
      <div
        aria-live="polite"
        className="font-mono text-[13px] leading-relaxed tracking-[0.02em]"
      >
        {lines.map((line, index) => (
          <LineView key={index} line={line} />
        ))}
        <form onSubmit={onSubmit} className="flex items-baseline gap-2">
          <Prompt />
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="enter"
            aria-label="Terminal command"
            className="min-w-0 flex-1 bg-transparent font-mono text-base text-fg caret-accent outline-none sm:text-[13px]"
          />
        </form>
      </div>
    </section>
  );
}

function LineView({ line }: { line: Line }) {
  if (line.kind === "in") {
    return (
      <p className="whitespace-pre-wrap wrap-break-word text-fg">
        <Prompt /> {line.text}
      </p>
    );
  }

  if (line.kind === "table") {
    return (
      <div className="my-1 grid grid-cols-[minmax(6.5rem,auto)_minmax(0,1fr)] gap-x-4 gap-y-1">
        {line.rows.map((row) => (
          <div key={row.key} className="contents">
            <span className="text-dim">{row.key}</span>
            <span className="min-w-0 whitespace-pre-wrap wrap-break-word text-muted">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <p
      className={cn(
        "whitespace-pre-wrap wrap-break-word",
        line.kind === "err" ? "text-dim" : "text-muted",
      )}
    >
      {line.text}
    </p>
  );
}

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-accent">{PROMPT_HOST}</span>
      <span className="text-flare"> ~</span>
      <span className="text-dim"> %</span>
    </span>
  );
}
