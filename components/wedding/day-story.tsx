"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Bed,
  Camera,
  Flower,
  ForkKnife,
  Heart,
  Horse,
  MusicNotes,
  Target,
  type Icon,
} from "@phosphor-icons/react";
import { photos } from "@/lib/photos";
import { addons } from "@/lib/wedding";
import { Reveal, RevealImage } from "@/components/ui/motion";

type Tone = "day" | "night";

/* ---------- Верёвка-таймлайн с бегущей лошадкой ---------- */

function Rope({ target, tone }: { target: React.RefObject<HTMLElement | null>; tone: Tone }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start 55%", "end 55%"] });
  const tipY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const day = tone === "day";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-5 w-10 md:left-8"
    >
      <div
        className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${
          day
            ? "bg-[repeating-linear-gradient(to_bottom,rgb(21_32_26/0.28)_0_6px,transparent_6px_11px)]"
            : "bg-[repeating-linear-gradient(to_bottom,rgb(233_232_223/0.22)_0_6px,transparent_6px_11px)]"
        }`}
      />
      <motion.div
        className={`absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 origin-top ${
          day ? "bg-ink" : "bg-amber shadow-[0_0_12px_rgb(227_165_79/0.7)]"
        }`}
        style={{ scaleY: reduce ? 1 : scrollYProgress }}
      />
      {!reduce && (
        <motion.div className="absolute inset-x-0 top-0 h-full" style={{ y: tipY }}>
          <div
            className={`-mt-5 grid size-10 place-items-center rounded-full ${
              day
                ? "bg-ink text-bone shadow-[0_6px_18px_rgb(21_32_26/0.35)]"
                : "bg-amber text-ink shadow-[0_0_24px_rgb(227_165_79/0.8)]"
            }`}
          >
            <Horse size={20} weight="fill" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Один момент дня ---------- */

function Moment({
  icon: IconCmp,
  tone,
  title,
  children,
  tag,
  id,
}: {
  icon: Icon;
  tone: Tone;
  title: string;
  children: React.ReactNode;
  tag?: { label: string; gift?: boolean };
  id?: string;
}) {
  const day = tone === "day";
  return (
    <li id={id} className="relative pl-16 md:pl-28 lg:pl-40">
      <motion.span
        aria-hidden
        className="absolute left-0 top-1 grid size-10 place-items-center rounded-full border"
        initial={{
          backgroundColor: day ? "#edeee7" : "#0d1611",
          borderColor: day ? "rgba(21,32,26,0.25)" : "rgba(233,232,223,0.25)",
          color: day ? "#4a574f" : "rgba(233,232,223,0.6)",
        }}
        whileInView={{
          backgroundColor: day ? "#e1e3d9" : "#1c2d23",
          borderColor: day ? "rgba(21,32,26,0.7)" : "rgba(227,165,79,0.9)",
          color: day ? "#15201a" : "#e3a54f",
        }}
        viewport={{ amount: 1, margin: "0px 0px -40% 0px" }}
        transition={{ duration: 0.4 }}
      >
        <IconCmp size={18} />
      </motion.span>

      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <h3
            className={`display max-w-[22ch] text-[1.95rem] leading-[1.08] md:text-[2.6rem] ${
              day ? "text-ink" : "text-mist"
            }`}
          >
            {title}
          </h3>
        </div>
        {tag && (
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-[0.78rem] font-medium ${
              tag.gift
                ? "bg-amber text-ink"
                : day
                  ? "border border-ink/25 text-ink-soft"
                  : "border border-mist/25 text-mist-soft"
            }`}
          >
            {tag.label}
          </span>
        )}
      </Reveal>
      <div className="mt-6 md:mt-8">{children}</div>
    </li>
  );
}

function Text({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  return (
    <Reveal
      as="p"
      className={`max-w-[46ch] text-[1.05rem] leading-relaxed ${
        tone === "day" ? "text-ink-soft" : "text-mist-soft"
      }`}
    >
      {children}
    </Reveal>
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
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, [at, at + 0.06], [0.18, 1]);
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
          stroke="#2b2a22"
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

function Dusk() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end 70%"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["30%", "-10%"]);
  return (
    <div
      ref={ref}
      className="relative h-[110svh] min-h-[680px] overflow-hidden bg-[linear-gradient(180deg,#edeee7_0%,#e6d7b8_18%,#c98f4f_36%,#5a4331_52%,#1a1e17_66%,#0d1611_78%)]"
    >
      <div className="absolute inset-x-0 top-[44%]">
        <Strand progress={scrollYProgress} sag={70} count={26} top={0} offset={0} />
        <Strand progress={scrollYProgress} sag={46} count={20} top={86} offset={0.18} />
      </div>
      <motion.p
        style={{ y: textY }}
        className="display absolute inset-x-0 top-[70%] px-5 text-center text-[2.4rem] italic leading-[1.1] text-mist md:text-[4rem]"
      >
        А вечером загораются гирлянды
      </motion.p>
    </div>
  );
}

/* ---------- Блок целиком ---------- */

export function DayStory() {
  const dayRef = useRef<HTMLOListElement>(null);
  const nightRef = useRef<HTMLOListElement>(null);

  return (
    <section id="den-svadby" aria-labelledby="story-title" className="relative">
      {/* ДЕНЬ */}
      <div className="bg-bone pb-28 md:pb-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <header className="pb-16 md:pb-24 md:pl-28 lg:pl-40">
            <h2
              id="story-title"
              className="display max-w-[16ch] text-[2.6rem] leading-[1.03] text-ink md:text-[4.4rem]"
            >
              Как проходит свадьба в усадьбе
            </h2>
            <p className="mt-5 max-w-[44ch] text-[1.05rem] leading-relaxed text-ink-soft">
              От встречи гостей всадниками до бани на второй день. Всё на одной территории, в 23 км
              от Минска.
            </p>
          </header>
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
          <Rope target={dayRef} tone="day" />
          <ol ref={dayRef} className="relative grid gap-28 md:gap-40">
            <Moment
              icon={Horse}
              tone="day"
              title="Гостей встречают всадники верхом на лошадях"
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
              icon={Heart}
              tone="day"
              title="Невеста выезжает на регистрацию верхом"
              tag={{ label: "в подарок к площадке", gift: true }}
            >
              <div className="grid gap-8 md:grid-cols-12 md:items-end">
                <div className="md:col-span-5">
                  <Text tone="day">
                    Невеста появляется на выездной регистрации верхом на лошади. Это наш подарок:
                    выезд входит в стоимость площадки.
                  </Text>
                </div>
                {/* TODO(фото): настоящее фото невесты верхом */}
                <RevealImage
                  photo={photos.riderPaint}
                  shape="arch"
                  sizes="(min-width: 768px) 45vw, 90vw"
                  className="aspect-[4/5] w-full md:col-span-6 md:col-start-7"
                  imgClassName="object-[48%_50%]"
                />
              </div>
            </Moment>

            <Moment icon={Flower} tone="day" title="Регистрация у арки из вековой сосны">
              <div className="grid gap-8 md:grid-cols-12 md:items-start">
                {/* TODO(фото): арка из вековой сосны, тюки сена, гости на регистрации */}
                <RevealImage
                  photo={photos.lawn}
                  sizes="(min-width: 768px) 35vw, 90vw"
                  className="aspect-[3/2] w-full md:col-span-5"
                />
                <div className="md:col-span-6 md:col-start-7 md:pt-8">
                  <Text tone="day">
                    Выездная регистрация на зелёной лужайке. Для гостей тюки сена и лавочки, вокруг
                    бескрайние поля. Постановочную регистрацию можно заказать в тематической
                    программе.
                  </Text>
                </div>
              </div>
            </Moment>

            <Moment
              icon={Camera}
              tone="day"
              title="Фотосессия с лошадьми"
              tag={{ label: "в подарок к площадке", gift: true }}
            >
              <Text tone="day">
                Для молодых выводим лошадей и даём сопровождающего. Фотосессия тоже входит в
                стоимость площадки.
              </Text>
              <div className="mt-10 grid grid-cols-12 gap-4 md:gap-6">
                <RevealImage
                  photo={photos.girlWithHorse}
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="col-span-6 aspect-[3/4] md:col-span-4"
                />
                <RevealImage
                  photo={photos.laughWithHorse}
                  sizes="(min-width: 768px) 50vw, 50vw"
                  delay={0.15}
                  className="col-span-6 mt-16 aspect-[3/4] md:col-span-7 md:col-start-6 md:mt-28 md:aspect-[3/2]"
                />
              </div>
            </Moment>

            <Moment
              icon={Target}
              tone="day"
              title="Ковбойская программа для гостей"
              tag={{ label: `${addons.program.pricePerGuest} руб с гостя` }}
            >
              <ul className="flex max-w-[760px] flex-wrap gap-2">
                {[
                  "Катание верхом",
                  "Катание в экипаже",
                  "Экскурсия в конюшню",
                  "Стрельба из лука и пневматики",
                  "Бросание лассо",
                  "Метание подков",
                  "Уличная Дженга",
                  "Постановочная кража невесты",
                ].map((a, i) => (
                  <Reveal
                    as="li"
                    key={a}
                    delay={i * 0.05}
                    y={12}
                    className="rounded-full border border-ink/20 px-4 py-2 text-[0.92rem] text-ink"
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

            <Moment icon={ForkKnife} tone="day" title="Банкет в светлом зале с окнами в пол">
              <div className="relative">
                <RevealImage
                  photo={photos.hallSun}
                  sizes="(min-width: 1024px) 80vw, 95vw"
                  parallax={4}
                  className="aspect-[4/3] w-full md:aspect-[16/9]"
                />
                <RevealImage
                  photo={photos.glasses}
                  sizes="(min-width: 768px) 25vw, 45vw"
                  delay={0.25}
                  className="absolute -bottom-12 right-4 aspect-[4/5] w-[38%] border-[6px] border-bone md:-bottom-20 md:right-10 md:w-[24%] md:border-8"
                />
              </div>
              <div className="mt-20 grid gap-6 md:mt-28 md:grid-cols-12">
                <div className="md:col-span-6">
                  <Text tone="day">
                    Новый зал 170 м² из беленого дерева: окна в пол в две стены и шикарные виды на
                    поля. Дубовые столы в стиле эко-лофт, шифоновые ранеры, до 100 гостей.
                  </Text>
                </div>
                <div className="md:col-span-5 md:col-start-8">
                  <Text tone="day">
                    Готовит наш повар, обслуживают официанты. Банкет, фуршет и обслуживание от{" "}
                    {addons.banquet.pricePerGuestMin} до {addons.banquet.pricePerGuestMax} руб с
                    гостя.
                  </Text>
                </div>
              </div>
            </Moment>
          </ol>
        </div>
      </div>

      {/* ЗАКАТ */}
      <Dusk />

      {/* ВЕЧЕР */}
      <div className="bg-pine-950 pb-28 pt-8 text-mist md:pb-40">
        <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
          <Rope target={nightRef} tone="night" />
          <ol ref={nightRef} className="relative grid gap-28 md:gap-40">
            <Moment icon={MusicNotes} tone="night" title="Танцы на террасе под ретро-гирляндами">
              <div className="grid gap-8 md:grid-cols-12 md:items-center">
                <RevealImage
                  photo={photos.countrySunset}
                  sizes="(min-width: 768px) 55vw, 90vw"
                  parallax={4}
                  className="aspect-[4/3] w-full md:col-span-7"
                />
                <div className="md:col-span-4 md:col-start-9">
                  <Text tone="night">
                    Вечерняя подсветка ретро-гирляндами в зале и на улице. Большая терраса под
                    танцпол, открытые беседки и лаунж-зоны с диванами из паллет и креслами-мешками.
                  </Text>
                </div>
              </div>
            </Moment>

            <Moment icon={Bed} tone="night" title="Ночлег для гостей и баня на второй день">
              <Text tone="night">
                До 40 гостей остаются ночевать в наших домах: срубе КАНТРИ из вековой сосны и
                эко-лофте ШАЛЕ с печью-камином. На второй день баня на дровах и мангалы.
              </Text>
              <div className="mt-10 grid grid-cols-12 gap-4 md:gap-6">
                <RevealImage
                  photo={photos.fireplace}
                  sizes="(min-width: 768px) 35vw, 90vw"
                  className="col-span-12 aspect-square md:col-span-5"
                />
                <div className="col-span-12 grid grid-cols-2 gap-4 md:col-span-7 md:grid-cols-1 md:gap-6">
                  <RevealImage
                    photo={photos.countryLiving}
                    sizes="(min-width: 768px) 45vw, 45vw"
                    delay={0.1}
                    className="aspect-[4/3] md:aspect-[16/9]"
                  />
                  <RevealImage
                    photo={photos.banyaRest}
                    sizes="(min-width: 768px) 30vw, 45vw"
                    delay={0.2}
                    className="aspect-[4/3] md:aspect-[16/7] md:w-[70%]"
                  />
                </div>
              </div>
            </Moment>
          </ol>
        </div>
      </div>
    </section>
  );
}
