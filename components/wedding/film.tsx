"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Play } from "@phosphor-icons/react";
import { videos } from "@/lib/media";
import { Modal } from "@/components/ui/modal";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/motion";

/*
  «Фильм одной свадьбы»: постер и кнопка, по клику — окно 16:9 с видео и controls.
  Исходник 638×360 без звука, поэтому окно не шире 720px. Видео не грузится, пока окно закрыто.
  TODO(права): фильм снят сторонним автором — нужно разрешение на показ; TODO(медиа): оригинал
  в хорошем качестве и со звуком.
*/

const film = videos.filmDmitryYana;
const DURATION = "56 сек";

export function Film() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <section id="film" aria-labelledby="film-title" className="bg-linen py-24 text-forest-deep md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-saddle">Фильм</p>
          <h2 id="film-title" className="display mt-5 text-[2.8rem] leading-[0.98] md:text-[4.4rem]">
            Фильм <em className="text-saddle">одной свадьбы</em>
          </h2>
          <p className="mt-5 max-w-[36ch] text-[1rem] leading-relaxed text-forest-deep/75">
            Короткий свадебный фильм Дмитрия и Яны, снятый в Буцевичах. Лучше любого описания
            площадки.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          {/* Постер во всю карточку — тоже кнопка; крупная кнопка по центру для глаз */}
          <div className="relative mx-auto aspect-video w-full max-w-[960px] overflow-hidden rounded-[20px] bg-forest-deep shadow-[0_40px_80px_-40px_rgb(20_28_23/0.7)]">
            <Image
              src={film.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="photo-grade object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(20_28_23/0.25),rgb(20_28_23/0.7))]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[10px] rounded-[14px] border border-dashed border-brass/50"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              tabIndex={-1}
              aria-hidden
              className="absolute inset-0 cursor-pointer"
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <Magnetic className="pointer-events-auto inline-flex" strength={0.3}>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="btn btn-brass group gap-3 py-4 pl-3 pr-6 text-[0.95rem] md:py-5 md:pl-4 md:pr-8 md:text-base"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-forest-deep text-brass transition-transform duration-500 group-hover:scale-110 md:size-12">
                    <Play size={18} weight="fill" />
                  </span>
                  Смотреть фильм · {DURATION}
                </button>
              </Magnetic>
            </div>
            <p className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-[0.8rem] text-linen/85 md:p-7">
              «Дмитрий и Яна» · без звука
            </p>
          </div>
        </Reveal>
      </div>

      <Modal open={open} onClose={close} label="Фильм «Дмитрий и Яна»" className="w-[min(100vw-24px,720px)]">
        <div className="overflow-hidden rounded-[12px] bg-black shadow-[0_40px_100px_rgb(0_0_0/0.6)]">
          <video
            className="block aspect-video w-full"
            src={film.src}
            poster={film.poster}
            width={film.width}
            height={film.height}
            controls
            autoPlay
            // Без muted iOS и Android не запускают видео сами (звуковой дорожки в файле и так нет)
            muted
            playsInline
            preload="metadata"
            aria-label={film.alt}
          />
        </div>
        <p className="mt-4 text-center text-[0.85rem] text-linen/70">
          Свадебный фильм «Дмитрий и Яна» в Буцевичах · {DURATION}, без звука
        </p>
      </Modal>
    </section>
  );
}
