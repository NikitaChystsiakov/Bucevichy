"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { useTransform, type MotionValue } from "motion/react";

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

// Элемент подошёл к экрану (один раз): margin — насколько заранее, в долях экрана.
// Для тяжёлых картинок сразу под первым экраном: native lazy у Chrome срабатывает за 1250–2500px
// и на телефоне отнимает канал у первого экрана.
export function useNear(ref: RefObject<Element | null>, margin = "50%") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px ${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, near]);
  return near;
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

// useTransform для прогресса скролла. motion 13 ускоряет такие преобразования через
// ViewTimeline/ScrollTimeline и передаёт браузеру ключевые кадры со смещениями, например 0.3 → 0.6,
// не дополняя их до 0 и 1. За пределами диапазона браузер тянет значение обратно к исходному:
// прозрачность «после конца» снова падает, солнце снова белеет. Дополняем диапазон сами —
// ускорение сохраняется, значения за краями держатся.
export function useScrollTransform(
  progress: MotionValue<number>,
  input: number[],
  output: number[],
): MotionValue<number>;
export function useScrollTransform(
  progress: MotionValue<number>,
  input: number[],
  output: string[],
): MotionValue<string>;
export function useScrollTransform(
  progress: MotionValue<number>,
  input: number[],
  output: (number | string)[],
): MotionValue<number> | MotionValue<string> {
  const i = [...input];
  const o = [...output];
  if (i[0] > 0) {
    i.unshift(0);
    o.unshift(o[0]);
  }
  if (i[i.length - 1] < 1) {
    i.push(1);
    o.push(o[o.length - 1]);
  }
  // Выход однотипный (только числа или только строки) — гарантируют перегрузки выше
  return useTransform(progress, i, o) as MotionValue<number>;
}
