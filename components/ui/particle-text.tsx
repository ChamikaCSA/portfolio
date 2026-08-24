"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
export interface ParticleTextProps {
  text?: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  highlightColorB?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  trigger?: 'mount' | 'hover' | 'click';
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  glow?: boolean;
  align?: "left" | "center";
  className?: string;
  style?: CSSProperties;
}

type Rgb = { r: number; g: number; b: number };
type Target = { x: number; y: number; alpha: number };
type Particle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  seed: number;
  depth: number;
  delay: number;
};

const hexToRgb = (hex: string): Rgb | null => {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount)
});

const rgbToCss = (rgb: Rgb): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const resolveFontSize = (
  value: number | string,
  container: HTMLDivElement,
  fontWeight: number | string,
  fontFamily: string
): number => {
  if (typeof value === 'number') return value;

  const probe = document.createElement('span');
  probe.textContent = 'M';
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.fontSize = value;
  probe.style.fontWeight = String(fontWeight);
  probe.style.fontFamily = fontFamily;
  container.appendChild(probe);
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 96;
  probe.remove();
  return size;
};

const waitForFonts = async (font: string): Promise<void> => {
  if (!('fonts' in document)) return;

  try {
    await document.fonts.load(font);
  } catch {}

  await document.fonts.ready;
};

const ParticleText = ({
  text = 'React Bits',
  particleSize = 2,
  density = 4,
  color = '#ffffff',
  highlightColor = '#8b5cf6',
  highlightColorB,
  scatter = 180,
  gatherDuration = 1600,
  stagger = 420,
  pointerRepel = 40,
  repelRadius = 120,
  idleDrift = 0.7,
  trigger = 'mount',
  fontSize = 'clamp(3rem, 12vw, 8rem)',
  fontWeight = 800,
  fontFamily = 'inherit',
  glow = true,
  align = 'center',
  className = '',
  style
}: ParticleTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return undefined;

    let particles: Particle[] = [];
    let animationFrame: number | null = null;
    let resizeFrame: number | null = null;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let lastFrame = 0;
    let inView = true;
    let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let canvasLeft = 0;
    let canvasTop = 0;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const saveData = Boolean(
      "connection" in navigator &&
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData,
    );

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0
    };

    const syncCanvasRect = (): void => {
      const rect = canvas.getBoundingClientRect();
      canvasLeft = rect.left;
      canvasTop = rect.top;
    };

    const startGather = (fromScatter = true): void => {
      if (!particles.length) return;

      const now = performance.now();
      const spread = reducedMotion ? 0 : scatter;

      particles.forEach(particle => {
        if (fromScatter) {
          const angle = particle.seed * Math.PI * 2;
          const distance = spread * (0.35 + particle.depth * 0.75);
          particle.x = particle.targetX + Math.cos(angle) * distance + (particle.depth - 0.5) * spread * 0.55;
          particle.y = particle.targetY + Math.sin(angle) * distance + (particle.seed - 0.5) * spread * 0.55;
        }

        particle.startX = particle.x;
        particle.startY = particle.y;
        particle.delay = reducedMotion ? 0 : particle.seed * stagger;
      });

      gatherStart = now;
      gathering = true;
    };

    const drawParticle = (particle: Particle): void => {
      const size = particle.size;
      ctx.fillStyle = particle.color;

      if (size <= 2.1) {
        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
        return;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const loopNeeded = (): boolean =>
      inView &&
      !document.hidden &&
      particles.length > 0 &&
      !reducedMotion &&
      (gathering || pointer.active || idleDrift > 0);

    const stopLoop = (): void => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const paintFrame = (now: number): void => {
      ctx.clearRect(0, 0, width, height);

      if (glow && !reducedMotion) {
        ctx.shadowBlur = particleSize * 3;
      } else {
        ctx.shadowBlur = 0;
      }

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;

      let complete = true;
      const follow = reducedMotion ? 1 : 0.22;
      const repel = pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0;
      const radiusSq = repelRadius * repelRadius;
      const driftTime = now * 0.001;
      const count = particles.length;

      for (let i = 0; i < count; i++) {
        const particle = particles[i];
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const local = (now - gatherStart - particle.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion && idleDrift > 0) {
          baseX += Math.sin(driftTime * 0.9 + particle.seed * 10) * idleDrift * particle.depth;
          baseY += Math.cos(driftTime * 0.75 + particle.depth * 10) * idleDrift * particle.depth;
        }

        if (repel) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < radiusSq) {
            const distance = Math.sqrt(distSq);
            const force = (1 - distance / repelRadius) ** 2 * pointerRepel;
            baseX += (dx / distance) * force;
            baseY += (dy / distance) * force;
          }
        }

        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;

        ctx.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);
        if (glow && !reducedMotion) ctx.shadowColor = particle.color;
        drawParticle(particle);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (gathering && complete) {
        gathering = false;
      }
    };

    const render = (now: number): void => {
      animationFrame = null;
      if (!inView || document.hidden || particles.length === 0) return;

      const busy = gathering || pointer.active;
      if (!reducedMotion && !busy && now - lastFrame < 33) {
        if (loopNeeded()) animationFrame = window.requestAnimationFrame(render);
        return;
      }

      lastFrame = now;
      paintFrame(now);

      if (loopNeeded()) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const ensureRenderLoop = (): void => {
      if (animationFrame === null && loopNeeded()) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const sampleText = async (): Promise<void> => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      const layoutW = Math.floor(rect.width);
      const layoutH = Math.floor(rect.height);

      if (layoutW <= 0 || layoutH <= 0) return;

      const margin = reducedMotion
        ? 0
        : Math.ceil(scatter + Math.max(pointerRepel, 0));
      width = layoutW + margin * 2;
      height = layoutH + margin * 2;

      dpr = Math.min(window.devicePixelRatio || 1, coarse || saveData ? 1 : 1.25);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.left = `${-margin}px`;
      canvas.style.top = `${-margin}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const computed = window.getComputedStyle(container);
      const resolvedFamily = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;
      let resolvedSize = resolveFontSize(fontSize, container, fontWeight, resolvedFamily);
      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;

      await waitForFonts(font);
      if (currentBuild !== buildId) return;

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const content = String(text || ' ');
      const maxTextWidth = layoutW * 0.92;
      offCtx.font = font;
      let metrics = offCtx.measureText(content);
      const measuredWidth = Math.max(1, metrics.width);
      if (measuredWidth > maxTextWidth) {
        resolvedSize = Math.max(18, resolvedSize * (maxTextWidth / measuredWidth));
        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;
        await waitForFonts(font);
        if (currentBuild !== buildId) return;
        offCtx.font = font;
        metrics = offCtx.measureText(content);
      }

      const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
      const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);
      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || resolvedSize * 0.78);
      const descent = Math.ceil(metrics.actualBoundingBoxDescent || resolvedSize * 0.22);
      const padding = Math.max(12, Math.ceil(resolvedSize * 0.08));
      const textWidth = Math.max(1, left + right);
      const textHeight = Math.max(1, ascent + descent);

      offscreen.width = textWidth + padding * 2;
      offscreen.height = textHeight + padding * 2;
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.font = font;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillStyle = '#ffffff';
      offCtx.fillText(content, padding - left, padding + ascent);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const targets: Target[] = [];
      const step = Math.max(2, Math.floor(density));
      const originX =
        margin + (align === "left" ? 0 : layoutW / 2 - offscreen.width / 2);
      const originY = margin + layoutH / 2 - offscreen.height / 2;

      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const alpha = imageData.data[(y * offscreen.width + x) * 4 + 3];
          if (alpha > 40) {
            targets.push({
              x: originX + x,
              y: originY + y,
              alpha: alpha / 255
            });
          }
        }
      }

      const budget = coarse || saveData ? 640 : 1280;
      const maxParticles = Math.max(
        280,
        Math.min(budget, Math.floor((width * height) / 160)),
      );
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      const baseRgb = hexToRgb(color);
      const highlightRgb = hexToRgb(highlightColor);
      const highlightBRgb = highlightColorB ? hexToRgb(highlightColorB) : null;
      const selected = targets.filter((_, index) => index % stride === 0);
      const textW = Math.max(1, offscreen.width);
      const textH = Math.max(1, offscreen.height);

      particles = selected.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        const nx = (target.x - originX) / textW;
        const ny = (target.y - originY) / textH;
        let particleColor = color;
        if (highlightRgb && highlightBRgb) {
          const mix = clamp(nx * 0.38 + ny * 0.42 + (seed - 0.5) * 0.36, 0, 1);
          particleColor = rgbToCss(mixRgb(highlightRgb, highlightBRgb, mix));
        } else if (baseRgb && highlightRgb) {
          const blend = clamp(nx + (seed - 0.5) * 0.35, 0, 1);
          particleColor = rgbToCss(mixRgb(baseRgb, highlightRgb, blend));
        }
        const angle = seed * Math.PI * 2;
        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);
        const startX = target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45;
        const startY = target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45;

        return {
          x: reducedMotion ? target.x : startX,
          y: reducedMotion ? target.y : startY,
          startX,
          startY,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.6, particleSize * (0.75 + target.alpha * 0.45)),
          color: particleColor,
          seed,
          depth,
          delay: seed * stagger
        };
      });

      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.smoothX = pointer.x;
      pointer.smoothY = pointer.y;
      syncCanvasRect();

      if (reducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
          particle.delay = 0;
        }
        gathering = false;
        paintFrame(performance.now());
        stopLoop();
        return;
      }

      startGather(false);
      ensureRenderLoop();
    };

    const queueSample = (): void => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(sampleText);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      pointer.x = event.clientX - canvasLeft;
      pointer.y = event.clientY - canvasTop;
      const inside =
        pointer.x >= 0 &&
        pointer.x <= width &&
        pointer.y >= 0 &&
        pointer.y <= height;
      const wasActive = pointer.active;
      pointer.active = inside;
      if (trigger === "hover" && inside && !wasActive) startGather(true);
      if (inside) ensureRenderLoop();
    };

    const handlePointerLeaveWindow = (): void => {
      pointer.active = false;
    };

    const handleClick = (event: PointerEvent): void => {
      if (trigger !== "click") return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x >= 0 && x <= width && y >= 0 && y <= height) startGather(true);
    };

    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleReduceMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;
      void sampleText();
    };

    const handleVisibility = (): void => {
      if (document.hidden) stopLoop();
      else ensureRenderLoop();
    };

    reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("scroll", syncCanvasRect, { passive: true });
    if (!reducedMotion) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerdown", handleClick);
      window.addEventListener("pointerleave", handlePointerLeaveWindow);
    }

    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(container);
    const viewObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (inView) ensureRenderLoop();
        else stopLoop();
      },
      { rootMargin: "80px" },
    );
    viewObserver.observe(container);
    void sampleText();

    return () => {
      buildId += 1;
      resizeObserver.disconnect();
      viewObserver.disconnect();
      reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("scroll", syncCanvasRect);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handleClick);
      window.removeEventListener("pointerleave", handlePointerLeaveWindow);

      stopLoop();
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    highlightColorB,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    trigger,
    fontSize,
    fontWeight,
    fontFamily,
    glow,
    align,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative block h-full min-h-[240px] w-full touch-none overflow-visible",
        className,
      )}
      style={style}
      aria-label={text}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute block"
        aria-hidden="true"
      />
      <span className="sr-only">{text}</span>
    </div>
  );
};

export { ParticleText };
export default ParticleText;
