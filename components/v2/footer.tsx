import { contacts } from "@/lib/site";
import { BrandIcon } from "@/components/site/brand-icons";
import { DemoLink } from "@/components/site/demo-link";
import { SprigIll } from "./illustrations";
import { v2Links, WordmarkV2 } from "./brand";

// Футер v2: коротко — контакты, разделы и слоган. Якорь «Контакты» (#kontakty) — на блоке
// «Ждём вас в Буцевичах» (rsvp.tsx).
export function Footer() {
  return (
    <footer className="tex bg-ivory pt-14 text-ink md:pt-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <SprigIll className="h-7 w-auto text-gold" />
        <p className="prata mt-5 max-w-[16ch] text-[2.2rem] leading-[1.05] text-wine md:text-[3.6rem] lg:text-[4.2rem]">
          Отдых в седле — отдых{" "}
          <span className="script whitespace-nowrap text-[1.15em] text-wine-soft">с душой!</span>
        </p>

        <span aria-hidden className="gold-rule mt-12 block" />
        <div className="grid gap-8 pt-8 md:grid-cols-2 md:gap-10 md:pt-10 lg:grid-cols-[1fr_1fr_1.3fr]">
          <div className="grid content-start gap-3">
            <WordmarkV2 />
            <p className="mt-2 max-w-[32ch] text-[0.92rem] leading-relaxed text-ink-soft">{contacts.address}</p>
          </div>

          <div className="grid content-start gap-2 text-[0.95rem]">
            <p className="v2-eyebrow text-ink-soft">Всё по предварительной записи</p>
            <a
              href={contacts.phoneMain.href}
              className="prata mt-1 w-fit whitespace-nowrap text-[1.45rem] tabular-nums hover:text-wine"
            >
              {contacts.phoneMain.display}
            </a>
            <a href={contacts.phoneSecond.href} className="w-fit tabular-nums hover:text-wine">
              {contacts.phoneSecond.display}
            </a>
            <a href={`mailto:${contacts.email}`} className="w-fit hover:text-wine">
              {contacts.email}
            </a>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2">
              <a href={contacts.viber} className="flex items-center gap-2 hover:text-wine">
                <BrandIcon name="viber" size={16} />
                Viber
              </a>
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-wine"
              >
                <BrandIcon name="telegram" size={16} />
                Telegram
              </a>
              <a
                href={contacts.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-wine"
              >
                <BrandIcon name="instagram" size={16} />
                {contacts.instagram.handle}
              </a>
            </div>
          </div>

          {/* На телефоне и планшете разделы есть в меню: футер остаётся коротким */}
          <nav aria-label="Разделы сайта в подвале" className="max-lg:hidden">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.9rem] text-ink-soft">
              {v2Links.map((l) => (
                <li key={l.label}>
                  <DemoLink link={l} className="hover:text-wine" />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-1.5 border-t border-ink/10 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-xs text-ink-soft md:flex-row md:justify-between">
          <span>2009-2026 © Конная усадьба «Буцевичи»</span>
          <span>Александр Дежкунов, УНП АА0967223</span>
        </div>
      </div>
    </footer>
  );
}
