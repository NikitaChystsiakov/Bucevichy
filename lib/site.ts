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

// oldSite — временная ссылка на страницу старого сайта verhom.by, пока раздела нет в демо:
// открывается в новой вкладке. TODO(сайт): убрать, когда появятся свои страницы.
export type NavLink = { label: string; href: string; ready?: boolean; oldSite?: string };
export type NavItem = NavLink & { children?: NavLink[] };

const OLD = "https://verhom.by";

// В демо готова только страница свадеб. Остальные пункты ведут на соответствующие страницы
// старого сайта (раздел 0 docs/verhom_content.md), href — адрес будущей страницы нового сайта.
export const nav: NavItem[] = [
  { label: "Конные прогулки", href: "/progulki", oldSite: `${OLD}/konnye-progulki-i-obuchenie-verhovoy-ezde.html` },
  {
    label: "Праздники",
    href: "/prazdniki",
    children: [
      { label: "Свадьбы", href: "/svadby", ready: true },
      { label: "Корпоративы", href: "/korporativy", oldSite: `${OLD}/korporativnyy-otdyh` },
      { label: "Детские праздники", href: "/detskie-prazdniki", oldSite: `${OLD}/child-party.html` },
      { label: "Новый год", href: "/novyy-god", oldSite: `${OLD}/novogodniy-korporativ-2026.html` },
    ],
  },
  {
    label: "Проживание",
    href: "/prozhivanie",
    children: [
      { label: "Дома КАНТРИ и ШАЛЕ", href: "/prozhivanie", oldSite: `${OLD}/kottedzh-na-sutki.html` },
      { label: "Баня на дровах", href: "/banya", oldSite: `${OLD}/banya-pod-minskom` },
      { label: "Отдых для двоих", href: "/dlya-dvoih", oldSite: `${OLD}/otdyh-dlya-dvoih.html` },
    ],
  },
  { label: "Сертификаты", href: "/sertifikaty", oldSite: `${OLD}/podarochnye-sertifikaty` },
  { label: "Отзывы", href: "/otzyvy", oldSite: `${OLD}/otzyvy` },
  // Контакты в демо — футер этой же страницы. TODO(сайт): отдельная страница /kontakty
  { label: "Контакты", href: "#kontakty", ready: true },
];

// Куда реально ведёт пункт в демо: своя страница или страница старого сайта в новой вкладке
export function navTarget(link: NavLink) {
  if (link.ready || !link.oldSite) return { href: link.href, external: false } as const;
  return { href: link.oldSite, external: true } as const;
}
