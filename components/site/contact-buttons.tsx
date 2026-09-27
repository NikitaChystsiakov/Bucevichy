import { Phone } from "@phosphor-icons/react/ssr";
import { contacts } from "@/lib/site";
import { BrandIcon } from "./brand-icons";

// Быстрые каналы связи: телефон, Viber, Telegram. Для тёмных поверхностей.
export function ContactButtons({ className = "" }: { className?: string }) {
  const item =
    "flex min-h-12 items-center justify-center gap-2 rounded-full border border-mist/20 px-4 text-sm text-mist transition hover:border-amber hover:text-amber active:scale-[0.98]";
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      <a href={contacts.phoneMain.href} className={item}>
        <Phone size={18} weight="regular" />
        <span>Позвонить</span>
      </a>
      <a href={contacts.viber} className={item}>
        <BrandIcon name="viber" size={17} />
        <span>Viber</span>
      </a>
      <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className={item}>
        <BrandIcon name="telegram" size={17} />
        <span>Telegram</span>
      </a>
    </div>
  );
}
