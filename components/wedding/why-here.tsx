"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight, Gift } from "@phosphor-icons/react";
import { whyHere } from "@/lib/wedding";
import { photos, type Photo } from "@/lib/photos";
import { instaPhotos, videos, type Video } from "@/lib/media";
import { LazyVideo } from "@/components/ui/lazy-video";
import { useBooking } from "@/components/site/booking-provider";
import { Reveal } from "@/components/ui/motion";
import { Magnetic } from "@/components/ui/magnetic";
import { useNear, useReducedMotionSafe, useScrollTransform } from "@/components/ui/hooks";

type Key = (typeof whyHere)[number]["key"];

type CardMedia = { photo: Photo; position?: string } | { video: Video };

const cardMedia: Record<Key, CardMedia> = {
  // Ролик 720×1280: в карточке не шире 640px, то есть в пределах разрешения ×1,5
  horses: { video: videos.horsesPaddock },
  // Вверху кадра остался белый стикер из Instagram — прячем его увеличением от нижнего края
  meadow: { photo: instaPhotos.ceremonyMeadow, position: "origin-bottom scale-[1.18]" },
  hall: { photo: photos.hallSun },
  stay: { photo: photos.chaletEvening, position: "object-[60%_50%]" },
};

// Карточки чередуют «кожу седла», лён и хвою
const tones = [
  "bg-saddle text-linen",
  "bg-linen text-forest-deep",
  "bg-forest text-linen",
  "bg-linen text-forest-deep",
];

// Раздел 7: «Здесь вас ждут бескрайние живописные поля…»
const MOOD =
  "Здесь вас ждут бескрайние живописные поля, глубокое синее небо, душистый запах сена, ощущение ласкающего ветра в волосах и тёплого дыхания лошади.";

function Card({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotionSafe();
  const item = whyHere[index];
  const media = cardMedia[item.key];
  const under = total - 1 - index; // сколько карточек ещё наедет сверху
  const start = index / total;
  const scale = useScrollTransform(progress, [start, 1], [1, 1 - under * 0.05]);
  const dim = useScrollTransform(progress, [start, 1], [0, under * 0.2]);
  // Блок сразу под первым экраном: фото подключаем, когда карточка в полутора экранах,
  // чтобы на телефоне они не отнимали канал у hero
  const mediaRef = useRef<HTMLDivElement>(null);
  const near = useNear(mediaRef);

  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center px-3 md:px-8">
      <motion.article
        style={{
          scale: reduce ? 1 : scale,
          top: `calc(${index} * 14px - 2svh)`,
        }}
        className={`relative flex h-[min(80svh,700px)] w-full max-w-[1280px] origin-top flex-col overflow-hidden rounded-[20px] shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.55)] md:grid md:grid-cols-2 ${tones[index]}`}
      >
        <div ref={mediaRef} className="relative h-[50%] shrink-0 bg-forest md:order-2 md:h-full">
          {"video" in media ? (
            <LazyVideo video={media.video} cap={false} ratio={false} className="absolute inset-0" />
          ) : (
            near && <Image
              src={media.photo.src}
              alt={media.photo.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`photo-grade object-cover ${media.position ?? ""}`}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 p-5 md:gap-5 md:p-12 lg:p-16">
          <div className="flex items-center justify-between">
            <span className="text-[0.85rem] font-semibold tabular-nums tracking-[0.08em] opacity-70">
              {String(index + 1).padStart(2, "0")}
              <span className="opacity-50"> / {String(total).padStart(2, "0")}</span>
            </span>
            {"tag" in item && (
              <span className="flex items-center gap-1.5 rounded-full bg-brass px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-forest-deep">
                <Gift size={14} weight="fill" />
                {item.tag}
              </span>
            )}
          </div>
          <div>
            <h3 className="display text-[2rem] leading-[1] md:text-[3.4rem] lg:text-[4.2rem]">
              {item.title}
            </h3>
            <span aria-hidden className="stitch mt-4 block w-24 md:mt-8" />
            <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed opacity-85 md:mt-6 md:text-[1.08rem]">
              {item.text}
            </p>
          </div>
        </div>

        {!reduce && (
          <motion.div
            aria-hidden
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 bg-forest-deep"
          />
        )}
      </motion.article>
    </div>
  );
}

export function WhyHere() {
  const ref = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section aria-labelledby="why-title" className="relative bg-forest-deep pt-24 md:pt-36">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 md:px-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow text-brass">Почему здесь</p>
          <h2
            id="why-title"
            className="display mt-5 text-[2.6rem] leading-[1] md:text-[4.4rem] lg:text-[5.4rem]"
          >
            Хороших мест для свадьбы много. <em className="text-brass">Таких, как наше,</em> нет.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="self-end lg:col-span-4 lg:col-start-9">
          <p className="text-[1.05rem] leading-relaxed text-linen/75">{MOOD}</p>
          <Magnetic className="mt-7 inline-flex">
            <button
              type="button"
              onClick={() => openBooking({ topic: "visit" })}
              className="btn btn-outline group text-linen"
            >
              Приехать посмотреть
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </Magnetic>
        </Reveal>
      </div>

      <div ref={ref} className="relative mt-6 md:mt-10">
        {whyHere.map((item, i) => (
          <Card key={item.key} index={i} total={whyHere.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
