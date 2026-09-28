"use client";

import { createContext, useContext, useState } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/components/ui/hooks";

/*
  Монолинейные иллюстрации v2: тонкая линия, скруглённые концы, цвет — currentColor.
  Стиль — упрощённая гравюра/иконка. Каждая рисуется линией при появлении в экране (DrawOnView):
  pathLength 0 → 1 со сдвигом между штрихами. При reduced-motion — сразу нарисованы.
*/

const EASE = [0.65, 0, 0.35, 1] as const;

type DrawCtx = { duration: number; reduce: boolean };
const DrawContext = createContext<DrawCtx>({ duration: 1.1, reduce: false });

const lineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: ({ duration, reduce }: DrawCtx) => ({
    pathLength: 1,
    opacity: 1,
    transition: reduce
      ? { duration: 0 }
      : { pathLength: { duration, ease: EASE }, opacity: { duration: 0.05 } },
  }),
};

// Штрихи. Анимируется только stroke (pathLength) и прозрачность.
type PathProps = Omit<React.SVGProps<SVGPathElement>, "ref" | keyof React.DOMAttributes<SVGPathElement>>;
export function P(props: PathProps) {
  const ctx = useContext(DrawContext);
  return <motion.path {...(props as object)} custom={ctx} variants={lineVariants} />;
}
type CircleProps = Omit<React.SVGProps<SVGCircleElement>, "ref" | keyof React.DOMAttributes<SVGCircleElement>>;
export function C(props: CircleProps) {
  const ctx = useContext(DrawContext);
  return <motion.circle {...(props as object)} custom={ctx} variants={lineVariants} />;
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

/* ---------------- Лошадь в профиль (смотрит вправо) ---------------- */
// Контур корпуса с ближними ногами, дальние ноги отдельно, грива, хвост, глаз и ноздря.
// viewBox 200×150, земля y=144. Пропорции: голова ≈ 0,45 длины корпуса, нога ≈ глубине корпуса.
export function HorseParts() {
  return (
    <>
      {/* Круп, спина, шея, голова, грудь, ближняя передняя, живот, ближняя задняя */}
      <P d="M50 50C54 46 58 44 64 44C74 45 84 50 94 50C104 50 112 45 118 42C128 28 140 14 150 14L150 4L156 12C164 20 172 32 178 42C181 47 179 52 174 52C170 52 166 50 163 47C157 48 151 46 148 40C145 50 143 60 144 70C145 80 143 88 136 93C136 101 135 109 135 115C136 117 136 119 135 121L134 132C134 134 135 135 136 136L138 140L140 144L130 144L130 140L128 136L127 132L127 121C126 119 126 117 127 115L124 96C110 98 92 98 80 92C78 100 72 106 68 112L66 116L66 132L67 136L69 140L71 144L61 144L61 140L59 136L58 132L58 121L56 116C54 112 52 106 50 98C47 90 44 80 44 70C44 62 46 55 50 50Z" />
      {/* Дальние ноги: передняя — за ближней, задняя — впереди ближней */}
      <P d="M122 97C121 105 120 111 120 116L120 132L121 136L123 140L124 144L114 144L114 140L113 136L113 121L113 116C113 108 114 102 115 98" />
      <P d="M82 94C81 102 79 108 78 114L78 132L79 136L81 140L82 144L72 144L72 140L71 136L71 120" />
      {/* Хвост */}
      <P d="M50 51C40 54 34 66 34 82C34 96 38 108 44 116" />
      <P d="M48 54C42 62 39 74 40 88C41 98 43 105 46 110" />
      {/* Грива фестонами над гребнем и чёлка */}
      <P d="M150 11C146 10 142 11 139 13C139 16 137 18 134 18C134 21 132 23 129 24C129 27 127 29 124 30C124 33 122 36 119 38" />
      <P d="M154 12C157 16 158 20 157 24" />
      {/* Глаз, ноздря, скула */}
      <C cx="161" cy="25" r="1.3" />
      <P d="M175 44C176.5 45 177 46.5 176.5 48" />
      <P d="M156 42C153 36 155 30 160 28" opacity={0.7} />
    </>
  );
}

export function HorseIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="26 2 164 146" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <HorseParts />
      <P d="M28 144H188" opacity={0.6} />
    </DrawOnView>
  );
}

/* ---------------- Арка из сосновых брёвен с тканью ---------------- */
// viewBox 160×180, земля y=172. Проём между столбами: x 38…122.
export function ArchParts() {
  return (
    <>
      {/* Столбы-брёвна */}
      <P d="M30 32V172M38 32V172" />
      <P d="M122 32V172M130 32V172" />
      {/* Перекладина с торцами */}
      <P d="M16 22H144M16 31H144" />
      <P d="M16 22C13 22 11.5 24 11.5 26.5C11.5 29 13 31 16 31C19 31 20.5 29 20.5 26.5C20.5 24 19 22 16 22Z" />
      <P d="M144 22C141 22 139.5 24 139.5 26.5C139.5 29 141 31 144 31C147 31 148.5 29 148.5 26.5C148.5 24 147 22 144 22Z" />
      {/* Кольца на торцах и сучки на брёвнах */}
      <C cx="16" cy="26.5" r="1.4" />
      <C cx="144" cy="26.5" r="1.4" />
      <P d="M34 70V78M34 122V128M126 96V104M126 146V150" opacity={0.7} />
      {/* Ткань: две волны между столбами и хвосты снаружи */}
      <P d="M38 33C56 64 104 64 122 33" />
      <P d="M40 33C60 52 100 52 120 33" />
      <P d="M30 32C22 54 28 80 21 108L29 105C33 82 28 56 36 33" />
      <P d="M130 32C138 54 132 80 139 108L131 105C127 82 132 56 124 33" />
      {/* Два листика в центре перекладины */}
      <P d="M80 21C76 19 72.5 15 72 10.5C76.5 11.5 79.5 15.5 80 21Z" />
      <P d="M80 21C84 19 87.5 15 88 10.5C83.5 11.5 80.5 15.5 80 21Z" />
      {/* Земля */}
      <P d="M4 172H156" opacity={0.6} />
    </>
  );
}

export function ArchIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="0 0 160 180" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <ArchParts />
    </DrawOnView>
  );
}

/* ---------------- Тюк сена ---------------- */
// viewBox 120×80, земля y=74
export function HayParts() {
  return (
    <>
      <P d="M10 30H84V74H10Z" />
      <P d="M10 30L28 15H102L84 30M84 74L102 59V15" />
      {/* Шпагат */}
      <P d="M34 30V74M60 30V74M34 30L52 15M60 30L78 15" />
      {/* Соломинки */}
      <P d="M17 44L23 42M42 58L49 56M67 46L74 44M45 22L52 20" opacity={0.6} />
    </>
  );
}

export function HayBaleIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="4 8 104 72" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <HayParts />
    </DrawOnView>
  );
}

/* ---------------- Зал с окнами в пол ---------------- */
export function HallIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  const windows = [34, 62, 90, 118, 146];
  return (
    <DrawOnView viewBox="0 6 200 110" {...{ className, strokeWidth, delay, afterIntro, label }}>
      {/* Крыша и стены */}
      <P d="M10 54L100 16L190 54" />
      <P d="M22 49V108M178 49V108" />
      {/* Окна в пол с переплётом */}
      {windows.map((x) => (
        <P key={x} d={`M${x} 108V62H${x + 20}V108M${x + 10} 62V108M${x} 72H${x + 20}`} />
      ))}
      {/* Слуховое окно в щипце */}
      <C cx="100" cy="36" r="6" />
      {/* Земля */}
      <P d="M4 108H196" opacity={0.6} />
    </DrawOnView>
  );
}

/* ---------------- Домик-сруб ---------------- */
export function HouseIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  const logs = [62, 70, 78, 86, 94, 102];
  return (
    <DrawOnView viewBox="4 6 132 110" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <P d="M12 56L70 16L128 56" />
      <P d="M94 32V22H104V39" />
      <P d="M98 16C96 12 100 10 98 6" opacity={0.7} />
      <P d="M24 52V108M116 52V108" />
      {/* Брёвна с торцами */}
      {logs.map((y) => (
        <P key={y} d={`M20 ${y}H24M116 ${y}H120`} />
      ))}
      <P d="M24 62H56M84 62H116M24 86H56M84 86H116" opacity={0.55} />
      {/* Дверь и окно */}
      <P d="M60 108V74H80V108" />
      <P d="M32 68H50V84H32ZM41 68V84M32 76H50" />
      <P d="M90 68H108V84H90ZM99 68V84M90 76H108" />
      <P d="M8 108H132" opacity={0.6} />
    </DrawOnView>
  );
}

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

export function GarlandIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="0 4 200 60" {...{ className, strokeWidth, delay, afterIntro, label }}>
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

/* ---------------- Бокалы (сбор гостей и фуршет) ---------------- */
export function GlassesIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  const flute = "M-6 0H6L5 20C4.5 25 -4.5 25 -5 20ZM0 24.5V40M-6 40H6M-5.4 8H5.4";
  return (
    <DrawOnView viewBox="0 0 64 64" {...{ className, strokeWidth, delay, afterIntro, label }}>
      {/* Бокалы касаются краями, ножки расходятся */}
      <g transform="translate(26.5 14) rotate(12)">
        <P d={flute} />
      </g>
      <g transform="translate(37.5 14) rotate(-12)">
        <P d={flute} />
      </g>
      <P d="M32 9V4M26 10L23 7M38 10L41 7" opacity={0.7} />
    </DrawOnView>
  );
}

/* ---------------- Фотоаппарат (фотосессия) ---------------- */
export function CameraIll({ className, strokeWidth, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="0 0 64 64" {...{ className, strokeWidth, delay, afterIntro, label }}>
      <P d="M11 22H53C55.5 22 57 23.5 57 26V48C57 50.5 55.5 52 53 52H11C8.5 52 7 50.5 7 48V26C7 23.5 8.5 22 11 22Z" />
      <P d="M22 22L26 15H38L42 22" />
      <C cx="32" cy="37" r="10" />
      <C cx="32" cy="37" r="5" />
      <P d="M13 28H18" />
    </DrawOnView>
  );
}

/* ---------------- Сцена первого экрана: арка, тюки, лошадь ---------------- */
// viewBox 400×200, земля y=182. Арка сдвинута на (60, 10): проём между столбами — x 98…182.
// Медальон-фото в проёме ставит hero.tsx (ARCH_OPENING там — при изменении сцены поправить и его).

export function HeroScene({ className, delay, afterIntro, label }: IllProps) {
  return (
    <DrawOnView viewBox="0 0 400 200" stagger={0.05} {...{ className, delay, afterIntro, label }}>
      <g transform="translate(60 10)">
        <ArchParts />
      </g>
      {/* Тюк сена слева от арки (два тюка друг на друге пересекались линиями) */}
      <g transform="translate(6 141.3) scale(0.55)">
        <HayParts />
      </g>
      <g transform="translate(393 59.6) scale(-0.85 0.85)">
        <HorseParts />
      </g>
      <P d="M2 182H398" opacity={0.6} />
      {/* Травинки */}
      <P d="M230 182C231 177 233 175 235 174M234 182C234 178 235 176 237 175M380 182C381 178 383 176 385 175M384 182C384 178 385 177 387 176" opacity={0.7} />
    </DrawOnView>
  );
}
