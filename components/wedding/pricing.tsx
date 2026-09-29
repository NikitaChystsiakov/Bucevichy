"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Check, Gift } from "@phosphor-icons/react";
import {
  addons,
  budgetRequest,
  estimateBudget,
  GUESTS_DEFAULT,
  GUESTS_MAX,
  GUESTS_MIN,
  seasons,
  venueDays,
  venueGifts,
  venueIncludes,
  venuePrice,
  type DayKey,
  type SeasonKey,
} from "@/lib/wedding";
import { useBooking } from "@/components/site/booking-provider";
import { Reveal } from "@/components/ui/motion";
import { Magnetic } from "@/components/ui/magnetic";

const rub = (n: number) => n.toLocaleString("ru-RU");

// Число плавно докручивается до нового значения (цены дней в списке)
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = rub(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = rub(Math.round(v))),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {rub(value)}
    </span>
  );
}

// Одна цифра «одометра»: столбик 0–9 едет по пружине (useSpring) к нужной цифре,
// поэтому при смене суммы цифры перекатываются через промежуточные
function RollingDigit({ digit }: { digit: number }) {
  const reduce = useReducedMotion();
  const v = useSpring(digit, { stiffness: 170, damping: 22, mass: 0.9 });
  useEffect(() => {
    if (reduce) v.jump(digit);
    else v.set(digit);
  }, [digit, reduce, v]);
  const y = useTransform(v, (n) => `${-n * 10}%`);
  return (
    <span className="relative inline-block h-[1.1em] overflow-hidden align-top">
      <motion.span className="flex flex-col" style={{ y }}>
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1.1em] leading-[1.1em]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

// Сумма целиком. Разряды считаем справа, чтобы при появлении нового разряда
// остальные цифры не «переезжали» на соседние столбики
function RollingNumber({ value }: { value: number }) {
  const chars = Array.from(rub(value));
  return (
    <span className="inline-flex tabular-nums">
      <span className="sr-only">{rub(value)}</span>
      <span aria-hidden className="inline-flex">
        {chars.map((ch, i) => {
          const fromRight = chars.length - i;
          return /\d/.test(ch) ? (
            <RollingDigit key={`d${fromRight}`} digit={Number(ch)} />
          ) : (
            <span key={`s${fromRight}`} className="inline-block h-[1.1em] w-[0.28em] leading-[1.1em]">
              {" "}
            </span>
          );
        })}
      </span>
    </span>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  price,
  note,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  price: string;
  note?: string;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 py-4 [&+&]:border-t [&+&]:border-linen/10"
    >
      <span className="grid gap-0.5">
        <span className="text-[0.98rem] text-linen">{title}</span>
        <span className="text-[0.82rem] text-linen/75">
          {price}
          {note && <span className="text-linen/60"> · {note}</span>}
        </span>
      </span>
      <span className="relative mt-0.5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-7 w-12 rounded-full border border-linen/25 transition-colors peer-checked:border-brass peer-checked:bg-brass peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brass" />
        <span className="absolute left-1 top-1 size-5 rounded-full bg-linen/70 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:translate-x-5 peer-checked:bg-forest-deep" />
      </span>
    </label>
  );
}

// Итоговая карточка: по рамке бежит янтарный луч (.beam в globals.css: conic-gradient,
// маска оставляет только полоску рамки, крутится transform). Вне экрана луч стоит.
function BeamCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.1 });
  return (
    <div
      ref={ref}
      // Пока карточка в экране, нижняя панель прячется: у карточки своя кнопка, и панель
      // не должна закрывать итог (mobile-dock.tsx)
      data-dock-hide
      className="relative rounded-[20px] bg-forest-deep shadow-[0_40px_80px_-30px_rgb(20_28_23/0.8)]"
    >
      <span aria-hidden className="beam" data-paused={inView ? undefined : ""} />
      <div className="relative p-6 md:p-8">{children}</div>
    </div>
  );
}

export function Pricing() {
  const { openBooking } = useBooking();
  const [season, setSeason] = useState<SeasonKey>("summer");
  const [day, setDay] = useState<DayKey>("sat");
  const [guests, setGuests] = useState(GUESTS_DEFAULT);
  // По умолчанию — площадка и банкет; программу и оформление гость включает сам
  const [withProgram, setWithProgram] = useState(false);
  const [withDecor, setWithDecor] = useState(false);
  const [withBanquet, setWithBanquet] = useState(true);

  // Расчёт и текст заявки — общие с /svadby-2 (lib/wedding.ts)
  const input = { day, season, guests, program: withProgram, decor: withDecor, banquet: withBanquet };
  const { venue, totalMin, totalMax } = estimateBudget(input);

  const dayLabel = venueDays.find((d) => d.key === day)!.label;
  const seasonLabel = seasons.find((s) => s.key === season)!.label;
  const fill = ((guests - GUESTS_MIN) / (GUESTS_MAX - GUESTS_MIN)) * 100;

  function book() {
    openBooking(budgetRequest(input, estimateBudget(input)));
  }

  return (
    <section
      id="stoimost"
      aria-labelledby="price-title"
      // overflow-clip, а не hidden: hidden делает секцию контейнером прокрутки, и калькулятор
      // внутри перестаёт прилипать (sticky)
      className="relative overflow-clip bg-saddle py-16 text-linen md:py-24"
    >
      {/* «Строчка седла» у верхнего и нижнего края */}
      <span aria-hidden className="stitch absolute inset-x-3 top-3 text-linen md:inset-x-5 md:top-5" />
      <span aria-hidden className="stitch absolute inset-x-3 bottom-3 text-linen md:inset-x-5 md:bottom-5" />
      {/* Мягкий свет сверху слева, как блик на коже */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_15%_0%,rgb(246_217_184/0.18),transparent_70%),radial-gradient(60%_60%_at_100%_100%,rgb(20_28_23/0.35),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-14">
        {/* Площадка: сезон и день недели */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-linen">Стоимость</p>
            <h2
              id="price-title"
              className="display mt-5 text-[2.9rem] leading-[0.98] md:text-[4.8rem] lg:text-[5.6rem]"
            >
              Площадка <em className="text-dawn">для свадьбы</em>
            </h2>
          </Reveal>

          <div
            role="radiogroup"
            aria-label="Месяц"
            className="mt-8 inline-flex rounded-full border border-linen/25 bg-forest-deep/20 p-1"
          >
            {seasons.map((s) => (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={season === s.key}
                onClick={() => setSeason(s.key)}
                className={`relative rounded-full px-5 py-2.5 text-[0.9rem] transition-colors ${
                  season === s.key ? "text-forest-deep" : "text-linen/85 hover:text-linen"
                }`}
              >
                {season === s.key && (
                  <motion.span
                    layoutId="season-pill"
                    className="absolute inset-0 rounded-full bg-linen"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {s.label}
                  {s.discount > 0 && <span className="ml-1.5 opacity-70">−10%</span>}
                </span>
              </button>
            ))}
          </div>

          <div role="radiogroup" aria-label="День недели" className="mt-6 grid border-t border-linen/20">
            {venueDays.map((d) => {
              const active = day === d.key;
              const price = venuePrice(d.key, season);
              return (
                <button
                  key={d.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDay(d.key)}
                  className="group relative flex items-baseline justify-between gap-4 border-b border-linen/20 px-3 py-4 text-left md:px-5 md:py-5"
                >
                  {active && (
                    <motion.span
                      layoutId="day-marker"
                      aria-hidden
                      className="absolute inset-0 rounded-[14px] bg-forest-deep/25 ring-1 ring-inset ring-linen/15"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative text-[1.05rem] transition-colors md:text-[1.2rem] ${
                      active ? "text-linen" : "text-linen/80 group-hover:text-linen"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span className="relative flex items-baseline gap-3">
                    {season === "october" && (
                      <span className="text-[0.95rem] text-linen/90 line-through decoration-linen/70 tabular-nums">
                        {rub(d.price)}
                      </span>
                    )}
                    <span
                      className={`text-[1.9rem] font-light leading-none tracking-[-0.03em] md:text-[2.5rem] ${
                        active ? "text-linen" : "text-linen/85"
                      }`}
                    >
                      <AnimatedNumber value={price} />
                      <span className="ml-1.5 text-[0.9rem] font-normal tracking-normal text-linen/75">руб</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[0.95rem] text-linen/95">
            Цены площадки — с июня по сентябрь, в октябре скидка 10%.
          </p>
        </div>

        {/* Калькулятор: на телефоне сразу после дней недели, на десктопе — справа, прилипает */}
        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
          {/* Прилипает, только если карточка (~780px) целиком помещается под шапкой, иначе
              кнопка внизу была бы недоступна, пока не кончится колонка */}
          <div className="lg:[@media(min-height:880px)]:sticky lg:[@media(min-height:880px)]:top-24">
            <BeamCard>
              <h3 className="display text-[2rem] leading-tight">Примерный бюджет</h3>
              <p className="mt-1 text-sm text-linen/75">
                {dayLabel}, {seasonLabel.toLowerCase()}. Площадка{" "}
                <span className="tabular-nums text-linen">{rub(venue)} руб</span>
              </p>

              <div className="mt-7">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="guests" className="text-[0.98rem]">
                    Гостей
                  </label>
                  <span className="text-[2rem] font-light leading-none tabular-nums text-brass">{guests}</span>
                </div>
                <input
                  id="guests"
                  type="range"
                  min={GUESTS_MIN}
                  max={GUESTS_MAX}
                  step={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="range range-deep mt-3"
                  style={{ "--fill": `${fill}%` } as React.CSSProperties}
                />
                <div className="flex justify-between text-xs text-linen/65">
                  <span>{GUESTS_MIN}</span>
                  <span>{GUESTS_MAX}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-linen/10">
                <Toggle
                  checked={withProgram}
                  onChange={setWithProgram}
                  title={addons.program.title}
                  price={`${addons.program.pricePerGuest} руб с гостя`}
                  note="всадники, лассо, экипаж"
                />
                <Toggle
                  checked={withDecor}
                  onChange={setWithDecor}
                  title={addons.decor.title}
                  price={`${rub(addons.decor.price)} руб`}
                  note="арка, зал, кенди-бар"
                />
                <Toggle
                  checked={withBanquet}
                  onChange={setWithBanquet}
                  title={addons.banquet.title}
                  price={`от ${addons.banquet.pricePerGuestMin} до ${addons.banquet.pricePerGuestMax} руб с гостя`}
                />
              </div>

              <div className="mt-4 border-t border-dashed border-brass/35 pt-6">
                <p className="eyebrow text-brass">Итого примерно, руб</p>
                <p className="mt-3 text-[2.35rem] font-extralight leading-none tracking-[-0.04em] text-linen min-[400px]:text-[2.6rem] md:text-[3rem]">
                  {totalMin !== totalMax && (
                    <span className="mr-2 font-display text-[0.5em] italic tracking-normal text-linen/70">от</span>
                  )}
                  <RollingNumber value={totalMin} />
                  {totalMin !== totalMax && (
                    <>
                      <span className="mx-2 font-display text-[0.5em] italic tracking-normal text-linen/70">до</span>
                      <RollingNumber value={totalMax} />
                    </>
                  )}
                </p>
                <p className="mt-4 text-[0.8rem] leading-relaxed text-linen/65">
                  Расчёт по ценам с сайта. {addons.lodging.title} считаем отдельно. Точную сумму
                  назовём, когда обсудим вашу дату.
                </p>
              </div>

              <Magnetic className="mt-6 flex" strength={0.15}>
                <button type="button" onClick={book} className="btn btn-brass group w-full py-4 text-base">
                  Узнать, свободна ли дата
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Magnetic>
            </BeamCard>
          </div>
        </div>

        {/* Что входит и подарки */}
        <div className="lg:col-span-7">
          <div className="grid gap-8 md:grid-cols-2">
            {venueIncludes.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 0.1}>
                <h3 className="text-[0.95rem] font-semibold text-linen">
                  Что входит: {group.title.toLowerCase()}
                </h3>
                <ul className="mt-3 grid gap-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-linen/85">
                      <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-brass-soft" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="relative mt-8 grid gap-3 rounded-[20px] bg-forest-deep/25 p-5 md:grid-cols-2 md:p-6">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[5px] rounded-[16px] border border-dashed border-linen/35"
            />
            {venueGifts.map((g) => (
              <p key={g} className="relative flex gap-3 text-[0.98rem] leading-snug text-linen">
                <Gift size={20} weight="duotone" className="shrink-0 text-brass-soft" />
                <span>
                  {g}
                  <span className="ml-2 whitespace-nowrap text-[0.74rem] font-semibold uppercase tracking-wide text-brass-soft">
                    в подарок
                  </span>
                </span>
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
