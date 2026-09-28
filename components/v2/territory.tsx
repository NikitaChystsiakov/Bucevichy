import { territory, type TerritoryKey } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { ArchIll, HallIll, HorseIll, HouseIll } from "./illustrations";

const art: Record<TerritoryKey, typeof ArchIll> = {
  arch: ArchIll,
  hall: HallIll,
  horses: HorseIll,
  stay: HouseIll,
};

// «Всё для свадьбы — на одной территории»: четыре открытки на тёмном шалфее.
// На телефоне — строки «рисунок слева, текст справа», чтобы блок уместился в экран.
export function Territory() {
  return (
    <section aria-labelledby="territory-title" className="on-dark tex-dark bg-sage-deep py-14 text-paper md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <p className="v2-eyebrow text-paper/90">23 км от Минска · 2,5 га</p>
          <h2 id="territory-title" className="prata mt-4 text-[2rem] leading-[1.12] md:text-[3.2rem]">
            Всё для свадьбы — на&nbsp;одной <span className="script text-[1.2em] text-terra-soft">территории</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[0.98rem] leading-relaxed text-paper/85">
            Более 2,5 гектар благоустроенной территории: беседки, лаунж-зоны, терраса для танцпола и вечерняя
            подсветка ретро-гирляндами.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {territory.map((item, i) => {
            const Art = art[item.key];
            return (
              <Reveal as="li" key={item.key} delay={i * 0.08} className="grid">
                {/* Открытка — внутренняя обёртка: на motion-элементе Reveal остаётся инлайн transform,
                    и наклон из CSS (:hover) на нём не сработал бы. Соседние наклоняются в разные стороны */}
                <div
                  className={`postcard invite-frame flex items-center gap-4 bg-paper/[0.04] px-6 py-6 text-sage [--corner:16px] md:flex-col md:items-start md:gap-5 md:p-7 ${
                    i % 2 ? "[--tilt:0.8deg]" : ""
                  }`}
                >
                  <span className="grid h-[72px] w-[80px] shrink-0 place-items-center text-terra-soft md:h-[120px] md:w-full md:place-items-start">
                    <Art className="h-full w-full md:w-auto" strokeWidth={item.key === "hall" || item.key === "horses" ? 2.2 : 1.9} />
                  </span>
                  <div className="grid gap-1.5 text-paper">
                    <h3 className="prata text-[1.12rem] leading-snug md:text-[1.35rem]">{item.title}</h3>
                    <p className="text-[0.9rem] leading-snug text-paper/80 md:text-[0.95rem]">{item.text}</p>
                    {item.gift && (
                      <span className="script mt-1 w-fit rounded-full bg-terra-soft px-3 py-0.5 text-[1.1rem] leading-snug text-ink">
                        в подарок
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
