"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Clock, Gift } from "@phosphor-icons/react";
import { photos } from "@/lib/photos";
import { instaPhotos, videos, type Video } from "@/lib/media";
import { addons } from "@/lib/wedding";
import { LazyVideo } from "@/components/ui/lazy-video";
import { HorseLine } from "@/components/ui/motifs";
import { useReducedMotionSafe } from "@/components/ui/hooks";
import { Reveal, RevealImage } from "@/components/ui/motion";

/*
  «Один день в Буцевичах»: скролл = свадебный день.
  Фон идёт dawn → linen → golden (день), закат golden → night, дальше ночь.
  Солнце в углу садится по скроллу, на ночной части загорается гирлянда.
  TODO(время): время моментов придумано для демо, уточнить у клиента типичный тайминг.
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

/* ---------- Один момент дня ---------- */

function Moment({
  time,
  tone,
  title,
  tag,
  children,
}: {
  time: string;
  tone: Tone;
  title: React.ReactNode;
  tag?: { label: string; gift?: boolean };
  children: React.ReactNode;
}) {
  const day = tone === "day";
  return (
    <li className="relative min-w-0 pl-[3.75rem] md:pl-28 lg:pl-40">
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

      <Reveal>
        <div className="flex flex-wrap items-center gap-2 pt-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.8rem] font-semibold tabular-nums ${
              day ? "border-forest-deep/25" : "border-linen/25 text-linen"
            }`}
          >
            <Clock size={14} weight="bold" />
            {time}
          </span>
          {tag && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${
                tag.gift
                  ? "bg-brass text-forest-deep"
                  : day
                    ? "border border-forest-deep/25 text-forest-deep/75"
                    : "border border-linen/25 text-linen/75"
              }`}
            >
              {tag.gift && <Gift size={13} weight="fill" />}
              {tag.label}
            </span>
          )}
        </div>
        <h3 className="display mt-5 max-w-[17ch] text-[2.3rem] leading-[1] md:text-[3.4rem] lg:text-[4.2rem]">
          {title}
        </h3>
      </Reveal>
      <div className="mt-7 md:mt-10">{children}</div>
    </li>
  );
}

function Text({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  return (
    <Reveal
      as="p"
      className={`max-w-[44ch] text-[1.02rem] leading-relaxed md:text-[1.1rem] ${
        tone === "day" ? "text-forest-deep/80" : "text-linen/75"
      }`}
    >
      {children}
    </Reveal>
  );
}

// Живой ролик с плавным появлением. Ширина ограничена разрешением ролика ×1,5 (см. LazyVideo)
function Clip({
  video,
  className = "",
  arch = false,
  delay = 0,
  caption,
}: {
  video: Video;
  className?: string;
  arch?: boolean;
  delay?: number;
  // Подпись под роликом — только то, что действительно в кадре (docs/media-svadba.md)
  caption?: string;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <figure>
        <LazyVideo video={video} shade className={`w-full ${arch ? "arch" : ""}`} />
        {caption && (
          <figcaption className="mt-2.5 text-[0.8rem] leading-snug opacity-65">{caption}</figcaption>
        )}
      </figure>
    </Reveal>
  );
}

/* ---------- Солнце, которое садится ---------- */

function Sun({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotionSafe();
  const y = useTransform(progress, [0, 0.94], ["0svh", "64svh"]);
  const scale = useTransform(progress, [0, 1], [0.85, 1.3]);
  const dawn = useTransform(progress, [0, 0.4], [1, 0]);
  const gold = useTransform(progress, [0.15, 0.55], [0, 1]);
  const red = useTransform(progress, [0.7, 0.92], [0, 1]);
  const fade = useTransform(progress, [0.9, 0.99], [1, 0]);
  if (reduce) return null;

  return (
    // На телефоне солнце у самого края и приглушено: колонка текста занимает почти всю ширину
    <div aria-hidden className="pointer-events-none sticky top-0 z-0 h-0 max-md:opacity-45">
      <motion.div
        className="absolute -right-5 top-[9svh] size-14 md:right-[9%] md:top-[13svh] md:size-28"
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
  const opacity = useTransform(progress, [at, at + 0.06], [0.15, 1]);
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 15%"] });
  return (
    <div ref={ref} className="relative h-40 md:h-52">
      <Strand progress={scrollYProgress} sag={62} count={26} top={0} offset={0} />
      <Strand progress={scrollYProgress} sag={40} count={20} top={70} offset={0.2} />
    </div>
  );
}

/* ---------- Закат: солнце уходит за холмы ---------- */

function Dusk() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["40%", "-10%"]);
  return (
    // Фон — не позиционированный блок: солнце (sticky, z-0) рисуется поверх фона, но под холмами
    <div
      ref={ref}
      className="h-[90svh] min-h-[560px] bg-[linear-gradient(180deg,var(--color-golden)_0%,#c96f3f_32%,#5d3b3b_60%,var(--color-night)_88%)]"
    >
      <div className="relative z-10 h-full">
        <motion.p
          style={reduce ? undefined : { y: textY }}
          className="display absolute inset-x-0 top-[26%] px-4 text-center text-[2.6rem] italic leading-[1.02] text-linen md:text-[5rem]"
        >
          А вечером загораются
          <br />
          ретро-гирлянды
        </motion.p>
        {/* Холмы на горизонте */}
        <svg
          aria-hidden
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-[34%] w-full"
        >
          <path
            d="M0 120 C160 70 300 60 460 96 C600 128 720 80 880 70 C1040 60 1180 110 1300 96 C1370 88 1410 80 1440 76 L1440 220 L0 220 Z"
            fill="#1d2433"
          />
          <path
            d="M0 160 C200 120 360 128 540 150 C700 170 860 130 1040 124 C1200 118 1330 150 1440 140 L1440 220 L0 220 Z"
            fill="var(--color-night)"
          />
        </svg>
      </div>
    </div>
  );
}

/* ---------- Блок целиком ---------- */

const programActivities = [
  "Катание верхом",
  "Катание в экипаже",
  "Экскурсия в конюшню",
  "Стрельба из лука и пневматики",
  "Бросание лассо",
  "Метание подков",
  "Уличная Дженга",
  "Постановочная кража невесты",
];

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
      {/* ДЕНЬ + ЗАКАТ: общий слой для солнца. isolate — своя стопка слоёв */}
      <div ref={sunRef} className="relative isolate overflow-clip">
        <Sun progress={sunProgress} />

        <div className="bg-[linear-gradient(180deg,var(--color-dawn)_0%,var(--color-linen)_16%,var(--color-linen)_58%,var(--color-golden)_100%)] pb-28 pt-24 text-forest-deep md:pb-40 md:pt-36">
          <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-8">
            <header className="pb-16 md:pb-24 md:pl-28 lg:pl-40">
              <p className="eyebrow text-saddle">Один день в Буцевичах</p>
              <h2
                id="story-title"
                className="display mt-5 max-w-[14ch] text-[2.8rem] leading-[0.98] md:text-[4.8rem] lg:text-[6rem]"
              >
                Как проходит свадьба <em className="text-saddle">в усадьбе</em>
              </h2>
              <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-forest-deep/75">
                От утренних сборов до ночи под гирляндами. Всё на одной территории, в 23 км от
                Минска.
              </p>
            </header>

            <div className="relative">
              <Trail target={dayRef} tone="day" className="left-0" />
              <ol ref={dayRef} className="relative grid gap-28 md:gap-44">
                <Moment time="09:00" tone="day" title="Утро: зал готовят к празднику">
                  <div className="grid gap-8 md:grid-cols-12 md:items-end">
                    <div className="md:col-span-5">
                      <Text tone="day">
                        Пока в светлом зале накрывают дубовые столы и раскладывают шифоновые
                        ранеры, можно встретить рассвет над лесом на террасе с чашкой травяного
                        чая.
                      </Text>
                    </div>
                    <Clip
                      video={videos.hallPrep}
                      arch
                      className="w-[64%] md:col-span-4 md:col-start-8 md:w-full"
                    />
                  </div>
                </Moment>

                <Moment
                  time="12:00"
                  tone="day"
                  title="Гостей встречают всадники верхом"
                  tag={{ label: "в тематической программе" }}
                >
                  <RevealImage
                    photo={photos.ridersWelcome}
                    sizes="(min-width: 1024px) 80vw, 90vw"
                    parallax={5}
                    className="aspect-[4/3] w-full md:aspect-[16/9]"
                  />
                </Moment>

                <Moment
                  time="13:00"
                  tone="day"
                  title="Невеста выезжает на регистрацию верхом"
                  tag={{ label: "в подарок", gift: true }}
                >
                  <div className="grid gap-8 md:grid-cols-12 md:items-center">
                    <div className="md:col-span-5">
                      <Text tone="day">
                        Регистрация проходит на зелёной лужайке у арки из вековой сосны, гости
                        сидят на тюках сена и лавочках. Невеста появляется верхом на лошади, и
                        это наш подарок к площадке.
                      </Text>
                    </div>
                    {/* TODO(фото): видео, где невеста именно выезжает верхом, в хорошем качестве */}
                    <Clip
                      video={videos.brideHorsesSunset}
                      arch
                      caption="Невеста с лошадьми на закате"
                      className="w-[70%] md:col-span-4 md:col-start-8 md:w-full"
                    />
                  </div>
                </Moment>

                <Moment
                  time="14:00"
                  tone="day"
                  title="Фотосессия с лошадьми"
                  tag={{ label: "в подарок", gift: true }}
                >
                  <Text tone="day">
                    Для молодых выводим лошадей и даём сопровождающего. Фотосессия тоже входит в
                    стоимость площадки.
                  </Text>
                  <div className="mt-10 flex items-start gap-4 md:gap-8">
                    <Clip
                      video={videos.brideWalk}
                      caption="Идём к лошадям на золотой час"
                      className="w-[50%] lg:w-[420px]"
                    />
                    <Clip
                      video={videos.ridersField}
                      delay={0.15}
                      className="mt-16 w-[46%] md:mt-28 lg:w-[440px]"
                    />
                  </div>
                </Moment>

                <Moment time="15:00" tone="day" title="Фуршет в беседках и на лугу">
                  <div className="grid gap-8 md:grid-cols-12">
                    <div className="md:col-span-4">
                      <Text tone="day">
                        Открытые беседки для фуршета, лаунж-зоны с диванами из паллет и
                        креслами-мешками. Готовит наш повар, обслуживают официанты.
                      </Text>
                    </div>
                    <div className="flex items-start gap-4 md:col-span-8 md:gap-8">
                      {/* Ролик 23 не берём: внизу кадра осталась подпись из Instagram */}
                      <RevealImage
                        photo={instaPhotos.fourchetteTable}
                        sizes="(min-width: 1024px) 340px, 48vw"
                        className="aspect-[1080/1478] w-[48%] lg:w-[340px]"
                      />
                      <Clip
                        video={videos.fourchette}
                        delay={0.15}
                        className="mt-12 w-[48%] md:mt-24 lg:w-[400px]"
                      />
                    </div>
                  </div>
                </Moment>

                <Moment
                  time="16:00"
                  tone="day"
                  title="Ковбойская программа для гостей"
                  tag={{ label: `${addons.program.pricePerGuest} руб с гостя` }}
                >
                  <ul className="flex max-w-[760px] flex-wrap gap-2">
                    {programActivities.map((a, i) => (
                      <Reveal
                        as="li"
                        key={a}
                        delay={i * 0.05}
                        y={12}
                        className="rounded-full border border-dashed border-forest-deep/30 px-4 py-2 text-[0.92rem]"
                      >
                        {a}
                      </Reveal>
                    ))}
                  </ul>
                  <div className="mt-10 grid grid-cols-12 gap-4 md:gap-6">
                    <RevealImage
                      photo={photos.stableSilhouettes}
                      sizes="(min-width: 768px) 60vw, 90vw"
                      parallax={4}
                      className="col-span-12 aspect-[4/3] md:col-span-8 md:aspect-[16/10]"
                    />
                    <RevealImage
                      photo={photos.archery}
                      sizes="(min-width: 768px) 30vw, 60vw"
                      delay={0.15}
                      className="col-span-8 col-start-5 -mt-16 aspect-[3/2] md:col-span-4 md:col-start-9 md:mt-40"
                    />
                  </div>
                </Moment>

                <Moment time="18:00" tone="day" title="Банкет в светлом зале с окнами в пол">
                  <div className="grid gap-8 md:grid-cols-12 md:items-end">
                    <div className="relative md:col-span-7">
                      <RevealImage
                        photo={instaPhotos.hallTable}
                        sizes="(min-width: 1024px) 460px, 78vw"
                        className="aspect-[828/1118] w-[78%] lg:w-[460px]"
                      />
                      <Clip
                        video={videos.hallEmpty}
                        delay={0.2}
                        className="absolute -bottom-10 right-0 w-[46%] border-[5px] border-golden md:-bottom-14 md:right-4 lg:w-[300px]"
                      />
                    </div>
                    <div className="mt-8 grid gap-5 md:col-span-5 md:mt-0">
                      {/* TODO(вместимость): 100 гостей в зале / 80 на свадьбе / 120 на главной —
                          пока цифру в тексте не показываем, уточнить у клиента */}
                      <Text tone="day">
                        Новый зал 170 м² из беленого дерева: окна в пол в две стены и шикарные
                        виды на поля. Дубовые столы в стиле эко-лофт и шифоновые ранеры.
                      </Text>
                      <Text tone="day">
                        Банкет, фуршет и обслуживание от {addons.banquet.pricePerGuestMin} до{" "}
                        {addons.banquet.pricePerGuestMax} руб с гостя.
                      </Text>
                    </div>
                  </div>
                </Moment>
              </ol>
            </div>
          </div>
        </div>

        <Dusk />
      </div>

      {/* НОЧЬ */}
      <div className="bg-night pb-28 text-linen md:pb-40">
        <Garland />
        <div className="relative mx-auto max-w-[1440px] px-4 pt-8 md:px-8">
          <Trail target={nightRef} tone="night" />
          <ol ref={nightRef} className="relative grid gap-28 md:gap-44">
            <Moment time="21:00" tone="night" title="Вечер под ретро-гирляндами">
              <div className="grid gap-8 md:grid-cols-12 md:items-center">
                <Clip video={videos.eveningGazebo} arch className="w-[72%] md:col-span-5 md:w-full" />
                <div className="md:col-span-5 md:col-start-8">
                  <Text tone="night">
                    Вечерняя праздничная подсветка ретро-гирляндами в зале и на улице, открытые
                    беседки и лаунж-зоны с диванами из паллет.
                  </Text>
                </div>
              </div>
            </Moment>

            <Moment time="22:00" tone="night" title="Танцы на террасе">
              <div className="grid gap-8 md:grid-cols-12 md:items-center">
                <div className="md:col-span-5">
                  <Text tone="night">
                    Для танцев — большая терраса у зала, а вечером её освещают ретро-гирлянды.
                  </Text>
                </div>
                <Clip
                  video={videos.firstDance}
                  caption="Первый танец под навесом"
                  className="w-[72%] md:col-span-5 md:col-start-8 md:w-full"
                />
              </div>
            </Moment>

            {/* TODO(вместимость): «ночлег до 40» есть в разделах 5 и 7, но в разделе 18 спорный */}
            <Moment time="23:00" tone="night" title="Ночь: гости остаются в усадьбе">
              <Text tone="night">
                До 40 гостей ночуют в наших домах КАНТРИ и ШАЛЕ. На второй день баня на дровах и
                мангалы.
              </Text>
              <div className="mt-10 flex items-start gap-4 md:gap-8">
                <Clip video={videos.nightBonfire} className="w-[48%] lg:w-[360px]" />
                <RevealImage
                  photo={instaPhotos.nightSparklers}
                  sizes="(min-width: 1024px) 380px, 48vw"
                  delay={0.15}
                  className="mt-16 aspect-[1083/1679] w-[48%] md:mt-28 lg:w-[380px]"
                />
              </div>
            </Moment>
          </ol>
        </div>
      </div>
    </section>
  );
}
