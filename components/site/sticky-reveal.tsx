"use client";

import { useEffect, useRef, useState } from "react";

// Футер «выезжает» из-под страницы (sticky bottom-0 под обёрткой с z-10).
// Работает, только если футер целиком помещается в экран: иначе его верх
// (крупный телефон) оказался бы недоступен. На низких экранах футер — обычный.
//
// Пока до конца страницы далеко, футер скрыт (visibility: hidden). Sticky-футер всё время стоит
// в экране под страницей, и Lighthouse считал его крупный телефон главным элементом первого
// экрана (LCP 7 с на телефоне). Показываем за экран до метки конца страницы (#kontakty).
export function StickyReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setFits(el.offsetHeight <= window.innerHeight);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    // Метка есть всегда (app/(v1)/layout.tsx)
    const end = document.getElementById("kontakty");
    if (!end) return;
    const io = new IntersectionObserver(
      ([e]) => setNear(e.isIntersecting || e.boundingClientRect.top < 0),
      { rootMargin: "0px 0px 100% 0px" },
    );
    io.observe(end);
    return () => io.disconnect();
  }, []);

  return (
    // Скрываем только в sticky-режиме (его включает JS): без JS футер обычный и видимый
    <div ref={ref} className={`${fits ? "sticky" : "relative"} bottom-0 z-0 ${fits && !near ? "invisible" : ""}`}>
      {children}
    </div>
  );
}
