"use client";

import { useEffect, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { HORSESHOE_NAILS, HORSESHOE_PATH } from "@/components/ui/motifs";

/*
  Прелоадер: только при первом заходе за сессию, не дольше ~1,5 с.
  Инлайн-скрипт ещё до первой отрисовки решает, показывать ли шторку, и ставит
  <html data-preloader="on">. Контент страницы рендерится под шторкой как обычно.
  Состояния: "on" (рисуется подкова) → "reveal" (шторка уезжает) → нет атрибута.
  Пока "on", CSS-анимации первого экрана (.hero-letter, .hero-fade) стоят на паузе.
*/

const KEY = "bz-preloader-seen";
const EVENT = "bz:preloader";

const SCRIPT = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem("${KEY}"))return;sessionStorage.setItem("${KEY}","1");document.documentElement.setAttribute("data-preloader","on")}catch(e){}})()`;

const DRAW = 0.95; // с
const LIFT = 0.55; // с

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
const stage = () => document.documentElement.dataset.preloader;
function setStage(value: "reveal" | null) {
  const html = document.documentElement;
  if (value) html.dataset.preloader = value;
  else delete html.dataset.preloader;
  window.dispatchEvent(new Event(EVENT));
}

// Скрипт выполняется браузером при разборе HTML. На клиенте React его не исполняет:
// type="text/plain" убирает предупреждение о <script> в дев-режиме.
function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Preloader() {
  const active = useSyncExternalStore(
    subscribe,
    () => stage() !== undefined,
    () => true,
  );
  return (
    <>
      <InlineScript html={SCRIPT} />
      {active && <Curtain />}
    </>
  );
}

function Curtain() {
  const progress = useMotionValue(0);
  const lift = useMotionValue(0);
  const y = useTransform(lift, (v) => `${v}%`);
  const count = useTransform(progress, (v) => String(Math.round(v * 100)).padStart(3, "0"));
  const nails = useTransform(progress, [0.8, 1], [0, 1]);

  useEffect(() => {
    if (stage() !== "on") return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    let cancelled = false;
    const draw = animate(progress, 1, { duration: DRAW, ease: [0.65, 0, 0.35, 1] });
    let rise: ReturnType<typeof animate> | undefined;
    draw.then(() => {
      if (cancelled) return;
      html.style.overflow = "";
      setStage("reveal");
      rise = animate(lift, -100, { duration: LIFT, ease: [0.76, 0, 0.24, 1] });
      rise.then(() => !cancelled && setStage(null));
    });
    return () => {
      cancelled = true;
      draw.stop();
      rise?.stop();
      html.style.overflow = "";
    };
  }, [progress, lift]);

  return (
    <motion.div
      aria-hidden
      style={{ y }}
      className="preloader fixed inset-0 z-[100] flex-col items-center justify-center bg-forest-deep text-brass"
    >
      <svg viewBox="0 0 64 64" className="size-28 md:size-36">
        <motion.path
          d={HORSESHOE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="6.5"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />
        <motion.g style={{ opacity: nails }} className="fill-forest-deep">
          {HORSESHOE_NAILS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" />
          ))}
        </motion.g>
      </svg>
      <motion.span className="mt-6 text-[2.2rem] font-extralight tabular-nums leading-none tracking-[-0.03em] text-linen">
        {count}
      </motion.span>
      <span className="eyebrow mt-3 text-linen/50">Буцевичи · конная усадьба</span>
      <span className="stitch absolute inset-x-0 bottom-0 text-brass" />
    </motion.div>
  );
}
