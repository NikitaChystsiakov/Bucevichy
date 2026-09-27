"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, Phone } from "@phosphor-icons/react";
import { contacts } from "@/lib/site";
import { useBooking } from "./booking-provider";
import { BrandIcon } from "./brand-icons";

// Панель с главным действием: на телефоне — внизу во всю ширину, на десктопе — плавающая
// справа внизу (шапка при скролле вниз прячется, кнопка должна оставаться доступной).
// Появляется после первого экрана, прячется, когда открывается футер с крупными кнопками связи.
export function MobileDock() {
  const { scrollY } = useScroll();
  const { openBooking } = useBooking();
  const [pastHero, setPastHero] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight * 0.7;
    if (next !== pastHero) setPastHero(next);
  });

  // Футер лежит под страницей (sticky) и для IntersectionObserver виден всегда, поэтому
  // следим за меткой конца страницы (#kontakty в layout.tsx): футер открыт, когда она
  // поднялась выше нижних 35% экрана.
  useEffect(() => {
    const end = document.getElementById("kontakty");
    if (!end) return;
    const io = new IntersectionObserver(
      ([e]) => setAtFooter(e.isIntersecting || e.boundingClientRect.top < 0),
      { rootMargin: "0px 0px -35% 0px" },
    );
    io.observe(end);
    return () => io.disconnect();
  }, []);

  const visible = pastHero && !atFooter;
  const icon =
    "grid size-11 shrink-0 place-items-center rounded-full lg:size-12 text-linen transition active:scale-95 active:bg-linen/10";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "130%" }}
          animate={{ y: 0 }}
          exit={{ y: "130%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:p-0"
        >
          <div className="relative flex items-center gap-1 rounded-full bg-forest-deep/90 p-1.5 shadow-[0_18px_44px_rgb(0_0_0/0.5)] backdrop-blur-xl">
            {/* «Строчка седла» по краю панели */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[3px] rounded-full border border-dashed border-brass/35"
            />
            <button
              type="button"
              onClick={() => openBooking()}
              className="btn btn-brass relative h-12 min-w-0 flex-1 gap-2 px-4 text-[0.88rem]"
            >
              <span className="truncate">Узнать свободную дату</span>
              <ArrowRight size={16} className="shrink-0 max-[359px]:hidden" />
            </button>
            <a href={contacts.phoneMain.href} className={icon} aria-label="Позвонить">
              <Phone size={20} />
            </a>
            <a href={contacts.viber} className={icon} aria-label="Написать в Viber">
              <BrandIcon name="viber" size={19} />
            </a>
            <a
              href={contacts.telegram}
              className={`${icon} max-[429px]:hidden`}
              aria-label="Написать в Telegram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrandIcon name="telegram" size={19} />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
