"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { galleryV2 as items, type PolaroidItem } from "@/lib/media";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";
import { DuotoneImage } from "./duotone";

const N = items.length;
// Полароиды лежат чуть вразнобой: поворот по номеру, без случайностей в рендере
const TILT = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.5];
const pad = (n: number) => String(n).padStart(2, "0");

// Кадр в лайтбоксе: не растягиваем больше исходника ×1,3 (старые кадры мылятся); box — если край срезан
function boxStyle(p: PolaroidItem): React.CSSProperties {
  const w = p.box?.width ?? p.width;
  const h = p.box?.height ?? p.height;
  return {
    aspectRatio: `${w} / ${h}`,
    width: `min(100%, ${Math.round(w * 1.3)}px, calc(72svh * ${(w / h).toFixed(4)}))`,
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
  const item = items[shown];

  const go = (d: number) => {
    setDir(d);
    onIndex((shown + d + N) % N);
  };

  const arrow =
    "grid size-12 shrink-0 place-items-center rounded-full border border-ivory/30 text-ivory transition hover:border-gold-light hover:text-gold-light";

  return (
    <Modal
      open={index !== null}
      onClose={onClose}
      tone="v2"
      label="Фото из усадьбы"
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
            // В лайтбоксе — цвет: белое поле как у отпечатка
            className="relative max-h-full cursor-grab touch-pan-y bg-ivory p-2 active:cursor-grabbing md:p-3"
            style={boxStyle(item)}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 80 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -80 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 32 }}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -500) go(1);
              else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
            }}
          >
            <span className="relative block size-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                draggable={false}
                sizes={`min(100vw, ${Math.round(item.width * 1.3)}px)`}
                className="pointer-events-none select-none object-cover"
                style={{ objectPosition: item.box?.position ?? "50% 50%" }}
              />
            </span>
          </motion.div>
        </AnimatePresence>

        <button type="button" onClick={() => go(-1)} aria-label="Предыдущее фото" className={`${arrow} absolute -left-16 top-1/2 hidden -translate-y-1/2 md:grid`}>
          <ArrowLeft size={18} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Следующее фото" className={`${arrow} absolute -right-16 top-1/2 hidden -translate-y-1/2 md:grid`}>
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-5 flex w-full max-w-[640px] items-center justify-between gap-4">
        <button type="button" onClick={() => go(-1)} aria-label="Предыдущее фото" className={`${arrow} size-11 md:hidden`}>
          <ArrowLeft size={17} />
        </button>
        <p className="flex-1 text-center" aria-live="polite">
          <span className="script block text-[1.9rem] leading-tight text-ivory">{item.caption}</span>
          <span className="mt-1 block text-[0.78rem] tabular-nums tracking-[0.16em] text-ivory/75">
            {pad(shown + 1)} / {pad(N)}
          </span>
        </p>
        <button type="button" onClick={() => go(1)} aria-label="Следующее фото" className={`${arrow} size-11 md:hidden`}>
          <ArrowRight size={17} />
        </button>
      </div>
    </Modal>
  );
}

/*
  «Как это выглядит»: полароиды на булавках, лента со свайпом (нативная прокрутка со снапом —
  палец, тачпад, стрелки). В ленте фото в дуотоне, по нажатию — лайтбокс в цвете.
*/
export function Gallery() {
  const reduce = useReducedMotionSafe();
  const stripRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  // Стабильная ссылка: окно подписывается на Esc и блокирует прокрутку в эффекте с этой зависимостью
  const close = useCallback(() => setOpen(null), []);

  const nudge = (d: number) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: d * el.clientWidth * 0.75, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "grid size-12 place-items-center rounded-full border border-ivory/35 text-ivory transition-colors hover:border-gold-light hover:text-gold-light";

  return (
    <section aria-labelledby="gallery-title" className="on-dark tex-dark overflow-hidden bg-wine py-12 text-ivory md:py-28">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <Reveal>
          <p className="v2-eyebrow text-gold-light">Фото из усадьбы</p>
          <h2 id="gallery-title" className="prata mt-5 text-[2.8rem] leading-[1] md:text-[4.6rem] lg:text-[5.2rem]">
            Как это <span className="script text-[1.15em] text-gold-light">выглядит</span>
          </h2>
          <p className="mt-4 max-w-[40ch] text-[0.98rem] leading-relaxed text-ivory/85">
            Листайте ленту. Нажмите на фото, чтобы открыть его в цвете.
          </p>
        </Reveal>
        <div className="flex gap-3 max-md:hidden">
          <button type="button" onClick={() => nudge(-1)} aria-label="Листать назад" className={arrow}>
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Листать вперёд" className={arrow}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <ul
        ref={stripRef}
        aria-label="Фото усадьбы"
        className="v2-strip mt-8 flex gap-5 overflow-x-auto scroll-px-4 px-4 pb-10 pt-6 md:mt-12 md:gap-8 md:scroll-px-[max(2rem,calc((100%-1280px)/2+2rem))] md:px-[max(2rem,calc((100%-1280px)/2+2rem))]"
      >
        {items.map((item, i) => (
          <li key={item.src} className="w-[64vw] max-w-[270px] shrink-0 snap-start md:w-[300px] md:max-w-none">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Открыть фото ${i + 1} из ${N}: ${item.caption}`}
              className="paper-shadow group relative block w-full bg-ivory p-2.5 pb-0 text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:p-3 md:pb-0 [@media(hover:hover)]:hover:-translate-y-1.5"
              style={{ rotate: `${TILT[i % TILT.length]}deg` }}
            >
              <DuotoneImage
                photo={item}
                sizes="(min-width: 768px) 280px, 60vw"
                className="aspect-[4/5]"
                position={item.position}
                tone={i % 3 === 1 ? "ink" : "wine"}
              />
              <span className="script block px-1 pb-3 pt-2.5 text-[1.45rem] leading-tight text-ink md:pb-4 md:text-[1.6rem]">
                {item.caption}
              </span>
              {/* Булавка */}
              <span
                aria-hidden
                className="absolute left-1/2 top-0 z-[3] size-3.5 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbefc9,#b8914a_55%,#6b4f22)] shadow-[0_2px_3px_rgb(35_29_26/0.45)]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox index={open} onClose={close} onIndex={setOpen} />
    </section>
  );
}
