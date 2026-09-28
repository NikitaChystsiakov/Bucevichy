"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { gallery, type GalleryItem } from "@/lib/media";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";

/*
  Галерея: лента фото тянется мышью и пальцем с инерцией (drag из motion), карточки чуть
  развёрнуты к центру экрана — лента как изогнутый экран. С мышью над лентой вместо курсора
  латунный круг «Тяните» (data-cursor-label, components/site/cursor.tsx). Горизонтальный
  свайп тачпада тоже листает. Клик по фото — лайтбокс: Esc, стрелки, свайп.
*/

const N = gallery.length;
const SPRING = { type: "spring", stiffness: 220, damping: 32 } as const;
// Высота карточки: телефон / от 768px (классы в Card). Ширина — по пропорциям фото (0,68…1,5)
const H_MOBILE = 380;
const H_DESKTOP = 500;
const aspectOf = (p: GalleryItem) => Math.min(1.5, Math.max(0.68, p.width / p.height));
const pad = (n: number) => String(n).padStart(2, "0");

function Card({
  item,
  index,
  x,
  half,
  reduce,
  onOpen,
  onFocusCard,
}: {
  item: GalleryItem;
  index: number;
  x: MotionValue<number>;
  half: MotionValue<number>;
  reduce: boolean;
  onOpen: () => void;
  onFocusCard: (el: HTMLElement) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Центр карточки внутри ленты — меряем сами, при ресайзе пересчитываем
  const center = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => center.set(el.offsetLeft + el.offsetWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [center]);

  // Насколько карточка сдвинута от центра экрана: -1 у левого края, 1 у правого
  const offset = useTransform([x, center, half], ([xv, c, h]: number[]) =>
    Math.max(-1.6, Math.min(1.6, (c + xv - h) / Math.max(h, 1))),
  );
  const rotateY = useTransform(offset, (d) => -d * 11);
  const scale = useTransform(offset, (d) => 1 - Math.min(Math.abs(d), 1.6) * 0.04);

  const a = aspectOf(item);
  return (
    <motion.li
      ref={ref}
      // Высота по экрану, ширина — по пропорциям фото (--a)
      className="relative h-[min(380px,56svh)] w-[min(calc(min(380px,56svh)*var(--a)),84vw)] shrink-0 md:h-[min(500px,62svh)] md:w-[calc(min(500px,62svh)*var(--a))]"
      style={{
        ...(reduce ? {} : { rotateY, scale, transformPerspective: 1200 }),
        "--a": a.toFixed(4),
      } as React.CSSProperties & Record<"--a", string>}
    >
      <button
        type="button"
        onClick={onOpen}
        onFocus={(e) => onFocusCard(e.currentTarget)}
        aria-label={`Открыть фото ${index + 1} из ${N}: ${item.caption}`}
        className="group absolute inset-0 overflow-hidden rounded-[6px] bg-forest text-left"
      >
        {/* Наезд при наведении — на обёртке, чтобы не спорить с обрезкой кадра (crop) */}
        <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            draggable={false}
            sizes={`(min-width: 768px) ${Math.round(H_DESKTOP * a)}px, ${Math.round(Math.min(H_MOBILE * a, 360))}px`}
            className={`photo-grade pointer-events-none select-none object-cover ${item.crop ?? ""}`}
          />
        </span>
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgb(20_28_23/0.78)_100%)]"
        />
        <span className="absolute inset-x-0 bottom-0 flex items-baseline gap-3 p-4 text-linen md:p-5">
          <span className="text-[0.72rem] font-semibold tabular-nums tracking-[0.14em] text-brass">
            {pad(index + 1)}
          </span>
          <span className="display text-[1.3rem] leading-tight md:text-[1.5rem]">{item.caption}</span>
        </span>
      </button>
    </motion.li>
  );
}

// Размер фото в лайтбоксе: не растягиваем больше исходника ×1,3, чтобы старые кадры не мылились
function boxStyle(p: GalleryItem): React.CSSProperties {
  const ratio = p.width / p.height;
  return {
    aspectRatio: `${p.width} / ${p.height}`,
    width: `min(100%, ${Math.round(p.width * 1.3)}px, calc(74svh * ${ratio.toFixed(4)}))`,
  };
}

function Lightbox({
  index,
  onClose,
  onIndex,
}: {
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const reduce = useReducedMotionSafe();
  const [dir, setDir] = useState(0);
  // Пока окно закрывается, показываем последний кадр
  const [last, setLast] = useState(0);
  if (index !== null && index !== last) setLast(index);
  const shown = index ?? last;
  const item = gallery[shown];

  const go = (d: number) => {
    setDir(d);
    onIndex((shown + d + N) % N);
  };

  return (
    <Modal
      open={index !== null}
      onClose={onClose}
      label="Фото из галереи"
      className="flex h-[100svh] w-full flex-col items-center justify-center px-3 pb-6 pt-20 md:px-24"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative flex w-full flex-1 items-center justify-center">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={shown}
            custom={dir}
            className="relative max-h-full cursor-grab touch-pan-y overflow-hidden rounded-[4px] active:cursor-grabbing"
            style={boxStyle(item)}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 80 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -80 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? { duration: 0 } : SPRING}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -500) go(1);
              else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              draggable={false}
              sizes={`min(100vw, ${Math.round(item.width * 1.3)}px)`}
              className={`photo-grade pointer-events-none select-none object-cover ${item.crop ?? ""}`}
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Предыдущее фото"
          className="absolute left-0 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-linen/25 bg-forest-deep/60 transition hover:border-brass hover:text-brass md:-left-16 md:grid"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Следующее фото"
          className="absolute right-0 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-linen/25 bg-forest-deep/60 transition hover:border-brass hover:text-brass md:-right-16 md:grid"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-5 flex w-full max-w-[720px] items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Предыдущее фото"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-linen/25 md:hidden"
        >
          <ArrowLeft size={17} />
        </button>
        <p className="flex-1 text-center" aria-live="polite">
          <span className="display block text-[1.5rem] leading-tight">{item.caption}</span>
          <span className="mt-1 block text-[0.8rem] tabular-nums text-linen/70">
            {pad(shown + 1)} / {pad(N)}
          </span>
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Следующее фото"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-linen/25 md:hidden"
        >
          <ArrowRight size={17} />
        </button>
      </div>
    </Modal>
  );
}

export function Gallery() {
  const reduce = useReducedMotionSafe();
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const half = useMotionValue(600);
  const [minX, setMinX] = useState(0);
  const minXRef = useRef(0);
  const dragged = useRef(false);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const progress = useTransform(x, (v) => (minX < 0 ? Math.min(1, Math.max(0, v / minX)) : 0));

  const clamp = useCallback((v: number) => Math.min(0, Math.max(minXRef.current, v)), []);

  // Границы ленты: сколько можно утянуть влево
  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    if (!view || !track) return;
    const measure = () => {
      const vw = view.clientWidth;
      half.set(vw / 2);
      const next = Math.min(0, vw - track.scrollWidth);
      minXRef.current = next;
      setMinX(next);
      if (x.get() < next) x.set(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(view);
    ro.observe(track);
    return () => ro.disconnect();
  }, [half, x]);

  // Горизонтальный свайп тачпада. Слушатель не пассивный: иначе браузер уйдёт «назад» по истории
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x.stop();
      x.set(clamp(x.get() - e.deltaX));
    };
    view.addEventListener("wheel", onWheel, { passive: false });
    return () => view.removeEventListener("wheel", onWheel);
  }, [x, clamp]);

  const slideTo = (target: number) =>
    animate(x, clamp(target), reduce ? { duration: 0 } : SPRING);

  const nudge = (dir: number) => {
    const vw = viewRef.current?.clientWidth ?? 800;
    slideTo(x.get() - dir * vw * 0.7);
  };

  // Клавиатура: карточка в фокусе должна быть в экране
  const onFocusCard = (el: HTMLElement) => {
    const view = viewRef.current;
    const li = el.parentElement;
    if (!view || !li) return;
    const vw = view.clientWidth;
    const left = li.offsetLeft + x.get();
    const right = left + li.offsetWidth;
    if (left < 16 || right > vw - 16) slideTo(vw / 2 - li.offsetLeft - li.offsetWidth / 2);
  };

  return (
    <section id="galereya" aria-labelledby="gallery-title" className="overflow-hidden bg-forest-deep py-24 text-linen md:py-36">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <Reveal>
          <p className="eyebrow text-brass">Галерея</p>
          <h2 id="gallery-title" className="display mt-5 text-[2.8rem] leading-[0.98] md:text-[4.6rem] lg:text-[5.6rem]">
            Буцевичи <em className="text-brass">в кадре</em>
          </h2>
          <p className="mt-5 max-w-[40ch] text-[1rem] leading-relaxed text-linen/75">
            Луг с аркой, зал, лошади и вечер в гирляндах. Тяните ленту, нажмите на фото, чтобы открыть
            его крупно.
          </p>
        </Reveal>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Листать назад"
            className="grid size-12 place-items-center rounded-full border border-linen/25 transition-colors hover:border-brass hover:text-brass"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Листать вперёд"
            className="grid size-12 place-items-center rounded-full border border-linen/25 transition-colors hover:border-brass hover:text-brass"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={viewRef}
        role="region"
        aria-roledescription="галерея"
        aria-label="Фото усадьбы"
        data-cursor-label="Тяните"
        className="relative mt-12 md:mt-16"
      >
        <motion.ul
          ref={trackRef}
          className="flex w-max cursor-grab select-none items-center gap-3 px-4 active:cursor-grabbing md:gap-5 md:px-8"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: minX, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ power: 0.3, timeConstant: 340, bounceStiffness: 260, bounceDamping: 30 }}
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={() => {
            // Клик сразу после перетаскивания не открывает фото
            requestAnimationFrame(() => {
              dragged.current = false;
            });
          }}
        >
          {gallery.map((item, i) => (
            <Card
              key={item.src}
              item={item}
              index={i}
              x={x}
              half={half}
              reduce={reduce}
              onFocusCard={onFocusCard}
              onOpen={() => {
                if (!dragged.current) setOpen(i);
              }}
            />
          ))}
        </motion.ul>
      </div>

      {/* Сколько ленты пройдено */}
      <div className="mx-auto mt-10 max-w-[1440px] px-4 md:px-8">
        <div className="relative h-px bg-linen/15">
          <motion.span
            aria-hidden
            className="absolute inset-0 origin-left bg-brass"
            style={{ scaleX: progress }}
          />
        </div>
      </div>

      <Lightbox index={open} onClose={close} onIndex={setOpen} />
    </section>
  );
}
