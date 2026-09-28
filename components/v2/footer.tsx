import { contacts } from "@/lib/site";
import { BrandIcon } from "@/components/site/brand-icons";
import { DemoLink } from "@/components/site/demo-link";
import { SprigIll } from "./illustrations";
import { v2Links, WordmarkV2 } from "./brand";

// Футер v2: коротко — контакты, разделы и слоган. Якорь «Контакты» (#kontakty) — здесь.
export function Footer() {
  return (
    <footer id="kontakty" className="tex bg-paper pt-12 text-ink md:pt-16">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <SprigIll className="mx-auto h-7 w-auto text-sage-deep" />
        <p className="prata mx-auto mt-5 max-w-[20ch] text-center text-[1.7rem] leading-[1.15] md:text-[2.4rem]">
          Отдых в седле — отдых <span className="script whitespace-nowrap text-[1.2em] text-terra-deep">с душой!</span>
        </p>

        <div className="mt-10 grid gap-8 border-t border-dashed border-ink/20 pt-8 md:grid-cols-[1fr_1fr_1.3fr] md:gap-10 md:pt-10">
          <div className="grid content-start gap-3">
            <WordmarkV2 />
            <p className="mt-2 max-w-[32ch] text-[0.92rem] leading-relaxed text-ink-soft">{contacts.address}</p>
          </div>

          <div className="grid content-start gap-2 text-[0.95rem]">
            <p className="v2-eyebrow text-ink-soft">Всё по предварительной записи</p>
            <a href={contacts.phoneMain.href} className="prata mt-1 w-fit text-[1.45rem] tabular-nums hover:text-terra-deep">
              {contacts.phoneMain.display}
            </a>
            <a href={contacts.phoneSecond.href} className="w-fit tabular-nums hover:text-terra-deep">
              {contacts.phoneSecond.display}
            </a>
            <a href={`mailto:${contacts.email}`} className="w-fit hover:text-terra-deep">
              {contacts.email}
            </a>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2">
              <a href={contacts.viber} className="flex items-center gap-2 hover:text-terra-deep">
                <BrandIcon name="viber" size={16} />
                Viber
              </a>
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-terra-deep"
              >
                <BrandIcon name="telegram" size={16} />
                Telegram
              </a>
              <a
                href={contacts.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-terra-deep"
              >
                <BrandIcon name="instagram" size={16} />
                {contacts.instagram.handle}
              </a>
            </div>
          </div>

          {/* На телефоне разделы есть в меню: футер остаётся коротким */}
          <nav aria-label="Разделы сайта в подвале" className="max-md:hidden">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.9rem] text-ink-soft">
              {v2Links.map((l) => (
                <li key={l.label}>
                  <DemoLink link={l} className="hover:text-terra-deep" />
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
