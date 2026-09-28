"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, useReducedMotionSafe } from "@/components/ui/hooks";

/*
  Кастомный курсор: латунный кружок догоняет мышь с пружиной. Системный курсор остаётся —
  кружок только подсказывает. Над ссылками и кнопками — кольцо побольше, над фото и видео —
  большое тонкое кольцо, над элементами с data-cursor-label — латунный круг с подписью
  («Тяните» в галерее; там системный курсор прячется, см. .has-cursor в globals.css).
  Только мышь (pointer: fine) и без prefers-reduced-motion. Размер меняется через scale,
  цвет — прозрачностью двух слоёв: анимируем только transform и opacity.
*/

type Mode = "dot" | "link" | "media" | "label";

const SCALE: Record<Mode, number> = { dot: 0.25, link: 1, media: 1.8, label: 2.3 };
const LINK = "a[href], button, [role='button'], label, select, summary, input[type='range'], input[type='checkbox']";
const MEDIA = "img, video, [data-cursor='media']";

export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotionSafe();
  if (!fine || reduce) return null;
  return <CursorDot />;
}

function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.35 });
  const [mode, setMode] = useState<Mode>("dot");
  const [label, setLabel] = useState("");
  const [shown, setShown] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("has-cursor");
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) {
        visible = true;
        // Первое появление — без пролёта из угла экрана
        sx.jump(e.clientX);
        sy.jump(e.clientY);
        setShown(true);
      }
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const labelled = t.closest<HTMLElement>("[data-cursor-label]");
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? "");
        setMode("label");
      } else if (t.closest(LINK)) setMode("link");
      else if (t.closest(MEDIA)) setMode("media");
      else setMode("dot");
    };
    const leave = () => {
      visible = false;
      setShown(false);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    html.addEventListener("pointerleave", leave);
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    return () => {
      html.classList.remove("has-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      html.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
    };
  }, [x, y, sx, sy]);

  const spring = { type: "spring", stiffness: 380, damping: 28 } as const;
  const scale = SCALE[mode] * (pressed ? 0.85 : 1);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95]"
      style={{ x: sx, y: sy }}
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* 44px в полном размере; в режиме «точка» — 11px */}
      <motion.div
        className="absolute -left-[22px] -top-[22px] size-11"
        initial={false}
        animate={{ scale }}
        transition={spring}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-brass"
          initial={false}
          animate={{ opacity: mode === "dot" || mode === "label" ? 1 : mode === "link" ? 0.18 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border border-brass"
          initial={false}
          animate={{ opacity: mode === "link" || mode === "media" ? 0.9 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>
      <motion.span
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-forest-deep"
        initial={false}
        animate={{ opacity: mode === "label" ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
