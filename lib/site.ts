// Общие данные усадьбы. Источник: docs/verhom_content.md, раздел 0.

export const SITE_URL = "https://verhom.by";

export const contacts = {
  phoneMain: { display: "+375 29 322-20-44", href: "tel:+375293222044" },
  phoneSecond: { display: "+375 29 777-20-44", href: "tel:+375297772044" },
  // Viber и Telegram привязаны к основному номеру
  viber: "viber://chat?number=%2B375293222044",
  telegram: "https://t.me/+375293222044",
  email: "contact@verhom.by",
  instagram: { handle: "@verhomby", href: "https://instagram.com/verhomby/" },
  address: "д. Буцевичи, 23 км от Минска по трассе Р58 (на Мядель)",
  geo: { lat: 54.1256855, lng: 27.4816021 },
  yandexMaps:
    "https://yandex.by/maps/?pt=27.4816021,54.1256855&z=15&l=map",
  googleMaps: "https://www.google.com/maps?q=54.1256855,27.4816021",
} as const;

export type NavLink = { label: string; href: string; ready?: boolean };
export type NavItem = NavLink & { children?: NavLink[] };

// В демо готова только страница свадеб. Остальные пункты показывают,
// каким будет полный сайт, и по клику выводят подсказку.
export const nav: NavItem[] = [
  { label: "Конные прогулки", href: "/progulki" },
  {
    label: "Праздники",
    href: "/prazdniki",
    children: [
      { label: "Свадьбы", href: "/svadby", ready: true },
      { label: "Корпоративы", href: "/korporativy" },
      { label: "Детские праздники", href: "/detskie-prazdniki" },
      { label: "Новый год", href: "/novyy-god" },
    ],
  },
  {
    label: "Проживание",
    href: "/prozhivanie",
    children: [
      { label: "Дома КАНТРИ и ШАЛЕ", href: "/prozhivanie" },
      { label: "Баня на дровах", href: "/banya" },
      { label: "Отдых для двоих", href: "/dlya-dvoih" },
    ],
  },
  { label: "Сертификаты", href: "/sertifikaty" },
  { label: "Отзывы", href: "/otzyvy" },
  // Контакты в демо — футер этой же страницы. TODO(сайт): отдельная страница /kontakty
  { label: "Контакты", href: "#kontakty", ready: true },
];
