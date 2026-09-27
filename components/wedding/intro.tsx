"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { photos } from "@/lib/photos";
import { useBooking } from "@/components/site/booking-provider";
import { Reveal, RevealImage, SplitWords } from "@/components/ui/motion";

// Раздел 7: «Здесь вас ждут бескрайние живописные поля…»
const MOOD =
  "Здесь вас ждут бескрайние живописные поля, глубокое синее небо, душистый запах сена, ощущение ласкающего ветра в волосах и тёплого дыхания лошади.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}

function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  if (reduce) return <p className="text-ink">{text}</p>;
  return (
    <p ref={ref}>
      {words.map((w, i) => (
        <Word
          key={i}
          word={w}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        />
      ))}
    </p>
  );
}

export function Intro() {
  const { openBooking } = useBooking();
  return (
    <section aria-labelledby="intro-title" className="bg-bone py-24 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2
            id="intro-title"
            className="display max-w-[18ch] text-[2.3rem] leading-[1.05] text-ink md:text-[3.4rem]"
          >
            <SplitWords text="Хороших мест для свадьбы много. Таких, как наше, нет." />
          </h2>

          <div className="mt-10 text-[1.3rem] leading-[1.45] text-ink md:mt-14 md:text-[1.75rem]">
            <ScrollText text={MOOD} />
          </div>

          <Reveal className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
            <p className="max-w-[52ch] leading-relaxed text-ink-soft">
              Приглашаем приехать в усадьбу и увидеть площадку вживую, ощутить свободу и
              умиротворение бескрайних просторов вокруг. Ну или просто погладить тёплые мягкие носы
              наших лошадок.
            </p>
            <button
              type="button"
              onClick={() => openBooking({ topic: "visit" })}
              className="btn btn-ghost-dark group w-fit"
            >
              Приехать посмотреть
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <RevealImage
            photo={photos.horseMuzzle}
            shape="arch"
            parallax={6}
            sizes="(min-width: 1024px) 30vw, 90vw"
            className="mx-auto aspect-[3/4] w-full max-w-[420px] lg:mt-24"
            imgClassName="object-[62%_50%]"
          />
          <Reveal delay={0.2} className="mx-auto mt-4 max-w-[420px] text-sm text-ink-soft">
            Конный клуб с 2002 года. Здесь, в Буцевичах, с 2007-го.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
