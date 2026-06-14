import { commonRu } from "@/i18n/messages/common.ru";
import type { MessageTree } from "@/i18n/types";

export const ruMessages: MessageTree = {
  ...commonRu,

  nav: {
    home: "Главная",
    dictionary: "Словарь",
    leaderboard: "Рейтинг",
    profile: "Профиль",
    settings: "Настройки",
    help: "Центр помощи",
    faq: "Частые вопросы",
    support: "Связаться с нами",
  },

  support: {
    title: "📞 Связаться с нами",
    emailLabel: "Электронная почта:",
    hoursLabel: "Часы работы:",
    hoursValue: "Пн — Пт, 09:00—18:00 (по времени Бишкека)",
    footerNote: "Мы ответим на ваши вопросы в течение 24 часов.",
  },

  help: {
    content:
      "Добро пожаловать в LinguaBridge! Здесь вы найдёте помощь по прохождению уроков, использованию словаря и прохождению тестов. Если у вас есть вопросы, обратитесь в раздел Контакты ниже.",
  },

  faq: {
    content:
      "В: Как восстанавливаются сердца?\nО: Каждые 30 минут восстанавливается одно сердце, или можно пополнить за 200 XP.\n\nВ: Когда откроется следующий урок?\nО: Только после успешного прохождения теста текущего урока.",
  },

  auth: {
    loginTitle: commonRu.loginTitle,
    signupTitle: commonRu.signupTitle,
    subtitle: commonRu.authSubtitle,
    email: commonRu.email,
    password: commonRu.password,
    passwordLabel: "Пароль",
    loginButton: "Войти",
    signupButton: "Регистрация",
    loading: commonRu.loading,
    invalidCredentials: "Неверный email или пароль",
    invalidEmail: "Неверный формат email",
    passwordRequired: "Введите пароль",
    nameRequired: "Введите имя",
    emailNotFound: "Аккаунт с этим email не найден. Перейдите на вкладку «Регистрация».",
    wrongPassword: "Неверный пароль",
    serverError: "Ошибка сервера, попробуйте позже",
    storageError:
      "Сервер не настроен. Подключите базу Redis в настройках Vercel.",
    networkError: "Ошибка сети, попробуйте позже",
    emailAlreadyRegistered: "Этот email уже зарегистрирован",
    passwordMinLength: "Пароль минимум 6 символов",
    emailInUse: "Email уже используется",
    namePlaceholder: "Ваше имя",
    targetGerman: "🇩🇪 Немецкий",
    targetEnglish: "🇬🇧 Английский",
    noAccount: commonRu.noAccount,
    haveAccount: commonRu.haveAccount,
    switchToSignup: "Регистрация",
    switchToLogin: "Войти",
    name: commonRu.name,
    createAccount: commonRu.createAccount,
  },

  leaderboard: {
    title: "Недельная лига",
    subtitle: "Все зарегистрированные · по общему XP",
    refresh: "Обновить",
    empty: "Пока нет зарегистрированных игроков.",
    you: "Вы",
    lessons: "уроков",
    totalXp: "всего XP",
  },

  feedback: {
    button: "Оставить отзыв",
    buttonShort: "Отзыв",
    title: "Оставить отзыв",
    placeholder: "Напишите ваш отзыв о приложении...",
    send: "Отправить",
    close: "Закрыть",
    thanks: "Спасибо! Отправлено.",
    error: "Не удалось отправить",
  },

  suggestion: {
    minWords: "Напишите минимум 100 слов",
    minWordsAlert:
      "Опишите предложение подробнее (минимум 100 слов).",
    wordCount: "слов",
    relogin: "Войдите снова",
  },

  pwa: {
    install: "Установить приложение",
    dismiss: "Позже",
  },

  profile: {
    currentPasswordRequired: "Введите текущий пароль",
    currentPassword: "Текущий пароль",
    saveFailed: "Не удалось сохранить",
    wrongPassword: "Неверный пароль",
    dayStreakSuffix: "дн. серия",
    newPasswordPlaceholder: "Новый пароль (оставьте пустым)",
    avatarUrl: "Avatar URL",
  },

  gamification: {
    achievement: "Достижение!",
    achievements: "Достижения",
    dismiss: "Закрыть",
    dailyGoal: "Дневная цель",
    dailyGoalMeta: "{minutes} мин · цель {target} XP",
    languagePair: "Языковая пара",
    review: "Повторение",
    lifehacks: "Лайфхаки",
    heartsEmpty: "Сердца закончились!",
    heartsSubtitle: "Пополните или подождите",
    heartsRefill: "Пополнить за {cost} XP",
    heartsRegen: "Каждое сердце восстанавливается за {minutes} мин",
    continue: "Продолжить",
    quizComplete: "Урок завершён!",
    quizScore: "{correct} / {total} верно",
    quizScoreLow: "Попробуйте снова",
    selectTranslation: "Выберите перевод",
    startQuiz: "Начать тест",
    back: "Назад",
    admin: "Админ",
    noUsers: "Пользователи не найдены",
    refresh: "Обновить",
    srsDue: "Сегодня {count} слов к повторению",
  },

  stats: {
    daySuffix: "дн.",
  },
};
