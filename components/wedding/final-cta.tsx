import Image from "next/image";
import { MapPin } from "@phosphor-icons/react/ssr";
import { photos } from "@/lib/photos";
import { contacts } from "@/lib/site";
import { ContactButtons } from "@/components/site/contact-buttons";
import { LeadForm } from "@/components/site/lead-form";
import { Reveal } from "@/components/ui/motion";

export function FinalCta() {
  return (
    <section
      id="zapis"
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden bg-forest py-24 text-linen md:py-36"
    >
      <Image
        src={photos.chaletDay.src}
        alt=""
        fill
        sizes="100vw"
        className="photo-grade -z-20 object-cover opacity-45"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(20_28_23/0.95)_0%,rgb(20_28_23/0.8)_50%,rgb(20_28_23/0.55)_100%)]"
        aria-hidden
      />

      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <h2 id="cta-title" className="display max-w-[14ch] text-[2.8rem] leading-[1.02] md:text-[4.6rem]">
            Узнайте, свободна ли <em className="text-brass">ваша</em> дата
          </h2>
          <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-linen/70">
            Всё только по предварительной записи. Позвоните, напишите в Viber или Telegram, или
            оставьте телефон, и мы перезвоним.
          </p>

          <ContactButtons className="mt-8 max-w-[460px]" />

          <div className="mt-10 grid gap-2 text-[0.95rem]">
            <a href={contacts.phoneMain.href} className="w-fit text-2xl tabular-nums hover:text-brass">
              {contacts.phoneMain.display}
            </a>
            <a href={contacts.phoneSecond.href} className="w-fit tabular-nums text-linen/70 hover:text-linen">
              {contacts.phoneSecond.display}
            </a>
          </div>

          <div className="mt-10 flex max-w-[44ch] gap-3 text-[0.95rem] leading-relaxed text-linen/70">
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
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-8">
          <div className="rounded-[20px] border border-linen/10 bg-forest-deep/70 p-6 backdrop-blur-md md:p-8">
            <h3 className="display text-[1.9rem] leading-tight">Оставить заявку</h3>
            <p className="mb-6 mt-1 text-sm text-linen/70">Перезвоним и расскажем о свободных датах</p>
            <LeadForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
