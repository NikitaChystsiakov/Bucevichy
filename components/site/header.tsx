"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { CaretDown, List, Phone, X } from "@phosphor-icons/react";
import { contacts, nav, type NavLink } from "@/lib/site";
import { Horseshoe } from "@/components/ui/motifs";
import { Magnetic } from "@/components/ui/magnetic";
import { useFocusTrap } from "@/components/ui/hooks";
import { useBooking } from "./booking-provider";
import { BrandIcon } from "./brand-icons";

const NOT_READY = "Этот раздел появится в полной версии сайта";
const EASE = [0.16, 1, 0.3, 1] as const;

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 leading-none ${className}`}>
      <Horseshoe size={22} className="shrink-0 text-brass" />
      <span className="flex flex-col">
        <span className="display text-[1.6rem] font-medium tracking-[-0.01em]">Буцевичи</span>
        <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.26em] opacity-60">
          конная усадьба
        </span>
      </span>
    </span>
  );
}

function useNavClick() {
  const { showToast } = useBooking();
  return (link: NavLink) => (e: React.MouseEvent) => {
    if (!link.ready) {
      e.preventDefault();
      showToast(NOT_READY);
    }
  };
}

export function Header() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const onNav = useNavClick();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  // Сжимается после первых пикселей, прячется при скролле вниз, возвращается при скролле вверх
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextCompact = y > 40;
    if (nextCompact !== compact) setCompact(nextCompact);
    const goingDown = y > prev + 2;
    const goingUp = y < prev - 2;
    if (y > 520 && goingDown && !hidden) setHidden(true);
    else if ((goingUp || y < 520) && hidden) setHidden(false);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href;
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[70]"
        animate={{ y: hidden && !menuOpen && !reduce ? "-110%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 36 }}
      >
        {/* Сжатие без анимации высоты: подложка сжимается scaleY, строка сдвигается translateY.
            Видимая высота: 72/88px → 60px. */}
        <div className="relative">
          <div
            aria-hidden
            className={`absolute inset-x-0 top-0 h-[72px] origin-top border-b border-linen/10 bg-forest-deep/80 backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:h-[88px] ${
              compact || menuOpen
                ? "scale-y-[0.8333] opacity-100 md:scale-y-[0.6818]"
                : "opacity-0"
            }`}
          />
          <div
            className={`pointer-events-none relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-4 text-linen transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:h-[88px] md:px-8 [&>*]:pointer-events-auto ${
              compact ? "-translate-y-1.5 md:-translate-y-3.5" : ""
            }`}
          >
            <Link
              href="/svadby"
              className={`shrink-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                compact ? "scale-[0.86]" : ""
              }`}
              aria-label="Конная усадьба Буцевичи"
            >
              <Wordmark />
            </Link>

            <nav aria-label="Основное меню" className="hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {nav.map((item) => {
                  const hasChildren = !!item.children;
                  const childActive = item.children?.some((c) => isActive(c.href));
                  return (
                    <li
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => hasChildren && setOpenDrop(item.label)}
                      onMouseLeave={() => hasChildren && setOpenDrop(null)}
                    >
                      {hasChildren ? (
                        <button
                          type="button"
                          className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.9rem] transition hover:text-brass ${
                            childActive ? "text-brass" : ""
                          }`}
                          aria-expanded={openDrop === item.label}
                          onClick={() => setOpenDrop(openDrop === item.label ? null : item.label)}
                        >
                          {item.label}
                          <CaretDown
                            size={13}
                            className={`transition-transform duration-300 ${
                              openDrop === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          prefetch={item.ready ? undefined : false}
                          onClick={onNav(item)}
                          className="block rounded-full px-3.5 py-2 text-[0.9rem] transition hover:text-brass"
                        >
                          {item.label}
                        </Link>
                      )}

                      <AnimatePresence>
                        {hasChildren && openDrop === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="absolute left-0 top-full pt-2"
                          >
                            <ul className="min-w-[240px] rounded-[20px] border border-linen/10 bg-forest/95 p-2 shadow-[0_24px_60px_rgb(0_0_0/0.45)] backdrop-blur-xl">
                              {item.children!.map((child) => (
                                <li key={child.label}>
                                  <Link
                                    href={child.href}
                                    prefetch={child.ready ? undefined : false}
                                    onClick={(e) => {
                                      onNav(child)(e);
                                      setOpenDrop(null);
                                    }}
                                    aria-current={isActive(child.href) ? "page" : undefined}
                                    className={`flex items-center justify-between rounded-[14px] px-4 py-3 text-[0.95rem] transition hover:bg-linen/[0.06] ${
                                      isActive(child.href) ? "text-brass" : "text-linen"
                                    }`}
                                  >
                                    {child.label}
                                    {isActive(child.href) && (
                                      <span className="text-[0.7rem] text-brass/80">вы здесь</span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5">
              <a
                href={contacts.phoneMain.href}
                className="hidden text-[0.9rem] tabular-nums transition hover:text-brass xl:block"
              >
                {contacts.phoneMain.display}
              </a>
              <Magnetic className="hidden lg:inline-flex xl:ml-4" strength={0.25}>
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="btn btn-brass px-5 py-3 text-[0.86rem]"
                >
                  Узнать свободную дату
                </button>
              </Magnetic>
              <a
                href={contacts.phoneMain.href}
                aria-label={`Позвонить: ${contacts.phoneMain.display}`}
                className="grid size-11 place-items-center rounded-full transition hover:bg-linen/10 lg:hidden"
              >
                <Phone size={21} />
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                className="grid size-11 place-items-center rounded-full transition hover:bg-linen/10 lg:hidden"
              >
                {menuOpen ? <X size={22} /> : <List size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const onNav = useNavClick();
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const ref = useRef<HTMLDivElement>(null);
  // Фокус в меню при открытии и обратно на кнопку при закрытии. Tab не запираем:
  // кнопка «Закрыть меню» находится в шапке, вне этого контейнера.
  useFocusTrap(ref, open, { trap: false });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const flat = nav.flatMap((item) =>
    item.children ? item.children.map((c) => ({ ...c, group: item.label })) : [{ ...item, group: "" }],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          className="fixed inset-0 z-[65] flex flex-col bg-forest-deep px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-24 text-linen lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav aria-label="Мобильное меню" className="flex-1 overflow-y-auto">
            <ul className="grid">
              {flat.map((link, i) => {
                const active = pathname === link.href && link.ready;
                return (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.035, duration: 0.5, ease: EASE }}
                    className="border-b border-dashed border-linen/10"
                  >
                    <Link
                      href={link.href}
                      prefetch={link.ready ? undefined : false}
                      onClick={(e) => {
                        onNav(link)(e);
                        if (link.ready) onClose();
                      }}
                      className={`display flex items-baseline justify-between py-2.5 text-[1.9rem] ${
                        active ? "italic text-brass" : ""
                      }`}
                    >
                      {link.label}
                      {link.group && (
                        <span className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-linen/35">
                          {link.group}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.45 } }}
            className="mt-5 grid gap-4 pt-2 text-sm"
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                openBooking();
              }}
              className="btn btn-brass w-full py-4"
            >
              Узнать свободную дату
            </button>
            <div className="flex items-center justify-between gap-4 text-linen/70">
              <a href={contacts.phoneMain.href} className="text-base tabular-nums text-linen">
                {contacts.phoneMain.display}
              </a>
              <div className="flex gap-4">
                <a href={contacts.viber} aria-label="Viber">
                  <BrandIcon name="viber" size={19} />
                </a>
                <a href={contacts.telegram} aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="telegram" size={19} />
                </a>
                <a href={contacts.instagram.href} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="instagram" size={19} />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
