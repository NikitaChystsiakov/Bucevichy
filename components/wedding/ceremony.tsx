"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { ceremony } from "@/lib/wedding";
import { instaPhotos, videos } from "@/lib/media";
import { LazyVideo } from "@/components/ui/lazy-video";
import { useReducedMotionSafe, useScrollTransform } from "@/components/ui/hooks";

/*
  «Регистрация на лугу»: фото 18 раскрывается из маленькой арки до широкого кадра по скроллу.
  Секция ~200svh, сцена sticky. Маска считается в пикселях (радиус арки = половина её ширины),
  поэтому размеры сцены держим в motion-значениях и обновляем через ResizeObserver.
*/

const PHOTO = instaPhotos.ceremonyMeadow;
// Раскрытие заканчивается на 65% прокрутки секции, дальше кадр стоит и читается текст
const OPEN_END = 0.65;
// Фото 1152×819: шире 1560px растяжение с учётом увеличения превысило бы ×1,5 — дальше поля
const PHOTO_MAX_W = 1560;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function archClip(progress: number, w: number, h: number) {
  const t = easeInOut(clamp01(progress / OPEN_END));
  const desktop = w >= 1024;
  const archW = desktop ? Math.min(360, w * 0.28) : Math.min(w * 0.6, 260);
  // Старт: узкая арка под заголовком. Финиш: на телефоне кадр во весь экран, на десктопе — с полями
  const top = lerp(h * (desktop ? 0.34 : 0.37), desktop ? h * 0.04 : 0, t);
  const bottom = lerp(h * (desktop ? 0.08 : 0.1), desktop ? h * 0.04 : 0, t);
  const side = lerp((w - archW) / 2, desktop ? Math.max(w * 0.025, (w - PHOTO_MAX_W) / 2) : 0, t);
  const endR = desktop ? 20 : 0;
  const rTop = lerp(archW / 2, endR, t);
  const rBottom = lerp(0, endR, t);
  return `inset(${top}px ${side}px ${bottom}px ${side}px round ${rTop}px ${rTop}px ${rBottom}px ${rBottom}px)`;
}

// Лепестки: позиция, размер, скорость, покачивание. Задержки отрицательные — уже в полёте
const PETALS = [
  { x: 6, s: 9, dur: 15, delay: -2, sway: 40 },
  { x: 14, s: 12, dur: 18, delay: -11, sway: -30 },
  { x: 23, s: 8, dur: 13, delay: -6, sway: 26 },
  { x: 34, s: 11, dur: 17, delay: -14, sway: -44 },
  { x: 45, s: 7, dur: 12, delay: -3, sway: 34 },
  { x: 55, s: 10, dur: 16, delay: -9, sway: -24 },
  { x: 64, s: 13, dur: 19, delay: -16, sway: 50 },
  { x: 73, s: 8, dur: 14, delay: -5, sway: -36 },
  { x: 82, s: 11, dur: 17, delay: -12, sway: 28 },
  { x: 91, s: 9, dur: 15, delay: -8, sway: -40 },
];

function Petals({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden max-md:[&>*:nth-child(2n)]:hidden"
    >
      {PETALS.map((p) => (
        <span
          key={p.x}
          className="petal"
          style={
            {
              "--x": `${p.x}%`,
              "--s": `${p.s}px`,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
              "--sway": `${p.sway}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </motion.div>
  );
}

// Заголовок рисуется дважды (тёмный на льне и светлый на фото); id — только у видимого для чтения
function Title({ light = false, withId = false }: { light?: boolean; withId?: boolean }) {
  return (
    <div className={`text-center ${light ? "text-linen" : "text-forest-deep"}`}>
      <p className={`eyebrow ${light ? "text-linen/85" : "text-saddle"}`}>Церемония</p>
      <h2
        id={withId ? "ceremony-title" : undefined}
        className="display mt-4 text-[2.9rem] leading-[0.98] [text-wrap:balance] md:text-[4.6rem] lg:text-[5.6rem]"
        style={
          light
            ? { textShadow: "0 1px 2px rgb(20 28 23 / 0.55), 0 4px 28px rgb(20 28 23 / 0.7)" }
            : undefined
        }
      >
        {/* На фото курсив льняной, а не латунный: латунь на небе и белой ткани арки не читается */}
        Регистрация <em className={light ? "text-linen" : "text-saddle"}>на лугу</em>
      </h2>
    </div>
  );
}

function PhotoImage() {
  return (
    <Image
      src={PHOTO.src}
      alt={PHOTO.alt}
      fill
      sizes="(min-width: 1560px) 1560px, 100vw"
      className="photo-grade object-cover object-[48%_50%]"
    />
  );
}

const SHADE =
  "absolute inset-0 bg-[linear-gradient(180deg,rgb(20_28_23/0.82)_0%,rgb(20_28_23/0.5)_24%,rgb(20_28_23/0.12)_42%,rgb(20_28_23/0.25)_55%,rgb(20_28_23/0.92)_88%)]";

// Видео 17 (первые 2 с), текст и три пункта
function Details() {
  return (
    <div className="mx-auto grid max-w-[1320px] gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
      <figure className="w-[40%] max-w-[300px] lg:order-2 lg:col-span-3 lg:col-start-10 lg:w-full lg:justify-self-end">
        <LazyVideo
          video={videos.ceremonyArchShort}
          className="w-full rounded-[14px] border border-linen/25 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.6)]"
        />
        <figcaption className="mt-2 text-[0.78rem] leading-snug text-linen/70 max-md:hidden">
          Арка и тюки сена для гостей
        </figcaption>
      </figure>

      <div className="lg:col-span-8">
        <p className="max-w-[46ch] text-[0.98rem] leading-relaxed text-linen/85 [@media(max-height:700px)]:hidden md:text-[1.08rem]">
          {ceremony.lead}
        </p>
        <ul className="mt-4 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-6">
          {ceremony.points.map((pt, i) => (
            <li key={pt.title} className="flex gap-3 md:block">
              <span className="mt-0.5 shrink-0 text-[0.8rem] font-semibold tabular-nums text-brass md:mb-3 md:block">
                0{i + 1}
              </span>
              <span className="block">
                <span className="display block text-[1.45rem] leading-[1.05] md:text-[1.9rem]">
                  {pt.title}
                </span>
                <span className="mt-1 block text-[0.88rem] leading-snug text-linen/70">{pt.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Снизу на телефоне и планшете — место под плавающую панель «Узнать свободную дату»
const DETAILS_WRAP =
  "absolute inset-x-0 bottom-0 z-30 px-4 pb-24 text-linen md:px-10 md:pb-28 lg:px-[5vw] lg:pb-32";
const TITLE_WRAP = "absolute inset-x-0 top-[11svh] px-4 lg:top-[10svh]";

// Без анимаций (prefers-reduced-motion): сразу широкий кадр с текстом, без sticky
function CeremonyStatic() {
  return (
    <div className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="absolute inset-0 bg-forest">
        <div className="absolute inset-y-0 left-1/2 w-full max-w-[1560px] -translate-x-1/2">
          <div className="absolute inset-0 origin-bottom scale-[1.18] lg:scale-[1.08]">
            <PhotoImage />
          </div>
        </div>
        <div aria-hidden className={SHADE} />
      </div>
      <div className={`${TITLE_WRAP} z-30`}>
        <Title light withId />
      </div>
      <div className={DETAILS_WRAP}>
        <Details />
      </div>
    </div>
  );
}

function CeremonyScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Размер сцены. До замера — телефон 390×844: так выглядит и серверный HTML
  const w = useMotionValue(390);
  const h = useMotionValue(844);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      w.set(entry.contentRect.width);
      h.set(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const clipPath = useTransform([scrollYProgress, w, h], ([p, cw, ch]: number[]) => archClip(p, cw, ch));
  // Увеличение от нижнего края прячет белый стикер вверху кадра. На десктопе кадр и так
  // обрезан сверху (object-cover по ширине), поэтому хватает меньшего увеличения — фото резче
  const photoScale = useTransform([scrollYProgress, w], ([p, cw]: number[]) =>
    lerp(cw >= 1024 ? 1.15 : 1.3, cw >= 1024 ? 1.08 : 1.18, easeInOut(clamp01(p / OPEN_END))),
  );
  // Свадебная арка на фото — в верхней половине кадра. Пока окно-арка узкое и стоит ниже,
  // сдвигаем фото вниз, чтобы в окне была арка, а не трава; к концу раскрытия — на место
  const photoY = useTransform([scrollYProgress, w, h], ([p, cw, ch]: number[]) =>
    lerp(ch * (cw >= 1024 ? 0.4 : 0.34), 0, easeInOut(clamp01(p / OPEN_END))),
  );
  const shade = useScrollTransform(scrollYProgress, [OPEN_END * 0.5, OPEN_END], [0, 1]);
  const darkTitle = useScrollTransform(scrollYProgress, [OPEN_END * 0.45, OPEN_END * 0.8], [1, 0]);
  const lightTitle = useScrollTransform(scrollYProgress, [OPEN_END * 0.55, OPEN_END * 0.9], [0, 1]);
  const details = useScrollTransform(scrollYProgress, [OPEN_END * 0.85, OPEN_END + 0.08], [0, 1]);
  const detailsY = useScrollTransform(scrollYProgress, [OPEN_END * 0.85, OPEN_END + 0.08], [40, 0]);
  const petals = useScrollTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <div ref={trackRef} className="h-[200svh]">
      <div ref={stageRef} className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
        {/* Заголовок на льне: исчезает, когда кадр закрывает его */}
        <motion.div style={{ opacity: darkTitle }} className={`${TITLE_WRAP} z-0`}>
          <Title withId />
        </motion.div>

        {/* Фото в маске-арке */}
        <motion.div className="absolute inset-0 z-10 bg-forest" style={{ clipPath }}>
          {/* Вверху кадра белый стикер из Instagram: увеличиваем от нижнего края, чтобы он ушёл */}
          <div className="absolute inset-y-0 left-1/2 w-full max-w-[1560px] -translate-x-1/2">
            <motion.div className="absolute inset-0 origin-bottom" style={{ scale: photoScale, y: photoY }}>
              <PhotoImage />
            </motion.div>
          </div>
          <motion.div aria-hidden style={{ opacity: shade }} className={SHADE} />
        </motion.div>

        <Petals opacity={petals} />

        {/* Тот же заголовок светлым — поверх раскрытого кадра */}
        <motion.div
          aria-hidden
          style={{ opacity: lightTitle }}
          className={`${TITLE_WRAP} pointer-events-none z-30`}
        >
          <Title light />
        </motion.div>

        <motion.div style={{ opacity: details, y: detailsY }} className={DETAILS_WRAP}>
          <Details />
        </motion.div>
      </div>
    </div>
  );
}

export function Ceremony() {
  // Две разные разметки, а не условные стили: при переключении элементы монтируются заново,
  // и на них не остаются маска и прозрачность от серверного HTML
  const reduce = useReducedMotionSafe();
  return (
    <section id="ceremonia" aria-labelledby="ceremony-title" className="bg-linen">
      {reduce ? <CeremonyStatic /> : <CeremonyScroll />}
    </section>
  );
}
