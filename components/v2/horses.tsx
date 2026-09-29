import { posterPhoto, videos } from "@/lib/media";
import { addons, horseProgram, horsesV2 as h } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { DuotoneImage, PinnedPhoto } from "./duotone";
import { Figure } from "./figure";
import { GiftStamp } from "./seal";

// TODO(фото): «невеста с двумя лошадьми» — постер ролика 06, всего 288×354: крупно он мягкий, дуотон
// и зерно это частично скрывают. Нужен оригинал в хорошем качестве.
const brideHorses = posterPhoto(videos.brideHorsesSunset);
// Всадники в поле — кадр ролика 27 (720×806)
const riders = posterPhoto(videos.ridersField);

/*
  «Лошади — главные гости»: тёмная винная вкладка. Слева крупный отпечаток «невеста с лошадьми»
  в дуотоне со штампом «в подарок» и приколотым кадром всадников; справа — конюшня на 10 лошадей,
  два подарка к площадке и строка про тематическую программу с ценой.
*/
export function Horses() {
  return (
    <section aria-labelledby="horses-title" className="on-dark tex-dark overflow-x-clip bg-wine py-12 text-ivory md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <p className="v2-eyebrow text-gold-light">Конюшня усадьбы</p>
          <h2
            id="horses-title"
            className="prata mt-5 text-[2.9rem] leading-[0.98] md:text-[4.8rem] lg:text-[5.4rem]"
          >
            Лошади&nbsp;— главные <span className="script text-[1.15em] text-gold-light">гости</span>
          </h2>
          <p className="mt-5 max-w-[42ch] text-[1rem] leading-relaxed text-ivory/85 md:text-[1.1rem]">{h.lead}</p>
        </Reveal>

        {/* Отпечаток: на десктопе — слева на всю высоту колонки */}
        <div className="relative mr-10 sm:mr-24 lg:col-span-5 lg:row-span-2 lg:row-start-1 lg:mr-0">
          <Reveal>
            <figure className="tex paper-shadow relative rotate-[-1.5deg] bg-ivory p-2.5 md:p-3.5">
              <DuotoneImage
                photo={brideHorses}
                sizes="(min-width: 1024px) 460px, 80vw"
                className="aspect-[5/4] w-full md:aspect-[4/5]"
                position="50% 75%"
                parallax
              />
              <figcaption className="px-1 pb-1 pt-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-ink-soft md:text-[0.7rem]">
                Невеста и лошади на закате
              </figcaption>
            </figure>
          </Reveal>
          <GiftStamp
            id="stamp-horses"
            text="выезд невесты верхом · фотосессия с лошадьми · "
            // Наклейка-оттиск на кружке бумаги: поверх светлого неба на фото золото не читалось
            className="paper-shadow absolute -left-2 -top-5 w-[96px] rotate-[-8deg] rounded-full bg-ivory text-wine-soft md:-left-8 md:-top-8 md:w-[132px]"
          />
          {/* Всадники — приколоты к правому нижнему углу отпечатка */}
          <PinnedPhoto rotate={4} className="absolute -bottom-6 -right-10 w-[42%] max-w-[210px] sm:-right-20 lg:-bottom-10 lg:-right-12">
            <DuotoneImage
              photo={riders}
              sizes="(min-width: 1024px) 210px, 40vw"
              className="aspect-[4/5]"
              position="45% 40%"
              tone="ink"
            />
          </PinnedPhoto>
        </div>

        <div className="mt-4 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-8 md:gap-x-12">
            {/* Раздел 1: «конюшня белорусского качества на 10 лошадей» */}
            <Figure
              {...h.stable}
              valueClass="text-[4.6rem] text-ivory md:text-[8.5rem]"
              labelClass="text-gold-light"
            />
            <ul className="grid content-start">
              {h.gifts.map((g, i) => (
                <Reveal
                  as="li"
                  key={g.title}
                  delay={i * 0.08}
                  y={16}
                  className="border-b border-gold/45 py-3.5 first:pt-0 md:py-5"
                >
                  <h3 className="prata text-[1.25rem] leading-[1.15] md:text-[1.75rem]">
                    {g.title}{" "}
                    <span className="script whitespace-nowrap text-[0.95em] text-gold-light">в подарок</span>
                  </h3>
                  <p className="mt-1 text-[0.9rem] leading-relaxed text-ivory/80 md:text-[0.97rem]">{g.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Тематическая программа — одной строкой с ценой */}
          <Reveal className="mt-8 flex flex-col gap-4 border border-gold/50 p-4 sm:flex-row sm:items-end sm:justify-between md:mt-12 md:p-6">
            <div>
              <p className="v2-eyebrow text-gold-light">{addons.program.title}</p>
              <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-relaxed text-ivory/90">
                {horseProgram.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span aria-hidden className="mx-1.5 text-gold"> ◆ </span>}
                    {i > 0 && <span className="sr-only">, </span>}
                    {item}
                  </span>
                ))}
              </p>
            </div>
            <p className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
              <span className="prata text-[2.2rem] leading-none md:text-[2.8rem]">{addons.program.pricePerGuest}</span>
              <span className="v2-eyebrow text-gold-light">руб с гостя</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
