"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";

export type LeadPreset = {
  topic?: "date" | "visit";
  guests?: number;
  note?: string;
};

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-[12px] border border-mist/20 bg-pine-950/40 px-4 py-3.5 text-[16px] text-mist outline-none transition placeholder:text-mist/45 focus:border-amber focus:bg-pine-950/60";
const label = "text-[0.8rem] font-medium text-mist-soft";

export function LeadForm({ preset, autoFocus }: { preset?: LeadPreset; autoFocus?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const isVisit = preset?.topic === "visit";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const digits = (data.phone ?? "").replace(/\D/g, "");
    if (digits.length < 9) {
      setPhoneError("Укажите телефон, чтобы мы могли перезвонить");
      return;
    }
    setPhoneError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, topic: preset?.topic ?? "date" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-3 py-4"
          role="status"
        >
          <CheckCircle size={40} weight="light" className="text-amber" />
          <p className="display text-[1.9rem]">Заявка у нас</p>
          <p className="max-w-[40ch] text-mist-soft">
            {isVisit
              ? "Перезвоним и договоримся, когда вам удобно приехать посмотреть усадьбу."
              : "Перезвоним и скажем, свободна ли ваша дата."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="link-underline mt-2 text-sm text-mist-soft"
          >
            Отправить ещё одну заявку
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor={`${id}-name`} className={label}>
                Как к вам обращаться
              </label>
              <input
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                className={field}
                placeholder="Имя"
                autoFocus={autoFocus}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor={`${id}-phone`} className={label}>
                Телефон
              </label>
              <input
                id={`${id}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={`${field} ${phoneError ? "border-amber" : ""}`}
                placeholder="+375 __ ___-__-__"
                aria-invalid={!!phoneError}
                aria-describedby={phoneError ? `${id}-phone-err` : undefined}
              />
              {phoneError && (
                <p id={`${id}-phone-err`} className="text-[0.8rem] text-amber-soft">
                  {phoneError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] gap-4">
            <div className="grid gap-2">
              <label htmlFor={`${id}-date`} className={label}>
                {isVisit ? "Когда хотите приехать" : "Желаемая дата свадьбы"}
              </label>
              <input
                id={`${id}-date`}
                name="date"
                type="date"
                className={`${field} [color-scheme:dark]`}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor={`${id}-guests`} className={label}>
                Гостей
              </label>
              <input
                id={`${id}-guests`}
                name="guests"
                type="number"
                inputMode="numeric"
                min={1}
                max={300}
                defaultValue={preset?.guests}
                className={field}
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor={`${id}-note`} className={label}>
              Комментарий <span className="font-normal text-mist/45">(необязательно)</span>
            </label>
            <textarea
              id={`${id}-note`}
              name="note"
              rows={2}
              defaultValue={preset?.note}
              className={`${field} resize-none`}
              placeholder="Например: хотим регистрацию у арки и выезд невесты верхом"
            />
          </div>

          {status === "error" && (
            <p className="flex items-center gap-2 text-sm text-amber-soft" role="alert">
              <WarningCircle size={18} />
              Не получилось отправить. Позвоните нам или попробуйте ещё раз.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-amber mt-1 w-full py-4 text-base disabled:opacity-70"
          >
            {status === "sending" ? "Отправляем…" : isVisit ? "Договориться о визите" : "Узнать свободную дату"}
            {status !== "sending" && <ArrowRight size={18} />}
          </button>
          <p className="text-center text-xs text-mist/50">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
