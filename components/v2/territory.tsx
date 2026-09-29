import { instaPhotos } from "@/lib/media";
import { territoryFigures as fig, territoryV2 as t } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { DuotoneImage, PinnedPhoto } from "./duotone";
import { Figure } from "./figure";
import { SprigIll } from "./illustrations";

/*
  «Всё для свадьбы — на одной территории»: светлая секция после открытки, асимметричная сетка (bento).
  Только территория: регистрация у арки, 2,5 га, терраса с гирляндами, ночлег. Лошади и зал — в своих
  блоках ниже, дорога — в «Как добраться».
*/
export function Territory() {
  return (
    <section aria-labelledby="territory-title" className="tex bg-ivory py-12 md:py-28">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="v2-eyebrow text-wine-soft">Площадка</p>
            <h2
              id="territory-title"
              className="prata mt-5 text-[2.7rem] leading-[1] text-wine md:text-[4.6rem] lg:text-[5.2rem]"
            >
              Всё для свадьбы&nbsp;— на&nbsp;одной{" "}
              <span className="script text-[1.15em] text-wine-soft">территории</span>
            </h2>
          </div>
          <p className="max-w-[40ch] text-[0.98rem] leading-relaxed text-ink-soft max-md:hidden lg:col-span-4 lg:pb-3">
            {t.lead}
          </p>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Регистрация у арки — большая плитка с фото луга */}
          <Reveal as="li" className="col-span-2 lg:col-span-7 lg:row-span-2">
            <article className="tex relative h-full bg-ivory-2 p-3 md:p-4">
              <DuotoneImage
                photo={instaPhotos.ceremonyMeadow}
                sizes="(min-width: 1024px) 700px, 92vw"
                className="aspect-[4/3] w-full"
                position="45% 60%"
                tone="ink"
                parallax
              />
              <div className="px-2 pb-3 pt-5 md:px-3 md:pt-6">
                <h3 className="prata text-[1.55rem] leading-[1.1] text-wine md:text-[2.2rem]">{t.arch.title}</h3>
                <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-soft">{t.arch.text}</p>
              </div>
            </article>
          </Reveal>

          {/* 2,5 га — вино и фольга, единственная фольга в секции */}
          <Reveal as="li" delay={0.08} className="col-span-1 lg:col-span-5">
            <div className="on-dark tex-dark flex h-full flex-col justify-between gap-8 bg-wine p-4 text-ivory md:p-7">
              <SprigIll className="h-6 w-auto self-start text-gold-light" />
              <Figure
                {...fig.area}
                valueClass="foil-on-dark text-[3.6rem] md:text-[6.4rem]"
                labelClass="text-gold-light"
              />
            </div>
          </Reveal>

          {/* Ночлег: на телефоне — рядом с 2,5 га, на десктопе — полоса во всю ширину внизу */}
          <Reveal as="li" delay={0.12} className="col-span-1 lg:order-last lg:col-span-12">
            <article className="flex h-full flex-col justify-between gap-5 border border-gold/60 p-4 md:p-7 lg:flex-row lg:items-end lg:gap-12">
              <Figure
                {...fig.stay}
                valueClass="text-[3.6rem] text-wine md:text-[5.6rem]"
                labelClass="text-ink-soft"
                className="shrink-0"
              />
              <div className="lg:max-w-[62ch] lg:pb-1">
                <h3 className="prata text-[1.15rem] leading-snug text-wine md:text-[1.6rem]">{t.stay.title}</h3>
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-soft md:mt-2 md:text-[0.95rem]">
                  {t.stay.text}
                </p>
              </div>
            </article>
          </Reveal>

          {/* Терраса и гирлянды — ночное фото приколото к краю */}
          <Reveal as="li" delay={0.16} className="col-span-2 lg:col-span-5">
            <article className="tex relative grid h-full grid-cols-[42%_1fr] items-center gap-5 bg-ivory-2 px-4 py-6 md:gap-7 md:px-7 md:py-8">
              <PinnedPhoto rotate={-2.5} className="-ml-1 md:-ml-3">
                <DuotoneImage
                  photo={instaPhotos.nightGazeboSign}
                  sizes="(min-width: 1024px) 200px, 40vw"
                  className="aspect-[4/5]"
                  position="50% 40%"
                />
              </PinnedPhoto>
              <div>
                <h3 className="prata text-[1.3rem] leading-[1.1] text-wine md:text-[1.7rem]">{t.evening.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">{t.evening.text}</p>
              </div>
            </article>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
