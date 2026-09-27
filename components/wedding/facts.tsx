"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { facts } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";

function format(n: number, decimals: number) {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: n >= 10000,
  });
}

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const decimals = Number.isInteger(value) ? 0 : 1;
  // Год не «накручиваем» с нуля, а докручиваем последние годы
  const from = value > 1900 ? value - 12 : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(from, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = format(v, decimals)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, from, decimals]);

  return (
    <span className="tabular-nums">
      {prefix && <span className="font-display text-[0.55em] italic text-linen/60">{prefix}</span>}
      <span ref={ref}>{format(value, decimals)}</span>
      {suffix && <span className="text-[0.5em] text-linen/80">{suffix}</span>}
    </span>
  );
}

// Усадьба в цифрах — под карточками «Почему здесь»
export function Facts() {
  return (
    <section aria-label="Усадьба в цифрах" className="bg-forest-deep pb-24 pt-8 md:pb-36 md:pt-16">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <span aria-hidden className="stitch block text-brass" />
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {facts.map((f, i) => (
            <Reveal
              as="li"
              key={f.label}
              delay={i * 0.06}
              className="flex flex-col gap-3 border-dashed border-linen/15 py-8 pr-4 max-md:nth-[n+3]:border-t md:max-lg:nth-[n+4]:border-t lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="text-[2.7rem] font-extralight leading-none tracking-[-0.04em] text-brass md:text-[3.3rem]">
                <Counter value={f.value} prefix={f.prefix} suffix={f.suffix} />
              </span>
              <span className="max-w-[18ch] text-[0.88rem] leading-snug text-linen/65">{f.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
