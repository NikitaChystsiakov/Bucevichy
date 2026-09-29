"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChatCircleDots, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Magnetic } from "@/components/ui/magnetic";
import { ContactButtons } from "./contact-buttons";

export type LeadPreset = {
  topic?: "date" | "visit";
  guests?: number;
  note?: string;
  // Что выбрано в калькуляторе (день, месяц, гости, бюджет): показываем чипами над формой
  // и отправляем вместе с заявкой
  details?: string[];
};

// «Взрыв» лепестков после успешной заявки: 22 лепестка разлетаются из галочки и опадают.
// Разброс детерминированный (по номеру), без Math.random в рендере.
const PETALS = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.35;
  const dist = 90 + ((i * 37) % 70);
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist * 0.7 - 30,
    fall: 110 + ((i * 53) % 90),
    rotate: ((i * 71) % 360) - 180,
    size: 8 + (i % 4) * 2.5,
    delay: (i % 5) * 0.03,
    tone: i % 3,
  };
});
const PETAL_TONES = [
  "linear-gradient(135deg, #fdf3ec, #e8c2b0)",
  "linear-gradient(135deg, #f6d9b8, #e8a15c)",
  "linear-gradient(135deg, #fffaf2, #c9a45c)",
];

function PetalBurst() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute left-5 top-8 z-10">
      {PETALS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-0 top-0 block"
          style={{
            width: p.size,
            height: p.size * 1.3,
            borderRadius: "80% 0 80% 0",
            background: PETAL_TONES[p.tone],
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: [0, p.x, p.x * 1.15],
            y: [0, p.y, p.y + p.fall],
            rotate: [0, p.rotate * 0.6, p.rotate],
            opacity: [0, 1, 0],
            scale: [0.4, 1, 0.9],
          }}
          transition={{ duration: 1.9, delay: p.delay, times: [0, 0.3, 1], ease: "easeOut" }}
        />
      ))}
    </span>
  );
}

// offline — сервер принял запрос, но отправка заявок не настроена (демо): просим написать самим
type Status = "idle" | "sending" | "sent" | "offline" | "error";

// Оформление формы: v1 — тёмная (/svadby), v2 — бумага (/svadby-2). Логика одна.
const styles = {
  v1: {
    field:
      "w-full rounded-[12px] border border-linen/20 bg-forest-deep/40 px-4 py-3.5 text-[16px] text-linen outline-none transition placeholder:text-linen/45 focus:border-brass focus:bg-forest-deep/60",
    label: "text-[0.8rem] font-medium text-linen/70",
    fieldError: "border-brass",
    error: "text-brass",
    dateScheme: "[color-scheme:dark]",
    optional: "font-normal text-linen/45",
    chip: "rounded-full border border-brass/40 bg-brass/10 px-3 py-1.5 text-[0.82rem] text-linen",
    notice: "flex gap-2.5 rounded-[14px] border border-brass/40 bg-brass/10 p-4 text-[0.92rem] leading-snug text-linen",
    noticeIcon: "mt-px shrink-0 text-brass",
    alert: "flex items-center gap-2 text-sm text-brass",
    submit: "btn btn-brass w-full py-4 text-base disabled:opacity-70",
    fineprint: "text-center text-xs text-linen/50",
    sentIcon: "text-brass",
    sentEyebrow: "eyebrow text-brass",
    sentTitle: "display text-[2.2rem] leading-[1.02] md:text-[2.6rem]",
    sentAccent: "text-brass",
    sentText: "max-w-[40ch] text-linen/70",
    again: "link-underline mt-2 text-sm text-linen/70",
  },
  v2: {
    field:
      "w-full rounded-[12px] border border-ink/35 bg-ivory-2/60 px-4 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-ink-soft/80 focus:border-wine focus:bg-ivory",
    label: "text-[0.8rem] font-medium text-ink-soft",
    fieldError: "border-wine",
    error: "text-wine",
    dateScheme: "[color-scheme:light]",
    optional: "font-normal text-ink-soft",
    chip: "rounded-full border border-gold/40 bg-ivory-2 px-3 py-1.5 text-[0.82rem] text-ink",
    notice: "flex gap-2.5 rounded-[14px] border border-gold/40 bg-ivory-2/70 p-4 text-[0.92rem] leading-snug text-ink",
    noticeIcon: "mt-px shrink-0 text-wine",
    alert: "flex items-center gap-2 text-sm text-wine",
    submit: "btn-v2 btn-v2-wine w-full py-4 text-base disabled:opacity-70",
    fineprint: "text-center text-xs text-ink-soft",
    sentIcon: "text-gold",
    sentEyebrow: "v2-eyebrow text-wine",
    sentTitle: "prata text-[2rem] leading-[1.1] md:text-[2.3rem]",
    sentAccent: "script not-italic text-wine",
    sentText: "max-w-[40ch] text-ink-soft",
    again: "link-underline mt-2 text-sm text-ink-soft",
  },
} as const;

export function LeadForm({
  preset,
  autoFocus,
  variant = "v1",
}: {
  preset?: LeadPreset;
  autoFocus?: boolean;
  variant?: "v1" | "v2";
}) {
  const st = styles[variant];
  const { field, label } = st;
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
      const json = (await res.json().catch(() => null)) as { ok?: boolean; reason?: string } | null;
      if (json?.reason === "not_configured") {
        setStatus("offline");
        return;
      }
      if (!res.ok || !json?.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const submit = (
    <button type="submit" disabled={status === "sending"} className={st.submit}>
      {status === "sending" ? "Отправляем…" : isVisit ? "Договориться о визите" : "Узнать свободную дату"}
      {status !== "sending" && <ArrowRight size={18} />}
    </button>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col items-start gap-3 py-4"
          role="status"
        >
          <PetalBurst />
          <CheckCircle size={40} weight="light" className={st.sentIcon} />
          <p className={st.sentEyebrow}>Заявка у нас</p>
          <p className={st.sentTitle}>
            До встречи <em className={st.sentAccent}>в Буцевичах</em>
          </p>
          <p className={st.sentText}>
            {isVisit
              ? "Перезвоним и договоримся, когда вам удобно приехать посмотреть усадьбу."
              : "Перезвоним и скажем, свободна ли ваша дата."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className={st.again}
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
          {preset?.details && preset.details.length > 0 && (
            <div>
              <p className={label}>Вы выбрали в калькуляторе</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {preset.details.map((d) => (
                  <li
                    key={d}
                    className={st.chip}
                  >
                    {d}
                  </li>
                ))}
              </ul>
              <input type="hidden" name="details" value={preset.details.join(" · ")} />
            </div>
          )}
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
                className={`${field} ${phoneError ? st.fieldError : ""}`}
                placeholder="+375 __ ___-__-__"
                aria-invalid={!!phoneError}
                aria-describedby={phoneError ? `${id}-phone-err` : undefined}
              />
              {phoneError && (
                <p id={`${id}-phone-err`} className={`text-[0.8rem] ${st.error}`}>
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
                className={`${field} ${st.dateScheme}`}
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
              Комментарий <span className={st.optional}>(необязательно)</span>
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

          {status === "offline" && (
            <div role="status" className="grid gap-3">
              <p className={st.notice}>
                <ChatCircleDots size={20} className={st.noticeIcon} />
                <span>
                  Онлайн-заявки заработают после запуска сайта. А пока напишите нам в Viber или Telegram
                  или позвоните — скажем, свободна ли ваша дата.
                </span>
              </p>
              <ContactButtons variant={variant} />
            </div>
          )}
          {status === "error" && (
            <div role="alert" className="grid gap-3">
              <p className={st.alert}>
                <WarningCircle size={18} className="shrink-0" />
                Не получилось отправить. Напишите нам в Viber или Telegram, позвоните или попробуйте ещё раз.
              </p>
              <ContactButtons variant={variant} />
            </div>
          )}

          {/* В v2 кнопки без «магнитов» (docs/concept-svadby-2.md) */}
          {variant === "v2" ? (
            <div className="mt-1 flex">{submit}</div>
          ) : (
            <Magnetic className="mt-1 flex" strength={0.12}>
              {submit}
            </Magnetic>
          )}
          <p className={st.fineprint}>
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
