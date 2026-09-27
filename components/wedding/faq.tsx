"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "@phosphor-icons/react";
import { faq } from "@/lib/wedding";
import { contacts } from "@/lib/site";
import { Reveal } from "@/components/ui/motion";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="faq-title" className="bg-pine-950 py-24 text-mist md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 id="faq-title" className="display text-[2.6rem] leading-[1.03] md:text-[3.6rem]">
            Частые вопросы
          </h2>
          <p className="mt-5 max-w-[34ch] leading-relaxed text-mist-soft">
            Не нашли ответ? Позвоните:{" "}
            <a href={contacts.phoneMain.href} className="link-underline whitespace-nowrap text-mist">
              {contacts.phoneMain.display}
            </a>
          </p>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-mist/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-[1.1rem] transition-colors hover:text-amber-soft md:text-[1.25rem]"
                  >
                    {item.q}
                    <Plus
                      size={20}
                      className={`shrink-0 text-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h3>
                {/* Ответы всегда в DOM: их видят поисковики, даже когда пункт свёрнут */}
                <motion.div
                  id={`faq-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                  inert={!isOpen}
                >
                  <p className="max-w-[60ch] pb-7 leading-relaxed text-mist-soft">{item.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
