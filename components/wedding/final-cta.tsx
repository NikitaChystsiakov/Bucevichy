import Image from "next/image";
import { MapPin } from "@phosphor-icons/react/ssr";
import { instaPhotos } from "@/lib/media";
import { contacts } from "@/lib/site";
import { ContactButtons } from "@/components/site/contact-buttons";
import { LeadForm } from "@/components/site/lead-form";
import { Reveal } from "@/components/ui/motion";

/*
  Фото 20 (пара среди холодных фонтанов ночью), портретное 1083×1679.
  - До 1280px: фото фоном на весь блок под затемнением, текст и форма одной колонкой; телефоны и адрес
    на тёмной подложке — поверх ярких искр иначе не читаются.
  - От 1280px: три зоны — текст слева, форма в центре, фото полосой справа (36%), растворяется в
    темноте слева. Форма не закрывает пару, кадр не растягивается (масштаб ≤ 0,7).
  После успешной заявки в форме — «взрыв» лепестков (lead-form.tsx).
*/
const bg = instaPhotos.nightSparklers;

export function FinalCta() {
  return (
    <section
      id="zapis"
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden bg-forest-deep py-24 text-linen md:py-36"
    >
      <div aria-hidden className="absolute inset-y-0 right-0 -z-20 w-full xl:w-[36%]">
        <Image
          src={bg.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 36vw, 100vw"
          className="photo-grade object-cover object-[50%_35%]"
        />
      </div>
      {/* До 1280px — затемнение сверху вниз; от 1280px — растворение фото влево и виньетка */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(20_28_23/0.78)_0%,rgb(20_28_23/0.6)_30%,rgb(20_28_23/0.82)_62%,rgb(20_28_23/0.95)_100%)] xl:bg-[linear-gradient(90deg,rgb(20_28_23)_0%,rgb(20_28_23)_63%,rgb(20_28_23/0.6)_71%,rgb(20_28_23/0.12)_86%,rgb(20_28_23/0.08)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[linear-gradient(180deg,rgb(20_28_23/0.55)_0%,transparent_22%,transparent_72%,rgb(20_28_23/0.7)_100%)] xl:block"
      />
      {/* Тёплое свечение фонтанов */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_70%_40%,rgb(232_161_92/0.14),transparent_70%)] xl:bg-[radial-gradient(28%_40%_at_84%_45%,rgb(232_161_92/0.14),transparent_70%)]"
      />

      <div className="mx-auto grid max-w-[640px] gap-14 px-4 md:px-8 xl:max-w-[1400px] xl:grid-cols-12 xl:gap-10">
        <Reveal className="xl:col-span-5">
          <p className="eyebrow text-brass">Запись</p>
          <h2
            id="cta-title"
            className="display mt-5 max-w-[13ch] text-[2.9rem] leading-[0.98] [text-shadow:0_2px_30px_rgb(20_28_23/0.6)] md:text-[4.6rem] xl:text-[4.8rem]"
          >
            Узнайте, свободна ли <em className="text-brass">ваша</em> дата
          </h2>
          <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-linen/90 [text-shadow:0_1px_16px_rgb(20_28_23/0.8)]">
            Всё только по предварительной записи. Позвоните, напишите в Viber или Telegram, или
            оставьте телефон, и мы перезвоним.
          </p>

          <ContactButtons className="mt-8 max-w-[460px]" />

          {/* Подложка до 1280px: под этим текстом яркие искры фото */}
          <div className="mt-8 grid gap-6 rounded-[20px] border border-linen/10 bg-forest-deep/85 p-5 backdrop-blur-sm md:p-6 xl:mt-10 xl:gap-10 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:backdrop-blur-none">
            <div className="grid gap-2 text-[0.95rem]">
              <a
                href={contacts.phoneMain.href}
                className="w-fit text-[1.9rem] font-light tabular-nums tracking-[-0.02em] transition-colors hover:text-brass"
              >
                {contacts.phoneMain.display}
              </a>
              <a href={contacts.phoneSecond.href} className="w-fit tabular-nums text-linen/90 hover:text-linen">
                {contacts.phoneSecond.display}
              </a>
            </div>

            <div className="flex max-w-[44ch] gap-3 text-[0.95rem] leading-relaxed text-linen/90">
              <MapPin size={20} className="mt-0.5 shrink-0 text-brass" />
              <p>
                {contacts.address}, 17 минут от МКАД.
                <span className="mt-2 flex gap-5">
                  <a href={contacts.yandexMaps} target="_blank" rel="noopener noreferrer" className="link-underline text-linen">
                    Яндекс Карты
                  </a>
                  <a href={contacts.googleMaps} target="_blank" rel="noopener noreferrer" className="link-underline text-linen">
                    Google Maps
                  </a>
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="xl:col-span-4 xl:col-start-6 xl:self-center">
          <div
            data-dock-hide
            className="relative rounded-[20px] border border-linen/15 bg-forest-deep/85 p-6 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] backdrop-blur-md md:p-8"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[6px] rounded-[15px] border border-dashed border-brass/25"
            />
            <div className="relative">
              <h3 className="display text-[1.9rem] leading-tight">Оставить заявку</h3>
              <p className="mb-6 mt-1 text-sm text-linen/80">Перезвоним и расскажем о свободных датах</p>
              <LeadForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
