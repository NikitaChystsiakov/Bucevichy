"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useFinePointer } from "./hooks";

// «Магнитная» обёртка: кнопка тянется за курсором. Только для мыши, на тач-экранах — обычная кнопка.
export function Magnetic({
  children,
  strength = 0.35,
  className = "inline-flex",
}: {
  children: React.ReactNode;
  strength?: number;
  // Своё значение className заменяет inline-flex целиком (например, "hidden lg:inline-flex")
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const on = fine && !reduce;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={on ? { x, y } : undefined}
      onPointerMove={
        on
          ? (e) => {
              const r = ref.current!.getBoundingClientRect();
              x.set((e.clientX - (r.left + r.width / 2)) * strength);
              y.set((e.clientY - (r.top + r.height / 2)) * strength);
            }
          : undefined
      }
      onPointerLeave={
        on
          ? () => {
              x.set(0);
              y.set(0);
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
