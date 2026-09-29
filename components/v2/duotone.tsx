"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Photo } from "@/lib/photos";
import { useFinePointer, useReducedMotionSafe } from "@/components/ui/hooks";

/*
  Фото «как в печати»: в один цвет краски (вино или чернила) на бумаге, с зерном — CSS .duotone
  в globals.css. Лёгкий параллакс при скролле — только для мыши (pointer: fine) и без reduced-motion.
*/
export function DuotoneImage({
  photo,
  sizes,
  className = "",
  tone = "wine",
  parallax = false,
  position = "50% 50%",
  preload,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  tone?: "wine" | "ink";
  parallax?: boolean;
  // object-position: какую часть кадра держать в рамке
  position?: string;
  preload?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotionSafe();
  const move = parallax && fine && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={`duotone ${tone === "ink" ? "duotone-ink" : ""} ${className}`}>
      <motion.div
        className={`duo-img absolute ${move ? "-inset-y-[6%] inset-x-0" : "inset-0"}`}
        style={move ? { y } : undefined}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </motion.div>
    </div>
  );
}

/*
  Фото, приколотое к краю карточки: белое поле как у отпечатка, поворот ±2°, тень бумаги и
  латунная булавка сверху.
*/
export function PinnedPhoto({
  rotate = 2,
  className = "",
  children,
}: {
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure
      className={`paper-shadow relative bg-ivory p-1.5 sm:p-2 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
      {/* Булавка */}
      <span
        aria-hidden
        className="absolute left-1/2 top-0 z-[3] size-3.5 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbefc9,#b8914a_55%,#6b4f22)] shadow-[0_2px_3px_rgb(35_29_26/0.45)]"
      />
    </figure>
  );
}
