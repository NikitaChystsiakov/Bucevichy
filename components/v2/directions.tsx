import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { contacts } from "@/lib/site";
import { directions as d } from "@/lib/wedding";
import { Horseshoe } from "@/components/ui/motifs";
import { Reveal } from "@/components/ui/motion";
import { Figure } from "./figure";

/*
  «Как добраться»: 23 км и 17 минут крупно, кнопки на Яндекс Карты и Google Maps по GPS (без встроенной
  карты), справа — маршрут от МКАД тремя отрезками по разделу 13, пунктиром как на печатной схеме.
*/
export function Directions() {
  return (
    <section aria-labelledby="road-title" className="tex bg-ivory-2 py-12 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="v2-eyebrow text-wine-soft">Дорога</p>
            <h2
              id="road-title"
              className="prata mt-5 text-[2.8rem] leading-[1] text-wine md:text-[4.6rem] lg:text-[5rem]"
            >
              Как <span className="script text-[1.15em] text-wine-soft">добраться</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="mt-8 flex items-end gap-5 md:mt-12 md:gap-10">
            <Figure
              value={String(d.km)}
              unit="км"
              label="от Минска"
              valueClass="text-[4.2rem] text-wine md:text-[7.5rem]"
              labelClass="text-ink-soft"
            />
            <span aria-hidden className="mb-1 w-px self-stretch bg-gold/70" />
            <Figure
              value={String(d.minutes)}
              unit="мин"
              label="на машине от МКАД"
              valueClass="text-[4.2rem] text-wine md:text-[7.5rem]"
              labelClass="text-ink-soft"
            />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 text-[1rem] text-ink md:text-[1.1rem]">
              Трасса Р58 на Мядель, д. Буцевичи
            </p>
            <div className="mt-6 grid gap-2.5 sm:flex">
              <a href={contacts.yandexMaps} target="_blank" rel="noopener noreferrer" className="btn-v2 btn-v2-wine w-full py-4 sm:w-auto">
                Открыть в Яндекс Картах
                <ArrowUpRight size={16} />
              </a>
              <a href={contacts.googleMaps} target="_blank" rel="noopener noreferrer" className="btn-v2 btn-v2-line w-full py-4 text-wine sm:w-auto">
                Google Maps
                <ArrowUpRight size={16} />
              </a>
            </div>
            <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              GPS <span className="tabular-nums">{contacts.geo.lat}, {contacts.geo.lng}</span>
            </p>
          </Reveal>
        </div>

        {/* Маршрут от МКАД: отрезки на пунктирной линии, в конце — подкова «Буцевичи» */}
        <Reveal delay={0.1} className="lg:col-span-6 lg:pt-4">
          <h3 className="v2-eyebrow text-wine-soft">На машине от МКАД</h3>
          <ol className="relative mt-5">
            <span aria-hidden className="absolute bottom-6 left-[0.3rem] top-2 border-l border-dashed border-gold" />
            {d.route.map((leg) => (
              <li key={leg.dist} className="relative grid grid-cols-[1.2rem_4.3rem_1fr] items-baseline gap-x-3 pb-5 md:grid-cols-[1.6rem_6rem_1fr] md:pb-8">
                <span aria-hidden className="size-2.5 translate-y-[-0.1em] rotate-45 border border-gold bg-ivory-2" />
                <span className="prata whitespace-nowrap text-[2rem] leading-none text-wine md:text-[2.8rem]">
                  {leg.dist}
                  <span className="ml-1 text-[0.45em] text-ink-soft">{leg.unit}</span>
                </span>
                <span className="text-[0.92rem] leading-snug text-ink">{leg.text}</span>
              </li>
            ))}
            <li className="relative grid grid-cols-[1.2rem_1fr] items-center gap-x-3 md:grid-cols-[1.6rem_1fr]">
              <Horseshoe size={18} className="-ml-1 text-wine" />
              <span className="prata text-[1.5rem] text-wine md:text-[1.8rem]">Буцевичи</span>
            </li>
          </ol>
          <p className="mt-6 border-t border-gold/50 pt-5 text-[0.92rem] leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">Без машины:</span> {d.bus}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
