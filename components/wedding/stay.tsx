"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Bed, Campfire, Fire } from "@phosphor-icons/react";
import { houses, stay, type HouseKey } from "@/lib/wedding";
import { photos, type Photo } from "@/lib/photos";
import { useBooking } from "@/components/site/booking-provider";
import { Reveal } from "@/components/ui/motion";
import { useFinePointer, useReducedMotionSafe } from "@/components/ui/hooks";

/*
  «Гости остаются на ночь»: две большие карточки домов. Фото сменяются плавно, активное
  медленно наезжает. С мышью фото листаются, пока курсор на карточке; на телефоне —
  сами, пока карточка в экране; точки внизу фото переключают вручную.
*/

const housePhotos: Record<HouseKey, Photo[]> = {
  country: [photos.countrySunset, photos.countryDay, photos.countryLiving, photos.countryBedroom],
  chalet: [photos.chaletEvening, photos.chaletDay, photos.chaletLiving, photos.fireplace],
};

const perkIcons = [Bed, Fire, Campfire];

function HouseCard({ index }: { index: number }) {
  const house = houses[index];
  const list = housePhotos[house.key];
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotionSafe();
  const inView = useInView(ref, { amount: 0.5 });
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);

  // Мышь: листаем, пока курсор на карточке. Тач: листаем, пока карточка в экране
  const playing = !reduce && (fine ? hover : inView);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % list.length), fine ? 1600 : 3400);
    return () => window.clearInterval(id);
  }, [playing, fine, list.length]);

  return (
    <Reveal delay={index * 0.12}>
      <article
        ref={ref}
        onPointerEnter={fine ? () => setHover(true) : undefined}
        onPointerLeave={fine ? () => setHover(false) : undefined}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-forest lg:aspect-[5/4]">
          {list.map((p, i) => {
            const on = i === current;
            return (
              <motion.div
                key={p.src}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on && !reduce ? 1.1 : 1.02 }}
                transition={{
                  opacity: { duration: reduce ? 0 : 0.9, ease: "easeInOut" },
                  // Активное фото медленно наезжает; скрытое возвращается в исходный масштаб после затухания
                  scale: on ? { duration: 9, ease: "easeOut" } : { duration: 0, delay: 0.9 },
                }}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 46vw, 92vw"
                  className="photo-grade object-cover"
                />
              </motion.div>
            );
          })}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(20_28_23/0.35)_0%,transparent_28%,transparent_70%,rgb(20_28_23/0.55)_100%)]"
          />
          <p className="absolute left-4 top-4 rounded-full bg-linen/90 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-forest-deep md:left-6 md:top-6">
            Дом {house.name}
          </p>
          <div
            role="group"
            aria-label={`Фото дома ${house.name}`}
            className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-3"
          >
            {list.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Фото ${i + 1}: ${p.alt}`}
                aria-current={i === current ? "true" : undefined}
                className="grid h-8 w-8 place-items-center"
              >
                {/* Активная полоска длиннее: scaleX, а не ширина (анимируем только transform/opacity) */}
                <span
                  className={`block h-1 w-6 rounded-full bg-linen transition-[transform,opacity] duration-500 ${
                    i === current ? "scale-x-100 opacity-100" : "scale-x-[0.34] opacity-50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 md:pt-8">
          <h3 className="display text-[3rem] leading-[0.9] tracking-[0.02em] md:text-[4.4rem]">
            {house.name}
          </h3>
          <p className="mt-3 text-[1.02rem] text-forest-deep/80">{house.kind}</p>
          <p className="mt-1 text-[0.92rem] text-saddle">{house.capacity}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {house.facts.map((f) => (
              <li
                key={f}
                className="rounded-full border border-dashed border-forest-deep/30 px-3.5 py-1.5 text-[0.88rem]"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export function Stay() {
  const { openBooking } = useBooking();

  return (
    <section id="nochleg" aria-labelledby="stay-title" className="bg-linen py-24 text-forest-deep md:py-36">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-saddle">Ночлег</p>
            <h2
              id="stay-title"
              className="display mt-5 text-[2.8rem] leading-[0.98] [text-wrap:balance] md:text-[4.6rem] lg:text-[5.6rem]"
            >
              Гости остаются <em className="text-saddle">на ночь</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[1.02rem] leading-relaxed text-forest-deep/80">{stay.lead}</p>
          </Reveal>
        </div>

        <ul className="mt-10 grid gap-3 border-y border-dashed border-forest-deep/20 py-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {stay.perks.map((perk, i) => {
            const Icon = perkIcons[i];
            return (
              <Reveal as="li" key={perk} delay={i * 0.06} y={12} className="flex items-center gap-3 text-[0.98rem]">
                <Icon size={22} weight="duotone" className="shrink-0 text-saddle" />
                {perk}
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-12 grid gap-16 md:mt-16 md:grid-cols-2 md:gap-8 lg:gap-12">
          {houses.map((h, i) => (
            <HouseCard key={h.key} index={i} />
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-start gap-5 md:mt-20 md:flex-row md:items-center md:justify-between">
          {/* TODO(цены): цены домов в летний сезон «могут отличаться» (раздел 8), поэтому не показываем */}
          <p className="max-w-[46ch] text-[0.95rem] leading-relaxed text-forest-deep/70">
            Стоимость ночлега в сезон свадеб назовём, когда обсудим вашу дату.
          </p>
          <button type="button" onClick={() => openBooking()} className="btn btn-brass group">
            Узнать свободную дату
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
