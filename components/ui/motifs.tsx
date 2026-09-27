// Фирменные мотивы: подкова и силуэт лошади одной линией. Цвет берут из currentColor.

export const HORSESHOE_PATH =
  "M18 56 C10 46 8 32 12.5 21.5 C17 12 24 7.5 32 7.5 C40 7.5 47 12 51.5 21.5 C56 32 54 46 46 56";

export const HORSESHOE_NAILS: [number, number][] = [
  [11.2, 38],
  [13.2, 26],
  [21, 14],
  [43, 14],
  [50.8, 26],
  [52.8, 38],
];

export function Horseshoe({
  size = 18,
  className,
  nailColor,
}: {
  size?: number;
  className?: string;
  // Цвет фона под подковой: гвоздевые отверстия рисуем им. Без него подкова без отверстий.
  nailColor?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className={className}>
      <path
        d={HORSESHOE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {nailColor && (
        <g fill={nailColor}>
          {HORSESHOE_NAILS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" />
          ))}
        </g>
      )}
    </svg>
  );
}

// Лошадь в галопе, один непрерывный контур. viewBox 240×150, смотрит вправо.
export const HORSE_PATH =
  "M6 70 C14 66 22 62 30 56 C36 52 42 50 50 50 C74 46 104 54 134 45 C146 41 152 31 160 19 C164 13 170 8 176 6 L178 0 L182 7 C190 10 198 18 206 30 L216 44 C219 49 214 54 208 51 L196 46 C188 44 182 46 176 52 C170 60 168 68 166 76 C176 80 190 84 202 86 L222 96 L218 102 L198 94 C188 92 176 92 164 90 C160 98 162 108 170 118 L180 128 L174 132 L160 120 C152 110 150 100 150 95 C132 99 112 99 94 95 C92 106 98 118 110 130 L118 140 L112 144 L100 134 C88 124 82 112 80 101 C70 110 52 120 32 128 L22 132 L20 125 L30 121 C46 114 58 104 62 92 C62 76 56 62 48 54";

export function HorseLine({
  className,
  strokeWidth = 2.4,
  flip = false,
}: {
  className?: string;
  strokeWidth?: number;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 -4 240 152"
      aria-hidden
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d={HORSE_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
