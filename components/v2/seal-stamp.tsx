"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/ui/hooks";
import { WaxSeal } from "./seal";

// Печать «ставится» на открытку: падает сверху крупной и повёрнутой, пружинит на место.
// После интро-конверта (data-v2-intro="on") — с задержкой, чтобы успел открыться конверт.
export function SealStamp({ className = "" }: { className?: string }) {
  const reduce = useReducedMotionSafe();
  // Задержка не попадает в разметку, поэтому читаем флаг интро сразу
  const [delay] = useState(() =>
    typeof document !== "undefined" && document.documentElement.dataset.v2Intro === "on" ? 1.25 : 0.45,
  );
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 1.7, rotate: -34 }}
      animate={{ opacity: 1, scale: 1, rotate: -12 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              delay,
              opacity: { delay, duration: 0.12 },
              default: { type: "spring", stiffness: 320, damping: 13, mass: 0.9, delay },
            }
      }
    >
      <WaxSeal id="hero-seal" className="block h-auto w-full drop-shadow-[0_6px_10px_rgb(35_29_26/0.3)]" />
    </motion.div>
  );
}
