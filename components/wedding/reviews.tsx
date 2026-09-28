"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Quotes } from "@phosphor-icons/react";
import { REVIEWS_TOTAL_LABEL, weddingReviews } from "@/lib/wedding";
import { DemoLink } from "@/components/site/demo-link";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";

/*
  Стопка свадебных отзывов. Верхнюю карточку можно смахнуть в сторону (drag + пружина) —
  она улетает и уходит в низ стопки, следующая поднимается. То же делает кнопка «Следующий отзыв».
  Последняя карточка — ссылка на все отзывы.
*/

type Item = { kind: "review"; index: number } | { kind: "more" };
const ITEMS: Item[] = [...weddingReviews.map((_, index) => ({ kind: "review" as const, index })), { kind: "more" }];
const N = ITEMS.length;
// Поворот карточек в глубине стопки — чтобы стопка выглядела живой, а не ровной колонкой
const TILT = [0, -3, 2.4, -1.6];
const pad = (n: number) => String(n).padStart(2, "0");

function ReviewCard({
  item,
  pos,
  fly,
  onFlown,
}: {
  item: Item;
  // 0 — верхняя
  pos: number;
  // Команда улететь (кнопка «Следующий отзыв»): направление
  fly: number | null;
  onFlown: (dir: number) => void;
}) {
  const reduce = useReducedMotionSafe();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-320, 0, 320], [-14, 0, 14]);
  const top = pos === 0;

  const flyAway = (dir: number) => {
    const w = typeof window === "undefined" ? 800 : window.innerWidth;
    animate(x, dir * w, reduce ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 26, velocity: dir * 800 }).then(
      () => {
        onFlown(dir);
        // Уже в низу стопки — возвращается на место под остальными
        animate(x, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 28 });
      },
    );
  };

  useEffect(() => {
    if (fly !== null && top) flyAway(fly);
    // flyAway зависит только от пропсов этого рендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fly]);

  return (
    <motion.div
      className="relative [grid-area:1/1]"
      style={{ zIndex: N - pos }}
      initial={false}
      animate={{
        y: pos * 16,
        scale: 1 - pos * 0.045,
        rotate: TILT[pos] ?? 0,
        opacity: pos > 2 ? 0 : 1,
        filter: `brightness(${1 - pos * 0.07})`,
      }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
      aria-hidden={top ? undefined : true}
    >
      <motion.article
        className={`relative flex h-full min-h-[400px] flex-col rounded-[20px] p-7 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] md:min-h-[440px] md:p-10 ${
          item.kind === "more" ? "bg-saddle text-linen" : "bg-linen text-forest-deep"
        } ${top ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}
        style={{ x, rotate }}
        drag={top ? "x" : false}
        dragSnapToOrigin={false}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          const dir = info.offset.x > 0 ? 1 : -1;
          if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) flyAway(dir);
          else animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
        }}
        data-cursor-label={top ? "Смахните" : undefined}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-[8px] rounded-[14px] border border-dashed ${
            item.kind === "more" ? "border-linen/35" : "border-saddle/30"
          }`}
        />
        {item.kind === "review" ? (
          <ReviewBody index={item.index} />
        ) : (
          <div className="relative flex flex-1 flex-col">
            <p className="eyebrow text-linen/80">Все отзывы</p>
            <p className="display mt-5 text-[2.4rem] leading-[1] md:text-[3.2rem]">{REVIEWS_TOTAL_LABEL}</p>
            <p className="mt-5 max-w-[36ch] text-[0.98rem] leading-relaxed text-linen/85">
              Свадьбы, детские праздники, корпоративы и конные прогулки: гости пишут нам с 2014 года.
            </p>
            <div className="mt-auto pt-8">
              <DemoLink
                link={{ label: "Читать все отзывы", href: "/otzyvy" }}
                className="link-underline inline-flex items-center gap-2 text-linen"
              />
              <ArrowUpRight size={16} className="ml-1 inline" aria-hidden />
            </div>
          </div>
        )}
      </motion.article>
    </motion.div>
  );
}

function ReviewBody({ index }: { index: number }) {
  const r = weddingReviews[index];
  return (
    <figure className="relative flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-saddle">{r.topic}</p>
        <Quotes size={30} weight="fill" className="text-saddle/80" aria-hidden />
      </div>
      <blockquote className="display mt-6 text-[1.45rem] leading-[1.22] md:text-[1.95rem] md:leading-[1.18]">
        «{r.quote}»
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-4 pt-8">
        <span className="stitch w-10 text-saddle" aria-hidden />
        <span>
          <span className="block font-semibold">{r.author}</span>
          <span className="block text-sm text-forest-deep/70">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  // order[0] — индекс верхней карточки
  const [order, setOrder] = useState(() => ITEMS.map((_, i) => i));
  const [fly, setFly] = useState<{ n: number; dir: number } | null>(null);

  const onFlown = () => {
    setOrder((o) => [...o.slice(1), o[0]]);
    setFly(null);
  };

  const shown = order[0];

  return (
    <section id="otzyvy" aria-labelledby="reviews-title" className="overflow-hidden bg-forest py-24 text-linen md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-4 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow text-brass">Отзывы</p>
          <h2 id="reviews-title" className="display mt-5 text-[2.8rem] leading-[0.98] md:text-[4.4rem]">
            Что пишут <em className="text-brass">гости свадеб</em>
          </h2>
          <p className="mt-5 max-w-[38ch] text-[1rem] leading-relaxed text-linen/75">
            Отзывы с нашего сайта, сокращены без изменения смысла. Смахните карточку, чтобы
            увидеть следующую.
          </p>
          <div className="mt-8 flex items-center gap-5">
            <button
              type="button"
              onClick={() => fly === null && setFly({ n: shown, dir: -1 })}
              className="btn btn-outline group text-linen"
            >
              Следующий отзыв
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-[0.85rem] tabular-nums text-linen/70" aria-live="polite">
              <span className="text-linen">{pad(shown + 1)}</span> / {pad(N)}
            </p>
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="mx-auto grid max-w-[560px] pb-10">
            {ITEMS.map((item, i) => (
              <ReviewCard
                key={i}
                item={item}
                pos={order.indexOf(i)}
                fly={fly && fly.n === i ? fly.dir : null}
                onFlown={onFlown}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
