"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { estate, estatePlaces, type EstatePlaceKey } from "@/lib/wedding";
import { photos, type Photo } from "@/lib/photos";
import { instaPhotos, posterPhoto, videos } from "@/lib/media";
import { LazyVideo } from "@/components/ui/lazy-video";
import { Reveal } from "@/components/ui/motion";
import { useFinePointer, useReducedMotionSafe } from "@/components/ui/hooks";

/*
  «Усадьба на 2,5 га»: ролик 29 фоном (на телефоне — карточка 16:9) и стилизованный план
  в тонких линиях. Дорожки рисуются при появлении, точки пульсируют; наведение или тап —
  карточка с фото. На телефоне вместо плана — горизонтальная лента карточек.
  TODO(план): план схематичный, расположение объектов придумано. Координаты точек — lib/wedding.ts.
*/

// TODO(фото): фото пруда с пирсом — пока вместо фото рисунок
const placePhoto: Record<EstatePlaceKey, { photo: Photo; className?: string } | null> = {
  // Вверху кадра белый стикер из Instagram — увеличиваем от нижнего края
  meadow: { photo: instaPhotos.ceremonyMeadow, className: "origin-bottom scale-[1.18]" },
  hall: { photo: photos.hallWide },
  terrace: { photo: posterPhoto(videos.firstDance), className: "object-[50%_30%]" },
  gazebos: { photo: instaPhotos.nightGazeboSign },
  ponds: null,
  stable: { photo: photos.stableTour },
  houses: { photo: photos.countrySunset },
  banya: { photo: photos.banyaSteam },
};

function PlacePhoto({ place, sizes }: { place: EstatePlaceKey; sizes: string }) {
  const media = placePhoto[place];
  if (!media) {
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center bg-forest">
        <svg viewBox="0 0 120 60" className="w-2/3 text-brass/70">
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx="60"
              cy="30"
              rx={18 + i * 16}
              ry={8 + i * 7}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray={i ? "4 4" : undefined}
            />
          ))}
        </svg>
      </div>
    );
  }
  return (
    <Image
      src={media.photo.src}
      alt={media.photo.alt}
      fill
      sizes={sizes}
      className={`photo-grade object-cover ${media.className ?? ""}`}
    />
  );
}

/* ---------- План в тонких линиях (viewBox 1000×560, точки — в процентах) ---------- */

const PATHS = [
  // Въезд и главная дорожка к залу
  "M0 300 C120 300 200 262 300 244 S410 246 440 246",
  // Зал → луг с аркой
  "M560 232 C620 204 664 168 704 140",
  // Зал → конюшня
  "M440 228 C400 210 364 192 332 176",
  // Терраса → беседки
  "M560 308 C596 306 620 296 640 284",
  // Беседки → дома
  "M664 314 C676 356 692 388 712 416",
  // Дома → баня
  "M766 432 C800 424 830 410 848 398",
  // Терраса → пруд
  "M460 330 C420 352 384 364 356 370",
  // КАНТРИ → ШАЛЕ
  "M718 452 C700 462 684 468 670 470",
];

function Plan({ reduce }: { reduce: boolean }) {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg viewBox="0 0 1000 560" aria-hidden className="absolute inset-0 h-full w-full text-linen/55">
      {/* Граница участка */}
      <path
        d="M90 60 C300 22 700 22 930 60 C978 200 978 380 930 520 C700 546 300 546 90 520 C46 380 46 200 90 60 Z"
        {...line}
        strokeDasharray="7 6"
        className="text-brass/60"
      />
      {/* Деревья по краю */}
      {[
        [120, 110], [150, 84], [110, 150], [880, 120], [905, 160], [860, 90], [130, 470], [170, 495], [900, 470],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="13" {...line} strokeOpacity="0.45" />
      ))}
      {/* Луг с аркой */}
      <ellipse cx="730" cy="118" rx="110" ry="58" {...line} strokeDasharray="2 5" />
      <path d="M716 134 V112 A14 14 0 0 1 744 112 V134" {...line} className="text-brass" strokeWidth={2} />
      {/* Конюшня и левада */}
      <rect x="190" y="136" width="140" height="44" rx="3" {...line} />
      <rect x="160" y="62" width="200" height="60" rx="26" {...line} strokeDasharray="3 5" />
      {/* Зал и терраса */}
      <rect x="440" y="215" width="120" height="62" rx="3" {...line} strokeWidth={1.6} />
      <rect x="440" y="286" width="120" height="40" rx="3" {...line} strokeDasharray="4 4" />
      {/* Беседки */}
      <rect x="638" y="258" width="22" height="22" rx="2" {...line} />
      <rect x="666" y="288" width="22" height="22" rx="2" {...line} />
      {/* Пруды */}
      <path d="M248 372 C250 344 300 336 336 346 C366 354 362 392 326 398 C290 404 246 398 248 372 Z" {...line} className="text-brass/70" />
      <path d="M760 500 C762 482 796 476 820 484 C842 492 836 516 810 518 C782 520 758 516 760 500 Z" {...line} className="text-brass/70" />
      {/* Дома КАНТРИ и ШАЛЕ, баня */}
      <path d="M700 452 V420 L722 404 L744 420 V452 Z" {...line} />
      <path d="M620 484 V458 L645 446 L670 458 V484 Z" {...line} />
      <rect x="848" y="380" width="26" height="26" rx="2" {...line} />

      {/* Дорожки: рисуются при появлении */}
      {PATHS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          {...line}
          // Без non-scaling-stroke: с ним длина штриха считается в экранных пикселях,
          // pathLength масштабируется неверно, и дорожка не дорисовывается до конца
          vectorEffect="none"
          strokeWidth={1.4}
          className="text-linen/80"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduce ? { duration: 0 } : { duration: 1.6, delay: 0.2 + i * 0.12, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  );
}

function MapDesktop() {
  const reduce = useReducedMotionSafe();
  const fine = useFinePointer();
  const [active, setActive] = useState<EstatePlaceKey | null>(null);
  const place = estatePlaces.find((p) => p.key === active);
  const ref = useRef<HTMLDivElement>(null);

  // Тач (планшет в альбомной ориентации): карточка закрывается тапом мимо плана
  useEffect(() => {
    if (!active || fine) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active, fine]);

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[1000/560] w-full max-w-[1120px]"
      onKeyDown={(e) => e.key === "Escape" && setActive(null)}
      onPointerLeave={fine ? () => setActive(null) : undefined}
    >
      <Plan reduce={reduce} />

      {estatePlaces.map((p, i) => {
        const on = active === p.key;
        return (
          <button
            key={p.key}
            type="button"
            aria-expanded={on}
            aria-controls="estate-card"
            onPointerEnter={fine ? () => setActive(p.key) : undefined}
            onFocus={() => setActive(p.key)}
            // Только открывает: при тапе фокус уже открыл карточку, переключатель закрыл бы её
            onClick={() => setActive(p.key)}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 p-3"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className="relative grid size-4 place-items-center">
              <span
                aria-hidden
                className="pulse-ring absolute inset-0 rounded-full border border-brass"
                style={{ "--delay": `${i * 0.3}s` } as React.CSSProperties}
              />
              <span
                className={`relative size-3 rounded-full bg-brass shadow-[0_0_14px_rgb(201_164_92/0.8)] transition-transform duration-300 ${
                  on ? "scale-150" : "group-hover:scale-125"
                }`}
              />
            </span>
            {/* Подпись на плашке цвета фона: дорожки под ней не пересекают текст */}
            <span
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-forest-deep/85 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-linen/85 ring-1 ring-linen/10 transition-opacity duration-300 ${
                p.label === "left" ? "right-full" : "left-full"
              } ${on ? "opacity-0" : ""}`}
            >
              {p.title}
            </span>
          </button>
        );
      })}

      {/* Карточка места */}
      <AnimatePresence>
        {place && (
          <motion.div
            key={place.key}
            id="estate-card"
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute z-20 w-[260px]"
            style={{
              left: `${place.x}%`,
              top: `${place.y}%`,
              translate: `${place.x > 58 ? "calc(-100% - 22px)" : "22px"} ${place.y > 52 ? "calc(-100% + 20px)" : "-20px"}`,
            }}
          >
            <div className="overflow-hidden rounded-[16px] bg-linen text-forest-deep shadow-[0_24px_50px_-16px_rgb(0_0_0/0.7)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <PlacePhoto place={place.key} sizes="260px" />
              </div>
              <div className="p-4">
                <p className="display text-[1.5rem] leading-none">{place.title}</p>
                <p className="mt-1.5 text-[0.86rem] leading-snug text-forest-deep/75">{place.text}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EstateMap() {
  return (
    <section
      id="karta"
      aria-labelledby="estate-title"
      className="relative isolate overflow-hidden bg-forest-deep py-24 text-linen md:py-36"
    >
      {/* Фон: ролик 29 без титра — только на широком экране */}
      <div aria-hidden className="absolute inset-0 -z-10 max-lg:hidden">
        <LazyVideo video={videos.estateFilmBg} cap={false} ratio={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-forest-deep/80" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_55%,transparent,rgb(20_28_23/0.9))]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-brass">Территория</p>
            <h2
              id="estate-title"
              className="display mt-5 text-[2.8rem] leading-[0.98] md:text-[4.6rem] lg:text-[5.6rem]"
            >
              Усадьба <em className="text-brass">на 2,5 га</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[1.02rem] leading-relaxed text-linen/75">{estate.lead}</p>
          </Reveal>
        </div>

        {/* Телефон и планшет: ролик карточкой + лента мест */}
        <div className="lg:hidden">
          <Reveal className="mt-10">
            <LazyVideo
              video={videos.estateFilmCard}
              cap={false}
              shade
              className="w-full rounded-[20px]"
            />
          </Reveal>
        </div>
      </div>

      <ul
        aria-label="Места усадьбы"
        className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 md:scroll-px-8 md:px-8 lg:hidden"
      >
        {estatePlaces.map((p) => (
          <li key={p.key} className="w-[72vw] max-w-[320px] shrink-0 snap-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-forest">
              <PlacePhoto place={p.key} sizes="(min-width: 768px) 320px, 72vw" />
            </div>
            <p className="display mt-3 text-[1.5rem] leading-none">{p.title}</p>
            <p className="mt-1.5 text-[0.88rem] leading-snug text-linen/70">{p.text}</p>
          </li>
        ))}
      </ul>

      {/* Десктоп: план с точками поверх ролика */}
      <div className="mx-auto mt-14 max-w-[1440px] px-8 max-lg:hidden">
        <MapDesktop />
        <p className="mt-6 text-center text-[0.8rem] text-linen/55">
          Схема условная. Наведите на точку, чтобы посмотреть место
        </p>
      </div>
    </section>
  );
}
