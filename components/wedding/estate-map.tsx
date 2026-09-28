import { estate, estatePlaces } from "@/lib/wedding";
import { videos } from "@/lib/media";
import { LazyVideo } from "@/components/ui/lazy-video";
import { Reveal } from "@/components/ui/motion";

/*
  «Усадьба на 2,5 га»: ролик 29 (без титра и людей) фоном на десктопе, карточкой на телефоне,
  и места усадьбы списком карточек. Схемы нет: расположение объектов неизвестно.
  TODO(план): когда клиент пришлёт план территории, можно вернуть схему (координаты — в git-истории).
*/

export function EstateMap() {
  return (
    <section
      id="karta"
      aria-labelledby="estate-title"
      className="relative isolate overflow-hidden bg-forest-deep py-16 text-linen md:py-24"
    >
      {/* Фон: ролик 29 без титра — только на широком экране */}
      <div aria-hidden className="absolute inset-0 -z-10 max-lg:hidden">
        <LazyVideo video={videos.estateFilmBg} cap={false} ratio={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-forest-deep/75" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,transparent,rgb(20_28_23/0.9))]" />
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

        {/* Телефон и планшет: ролик карточкой */}
        <Reveal className="mt-8 lg:hidden">
          <LazyVideo video={videos.estateFilmCard} cap={false} shade className="w-full rounded-[20px]" />
        </Reveal>

        <ul aria-label="Места усадьбы" className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4 lg:mt-16">
          {estatePlaces.map((p, i) => (
            <Reveal
              as="li"
              key={p.key}
              delay={(i % 4) * 0.06}
              y={14}
              className="relative rounded-[16px] border border-linen/12 bg-forest/70 p-3.5 backdrop-blur-sm md:p-6"
            >
              <span aria-hidden className="text-[0.72rem] font-semibold tabular-nums tracking-[0.12em] text-brass">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="display mt-1.5 text-[1.25rem] leading-[1.02] md:mt-2 md:text-[1.75rem]">{p.title}</p>
              <p className="mt-1 text-[0.8rem] leading-snug text-linen/70 md:mt-1.5 md:text-[0.92rem]">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
