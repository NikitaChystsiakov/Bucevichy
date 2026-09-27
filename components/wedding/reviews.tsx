import { placeReviews, weddingReview } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { DemoLink } from "@/components/site/demo-link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";

export function Reviews() {
  return (
    <section aria-labelledby="reviews-title" className="bg-forest py-24 text-linen md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <h2 id="reviews-title" className="sr-only">
          Отзывы гостей
        </h2>

        <figure className="grid gap-8 lg:grid-cols-12">
          <Reveal className="display text-[7rem] leading-[0.6] text-brass lg:col-span-1" y={10}>
            <span aria-hidden>«</span>
          </Reveal>
          <div className="lg:col-span-10">
            <Reveal>
              <blockquote className="display text-[1.75rem] leading-[1.2] md:text-[2.7rem] md:leading-[1.15]">
                {weddingReview.quote}
              </blockquote>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[56ch] text-[1.05rem] leading-relaxed text-linen/70">
                {weddingReview.extra}
              </p>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="h-px w-10 bg-brass" aria-hidden />
                <span>
                  <span className="block text-linen">{weddingReview.author}</span>
                  <span className="block text-sm text-linen/70">{weddingReview.role}</span>
                </span>
              </figcaption>
            </Reveal>
          </div>
        </figure>

        <div className="mt-24 grid gap-10 border-t border-linen/10 pt-12 md:mt-32 md:grid-cols-[1.25fr_1fr_0.9fr] md:gap-12">
          {placeReviews.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.1}>
              <figure className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-6" : ""}>
                <blockquote className="text-[1.05rem] leading-relaxed text-linen/90">«{r.quote}»</blockquote>
                <figcaption className="mt-4 text-sm text-linen/70">
                  {r.author}, {r.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <DemoLink
            link={{ label: "Более 50 отзывов с 2014 года", href: "/otzyvy" }}
            className="link-underline inline-flex items-center gap-2 text-linen"
          />
          <ArrowUpRight size={16} className="ml-1 inline text-brass" aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
