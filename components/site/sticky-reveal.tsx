"use client";

import { useEffect, useRef, useState } from "react";

// Футер «выезжает» из-под страницы (sticky bottom-0 под обёрткой с z-10).
// Работает, только если футер целиком помещается в экран: иначе его верх
// (крупный телефон) оказался бы недоступен. На низких экранах футер — обычный.
export function StickyReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);

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

  return (
    <div ref={ref} className={`${fits ? "sticky" : "relative"} bottom-0 z-0`}>
      {children}
    </div>
  );
}
