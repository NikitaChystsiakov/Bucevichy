"use client";

import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { Plus } from "@phosphor-icons/react";
import { faq } from "@/lib/wedding";
import { contacts } from "@/lib/site";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";

// Пружина раскрытия: чуть «перелетает» и возвращается
const SPRING = { type: "spring", stiffness: 420, damping: 26, mass: 0.8 } as const;

/*
  Аккордеон. Высоту не анимируем: ответ появляется сразу, а пункты ниже «съезжают» на новое
  место пружиной — layout-анимация motion (FLIP через transform). Сам ответ проявляется
  opacity/translate. Разделитель — верхняя граница каждого пункта, поэтому он едет вместе с ним.
  Ответы всегда в DOM (hidden): их видят поисковики, даже когда пункт свёрнут.
*/
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotionSafe();
  const layout = reduce ? false : ("position" as const);

  return (
    <section id="voprosy" aria-labelledby="faq-title" className="bg-linen py-24 text-forest-deep md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 md:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-saddle">Вопросы</p>
          <h2 id="faq-title" className="display mt-5 text-[2.8rem] leading-[0.98] md:text-[4rem]">
            Частые <em className="text-saddle">вопросы</em>
          </h2>
          <p className="mt-5 max-w-[34ch] leading-relaxed text-forest-deep/75">
            Не нашли ответ? Позвоните:{" "}
            <a href={contacts.phoneMain.href} className="link-underline whitespace-nowrap text-forest-deep">
              {contacts.phoneMain.display}
            </a>
          </p>
        </Reveal>

        <LayoutGroup>
          <div className="lg:col-span-7 lg:col-start-6">
            {faq.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={item.q}
                  layout={layout}
                  transition={SPRING}
                  className="border-t border-forest-deep/15"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left text-[1.1rem] font-medium transition-colors hover:text-saddle md:text-[1.25rem]"
                    >
                      {item.q}
                      <motion.span
                        aria-hidden
                        className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors ${
                          isOpen ? "border-saddle bg-saddle text-linen" : "border-forest-deep/20 text-saddle"
                        }`}
                        initial={false}
                        animate={{ rotate: isOpen ? 135 : 0 }}
                        transition={reduce ? { duration: 0 } : SPRING}
                      >
                        <Plus size={18} weight="bold" />
                      </motion.span>
                    </button>
                  </h3>
                  <div id={`faq-${i}`} hidden={!isOpen}>
                    <motion.p
                      initial={false}
                      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                      transition={reduce ? { duration: 0 } : { ...SPRING, opacity: { duration: 0.3 } }}
                      className="max-w-[60ch] pb-7 pr-12 leading-relaxed text-forest-deep/80"
                    >
                      {item.a}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
            <motion.div layout={layout} transition={SPRING} className="border-t border-forest-deep/15" />
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
