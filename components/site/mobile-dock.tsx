"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Phone } from "@phosphor-icons/react";
import { contacts } from "@/lib/site";
import { useBooking } from "./booking-provider";
import { BrandIcon } from "./brand-icons";

// Нижняя панель на телефоне: главное действие всегда под пальцем
export function MobileDock() {
  const { scrollY } = useScroll();
  const { openBooking } = useBooking();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight * 0.7;
    if (next !== visible) setVisible(next);
  });

  const icon =
    "grid size-[42px] shrink-0 place-items-center rounded-full border border-mist/15 text-mist transition active:scale-95";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="flex items-center gap-1.5 rounded-full border border-mist/10 bg-pine-950/85 p-1.5 shadow-[0_16px_40px_rgb(13_22_17/0.4)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => openBooking()}
              className="btn btn-amber h-[46px] min-w-0 flex-1 px-3 text-[0.86rem]"
            >
              Узнать свободную дату
            </button>
            <a href={contacts.phoneMain.href} className={icon} aria-label="Позвонить">
              <Phone size={20} />
            </a>
            <a href={contacts.viber} className={icon} aria-label="Написать в Viber">
              <BrandIcon name="viber" size={19} />
            </a>
            <a
              href={contacts.telegram}
              className={`${icon} max-[379px]:hidden`}
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
