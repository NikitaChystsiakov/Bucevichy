import { posterPhoto, videos } from "@/lib/media";
import { dayProgram } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { DuotoneImage } from "./duotone";
import { SprigIll } from "./illustrations";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

// Лошади в леваде — кадр ролика 26 (720×1280)
const paddock = posterPhoto(videos.horsesPaddock);

/*
  «Программа дня» — как печатная программа: на десктопе слева большой заголовок и фото в дуотоне
  (колонка прилипает), справа пункты с римскими номерами I–VI. Без рамки, без времени —
  с пометкой «примерный сценарий».
*/
export function Program() {
  return (
    <section aria-labelledby="program-title" className="tex bg-ivory-2 py-16 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <p className="v2-eyebrow text-wine-soft">Один день в Буцевичах</p>
              <h2
                id="program-title"
                className="prata mt-4 text-[3.3rem] leading-[0.95] text-wine md:text-[5.6rem] lg:text-[4.5rem] xl:text-[5.1rem]"
              >
                Программа дня
              </h2>
              <p className="script mt-2 text-[1.8rem] text-wine-soft md:text-[2.2rem]">примерный сценарий</p>
            </Reveal>
            <DuotoneImage
              photo={paddock}
              sizes="(min-width: 1024px) 420px, 92vw"
              className="mt-8 aspect-[16/10] w-full lg:aspect-[4/5]"
              position="50% 58%"
              tone="ink"
              parallax
            />
          </div>
        </div>

        <ol className="lg:col-span-7 lg:pt-6">
          {dayProgram.map((step, i) => (
            <Reveal
              as="li"
              key={step.key}
              delay={i * 0.06}
              y={18}
              className="grid grid-cols-[3.6rem_1fr] gap-x-4 border-b border-gold/45 py-6 first:pt-0 md:grid-cols-[6rem_1fr] md:gap-x-6 md:py-8"
            >
              <span aria-hidden className="prata text-[2.4rem] leading-none text-wine-soft md:text-[3.6rem]">
                {ROMAN[i]}
              </span>
              <div className="pt-1 md:pt-2">
                <h3 className="prata text-[1.45rem] leading-[1.15] text-ink md:text-[2rem]">
                  {step.title}
                  {step.gift && (
                    <span className="script ml-3 whitespace-nowrap text-[0.9em] text-wine-soft">в подарок</span>
                  )}
                </h3>
                <p className="mt-2 max-w-[48ch] text-[0.97rem] leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
          <li aria-hidden className="list-none pt-8">
            <SprigIll className="h-7 w-auto text-gold" />
          </li>
        </ol>
      </div>
    </section>
  );
}
