"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { instaPhotos, videos, type Video } from "@/lib/media";
import { LazyVideo } from "@/components/ui/lazy-video";
import { HorseLine } from "@/components/ui/motifs";
import { useReducedMotionSafe, useScrollTransform } from "@/components/ui/hooks";
import { Reveal, RevealImage } from "@/components/ui/motion";

/*
  «Один день в Буцевичах»: пять моментов свадебного дня — утро, регистрация, фотосессия с лошадьми,
  банкет, ночь. Фон идёт dawn → linen → golden и в конце дня темнеет в ночь; солнце в углу садится
  по скроллу, на ночной части загорается гирлянда. На десктопе текст и медиа в две колонки.
  Времени у моментов нет: над таймлайном подпись «Примерный сценарий дня».
  TODO(время): узнать у клиента типичный тайминг свадьбы.
  Каждое фото и видео здесь стоит на странице один раз (lib/media.ts).
*/

type Tone = "day" | "night";

/* ---------- Пунктирная тропа, по которой скачет лошадь ---------- */

function Trail({
  target,
  tone,
  className = "left-4 md:left-8",
}: {
  target: React.RefObject<HTMLElement | null>;
  tone: Tone;
  // Позиция тропы: центр должен совпасть с центром маркеров (size-10 у левого края списка)
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target, offset: ["start 55%", "end 55%"] });
  const tipY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const day = tone === "day";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 w-10 ${className} ${
        day ? "text-forest-deep" : "text-brass"
      }`}
    >
      <span className="stitch-y absolute inset-y-0 left-1/2 -translate-x-1/2 opacity-35" />
      <motion.span
        className="absolute inset-y-0 left-1/2 w-[2px] origin-top -translate-x-1/2 bg-current"
        style={{ scaleY: reduce ? 1 : scrollYProgress }}
      />
      {!reduce && (
        <motion.div className="absolute inset-x-0 top-0 h-full" style={{ y: tipY }}>
          <div
            className={`-mt-5 grid size-10 place-items-center rounded-full md:-ml-1 md:-mt-6 md:size-12 ${
              day
                ? "bg-forest-deep text-linen shadow-[0_8px_20px_rgb(20_28_23/0.35)]"
                : "bg-brass text-forest-deep shadow-[0_0_28px_rgb(201_164_92/0.7)]"
            }`}
          >
            <HorseLine className="gallop h-5 w-auto md:h-6" strokeWidth={1.7} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Один момент дня: текст слева, медиа справа (на телефоне — друг под другом) ---------- */

function Moment({
  tone,
  title,
  text,
  media,
}: {
  tone: Tone;
  title: React.ReactNode;
  text: React.ReactNode;
  media: React.ReactNode;
}) {
  const day = tone === "day";
  return (
    <li className="relative min-w-0 pl-[3.75rem] md:pl-24 lg:pl-32">
      <span
        aria-hidden
        className={`absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-dashed ${
          day ? "border-forest-deep/40 bg-linen" : "border-brass/50 bg-night"
        }`}
      >
        <motion.span
          className={`size-3 rounded-full ${day ? "bg-saddle" : "bg-brass"}`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ amount: 1, margin: "0px 0px -40% 0px" }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        />
      </span>

      <div className="grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
        <Reveal className="md:col-span-5">
          <h3 className="display pt-0.5 text-[2.1rem] leading-[1] [text-wrap:balance] md:text-[3rem] lg:text-[3.6rem]">
            {title}
          </h3>
          <p
            className={`mt-4 max-w-[40ch] text-[1rem] leading-relaxed md:mt-6 md:text-[1.08rem] ${
              day ? "text-forest-deep/80" : "text-linen/75"
            }`}
          >
            {text}
          </p>
        </Reveal>
        <div className="md:col-span-7">{media}</div>
      </div>
    </li>
  );
}

// Два кадра рядом, второй ниже первого. Ширины на десктопе ограничены (ролики 300–700px)
function Pair({ children }: { children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="flex items-start gap-3 md:gap-6">
      <div className="w-[54%] md:w-[52%] lg:max-w-[360px]">{children[0]}</div>
      <div className="mt-12 w-[42%] md:mt-24 md:w-[44%] lg:max-w-[300px]">{children[1]}</div>
    </div>
  );
}

// Живой ролик с плавным появлением. Ширина ограничена разрешением ролика ×1,5 (см. LazyVideo)
function Clip({
  video,
  arch = false,
  delay = 0,
  caption,
  className = "",
}: {
  video: Video;
  arch?: boolean;
  delay?: number;
  // Подпись под роликом — только то, что действительно в кадре (docs/media-svadba.md)
  caption?: string;
  className?: string;
}) {
  return (
    <Reveal delay={delay}>
      <figure>
        <LazyVideo video={video} shade className={`w-full ${arch ? "arch" : ""} ${className}`} />
        {caption && (
          <figcaption className="mt-2 text-[0.78rem] leading-snug opacity-65">{caption}</figcaption>
        )}
      </figure>
    </Reveal>
  );
}

/* ---------- Солнце, которое садится ---------- */

function Sun({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotionSafe();
  const y = useScrollTransform(progress, [0, 0.94], ["0svh", "64svh"]);
  const scale = useTransform(progress, [0, 1], [0.85, 1.3]);
  const dawn = useScrollTransform(progress, [0, 0.4], [1, 0]);
  const gold = useScrollTransform(progress, [0.15, 0.55], [0, 1]);
  const red = useScrollTransform(progress, [0.7, 0.92], [0, 1]);
  const fade = useScrollTransform(progress, [0.9, 0.99], [1, 0]);
  if (reduce) return null;

  return (
    // На телефоне солнце у самого края и приглушено: колонка текста занимает почти всю ширину
    <div aria-hidden className="pointer-events-none sticky top-0 z-0 h-0 max-md:opacity-45">
      <motion.div
        className="absolute -right-5 top-[9svh] size-14 md:right-[6%] md:top-[13svh] md:size-24"
        style={{ y, scale, opacity: fade }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-[#fff4df] shadow-[0_0_60px_30px_rgb(255_240_214/0.55)]"
          style={{ opacity: dawn }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-[#f4b867] shadow-[0_0_80px_40px_rgb(244_184_103/0.45)]"
          style={{ opacity: gold }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-[#e2703e] shadow-[0_0_90px_50px_rgb(226_112_62/0.45)]"
          style={{ opacity: red }}
        />
      </motion.div>
    </div>
  );
}

/* ---------- Гирлянда: лампочки загораются по мере скролла ---------- */

function Bulb({
  x,
  y,
  progress,
  at,
  hideOnMobile,
}: {
  x: number;
  y: number;
  progress: MotionValue<number>;
  at: number;
  hideOnMobile: boolean;
}) {
  const reduce = useReducedMotionSafe();
  const opacity = useScrollTransform(progress, [at, at + 0.06], [0.15, 1]);
  return (
    <motion.span
      className={`absolute ${hideOnMobile ? "max-md:hidden" : ""}`}
      style={{ left: `${x}%`, top: y, opacity: reduce ? 1 : opacity }}
    >
      <span
        className="bulb twinkle block"
        style={
          {
            "--dur": `${2.4 + ((at * 97) % 1.8)}s`,
            "--delay": `${(at * 53) % 2}s`,
          } as React.CSSProperties
        }
      />
    </motion.span>
  );
}

function Strand({
  progress,
  sag,
  count,
  top,
  offset,
}: {
  progress: MotionValue<number>;
  sag: number;
  count: number;
  top: number;
  offset: number;
}) {
  const bulbs = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    return { x: t * 100, y: 4 * sag * t * (1 - t), i };
  });
  return (
    <div className="absolute inset-x-0" style={{ top, height: sag + 20 }} aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 100 ${sag + 20}`}
        preserveAspectRatio="none"
      >
        <path
          d={`M0 0 Q50 ${sag * 2} 100 0`}
          fill="none"
          stroke="rgb(243 236 224 / 0.28)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {bulbs.map((b) => (
        <Bulb
          key={b.i}
          x={b.x}
          y={b.y + 2}
          progress={progress}
          at={offset + (b.i / count) * 0.55}
          hideOnMobile={b.i % 2 === 1}
        />
      ))}
    </div>
  );
}

function Garland() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 25%"] });
  return (
    <div ref={ref} className="relative h-24 md:h-32">
      <Strand progress={scrollYProgress} sag={48} count={24} top={0} offset={0} />
      <Strand progress={scrollYProgress} sag={30} count={18} top={44} offset={0.2} />
    </div>
  );
}

/* ---------- Блок целиком ---------- */

export function DayStory() {
  const sunRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLOListElement>(null);
  const nightRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress: sunProgress } = useScroll({
    target: sunRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="den-svadby" aria-labelledby="story-title" className="relative">
      {/* ДЕНЬ: общий слой для солнца. isolate — своя стопка слоёв. Внизу фон темнеет в ночь */}
      <div ref={sunRef} className="relative isolate overflow-clip">
        <Sun progress={sunProgress} />

        <div className="bg-[linear-gradient(180deg,var(--color-dawn)_0%,var(--color-linen)_12%,var(--color-linen)_55%,var(--color-golden)_84%,#b8653a_93%,var(--color-night)_100%)] pb-24 pt-16 text-forest-deep md:pb-40 md:pt-24">
          <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-8">
            <header className="pb-10 md:pb-16 md:pl-24 lg:pl-32">
              <p className="eyebrow text-saddle">Один день в Буцевичах</p>
              <h2
                id="story-title"
                className="display mt-4 max-w-[14ch] text-[2.6rem] leading-[0.98] md:text-[4.4rem] lg:text-[5.2rem]"
              >
                Как проходит свадьба <em className="text-saddle">в усадьбе</em>
              </h2>
              <p className="mt-5 inline-flex rounded-full border border-dashed border-forest-deep/35 px-4 py-1.5 text-[0.85rem] text-forest-deep/80">
                Примерный сценарий дня
              </p>
            </header>

            <div className="relative">
              <Trail target={dayRef} tone="day" className="left-0" />
              <ol ref={dayRef} className="relative grid gap-14 md:gap-24">
                <Moment
                  tone="day"
                  title="Утро: зал готовят к празднику"
                  text="Длинный стол, зелень и сервировка: к приезду гостей всё готово."
                  media={
                    <Pair>
                      <Clip video={videos.hallPrep} arch />
                      <Clip video={videos.hallEmpty} delay={0.15} caption="Окна в пол и буквы LOVE" />
                    </Pair>
                  }
                />

                <Moment
                  tone="day"
                  title="Регистрация на лугу у арки"
                  text="Живописная зелёная лужайка и стилизованная свадебная арка из вековой сосны. Для гостей тюки сена и лавочки."
                  media={
                    <Pair>
                      {/* Вверху кадра белый стикер из Instagram — увеличиваем от нижнего края */}
                      <RevealImage
                        photo={instaPhotos.ceremonyMeadow}
                        shape="arch"
                        sizes="(min-width: 1024px) 360px, 54vw"
                        imgClassName="origin-bottom scale-[1.2] object-[46%_50%]"
                        className="aspect-[4/5] w-full"
                      />
                      <Clip video={videos.ceremonyArchShort} delay={0.15} caption="Арка и тюки сена для гостей" />
                    </Pair>
                  }
                />

                <Moment
                  tone="day"
                  title="Фотосессия с лошадьми"
                  text="Для молодых выводим лошадей и даём сопровождающего. Вокруг усадьбы холмистые поля и лес."
                  media={
                    // Здесь только настоящий свадебный кадр: ролик 06 (невеста с лошадьми) — на первом экране
                    <div className="w-[84%] md:w-full md:max-w-[420px]">
                      <Clip video={videos.brideWalk} caption="Невеста и гости идут к полю, рядом ведут лошадь" />
                    </div>
                  }
                />

                <Moment
                  tone="day"
                  title="Фуршет и банкет"
                  text="Фуршет в открытых беседках и лаунж-зонах, банкет в светлом зале с окнами в пол. Готовит наш повар, обслуживают официанты."
                  media={
                    <Pair>
                      <RevealImage
                        photo={instaPhotos.fourchetteTable}
                        sizes="(min-width: 1024px) 360px, 54vw"
                        className="aspect-[1080/1478] w-full"
                      />
                      <Clip video={videos.firstDance} delay={0.15} caption="Первый танец под навесом" />
                    </Pair>
                  }
                />
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* НОЧЬ */}
      <div className="bg-night pb-16 text-linen md:pb-24">
        <Garland />
        <div className="relative mx-auto max-w-[1440px] px-4 pt-4 md:px-8">
          <Trail target={nightRef} tone="night" />
          <ol ref={nightRef} className="relative grid">
            <Moment
              tone="night"
              title="Ночь под ретро-гирляндами"
              text="Вечерняя праздничная подсветка ретро-гирляндами в зале и на улице, танцы на большой террасе."
              media={
                <Pair>
                  <Clip video={videos.eveningGazebo} arch />
                  <Clip video={videos.nightBonfire} delay={0.15} caption="Костёр и светящиеся буквы LOVE" />
                </Pair>
              }
            />
          </ol>
        </div>
      </div>
    </section>
  );
}
