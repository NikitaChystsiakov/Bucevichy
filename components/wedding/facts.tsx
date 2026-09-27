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
      {prefix && <span className="text-[0.55em] italic text-ink-soft">{prefix}</span>}
      <span ref={ref}>{format(value, decimals)}</span>
      {suffix && <span className="text-[0.55em]">{suffix}</span>}
    </span>
  );
}

export function Facts() {
  return (
    <section aria-label="Усадьба в цифрах" className="bg-bone pb-24 md:pb-32">
      <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-5 gap-y-10 border-t border-ink/15 px-5 pt-10 md:grid-cols-3 md:px-8 lg:grid-cols-6 lg:gap-x-8">
        {facts.map((f, i) => (
          <Reveal as="li" key={f.label} delay={i * 0.06} className="flex flex-col gap-2">
            <span className="display text-[2.6rem] leading-none text-ink md:text-[3.2rem]">
              <Counter value={f.value} prefix={f.prefix} suffix={f.suffix} />
            </span>
            <span className="max-w-[18ch] text-sm leading-snug text-ink-soft">{f.label}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
