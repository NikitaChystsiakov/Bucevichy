"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { Video } from "@/lib/media";

// Видео-«живое фото»: без звука, по кругу, играет только пока видно на экране.
// preload="none" — до попадания в экран грузится только постер.
// При prefers-reduced-motion видео не запускается, остаётся постер.
export function LazyVideo({
  video,
  className = "",
  videoClassName = "",
  cap = true,
  ratio = true,
  shade = false,
}: {
  video: Video;
  className?: string;
  videoClassName?: string;
  // Не растягивать больше исходного разрешения ×1,5: ролики из Instagram маленькие
  cap?: boolean;
  // Держать пропорции кадра (выключить, если размер задаёт родитель)
  ratio?: boolean;
  // Тёмный градиент снизу поверх ролика
  shade?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {
            // Автозапуск запрещён (режим энергосбережения и т. п.) — остаётся постер
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [reduce]);

  return (
    <div
      // relative не добавляем, если позиционирует родитель (absolute inset-0), иначе блок схлопнется
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden bg-forest ${className}`}
      style={{
        aspectRatio: ratio ? `${video.width} / ${video.height}` : undefined,
        maxWidth: cap ? Math.round(video.width * 1.5) : undefined,
      }}
    >
      <video
        ref={ref}
        className={`photo-grade absolute inset-0 h-full w-full object-cover ${videoClassName}`}
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={video.alt}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      {shade && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(20_28_23/0.55)_100%)]"
        />
      )}
    </div>
  );
}
