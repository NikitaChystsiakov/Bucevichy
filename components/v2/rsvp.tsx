import { contacts } from "@/lib/site";
import { ContactButtons } from "@/components/site/contact-buttons";
import { LeadForm } from "@/components/site/lead-form";
import { Reveal } from "@/components/ui/motion";
import { WaxSeal } from "./seal";

/*
  «Ждём вас в Буцевичах»: финал на вине. Справа — карточка-ответ на приглашение (RSVP): крупный
  телефон, Viber и Telegram, та же форма заявки (LeadForm, оформление v2), на углу — сургучная печать.
  Якорь «Контакты» (#kontakty) — здесь.
*/
export function Rsvp() {
  return (
    <section
      id="kontakty"
      aria-labelledby="rsvp-title"
      className="on-dark tex-dark scroll-mt-16 overflow-x-clip bg-wine py-12 text-ivory md:py-28"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5 lg:pt-8">
          <p className="v2-eyebrow text-gold-light">Ответ на приглашение</p>
          <h2 id="rsvp-title" className="prata mt-5 text-[2.9rem] leading-[1] md:text-[4.8rem] lg:text-[4.2rem] xl:text-[4.6rem]">
            Ждём вас <span className="script block whitespace-nowrap text-[1.1em] text-gold-light">в Буцевичах</span>
          </h2>
          <p className="mt-5 max-w-[38ch] text-[1rem] leading-relaxed text-ivory/85 md:mt-6 md:text-[1.1rem]">
            Оставьте телефон — перезвоним и скажем, свободна ли ваша дата.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="relative lg:col-span-7">
          <div className="tex paper-shadow relative bg-ivory px-5 pb-7 pt-8 text-ink md:px-10 md:pb-10 md:pt-11 lg:rotate-[0.8deg]">
            <span aria-hidden className="pointer-events-none absolute inset-[6px] border border-gold/50" />
            <WaxSeal
              id="rsvp-seal"
              className="absolute -right-3 -top-7 w-[64px] rotate-[14deg] drop-shadow-[0_6px_10px_rgb(35_29_26/0.35)] md:-right-8 md:-top-9 md:w-[92px]"
            />
            <div className="relative">
              <p className="v2-eyebrow text-wine-soft">Узнать свободную дату</p>
              <a
                href={contacts.phoneMain.href}
                className="prata mt-3 block w-fit whitespace-nowrap text-[2rem] leading-none tabular-nums text-wine hover:text-wine-soft min-[400px]:text-[2.2rem] md:text-[3.2rem]"
              >
                {contacts.phoneMain.display}
              </a>
              <p className="mt-2 text-[0.88rem] text-ink-soft">
                Viber и Telegram — на этот номер · ещё{" "}
                <a href={contacts.phoneSecond.href} className="whitespace-nowrap tabular-nums text-ink hover:text-wine">
                  {contacts.phoneSecond.display}
                </a>
              </p>
              <ContactButtons variant="v2" className="mt-5" />
              <span aria-hidden className="gold-rule my-7 block" />
              <LeadForm variant="v2" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
