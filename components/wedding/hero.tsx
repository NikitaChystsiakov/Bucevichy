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
import { ArrowDown, ArrowRight, Gift } from "@phosphor-icons/react";
import { heroInset, heroMedia } from "@/lib/media";
import { venueDays } from "@/lib/wedding";
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
      // Единственная картинка страницы с preload: это LCP первого экрана
      preload
      fetchPriority="high"
      sizes="(min-width: 1024px) 40vw, 100vw"
      // Телефон: кадр прижат вправо — пара слева, справа над ней арка-вставка
      className="photo-grade object-cover max-lg:object-[88%_50%]"
    />
  );
}

// Минимальная цена площадки (раздел 7): пн-чт, июнь-сентябрь
const MIN_VENUE = Math.min(...venueDays.map((d) => d.price)).toLocaleString("ru-RU");

// Арка-вставка с роликом 06: невеста с лошадьми. Телефон ~180×240 справа вверху (на низких экранах
// меньше) — крепится к секции; десктоп ~260×340 у левого нижнего края большой арки — крепится к арке.
// Скрытый вариант (display: none) ролик не грузит: LazyVideo ждёт пересечения с экраном
function Inset({ desktop = false, style }: { desktop?: boolean; style: React.CSSProperties }) {
  return (
    <figure
      style={style}
      className={`hero-fade absolute z-10 ${
        desktop
          ? "-left-[150px] bottom-[7%] w-[260px] max-lg:hidden"
          : "right-4 top-[calc(72px+2svh)] w-[min(180px,21svh)] md:right-8 lg:hidden"
      }`}
    >
      <div className={`relative ${desktop ? "aspect-[13/17]" : "aspect-[3/4]"}`}>
        <div aria-hidden className="arch pointer-events-none absolute -inset-2 border border-dashed border-brass/70" />
        <LazyVideo
          video={heroInset}
          cap={false}
          ratio={false}
          className="arch absolute inset-0 shadow-[0_24px_50px_-18px_rgb(0_0_0/0.8)]"
        />
      </div>
      <figcaption className="relative -mt-5 flex justify-center">
        <span
          className={`flex items-center gap-1.5 rounded-full bg-brass py-1.5 font-semibold leading-tight text-forest-deep shadow-[0_8px_20px_-8px_rgb(0_0_0/0.6)] ${
            desktop ? "px-4 text-[0.82rem]" : "px-3 text-[0.72rem]"
          }`}
        >
          <Gift size={14} weight="fill" className="shrink-0" />
          {desktop ? (
            <span className="whitespace-nowrap">Выезд невесты верхом — в подарок</span>
          ) : (
            <span className="whitespace-nowrap">
              Выезд невесты
              <br />
              верхом — в подарок
            </span>
          )}
        </span>
      </figcaption>
    </figure>
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
            // Только на десктопе (на телефоне блок скрыт, и ленивая картинка не качается).
            // Под сильным blur хватает маленькой версии
            sizes="(min-width: 1024px) 25vw, 1px"
            className="scale-110 object-cover blur-2xl brightness-[0.42] saturate-[0.85]"
          />
        )}
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_at_25%_50%,rgb(20_28_23/0.85),transparent_65%)] lg:block"
      />

      <div className="mx-auto grid min-h-[inherit] max-w-[1440px] px-4 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Медиа: на телефоне — весь экран, сдвинут вверх на 30%, чтобы пара (нижняя треть кадра)
            оказалась над текстом; на десктопе — арка справа */}
        <motion.div
          className="absolute inset-0 -z-10 max-lg:-translate-y-[30%] lg:relative lg:inset-auto lg:z-0 lg:order-2 lg:col-span-5 lg:col-start-8 lg:aspect-[3/4] lg:h-[min(74svh,780px)] lg:justify-self-end"
          style={parallax ? { x: archX, y: archY } : undefined}
        >
          <Inset desktop style={delay(0.7)} />
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

        {/* Телефон: затемнение сверху под шапку, окно без затемнения над парой, снизу — под текст.
            Фото сдвинуто вверх и кончается на 70% высоты: ниже только тёмный фон */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(20_28_23/0.6)_0%,rgb(20_28_23/0.05)_14%,rgb(20_28_23/0.05)_34%,rgb(20_28_23/0.55)_46%,rgb(20_28_23/0.88)_58%,rgb(20_28_23)_70%)] lg:hidden"
        />
        <Inset style={delay(0.7)} />

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

            {/* Подзаголовок не ждёт шторку и не прозрачный в начале (только подъём, .hero-rise):
                это самый крупный текст первого экрана, по нему считается LCP. Фото на весь экран
                Chrome в LCP не учитывает, а буквы заголовка появляются только после шторки */}
            <p
              className="hero-rise mt-7 max-w-[34ch] text-[1.02rem] leading-relaxed text-linen/85 lg:mt-9 lg:max-w-[40ch] lg:text-[1.15rem]"
            >
              Конная усадьба в 23 км от Минска. Фотосессия с лошадьми для молодых —{" "}
              <em className="whitespace-nowrap font-display text-[1.15em] italic text-brass">в подарок</em>.
            </p>

            <div
              style={delay(0.85)}
              className="hero-fade mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 lg:mt-11"
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
              <a
                href="#stoimost"
                className="group flex items-center justify-center gap-2 text-[0.98rem] text-linen/90 transition-colors hover:text-brass sm:justify-start"
              >
                <span className="link-underline">
                  Площадка от <span className="tabular-nums text-linen">{MIN_VENUE}</span> руб
                </span>
                <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
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
