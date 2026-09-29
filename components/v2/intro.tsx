"use client";

import { Horseshoe } from "@/components/ui/motifs";
import { WaxSeal } from "./seal";

/*
  Интро «конверт» (v2): только первый заход за сессию и без reduced-motion.
  Инлайн-скрипт ставит <html data-v2-intro="on"> до первой отрисовки, через 1,4 с — "done".
  Анимация — CSS (globals.css, раздел «v2: интро»): клапан открывается, открытка выезжает вверх,
  слой растворяется за 1,15 с. Страница под ним уже в серверном HTML; без JS интро не показывается.
*/

const KEY = "bz-v2-intro-seen";
const SCRIPT = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem("${KEY}"))return;sessionStorage.setItem("${KEY}","1");var h=document.documentElement;h.setAttribute("data-v2-intro","on");setTimeout(function(){h.setAttribute("data-v2-intro","done")},1400)}catch(e){}})()`;

// Скрипт выполняется браузером при разборе HTML. На клиенте React его не исполняет:
// type="text/plain" убирает предупреждение о <script> в дев-режиме (как у прелоадера v1)
export function IntroScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}

export function IntroEnvelope() {
  return (
    <div
      aria-hidden
      className="v2-intro tex pointer-events-none fixed inset-0 z-[95] place-items-center bg-ivory-2"
    >
      <div className="relative aspect-[1.45] w-[min(78vw,420px)] [perspective:900px]">
        {/* Задняя стенка конверта */}
        <div className="absolute inset-0 bg-[#d9c7a6] shadow-[0_30px_60px_-30px_rgb(35_29_26/0.45)]" />
        {/* Открытка внутри. Надпись — в верхней части: пока конверт закрыт, её прячет клапан */}
        <div className="v2-env-card absolute inset-x-[7%] bottom-[6%] top-[8%] z-[1] flex flex-col items-center justify-start gap-1.5 bg-ivory pt-[7%] text-ink">
          <div className="invite-frame absolute inset-[6%] text-gold [--corner:18px]" />
          <Horseshoe size={22} className="text-gold" />
          <span className="prata text-[1.35rem] text-wine">Буцевичи</span>
          <span className="script text-[1.15rem] text-wine-soft">приглашает</span>
        </div>
        {/* Карман: нижний и боковые клапаны закрывают низ открытки */}
        <div className="absolute inset-0 z-[2] bg-[#e3d3b5] [clip-path:polygon(0_0,50%_58%,100%_0,100%_100%,0_100%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_49.6%,rgb(156_116_51/0.5)_50%,transparent_50.4%),linear-gradient(to_top_left,transparent_49.6%,rgb(156_116_51/0.5)_50%,transparent_50.4%)]" />
        </div>
        {/* Верхний клапан с сургучной печатью на острие: откидывается назад (rotateX), печать
            с обратной стороны не видна */}
        <div className="v2-env-flap absolute inset-x-0 top-0 z-[3] h-[60%] origin-top [transform-style:preserve-3d]">
          <div className="h-full w-full bg-[#cfba94] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <WaxSeal
            id="intro-seal"
            className="absolute left-1/2 top-full w-[22%] -translate-x-1/2 -translate-y-[62%] [backface-visibility:hidden]"
          />
        </div>
      </div>
    </div>
  );
}
