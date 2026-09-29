import { posterPhoto, videos } from "@/lib/media";
import { dayProgram } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { DuotoneImage } from "./duotone";
import { SprigIll } from "./illustrations";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

// Лошади в леваде — кадр ролика 26 (720×1280)
const paddock = posterPhoto(videos.horsesPaddock);

/*
  «Программа дня» — как печатная программа: только названия моментов с римскими номерами через
  золотые линии, без времени и описаний (подробности — в блоках «Лошади», «Зал» и других).
  На десктопе слева большой заголовок и фото в дуотоне (колонка прилипает).
*/
export function Program() {
  return (
    <section aria-labelledby="program-title" className="tex bg-ivory py-12 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {/* На телефоне и планшете заголовок во всю ширину, под ним подпись и фото рядом */}
          <div className="grid grid-cols-[1fr_42%] items-end gap-x-5 lg:sticky lg:top-24 lg:block">
            <Reveal className="col-span-2">
              <p className="v2-eyebrow text-wine-soft">Один день в Буцевичах</p>
              <h2
                id="program-title"
                className="prata mt-4 text-[clamp(2.6rem,12vw,3rem)] leading-[0.95] text-wine md:text-[5.6rem] lg:text-[4.5rem] xl:text-[5.1rem]"
              >
                Программа дня
              </h2>
            </Reveal>
            <p className="script self-end pb-1 text-[1.7rem] leading-tight text-wine-soft md:text-[2.2rem] lg:mt-2 lg:pb-0">
              примерный сценарий
            </p>
            <DuotoneImage
              photo={paddock}
              sizes="(min-width: 1024px) 420px, 42vw"
              className="mt-4 aspect-[4/3] w-full md:aspect-[3/4] lg:mt-8 lg:aspect-[4/5]"
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
              className="grid grid-cols-[3.4rem_1fr] items-baseline gap-x-4 border-b border-gold/45 py-4 first:pt-0 md:grid-cols-[6rem_1fr] md:gap-x-6 md:py-7"
            >
              <span aria-hidden className="prata text-[2.2rem] leading-none text-wine-soft md:text-[3.6rem]">
                {ROMAN[i]}
              </span>
              <h3 className="prata text-[1.4rem] leading-[1.15] text-ink md:text-[2.1rem]">{step.title}</h3>
            </Reveal>
          ))}
          <li aria-hidden className="list-none pt-6 md:pt-8">
            <SprigIll className="h-7 w-auto text-gold" />
          </li>
        </ol>
      </div>
    </section>
  );
}
