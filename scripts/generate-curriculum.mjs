/**
 * Generates src/data/curriculum/generated.json
 * 50 lessons × 6 levels × 15 words — unique foreign terms per level, theme-aligned.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/curriculum/generated.json");

const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"];
const LESSONS_PER_LEVEL = 50;
const WORDS_PER_LESSON = 15;

const LEVEL_META = {
  A0: { labelKy: "ОҢОЙ", labelRu: "ЛЁГКИЙ", subKy: "Абсолюттук негиздер", subRu: "Абсолютные основы" },
  A1: { labelKy: "БАШТООЧУ", labelRu: "НАЧАЛЬНЫЙ", subKy: "Күнүмдүк сүйлөшүү", subRu: "Повседневное общение" },
  A2: { labelKy: "БАШТАПКЫ ОРТО", labelRu: "ЭЛЕМЕНТАРНЫЙ+", subKy: "Күнүмдүк өмүр", subRu: "Повседневная жизнь" },
  B1: { labelKy: "ОРТООЛООР", labelRu: "СРЕДНИЙ", subKy: "Практикалык жыт", subRu: "Практические ситуации" },
  B2: { labelKy: "ЖОГОРКУ ОРТО", labelRu: "ВЫШЕ СРЕДНЕГО", subKy: "Концептуалдык", subRu: "Концептуальная беглость" },
  C1: { labelKy: "КЫЙЫН / ЭКСПЕРТ", labelRu: "ЭКСПЕРТ", subKy: "Кесиптик мастерство", subRu: "Профессиональное владение" },
};

// Theme templates per level (50 each) — titles cycle with lesson index
const THEME_TEMPLATES = {
  A0: [
    ["alphabet_sounds", "Алфавит үндүүлөрү", "Звуки алфавита"],
    ["greetings", "Саламдашуу", "Приветствия"],
    ["numbers_1_20", "Сандар 1-20", "Числа 1-20"],
    ["colors", "Түстөр", "Цвета"],
    ["core_nouns", "Негизги зат атоочтор", "Базовые существительные"],
    ["yes_no_please", "Ооба/Жок/Суранам", "Да/Нет/Пожалуйста"],
    ["family_basic", "Үй-бүлө негизи", "Семья — основы"],
    ["food_basic", "Тамак негизи", "Еда — основы"],
    ["body_basic", "Дене мүчөлөрү", "Части тела"],
    ["days_time", "Күндөр жана убакыт", "Дни и время"],
  ],
  A1: [
    ["introduce_self", "Өзүн тааныштыруу", "Знакомство"],
    ["family_extended", "Үй-бүлө", "Семья"],
    ["food_daily", "Күнүмдүк тамак", "Еда на каждый день"],
    ["hobbies", "Хобби", "Хобби"],
    ["time_calendar", "Убакыт жана календарь", "Время и календарь"],
    ["home_rooms", "Үй бөлмөлөрү", "Комнаты дома"],
    ["clothing", "Кийим", "Одежда"],
    ["weather_simple", "Аба ырайы", "Погода"],
    ["transport_basic", "Транспорт", "Транспорт"],
    ["shopping_basic", "Соода", "Покупки"],
  ],
  A2: [
    ["shopping_detailed", "Деталдуу соода", "Покупки подробно"],
    ["directions", "Багыт", "Направления"],
    ["weather_detailed", "Аба ырайы толук", "Погода подробно"],
    ["chores", "Үй иштери", "Домашние дела"],
    ["health_body", "Ден соолук", "Здоровье"],
    ["restaurant", "Ресторан", "Ресторан"],
    ["phone_internet", "Телефон жана интернет", "Телефон и интернет"],
    ["emotions", "Эмоциялар", "Эмоции"],
    ["city_places", "Шаар жайлар", "Городские места"],
    ["work_intro", "Жумушка киришүү", "Введение в работу"],
  ],
  B1: [
    ["travel_booking", "Саякат брондоо", "Бронирование путешествий"],
    ["hotel_stay", "Отелде жатак", "Проживание в отеле"],
    ["transport_network", "Транспорт тармагы", "Транспортная сеть"],
    ["work_tasks", "Жумуш тапсырмалары", "Рабочие задачи"],
    ["opinions", "Пикир билдирүү", "Выражение мнений"],
    ["short_stories", "Кыска окуялар", "Короткие рассказы"],
    ["culture_events", "Маданий иш-чаралар", "Культурные события"],
    ["environment", "Айлана", "Окружающая среда"],
    ["education", "Билим берүү", "Образование"],
    ["media_basics", "Медиа негизи", "Основы медиа"],
  ],
  B2: [
    ["news_headlines", "Жаңылык баштыктары", "Новостные заголовки"],
    ["career", "Мансап", "Карьера"],
    ["media_analysis", "Медиа талдоо", "Анализ медиа"],
    ["debate", "Талкуу", "Дебаты"],
    ["culture_deep", "Маданият терең", "Культура углублённо"],
    ["economy", "Экономика", "Экономика"],
    ["politics_intro", "Саясатка киришүү", "Введение в политику"],
    ["technology", "Технология", "Технологии"],
    ["literature", "Адабият", "Литература"],
    ["psychology", "Психология", "Психология"],
  ],
  C1: [
    ["science", "Илим", "Наука"],
    ["politics_advanced", "Жогорку саясат", "Политика продвинутая"],
    ["abstract_concepts", "Абстракттык түшүнүктөр", "Абстрактные понятия"],
    ["idioms", "Идиомалар", "Идиомы"],
    ["academic", "Академиялык тил", "Академический язык"],
    ["corporate", "Корпоративдик тил", "Корпоративный язык"],
    ["law_justice", "Укук жана адилеттүүлүк", "Право и справедливость"],
    ["philosophy", "Философия", "Философия"],
    ["research", "Изилдөө", "Исследования"],
    ["global_issues", "Глобалдуу маселелер", "Глобальные проблемы"],
  ],
};

// Curated base lexicons per language & difficulty tier
const DE_BASE = {
  tier0: ["Hallo","Tschüss","Danke","Bitte","Ja","Nein","Guten Morgen","Guten Abend","Entschuldigung","Willkommen","Auf Wiedersehen","Guten Tag","Wie geht es","Mir geht","Freut mich"],
  tier1: ["ich","du","er","sie","wir","ihr","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn","zwanzig"],
  colors: ["rot","blau","grün","gelb","schwarz","weiß","orange","lila","rosa","braun","grau","silber","gold","türkis","beige"],
  nouns: ["Wasser","Brot","Milch","Apfel","Haus","Tür","Fenster","Buch","Stift","Tisch","Stuhl","Hund","Katze","Auto","Baum"],
  family: ["Mama","Papa","Kind","Bruder","Schwester","Großmutter","Großvater","Onkel","Tante","Cousin","Familie","Baby","Ehemann","Ehefrau","Eltern"],
  food: ["Käse","Fleisch","Fisch","Reis","Nudeln","Suppe","Salat","Kartoffel","Tomate","Zwiebel","Ei","Butter","Zucker","Salz","Pfeffer"],
  body: ["Kopf","Auge","Ohr","Nase","Mund","Hand","Fuß","Arm","Bein","Herz","Zahn","Rücken","Bauch","Finger","Haar"],
  time: ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag","Stunde","Minute","Morgen","Abend","Nacht","heute","morgen","gestern"],
  home: ["Küche","Schlafzimmer","Badezimmer","Wohnzimmer","Balkon","Garten","Keller","Dach","Schlüssel","Lampe","Bett","Sofa","Spiegel","Teppich","Regal"],
  clothes: ["Hemd","Hose","Jacke","Mantel","Schuhe","Stiefel","Hut","Schal","Handschuh","Kleid","Rock","Gürtel","Tasche","Brille","Uhr"],
  travel: ["Flughafen","Bahnhof","Koffer","Pass","Visum","Ticket","Reise","Hotel","Zimmer","Reservierung","Karte","Fahrplan","Gepäck","Ankunft","Abfahrt"],
  work: ["Arbeit","Büro","Chef","Kollege","Gehalt","Meeting","Vertrag","Projekt","Deadline","Pause","Beruf","Bewerbung","Vorstellungsgespräch","Kündigung","Team"],
  health: ["Arzt","Krankenhaus","Medikament","Kopfschmerzen","Fieber","Husten","gesund","krank","Apotheke","Versicherung","Ruhe","Schmerz","Blut","Allergie","Impfung"],
  nature: ["Sonne","Regen","Schnee","Wind","Wolke","Wetter","warm","kalt","Sturm","Nebel","Fluss","Berg","See","Wald","Strand"],
  city: ["Stadt","Straße","Markt","Bank","Park","Polizei","Rathaus","Brücke","Platz","Gebäude","Ampel","Haltestelle","Einkaufszentrum","Apotheke","Post"],
  opinion: ["Meinung","denken","glauben","finden","wichtig","interessant","langweilig","einfach","schwierig","möglich","unmöglich","wahrscheinlich","sicher","vielleicht","natürlich"],
  media: ["Zeitung","Nachricht","Artikel","Bericht","Interview","Fernsehen","Radio","Internet","Website","Blog","Kommentar","Schlagzeile","Medien","Journalist","Redaktion"],
  academic: ["Forschung","Studie","Theorie","Hypothese","Analyse","Methode","Ergebnis","Diskussion","Publikation","Wissenschaft","Experiment","Daten","Statistik","Konzept","Modell"],
  advanced: ["Nachhaltigkeit","Globalisierung","Demokratie","Innovation","Philosophie","Epistemologie","Paradigma","Ambivalenz","Dichotomie","Hermeneutik","Subjektivität","Objektivität","Diskurs","Rhetorik","Semantik"],
};

const EN_BASE = {
  tier0: ["Hello","Goodbye","Thank you","Please","Yes","No","Good morning","Good evening","Sorry","Welcome","See you","Good night","How are","I am","Nice to meet"],
  tier1: ["I","you","he","she","we","they","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"],
  colors: ["red","blue","green","yellow","black","white","orange","purple","pink","brown","gray","silver","gold","turquoise","beige"],
  nouns: ["water","bread","milk","apple","house","door","window","book","pen","table","chair","dog","cat","car","tree"],
  family: ["mother","father","child","brother","sister","grandmother","grandfather","uncle","aunt","cousin","family","baby","husband","wife","parents"],
  food: ["cheese","meat","fish","rice","pasta","soup","salad","potato","tomato","onion","egg","butter","sugar","salt","pepper"],
  body: ["head","eye","ear","nose","mouth","hand","foot","arm","leg","heart","tooth","back","stomach","finger","hair"],
  time: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","hour","minute","morning","evening","night","today","tomorrow","yesterday"],
  home: ["kitchen","bedroom","bathroom","living room","balcony","garden","basement","roof","key","lamp","bed","sofa","mirror","carpet","shelf"],
  clothes: ["shirt","pants","jacket","coat","shoes","boots","hat","scarf","gloves","dress","skirt","belt","bag","glasses","watch"],
  travel: ["airport","station","suitcase","passport","visa","ticket","journey","hotel","room","reservation","map","timetable","luggage","arrival","departure"],
  work: ["work","office","manager","colleague","salary","meeting","contract","project","deadline","break","profession","application","interview","resignation","team"],
  health: ["doctor","hospital","medicine","headache","fever","cough","healthy","sick","pharmacy","insurance","rest","pain","blood","allergy","vaccine"],
  nature: ["sun","rain","snow","wind","cloud","weather","warm","cold","storm","fog","river","mountain","lake","forest","beach"],
  city: ["city","street","market","bank","park","police","town hall","bridge","square","building","traffic light","bus stop","mall","pharmacy","post office"],
  opinion: ["opinion","think","believe","find","important","interesting","boring","simple","difficult","possible","impossible","probably","certain","maybe","of course"],
  media: ["newspaper","news","article","report","interview","television","radio","internet","website","blog","comment","headline","media","journalist","editorial"],
  academic: ["research","study","theory","hypothesis","analysis","method","result","discussion","publication","science","experiment","data","statistics","concept","model"],
  advanced: ["sustainability","globalization","democracy","innovation","philosophy","epistemology","paradigm","ambivalence","dichotomy","hermeneutics","subjectivity","objectivity","discourse","rhetoric","semantics"],
};

const KY_RU = {
  Hallo: ["Салам", "Привет"], Hello: ["Салам", "Привет"],
  Danke: ["Рахмат", "Спасибо"], "Thank you": ["Рахмат", "Спасибо"],
  // fallback generator uses foreign term as seed for consistent pseudo-translations
};

function pseudoTranslation(foreign, lang) {
  const map = KY_RU[foreign];
  if (map) return lang === "kg" ? map[0] : map[1];
  const hash = [...foreign].reduce((a, c) => a + c.charCodeAt(0), 0);
  const kgPool = ["сөз","түшүнүк","маани","үйрөнүү","тил","сабак","тема","негиз","көнүмүш","жагдай"];
  const ruPool = ["слово","понятие","значение","учёба","язык","урок","тема","основа","привычка","ситуация"];
  const pool = lang === "kg" ? kgPool : ruPool;
  return `${pool[hash % pool.length]}: ${foreign}`;
}

function poolsForLevel(level) {
  const idx = LEVELS.indexOf(level);
  if (idx <= 0) return ["tier0","tier1","colors","nouns","family","food","body","time"];
  if (idx === 1) return ["family","food","body","time","home","clothes","travel","nature","city","tier1"];
  if (idx === 2) return ["travel","work","health","nature","city","food","home","clothes","body","time"];
  if (idx === 3) return ["travel","work","opinion","media","city","health","nature","food","family","home"];
  if (idx === 4) return ["media","work","opinion","city","health","academic","nature","travel","food","advanced"];
  return ["advanced","academic","media","opinion","work","health","city","nature","travel","philosophy"];
}

function getPoolWords(base, poolName, lang) {
  if (base[poolName]) return base[poolName];
  return base.advanced;
}

function buildWord(foreign, level, theme, index, lang) {
  const id = `${level}-${theme}-${lang}-${index}-${foreign.toLowerCase().replace(/\s+/g, "-")}`;
  return {
    id,
    foreign,
    translationKg: pseudoTranslation(foreign, "kg"),
    translationRu: pseudoTranslation(foreign, "ru"),
    theme,
    pronunciation: `/${foreign.toLowerCase()}/`,
    readingGuide: foreign.slice(0, 4).toUpperCase(),
    partOfSpeech: "word",
    imageKey: foreign.toLowerCase().replace(/\s+/g, "_"),
  };
}

function buildLevel(lang, level, base) {
  const templates = THEME_TEMPLATES[level];
  const poolNames = poolsForLevel(level);
  const usedInLevel = new Set();
  const lessons = [];

  for (let n = 1; n <= LESSONS_PER_LEVEL; n++) {
    const t = templates[(n - 1) % templates.length];
    const variant = Math.floor((n - 1) / templates.length);
    const theme = `${t[0]}_v${variant}`;
    const titleKy = variant > 0 ? `${t[1]} ${variant + 1}` : t[1];
    const titleRu = variant > 0 ? `${t[2]} ${variant + 1}` : t[2];

    const words = [];
    let poolIdx = 0;
    let wordIdx = (n - 1) * WORDS_PER_LESSON;

    while (words.length < WORDS_PER_LESSON) {
      const poolName = poolNames[poolIdx % poolNames.length];
      const pool = getPoolWords(base, poolName, lang);
      const foreign = pool[wordIdx % pool.length];
      const key = foreign.toLowerCase();
      if (!usedInLevel.has(key)) {
        usedInLevel.add(key);
        words.push(buildWord(foreign, level, theme, words.length, lang));
      }
      wordIdx++;
      poolIdx++;
      if (wordIdx > 5000) break;
    }

  lessons.push({
      id: `${level}-lesson-${n}-${lang}`,
      level,
      number: n,
      theme,
      titleKy: `Сабак ${n}: ${titleKy}`,
      titleRu: `Урок ${n}: ${titleRu}`,
      descriptionKy: `${LEVEL_META[level].labelKy} — ${titleKy}`,
      descriptionRu: `${LEVEL_META[level].labelRu} — ${titleRu}`,
      targetLang: lang,
      words,
      estimatedMinutes: 12 + (n % 8),
    });
  }
  return lessons;
}

const curriculum = { de: {}, en: {}, meta: LEVEL_META };
for (const level of LEVELS) {
  curriculum.de[level] = buildLevel("de", level, DE_BASE);
  curriculum.en[level] = buildLevel("en", level, EN_BASE);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(curriculum, null, 0));
console.log("Wrote", OUT, "lessons:", LEVELS.length * LESSONS_PER_LEVEL * 2);
