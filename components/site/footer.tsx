import { contacts, nav } from "@/lib/site";
import { BrandIcon } from "./brand-icons";
import { Wordmark } from "./header";
import { DemoLink } from "./demo-link";

export function Footer() {
  const links = nav.flatMap((i) => (i.children ? i.children : [i]));
  return (
    <footer className="bg-pine-950 pb-28 pt-16 text-mist lg:pb-12">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="display mt-8 text-[2.1rem] leading-[1.08] text-mist/90">
            Отдых в седле,
            <br />
            <em className="text-amber-soft">отдых с душой</em>
          </p>
        </div>

        <div className="grid content-start gap-3 text-[0.95rem]">
          <a href={contacts.phoneMain.href} className="w-fit text-lg tabular-nums hover:text-amber-soft">
            {contacts.phoneMain.display}
          </a>
          <a href={contacts.phoneSecond.href} className="w-fit tabular-nums text-mist-soft hover:text-mist">
            {contacts.phoneSecond.display}
          </a>
          <a href={`mailto:${contacts.email}`} className="w-fit text-mist-soft hover:text-mist">
            {contacts.email}
          </a>
          <div className="mt-2 flex gap-2">
            {(
              [
                ["viber", contacts.viber, "Viber"],
                ["telegram", contacts.telegram, "Telegram"],
                ["instagram", contacts.instagram.href, "Instagram"],
              ] as const
            ).map(([icon, href, label]) => (
              <a
                key={icon}
                href={href}
                aria-label={label}
                target={icon === "viber" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="grid size-11 place-items-center rounded-full border border-mist/15 transition hover:border-amber hover:text-amber"
              >
                <BrandIcon name={icon} size={17} />
              </a>
            ))}
          </div>
          <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-mist-soft">{contacts.address}</p>
        </div>

        <nav aria-label="Разделы сайта">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-mist-soft">
            {links.map((l) => (
              <li key={l.label}>
                <DemoLink link={l} className="hover:text-mist" />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col gap-2 border-t border-mist/10 px-5 pt-6 text-xs text-mist/45 md:flex-row md:justify-between md:px-8">
        <span>2009-2026 © Конная усадьба «Буцевичи»</span>
        <span>Александр Дежкунов, УНП АА0967223</span>
      </div>
    </footer>
  );
}
