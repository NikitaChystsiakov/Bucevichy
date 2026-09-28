"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { marqueeFacts } from "@/lib/wedding";
import { Horseshoe } from "@/components/ui/motifs";
import { useReducedMotionSafe } from "@/components/ui/hooks";

const BASE_SPEED = 2.2; // % ширины ленты в секунду без скролла
const COPIES = 4;

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Латунная лента фактов. Скролл вниз — лента ускоряется влево, вверх — разворачивается.
export function Marquee() {
  const reduce = useReducedMotionSafe();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-1500, 0, 1500], [-6, 0, 6], { clamp: false });
  const skewX = useTransform(smooth, [-3000, 0, 3000], [7, 0, -7]);
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);
  const direction = useRef(1);
  // Лента вне экрана не крутится (кадры не тратятся впустую)
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "100px 0px" });
  const running = useRef(false);
  useEffect(() => {
    running.current = inView;
  }, [inView]);

  useAnimationFrame((_, delta) => {
    if (reduce || !running.current) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    const dt = Math.min(delta, 64) / 1000;
    baseX.set(baseX.get() - direction.current * BASE_SPEED * dt * (1 + Math.abs(b)));
  });

  const group = (
    <span className="flex shrink-0 items-center">
      {marqueeFacts.map((f) => (
        <span key={f} className="flex items-center">
          <span className="display whitespace-nowrap text-[1.75rem] font-medium leading-none md:text-[2.6rem]">
            {f}
          </span>
          <Horseshoe size={26} nailColor="#c9a45c" className="mx-5 shrink-0 md:mx-8" />
        </span>
      ))}
    </span>
  );

  return (
    <section ref={sectionRef} aria-label="Коротко об усадьбе" className="relative z-10 overflow-hidden bg-brass text-forest-deep">
      <ul className="sr-only">
        {marqueeFacts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <span aria-hidden className="stitch absolute inset-x-0 top-1.5 opacity-40" />
      <span aria-hidden className="stitch absolute inset-x-0 bottom-1.5 opacity-40" />
      <motion.div
        aria-hidden
        className="flex w-max py-5 will-change-transform md:py-7"
        style={reduce ? undefined : { x, skewX }}
      >
        {Array.from({ length: COPIES }, (_, i) => (
          <span key={i} className="flex">
            {group}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
