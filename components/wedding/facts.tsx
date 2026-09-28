"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { facts } from "@/lib/wedding";
import { useBooking } from "@/components/site/booking-provider";
import { Reveal } from "@/components/ui/motion";
import { Magnetic } from "@/components/ui/magnetic";

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

// Раздел 7: «Здесь вас ждут бескрайние живописные поля…»
const MOOD =
  "Здесь вас ждут бескрайние живописные поля, глубокое синее небо, душистый запах сена, ощущение ласкающего ветра в волосах и тёплого дыхания лошади.";

// Вступление (раздел 7) и усадьба в цифрах одной строкой. На телефоне строка листается вбок
export function Intro() {
  const { openBooking } = useBooking();
  return (
    <section aria-labelledby="intro-title" className="bg-forest-deep py-16 text-linen md:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 md:px-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <h2
            id="intro-title"
            className="display text-[2.3rem] leading-[1.02] [text-wrap:balance] md:text-[3.8rem] lg:text-[4.4rem]"
          >
            Хороших мест для свадьбы много. <em className="text-brass">Таких, как наше,</em> нет.
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="self-end lg:col-span-4 lg:col-start-9">
          <p className="text-[1rem] leading-relaxed text-linen/75 md:text-[1.05rem]">{MOOD}</p>
          <Magnetic className="mt-6 inline-flex">
            <button
              type="button"
              onClick={() => openBooking({ topic: "visit" })}
              className="btn btn-outline group text-linen"
            >
              Приехать посмотреть
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </Magnetic>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 max-w-[1440px] md:mt-16 md:px-8">
        <span aria-hidden className="stitch mx-4 block text-brass md:mx-0" />
        <ul
          aria-label="Усадьба в цифрах"
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6"
        >
          {facts.map((f, i) => (
            <Reveal
              as="li"
              key={f.label}
              delay={i * 0.05}
              y={12}
              className="flex w-[40vw] shrink-0 snap-start flex-col gap-2 border-l border-dashed border-linen/15 py-6 pl-4 pr-3 first:border-l-0 first:pl-0 md:w-auto md:py-8 md:pl-6 md:max-lg:nth-[3n+1]:border-l-0 md:max-lg:nth-[3n+1]:pl-0"
            >
              <span className="text-[2.1rem] font-extralight leading-none tracking-[-0.04em] text-brass md:text-[3rem]">
                <Counter value={f.value} prefix={f.prefix} suffix={f.suffix} />
              </span>
              <span className="max-w-[18ch] text-[0.84rem] leading-snug text-linen/70">{f.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
