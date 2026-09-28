"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowsClockwise, Gift } from "@phosphor-icons/react";
import { addons, horseCards, horseCarousel, horseProgram, venueGifts, type HorseCardKey } from "@/lib/wedding";
import { photos, type Photo } from "@/lib/photos";
import { videos, type Video } from "@/lib/media";
import { LazyVideo } from "@/components/ui/lazy-video";
import { Reveal } from "@/components/ui/motion";
import { useFinePointer, useReducedMotionSafe } from "@/components/ui/hooks";

/*
  «Лошади — главные гости»: coverflow из карточек. Листается перетаскиванием, стрелками
  (кнопки и клавиатура) и кликом по боковой карточке. Клик по центральной — переворот: на обороте
  общий факт о лошадях и цитата из отзыва (клички к кадрам не привязываем — TODO(лошади) в
  lib/wedding.ts). С мышью центральная карточка наклоняется за курсором, по ней бежит блик.
  iOS Safari: у обеих сторон backface-visibility: hidden (и -webkit-), у родителей preserve-3d;
  на перевёрнутой карточке видео на паузе и скрыто — иначе в Safari оно просвечивает сквозь оборот.
*/

type CardMedia = { video: Video } | { photo: Photo; position?: string };

// Каждое фото и видео на странице один раз: ролик 06 — на первом экране, фото невесты верхом
// (riderPaint) — в «Одном дне», поэтому карточек «sunset» и «paint» в карусели нет (horseCarousel)
const cardMedia: Partial<Record<HorseCardKey, CardMedia>> = {
  paddock: { video: videos.horsesPaddock },
  portrait: { photo: photos.girlWithHorse },
  field: { video: videos.ridersField },
  forest: { photo: photos.whiteHorseForest, position: "object-[50%_40%]" },
  stable: { photo: photos.horseMuzzle, position: "object-[38%_50%]" },
};

const CARDS = horseCarousel.map((key) => ({
  ...horseCards.find((c) => c.key === key)!,
  media: cardMedia[key]!,
}));
const N = CARDS.length;
const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;
// Сдвиг соседней карточки в долях ширины карточки
const STEP = 0.68;

// Кратчайшее расстояние по кругу: карусель бесконечная
function offsetOf(i: number, active: number) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

function Face({ back = false, children, className = "" }: { back?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-[20px] ${className}`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        // Явный 3D-transform и у лицевой стороны: без него Safari иногда игнорирует backface-visibility
        transform: back ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      {children}
    </div>
  );
}

function Card({
  index,
  offset,
  jump,
  flipped,
  onSelect,
}: {
  index: number;
  offset: number;
  // Карточка перескакивает с одного края на другой — без анимации, иначе пролетит через центр
  jump: boolean;
  flipped: boolean;
  onSelect: () => void;
}) {
  const card = CARDS[index];
  const media = card.media;
  const reduce = useReducedMotionSafe();
  const fine = useFinePointer();
  const active = offset === 0;
  const dist = Math.abs(offset);
  const tiltOn = fine && !reduce && active && !flipped;
  const turned = flipped && active;

  // Наклон за мышью и блик
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const glare = useSpring(0, { stiffness: 200, damping: 30 });
  const glareX = useTransform(gx, (v) => `${v * 60}%`);
  const glareY = useTransform(gy, (v) => `${v * 60}%`);

  function resetTilt() {
    rx.set(0);
    ry.set(0);
    glare.set(0);
  }

  return (
    <motion.div
      className="relative w-[62vw] max-w-[340px] [grid-area:1/1] md:w-[300px] lg:w-[340px]"
      // Невидимая дальняя карточка не должна ловить клики
      style={{ zIndex: 10 - dist, transformStyle: "preserve-3d", pointerEvents: dist >= 3 ? "none" : undefined }}
      initial={false}
      animate={{
        x: `${offset * STEP * 100}%`,
        rotateY: Math.max(-50, Math.min(50, -offset * 34)),
        scale: 1 - Math.min(dist, 3) * 0.12,
        z: -dist * 90,
        opacity: dist >= 3 ? 0 : 1,
      }}
      transition={jump || reduce ? { duration: 0 } : SPRING}
    >
      <motion.button
        type="button"
        onClick={onSelect}
        tabIndex={active ? 0 : -1}
        data-horse-card={active ? "active" : "side"}
        aria-hidden={dist >= 3 ? true : undefined}
        aria-label={
          active
            ? flipped
              ? `${card.title}. ${card.text} Нажмите, чтобы вернуть фото`
              : `${card.caption}. Нажмите, чтобы перевернуть карточку`
            : `Показать карточку «${card.caption}»`
        }
        aria-pressed={active ? flipped : undefined}
        className="relative block aspect-[3/4.2] w-full cursor-pointer rounded-[20px] text-left focus-visible:outline-offset-4"
        style={{ transformStyle: "preserve-3d", rotateX: rx, rotateY: ry }}
        onPointerMove={
          tiltOn
            ? (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                rx.set(-py * 14);
                ry.set(px * 16);
                gx.set(px);
                gy.set(py);
                glare.set(1);
              }
            : undefined
        }
        onPointerLeave={tiltOn ? resetTilt : undefined}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ rotateY: turned ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 22 }}
        >
          {/* Лицевая сторона: ролик или фото */}
          <Face className="bg-forest-deep shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]">
            {"video" in media ? (
              // Перевёрнута: видео на паузе и скрыто (с задержкой — пока карточка не встанет ребром)
              <div
                className="absolute inset-0"
                style={{
                  opacity: turned ? 0 : 1,
                  visibility: turned ? "hidden" : "visible",
                  transition: turned ? "opacity 0s 0.18s, visibility 0s 0.18s" : "none",
                }}
              >
                <LazyVideo
                  video={media.video}
                  cap={false}
                  ratio={false}
                  active={!turned}
                  className="absolute inset-0"
                />
              </div>
            ) : (
              <Image
                src={media.photo.src}
                alt={media.photo.alt}
                fill
                sizes="(min-width: 1024px) 340px, (min-width: 768px) 300px, 62vw"
                className={`photo-grade object-cover ${media.position ?? ""}`}
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(20_28_23/0.85)_100%)]"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
              <span className="display text-[1.6rem] leading-none text-linen md:text-[1.9rem]">
                {card.caption}
              </span>
              <span
                aria-hidden
                className={`grid size-9 shrink-0 place-items-center rounded-full bg-brass text-forest-deep transition-opacity duration-300 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                <ArrowsClockwise size={16} weight="bold" />
              </span>
            </div>
            {/* Блик за курсором (только мышь) */}
            {tiltOn && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-1/2 mix-blend-soft-light"
                style={{
                  x: glareX,
                  y: glareY,
                  opacity: glare,
                  background:
                    "radial-gradient(circle at 50% 50%, rgb(255 248 230 / 0.75), rgb(255 248 230 / 0) 40%)",
                }}
              />
            )}
          </Face>

          {/* Оборот: общий факт и цитата из отзыва. Видео здесь не рендерим */}
          <Face back className="flex flex-col bg-saddle p-5 text-linen md:p-7">
            <p className="eyebrow text-linen/70">Наши лошади</p>
            <p className="display mt-3 text-[1.9rem] leading-[0.98] md:text-[2.4rem]">{card.title}</p>
            <span aria-hidden className="stitch mt-4 block w-20 text-linen" />
            <p className="mt-4 text-[0.9rem] leading-relaxed text-linen/90 md:text-[0.95rem]">{card.text}</p>
            {card.quote && (
              <figure className="mt-auto border-t border-dashed border-linen/30 pt-3">
                <blockquote className="display text-[1.1rem] italic leading-snug md:text-[1.2rem]">
                  «{card.quote.text}»
                </blockquote>
                <figcaption className="mt-1.5 text-[0.78rem] text-linen/70">
                  {card.quote.author}, из отзывов
                </figcaption>
              </figure>
            )}
          </Face>
        </motion.div>
      </motion.button>

      {/* Боковые карточки приглушены (без filter: он сломал бы 3D внутри) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px] bg-forest-deep"
        initial={false}
        animate={{ opacity: Math.min(dist * 0.42, 0.85) }}
        transition={reduce ? { duration: 0 } : { duration: 0.4 }}
      />
    </motion.div>
  );
}

export function Horses() {
  // Текущая и предыдущая карточки: по предыдущей видно, какая карточка перескочила с края на край
  const [[active, prevActive], setActivePair] = useState<[number, number]>([0, 0]);
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotionSafe();
  const dragX = useMotionValue(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  // Листали стрелками клавиатуры, стоя на карточке, — фокус переезжает на новую центральную,
  // иначе Enter нажимал бы на ставшую боковой карточку и листал назад
  useEffect(() => {
    const region = regionRef.current;
    const focused = document.activeElement as HTMLElement | null;
    if (region && focused?.dataset.horseCard && region.contains(focused)) {
      region.querySelector<HTMLElement>('[data-horse-card="active"]')?.focus({ preventScroll: true });
    }
  }, [active]);

  function go(next: number) {
    setActivePair([((next % N) + N) % N, active]);
    setFlipped(false);
  }

  function select(i: number) {
    if (dragged.current) return;
    if (i === active) setFlipped((f) => !f);
    else go(i);
  }

  return (
    <section
      id="loshadi"
      aria-labelledby="horses-title"
      className="overflow-hidden bg-forest py-16 text-linen md:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-brass">Лошади</p>
            <h2
              id="horses-title"
              className="display mt-5 text-[2.8rem] leading-[0.98] md:text-[4.6rem] lg:text-[5.6rem]"
            >
              Лошади — <em className="text-brass">главные гости</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[1.02rem] leading-relaxed text-linen/75">
              Приезжайте посмотреть площадку вживую или просто погладить тёплые мягкие носы наших
              лошадок.
            </p>
          </Reveal>
        </div>

        {/* Два подарка к площадке */}
        {/* Подарки к площадке: здесь, на первом экране и в ценах — больше нигде */}
        <ul className="mt-8 flex flex-wrap gap-3 md:mt-12">
          {venueGifts.map((g, i) => (
            <Reveal
              as="li"
              key={g}
              delay={i * 0.08}
              y={14}
              className="flex items-center gap-3 rounded-full border border-brass/50 bg-brass/10 py-2 pl-2 pr-4 text-[0.92rem] leading-snug md:pr-5"
            >
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-brass px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-forest-deep">
                <Gift size={13} weight="fill" />в подарок
              </span>
              {g}
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Карусель */}
      <div
        ref={regionRef}
        role="region"
        aria-roledescription="карусель"
        aria-label="Лошади усадьбы"
        className="relative mt-10 md:mt-14"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(active + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(active - 1);
          }
        }}
      >
        <motion.div
          ref={stageRef}
          className="relative mx-auto grid max-w-[1440px] cursor-grab select-none place-items-center active:cursor-grabbing"
          style={{ perspective: 1400, touchAction: "pan-y" }}
          onPanStart={() => {
            dragged.current = true;
          }}
          onPan={(_, info) => dragX.set(info.offset.x * 0.9)}
          onPanEnd={(_, info) => {
            const cardW = stageRef.current?.querySelector("button")?.offsetWidth ?? 300;
            const travel = info.offset.x + info.velocity.x * 0.15;
            const steps = Math.max(-2, Math.min(2, Math.round(-travel / (cardW * STEP))));
            if (steps) go(active + steps);
            animate(dragX, 0, reduce ? { duration: 0 } : SPRING);
            // Клик после перетаскивания не считаем выбором карточки
            requestAnimationFrame(() => {
              dragged.current = false;
            });
          }}
        >
          <motion.div
            className="grid w-full place-items-center"
            style={{ x: dragX, transformStyle: "preserve-3d" }}
          >
            {CARDS.map((c, i) => (
              <Card
                key={c.key}
                index={i}
                offset={offsetOf(i, active)}
                jump={Math.abs(offsetOf(i, active) - offsetOf(i, prevActive)) > 2}
                flipped={flipped && i === active}
                onSelect={() => select(i)}
              />
            ))}
          </motion.div>
        </motion.div>

        <div className="mx-auto mt-8 flex max-w-[1440px] items-center justify-center gap-5 px-4 md:mt-10">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Предыдущая лошадь"
            className="grid size-12 place-items-center rounded-full border border-linen/25 transition-colors hover:border-brass hover:text-brass"
          >
            <ArrowLeft size={18} />
          </button>
          <p aria-live="polite" className="min-w-[7rem] text-center text-[0.85rem] tabular-nums text-linen/70">
            <span className="text-linen">{String(active + 1).padStart(2, "0")}</span> /{" "}
            {String(N).padStart(2, "0")}
            <span className="sr-only">: {CARDS[active].caption}</span>
          </p>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Следующая лошадь"
            className="grid size-12 place-items-center rounded-full border border-linen/25 transition-colors hover:border-brass hover:text-brass"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <p className="mt-4 px-4 text-center text-[0.8rem] text-linen/55">
          Нажмите на карточку, чтобы перевернуть её
        </p>
      </div>

      {/* Программа с лошадьми */}
      <div className="mx-auto mt-10 max-w-[1440px] px-4 md:mt-16 md:px-8">
        <span aria-hidden className="stitch block text-brass" />
        <Reveal className="flex flex-col gap-3 pt-7 md:flex-row md:items-baseline md:gap-8">
          <p className="shrink-0 text-[0.95rem] font-semibold">
            {addons.program.title}
            <span className="ml-2 text-brass">{addons.program.pricePerGuest} руб с гостя</span>
          </p>
          <p className="text-[0.95rem] leading-relaxed text-linen/70">
            {horseProgram.join(" · ")} и многое другое
          </p>
        </Reveal>
      </div>
    </section>
  );
}
