"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useFocusTrap } from "@/components/ui/hooks";
import { LeadForm, type LeadPreset } from "./lead-form";
import { ContactButtons } from "./contact-buttons";

// Оформление шторки заявки: v1 — тёмная (/svadby), v2 — бумага (/svadby-2).
// Логика и отправка одни и те же.
export type BookingVariant = "v1" | "v2";

type BookingContextValue = {
  openBooking: (preset?: LeadPreset) => void;
  showToast: (message: string) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

export function BookingProvider({
  children,
  variant = "v1",
}: {
  children: React.ReactNode;
  variant?: BookingVariant;
}) {
  const [preset, setPreset] = useState<LeadPreset | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const openBooking = useCallback((p?: LeadPreset) => setPreset(p ?? {}), []);
  const close = useCallback(() => setPreset(null), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <BookingContext.Provider value={{ openBooking, showToast }}>
      {children}
      <BookingSheet preset={preset} onClose={close} variant={variant} />
      <Toast message={toast} variant={variant} />
    </BookingContext.Provider>
  );
}

const sheetStyles = {
  v1: {
    backdrop: "absolute inset-0 bg-forest-deep/70 backdrop-blur-sm",
    panel:
      "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] bg-forest px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 text-linen md:max-w-[560px] md:rounded-[20px] md:px-9 md:pb-9 md:pt-8",
    handle: "mx-auto mb-5 h-1 w-10 rounded-full bg-linen/20 md:hidden",
    close:
      "absolute right-4 top-4 grid size-10 place-items-center rounded-full text-linen/70 transition hover:bg-linen/10 hover:text-linen",
    title: "display pr-10 text-[2rem] md:text-[2.4rem]",
    lead: "mt-2 max-w-[42ch] text-[0.95rem] leading-relaxed text-linen/70",
    divider: "my-6 h-px bg-linen/10",
  },
  v2: {
    backdrop: "absolute inset-0 bg-ink/45 backdrop-blur-[2px]",
    panel:
      "tex relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] bg-ivory px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 text-ink shadow-[0_-20px_60px_-20px_rgb(35_29_26/0.35)] md:max-w-[560px] md:rounded-[20px] md:px-9 md:pb-9 md:pt-8",
    handle: "mx-auto mb-5 h-1 w-10 rounded-full bg-ink/15 md:hidden",
    close:
      "absolute right-4 top-4 grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink",
    title: "prata pr-10 text-[1.9rem] text-wine md:text-[2.3rem]",
    lead: "mt-2 max-w-[42ch] text-[0.95rem] leading-relaxed text-ink-soft",
    divider: "gold-rule my-6",
  },
} as const;

function BookingSheet({
  preset,
  onClose,
  variant,
}: {
  preset: LeadPreset | null;
  onClose: () => void;
  variant: BookingVariant;
}) {
  const st = sheetStyles[variant];
  const reduce = useReducedMotion();
  const open = preset !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  // Фокус внутрь шторки, Tab не уходит на страницу позади, при закрытии — обратно
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center">
          <motion.div
            className={st.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className={st.panel}
            initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className={st.handle} aria-hidden />
            <button
              type="button"
              onClick={onClose}
              className={st.close}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
            <h2 id="booking-title" className={st.title}>
              Узнать свободную дату
            </h2>
            <p className={st.lead}>
              Оставьте телефон, перезвоним и расскажем, свободна ли дата. Или напишите нам сами.
            </p>
            <div className="mt-5">
              <ContactButtons variant={variant} />
            </div>
            <div className={st.divider} />
            <LeadForm preset={preset ?? undefined} variant={variant} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Toast({ message, variant }: { message: string | null; variant: BookingVariant }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[85] flex justify-center px-4 md:bottom-8"
      aria-live="polite"
    >
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={
              variant === "v2"
                ? "rounded-full border border-gold/40 bg-ink px-5 py-3 text-sm text-ivory shadow-[0_12px_40px_rgb(35_29_26/0.3)]"
                : "rounded-full border border-brass/40 bg-forest-deep px-5 py-3 text-sm text-linen shadow-[0_12px_40px_rgb(20_28_23/0.35)]"
            }
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
