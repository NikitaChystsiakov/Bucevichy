"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { List, Phone, X } from "@phosphor-icons/react";
import { contacts } from "@/lib/site";
import { useFocusTrap, useReducedMotionSafe } from "@/components/ui/hooks";
import { useBooking } from "@/components/site/booking-provider";
import { BrandIcon } from "@/components/site/brand-icons";
import { DemoLink } from "@/components/site/demo-link";
import { v2Links, WordmarkV2 } from "./brand";

const EASE = [0.16, 1, 0.3, 1] as const;

// Страница прокручена хоть немного: подложка шапки видна. Читается и при загрузке посреди страницы
const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const isScrolled = () => window.scrollY > 8;

export function Header() {
  const { openBooking } = useBooking();
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Пока меню открыто: страница не скроллится, а её содержимое недоступно с клавиатуры (inert) —
  // иначе Tab уходил бы на кнопки под непрозрачным меню. Шапка с кнопкой «Закрыть» остаётся доступной
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const behind = document.querySelectorAll<HTMLElement>("#top, #kontakty");
    behind.forEach((el) => (el.inert = menuOpen));
    return () => behind.forEach((el) => (el.inert = false));
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-[70]">
        {/* Подложка проявляется после первых пикселей скролла (только opacity) */}
        <div
          aria-hidden
          className={`tex absolute inset-0 border-b border-ink/10 bg-ivory/95 backdrop-blur-md transition-opacity duration-300 ${
            scrolled || menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 md:h-[72px] md:px-8">
          <a href="#top" aria-label="Конная усадьба Буцевичи — наверх" className="shrink-0">
            <WordmarkV2 />
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={contacts.phoneMain.href}
              className="mr-3 hidden text-[0.92rem] tabular-nums text-ink transition hover:text-wine lg:block"
            >
              {contacts.phoneMain.display}
            </a>
            <a
              href={contacts.phoneMain.href}
              aria-label={`Позвонить: ${contacts.phoneMain.display}`}
              className="hidden size-11 place-items-center rounded-full text-ink transition hover:bg-ink/5 sm:grid lg:hidden"
            >
              <Phone size={20} />
            </a>
            <button
              type="button"
              onClick={() => openBooking()}
              className="btn-v2 btn-v2-wine px-4 py-3 text-[0.82rem] md:px-5 md:text-[0.88rem]"
            >
              <span className="md:hidden">Узнать дату</span>
              <span className="max-md:hidden">Узнать свободную дату</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="v2-menu"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              className="grid size-11 place-items-center rounded-full text-ink transition hover:bg-ink/5"
            >
              {menuOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </div>
      </header>

      <Menu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotionSafe();
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const ref = useRef<HTMLDivElement>(null);
  // Фокус в меню при открытии и обратно при закрытии. Tab не запираем: кнопка «Закрыть» — в шапке
  useFocusTrap(ref, open, { trap: false });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="v2-menu"
          className="tex fixed inset-0 z-[65] overflow-y-auto bg-ivory pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-20 text-ink md:pt-24"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE }}
        >
          <div className="mx-auto grid max-w-[1280px] gap-10 px-5 md:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <nav aria-label="Разделы сайта">
              <ul className="grid">
                {v2Links.map((link, i) => {
                  const active = pathname === link.href && link.ready;
                  return (
                    <motion.li
                      key={link.label}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.03, duration: 0.45, ease: EASE }}
                      className="border-b border-dashed border-ink/15"
                    >
                      <DemoLink
                        link={link}
                        onNavigate={onClose}
                        current={!!active}
                        className={`flex items-baseline justify-between gap-4 py-3 transition hover:text-wine ${
                          active ? "text-wine" : ""
                        }`}
                      >
                        <span className="prata text-[1.6rem] md:text-[2rem]">
                          {link.label}
                          {active && <span className="script ml-3 text-[1.2rem] text-wine">вы здесь</span>}
                        </span>
                        {link.group && (
                          <span className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">
                            {link.group}
                          </span>
                        )}
                      </DemoLink>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="grid content-start gap-5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openBooking();
                }}
                className="btn-v2 btn-v2-wine w-full py-4"
              >
                Узнать свободную дату
              </button>
              <div className="grid gap-2 text-[0.95rem]">
                <a href={contacts.phoneMain.href} className="prata w-fit text-[1.5rem] tabular-nums">
                  {contacts.phoneMain.display}
                </a>
                <a href={contacts.phoneSecond.href} className="w-fit tabular-nums text-ink-soft">
                  {contacts.phoneSecond.display}
                </a>
              </div>
              <div className="flex gap-2">
                <a
                  href={contacts.viber}
                  aria-label="Viber"
                  className="grid size-11 place-items-center rounded-full border border-ink/20 transition hover:border-wine hover:text-wine"
                >
                  <BrandIcon name="viber" size={18} />
                </a>
                <a
                  href={contacts.telegram}
                  aria-label="Telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-ink/20 transition hover:border-wine hover:text-wine"
                >
                  <BrandIcon name="telegram" size={18} />
                </a>
                <a
                  href={contacts.instagram.href}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-ink/20 transition hover:border-wine hover:text-wine"
                >
                  <BrandIcon name="instagram" size={18} />
                </a>
              </div>
              <p className="text-[0.9rem] leading-relaxed text-ink-soft">{contacts.address}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
