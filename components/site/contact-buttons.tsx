import { Phone } from "@phosphor-icons/react/ssr";
import { contacts } from "@/lib/site";
import { BrandIcon } from "./brand-icons";

// Быстрые каналы связи: телефон, Viber, Telegram. v1 — для тёмных поверхностей, v2 — для бумаги.
// На телефоне кнопка ~110px: отступы меньше, иконки не сжимаются (иначе у «Позвонить» иконка 0px)
export function ContactButtons({
  className = "",
  variant = "v1",
}: {
  className?: string;
  variant?: "v1" | "v2";
}) {
  const item =
    variant === "v2"
      ? "flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-ink/25 px-2 text-[0.82rem] text-ink transition hover:border-terra-deep hover:text-terra-deep active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-sm"
      : "flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-linen/20 px-2 text-[0.82rem] text-linen transition hover:border-brass hover:text-brass active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-sm";
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      <a href={contacts.phoneMain.href} className={item}>
        <Phone size={18} weight="regular" className="shrink-0" />
        <span>Позвонить</span>
      </a>
      <a href={contacts.viber} className={item}>
        <BrandIcon name="viber" size={17} className="shrink-0" />
        <span>Viber</span>
      </a>
      <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className={item}>
        <BrandIcon name="telegram" size={17} className="shrink-0" />
        <span>Telegram</span>
      </a>
    </div>
  );
}
