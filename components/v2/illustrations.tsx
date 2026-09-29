"use client";

import { createContext, useContext, useState } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/components/ui/hooks";

/*
  Простые линейные рисунки v2 (веточка, подкова, гирлянда, кольца): тонкая линия, скруглённые концы,
  цвет — currentColor. Главная графика страницы — фото в дуотоне (duotone.tsx), рисунки только
  как орнамент. Рисуются линией при появлении в экране (DrawOnView): pathLength 0 → 1 со сдвигом
  между штрихами. При reduced-motion — сразу нарисованы.
*/

const EASE = [0.65, 0, 0.35, 1] as const;

type DrawCtx = { duration: number; reduce: boolean };
const DrawContext = createContext<DrawCtx>({ duration: 1.1, reduce: false });

// opacity штриха (вспомогательные линии: земля, сучки, соломинки) — целевое значение анимации:
// атрибут opacity не сработал бы, его перебивает инлайн-стиль motion
const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: ({ duration, reduce, opacity = 1 }: DrawCtx & { opacity?: number }) => ({
    pathLength: 1,
    opacity,
    transition: reduce
      ? { duration: 0 }
      : { pathLength: { duration, ease: EASE }, opacity: { duration: 0.05 } },
  }),
};

// Штрихи. Анимируется только stroke (pathLength) и прозрачность.
type PathProps = Omit<React.SVGProps<SVGPathElement>, "ref" | keyof React.DOMAttributes<SVGPathElement>>;
export function P({ opacity, ...props }: PathProps) {
  const ctx = useContext(DrawContext);
  return (
    <motion.path {...(props as object)} custom={{ ...ctx, opacity: opacity == null ? 1 : Number(opacity) }} variants={lineVariants} />
  );
}
type CircleProps = Omit<React.SVGProps<SVGCircleElement>, "ref" | keyof React.DOMAttributes<SVGCircleElement>>;
export function C({ opacity, ...props }: CircleProps) {
  const ctx = useContext(DrawContext);
  return (
    <motion.circle {...(props as object)} custom={{ ...ctx, opacity: opacity == null ? 1 : Number(opacity) }} variants={lineVariants} />
  );
}

// Интро-конверт (intro.tsx) держит флаг на <html> ~1,2 с: рисунки первого экрана ждут, пока он откроется
// Задержка не попадает в разметку (только в тайминг анимации), поэтому читаем флаг сразу:
// на сервере 0, на клиенте — по флагу, без расхождения при гидратации
function useIntroDelay(afterIntro: boolean) {
  const [delay] = useState(() =>
    afterIntro && typeof document !== "undefined" && document.documentElement.dataset.v2Intro === "on" ? 0.85 : 0,
  );
  return delay;
}

export function DrawOnView({
  viewBox,
  children,
  className,
  strokeWidth = 1.5,
  duration = 1.1,
  stagger = 0.09,
  delay = 0,
  afterIntro = false,
  label,
}: {
  viewBox: string;
  children: React.ReactNode;
  className?: string;
  strokeWidth?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  // Рисунок первого экрана: начать после интро-конверта
  afterIntro?: boolean;
  // Подпись для скринридера; без неё рисунок декоративный
  label?: string;
}) {
  const reduce = useReducedMotionSafe();
  const introDelay = useIntroDelay(afterIntro);
  const svgVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduce ? {} : { staggerChildren: stagger, delayChildren: delay + introDelay },
    },
  };
  return (
    <DrawContext.Provider value={{ duration, reduce }}>
      <motion.svg
        viewBox={viewBox}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        // Начальное состояние одинаковое на сервере и клиенте; при reduced-motion рисунок
        // появляется целиком, как только попадает в экран
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={svgVariants}
      >
        {children}
      </motion.svg>
    </DrawContext.Provider>
  );
}

type IllProps = {
  className?: string;
  strokeWidth?: number;
  delay?: number;
  afterIntro?: boolean;
  label?: string;
};

/* ---------------- Подкова ---------------- */
export function HorseshoeIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="0 0 64 64" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <P d="M16 58C7 47 5 32 10.5 20C15.5 9.5 23 4.5 32 4.5C41 4.5 48.5 9.5 53.5 20C59 32 57 47 48 58L40 56C47 47 48.5 34 45 25C41.5 16.5 37 13 32 13C27 13 22.5 16.5 19 25C15.5 34 17 47 24 56Z" />
      {[
        [13.5, 40],
        [15.5, 28],
        [22.5, 16.5],
        [41.5, 16.5],
        [48.5, 28],
        [50.5, 40],
      ].map(([cx, cy]) => (
        <C key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.2" />
      ))}
    </DrawOnView>
  );
}

/* ---------------- Кольца ---------------- */
export function RingsIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="4 2 72 62" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <C cx="30" cy="40" r="17" />
      <C cx="50" cy="40" r="17" />
      <P d="M26 23L30 17L34 23L30 26Z" />
      <P d="M30 13V10M23 16L21 14M37 16L39 14" opacity={0.7} />
    </DrawOnView>
  );
}

/* ---------------- Гирлянда лампочек ---------------- */
// Лампочки стоят на кривой провода: точки считаем по формуле кубической кривой Безье
const WIRE = { p0: [4, 10], p1: [60, 44], p2: [140, 44], p3: [196, 10] } as const;
function bezier(t: number) {
  const { p0, p1, p2, p3 } = WIRE;
  const u = 1 - t;
  const f = (i: 0 | 1) => u ** 3 * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t ** 3 * p3[i];
  return [f(0), f(1)] as const;
}
const BULBS = [0.14, 0.3, 0.5, 0.7, 0.86].map((t) => bezier(t));

export function GarlandParts() {
  return (
    <>
      <P d={`M${WIRE.p0} C${WIRE.p1} ${WIRE.p2} ${WIRE.p3}`} />
      {BULBS.map(([x, y]) => {
        const cx = Math.round(x * 10) / 10;
        const cy = Math.round(y * 10) / 10;
        return (
          <g key={cx}>
            <P d={`M${cx} ${cy}V${cy + 4}`} />
            <P
              d={`M${cx - 2.5} ${cy + 4}H${cx + 2.5}L${cx + 3.5} ${cy + 8}C${cx + 6} ${cy + 11} ${cx + 5} ${cy + 17} ${cx} ${cy + 17}C${cx - 5} ${cy + 17} ${cx - 6} ${cy + 11} ${cx - 3.5} ${cy + 8}Z`}
            />
          </g>
        );
      })}
    </>
  );
}

// compact — для иконок: середина гирлянды крупнее
export function GarlandIll({ className, strokeWidth, delay, afterIntro, label, compact = false }: IllProps & { compact?: boolean }) {
  return (
    <DrawOnView viewBox={compact ? "36 14 128 48" : "0 4 200 60"} {...{ className, strokeWidth, delay, afterIntro, label }}>
      <GarlandParts />
    </DrawOnView>
  );
}

/* ---------------- Веточка ---------------- */
// Горизонтальная, для разделителей: стебель и листья по очереди сверху и снизу
function leaf(x: number, y: number, up: boolean, size = 9) {
  const s = up ? -1 : 1;
  return `M${x} ${y}C${x + size * 0.3} ${y + s * size * 0.9} ${x + size} ${y + s * size * 1.1} ${x + size * 1.5} ${y + s * size * 0.9}C${x + size * 1.1} ${y + s * size * 0.2} ${x + size * 0.5} ${y} ${x} ${y}Z`;
}

export function SprigIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  const leaves = [
    [18, 19.6, true],
    [30, 20.3, false],
    [42, 19.8, true],
    [54, 20.2, false],
    [66, 19.9, true],
    [78, 20.1, false],
  ] as const;
  return (
    <DrawOnView viewBox="0 4 120 32" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <P d="M8 20C30 18 60 22 104 19" />
      {leaves.map(([x, y, up]) => (
        <P key={x} d={leaf(x, y, up)} />
      ))}
      <P d={leaf(96, 19.4, true, 7)} />
      <C cx="108" cy="18.6" r="2" />
    </DrawOnView>
  );
}
