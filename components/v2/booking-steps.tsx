import { contacts } from "@/lib/site";
import { bookingSteps } from "@/lib/wedding";
import { Reveal } from "@/components/ui/motion";
import { BookButton } from "./ui";

const ROMAN = ["I", "II", "III"];
// Ступеньки на десктопе: каждый шаг чуть ниже предыдущего
const STAGGER = ["", "lg:mt-16", "lg:mt-32"];

/*
  «Как забронировать»: три шага крупными римскими цифрами. Условий брони свадьбы в выгрузке нет —
  шаги нейтральные (звонок → приезд посмотреть усадьбу → бронь даты), см. TODO(бронь) в lib/wedding.ts.
*/
export function BookingSteps() {
  return (
    <section aria-labelledby="steps-title" className="on-dark tex-dark bg-wine py-12 text-ivory md:py-28">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <Reveal>
          <p className="v2-eyebrow text-gold-light">Три шага</p>
          <h2 id="steps-title" className="prata mt-5 text-[2.8rem] leading-[1] md:text-[4.6rem] lg:text-[5.2rem]">
            Как <span className="script text-[1.15em] text-gold-light">забронировать</span>
          </h2>
        </Reveal>

        <ol className="mt-8 grid gap-6 md:mt-16 lg:grid-cols-3 lg:gap-12">
          {bookingSteps.map((s, i) => (
            <Reveal
              as="li"
              key={s.key}
              delay={i * 0.1}
              className={`grid grid-cols-[4.2rem_1fr] gap-x-4 border-t border-gold/50 pt-5 lg:block lg:pt-7 ${STAGGER[i]}`}
            >
              <span aria-hidden className="prata text-[3.6rem] leading-[0.85] text-gold-light lg:text-[8rem]">
                {ROMAN[i]}
              </span>
              <div className="lg:mt-6">
                <h3 className="prata text-[1.45rem] leading-[1.15] md:text-[1.9rem]">{s.title}</h3>
                <p className="mt-2 max-w-[38ch] text-[0.95rem] leading-relaxed text-ivory/85">{s.text}</p>
                {s.key === "call" && (
                  <a
                    href={contacts.phoneMain.href}
                    className="prata mt-4 inline-block whitespace-nowrap text-[1.45rem] tabular-nums text-ivory underline decoration-gold/60 underline-offset-[6px] hover:decoration-gold-light"
                  >
                    {contacts.phoneMain.display}
                  </a>
                )}
                {s.key === "visit" && (
                  <BookButton preset={{ topic: "visit" }} className="btn-v2 btn-v2-ivory mt-5">
                    Договориться о визите
                  </BookButton>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
