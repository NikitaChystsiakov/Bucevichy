"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import {
  addons,
  budgetRequest,
  estimateBudget,
  GUESTS_DEFAULT,
  GUESTS_MAX,
  GUESTS_MIN,
  priceIncludesV2,
  seasons,
  venueDays,
  venuePrice,
  type DayKey,
  type SeasonKey,
} from "@/lib/wedding";
import { useBooking } from "@/components/site/booking-provider";
import { Reveal } from "@/components/ui/motion";
import { useReducedMotionSafe } from "@/components/ui/hooks";
import { GiftStamp } from "./seal";

const rub = (n: number) => n.toLocaleString("ru-RU");

// Сумма сменилась — новая цифра мягко проявляется снизу (без одометра v1: здесь всё спокойнее)
function Sum({ value, className = "" }: { value: number; className?: string }) {
  const reduce = useReducedMotionSafe();
  return (
    <span className={`relative inline-block tabular-nums ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: "0.25em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: "-0.25em" }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {rub(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Дополнительная услуга в калькуляторе: квадратик как в печатном бланке, галочка — вино
function Option({
  checked,
  onChange,
  title,
  price,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  price: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3.5 border-b border-gold/40 py-3 md:py-3.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="mt-0.5 grid size-5 shrink-0 place-items-center border border-ink/50 bg-ivory text-ivory transition-colors peer-checked:border-wine peer-checked:bg-wine peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wine"
      >
        <svg viewBox="0 0 12 12" className={`size-3 transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}>
          <path d="M2 6.5 5 9.2 10 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="grid gap-0.5">
        <span className="text-[0.96rem] leading-snug text-ink">{title}</span>
        <span className="text-[0.82rem] text-ink-soft">{price}</span>
      </span>
    </label>
  );
}

/*
  «Стоимость»: прайс как меню ресторана — дни недели с отточиями до цены, переключатель сезона
  (октябрь −10%), что входит и штамп «в подарок». Рядом компактный калькулятор: расчёт и текст
  заявки — те же функции, что у /svadby (estimateBudget, budgetRequest в lib/wedding.ts).
*/
export function Pricing() {
  const { openBooking } = useBooking();
  const [season, setSeason] = useState<SeasonKey>("summer");
  const [day, setDay] = useState<DayKey>("sat");
  const [guests, setGuests] = useState(GUESTS_DEFAULT);
  // По умолчанию — площадка и банкет (как в v1)
  const [withProgram, setWithProgram] = useState(false);
  const [withDecor, setWithDecor] = useState(false);
  const [withBanquet, setWithBanquet] = useState(true);

  const input = { day, season, guests, program: withProgram, decor: withDecor, banquet: withBanquet };
  const budget = estimateBudget(input);
  const range = budget.totalMin !== budget.totalMax;
  const dayLabel = venueDays.find((d) => d.key === day)!.label;
  const seasonLabel = seasons.find((s) => s.key === season)!.label;
  const fill = ((guests - GUESTS_MIN) / (GUESTS_MAX - GUESTS_MIN)) * 100;

  return (
    <section id="stoimost" aria-labelledby="price-title" className="tex scroll-mt-16 bg-ivory py-12 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-14">
        {/* Прайс-меню */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="v2-eyebrow text-wine-soft">Стоимость</p>
            <h2
              id="price-title"
              className="prata mt-5 text-[2.8rem] leading-[1] text-wine md:text-[4.6rem] lg:text-[5rem]"
            >
              Площадка <span className="script whitespace-nowrap text-[1.15em] text-wine-soft">на день</span>
            </h2>
          </Reveal>

          <div
            role="radiogroup"
            aria-label="Месяц"
            className="mt-8 inline-flex rounded-full border border-ink/25 p-1"
          >
            {seasons.map((s) => {
              const on = season === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setSeason(s.key)}
                  className={`relative rounded-full px-4 py-2.5 text-[0.88rem] font-medium transition-colors sm:px-5 ${
                    on ? "text-ivory" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="v2-season"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-wine"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {s.label.replace("-", "–")}
                    {s.discount > 0 && <span className="ml-1.5">−{s.discount * 100}%</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <div role="radiogroup" aria-label="День недели" className="mt-6 grid">
            {venueDays.map((d) => {
              const on = day === d.key;
              const price = venuePrice(d.key, season);
              return (
                <button
                  key={d.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDay(d.key)}
                  className="group flex items-baseline gap-3 py-3 text-left md:py-4"
                >
                  <span
                    aria-hidden
                    className={`size-2 shrink-0 -translate-y-1 rotate-45 transition-colors ${
                      on ? "bg-wine" : "bg-transparent ring-1 ring-gold group-hover:bg-gold/40"
                    }`}
                  />
                  <span
                    className={`prata min-w-0 text-[1.25rem] leading-tight transition-colors md:text-[1.7rem] ${
                      on ? "text-wine" : "text-ink"
                    }`}
                  >
                    {d.label.replace("-", "–")}
                  </span>
                  <span aria-hidden className="v2-leader text-ink-soft" />
                  {season === "october" && (
                    <span className="text-[0.85rem] tabular-nums text-ink-soft line-through max-sm:hidden">{rub(d.price)}</span>
                  )}
                  <span className={`prata whitespace-nowrap text-[1.5rem] leading-none md:text-[2.1rem] ${on ? "text-wine" : "text-ink"}`}>
                    <Sum value={price} />
                    <span className="ml-1 text-[0.5em] text-ink-soft">руб</span>
                  </span>
                </button>
              );
            })}
          </div>
          {/* TODO(цены): скидка октября считается только от площадки; цен на май и другие месяцы нет */}
          <p className="mt-4 text-[0.9rem] text-ink-soft">
            Цены площадки — с июня по сентябрь. В октябре скидка 10%.
          </p>
        </div>

        {/* Калькулятор: на телефоне — сразу после прайса, на десктопе — справа и прилипает */}
        <div className="lg:col-span-5 lg:row-span-2">
          <div className="lg:[@media(min-height:860px)]:sticky lg:[@media(min-height:860px)]:top-24">
            <Reveal className="tex paper-shadow relative bg-ivory-2 p-5 md:p-8">
              <span aria-hidden className="pointer-events-none absolute inset-[6px] border border-gold/50" />
              <div className="relative">
                <h3 className="prata text-[1.7rem] leading-tight text-wine md:text-[2rem]">Примерный бюджет</h3>
                <p className="mt-1 text-[0.85rem] text-ink-soft">
                  {dayLabel.replace("-", "–")}, {seasonLabel.toLowerCase().replace("-", "–")} · площадка{" "}
                  <span className="tabular-nums text-ink">{rub(budget.venue)} руб</span>
                </p>

                <div className="mt-6">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="v2-guests" className="text-[0.95rem] text-ink">
                      Гостей
                    </label>
                    <span className="prata text-[2rem] leading-none tabular-nums text-wine">{guests}</span>
                  </div>
                  <input
                    id="v2-guests"
                    type="range"
                    min={GUESTS_MIN}
                    max={GUESTS_MAX}
                    step={1}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="range-v2 mt-2"
                    style={{ "--fill": `${fill}%` } as React.CSSProperties}
                  />
                  <div className="flex justify-between text-xs text-ink-soft">
                    <span>{GUESTS_MIN}</span>
                    <span>{GUESTS_MAX}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <Option
                    checked={withBanquet}
                    onChange={setWithBanquet}
                    title={addons.banquet.title}
                    price={`от ${addons.banquet.pricePerGuestMin} до ${addons.banquet.pricePerGuestMax} руб с гостя`}
                  />
                  <Option
                    checked={withProgram}
                    onChange={setWithProgram}
                    title={addons.program.title}
                    price={`${addons.program.pricePerGuest} руб с гостя`}
                  />
                  <Option
                    checked={withDecor}
                    onChange={setWithDecor}
                    title={addons.decor.title}
                    price={`${rub(addons.decor.price)} руб`}
                  />
                </div>

                <div className="mt-6" aria-live="polite">
                  <p className="v2-eyebrow text-wine-soft">Итого примерно, руб</p>
                  <p className="prata mt-3 text-[2.9rem] leading-[1] text-wine md:text-[3.6rem]">
                    {range && <span className="script mr-2 text-[0.55em] text-wine-soft">от</span>}
                    <Sum value={budget.totalMin} />
                    {range && (
                      <span className="block">
                        <span className="script mr-2 text-[0.55em] text-wine-soft">до</span>
                        <Sum value={budget.totalMax} />
                      </span>
                    )}
                  </p>
                  <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-soft">
                    {addons.lodging.title} считаем отдельно. Точную сумму назовём, когда обсудим вашу дату.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openBooking(budgetRequest(input, budget))}
                  className="btn-v2 btn-v2-wine mt-6 w-full py-4"
                >
                  Узнать, свободна ли дата
                  <ArrowRight size={17} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Что входит и подарки */}
        <div className="lg:col-span-7">
          <Reveal>
            <h3 className="v2-eyebrow text-wine-soft">Ещё в стоимость площадки входит</h3>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {priceIncludesV2.map((item) => (
                <li key={item} className="flex gap-3 border-b border-gold/40 py-2 text-[0.88rem] leading-snug text-ink sm:py-2.5 sm:text-[0.92rem]">
                  <span aria-hidden className="mt-[0.45em] size-1.5 shrink-0 rotate-45 bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-8 flex items-center gap-5 md:gap-7">
            <GiftStamp
              id="stamp-price"
              text="выезд невесты верхом · фотосессия с лошадьми · "
              className="w-[92px] shrink-0 rotate-[-8deg] text-wine-soft md:w-[118px]"
            />
            <p className="max-w-[40ch] text-[0.95rem] leading-relaxed text-ink">
              <span className="prata text-[1.2rem] text-wine">В подарок к площадке:</span> выезд невесты на
              регистрацию верхом и фотосессия с лошадьми для молодых.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
