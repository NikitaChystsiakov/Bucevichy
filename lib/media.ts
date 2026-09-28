// Медиа из Instagram @verhomby (хайлайт «Свадьбы»). Описание файлов: docs/media-svadba.md.
// Всё уже обрезано от надписей и стикеров.
// TODO(медиа): запросить у клиента оригиналы в хорошем качестве. Часть кадров и фильм сняли
// сторонние авторы (pavel__gorbach, viki.cherniki, grek_vi и др.) — для боевого сайта нужно их разрешение.

import { photos, type Photo } from "./photos";

export type Video = {
  kind: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
};

const v = (name: string, width: number, height: number, alt: string): Video => ({
  kind: "video",
  src: `/video/svadba/${name}.mp4`,
  poster: `/video/svadba/${name}.jpg`,
  width,
  height,
  alt,
});

const p = (name: string, width: number, height: number, alt: string): Photo => ({
  src: `/images/svadba/insta/${name}.jpg`,
  width,
  height,
  alt,
});

export const videos = {
  hallPrep: v("00-hall-prep", 360, 640, "Подготовка банкетного зала: длинный стол и зелень"),
  hallEmpty: v("03-hall-empty-light", 302, 332, "Светлый зал с окнами в пол, буквы LOVE и сервировка"),
  brideWalk: v("05-bride-walk-field", 302, 216, "Невеста и гости идут к полю, рядом ведут лошадь"),
  brideHorsesSunset: v("06-bride-horses-sunset", 288, 354, "Невеста с двумя лошадьми на закате в поле"),
  nightBonfire: v("12-night-bonfire-love", 552, 804, "Ночной костёр, светящиеся буквы LOVE, дом в огнях"),
  eveningGazebo: v("16-evening-gazebo-garlands", 690, 1100, "Вечер: беседка в гирляндах под закатным небом"),
  ceremonyArch: v("17-ceremony-arch-haybales", 480, 320, "Свадебная арка на лугу и тюки сена для гостей"),
  // Первые 2 с ролика 17: только арка и тюки (дальше в кадре терраса зала). Нарезано ffmpeg
  ceremonyArchShort: v("17-ceremony-arch-2s", 480, 320, "Свадебная арка на лугу, тюки сена и коза у лавочек"),
  firstDance: v("19-dance-smoke-canopy", 720, 946, "Первый танец молодых в дыму под навесом"),
  banquetOutdoor: v("23-banquet-outdoor-garlands", 540, 806, "Банкет на улице под ретро-гирляндами, за ним поле"),
  fourchette: v("24-fourchette-season-opening", 720, 844, "Фуршет под навесом: цветы, гости на лугу"),
  horsesPaddock: v("26-horses-paddock", 720, 1280, "Белые и гнедые лошади в леваде идут на камеру"),
  ridersField: v("27-riders-golden-field", 720, 806, "Всадники уезжают по зелёному полю в солнечный день"),
  estateFilm: v("29-estate-film-16x9", 1920, 1080, "Промо-ролик усадьбы: лесная дорога, поле, дом с камином, конюшня"),
  // Нарезки ролика 29 для карты усадьбы (ffmpeg): 4,0–8,3 с и 10,8–15,25 с — без титра
  // «Буцевичи» и без людей в кадре (в исходнике крупно девушка из рилса и гости у конюшни).
  // 1080p — фон на десктопе (растяжение ≤1,5 при высоте секции до 1600px), 720p — карточка на телефоне
  estateFilmBg: v("29-estate-film-bg-1080", 1920, 1080, "Усадьба с седла и изнутри: поле, дом с камином, шлемы на террасе"),
  estateFilmCard: v("29-estate-film-card", 1280, 720, "Усадьба с седла и изнутри: поле, дом с камином, шлемы на террасе"),
  // TODO(права): фильм снят сторонним автором, нужно разрешение
  filmDmitryYana: v("film-dmitry-yana", 638, 360, "Свадебный фильм «Дмитрий и Яна» в Буцевичах"),
} satisfies Record<string, Video>;

export const instaPhotos = {
  coupleFog: p("22-couple-fog-pampas", 1179, 1907, "Жених и невеста в тумане среди пампасной травы на закате"),
  nightSparklers: p("20-night-sparklers-couple", 1083, 1679, "Молодые кружатся среди холодных фонтанов у дома ночью"),
  ceremonyMeadow: p("18-ceremony-meadow-signpost", 1152, 819, "Луг со свадебной аркой, тюками сена и указателем"),
  hallTable: p("01-hall-table-panoramic", 828, 1118, "Банкетный зал: стол с зеленью, буквы LOVE, окна в пол"),
  nightGazeboSign: p("13-night-gazebo-wedding-sign", 828, 883, "Беседка с надписью Wedding ночью, гирлянды"),
  fourchetteTable: p("25-fourchette-summer-table", 1080, 1478, "Фуршетный стол под навесом: лимонад, цветы, закуски"),
  ringsHorseshoes: p("02-rings-horseshoes", 663, 588, "Обручальные кольца на двух подковах"),
} satisfies Record<string, Photo>;

// Кадр из ролика как фото (постер), когда нужен неподвижный снимок
export const posterPhoto = (video: Video): Photo => ({
  src: video.poster,
  width: video.width,
  height: video.height,
  alt: video.alt,
});

export type HeroMedia = ({ kind: "photo" } & Photo) | Video;

// Первый экран. Чтобы поставить видео, замените строку, например: `= videos.eveningGazebo;`
export const heroMedia: HeroMedia = { kind: "photo", ...instaPhotos.coupleFog };

// Галерея: лучшие кадры в порядке свадебного дня (утро → ночь). Подписи — только то, что в кадре.
// Фото 22 (hero) и 20 (финальный экран) не повторяем. Кадры 19 и 12 — постеры роликов.
// TODO(фото): настоящих свадебных фото мало, часть кадров — прогулки и корпоративы; запросить у клиента.
// crop — классы для картинки, если кадр надо подрезать (остатки стикеров Instagram)
export type GalleryItem = Photo & { caption: string; crop?: string };

const g = (photo: Photo, caption: string, crop?: string): GalleryItem => ({ ...photo, caption, crop });

export const gallery: GalleryItem[] = [
  // Вверху кадра белый стикер из Instagram — увеличиваем от нижнего края, как в «Почему здесь»
  g(instaPhotos.ceremonyMeadow, "Луг с аркой и тюками сена", "origin-bottom scale-[1.2]"),
  g(instaPhotos.ringsHorseshoes, "Кольца на подковах"),
  g(photos.riderPaint, "Верхом в леваде"),
  g(photos.ridersPair, "Вдвоём к лесу"),
  g(photos.girlWithHorse, "Золотой час"),
  g(instaPhotos.fourchetteTable, "Фуршет под навесом"),
  g(photos.hallSun, "Зал 170 м² с окнами в пол"),
  g(instaPhotos.hallTable, "Стол в зелени, буквы LOVE"),
  g(photos.ridersWelcome, "Всадники встречают гостей"),
  g(photos.whiteHorseForest, "Лесная тропа"),
  g(photos.horseMuzzle, "В конюшне"),
  g(posterPhoto(videos.firstDance), "Первый танец"),
  g(photos.chaletEvening, "Вечер в гирляндах"),
  g(instaPhotos.nightGazeboSign, "Беседка ночью"),
  g(posterPhoto(videos.nightBonfire), "Костёр и LOVE"),
];
