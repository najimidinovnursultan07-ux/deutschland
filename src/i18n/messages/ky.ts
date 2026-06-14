import { commonKy } from "@/i18n/messages/common.ky";
import type { MessageTree } from "@/i18n/types";

export const kyMessages: MessageTree = {
  ...commonKy,

  nav: {
    home: "Башкы бет",
    dictionary: "Сөздүк",
    leaderboard: "Рейтинг",
    profile: "Профиль",
    settings: "Жөндөөлөр",
    help: "Жардам борбору",
    faq: "Көп берилүүчү суроолор",
    support: "Байланышуу",
  },

  support: {
    title: "📞 Байланышуу",
    emailLabel: "Электрондук почта:",
    hoursLabel: "Жумуш убактысы:",
    hoursValue: "Дш — Жм, 09:00—18:00 (Бишкек убактысы боюнча)",
    footerNote: "Биз сиздин суроолоруңузга 24 сааттын ичинде жооп беребиз.",
  },

  help: {
    content:
      "LinguaBridge колдонмосуна кош келиңиз! Бул жерден сабактарды өтүү, сөздүктү колдонуу жана тесттерди башкаруу боюнча жардам ала аласыз. Суроолоруңуз болсо, төмөнкү Байланыш бөлүмүнө кайрылыңыз.",
  },

  faq: {
    content:
      "С: Жүрөкчөлөр кантип калыбына келет?\nЖ: Ар 30 мүнөттө бир жүрөк калыбына келет же 200 XP төлөп толуктай аласыз.\n\nС: Кийинки сабак качан ачылат?\nЖ: Учурдагы сабактын тестин ийгиликтүү бүтүргөндөн кийин гана.",
  },

  auth: {
    loginTitle: commonKy.loginTitle,
    signupTitle: commonKy.signupTitle,
    subtitle: commonKy.authSubtitle,
    email: commonKy.email,
    password: commonKy.password,
    passwordLabel: "Сырсөз",
    loginButton: "Кирүү",
    signupButton: "Катталуу",
    loading: commonKy.loading,
    invalidCredentials: "Туура эмес почта же сырсөз",
    invalidEmail: "Туура эмес email формат",
    passwordRequired: "Сырсөздү киргизиңиз",
    nameRequired: "Атыңызды киргизиңиз",
    emailNotFound: "Бул email менен аккаунт табылган жок. «Катталуу» бөлүмүнө өтүңүз.",
    wrongPassword: "Туура эмес сырсөз",
    serverError: "Ката кетти, кайра аракет кылыңыз",
    networkError: "Тармак катасы, кайра аракет кылыңыз",
    emailAlreadyRegistered: "Бул почта катталган",
    passwordMinLength: "Сырсөз кеминде 6 символ",
    emailInUse: "Бул почта колдонулуп жатат",
    namePlaceholder: "Атыңыз",
    targetGerman: "🇩🇪 Немисче",
    targetEnglish: "🇬🇧 Англисче",
    noAccount: commonKy.noAccount,
    haveAccount: commonKy.haveAccount,
    switchToSignup: "Катталуу",
    switchToLogin: "Кирүү",
    name: commonKy.name,
    createAccount: commonKy.createAccount,
  },

  leaderboard: {
    title: "Жумалык лига",
    subtitle: "Бардык катталган оюнчулар · жалпы XP боюнча",
    refresh: "Жаңыртуу",
    empty: "Азырынча катталган оюнчулар жок.",
    you: "Сиз",
    lessons: "сабак",
    totalXp: "жалпы XP",
  },

  feedback: {
    button: "Пикир калтыруу",
    buttonShort: "Пикир",
    title: "Пикир калтыруу",
    placeholder: "Колдонмо жөнүндө ой-пикириңизди жазыңыз...",
    send: "Жөнөтүү",
    close: "Жабуу",
    thanks: "Рахмат! Жөнөтүлдү.",
    error: "Жөнөтүү ишке ашкан жок",
  },

  suggestion: {
    minWords: "Кеминде 100 сөз жазыңыз",
    minWordsAlert:
      "Сунушуңузду кененирээк жазыңыз (минимум 100 сөз болушу шарт).",
    wordCount: "сөз",
    relogin: "Кайра кириңиз",
  },

  pwa: {
    install: "Колдонмону орнотуу",
    dismiss: "Кийинчерээк",
  },

  profile: {
    currentPasswordRequired: "Учурдагы сырсөздү киргизиңиз",
    currentPassword: "Азыркы сырсөз",
    saveFailed: "Сактоо ийгиликсиз",
    wrongPassword: "Туура эмес сырсөз",
    dayStreakSuffix: "күн серия",
    newPasswordPlaceholder: "Жаңы сырсөз (бош калтырсаңыз болот)",
    avatarUrl: "Avatar URL",
  },

  gamification: {
    achievement: "Жетишкендик!",
    achievements: "Жетишкендиктер",
    dismiss: "Жабуу",
    dailyGoal: "Күнүмдүк максат",
    dailyGoalMeta: "{minutes} мүнөт · {target} XP максат",
    languagePair: "Тил жупу",
    review: "Кайталоо",
    lifehacks: "Лайфхактар",
    heartsEmpty: "Жүрөкчөлөр түгөндү!",
    heartsSubtitle: "Кайра толтуруу же күтүү",
    heartsRefill: "{cost} XP менен толтуруу",
    heartsRegen: "Ар бир жүрөк {minutes} мүнөттө калыбына келет",
    continue: "Улантуу",
    quizComplete: "Сабак бүттү!",
    quizScore: "{correct} / {total} туура",
    quizScoreLow: "Кайра аракет кылыңыз",
    selectTranslation: "Туура котормону тандаңыз",
    startQuiz: "Тестти баштоо",
    back: "Артка",
    admin: "Админ",
    noUsers: "Колдонуучулар табылган жок",
    refresh: "Жаңыртуу",
    srsDue: "Бүгүн {count} сөз кайталоого даяр",
  },

  stats: {
    daySuffix: "күн",
  },
};
