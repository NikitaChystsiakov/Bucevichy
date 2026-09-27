"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import type { Photo } from "@/lib/photos";
import { useReducedMotionSafe } from "./hooks";

const EASE = [0.16, 1, 0.3, 1] as const;

// Плавное появление блока при попадании в экран
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
}) {
  const reduce = useReducedMotionSafe();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      // Начальное состояние одинаковое на сервере и клиенте (иначе при reduced-motion
      // элемент остаётся невидимым после гидратации); при reduced-motion — без анимации
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

// Фото «проявляется» шторкой снизу вверх и слегка отъезжает при скролле
export function RevealImage({
  photo,
  sizes,
  className = "",
  imgClassName = "",
  parallax = 0,
  preload,
  shape = "rect",
  delay = 0,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  imgClassName?: string;
  parallax?: number;
  preload?: boolean;
  shape?: "rect" | "arch";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  // Следим за внешней обёрткой: у обрезанного clip-path элемента IntersectionObserver
  // в Chrome видит нулевую площадь, и анимация не запускается
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-parallax}%`, `${parallax}%`]);
  const shown = reduce || inView;
  const restScale = parallax ? 1 + parallax / 50 : 1;

  return (
    <div
      ref={ref}
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden ${
        shape === "arch" ? "arch" : ""
      } ${className}`}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-forest"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={shown ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={reduce ? { duration: 0 } : { duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          style={parallax && !reduce ? { y } : undefined}
          initial={{ scale: 1.18 }}
          animate={shown ? { scale: reduce ? 1 : restScale } : undefined}
          transition={reduce ? { duration: 0 } : { duration: 1.6, delay, ease: EASE }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            preload={preload}
            className={`photo-grade object-cover ${imgClassName}`}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Разбивка заголовка на слова, которые выезжают из-под маски
export function SplitWords({
  text,
  className = "",
  delay = 0,
  emphasis = [],
  emphasisClass = "",
  animateOnMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  emphasis?: string[];
  emphasisClass?: string;
  animateOnMount?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();
  // Наблюдаем за всей строкой, а не за словами: слова спрятаны под маской,
  // и IntersectionObserver их «не видит»
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const go = animateOnMount || inView;
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-top">
            <motion.span
              className={`inline-block ${emphasis.includes(w) ? emphasisClass : ""}`}
              initial={{ y: "105%" }}
              animate={go ? { y: "0%" } : undefined}
              transition={reduce ? { duration: 0 } : { duration: 1, delay: delay + i * 0.07, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
