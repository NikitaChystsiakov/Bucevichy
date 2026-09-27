"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { LeadForm, type LeadPreset } from "./lead-form";
import { ContactButtons } from "./contact-buttons";

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

export function BookingProvider({ children }: { children: React.ReactNode }) {
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
      <BookingSheet preset={preset} onClose={close} />
      <Toast message={toast} />
    </BookingContext.Provider>
  );
}

function BookingSheet({ preset, onClose }: { preset: LeadPreset | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const open = preset !== null;

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
            className="absolute inset-0 bg-pine-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] bg-pine-900 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 text-mist md:max-w-[560px] md:rounded-[20px] md:px-9 md:pb-9 md:pt-8"
            initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-mist/20 md:hidden" aria-hidden />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-mist-soft transition hover:bg-mist/10 hover:text-mist"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
            <h2 id="booking-title" className="display pr-10 text-[2rem] md:text-[2.4rem]">
              Узнать свободную дату
            </h2>
            <p className="mt-2 max-w-[42ch] text-[0.95rem] leading-relaxed text-mist-soft">
              Оставьте телефон, перезвоним и расскажем, свободна ли дата. Или напишите нам сами.
            </p>
            <div className="mt-5">
              <ContactButtons />
            </div>
            <div className="my-6 h-px bg-mist/10" />
            <LeadForm preset={preset ?? undefined} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Toast({ message }: { message: string | null }) {
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
            className="rounded-full bg-ink px-5 py-3 text-sm text-mist shadow-[0_12px_40px_rgb(13_22_17/0.35)]"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
