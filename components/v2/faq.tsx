"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqV2 } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  const reduce = useReducedMotionSafe();
  return (
    <li className="border-b border-gold/50">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-5 py-5 text-left md:py-6"
        >
          <span
            className={`prata text-[1.25rem] leading-[1.2] transition-colors md:text-[1.6rem] ${
              open ? "text-wine" : "text-ink group-hover:text-wine"
            }`}
          >
            {q}
          </span>
          {/* «+» поворачивается на 45° и становится «×» */}
          <span
            aria-hidden
            className={`relative mt-1.5 grid size-7 shrink-0 place-items-center rounded-full border border-gold text-wine transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? "rotate-45" : ""
            }`}
          >
            <span className="absolute h-px w-3 bg-current" />
            <span className="absolute h-3 w-px bg-current" />
          </span>
        </button>
      </h3>
      {/* Высота меняется сразу, текст проявляется (анимируем только opacity и transform) */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="max-w-[60ch] pb-6 pr-10 text-[0.98rem] leading-relaxed text-ink-soft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/*
  Вопросы: только то, чего нет в других блоках (faqV2). Аккордеон, разделители — золотые линии.
*/
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-labelledby="faq-title" className="tex bg-ivory py-12 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <p className="v2-eyebrow text-wine-soft">Вопросы</p>
          <h2
            id="faq-title"
            className="prata mt-5 text-[2.8rem] leading-[1] text-wine md:text-[4.6rem] lg:text-[4.4rem]"
          >
            Коротко <span className="script whitespace-nowrap text-[1.15em] text-wine-soft">о важном</span>
          </h2>
        </Reveal>
        <ul className="border-t border-gold/50 lg:col-span-8">
          {faqV2.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
