"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useFocusTrap } from "./hooks";

const noop = () => () => {};

// Полноэкранное окно поверх страницы: лайтбокс галереи, фильм. Портал вне страницы — она лежит
// в обёртке с z-10 (sticky reveal футера), и изнутри неё окно оказалось бы под шапкой. Цель —
// обёртка шрифтов (data-portal-root: в app/(v1)/layout.tsx и app/(v2)/layout.tsx): на ней переменные
// шрифтов; без неё — body.
const portalRoot = () => document.querySelector<HTMLElement>("[data-portal-root]") ?? document.body;

// Оформление: v1 — хвоя (/svadby), v2 — чернила и слоновая кость (/svadby-2). Поведение одно.
const tones = {
  v1: {
    root: "fixed inset-0 z-[82] flex items-center justify-center text-linen outline-none",
    backdrop: "absolute inset-0 bg-forest-deep/[0.97]",
    close:
      "absolute right-3 top-3 z-10 grid size-12 place-items-center rounded-full border border-linen/20 bg-forest-deep/60 text-linen transition hover:border-brass hover:text-brass md:right-6 md:top-6",
  },
  v2: {
    // on-dark: фокус-рамка светлая (globals.css, .v2 .on-dark :focus-visible)
    root: "on-dark fixed inset-0 z-[82] flex items-center justify-center text-ivory outline-none",
    backdrop: "absolute inset-0 bg-ink/[0.95]",
    close:
      "absolute right-3 top-3 z-10 grid size-12 place-items-center rounded-full border border-ivory/25 bg-ink/60 text-ivory transition hover:border-gold-light hover:text-gold-light md:right-6 md:top-6",
  },
} as const;
export type ModalTone = keyof typeof tones;

// Esc и клик по фону закрывают, фокус заперт внутри и возвращается, скролл страницы заблокирован.
export function Modal({
  open,
  onClose,
  label,
  children,
  className = "",
  onKeyDown,
  tone = "v1",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tone?: ModalTone;
}) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <ModalBody onClose={onClose} label={label} className={className} onKeyDown={onKeyDown} tone={tone}>
          {children}
        </ModalBody>
      )}
    </AnimatePresence>,
    portalRoot(),
  );
}

function ModalBody({
  onClose,
  label,
  children,
  className,
  onKeyDown,
  tone,
}: {
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tone: ModalTone;
}) {
  const st = tones[tone];
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useFocusTrap(ref, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={st.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
    >
      <div className={st.backdrop} onClick={onClose} aria-hidden />
      {/* Первым в DOM: при открытии фокус встаёт на «Закрыть» */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className={st.close}
      >
        <X size={20} />
      </button>
      <motion.div
        className={`relative ${className}`}
        initial={reduce ? false : { scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={reduce ? undefined : { scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
