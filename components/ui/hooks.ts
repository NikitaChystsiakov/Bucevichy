"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";

function mediaQueryStore(query: string) {
  const subscribe = (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
  const get = () => window.matchMedia(query).matches;
  return { subscribe, get };
}

const finePointer = mediaQueryStore("(hover: hover) and (pointer: fine)");

// Мышь, а не палец: только тогда включаем магнитные кнопки, параллакс от курсора и наклоны.
// На сервере считаем, что устройство сенсорное — эффекты включатся после гидратации.
export function useFinePointer() {
  return useSyncExternalStore(finePointer.subscribe, finePointer.get, () => false);
}

const reducedMotion = mediaQueryStore("(prefers-reduced-motion: reduce)");

// Как useReducedMotion из motion, но без расхождения при гидратации: первый рендер
// на клиенте совпадает с серверным (false). Использовать там, где от флага зависит разметка.
export function useReducedMotionSafe() {
  return useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, () => false);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Фокус для оверлеев: при открытии переносим внутрь, при закрытии возвращаем туда,
// где он был. trap — не выпускать Tab за пределы контейнера (модальные окна).
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  { trap = true }: { trap?: boolean } = {},
) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const previous = document.activeElement as HTMLElement | null;
    const items = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    (items()[0] ?? el).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (!trap || e.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus({ preventScroll: true });
    };
  }, [ref, active, trap]);
}
