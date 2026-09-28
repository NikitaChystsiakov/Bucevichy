"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { dayProgram, type ProgramKey } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";
import { ArchIll, CameraIll, GarlandIll, GlassesIll, HallIll, HorseshoeIll } from "./illustrations";

// Иконки маленькие, поэтому линия толще в единицах viewBox — на экране она ~1,5 px
const icons: Record<ProgramKey, { Art: typeof ArchIll; stroke: number }> = {
  welcome: { Art: GlassesIll, stroke: 2.4 },
  ride: { Art: HorseshoeIll, stroke: 2.4 },
  ceremony: { Art: ArchIll, stroke: 4.6 },
  photo: { Art: CameraIll, stroke: 2.4 },
  banquet: { Art: HallIll, stroke: 5.4 },
  evening: { Art: GarlandIll, stroke: 5 },
};

// «Программа дня» — как программа в свадебном приглашении: без времени, с пометкой «примерный сценарий».
export function Program() {
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.15 });
  const reduce = useReducedMotionSafe();

  return (
    <section aria-labelledby="program-title" className="tex bg-paper px-3 py-14 md:px-8 md:py-24">
      <div className="invite-frame mx-auto max-w-[820px] text-terra">
        <div className="px-5 py-10 text-ink sm:px-10 md:px-16 md:py-16">
          <Reveal className="text-center">
            <p className="v2-eyebrow text-ink-soft">Один день в Буцевичах</p>
            <h2 id="program-title" className="prata mt-3 text-[2.1rem] md:text-[3.2rem]">
              Программа дня
            </h2>
            <p className="script mt-1 text-[1.5rem] text-terra-deep md:text-[1.8rem]">примерный сценарий</p>
          </Reveal>

          <ol ref={listRef} className="relative mx-auto mt-9 grid max-w-[560px] gap-7 md:mt-12 md:gap-9">
            {/* Пунктирная нить программы: прорастает сверху вниз (scaleY) */}
            <motion.span
              aria-hidden
              className="absolute bottom-7 left-[27px] top-7 w-px origin-top bg-[linear-gradient(to_bottom,currentColor_0_5px,transparent_5px_10px)] bg-[length:1px_10px] text-terra md:left-[31px]"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : undefined}
              transition={reduce ? { duration: 0 } : { duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            />
            {dayProgram.map((step, i) => {
              const { Art, stroke } = icons[step.key];
              return (
                <Reveal as="li" key={step.key} delay={0.1 + i * 0.12} y={16} className="relative flex gap-4 md:gap-6">
                  <span className="relative grid size-14 shrink-0 place-items-center rounded-full border border-terra/45 bg-paper text-ink md:size-16">
                    <Art className="size-9 md:size-10" strokeWidth={stroke} delay={0.2 + i * 0.12} />
                  </span>
                  <span className="grid gap-1 pt-1.5 md:pt-2">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="prata text-[1.2rem] leading-snug md:text-[1.45rem]">{step.title}</span>
                      {step.gift && (
                        <span className="script rounded-full bg-terra-soft px-2.5 text-[1.05rem] leading-snug text-ink">
                          в подарок
                        </span>
                      )}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-ink-soft">{step.text}</span>
                  </span>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
