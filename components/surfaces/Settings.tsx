"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { useTheme } from "next-themes";
import {
  DEFAULT_SETTINGS,
  patchSettings,
  useOsSettings,
  writeSettings,
  type EffectsPref,
} from "@/lib/os-settings";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { Switch } from "@/components/animate-ui/components/radix/switch";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/animate-ui/components/radix/toggle-group";
import { runThemeViewTransition } from "@/components/ui/animated-theme-toggler";
import { TextAnimate } from "@/components/ui/text-animate";

export function Settings() {
  const settings = useOsSettings();
  const reduced = useReducedMotion();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const themeOriginRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const themePref = mounted ? (theme ?? "system") : "system";
  const appearance = resolvedTheme === "light" ? "light" : "dark";

  const onThemePref = (next: string) => {
    const pref = next as "light" | "dark" | "system";
    const nextAppearance: "light" | "dark" =
      pref === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : pref;
    const apply = () => {
      document.documentElement.classList.toggle(
        "dark",
        nextAppearance === "dark",
      );
      setTheme(pref);
    };

    if (nextAppearance === appearance || reduced) {
      apply();
      return;
    }

    runThemeViewTransition({
      origin: themeOriginRef.current,
      duration: 500,
      apply,
    });
  };

  const dirty =
    mounted &&
    (themePref !== "system" ||
      settings.effects !== DEFAULT_SETTINGS.effects ||
      settings.wallpaper !== DEFAULT_SETTINGS.wallpaper ||
      settings.frost !== DEFAULT_SETTINGS.frost ||
      settings.dockMag !== DEFAULT_SETTINGS.dockMag);

  const restore = () => {
    writeSettings(DEFAULT_SETTINGS);
    onThemePref("system");
  };

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
        Settings
      </TextAnimate>
      <Stagger delay={STAGGER}>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          How this machine looks and moves. Prefs stay on this device.
        </p>
      </Stagger>

      <div className="mt-10 max-w-2xl space-y-10">
        <Stagger delay={STAGGER * 2}>
          <Group
            title="look"
            status={
              mounted
                ? themePref === "system"
                  ? `${appearance} · device`
                  : appearance
                : undefined
            }
          >
            <Row
              label="Theme"
              hint="Light, dark, or match the device."
            >
              <Choice
                value={themePref}
                onChange={onThemePref}
                originRef={themeOriginRef}
                label="Theme"
                options={[
                  { id: "light", label: "Light" },
                  { id: "dark", label: "Dark" },
                  { id: "system", label: "Auto" },
                ]}
              />
            </Row>
          </Group>
        </Stagger>

        <Stagger delay={STAGGER * 3}>
          <Group
            title="motion"
            status={
              settings.effects === "system"
                ? reduced
                  ? "off · device"
                  : "on · device"
                : reduced
                  ? "off"
                  : "on"
            }
          >
            <Row
              label="Motion"
              hint="Boot, windows, and animation. Off also pauses wallpaper, glass, and dock zoom. Auto follows the device."
            >
              <Choice
                value={settings.effects}
                onChange={(value) =>
                  patchSettings({ effects: value as EffectsPref })
                }
                label="Motion"
                options={[
                  { id: "full", label: "On" },
                  { id: "reduce", label: "Off" },
                  { id: "system", label: "Auto" },
                ]}
              />
            </Row>
            <SwitchRow
              label="Wallpaper"
              hint="The liquid color field behind home."
              checked={settings.wallpaper && !reduced}
              disabled={reduced}
              onCheckedChange={(wallpaper) => patchSettings({ wallpaper })}
            />
            <SwitchRow
              label="Glass"
              hint="Blur on the dock, menus, and cards."
              checked={settings.frost && !reduced}
              disabled={reduced}
              onCheckedChange={(frost) => patchSettings({ frost })}
            />
            <SwitchRow
              label="Dock zoom"
              hint="Icons grow as the pointer passes."
              checked={settings.dockMag && !reduced}
              disabled={reduced}
              onCheckedChange={(dockMag) => patchSettings({ dockMag })}
            />
          </Group>
        </Stagger>

        {dirty ? (
          <Stagger delay={STAGGER * 4}>
            <button
              type="button"
              onClick={restore}
              className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
            >
              restore defaults
            </button>
          </Stagger>
        ) : null}
      </div>
    </section>
  );
}

function Group({
  title,
  status,
  children,
}: {
  title: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-[10px] tracking-[0.22em] text-dim uppercase">
          {title}
        </h3>
        {status ? (
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
            {status}
          </p>
        ) : null}
      </div>
      <div className="mt-3 divide-y divide-line border-y border-line">
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-sm text-fg">{label}</p>
        <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function SwitchRow({
  label,
  hint,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-6 py-5 sm:items-center",
        disabled && "opacity-45",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-fg">{label}</p>
        <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">{hint}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={label}
        className="shrink-0 self-start sm:self-center"
      />
    </div>
  );
}

function Choice({
  value,
  onChange,
  options,
  originRef,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  originRef?: Ref<HTMLDivElement>;
  label: string;
}) {
  return (
    <div ref={originRef} className="shrink-0 self-start sm:self-center">
      <ToggleGroup
        type="single"
        value={value}
        aria-label={label}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.id} value={option.id}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
