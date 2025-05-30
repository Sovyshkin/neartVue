// src/i18n/index.js
import { createI18n } from "vue-i18n";

const messages = {
  RU: {
    services: "Наши сервисы",
    business: "Готовый бизнес",
    equipment: "Оборудование",
    test: "Тест режим",
    login: "Авторизация",
    main: "Главная",
    block1_1:
      "Погрузитесь в мир майнинга Биткойна уже сегодня. Это проще чем кажется",
    block1_2:
      "Ознакомтесь с нашей системой майнинга биткойна получите пробный период по цене 31$ и сделайте правильный выбор",
    learn: "Ознакомиться",
    log_system: "Войти в систему",
    watch: "Смотреть на",
    day: "За день",
    month: "За месяц",
    year: "За год",
    desired_income: "Желаемый доход",
    begin: "Начать",
    beginToday: "Начни майнить уже сегодня",
    hash: "Хешрейт",
    dohod: "Доход",
    timeProfit: "Время окупаемости",
    months: "месяцев",
    hour: "час",
    monthOne: "месяц",
    dayOne: "день",
    rashod: "Расход",
    order: "Заказать",
    try: "Попробовать",
    wt: "Вт",
    testPeriod: "7-ми дневный пробный период с Antiminer T21",
    moveSlider: "Переместите слайдером деталь, чтобы сложить пазл",
    unsuccess: "Неудачно, попробуйте еще раз",
    didit: "Ты справился за",
    sec: "сек",
    resetPass: "Сбросить пароль",
    enterEmail: "Введите свою почту",
    linkReset: "Ссылка для сброса пароля отправлена по адресу",
    clickLink: "Пожалуйста, нажмите на ссылку в письме, чтобы продолжить.",
    ok: "Понятно",
    date: "Дата",
    type: "Тип",
    amountPayment: "Сумма платежа",
    status: "Статус",
    not_found: "Ничего",
    myPayments: "Мои платежи",
    myMiners: "Мои майнеры",
    income: "Прибыль",
    hosting: "Хостинг",
    not_foundMiners: "У вас нет активных майнеров",
    dashboard: "Дашборд",
    comeUpPass: "Придумайте новый пароль",
    enterNewPassword: "Введите новый пароль",
    newPass: "Новый пароль",
    enterNewPassAgain: "Введите пароль снова",
    passAgain: "Повторите пароль",
    save: "Cохранить",
    oops: "Упс... Что-то пошло не так",
    goBack: "Вернуться на главную",
    accruals: "Начисления и списания",
    balance: "Баланс",
    deposit: "Пополнить",
    withdraw: "Вывести",
    historyOperation: "История операций",
    cart: "Корзина",
    total: "Итого",
    choosePayment: "Выберите способ оплаты",
    placeOrder: "Оформить заказ",
    expectedProfit: "Ожидаемая прибыль",
    expectedIncome: "Ожидаемый доход",
    electricity: "Электричество",
    costHosting: "Cтоимость хостинга",
    dash: "Приборная панель",
    policy: "Политика конфиденциальности",
    offer: "Публичная оферта",
    applications: "Приложения",
    enterPass: "Введите пароль",
    pass: "Пароль",
    forgotPass: "Забыли пароль?",
    notRegister: "Ещё не зарегистрировались?",
    register: "Зарегистрироваться",
    confirmation: "Подтверждение",
    enterCode: "Введите код",
    emailCode: "Код из письма",
    adressPayment: "Адрес платежа",
    numberPayment: "Номер платежа",
    payment: "Платеж",
    back: "Назад",
    cancel: "Отменить",
    totalEarned: "Общая сумма заработанных активов",
    dailyIncome: "Ежедневный доход",
    monthlyIncome: "Ежемесячный доход",
    annualIncome: "Ежегодный доход",
    market: "Маркет",
    addCart: "Добавить в корзину",
    warning: "ВНИМАНИЕ! У вас есть неоплаченный заказ",
    goPay: "Перейти к оплате",
    profile: "Профиль",
    personalInfo: "Личная информация",
    walletPayments: "Кошелек для выплат",
    personalData: "Личные данные",
    changePhoto: "Изменить фото",
    individual: "Индивидуальный",
    bisnes: "Бизнес",
    typeProfile: "Тип профиля",
    enterName: "Введите имя",
    name: "Имя",
    enterSurname: "Введите фамилию",
    surname: "Фамилия",
    phone: "Телефон",
    country: "Страна",
    enterAddress: "Введите свой адрес",
    address: "Адрес",
    enterInn: "Введите ИНН",
    inn: "ИНН",
    enterTelegram: "Введите свой телеграм",
    refreshInfo: "Обновить информацию",
    exit: "Выйти",
    changePass: "Сменить пароль",
    oldPass: "Старый пароль",
    openGoogle: "Откройте приложение Google 2Fa",
    google2fa:
      "Введите текущий пароль от этой учетной записи, чтобы получить QR-код для Google 2Fa.",
    enterCurrentPass: "Введите текущий пароль",
    getQr: "Получить QR-code",
    confirCode2fa: "Подтвердите код Google 2Fa",
    enterCode2fa: "Введите ниже код 2Fa, сгенерированный приложением Google.",
    code2fa: "Код Google 2Fa из приложения",
    enable2fa: "Включить Google 2Fa",
    continue: "Продолжить",
    scanQr: "Отсканируйте QR-code",
    disable2fa: "Отлючить 2fa",
    currentWallet: "Текущий кошелек",
    wallet: "Кошелек",
    connectWallet: "Подключить кошелек",
    addWallet: "Добавить новый кошелек",
    newWallet: "Новый кошелек",
    add: "Добавить",
    registration: "Регистрация",
    purchaseEquipment: "Желаете приобрести оборудование оптом?",
    weAreTouch:
      "Мы на связи! Жмите на кнопку ниже, заполняйте форму и наш сотрудник перезвонит вам в удобное время.",
    feedback: "Обратная связь",
    readyBusiness: "Готовые бизнес модели",
    detailInfo1:
      "Данные рассчитываются в автоматическом режиме через платформу",
    detailInfo2:
      "с учетом стоимости электроэнергии 0.06$ за кВт⋅ч и цены биткоина.",
    investment: "Инвестиции",
    hostingCost: "Расходы на хостинг",
    returnInvest: "Возврат инвестиций",
    enterDesireIncome: "Укажите желаемый доход",
    profitCalc: "Калькулятор доходности",
    error: "Ошибка",
    addedCart: "Добавлено в корзину",
    other: "Другое",
    centerHelp: "Центр помощи",
    changingPhoto: "Изменение фото",
    uploadPhoto: "Загрузить фото",
    confirmAction: "Подтвердите действие",
    lowerSec: "Вы уверены, что хотите снизить уровень защиты профиля?",
    delete: "Удалить",
    cancelAction: "Отменить действие",
    sureDeleteWallet: "Вы действительно хотите удалить кошелёк:",
    deletionWallet: "Удаление кошелька",
    send: "Отправить",
    orderFeedback: "Заказать обратный звонок",
    needAccount: "Мы передадим вам майнер, но для этого вам нужен аккаунт",
    needRegister: "Чтобы совершить покупку зарегистрируйтесь",
    haveAccount: "Уже есть аккаунт?",
    TESTPeriod: "ТЕСТОВЫЙ ПЕРИОД 7 ДНЕЙ",
    stableConnect: "Стабильное подключение к электроэнергии и интернету",
    uptime: "Работаем круглосуточно",
    support: "Тех. поддержка",
    supportText: "Круглосуточное обслуживание оборудования",
    garant: "Гарантия",
    garantText: "Заводская гарантия на все оборудование",
    fastConnect: "Быстрое подключение",
    fastConnectText: "Быстрое подключение без ожидания доставки",
    control: "Удобное управление",
    controlText: "Управляйте с любой точки мира",
    usAdvantages: "Наши преимущества",
    createTicket: "Cоздать тикет",
    creationTicket: "Создание тикета",
    enterTheme: "Введите название темы",
    theme: "Тема",
    enterDesc: "Опишите вашу проблему",
    desc: "Описание",
    dateCreate: "Дата создания",
    timeCreate: "Время создания",
    enterText: "Введите сообщение...",
    myTickets: "Мои тикеты",
    ticket: "Тикет",
    closeTicket: "Закрыть тикет",
    enterNumberPayment: "Введите номер платежа",
    advantages: "Преимущества",
    information: "Информация",
    success: "Успешно",
    user_not_found: "Пользователь не найден",
    wrong_password: "Неправильный пароль",
    account_blocked: "Аккаунт заблокирован",
    wrongCode: "Неверный код",
    agreement: "Я согласен с пользовательским соглашением",
    checkbox_no: "Нет",
    checkbox_yes: "Да",
    connected2fa: "У вас подключен 2fa",
  },
};

const i18n = createI18n({
  locale: "RU",
  messages,
});

export default i18n;
