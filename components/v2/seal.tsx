import { HORSESHOE_NAILS, HORSESHOE_PATH } from "@/components/ui/motifs";

// Неровный край сургуча: окружность с детерминированной «волной» (без Math.random в рендере)
function waxEdge(cx: number, cy: number, r: number) {
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const wobble = 1 + 0.045 * Math.sin(i * 2.7) + 0.03 * Math.cos(i * 5.3);
    return [cx + Math.cos(a) * r * wobble, cy + Math.sin(a) * r * wobble] as const;
  });
  // Сглаживаем ломаную квадратичными кривыми через середины отрезков
  const mid = (p: readonly [number, number], q: readonly [number, number]) =>
    [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] as const;
  const f = (v: number) => Math.round(v * 10) / 10;
  let d = `M${f(mid(pts[n - 1], pts[0])[0])} ${f(mid(pts[n - 1], pts[0])[1])}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(m[0])} ${f(m[1])}`;
  }
  return d + "Z";
}

const EDGE = waxEdge(60, 60, 54);

/*
  Сургучная печать с подковой: вино с бликом, выдавленное кольцо и подкова в рельефе
  (светлая кромка сверху-слева, тёмная снизу-справа). viewBox 120×120.
*/
export function WaxSeal({ className = "", id = "seal" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#a4485a" />
          <stop offset="0.45" stopColor="#6e2533" />
          <stop offset="1" stopColor="#3f1219" />
        </radialGradient>
        <radialGradient id={`${id}-shine`} cx="34%" cy="26%" r="30%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Тень под печатью */}
      <path d={EDGE} fill="#231d1a" opacity="0.25" transform="translate(1.5 3)" />
      <path d={EDGE} fill={`url(#${id}-wax)`} />
      {/* Выдавленное кольцо оттиска */}
      <circle cx="60" cy="60" r="39" fill="none" stroke="#3f1219" strokeWidth="2.2" opacity="0.7" />
      <circle cx="60" cy="60.9" r="39" fill="none" stroke="#c46a7b" strokeWidth="0.9" opacity="0.55" />
      {/* Подкова в рельефе: тёмный след, светлая кромка, тело */}
      <g transform="translate(60 61) scale(0.78) translate(-32 -32)" fill="none" strokeLinecap="round">
        <path d={HORSESHOE_PATH} stroke="#35101a" strokeWidth="8.5" transform="translate(1 1.4)" opacity="0.8" />
        <path d={HORSESHOE_PATH} stroke="#b7566a" strokeWidth="8.5" transform="translate(-0.6 -0.8)" opacity="0.7" />
        <path d={HORSESHOE_PATH} stroke="#7a2a3a" strokeWidth="7" />
        {HORSESHOE_NAILS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.3" fill="#3f1219" />
        ))}
      </g>
      <path d={EDGE} fill={`url(#${id}-shine)`} />
    </svg>
  );
}

/*
  Круглый штамп «в подарок» — как оттиск резиновой печати: двойное кольцо, текст по кругу,
  в центре «в подарок» рукописным. Цвет — currentColor. viewBox 140×140.
*/
// id — для пути текста по кругу: у каждого штампа на странице свой
export function GiftStamp({
  className = "",
  text,
  id = "gift-stamp",
}: {
  className?: string;
  text: string;
  id?: string;
}) {
  return (
    <svg viewBox="0 0 140 140" className={className} role="img" aria-label={`В подарок: ${text}`}>
      <defs>
        <path id={`${id}-circle`} d="M70 70m-51 0a51 51 0 1 1 102 0a51 51 0 1 1 -102 0" />
      </defs>
      <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="70" cy="70" r="61" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="70" cy="70" r="40" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <text
        fill="currentColor"
        fontSize="9.4"
        fontWeight="700"
        letterSpacing="2.1"
        style={{ fontFamily: "var(--ff-commissioner), sans-serif", textTransform: "uppercase" }}
      >
        <textPath href={`#${id}-circle`} startOffset="0">
          {text}
        </textPath>
      </text>
      <text
        x="70"
        y="68"
        textAnchor="middle"
        fill="currentColor"
        fontSize="19"
        style={{ fontFamily: "var(--ff-marck), cursive" }}
      >
        в подарок
      </text>
      <path d="M56 80H84" stroke="currentColor" strokeWidth="0.9" />
      <path d="M70 76.5L73.5 80L70 83.5L66.5 80Z" fill="currentColor" />
    </svg>
  );
}
