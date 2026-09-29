import { featuredReviews, REVIEWS_TOTAL_LABEL } from "@/lib/wedding";
import { nav, navTarget } from "@/lib/site";
import { Reveal } from "@/components/ui/motion";

// Страница отзывов старого сайта (ссылка из меню, lib/site.ts)
const allReviews = navTarget(nav.find((n) => n.label === "Отзывы")!);

// Записки лежат чуть вразнобой; первая — крупнее
const NOTES = [
  { tilt: -1.2, place: "lg:col-span-7 lg:row-span-2", quote: "text-[1.05rem] md:text-[1.9rem]" },
  { tilt: 1.4, place: "lg:col-span-5 lg:mt-10", quote: "text-[1.05rem] md:text-[1.35rem]" },
  { tilt: -0.8, place: "lg:col-span-5 lg:-ml-8", quote: "text-[1.05rem] md:text-[1.35rem]" },
];

/*
  Отзывы: три разных автора как записки на плотной бумаге, приколотые булавкой. Цитата — Prata,
  подпись — рукописным Marck Script. Тексты — featuredReviews (раздел 16, сокращены без изменения смысла).
*/
export function Reviews() {
  return (
    <section aria-labelledby="reviews-title" className="tex bg-ivory-2 py-12 md:py-28">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="v2-eyebrow text-wine-soft">Отзывы</p>
            <h2
              id="reviews-title"
              className="prata mt-5 text-[2.8rem] leading-[1] text-wine md:text-[4.6rem] lg:text-[5.2rem]"
            >
              Что пишут <span className="script text-[1.15em] text-wine-soft">гости</span>
            </h2>
          </div>
          <a
            href={allReviews.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline w-fit text-[0.92rem] text-ink-soft hover:text-wine md:pb-3"
          >
            {REVIEWS_TOTAL_LABEL} — на verhom.by
          </a>
        </Reveal>

        <ul className="mt-8 grid gap-5 md:mt-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8">
          {featuredReviews.map((r, i) => {
            const n = NOTES[i % NOTES.length];
            return (
              <Reveal as="li" key={r.author} delay={i * 0.08} className={`lg:self-start ${n.place}`}>
                <figure
                  className="tex paper-shadow relative bg-ivory px-5 pb-5 pt-7 md:px-9 md:pb-9 md:pt-11"
                  style={{ transform: `rotate(${n.tilt}deg)` }}
                >
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbefc9,#b8914a_55%,#6b4f22)] shadow-[0_2px_3px_rgb(35_29_26/0.45)]"
                  />
                  <p className="v2-eyebrow text-wine-soft">{r.topic}</p>
                  <blockquote className={`prata mt-3 leading-[1.3] text-ink ${n.quote}`}>
                    «{r.quote}»
                  </blockquote>
                  <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3">
                    <span className="script text-[1.7rem] leading-none text-wine md:text-[1.9rem]">{r.author}</span>
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                      {r.role}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
