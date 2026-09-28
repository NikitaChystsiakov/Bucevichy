"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, MoonStars, Sun } from "@phosphor-icons/react";
import {
  GUESTS_DEFAULT,
  GUESTS_MAX,
  GUESTS_MIN,
  HALL_SEATS,
  HALL_TABLE_SEATS,
  hall,
} from "@/lib/wedding";
import { instaPhotos } from "@/lib/media";
import type { Photo } from "@/lib/photos";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";

/*
  «Светлый зал 170 м²»: переключатель День / Вечер и схема зала сверху.
  Ползунок гостей расставляет столы и стулья-точки.
  TODO(зал): расстановка схематичная, не реальный план зала — запросить у клиента схему рассадки.
  TODO(вместимость): одна цифра на странице — MAX_GUESTS в lib/wedding.ts (раздел 7, «до 100 гостей»).
*/

type Mode = keyof typeof hall.modes;

const modePhoto: Record<Mode, Photo> = {
  day: instaPhotos.hallTable,
  // TODO(фото): зал вечером в гирляндах; пока — беседка «Wedding» у зала
  evening: instaPhotos.nightGazeboSign,
};

function plural(n: number, [one, few, many]: [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/* ---------- Схема зала ---------- */

// Зал ~17×10 м, 1 единица ≈ 5 см. Столы на 10 мест: по 5 стульев с каждой стороны
const VIEW = { w: 340, h: 210 };
const TABLE = { w: 50, h: 9 };
const COLS = [20, 82.5, 145, 207.5, 270];
const ROWS = [84, 146];
// Порядок появления столов: сначала передний ряд от центра к краям, потом задний
const FILL_ORDER = [2, 1, 3, 0, 4].flatMap((c) => [0, 1].map((r) => ({ c, r }))).sort((a, b) => a.r - b.r);

function chairPos(x: number, y: number, j: number) {
  // Чередуем стороны, чтобы неполный стол выглядел ровно
  const side = j % 2;
  const k = Math.floor(j / 2);
  return { cx: x + 5 + k * 10, cy: side ? y + TABLE.h + 5.5 : y - 5.5 };
}

function HallPlan({ guests }: { guests: number }) {
  const reduce = useReducedMotionSafe();
  const tables = Math.ceil(guests / HALL_TABLE_SEATS);
  const fit = { transformBox: "fill-box", transformOrigin: "center" } as const;

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="img"
      aria-label={`Схема зала: ${guests} ${plural(guests, ["гость", "гостя", "гостей"])} за ${tables} ${plural(tables, ["столом", "столами", "столами"])}`}
      className="h-auto w-full"
    >
      {/* Стены с проёмом входа внизу слева */}
      <path
        d={`M40 ${VIEW.h - 8} H8 V8 H${VIEW.w - 8} V${VIEW.h - 8} H70`}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      {/* Окна в пол в две стены */}
      <path
        d={`M26 8 H${VIEW.w - 26} M${VIEW.w - 8} 26 V${VIEW.h - 26}`}
        fill="none"
        stroke="var(--color-brass)"
        strokeWidth="4"
        strokeDasharray="24 6"
      />
      {/* Стол молодых */}
      <rect x={145} y={26} width={50} height={9} rx={2} fill="var(--color-saddle)" />
      <circle cx={162} cy={40.5} r={3.4} fill="var(--color-saddle)" />
      <circle cx={178} cy={40.5} r={3.4} fill="var(--color-saddle)" />

      <AnimatePresence initial={false}>
        {FILL_ORDER.slice(0, tables).map(({ c, r }, t) => {
          const x = COLS[c];
          const y = ROWS[r];
          const seats = Math.min(HALL_TABLE_SEATS, guests - t * HALL_TABLE_SEATS);
          return (
            <motion.g
              key={`${c}-${r}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
            >
              <motion.rect
                x={x}
                y={y}
                width={TABLE.w}
                height={TABLE.h}
                rx={2}
                fill="currentColor"
                fillOpacity="0.22"
                stroke="currentColor"
                strokeOpacity="0.5"
                style={fit}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
              <AnimatePresence initial={false}>
                {Array.from({ length: seats }, (_, j) => {
                  const p = chairPos(x, y, j);
                  return (
                    <motion.circle
                      key={j}
                      {...p}
                      r={3.2}
                      fill="var(--color-forest)"
                      style={fit}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 500, damping: 24, delay: 0.12 + j * 0.03 }
                      }
                    />
                  );
                })}
              </AnimatePresence>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}

/* ---------- Блок целиком ---------- */

export function Hall() {
  const [mode, setMode] = useState<Mode>("day");
  const [guests, setGuests] = useState(GUESTS_DEFAULT);
  const reduce = useReducedMotionSafe();
  const tables = Math.ceil(guests / HALL_TABLE_SEATS);
  const fill = ((guests - GUESTS_MIN) / (GUESTS_MAX - GUESTS_MIN)) * 100;

  return (
    <section id="zal" aria-labelledby="hall-title" className="bg-linen py-16 text-forest-deep md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <Reveal>
          <p className="eyebrow text-saddle">Зал</p>
          <h2
            id="hall-title"
            className="display mt-5 max-w-[12ch] text-[2.8rem] leading-[0.98] md:text-[4.6rem] lg:text-[5.6rem]"
          >
            Светлый зал <em className="text-saddle">170 м²</em>
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-10 md:mt-12 lg:grid-cols-12 lg:gap-10">
          {/* Фото: день / вечер */}
          <div className="lg:col-span-6">
            <div
              role="radiogroup"
              aria-label="Время суток"
              className="inline-flex rounded-full border border-forest-deep/15 p-1"
            >
              {(Object.keys(hall.modes) as Mode[]).map((m) => {
                const on = mode === m;
                const Icon = m === "day" ? Sun : MoonStars;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setMode(m)}
                    className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.92rem] transition-colors ${
                      on ? "text-linen" : "text-forest-deep/70 hover:text-forest-deep"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="hall-mode-pill"
                        className="absolute inset-0 rounded-full bg-forest-deep"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon size={16} weight={on ? "fill" : "regular"} className="relative" />
                    <span className="relative">{hall.modes[m].label}</span>
                  </button>
                );
              })}
            </div>

            <figure className="mt-5">
              <div className="relative aspect-square overflow-hidden bg-forest md:aspect-[4/3] lg:aspect-[4/5]">
                {(Object.keys(modePhoto) as Mode[]).map((m) => (
                  <motion.div
                    key={m}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      opacity: mode === m ? 1 : 0,
                      scale: mode === m ? 1 : 1.08,
                      filter: mode === m ? "blur(0px)" : "blur(6px)",
                    }}
                    transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={modePhoto[m].src}
                      alt={modePhoto[m].alt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      className="photo-grade object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <figcaption aria-live="polite" className="mt-3 text-[0.85rem] text-forest-deep/65">
                {hall.modes[mode].caption}
              </figcaption>
            </figure>
          </div>

          {/* Текст, схема и ползунок */}
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal as="p" className="max-w-[46ch] text-[1.05rem] leading-relaxed text-forest-deep/80">
              {hall.text}
            </Reveal>

            <Reveal delay={0.1} className="mt-8 rounded-[20px] border border-forest-deep/12 bg-forest-deep/[0.035] p-4 md:p-6">
              <div className="text-forest-deep">
                <HallPlan guests={guests} />
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.78rem] text-forest-deep/65">
                <li className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-5 rounded-full bg-brass" />
                  окна в пол
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden className="size-2 rounded-full bg-saddle" />
                  стол молодых
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden className="size-2 rounded-full bg-forest" />
                  гость
                </li>
                <li className="text-forest-deep/70">схема условная</li>
              </ul>

              <div className="mt-7 border-t border-dashed border-forest-deep/15 pt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor="hall-guests" className="text-[0.98rem]">
                    Сколько у вас гостей?
                  </label>
                  <span className="display text-[2.4rem] leading-none tabular-nums text-saddle">
                    {guests}
                  </span>
                </div>
                <input
                  id="hall-guests"
                  type="range"
                  min={GUESTS_MIN}
                  max={GUESTS_MAX}
                  step={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="range range-light mt-3"
                  style={{ "--fill": `${fill}%` } as React.CSSProperties}
                />
                <p className="mt-3 flex items-center gap-2 text-[0.92rem]">
                  <CheckCircle size={18} weight="fill" className="shrink-0 text-saddle" />
                  <span>
                    {guests <= HALL_SEATS ? "Все помещаются" : "Нужна дополнительная рассадка"}:{" "}
                    <span className="tabular-nums">
                      {tables} {plural(tables, ["стол", "стола", "столов"])} по {HALL_TABLE_SEATS} мест
                    </span>
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
