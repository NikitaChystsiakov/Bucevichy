"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { heroMedia } from "@/lib/media";
import { useBooking } from "@/components/site/booking-provider";
import { LazyVideo } from "@/components/ui/lazy-video";
import { Magnetic } from "@/components/ui/magnetic";
import { useFinePointer, useReducedMotionSafe, useScrollTransform } from "@/components/ui/hooks";

const TITLE = ["Невеста", "приезжает", "верхом"];
const ACCENT = "верхом";
// Сквозной номер первой буквы каждого слова — для задержки анимации
const OFFSETS = TITLE.map((_, i) => TITLE.slice(0, i).join("").length);

// Заголовок по буквам: каждая буква выезжает из-под маски своего слова.
// Анимация на CSS (.hero-letter в globals.css): текст виден в серверном HTML даже без JS,
// ждёт шторку прелоадера и выключается при prefers-reduced-motion.
function SplitTitle() {
  return (
    <h1 className="display text-[clamp(3.3rem,15vw,5.4rem)] font-light [text-shadow:0_2px_30px_rgb(20_28_23/0.45)] leading-[0.9] tracking-[-0.03em] lg:text-[clamp(5.5rem,8.2vw,9.75rem)]">
      <span className="sr-only">{TITLE.join(" ")}</span>
      <span aria-hidden className="block">
        {TITLE.map((word, wi) => {
          const accent = word === ACCENT;
          return (
            <span
              key={word}
              className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${
                accent ? "pl-[0.9em] pr-[0.12em] italic text-brass" : ""
              } ${wi === 1 ? "lg:pl-[0.35em]" : ""}`}
            >
              {Array.from(word).map((ch, ci) => {
                const i = OFFSETS[wi] + ci;
                return (
                  <span
                    key={i}
                    className="hero-letter inline-block"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </h1>
  );
}

function HeroMedia() {
  if (heroMedia.kind === "video") {
    return <LazyVideo video={heroMedia} cap={false} ratio={false} className="absolute inset-0" />;
  }
  return (
    <Image
      src={heroMedia.src}
      alt={heroMedia.alt}
      fill
      preload
      loading="eager"
      fetchPriority="high"
      sizes="(min-width: 1024px) 40vw, 100vw"
      className="photo-grade object-cover"
    />
  );
}

// Параллакс слоя от курсора: k — глубина в пикселях
function useLayer(m: MotionValue<number>, k: number) {
  return useTransform(m, (v) => v * k);
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const fine = useFinePointer();
  const { openBooking } = useBooking();

  // Скролл: заголовок уходит вверх, арка слегка увеличивается
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const titleOpacity = useScrollTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // Курсор: -0.5…0.5 по каждой оси, с пружиной
  const mx = useSpring(0, { stiffness: 50, damping: 18 });
  const my = useSpring(0, { stiffness: 50, damping: 18 });
  const bgX = useLayer(mx, -26);
  const bgY = useLayer(my, -18);
  const archX = useLayer(mx, 16);
  const archY = useLayer(my, 12);
  const textX = useLayer(mx, -8);
  const hazeX = useLayer(mx, 40);
  const parallax = fine && !reduce;

  // Появление на CSS (.hero-fade + задержка --d): видно без JS, см. комментарий к SplitTitle
  const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

  return (
    <section
      ref={ref}
      aria-label="Свадьба в конной усадьбе «Буцевичи»"
      onPointerMove={
        parallax
          ? (e) => {
              mx.set(e.clientX / window.innerWidth - 0.5);
              my.set(e.clientY / window.innerHeight - 0.5);
            }
          : undefined
      }
      className="relative isolate min-h-[100svh] overflow-hidden bg-forest-deep text-linen lg:min-h-[max(100svh,760px)]"
    >
      {/* Десктоп: то же фото фоном — сильный blur и затемнение */}
      <motion.div
        aria-hidden
        className="absolute -inset-[8%] -z-20 hidden lg:block"
        style={parallax ? { x: bgX, y: bgY } : undefined}
      >
        {heroMedia.kind === "photo" && (
          <Image
            src={heroMedia.src}
            alt=""
            fill
            // Размытый фон на десктопе — самая большая картинка экрана (LCP), грузим сразу
            loading="eager"
            sizes="25vw"
            className="scale-110 object-cover blur-2xl brightness-[0.42] saturate-[0.85]"
          />
        )}
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_at_25%_50%,rgb(20_28_23/0.85),transparent_65%)] lg:block"
      />

      <div className="mx-auto grid min-h-[inherit] max-w-[1440px] px-4 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Медиа: на телефоне — весь экран, на десктопе — арка справа */}
        <motion.div
          className="absolute inset-0 -z-10 lg:relative lg:inset-auto lg:z-0 lg:order-2 lg:col-span-5 lg:col-start-8 lg:aspect-[3/4] lg:h-[min(74svh,780px)] lg:justify-self-end"
          style={parallax ? { x: archX, y: archY } : undefined}
        >
          <div
            aria-hidden
            className="arch pointer-events-none absolute -inset-3.5 hidden border border-dashed border-brass/55 lg:block"
          />
          <motion.div
            className="relative h-full w-full overflow-hidden bg-forest lg:arch"
            style={reduce ? undefined : { scale: mediaScale }}
          >
            {/* TODO(фото): нужен свадебный кадр получше — невеста верхом; сейчас кадр из Instagram 1179×1907 */}
            <div className="ken-burns absolute inset-0">
              <HeroMedia />
            </div>
          </motion.div>
        </motion.div>

        {/* Телефон: затемнение сверху под шапку и снизу под заголовок */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(20_28_23/0.6)_0%,rgb(20_28_23/0.1)_16%,rgb(20_28_23/0.45)_38%,rgb(20_28_23/0.82)_58%,rgb(20_28_23/0.9)_78%,rgb(20_28_23)_100%)] lg:hidden"
        />

        <motion.div
          className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-[calc(2.25rem+env(safe-area-inset-bottom))] pt-28 lg:order-1 lg:col-span-7 lg:min-h-0 lg:justify-center lg:pb-10 lg:pt-28"
          style={reduce ? undefined : { y: titleY, opacity: titleOpacity }}
        >
          <motion.div style={parallax ? { x: textX } : undefined}>
            <p
              style={delay(0)}
              className="hero-fade eyebrow mb-6 flex items-center gap-3 text-brass"
            >
              <span className="h-px w-8 bg-brass" aria-hidden />
              Свадьба в стиле кантри и рустик
            </p>

            <SplitTitle />

            <p
              style={delay(0.7)}
              className="hero-fade mt-7 max-w-[34ch] text-[1.02rem] leading-relaxed text-linen/85 lg:mt-9 lg:max-w-[40ch] lg:text-[1.15rem]"
            >
              Свадьба в конной усадьбе в 23 км от Минска. Выезд невесты на регистрацию верхом и
              фотосессия с лошадьми для молодых —{" "}
              <em className="font-display text-[1.15em] italic text-brass">в подарок</em>.
            </p>

            <div
              style={delay(0.85)}
              className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-11"
            >
              <Magnetic>
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="btn btn-brass group w-full py-[1.1rem] sm:w-auto"
                >
                  Узнать свободную дату
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </Magnetic>
              <a href="#stoimost" className="btn btn-outline py-[1.1rem] text-linen">
                Смотреть цены
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Медленная дымка у нижнего края */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-[25%] bottom-0 h-[42%]"
        style={parallax ? { x: hazeX } : undefined}
      >
        <div className="haze absolute inset-0" />
        <div className="haze-2 absolute inset-0 opacity-70" />
      </motion.div>
    </section>
  );
}
