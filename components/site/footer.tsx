import { Phone } from "@phosphor-icons/react/ssr";
import { contacts, nav } from "@/lib/site";
import { HorseLine } from "@/components/ui/motifs";
import { BrandIcon } from "./brand-icons";
import { Wordmark } from "./header";
import { DemoLink } from "./demo-link";
import { StickyReveal } from "./sticky-reveal";

// Футер лежит под страницей (StickyReveal: sticky bottom-0, z-0) и открывается, когда
// страница (обёртка в layout.tsx, z-10) докручена до конца.
export function Footer() {
  const links = nav.flatMap((i) => (i.children ? i.children : [i]));
  const pillBase =
    "flex min-h-13 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-semibold transition active:scale-[0.98]";
  const pill = `${pillBase} border border-linen/20 text-linen hover:border-brass hover:text-brass`;

  return (
    <StickyReveal>
      <footer className="overflow-hidden bg-forest pt-14 text-linen md:pt-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <p className="eyebrow text-brass">Всё только по предварительной записи</p>
          <a
            href={contacts.phoneMain.href}
            className="mt-4 block w-fit text-[clamp(2.4rem,10.5vw,8.5rem)] font-extralight leading-[1] tabular-nums tracking-[-0.045em] transition-colors hover:text-brass"
          >
            {contacts.phoneMain.display}
          </a>

          <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap md:mt-10">
            <a href={contacts.phoneMain.href} className={`${pillBase} bg-brass text-forest-deep hover:bg-brass-soft`}>
              <Phone size={19} weight="bold" />
              Позвонить
            </a>
            <div className="grid grid-cols-2 gap-2.5 sm:flex">
              <a href={contacts.viber} className={pill}>
                <BrandIcon name="viber" size={18} />
                Viber
              </a>
              <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className={pill}>
                <BrandIcon name="telegram" size={18} />
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Тропа с лошадью одной линией */}
        <div aria-hidden className="relative mt-8 h-16 md:mt-16 md:h-24">
          <span className="stitch absolute inset-x-0 bottom-2 text-brass" />
          <div className="ride-across absolute bottom-2.5 left-0">
            <HorseLine className="gallop h-14 w-auto text-brass md:h-[5.5rem]" strokeWidth={2} />
          </div>
        </div>

        <div className="bg-forest-deep">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10 lg:grid-cols-[1.1fr_1fr_1.2fr] max-md:gap-6">
            <div>
              <Wordmark />
              <p className="display mt-5 text-[1.45rem] leading-[1.1] text-linen/85 md:mt-6 md:text-[1.7rem]">
                Отдых в седле — <em className="text-brass">отдых с душой</em>
              </p>
            </div>

            <div className="grid content-start gap-2.5 text-[0.92rem] text-linen/70">
              <a href={contacts.phoneSecond.href} className="w-fit tabular-nums hover:text-linen">
                {contacts.phoneSecond.display}
              </a>
              <a href={`mailto:${contacts.email}`} className="w-fit hover:text-linen">
                {contacts.email}
              </a>
              <a
                href={contacts.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 hover:text-linen"
              >
                <BrandIcon name="instagram" size={16} />
                {contacts.instagram.handle}
              </a>
              <p className="mt-1 max-w-[34ch] leading-relaxed">{contacts.address}</p>
            </div>

            {/* На телефоне разделы есть в меню-бургере: так футер помещается в экран */}
            <nav aria-label="Разделы сайта" className="max-md:hidden">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.88rem] text-linen/60">
                {links.map((l) => (
                  <li key={l.label}>
                    <DemoLink link={l} className="hover:text-linen" />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mx-auto flex max-w-[1440px] flex-col gap-1.5 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-xs text-linen/40 md:flex-row md:justify-between md:px-8">
            <span>2009-2026 © Конная усадьба «Буцевичи»</span>
            <span>Александр Дежкунов, УНП АА0967223</span>
          </div>
        </div>
      </footer>
    </StickyReveal>
  );
}
