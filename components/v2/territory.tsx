import { instaPhotos, posterPhoto, videos } from "@/lib/media";
import { territory, territoryFigures as fig } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { DuotoneImage, PinnedPhoto } from "./duotone";
import { GiftStamp } from "./seal";

const t = Object.fromEntries(territory.map((item) => [item.key, item])) as Record<
  (typeof territory)[number]["key"],
  (typeof territory)[number]
>;

// TODO(фото): кадр «невеста с двумя лошадьми» — постер ролика 06, всего 288×354. Поэтому плитка
// с ним не шире ~480px; нужен оригинал в хорошем качестве.
const brideHorses = posterPhoto(videos.brideHorsesSunset);

// Цифра крупно + подпись мелким капсом
function Figure({
  prefix,
  value,
  unit,
  label,
  valueClass,
  labelClass,
}: {
  prefix?: string;
  value: string;
  unit?: string;
  label: string;
  valueClass: string;
  labelClass: string;
}) {
  return (
    <div>
      <p className={`prata flex items-baseline leading-[0.85] ${valueClass}`}>
        {prefix && <span className="mr-2 text-[0.3em]">{prefix}</span>}
        <span>{value}</span>
        {unit && <span className="ml-1.5 text-[0.36em]">{unit}</span>}
      </p>
      <p className={`mt-3 text-[0.64rem] font-semibold uppercase tracking-[0.12em] md:text-[0.7rem] md:tracking-[0.18em] ${labelClass}`}>
        {label}
      </p>
    </div>
  );
}

/*
  «Всё для свадьбы — на одной территории»: тёмная винная секция, асимметричная сетка (bento).
  Большая плитка — невеста с лошадьми в дуотоне и штамп «в подарок»; рядом огромные цифры
  с подписями мелким капсом; фото «приколоты» к краям карточек.
*/
export function Territory() {
  return (
    <section aria-labelledby="territory-title" className="on-dark tex-dark bg-wine py-16 text-ivory md:py-28">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9">
            <p className="v2-eyebrow text-gold-light">Площадка · 23 км от Минска</p>
            <h2
              id="territory-title"
              className="prata mt-5 text-[2.7rem] leading-[1] md:text-[4.6rem] lg:text-[5.4rem]"
            >
              Всё для свадьбы&nbsp;— на&nbsp;одной <span className="script text-[1.15em] text-gold-light">территории</span>
            </h2>
          </div>
          <p className="max-w-[40ch] text-[0.98rem] leading-relaxed text-ivory/85 lg:col-span-3 lg:pb-3">
            Более 2,5 гектар благоустроенной территории: беседки, лаунж-зоны, терраса для танцпола и вечерняя
            подсветка ретро-гирляндами.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-12 lg:gap-5">
          {/* A. Невеста с лошадьми — большая плитка */}
          <Reveal as="li" className="col-span-2 lg:col-span-5 lg:row-span-2">
            <article className="tex relative h-full bg-ivory p-3 text-ink md:p-4">
              <div className="relative">
                <DuotoneImage
                  photo={brideHorses}
                  sizes="(min-width: 1024px) 460px, 92vw"
                  className="aspect-[4/5] max-h-[560px] w-full"
                  position="50% 70%"
                  parallax
                />
                <GiftStamp
                  text="выезд невесты верхом · фотосессия с лошадьми · "
                  className="absolute right-2 top-2 w-[104px] rotate-[-8deg] text-wine-soft mix-blend-multiply md:-right-2 md:-top-4 md:w-[136px]"
                />
              </div>
              <div className="px-2 pb-3 pt-5 md:px-3">
                <h3 className="prata text-[1.6rem] leading-[1.1] text-wine md:text-[2rem]">{t.horses.title}</h3>
                <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-relaxed text-ink-soft">{t.horses.text}</p>
              </div>
            </article>
          </Reveal>

          {/* B. Зал 170 м² — огромная цифра и приколотое фото */}
          <Reveal as="li" delay={0.08} className="col-span-2 lg:col-span-7">
            <article className="tex relative h-full bg-ivory-2 px-5 pb-6 pt-6 text-ink md:px-8 md:py-9">
              <Figure
                {...fig.hall}
                valueClass="text-[5.6rem] text-wine md:text-[8.5rem] lg:text-[9.5rem]"
                labelClass="text-ink-soft"
              />
              {/* На телефоне текст и фото рядом под цифрой, с 768 — фото приколото к правому верхнему углу */}
              <div className="mt-5 grid grid-cols-[1fr_42%] items-start gap-4 md:mt-6 md:block">
                <div className="md:max-w-[52%]">
                  <h3 className="prata text-[1.25rem] leading-snug text-wine md:text-[1.6rem]">{t.hall.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{t.hall.text}</p>
                </div>
                <PinnedPhoto
                  rotate={2.5}
                  className="-mr-2 md:absolute md:-top-7 md:right-8 md:mr-0 md:w-[36%] md:max-w-[240px]"
                >
                  <DuotoneImage
                    photo={instaPhotos.hallTable}
                    sizes="(min-width: 768px) 240px, 40vw"
                    className="aspect-[3/4]"
                    position="50% 40%"
                  />
                </PinnedPhoto>
              </div>
            </article>
          </Reveal>

          {/* C. До 100 гостей — цифра без карточки, только золотая рамка */}
          <Reveal as="li" delay={0.12} className="col-span-1 lg:col-span-3">
            <div className="flex h-full flex-col justify-between gap-6 border border-gold/50 p-4 md:p-6">
              {/* Раздел 7: «проводим свадьбы в усадьбе с 2013 года от маленьких камерных мероприятий…» */}
              <p className="text-[0.85rem] leading-snug text-ivory/80 md:text-[0.92rem]">
                Свадьбы с 2013 года, в том числе маленькие камерные
              </p>
              <Figure
                {...fig.guests}
                valueClass="text-[3.6rem] text-ivory md:text-[5.2rem]"
                labelClass="text-gold-light"
              />
            </div>
          </Reveal>

          {/* E. 2,5 га — единственная фольга на этом экране */}
          <Reveal as="li" delay={0.16} className="col-span-1 lg:col-span-4">
            <div className="flex h-full flex-col justify-between gap-6 border border-gold/50 p-4 md:p-6">
              {/* Раздел 13: «23 км от Минска, 17 мин на машине от МКАД» */}
              <p className="text-[0.85rem] leading-snug text-ivory/80 md:text-[0.92rem]">17 минут на машине от МКАД</p>
              <Figure
                {...fig.area}
                valueClass="foil-on-dark text-[3.6rem] md:text-[5.2rem]"
                labelClass="text-gold-light"
              />
            </div>
          </Reveal>

          {/* D. Регистрация у арки — фото приколото к левому краю */}
          <Reveal as="li" delay={0.08} className="col-span-2 lg:col-span-7">
            <article className="tex relative grid h-full items-center gap-5 bg-ivory px-5 pb-6 pt-8 text-ink sm:grid-cols-[0.95fr_1fr] md:gap-8 md:px-8 md:py-9">
              <PinnedPhoto rotate={-2} className="w-full sm:-ml-10 sm:-mt-2 md:-ml-14">
                <DuotoneImage
                  photo={instaPhotos.ceremonyMeadow}
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="aspect-[4/3]"
                  position="45% 60%"
                  tone="ink"
                />
              </PinnedPhoto>
              <div>
                <h3 className="prata text-[1.5rem] leading-[1.1] text-wine md:text-[1.9rem]">{t.arch.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{t.arch.text}</p>
              </div>
            </article>
          </Reveal>

          {/* F. Ночлег до 40 гостей и баня */}
          <Reveal as="li" delay={0.12} className="col-span-2 lg:col-span-5">
            <article className="flex h-full flex-col justify-between gap-5 bg-wine-soft/35 px-5 py-6 ring-1 ring-inset ring-ivory/15 md:px-8 md:py-9">
              <Figure
                {...fig.stay}
                valueClass="text-[4.2rem] text-ivory md:text-[5.6rem]"
                labelClass="text-gold-light"
              />
              <div>
                <h3 className="prata text-[1.35rem] leading-snug md:text-[1.6rem]">{t.stay.title}</h3>
                <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-relaxed text-ivory/85">{t.stay.text}</p>
              </div>
            </article>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
