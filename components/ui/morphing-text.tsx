"use client";

import { useCallback, useEffect, useId, useRef } from "react";

import { cn } from "@/lib/utils";

const morphTime = 1.4;
const cooldownTime = 1.1;

const useMorphingText = (texts: readonly string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      const safe = Math.max(fraction, 0.0001);
      const inverted = Math.max(1 - fraction, 0.0001);

      current2.style.filter = `blur(${Math.min(4 / safe - 4, 8)}px)`;
      current2.style.opacity = `${Math.pow(safe, 0.4) * 100}%`;

      current1.style.filter = `blur(${Math.min(4 / inverted - 4, 8)}px)`;
      current1.style.opacity = `${Math.pow(inverted, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current += 1;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    let animationFrameId = 0;
    let cooling = false;
    let last = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) {
        last = now;
        return;
      }

      const dt = (now - last) / 1000;
      last = now;
      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) {
        cooling = false;
        doMorph();
        return;
      }

      if (!cooling) {
        cooling = true;
        doCooldown();
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref };
};

interface MorphingTextProps {
  className?: string;
  texts: readonly string[];
}

const Texts: React.FC<Pick<MorphingTextProps, "texts">> = ({ texts }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts);
  return (
    <>
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {texts.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <span
        className="col-start-1 row-start-1 whitespace-nowrap"
        ref={text1Ref}
      >
        {texts[0]}
      </span>
      <span
        className="col-start-1 row-start-1 whitespace-nowrap"
        ref={text2Ref}
        style={{ opacity: 0 }}
      >
        {texts[1]}
      </span>
    </>
  );
};

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
}) => {
  const filterId = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "relative mx-auto grid h-auto w-max max-w-none overflow-visible text-center font-sans text-[40pt] leading-none font-bold lg:text-[6rem]",
        className,
      )}
      style={{ filter: `url(#${filterId}) blur(0.35px)` }}
    >
      <Texts texts={texts} />
      <svg className="pointer-events-none absolute h-0 w-0 overflow-visible">
        <defs>
          <filter
            id={filterId}
            x="-100%"
            y="-150%"
            width="215%"
            height="400%"
            filterUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 18 -7"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
