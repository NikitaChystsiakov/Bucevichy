"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { photos } from "@/lib/photos";
import { useBooking } from "@/components/site/booking-provider";
import { SplitWords } from "@/components/ui/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openBooking } = useBooking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-pine-950 text-mist"
    >
      {/* TODO(фото): нужен свадебный кадр для первого экрана (вечер под гирляндами с гостями) */}
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: imgY }}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.2, ease: EASE }}
        >
          <Image
            src={photos.chaletEvening.src}
            alt={photos.chaletEvening.alt}
            fill
            preload
            sizes="100vw"
            className="photo-grade object-cover object-[58%_50%]"
          />
        </motion.div>
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(13_22_17/0.55)_0%,rgb(13_22_17/0.05)_28%,rgb(13_22_17/0.2)_50%,rgb(13_22_17/0.92)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_100%,rgb(13_22_17/0.7),transparent_60%)]"
        aria-hidden
      />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-[1400px] px-5 pb-12 pt-32 md:px-8 md:pb-20"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="mb-5 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-amber-soft"
        >
          Свадьбы в стиле кантри и рустик
        </motion.p>

        <h1 className="display max-w-[15ch] text-[2.9rem] leading-[1.02] sm:text-[3.6rem] md:max-w-[20ch] md:text-[4.4rem] lg:max-w-[25ch] lg:text-[5.2rem]">
          <SplitWords
            text="Свадьба в самой необычной усадьбе под Минском"
            emphasis={["необычной"]}
            emphasisClass="italic text-amber-soft"
            delay={0.35}
            animateOnMount
          />
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: EASE }}
          className="mt-6 flex flex-col gap-8 md:mt-8 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-[38ch] text-[1.02rem] leading-relaxed text-mist/85 md:text-[1.12rem]">
            Хутор среди холмистых полей в 23 км от Минска. Лошади, светлый зал с окнами в пол и
            ночлег для гостей.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => openBooking()} className="btn btn-amber group">
              Узнать свободную дату
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <a href="#stoimost" className="btn btn-ghost-light">
              Смотреть цены
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
