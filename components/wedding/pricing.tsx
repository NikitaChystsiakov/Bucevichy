"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Gift } from "@phosphor-icons/react";
import {
  addons,
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

const rub = (n: number) => n.toLocaleString("ru-RU");

// Число плавно докручивается до нового значения
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
        <span className="text-[0.82rem] text-linen/70">
          {price}
          {note && <span className="text-linen/45"> · {note}</span>}
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

export function Pricing() {
  const { openBooking } = useBooking();
  const [season, setSeason] = useState<SeasonKey>("summer");
  const [day, setDay] = useState<DayKey>("sat");
  const [guests, setGuests] = useState(GUESTS_DEFAULT);
  const [withProgram, setWithProgram] = useState(true);
  const [withDecor, setWithDecor] = useState(true);
  const [withBanquet, setWithBanquet] = useState(true);

  const venue = venuePrice(day, season);
  const program = withProgram ? addons.program.pricePerGuest * guests : 0;
  const decor = withDecor ? addons.decor.price : 0;
  const banquetMin = withBanquet ? addons.banquet.pricePerGuestMin * guests : 0;
  const banquetMax = withBanquet ? addons.banquet.pricePerGuestMax * guests : 0;
  const totalMin = venue + program + decor + banquetMin;
  const totalMax = venue + program + decor + banquetMax;

  const dayLabel = venueDays.find((d) => d.key === day)!.label;
  const seasonLabel = seasons.find((s) => s.key === season)!.label;
  const fill = ((guests - GUESTS_MIN) / (GUESTS_MAX - GUESTS_MIN)) * 100;

  function book() {
    const parts = [
      `${dayLabel}, ${seasonLabel.toLowerCase()}`,
      `${guests} гостей`,
      withProgram && "программа",
      withDecor && "оформление",
      withBanquet && "банкет",
    ].filter(Boolean);
    const sum =
      totalMin === totalMax ? `${rub(totalMin)} руб` : `${rub(totalMin)}-${rub(totalMax)} руб`;
    openBooking({ guests, note: `${parts.join(", ")}. Примерный бюджет: ${sum}` });
  }

  return (
    <section
      id="stoimost"
      aria-labelledby="price-title"
      className="bg-forest-deep pb-28 pt-4 text-linen md:pb-40"
    >
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
        {/* Площадка */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="mb-4 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-brass">
              Стоимость
            </p>
            <h2 id="price-title" className="display text-[2.6rem] leading-[1.03] md:text-[4rem]">
              Площадка на весь день
            </h2>
          </Reveal>

          <div
            role="radiogroup"
            aria-label="Месяц"
            className="mt-10 inline-flex rounded-full border border-linen/15 p-1"
          >
            {seasons.map((s) => (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={season === s.key}
                onClick={() => setSeason(s.key)}
                className={`relative rounded-full px-5 py-2.5 text-[0.9rem] transition-colors ${
                  season === s.key ? "text-forest-deep" : "text-linen/70 hover:text-linen"
                }`}
              >
                {season === s.key && (
                  <motion.span
                    layoutId="season-pill"
                    className="absolute inset-0 rounded-full bg-brass"
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

          <div role="radiogroup" aria-label="День недели" className="mt-6 grid">
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
                  className="group relative flex items-baseline justify-between gap-4 border-b border-linen/10 px-1 py-5 text-left md:py-6"
                >
                  {active && (
                    <motion.span
                      layoutId="day-marker"
                      className="absolute -left-3 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full bg-brass md:-left-5"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`text-[1.05rem] transition-colors md:text-[1.2rem] ${
                      active ? "text-linen" : "text-linen/70 group-hover:text-linen"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span className="flex items-baseline gap-3">
                    {season === "october" && (
                      <span className="text-sm text-linen/40 line-through tabular-nums">
                        {rub(d.price)}
                      </span>
                    )}
                    <span
                      className={`display text-[2rem] leading-none transition-colors md:text-[2.6rem] ${
                        active ? "text-brass" : "text-linen"
                      }`}
                    >
                      <AnimatedNumber value={price} />
                      <span className="ml-1.5 font-sans text-[0.9rem] text-linen/70">руб</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {venueIncludes.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 0.1}>
                <h3 className="text-[0.95rem] font-medium text-linen">Что входит: {group.title.toLowerCase()}</h3>
                <ul className="mt-4 grid gap-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-linen/70">
                      <Check size={16} className="mt-0.5 shrink-0 text-brass" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 grid gap-3 rounded-[20px] border border-brass/40 bg-brass/[0.07] p-5 md:grid-cols-2 md:p-6">
            {venueGifts.map((g) => (
              <p key={g} className="flex gap-3 text-[0.98rem] leading-snug text-linen">
                <Gift size={20} weight="duotone" className="shrink-0 text-brass" />
                <span>
                  {g}
                  <span className="ml-2 whitespace-nowrap text-[0.78rem] font-medium uppercase tracking-wide text-brass">
                    в подарок
                  </span>
                </span>
              </p>
            ))}
          </Reveal>
        </div>

        {/* Калькулятор */}
        <div className="lg:col-span-5">
          <div className="rounded-[20px] border border-linen/10 bg-forest p-6 md:p-8 lg:sticky lg:top-24">
            <h3 className="display text-[2rem] leading-tight">Примерный бюджет</h3>
            <p className="mt-1 text-sm text-linen/70">
              {dayLabel}, {seasonLabel.toLowerCase()}. Площадка{" "}
              <span className="tabular-nums text-linen">{rub(venue)} руб</span>
            </p>

            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <label htmlFor="guests" className="text-[0.98rem]">
                  Гостей
                </label>
                <span className="display text-[2rem] leading-none tabular-nums text-brass">
                  {guests}
                </span>
              </div>
              <input
                id="guests"
                type="range"
                min={GUESTS_MIN}
                max={GUESTS_MAX}
                step={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="range mt-3"
                style={{ "--fill": `${fill}%` } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-linen/45">
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

            <div className="mt-4 border-t border-linen/10 pt-6">
              <p className="text-sm text-linen/70">Итого примерно</p>
              <p className="display mt-1 text-[2.5rem] leading-none text-linen md:text-[2.9rem]">
                {totalMin !== totalMax && <span className="text-[0.55em] italic text-linen/70">от </span>}
                <AnimatedNumber value={totalMin} />
                {totalMin !== totalMax && (
                  <>
                    <span className="text-[0.55em] italic text-linen/70"> до </span>
                    <AnimatedNumber value={totalMax} />
                  </>
                )}
                <span className="ml-2 font-sans text-base text-linen/70">руб</span>
              </p>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-linen/50">
                Расчёт по ценам с сайта. {addons.lodging.title} считаем отдельно. Точную сумму
                назовём, когда обсудим вашу дату.
              </p>
            </div>

            <button type="button" onClick={book} className="btn btn-brass group mt-6 w-full py-4 text-base">
              Узнать свободную дату
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
