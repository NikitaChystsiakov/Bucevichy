import Image from "next/image";
import { ArrowDown } from "@phosphor-icons/react/ssr";
import { instaPhotos } from "@/lib/media";
import { MAX_GUESTS, VENUE_MIN_PRICE } from "@/lib/wedding";
import { HeroScene } from "./illustrations";
import { BookButton, Diamond } from "./ui";

const rub = (n: number) => n.toLocaleString("ru-RU");

// Проём арки в сцене HeroScene (viewBox 400×200, illustrations.tsx) в долях сцены: сюда встаёт медальон.
// Константа здесь, а не в illustrations.tsx: тот модуль клиентский, и серверный hero получил бы
// вместо объекта ссылку-заглушку
const ARCH_OPENING = { left: 98 / 400, width: 84 / 400, top: 70 / 200, height: 100 / 200 };

// Строка фактов открытки: всё из lib (раздел 7 и общие данные)
const heroFacts = ["23 км от Минска", `до ${MAX_GUESTS} гостей`, `площадка от ${rub(VENUE_MIN_PRICE)} руб`];

// Первый экран — открытка-приглашение в двойной рамке. Текст и кнопки — в серверном HTML,
// интро-конверт (intro.tsx) только «довозит» открытку на место.
export function Hero() {
  const o = ARCH_OPENING;
  return (
    <section aria-labelledby="hero-title" className="tex bg-paper-2 px-3 pb-8 pt-2 md:px-8 md:pb-14 md:pt-6">
      <div className="v2-hero-card invite-frame mx-auto max-w-[1180px] bg-paper text-terra shadow-[0_24px_50px_-30px_rgb(46_42_36/0.45)]">
        <div className="relative grid items-center gap-5 px-5 pb-9 pt-9 text-ink sm:px-9 md:px-12 md:py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-16 lg:py-16">
          {/* Сцена: на телефоне сверху, как рисунок на открытке; на десктопе справа */}
          <div className="relative mx-auto w-full max-w-[520px] text-ink lg:order-2 lg:max-w-none">
            <HeroScene className="block h-auto w-full" afterIntro />
            {/* Медальон-фото в проёме арки: ≤ 30% ширины открытки */}
            <div
              className="v2-medallion absolute overflow-hidden rounded-[50%] ring-1 ring-terra/60 ring-offset-[3px] ring-offset-paper"
              style={{
                left: `${(o.left + o.width * 0.12) * 100}%`,
                width: `${o.width * 0.76 * 100}%`,
                top: `${o.top * 100}%`,
                height: `${o.height * 100}%`,
              }}
            >
              <Image
                src={instaPhotos.coupleFog.src}
                alt={instaPhotos.coupleFog.alt}
                fill
                sizes="(min-width: 1024px) 120px, 80px"
                className="object-cover object-[50%_30%]"
              />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="v2-eyebrow text-ink-soft">
              Конная усадьба «Буцевичи»
              <span className="script mt-1 block text-[1.7rem] normal-case tracking-normal text-terra-deep md:text-[2rem]">
                приглашает
              </span>
            </p>
            <h1
              id="hero-title"
              className="prata mx-auto mt-4 max-w-[16ch] text-[2.05rem] leading-[1.12] min-[400px]:text-[2.25rem] md:text-[3.3rem] lg:mx-0 lg:max-w-none lg:text-[2.9rem] xl:text-[3.3rem]"
            >
              Свадьба, на которую невеста приезжает{" "}
              <span className="script text-[1.22em] leading-none text-terra-deep">верхом</span>
            </h1>

            <div className="v2-rule mx-auto mt-6 max-w-[320px] text-terra lg:mx-0 lg:max-w-[360px]">
              <Diamond />
            </div>

            {/* На телефоне цена — отдельной строкой, чтобы перенос не начинался с точки */}
            <ul className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[0.95rem] text-ink-soft lg:justify-start">
              {heroFacts.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-center gap-2 ${i === 2 ? "max-sm:w-full max-sm:justify-center" : ""}`}
                >
                  {i > 0 && (
                    <span aria-hidden className={`text-terra ${i === 2 ? "max-sm:hidden" : ""}`}>
                      ·
                    </span>
                  )}
                  <span className={i === 2 ? "font-medium text-ink" : ""}>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 grid gap-2.5 sm:flex sm:justify-center lg:justify-start">
              <BookButton className="btn-v2 btn-v2-terra w-full py-4 sm:w-auto">Узнать свободную дату</BookButton>
              <a href="#stoimost" className="btn-v2 btn-v2-line w-full py-4 sm:w-auto">
                Посмотреть цены
                <ArrowDown size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
