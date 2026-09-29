import { ArrowDown } from "@phosphor-icons/react/ssr";
import { instaPhotos } from "@/lib/media";
import { MAX_GUESTS, VENUE_MIN_PRICE } from "@/lib/wedding";
import { DuotoneImage, PinnedPhoto } from "./duotone";
import { SealStamp } from "./seal-stamp";
import { BookButton } from "./ui";

const rub = (n: number) => n.toLocaleString("ru-RU");

/*
  Первый экран — открытка на весь экран: плотная бумага с тиснением, двойная рамка с уголками
  (единственное место на странице), огромный заголовок, «верхом» — рукописным и фольгой.
  Справа приколото фото пары в дуотоне, на его угол ставится сургучная печать.
  Текст и кнопки — в серверном HTML; интро-конверт (intro.tsx) только «довозит» открытку.
*/
export function Hero() {
  return (
    // overflow-x-clip: печать в начале анимации крупнее в 1,7 раза и не должна расширять страницу
    // на телефоне (clip, а не hidden — секция не становится контейнером прокрутки)
    <section aria-labelledby="hero-title" className="tex overflow-x-clip bg-ivory-2 px-2.5 pb-2.5 md:px-5 md:pb-5">
      <div className="v2-hero-card invite-frame emboss tex relative mx-auto flex min-h-[calc(100svh-64px-10px)] max-w-[1400px] flex-col bg-ivory text-gold md:min-h-[calc(100svh-72px-20px)]">
        <div className="relative flex flex-1 flex-col px-6 pb-8 pt-9 text-ink sm:px-10 md:px-14 md:pb-14 md:pt-14 lg:px-20 lg:pb-16">
          {/* Приколотое фото пары и печать на его углу */}
          <div className="absolute right-6 top-9 w-[32%] max-w-[120px] sm:max-w-[200px] md:right-14 md:top-14 lg:right-20 lg:w-[23%] lg:max-w-[310px]">
            <PinnedPhoto rotate={3}>
              <DuotoneImage
                photo={instaPhotos.coupleFog}
                sizes="(min-width: 1024px) 310px, (min-width: 640px) 200px, 120px"
                className="aspect-[4/5]"
                position="55% 62%"
                parallax
                preload
              />
            </PinnedPhoto>
            <SealStamp className="absolute -bottom-6 -right-5 w-[68px] md:-bottom-8 md:-right-8 md:w-[100px] lg:-bottom-12 lg:-right-12 lg:w-[128px]" />
          </div>

          {/* До десктопа держим под фото место, чтобы заголовок не заехал под него на низких экранах */}
          <p className="v2-eyebrow min-h-[9.5rem] max-w-[58%] text-wine-soft sm:min-h-[15rem] lg:min-h-0 lg:max-w-none">
            Конная усадьба «Буцевичи»
            <span className="script mt-1.5 block text-[1.9rem] normal-case tracking-normal text-wine md:text-[2.3rem]">
              приглашает
            </span>
          </p>

          {/* Заголовок прижат к низу открытки; на десктопе разбит на три строки вручную,
              чтобы первая короткая строка не упиралась в фото */}
          <h1
            id="hero-title"
            className="prata mt-auto pt-10 text-[clamp(2.75rem,12.4vw,3.3rem)] leading-[1] text-wine md:text-[4.6rem] lg:pt-12 lg:text-[clamp(5.6rem,6.9vw,7.2rem)] lg:leading-[0.98]"
          >
            Свадьба,
            <br className="max-lg:hidden" /> на которую невеста
            <br className="max-lg:hidden" /> приезжает{" "}
            <span className="script foil-text inline-block pr-2 text-[1.38em] leading-[0.8]">верхом</span>
          </h1>

          <div className="mt-7 grid gap-6 lg:mt-9 lg:flex lg:items-end lg:justify-between">
            <div className="grid gap-3">
              <span aria-hidden className="gold-rule block w-full max-w-[420px]" />
              <p className="flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                <span>23 км от Минска</span>
                <span aria-hidden className="text-gold">◆</span>
                <span>до {MAX_GUESTS} гостей</span>
                <span aria-hidden className="text-gold max-sm:hidden">◆</span>
                <span className="text-wine max-sm:w-full">площадка от {rub(VENUE_MIN_PRICE)} руб</span>
              </p>
            </div>
            <div className="grid gap-2.5 sm:flex">
              <BookButton className="btn-v2 btn-v2-wine w-full py-4 sm:w-auto">Узнать свободную дату</BookButton>
              <a href="#stoimost" className="btn-v2 btn-v2-line w-full py-4 text-wine sm:w-auto">
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
