import { VOCAB_PER_LESSON } from "@/lib/constants";
import type { CEFRLevel, TargetLanguage } from "@/types";
import type { VocabEntry } from "./types";

export const TOPIC_COUNT = 12;

/** Topic indices: 0=greetings, 1=numbers, 2=colors, 3=family, 4=food, 5=travel, 6=work, 7=health, 8=culture, 9=sport, 10=weather, 11=city */
const e = (
  term: string,
  pron: string,
  guide: string,
  ky: string,
  ru: string,
  pos: string,
  level: CEFRLevel = "A0"
): VocabEntry => ({
  term,
  pronunciation: pron,
  readingGuide: guide,
  definitionKy: ky,
  definitionRu: ru,
  partOfSpeech: pos,
  level,
});

const DE_TOPICS: VocabEntry[][] = [
  // 0 Greetings
  [
    e("Hallo", "/ˈhaloː/", "ХА-ло", "Салам", "Привет", "interjection"),
    e("Tschüss", "/tʃʏs/", "Чюс", "Кош бол", "Пока", "interjection"),
    e("Danke", "/ˈdaŋkə/", "ДАН-ке", "Рахмат", "Спасибо", "interjection"),
    e("Bitte", "/ˈbɪtə/", "БИ-те", "Суранам", "Пожалуйста", "interjection"),
    e("Guten Morgen", "/ˈɡuːtən ˈmɔʁɡən/", "ГУ-ten МОР-ген", "Кутман таң", "Доброе утро", "phrase"),
    e("Guten Abend", "/ˈɡuːtən ˈaːbənt/", "ГУ-ten А-бент", "Кут кеч", "Добрый вечер", "phrase"),
    e("Ja", "/jaː/", "Я", "Ооба", "Да", "adverb"),
    e("Nein", "/naɪ̯n/", "Найн", "Жок", "Нет", "adverb"),
    e("Entschuldigung", "/ɛntˈʃʊldɪɡʊŋ/", "энт-ШУЛ-ди-гунг", "Кечириңиз", "Извините", "interjection"),
    e("Willkommen", "/ˈvɪlkɔmən/", "ВИЛ-ко-мен", "Кош келиңиз", "Добро пожаловать", "interjection"),
  ],
  // 1 Numbers
  [
    e("eins", "/aɪ̯ns/", "Айнс", "Бир", "Один", "number"),
    e("zwei", "/tsvaɪ̯/", "Цвай", "Эки", "Два", "number"),
    e("drei", "/dʁaɪ̯/", "Драй", "Үч", "Три", "number"),
    e("vier", "/fiːɐ̯/", "Фир", "Төрт", "Четыре", "number"),
    e("fünf", "/fʏnf/", "Фюнф", "Беш", "Пять", "number"),
    e("sechs", "/zɛks/", "Зекс", "Алты", "Шесть", "number"),
    e("sieben", "/ˈziːbən/", "ЗИ-бен", "Жети", "Семь", "number"),
    e("acht", "/axt/", "Ахт", "Сегиз", "Восемь", "number"),
    e("neun", "/nɔʏ̯n/", "Нойн", "Тогуз", "Девять", "number"),
    e("zehn", "/tseːn/", "Цен", "Он", "Десять", "number"),
  ],
  // 2 Colors
  [
    e("rot", "/ʁoːt/", "Рот", "Кызыл", "Красный", "adjective"),
    e("blau", "/blaʊ̯/", "Блау", "Көк", "Синий", "adjective"),
    e("grün", "/ɡʁyːn/", "Грюн", "Жашыл", "Зелёный", "adjective"),
    e("gelb", "/ɡɛlp/", "Гельб", "Сары", "Жёлтый", "adjective"),
    e("schwarz", "/ʃvaʁts/", "Шварц", "Кара", "Чёрный", "adjective"),
    e("weiß", "/vaɪ̯s/", "Вайс", "Ак", "Белый", "adjective"),
    e("orange", "/oˈʁaŋʒə/", "о-РАН-же", "Кызгылт", "Оранжевый", "adjective"),
    e("lila", "/ˈliːla/", "ЛИ-ла", "Кызгыл көк", "Фиолетовый", "adjective"),
  ],
  // 3 Family
  [
    e("Mama", "/ˈmama/", "МА-ма", "Апа", "Мама", "noun"),
    e("Papa", "/ˈpapa/", "ПА-па", "Ата", "Папа", "noun"),
    e("Kind", "/kɪnt/", "Кинт", "Бала", "Ребёнок", "noun"),
    e("Frau", "/fʁaʊ̯/", "Фрау", "Аял", "Женщина", "noun"),
    e("Mann", "/man/", "Манн", "Эркек", "Мужчина", "noun"),
    e("Bruder", "/ˈbʁuːdɐ/", "БРУ-дер", "Ага/Ини", "Брат", "noun"),
    e("Schwester", "/ˈʃvɛstɐ/", "ШВЕС-тер", "Сиңди", "Сестра", "noun"),
    e("Großmutter", "/ˈɡʁoːsˌmʊtɐ/", "ГРОС-му-тер", "Чоң эне", "Бабушка", "noun"),
    e("Großvater", "/ˈɡʁoːsˌfaːtɐ/", "ГРОС-фа-тер", "Чоң ата", "Дедушка", "noun"),
    e("Familie", "/faˈmiːli̯ə/", "фа-МИ-лие", "Үй-бүлө", "Семья", "noun"),
  ],
  // 4 Food
  [
    e("Wasser", "/ˈvasɐ/", "ВА-сер", "Суу", "Вода", "noun"),
    e("Brot", "/bʁoːt/", "Брот", "Нан", "Хлеб", "noun"),
    e("Milch", "/mɪlç/", "Мильх", "Сүт", "Молоко", "noun"),
    e("Apfel", "/ˈapfəl/", "АП-фель", "Алма", "Яблоко", "noun"),
    e("Käse", "/ˈkɛːzə/", "КЕ-зе", "Сыр", "Сыр", "noun"),
    e("Fleisch", "/flaɪ̯ʃ/", "Флайш", "Эт", "Мясо", "noun"),
    e("Fisch", "/fɪʃ/", "Фиш", "Балык", "Рыба", "noun"),
    e("Reis", "/ʁaɪ̯s/", "Райс", "Күрүч", "Рис", "noun"),
    e("Kaffee", "/kaˈfeː/", "Каф-ФЕ", "Кофе", "Кофе", "noun"),
    e("Tee", "/teː/", "Те", "Чай", "Чай", "noun"),
  ],
  // 5 Travel
  [
    e("Auto", "/ˈaʊ̯to/", "АУ-то", "Машина", "Машина", "noun"),
    e("Bus", "/bʊs/", "Бус", "Автобус", "Автобус", "noun"),
    e("Zug", "/tsuːk/", "Цук", "Поезд", "Поезд", "noun"),
    e("Flughafen", "/ˈfluːkˌhaːfən/", "ФЛУГ-ха-фен", "Аэропорт", "Аэропорт", "noun"),
    e("Koffer", "/ˈkɔfɐ/", "КО-фер", "Чемодан", "Чемодан", "noun"),
    e("Pass", "/pas/", "Пасс", "Паспорт", "Паспорт", "noun"),
    e("Reise", "/ˈʁaɪ̯zə/", "РАЙ-зе", "Саякат", "Путешествие", "noun"),
    e("Hotel", "/hoˈtɛl/", "хо-ТЕЛЬ", "Отель", "Отель", "noun"),
    e("Karte", "/ˈkaʁtə/", "КАР-те", "Карта", "Карта", "noun"),
    e("Ticket", "/ˈtɪkət/", "ТИ-кет", "Билет", "Билет", "noun"),
  ],
  // 6 Work
  [
    e("Arbeit", "/ˈaʁbaɪ̯t/", "АР-байт", "Жумуш", "Работа", "noun"),
    e("Büro", "/byˈʁoː/", "БЮ-ро", "Кеңсе", "Офис", "noun"),
    e("Chef", "/ʃɛf/", "Шеф", "Башчы", "Начальник", "noun"),
    e("Kollege", "/kɔˈleːɡə/", "ко-ЛЕ-ге", "Кесиптеш", "Коллега", "noun"),
    e("Gehalt", "/ɡəˈhalt/", "ге-ХАЛЬТ", "Айлык", "Зарплата", "noun"),
    e("Meeting", "/ˈmiːtɪŋ/", "МИ-тинг", "Жолугушуу", "Совещание", "noun"),
    e("Computer", "/kɔmˈpuːtɐ/", "ком-ПЬЮ-тер", "Компьютер", "Компьютер", "noun"),
    e("Schule", "/ˈʃuːlə/", "ШУ-ле", "Мектеп", "Школа", "noun"),
  ],
  // 7 Health
  [
    e("Arzt", "/aʁtst/", "Арцт", "Дарыгер", "Врач", "noun"),
    e("Krankenhaus", "/ˈkʁaŋkənhaʊ̯s/", "КРАН-кен-хаус", "Оорукана", "Больница", "noun"),
    e("Medikament", "/mediˈkament/", "ме-ди-ка-МЕНТ", "Дармек", "Лекарство", "noun"),
    e("Kopfschmerzen", "/ˈkɔpfˌʃmɛʁtsən/", "КОПФ-шмер-цен", "Баш оору", "Головная боль", "noun"),
    e("gesund", "/ɡəˈzʊnt/", "ге-ЗУНТ", "Дени сак", "Здоровый", "adjective"),
    e("krank", "/kʁaŋk/", "Кранк", "Оорулуу", "Больной", "adjective"),
    e("Sport", "/ʃpɔʁt/", "Шпорт", "Спорт", "Спорт", "noun"),
    e("Fitness", "/ˈfɪtnəs/", "ФИТ-нес", "Фитнес", "Фитнес", "noun"),
  ],
  // 8 Culture
  [
    e("Musik", "/muˈziːk/", "Му-ЗИК", "Музыка", "Музыка", "noun"),
    e("Film", "/fɪlm/", "Фильм", "Тасма", "Фильм", "noun"),
    e("Theater", "/teˈaːtɐ/", "те-А-тер", "Театр", "Театр", "noun"),
    e("Kunst", "/kʊnst/", "Кунст", "Искусство", "Искусство", "noun"),
    e("Museum", "/muˈzeːʊm/", "му-ЗЕ-ум", "Музей", "Музей", "noun"),
    e("Buch", "/buːx/", "Бух", "Китеп", "Книга", "noun"),
    e("Konzert", "/kɔnˈtsɛʁt/", "кон-ЦЕРТ", "Концерт", "Концерт", "noun"),
    e("Kultur", "/kʊlˈtuːɐ̯/", "куль-ТУР", "Маданият", "Культура", "noun"),
  ],
  // 9 Sport
  [
    e("Ball", "/bal/", "Балл", "Доп", "Мяч", "noun"),
    e("Fußball", "/ˈfuːsˌbal/", "ФУС-бал", "Футбол", "Футбол", "noun"),
    e("Schwimmen", "/ˈʃvɪmən/", "ШВИ-мен", "Сүзүү", "Плавание", "noun"),
    e("Laufen", "/ˈlaʊ̯fən/", "ЛАУ-фен", "Чуркоо", "Бег", "noun"),
    e("Team", "/tiːm/", "Тим", "Команда", "Команда", "noun"),
    e("Spiel", "/ʃpiːl/", "Шпиль", "Оюн", "Игра", "noun"),
    e("Stadion", "/ʃtaˈdi̯oːn/", "шта-ДИ-он", "Стадион", "Стадион", "noun"),
    e("Trainer", "/ˈtʁɛnɐ/", "ТРЕ-нер", "Машыктыруучу", "Тренер", "noun"),
  ],
  // 10 Weather
  [
    e("Sonne", "/ˈzɔnə/", "ЗО-не", "Күн", "Солнце", "noun"),
    e("Regen", "/ˈʁeːɡən/", "РЕ-ген", "Жамгыр", "Дождь", "noun"),
    e("Schnee", "/ʃneː/", "Шне", "Кар", "Снег", "noun"),
    e("Wind", "/vɪnt/", "Винт", "Жел", "Ветер", "noun"),
    e("Wolke", "/ˈvɔlkə/", "ВОЛ-ке", "Булут", "Облако", "noun"),
    e("Wetter", "/ˈvɛtɐ/", "ВЕТ-тер", "Аба ырайы", "Погода", "noun"),
    e("warm", "/vaʁm/", "Варм", "Жылуу", "Тёплый", "adjective"),
    e("kalt", "/kalt/", "Кальт", "Суук", "Холодный", "adjective"),
  ],
  // 11 City
  [
    e("Stadt", "/ʃtat/", "Штат", "Шаар", "Город", "noun"),
    e("Straße", "/ˈʃtʁaːsə/", "ШТРА-ссе", "Көчө", "Улица", "noun"),
    e("Haus", "/haʊ̯s/", "Хаус", "Үй", "Дом", "noun"),
    e("Park", "/paʁk/", "Парк", "Парк", "Парк", "noun"),
    e("Markt", "/maʁkt/", "Маркт", "Базар", "Рынок", "noun"),
    e("Bank", "/baŋk/", "Банк", "Банк", "Банк", "noun"),
    e("Polizei", "/poliˈtsaɪ̯/", "по-ли-ЦАЙ", "Милиция", "Полиция", "noun"),
    e("Rathaus", "/ˈʁaːthaʊ̯s/", "РАТ-хаус", "Мэрия", "Ратуша", "noun"),
  ],
];

const EN_TOPICS: VocabEntry[][] = [
  [
    e("Hello", "/həˈloʊ/", "Хэ-ЛОУ", "Салам", "Привет", "interjection"),
    e("Goodbye", "/ɡʊdˈbaɪ/", "Гуд-БАЙ", "Кош бол", "До свидания", "interjection"),
    e("Thank you", "/θæŋk juː/", "Сэнк Ю", "Рахмат", "Спасибо", "interjection"),
    e("Please", "/pliːz/", "Плиз", "Суранам", "Пожалуйста", "interjection"),
    e("Good morning", "/ɡʊd ˈmɔːrnɪŋ/", "Гуд МОР-нинг", "Кутман таң", "Доброе утро", "phrase"),
    e("Good evening", "/ɡʊd ˈiːvnɪŋ/", "Гуд ИВ-нинг", "Кут кеч", "Добрый вечер", "phrase"),
    e("Yes", "/jɛs/", "Ес", "Ооба", "Да", "adverb"),
    e("No", "/noʊ/", "Ноу", "Жок", "Нет", "adverb"),
    e("Sorry", "/ˈsɒri/", "СО-ри", "Кечириңиз", "Извините", "interjection"),
    e("Welcome", "/ˈwɛlkəm/", "УЭЛ-кэм", "Кош келиңиз", "Добро пожаловать", "interjection"),
  ],
  [
    e("one", "/wʌn/", "Уан", "Бир", "Один", "number"),
    e("two", "/tuː/", "Ту", "Эки", "Два", "number"),
    e("three", "/θriː/", "Сри", "Үч", "Три", "number"),
    e("four", "/fɔːr/", "Фор", "Төрт", "Четыре", "number"),
    e("five", "/faɪv/", "Файв", "Беш", "Пять", "number"),
    e("six", "/sɪks/", "Сикс", "Алты", "Шесть", "number"),
    e("seven", "/ˈsɛvən/", "СЕ-вэн", "Жети", "Семь", "number"),
    e("eight", "/eɪt/", "Эйт", "Сегиз", "Восемь", "number"),
    e("nine", "/naɪn/", "Найн", "Тогуз", "Девять", "number"),
    e("ten", "/tɛn/", "Тен", "Он", "Десять", "number"),
  ],
  [
    e("red", "/rɛd/", "Ред", "Кызыл", "Красный", "adjective"),
    e("blue", "/bluː/", "Блу", "Көк", "Синий", "adjective"),
    e("green", "/ɡriːn/", "Грин", "Жашыл", "Зелёный", "adjective"),
    e("yellow", "/ˈjɛloʊ/", "ЙЕ-лоу", "Сары", "Жёлтый", "adjective"),
    e("black", "/blæk/", "Блэк", "Кара", "Чёрный", "adjective"),
    e("white", "/waɪt/", "Уайт", "Ак", "Белый", "adjective"),
    e("orange", "/ˈɒrɪndʒ/", "О-риндж", "Кызгылт", "Оранжевый", "adjective"),
    e("purple", "/ˈpɜːrpəl/", "ПЁР-пл", "Кызгыл көк", "Фиолетовый", "adjective"),
  ],
  [
    e("mother", "/ˈmʌðər/", "МА-зер", "Апа", "Мама", "noun"),
    e("father", "/ˈfɑːðər/", "ФА-зер", "Ата", "Папа", "noun"),
    e("child", "/tʃaɪld/", "Чайлд", "Бала", "Ребёнок", "noun"),
    e("woman", "/ˈwʊmən/", "УУ-мэн", "Аял", "Женщина", "noun"),
    e("man", "/mæn/", "Мэн", "Эркек", "Мужчина", "noun"),
    e("brother", "/ˈbrʌðər/", "БРА-зер", "Ага/Ини", "Брат", "noun"),
    e("sister", "/ˈsɪstər/", "СИС-тер", "Сиңди", "Сестра", "noun"),
    e("grandmother", "/ˈɡrænˌmʌðər/", "ГРЭН-ма-зер", "Чоң эне", "Бабушка", "noun"),
    e("grandfather", "/ˈɡrænˌfɑːðər/", "ГРЭН-фа-зер", "Чоң ата", "Дедушка", "noun"),
    e("family", "/ˈfæməli/", "ФЭ-ми-ли", "Үй-бүлө", "Семья", "noun"),
  ],
  [
    e("water", "/ˈwɔːtər/", "УО-тер", "Суу", "Вода", "noun"),
    e("bread", "/brɛd/", "Бред", "Нан", "Хлеб", "noun"),
    e("milk", "/mɪlk/", "Милк", "Сүт", "Молоко", "noun"),
    e("apple", "/ˈæpəl/", "Э-пл", "Алма", "Яблоко", "noun"),
    e("cheese", "/tʃiːz/", "Чиз", "Сыр", "Сыр", "noun"),
    e("meat", "/miːt/", "Мит", "Эт", "Мясо", "noun"),
    e("fish", "/fɪʃ/", "Фиш", "Балык", "Рыба", "noun"),
    e("rice", "/raɪs/", "Райс", "Күрүч", "Рис", "noun"),
    e("coffee", "/ˈkɔːfi/", "КО-фи", "Кофе", "Кофе", "noun"),
    e("tea", "/tiː/", "Ти", "Чай", "Чай", "noun"),
  ],
  [
    e("car", "/kɑːr/", "Кар", "Машина", "Машина", "noun"),
    e("bus", "/bʌs/", "Бас", "Автобус", "Автобус", "noun"),
    e("train", "/treɪn/", "Трейн", "Поезд", "Поезд", "noun"),
    e("airport", "/ˈɛrˌpɔːrt/", "ЭР-порт", "Аэропорт", "Аэропорт", "noun"),
    e("suitcase", "/ˈsuːtkeɪs/", "СУТ-кейс", "Чемодан", "Чемодан", "noun"),
    e("passport", "/ˈpæspɔːrt/", "ПАС-порт", "Паспорт", "Паспорт", "noun"),
    e("journey", "/ˈdʒɜːrni/", "ДЖЁР-ни", "Саякат", "Путешествие", "noun"),
    e("hotel", "/hoʊˈtɛl/", "хо-ТЕЛ", "Отель", "Отель", "noun"),
    e("map", "/mæp/", "Мэп", "Карта", "Карта", "noun"),
    e("ticket", "/ˈtɪkɪt/", "ТИ-кит", "Билет", "Билет", "noun"),
  ],
  [
    e("work", "/wɜːrk/", "Уёрк", "Жумуш", "Работа", "noun"),
    e("office", "/ˈɒfɪs/", "О-фис", "Кеңсе", "Офис", "noun"),
    e("manager", "/ˈmænɪdʒər/", "МЭ-ни-джер", "Башчы", "Начальник", "noun"),
    e("colleague", "/ˈkɒliːɡ/", "КО-лиг", "Кесиптеш", "Коллега", "noun"),
    e("salary", "/ˈsæləri/", "СЭ-ле-ри", "Айлык", "Зарплата", "noun"),
    e("meeting", "/ˈmiːtɪŋ/", "МИ-тинг", "Жолугушуу", "Совещание", "noun"),
    e("computer", "/kəmˈpjuːtər/", "ком-ПЬЮ-тер", "Компьютер", "Компьютер", "noun"),
    e("school", "/skuːl/", "Скул", "Мектеп", "Школа", "noun"),
  ],
  [
    e("doctor", "/ˈdɒktər/", "ДОК-тер", "Дарыгер", "Врач", "noun"),
    e("hospital", "/ˈhɒspɪtəl/", "ХОС-пи-тл", "Оорукана", "Больница", "noun"),
    e("medicine", "/ˈmɛdəsən/", "МЕ-ди-сн", "Дармек", "Лекарство", "noun"),
    e("headache", "/ˈhɛdeɪk/", "ХЕД-эйк", "Баш оору", "Головная боль", "noun"),
    e("healthy", "/ˈhɛlθi/", "ХЕЛ-си", "Дени сак", "Здоровый", "adjective"),
    e("sick", "/sɪk/", "Сик", "Оорулуу", "Больной", "adjective"),
    e("sport", "/spɔːrt/", "Спорт", "Спорт", "Спорт", "noun"),
    e("fitness", "/ˈfɪtnəs/", "ФИТ-нес", "Фитнес", "Фитнес", "noun"),
  ],
  [
    e("music", "/ˈmjuːzɪk/", "МЬЮ-зик", "Музыка", "Музыка", "noun"),
    e("movie", "/ˈmuːvi/", "МУ-ви", "Тасма", "Фильм", "noun"),
    e("theatre", "/ˈθɪətər/", "СИ-э-тер", "Театр", "Театр", "noun"),
    e("art", "/ɑːrt/", "Арт", "Искусство", "Искусство", "noun"),
    e("museum", "/mjuːˈziːəm/", "мью-ЗИ-эм", "Музей", "Музей", "noun"),
    e("book", "/bʊk/", "Бук", "Китеп", "Книга", "noun"),
    e("concert", "/ˈkɒnsərt/", "КОН-серт", "Концерт", "Концерт", "noun"),
    e("culture", "/ˈkʌltʃər/", "КАЛ-чер", "Маданият", "Культура", "noun"),
  ],
  [
    e("ball", "/bɔːl/", "Бол", "Доп", "Мяч", "noun"),
    e("football", "/ˈfʊtbɔːl/", "ФУТ-бол", "Футбол", "Футбол", "noun"),
    e("swimming", "/ˈswɪmɪŋ/", "СУИ-минг", "Сүзүү", "Плавание", "noun"),
    e("running", "/ˈrʌnɪŋ/", "РА-нинг", "Чуркоо", "Бег", "noun"),
    e("team", "/tiːm/", "Тим", "Команда", "Команда", "noun"),
    e("game", "/ɡeɪm/", "Гейм", "Оюн", "Игра", "noun"),
    e("stadium", "/ˈsteɪdiəm/", "СТЕЙ-ди-эм", "Стадион", "Стадион", "noun"),
    e("coach", "/koʊtʃ/", "Коуч", "Машыктыруучу", "Тренер", "noun"),
  ],
  [
    e("sun", "/sʌn/", "Сан", "Күн", "Солнце", "noun"),
    e("rain", "/reɪn/", "Рейн", "Жамгыр", "Дождь", "noun"),
    e("snow", "/snoʊ/", "Сноу", "Кар", "Снег", "noun"),
    e("wind", "/wɪnd/", "Уинд", "Жел", "Ветер", "noun"),
    e("cloud", "/klaʊd/", "Клауд", "Булут", "Облако", "noun"),
    e("weather", "/ˈwɛðər/", "УЭ-зер", "Аба ырайы", "Погода", "noun"),
    e("warm", "/wɔːrm/", "Уорм", "Жылуу", "Тёплый", "adjective"),
    e("cold", "/koʊld/", "Коулд", "Суук", "Холодный", "adjective"),
  ],
  [
    e("city", "/ˈsɪti/", "Си-ти", "Шаар", "Город", "noun"),
    e("street", "/striːt/", "Стрит", "Көчө", "Улица", "noun"),
    e("house", "/haʊs/", "Хаус", "Үй", "Дом", "noun"),
    e("park", "/pɑːrk/", "Парк", "Парк", "Парк", "noun"),
    e("market", "/ˈmɑːrkɪt/", "МАР-кит", "Базар", "Рынок", "noun"),
    e("bank", "/bæŋk/", "Бэнк", "Банк", "Банк", "noun"),
    e("police", "/pəˈliːs/", "по-ЛИС", "Милиция", "Полиция", "noun"),
    e("town hall", "/taʊn hɔːl/", "ТАУН хол", "Мэрия", "Ратуша", "noun"),
  ],
];

const POOLS: Record<TargetLanguage, VocabEntry[][]> = {
  de: DE_TOPICS,
  en: EN_TOPICS,
};

export function getTopicIndex(lessonNumber: number): number {
  return (lessonNumber - 1) % TOPIC_COUNT;
}

export function getWordsForLessonByTopic(
  lessonNumber: number,
  targetLang: TargetLanguage,
  level: CEFRLevel
): VocabEntry[] {
  const topicIndex = getTopicIndex(lessonNumber);
  const batch = Math.floor((lessonNumber - 1) / TOPIC_COUNT);
  const pool = POOLS[targetLang][topicIndex] ?? [];

  if (pool.length === 0) return [];

  const tagged = pool.map((w) => ({ ...w, level }));
  const repeats = Math.ceil((VOCAB_PER_LESSON * (batch + 1)) / tagged.length);
  const extended: VocabEntry[] = [];
  for (let r = 0; r < repeats; r++) {
    extended.push(...tagged);
  }

  const start = batch * VOCAB_PER_LESSON;
  return extended.slice(start, start + VOCAB_PER_LESSON);
}
