"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { CaretDown, List, Phone, X } from "@phosphor-icons/react";
import { contacts, nav, type NavLink } from "@/lib/site";
import { useBooking } from "./booking-provider";
import { BrandIcon } from "./brand-icons";

const NOT_READY = "Этот раздел появится в полной версии сайта";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="display text-[1.65rem] font-semibold tracking-[-0.01em]">Буцевичи</span>
      <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] opacity-70">
        конная усадьба
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
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextSolid = y > 40;
    if (nextSolid !== solid) setSolid(nextSolid);
    const nextHidden = y > 480 && y > prev + 2;
    const nextShown = y < prev - 2 || y < 480;
    if (nextHidden && !hidden) setHidden(true);
    else if (nextShown && hidden) setHidden(false);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[70]"
        animate={{ y: hidden && !menuOpen && !reduce ? "-110%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 36 }}
      >
        <div
          className={`transition-[background-color,backdrop-filter,border-color] duration-500 ${
            solid || menuOpen
              ? "border-b border-mist/10 bg-pine-950/80 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 text-mist md:h-[72px] md:px-8">
            <Link href="/svadby" className="shrink-0" aria-label="Конная усадьба Буцевичи">
              <Wordmark />
            </Link>

            <nav aria-label="Основное меню" className="hidden lg:block">
              <ul className="flex items-center gap-1">
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
                          className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] transition hover:text-amber-soft ${
                            childActive ? "text-amber-soft" : ""
                          }`}
                          aria-expanded={openDrop === item.label}
                          onClick={() =>
                            setOpenDrop(openDrop === item.label ? null : item.label)
                          }
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
                          onClick={onNav(item)}
                          className="block rounded-full px-3.5 py-2 text-[0.92rem] transition hover:text-amber-soft"
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
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute left-0 top-full pt-2"
                          >
                            <ul className="min-w-[240px] rounded-[20px] border border-mist/10 bg-pine-900/95 p-2 shadow-[0_24px_60px_rgb(13_22_17/0.45)] backdrop-blur-xl">
                              {item.children!.map((child) => (
                                <li key={child.label}>
                                  <Link
                                    href={child.href}
                                    onClick={(e) => {
                                      onNav(child)(e);
                                      setOpenDrop(null);
                                    }}
                                    aria-current={isActive(child.href) ? "page" : undefined}
                                    className={`flex items-center justify-between rounded-[14px] px-4 py-3 text-[0.95rem] transition hover:bg-mist/[0.06] ${
                                      isActive(child.href) ? "text-amber-soft" : "text-mist"
                                    }`}
                                  >
                                    {child.label}
                                    {isActive(child.href) && (
                                      <span className="text-[0.7rem] text-amber-soft/80">вы здесь</span>
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

            <div className="flex items-center gap-2">
              <a
                href={contacts.phoneMain.href}
                className="hidden text-[0.92rem] tabular-nums transition hover:text-amber-soft xl:block"
              >
                {contacts.phoneMain.display}
              </a>
              <button
                type="button"
                onClick={() => openBooking()}
                className="btn btn-amber hidden px-5 py-3 text-[0.88rem] lg:inline-flex xl:ml-4"
              >
                Узнать свободную дату
              </button>
              <a
                href={contacts.phoneMain.href}
                aria-label={`Позвонить: ${contacts.phoneMain.display}`}
                className="grid size-11 place-items-center rounded-full transition hover:bg-mist/10 lg:hidden"
              >
                <Phone size={21} />
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                className="grid size-11 place-items-center rounded-full transition hover:bg-mist/10 lg:hidden"
              >
                {menuOpen ? <X size={22} /> : <List size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const onNav = useNavClick();
  const pathname = usePathname();
  const flat = nav.flatMap((item) =>
    item.children ? item.children.map((c) => ({ ...c, group: item.label })) : [{ ...item, group: "" }],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-[65] flex flex-col bg-pine-950 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-24 text-mist lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav aria-label="Мобильное меню" className="flex-1 overflow-y-auto">
            <ul className="grid gap-1">
              {flat.map((link, i) => {
                const active = pathname === link.href && link.ready;
                return (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.035, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        onNav(link)(e);
                        if (link.ready) onClose();
                      }}
                      className={`display flex items-baseline justify-between py-1.5 text-[2rem] ${
                        active ? "text-amber-soft" : ""
                      }`}
                    >
                      {link.label}
                      {link.group && (
                        <span className="font-sans text-xs text-mist/40">{link.group}</span>
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
            className="mt-6 grid gap-3 border-t border-mist/10 pt-6 text-sm"
          >
            <a href={contacts.phoneMain.href} className="text-lg tabular-nums">
              {contacts.phoneMain.display}
            </a>
            <a href={contacts.phoneSecond.href} className="tabular-nums text-mist-soft">
              {contacts.phoneSecond.display}
            </a>
            <div className="flex gap-5 text-mist-soft">
              <a href={contacts.viber} className="flex items-center gap-2">
                <BrandIcon name="viber" size={16} /> Viber
              </a>
              <a href={contacts.telegram} className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                <BrandIcon name="telegram" size={16} /> Telegram
              </a>
              <a href={contacts.instagram.href} className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                <BrandIcon name="instagram" size={16} /> Instagram
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
