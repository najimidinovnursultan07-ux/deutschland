import type { CEFRLevel } from "@/types";
import type { LevelCatalogEntry } from "@/types/curriculum";

export const LESSONS_PER_LEVEL = 50;
export const WORDS_PER_LESSON = 15;

export const LEVEL_CATALOG: Record<CEFRLevel, LevelCatalogEntry> = {
  A0: {
    level: "A0",
    labelKy: "ОҢОЙ",
    labelRu: "ЛЁГКИЙ",
    subtitleKy: "Абсолюттук негиздер",
    subtitleRu: "Абсолютные основы",
  },
  A1: {
    level: "A1",
    labelKy: "БАШТООЧУ",
    labelRu: "НАЧАЛЬНЫЙ",
    subtitleKy: "Күнүмдүк сүйлөшүү",
    subtitleRu: "Повседневное общение",
  },
  A2: {
    level: "A2",
    labelKy: "БАШТАПКЫ ОРТО",
    labelRu: "ЭЛЕМЕНТАРНЫЙ+",
    subtitleKy: "Күнүмдүк өмүр",
    subtitleRu: "Повседневная жизнь",
  },
  B1: {
    level: "B1",
    labelKy: "ОРТООЛООР",
    labelRu: "СРЕДНИЙ",
    subtitleKy: "Практикалык жагдайлар",
    subtitleRu: "Практические ситуации",
  },
  B2: {
    level: "B2",
    labelKy: "ЖОГОРКУ ОРТО",
    labelRu: "ВЫШЕ СРЕДНЕГО",
    subtitleKy: "Концептуалдык беглость",
    subtitleRu: "Концептуальная беглость",
  },
  C1: {
    level: "C1",
    labelKy: "КЫЙЫН / ЭКСПЕРТ",
    labelRu: "ЭКСПЕРТ",
    subtitleKy: "Кесиптик мастерство",
    subtitleRu: "Профессиональное владение",
  },
};

/** 50 lesson theme slots per level — maps to lexicon theme keys */
const A0_LESSONS = [
  { theme: "alphabet", titleKy: "Алфавит үндүүлөрү", titleRu: "Звуки алфавита" },
  { theme: "greetings", titleKy: "Саламдашуу", titleRu: "Приветствия" },
  { theme: "numbers", titleKy: "Сандар 1-10", titleRu: "Числа 1-10" },
  { theme: "numbers", titleKy: "Сандар 11-20", titleRu: "Числа 11-20" },
  { theme: "colors", titleKy: "Негизги түстөр", titleRu: "Основные цвета" },
  { theme: "colors", titleKy: "Кошумча түстөр", titleRu: "Дополнительные цвета" },
  { theme: "core_nouns", titleKy: "Зат атоочтор I", titleRu: "Существительные I" },
  { theme: "core_nouns", titleKy: "Зат атоочтор II", titleRu: "Существительные II" },
  { theme: "polite", titleKy: "Сурануу формалары", titleRu: "Формулы вежливости" },
  { theme: "polite", titleKy: "Ыраазычылык", titleRu: "Благодарность" },
  { theme: "pronouns", titleKy: "Жалпы атоочтор", titleRu: "Местоимения" },
  { theme: "family", titleKy: "Үй-бүлө негизи", titleRu: "Семья — основы" },
  { theme: "food", titleKy: "Тамак негизи", titleRu: "Еда — основы" },
  { theme: "drinks", titleKy: "Ичимдиктер", titleRu: "Напитки" },
  { theme: "body", titleKy: "Дене мүчөлөрү I", titleRu: "Тело I" },
  { theme: "body", titleKy: "Дене мүчөлөрү II", titleRu: "Тело II" },
  { theme: "home", titleKy: "Үй бөлмөлөрү", titleRu: "Комнаты дома" },
  { theme: "home", titleKy: "Үй заттары", titleRu: "Предметы дома" },
  { theme: "time", titleKy: "Күндөр", titleRu: "Дни недели" },
  { theme: "time", titleKy: "Убакыт", titleRu: "Время суток" },
  { theme: "weather", titleKy: "Аба ырайы негизи", titleRu: "Погода — основы" },
  { theme: "animals", titleKy: "Айбандар", titleRu: "Животные" },
  { theme: "nature", titleKy: "Табият", titleRu: "Природа" },
  { theme: "city", titleKy: "Шаар негизи", titleRu: "Город — основы" },
  { theme: "transport", titleKy: "Транспорт негизи", titleRu: "Транспорт — основы" },
];

const A1_LESSONS = [
  { theme: "introduce", titleKy: "Өзүн тааныштыруу", titleRu: "Знакомство" },
  { theme: "family", titleKy: "Үй-бүлө", titleRu: "Семья" },
  { theme: "food", titleKy: "Күнүмдүк тамак", titleRu: "Еда на каждый день" },
  { theme: "hobbies", titleKy: "Хобби", titleRu: "Хобби" },
  { theme: "time", titleKy: "Календарь", titleRu: "Календарь" },
  { theme: "home", titleKy: "Үй жашоо", titleRu: "Домашний быт" },
  { theme: "clothes", titleKy: "Кийим", titleRu: "Одежда" },
  { theme: "weather", titleKy: "Аба ырайы", titleRu: "Погода" },
  { theme: "transport", titleRu: "Транспорт", titleKy: "Транспорт" },
  { theme: "shopping", titleKy: "Соода негизи", titleRu: "Покупки — основы" },
];

function expandTo50(
  base: { theme: string; titleKy: string; titleRu: string }[]
): { theme: string; titleKy: string; titleRu: string }[] {
  const out: typeof base = [];
  let round = 0;
  while (out.length < LESSONS_PER_LEVEL) {
    for (const item of base) {
      if (out.length >= LESSONS_PER_LEVEL) break;
      const suffix = round > 0 ? ` ${round + 1}` : "";
      out.push({
        theme: item.theme,
        titleKy: `${item.titleKy}${suffix}`,
        titleRu: `${item.titleRu}${suffix}`,
      });
    }
    round++;
  }
  return out;
}

export const LESSON_CATALOG: Record<
  CEFRLevel,
  { theme: string; titleKy: string; titleRu: string }[]
> = {
  A0: expandTo50(A0_LESSONS),
  A1: expandTo50(A1_LESSONS),
  A2: expandTo50([
    { theme: "shopping", titleKy: "Соода", titleRu: "Покупки" },
    { theme: "directions", titleKy: "Багыт", titleRu: "Направления" },
    { theme: "weather", titleKy: "Аба ырайы толук", titleRu: "Погода подробно" },
    { theme: "chores", titleKy: "Үй иштери", titleRu: "Домашние дела" },
    { theme: "health", titleKy: "Ден соолук", titleRu: "Здоровье" },
    { theme: "restaurant", titleKy: "Ресторан", titleRu: "Ресторан" },
    { theme: "phone", titleKy: "Телефон", titleRu: "Телефон" },
    { theme: "emotions", titleKy: "Эмоциялар", titleRu: "Эмоции" },
    { theme: "city", titleKy: "Шаар жайлар", titleRu: "Городские места" },
    { theme: "work", titleKy: "Жумуш негизи", titleRu: "Работа — основы" },
  ]),
  B1: expandTo50([
    { theme: "travel", titleKy: "Саякат брондоо", titleRu: "Бронирование" },
    { theme: "hotel", titleKy: "Отель", titleRu: "Отель" },
    { theme: "transport", titleKy: "Транспорт тармагы", titleRu: "Транспортная сеть" },
    { theme: "work", titleKy: "Жумуш тапсырмалары", titleRu: "Рабочие задачи" },
    { theme: "opinions", titleKy: "Пикир", titleRu: "Мнения" },
    { theme: "stories", titleKy: "Окуялар", titleRu: "Рассказы" },
    { theme: "culture", titleKy: "Маданият", titleRu: "Культура" },
    { theme: "environment", titleKy: "Айлана", titleRu: "Экология" },
    { theme: "education", titleKy: "Билим", titleRu: "Образование" },
    { theme: "media", titleKy: "Медиа", titleRu: "Медиа" },
  ]),
  B2: expandTo50([
    { theme: "news", titleKy: "Жаңылыктар", titleRu: "Новости" },
    { theme: "career", titleKy: "Мансап", titleRu: "Карьера" },
    { theme: "media", titleKy: "Медиа талдоо", titleRu: "Анализ медиа" },
    { theme: "debate", titleKy: "Талкуу", titleRu: "Дебаты" },
    { theme: "culture", titleKy: "Маданият терең", titleRu: "Культура углублённо" },
    { theme: "economy", titleKy: "Экономика", titleRu: "Экономика" },
    { theme: "politics", titleKy: "Саясат", titleRu: "Политика" },
    { theme: "technology", titleKy: "Технология", titleRu: "Технологии" },
    { theme: "literature", titleKy: "Адабият", titleRu: "Литература" },
    { theme: "psychology", titleKy: "Психология", titleRu: "Психология" },
  ]),
  C1: expandTo50([
    { theme: "science", titleKy: "Илим", titleRu: "Наука" },
    { theme: "politics", titleKy: "Жогорку саясат", titleRu: "Политика продвинутая" },
    { theme: "abstract", titleKy: "Абстракция", titleRu: "Абстракция" },
    { theme: "idioms", titleKy: "Идиомалар", titleRu: "Идиомы" },
    { theme: "academic", titleKy: "Академия", titleRu: "Академический язык" },
    { theme: "corporate", titleKy: "Корпорация", titleRu: "Корпоративный язык" },
    { theme: "law", titleKy: "Укук", titleRu: "Право" },
    { theme: "philosophy", titleKy: "Философия", titleRu: "Философия" },
    { theme: "research", titleKy: "Изилдөө", titleRu: "Исследования" },
    { theme: "global", titleKy: "Глобалдуу маселелер", titleRu: "Глобальные проблемы" },
  ]),
};
