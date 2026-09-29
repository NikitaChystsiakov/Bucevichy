import { instaPhotos } from "@/lib/media";
import { photos } from "@/lib/photos";
import { hallV2 as h } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { DuotoneImage, PinnedPhoto } from "./duotone";
import { Figure } from "./figure";

/*
  «Зал»: огромные цифры 170 м² и до 100 гостей, короткий абзац, что входит — список с золотыми
  ромбами. Справа крупное фото зала в дуотоне (солнце из окон в пол) и приколотый кадр стола.
*/
export function Hall() {
  return (
    <section aria-labelledby="hall-title" className="tex bg-ivory-2 py-12 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="v2-eyebrow text-wine-soft">Банкетный зал</p>
            <h2
              id="hall-title"
              className="prata mt-5 text-[2.8rem] leading-[1] text-wine md:text-[4.6rem] lg:text-[4.8rem]"
            >
              Светлый зал с&nbsp;окнами <span className="script text-[1.15em] text-wine-soft">в пол</span>
            </h2>
          </Reveal>

          {/* Две огромные цифры через золотую вертикаль */}
          <Reveal delay={0.08} className="mt-7 flex items-end gap-5 md:mt-12 md:gap-10">
            <Figure
              {...h.figures.area}
              valueClass="text-[3.8rem] text-wine min-[400px]:text-[4.3rem] md:text-[8.5rem] lg:text-[6.2rem] xl:text-[7rem]"
              labelClass="text-ink-soft"
            />
            <span aria-hidden className="mb-1 w-px self-stretch bg-gold/70" />
            <Figure
              {...h.figures.guests}
              valueClass="text-[3.8rem] text-wine min-[400px]:text-[4.3rem] md:text-[8.5rem] lg:text-[6.2rem] xl:text-[7rem]"
              labelClass="text-ink-soft"
            />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-[46ch] text-[1rem] leading-relaxed text-ink-soft md:mt-10 md:text-[1.05rem]">
              {h.text}
            </p>
          </Reveal>
        </div>

        {/* Крупное фото зала и приколотый кадр стола */}
        <div className="relative mb-6 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mb-0 lg:pt-4">
          <Reveal>
            <DuotoneImage
              photo={photos.hallSun}
              sizes="(min-width: 1024px) 580px, 92vw"
              className="aspect-[4/3] w-full lg:aspect-[5/6]"
              position="42% 60%"
              parallax
            />
          </Reveal>
          <PinnedPhoto
            rotate={3}
            className="absolute -bottom-6 right-3 w-[34%] max-w-[210px] md:right-6 lg:-bottom-10 lg:-left-10 lg:right-auto"
          >
            <DuotoneImage
              photo={instaPhotos.hallTable}
              sizes="(min-width: 1024px) 210px, 34vw"
              className="aspect-[3/4]"
              position="50% 40%"
              tone="ink"
            />
          </PinnedPhoto>
        </div>

        {/* Что входит: пункты про зал из «в стоимость входит» (раздел 7) */}
        <Reveal className="lg:col-span-6 lg:row-start-2">
          <h3 className="v2-eyebrow text-wine-soft">В стоимость площадки входит</h3>
          <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
            {h.includes.map((item) => (
              <li key={item} className="flex gap-3 border-b border-gold/40 py-2.5 text-[0.95rem] md:py-3 leading-snug text-ink">
                <span aria-hidden className="mt-[0.45em] size-1.5 shrink-0 rotate-45 bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
