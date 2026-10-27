// Listings live in Supabase (see supabase/schema.sql). The publishable key is
// meant to be public: the database only allows reading visible listings.
const SUPABASE_URL = "https://dftaitxrrbihsmkinezq.supabase.co";
const SUPABASE_KEY = "sb_publishable_bNlpFrdOhFmab51drVpBCQ_PO7564tA";

// Launch area: Ealing Broadway
const DEFAULT_PLACE = { lat: 51.5149, lng: -0.3017, name: "Ealing Broadway", kind: "default" };
const QUICK_AREAS = [
  { name: "Ealing Broadway", lat: 51.5149, lng: -0.3017 },
  { name: "Acton", lat: 51.5081, lng: -0.2730 },
  { name: "Hanwell", lat: 51.5099, lng: -0.3367 },
  { name: "Chiswick", lat: 51.4924, lng: -0.2628 },
  { name: "Notting Hill", lat: 51.5136, lng: -0.2006 },
];

const RADII = [1, 3, 5, 10];
const AGES = [6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144]; // months; 6 = "under 1", 144 = "12+"
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const onWeekday = (l) => l.d.some((d) => WEEKDAYS.includes(d));

// "When" and "Type" in parents' words, mapped onto the stored schedule fields
const WHEN = {
  weekends: (l) => l.d.includes("Sat") || l.d.includes("Sun"),
  afterschool: (l) => onWeekday(l) && (l.tm.includes("Afternoon") || l.tm.includes("Evening")),
  mornings: (l) => onWeekday(l) && l.tm.includes("Morning"),
  holidays: (l) => l.f === "Holiday camp" || l.r === "Holidays" || l.r === "Both" || l.h === 1,
};
const TYPES = {
  weekendschool: (l) => l.f === "Weekend school",
  weekly: (l) => l.f === "Group class" || l.f === "After-school class",
  camps: (l) => l.f === "Holiday camp",
  nursery: (l) => l.f === "Preschool / nursery",
  events: (l) => l.f === "Workshop / event",
  online: (l) => l.on === 1,
};
// Ealing school holidays, from the council's calendar for community schools
// (egfl.org.uk/contact/term-and-holiday-dates; academies can differ by a day or two).
// Half terms are Mon–Fri only: weekend schools usually still meet on the weekends around them.
// Outside TERM_KNOWN we don't guess, so term-time classes aren't hidden. Add 2028/29 when published.
const TERM_KNOWN = { from: "2026-09-02", to: "2028-07-26" };
const SCHOOL_HOLIDAYS = [
  { from: "2026-10-26", to: "2026-10-30", k: "half" },
  { from: "2026-12-19", to: "2027-01-03", k: "xmas" },
  { from: "2027-02-15", to: "2027-02-19", k: "half" },
  { from: "2027-03-26", to: "2027-04-11", k: "easter" },
  { from: "2027-05-31", to: "2027-06-04", k: "half" },
  { from: "2027-07-28", to: "2027-08-31", k: "summer" },
  { from: "2027-10-25", to: "2027-10-29", k: "half" },
  { from: "2027-12-18", to: "2028-01-03", k: "xmas" },
  { from: "2028-02-14", to: "2028-02-18", k: "half" },
  { from: "2028-04-01", to: "2028-04-17", k: "easter" },
  { from: "2028-05-29", to: "2028-06-02", k: "half" },
];
const DATES = ["today", "tomorrow", "weekend"];

const CATEGORIES = ["Languages", "Sports / Dance", "Performing arts", "Arts / Crafts", "Chess", "STEM / Thinking",
  "Childcare / Preschool", "Outdoor / Nature", "Soft play", "Life skills", "Mixed", "Events / Parties"];
// One colour per activity, for the map pins and the dot on each card
const CAT_COLORS = {
  "Languages": "#7cc7ff", "Sports / Dance": "#6ee7a8", "Performing arts": "#c9a2ff", "Arts / Crafts": "#ff9bc9",
  "Chess": "#a5b4fc", "STEM / Thinking": "#67e8f9", "Childcare / Preschool": "#ffe27a", "Outdoor / Nature": "#5eead4",
  "Soft play": "#fb923c", "Life skills": "#fca5a5", "Mixed": "#ffb86b", "Events / Parties": "#ff9bc9",
};
const catColor = (c) => CAT_COLORS[c] || "#a3adc2";

// "Add a class" form choices, mapped onto the stored fields.
// "Something else" is stored as Mixed, which the database holds back for an admin to check.
const ADD_CATS = ["Languages", "Sports / Dance", "Performing arts", "Arts / Crafts", "STEM / Thinking", "Chess",
  "Outdoor / Nature", "Soft play", "Childcare / Preschool", "Mixed"];
const ADD_KINDS = { weekly: "Group class", oneoff: "Workshop / event", camp: "Holiday camp", nursery: "Preschool / nursery" };
const ADD_RUNS = { term: "Term time", year: "Year-round", hols: "Holidays" };
const AGE_FROM = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16];
const AGE_TO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 99]; // 99 = no upper age
const REASONS = ["gone", "wrong", "private", "notkids", "spam"];
const DAY_MS = 864e5;

// App text. Only English is offered for now; the Russian set is kept for when
// the app gets a language choice again (state.ui picks the set).
const STRINGS = {
  en: {
    age: "Age", under1: "Under 1", ageGroup: "Child’s age. Two kids? Tap both ages",
    filters: "Filters", quick: "Quick filters", language: "Language", activity: "Activity", type: "Type", distance: "Distance",
    includeOnline: "Include online classes",
    where: "Where to look", nearMe: "Near me", useMyLocation: "Use my location", locating: "Finding your location…",
    blocked: "Location is blocked. Allow it in your browser settings, or search an area.",
    locFail: "Couldn’t get your location. Search an area instead.",
    searchArea: "Area, town or postcode", go: "Go", searching: "Looking it up…", notFound: (q) => `Couldn’t find “${q}”.`,
    quickAreas: "Popular areas", reset: "Reset", clearAll: "Clear all", close: "Close",
    nearby: (n) => `${n} nearby`, plusOnline: (n) => ` + ${n} online`, fullList: "Full list", showMap: "Show map",
    within: (r) => `within ${r}`,
    show: (n) => (n ? `Show ${classes(n)}` : "No matches yet"),
    loading: "Loading classes…", loadError: "Could not load classes. Check your connection.",
    notConfirmed: "Not yet confirmed", online: "Online", holidayClub: "Holiday club", suitsBoth: "Suits both", suitsAll: "Suits all",
    dWhen: "When", dPrice: "Price", dWhere: "Where", priceUnknown: "Not listed yet", areaOnly: "exact venue not listed yet",
    parents: "What parents say", good: "Good", watch: "Watch out",
    noSource: "No official source", website: "Official website", directions: "Directions",
    lighter: "Faded pins: area only, no exact address", nothing: "Nothing matches these filters.", agesNA: "Ages not listed",
    tryWeekend: "Try this weekend", onlineToo: (n) => `${classes(n)} online too`, showWord: "Show", hideWord: "Hide",
    widenText: (n, r) => (n ? `Only ${classes(n)} within ${r} km.` : `Nothing within ${r} km yet.`),
    widenCta: (r, extra) => `Show within ${r} km (+${extra})`,
    and: " & ",
    date: { today: "Today", tomorrow: "Tomorrow", weekend: "This weekend" },
    hol: { half: "half term", xmas: "the Christmas holidays", easter: "the Easter holidays", summer: "the summer holidays" },
    holNote: (h, range) => `Ealing schools are off for ${h} (${range}). Term-time classes are hidden; holiday clubs are shown.`,
    noDays: (n) => `${n === 1 ? "1 more class nearby doesn’t" : `${n} more classes nearby don’t`} list their days. Check their websites.`,
    w: { weekends: "Weekends", afterschool: "After school", mornings: "Weekday mornings", holidays: "School holidays" },
    ty: { weekendschool: "Weekend schools", weekly: "Weekly classes", camps: "Holiday camps", nursery: "Nursery", events: "Events", online: "Online" },
    cat: { "Languages": "Languages", "Sports / Dance": "Sport & dance", "Performing arts": "Music & theatre", "Arts / Crafts": "Arts & crafts",
      "Chess": "Chess", "STEM / Thinking": "Science & thinking", "Childcare / Preschool": "Nursery", "Outdoor / Nature": "Outdoors",
      "Soft play": "Soft play", "Life skills": "Life skills", "Mixed": "Clubs", "Events / Parties": "Events & parties" },
    lang: { Russian: "Russian", English: "English" },
    day: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },

    addClass: "Add a class", signIn: "Sign in", signedInAs: (e) => `Signed in as ${e}`, signOut: "Sign out",
    signInWhy: "Sign in to add or confirm classes. Looking at the map never needs an account.",
    google: "Continue with Google", email: "Your email", sendCode: "Email me a sign-in code", sending: "Sending…",
    codeSent: (e) => `We’ve emailed a sign-in link to ${e}. Open the email on this phone and tap the link.`,
    codeInstead: "If the email has a code instead, type it here.",
    code: "Code from the email", verify: "Sign in", checking: "Checking…", otherEmail: "Use a different email",
    badEmail: "That email doesn’t look right.",
    step: (n, title) => `Step ${n} of 4 · ${title}`,
    steps: ["", "What is it?", "Who is it for?", "Where and when?", "Last check"],
    next: "Next", back: "Back", addToMap: "Add to map", adding: "Adding…", optional: "(optional)",
    fName: "Name of the class", fNameHint: "e.g. Toddler football",
    fOrg: "Who runs it?", fOrgHint: "e.g. Little Kickers Ealing",
    fOrgHelp: "A club, school, nursery or venue. Private tutors can’t be listed yet.",
    fLink: "Official website or page", fLinkHint: "Website, Instagram or Facebook page",
    fLinkHelp: "Parents trust listings with a link. Without one, it shows “No official source”.",
    fKind: "How does it run?", kind: { weekly: "Weekly class", oneoff: "One-off event", camp: "Holiday camp", nursery: "Nursery" },
    fCat: "Activity", fOtherCat: "We check “Something else” before it goes on the map.",
    addCat: { "Languages": "Languages", "Sports / Dance": "Sport & dance", "Performing arts": "Music & theatre",
      "Arts / Crafts": "Arts & crafts", "STEM / Thinking": "Science & thinking", "Chess": "Chess",
      "Outdoor / Nature": "Outdoors", "Soft play": "Soft play", "Childcare / Preschool": "Childcare", "Mixed": "Something else" },
    fAges: "Ages", ageFrom: "From…", ageTo: "To…", youngest: "Youngest age", oldest: "Oldest age", birth: "Birth", noUpper: "No upper age",
    fLangs: "Taught in", otherLang: "Other…", otherLangHint: "Which language?",
    fWhere: "Where", inPerson: "In person",
    fVenue: "Venue name", fVenueHint: "e.g. St Mary’s Church Hall", fAddress: "Address", fAddressHint: "e.g. 12 The Grove, Ealing",
    fPostcode: "Postcode", fPostcodeHint: "e.g. W5 5JY",
    fPostcodeHelp: "Puts the pin on the map. Parents see the full address and get directions to it.",
    fDays: "Days", fRuns: "Runs", runs: { term: "Term time", year: "All year", hols: "School holidays" },
    fDate: "Date", fDates: "Dates", firstDay: "First day", lastDay: "Last day",
    fDatesHelp: "Leave empty if it runs in every school holiday.",
    fTime: "Time", startsAt: "Starts at", endsAt: "Ends at",
    fPrice: "Price", price: { free: "Free", paid: "Paid", unsure: "Not sure" }, fPriceHint: "e.g. £12 a session", howMuch: "How much?",
    fNote: "Anything parents should know?", fNoteHint: "e.g. Drop in, no booking. First session free.",
    fPreview: "How parents will see it", fresh: "New", agesUnknown: "Ages ?",
    tickOrg: "It’s run by an organisation, school, club or business, not a private individual.",
    tickTrue: "As far as I know, these details are right.",
    stillNeeded: (list) => `Still needed: ${list}.`,
    need: { name: "the name", org: "who runs it", kind: "how it runs", cat: "the activity", ages: "the ages",
      agesOrder: "ages the right way round", lang: "the language", otherLang: "which other language",
      address: "the address", postcode: "the postcode", postcodeFull: "a full postcode, like W5 5JY",
      date: "the date", days: "the days", price: "the price", priceText: "how much it costs", ticks: "both ticks" },
    postcodeNotFound: "We couldn’t find that postcode. Check it and try again.",
    doneTitle: "It’s on the map!",
    doneText: "Parents can see it now, marked “Not yet confirmed”. When another parent confirms it, it becomes confirmed.",
    pendingTitle: "Thanks! We’ll check it first",
    pendingText: "Classes marked “Something else” are checked before they appear, usually within a day.",
    seeIt: "See it on the map", done: "Done", addAnother: "Add another class",
    failed: (m) => `That didn’t work: ${m}`,
    addedBy: (ago) => `Added by a parent · ${ago}`, needsRecheck: "Needs re-checking",
    checked: (date, how) => `Last checked ${date}${how ? ` · ${how}` : ""}`,
    checkedHow: { parent: "confirmed by a parent", web: "on the organiser’s website" },
    recheckHint: "Not checked for over 3 months. If you know it’s still running, please confirm.", today: "today", yesterday: "yesterday", daysAgo: (n) => `${n} days ago`,
    knowIt: "Do you know this class?",
    knowItText: "If you’ve been, or know it runs, confirm it. One confirmation from another parent is enough.",
    yesReal: "Yes, it’s real", wrong: "Something’s wrong", reportLink: "Something wrong with this listing?",
    whatsWrong: "What’s wrong?", reportNote: "Anything to add? (optional)", sendReport: "Send report", cancel: "Cancel",
    reason: { gone: "It doesn’t run any more", wrong: "Details are wrong", private: "Run by a private individual",
      notkids: "Not for children", spam: "Spam or fake" },
    youAdded: "You added this. When another parent confirms it, it shows as confirmed.",
    youConfirmed: "You confirmed this. Thank you!",
    youReported: "Thanks, we’ve noted it. If another parent reports it too, it’s hidden until we’ve checked it.",
    notAllowed: "You can’t do that for this class right now. You may already have done it recently.",
    askSeen: (day) => `You looked this up on ${day}`, askTitle: (title) => `Did you go to ${title}?`,
    askYes: "Yes, it was as listed", askDiff: "Something was different", askNo: "We didn’t go",
    nudge: (n) => (n === 1 ? "1 new class near you isn’t confirmed yet." : `${n} new classes near you aren’t confirmed yet.`),
    knowThem: "Know them?", showAll: "Show all", caughtUp: "All caught up. Thank you!",
    pickReason: "Pick what’s wrong first.", andList: " and ", here: (n) => `${classes(n)} here`,
  },
  ru: {
    age: "Возраст", under1: "До 1", ageGroup: "Возраст ребёнка. Двое детей? Выберите оба",
    filters: "Фильтры", quick: "Быстрые фильтры", language: "Язык", activity: "Направление", type: "Тип", distance: "Расстояние",
    includeOnline: "Показывать онлайн-занятия",
    where: "Где искать", nearMe: "Рядом со мной", useMyLocation: "Определить моё местоположение", locating: "Определяем местоположение…",
    blocked: "Доступ к геолокации запрещён. Разрешите его в настройках браузера или найдите район.",
    locFail: "Не удалось определить местоположение. Найдите район.",
    searchArea: "Район, город или индекс", go: "Найти", searching: "Ищем…", notFound: (q) => `Не нашли «${q}».`,
    quickAreas: "Популярные районы", reset: "Сбросить", clearAll: "Сбросить всё", close: "Закрыть",
    nearby: (n) => `${n} рядом`, plusOnline: (n) => ` + ${n} онлайн`, fullList: "Весь список", showMap: "Показать карту",
    within: (r) => `в радиусе ${r}`,
    show: (n) => (n ? `Показать ${classes(n)}` : "Ничего не найдено"),
    loading: "Загружаем занятия…", loadError: "Не удалось загрузить занятия. Проверьте интернет.",
    notConfirmed: "Пока не подтверждено", online: "Онлайн", holidayClub: "Лагерь на каникулах", suitsBoth: "Подходит обоим", suitsAll: "Подходит всем",
    dWhen: "Когда", dPrice: "Цена", dWhere: "Где", priceUnknown: "Пока не указана", areaOnly: "точный адрес пока не указан",
    parents: "Что говорят родители", good: "Плюсы", watch: "Минусы",
    noSource: "Нет официального источника", website: "Официальный сайт", directions: "Маршрут",
    lighter: "Бледные метки: только район, без точного адреса", nothing: "По этим фильтрам ничего нет.", agesNA: "Возраст не указан",
    tryWeekend: "Попробовать выходные", onlineToo: (n) => `Ещё онлайн: ${classes(n)}`, showWord: "Показать", hideWord: "Скрыть",
    widenText: (n, r) => (n ? `В радиусе ${r} км — только ${classes(n)}.` : `В радиусе ${r} км пока ничего нет.`),
    widenCta: (r, extra) => `Показать в радиусе ${r} км (+${extra})`,
    and: " и ",
    date: { today: "Сегодня", tomorrow: "Завтра", weekend: "Эти выходные" },
    hol: { half: "короткие каникулы", xmas: "рождественские каникулы", easter: "пасхальные каникулы", summer: "летние каникулы" },
    holNote: (h, range) => `В школах Илинга ${h} (${range}). Занятия только в учебное время скрыты, каникулярные клубы показаны.`,
    noDays: (n) => `Ещё ${n} ${ruForm(n, "занятие рядом не указывает", "занятия рядом не указывают", "занятий рядом не указывают")} дни. Проверьте на их сайтах.`,
    w: { weekends: "Выходные", afterschool: "После школы", mornings: "Будни, утро", holidays: "Каникулы" },
    ty: { weekendschool: "Школы выходного дня", weekly: "Кружки и секции", camps: "Лагеря", nursery: "Детский сад", events: "Мероприятия", online: "Онлайн" },
    cat: { "Languages": "Языки", "Sports / Dance": "Спорт и танцы", "Performing arts": "Музыка и театр", "Arts / Crafts": "Творчество",
      "Chess": "Шахматы", "STEM / Thinking": "Наука и мышление", "Childcare / Preschool": "Детский сад", "Outdoor / Nature": "На природе",
      "Soft play": "Игровые комнаты", "Life skills": "Навыки для жизни", "Mixed": "Кружки", "Events / Parties": "Праздники и события" },
    lang: { Russian: "Русский", English: "Английский" },
    day: { Mon: "Пн", Tue: "Вт", Wed: "Ср", Thu: "Чт", Fri: "Пт", Sat: "Сб", Sun: "Вс" },

    addClass: "Добавить занятие", signIn: "Войти", signedInAs: (e) => `Вы вошли как ${e}`, signOut: "Выйти",
    signInWhy: "Войдите, чтобы добавлять или подтверждать занятия. Смотреть карту можно без входа.",
    google: "Войти через Google", email: "Ваш email", sendCode: "Прислать код для входа", sending: "Отправляем…",
    codeSent: (e) => `Мы отправили ссылку для входа на ${e}. Откройте письмо на этом телефоне и нажмите на ссылку.`,
    codeInstead: "Если в письме код, введите его здесь.",
    code: "Код из письма", verify: "Войти", checking: "Проверяем…", otherEmail: "Другой email",
    badEmail: "Похоже, в email ошибка.",
    step: (n, title) => `Шаг ${n} из 4 · ${title}`,
    steps: ["", "Что это?", "Для кого?", "Где и когда?", "Проверка"],
    next: "Дальше", back: "Назад", addToMap: "Добавить на карту", adding: "Добавляем…", optional: "(необязательно)",
    fName: "Название занятия", fNameHint: "например, Футбол для малышей",
    fOrg: "Кто проводит?", fOrgHint: "например, Little Kickers Ealing",
    fOrgHelp: "Клуб, школа, детский сад или площадка. Частных преподавателей пока не добавляем.",
    fLink: "Официальный сайт или страница", fLinkHint: "Сайт, Instagram или страница в Facebook",
    fLinkHelp: "Родители больше доверяют занятиям со ссылкой. Без неё будет пометка «Нет официального источника».",
    fKind: "Как проходит?", kind: { weekly: "Каждую неделю", oneoff: "Разовое событие", camp: "Лагерь на каникулах", nursery: "Детский сад" },
    fCat: "Направление", fOtherCat: "«Другое» мы проверяем, прежде чем показать на карте.",
    addCat: { "Languages": "Языки", "Sports / Dance": "Спорт и танцы", "Performing arts": "Музыка и театр",
      "Arts / Crafts": "Творчество", "STEM / Thinking": "Наука и мышление", "Chess": "Шахматы",
      "Outdoor / Nature": "На природе", "Soft play": "Игровые комнаты", "Childcare / Preschool": "Присмотр за детьми", "Mixed": "Другое" },
    fAges: "Возраст", ageFrom: "От…", ageTo: "До…", youngest: "Младший возраст", oldest: "Старший возраст", birth: "С рождения", noUpper: "Без ограничения",
    fLangs: "Язык занятий", otherLang: "Другой…", otherLangHint: "Какой язык?",
    fWhere: "Где", inPerson: "Очно",
    fVenue: "Название места", fVenueHint: "например, St Mary’s Church Hall", fAddress: "Адрес", fAddressHint: "например, 12 The Grove, Ealing",
    fPostcode: "Индекс", fPostcodeHint: "например, W5 5JY",
    fPostcodeHelp: "По индексу ставим метку на карте. Родители видят полный адрес и могут построить маршрут.",
    fDays: "Дни", fRuns: "Проходит", runs: { term: "В учебное время", year: "Весь год", hols: "На каникулах" },
    fDate: "Дата", fDates: "Даты", firstDay: "Первый день", lastDay: "Последний день",
    fDatesHelp: "Оставьте пустым, если лагерь работает на всех каникулах.",
    fTime: "Время", startsAt: "Начало", endsAt: "Конец",
    fPrice: "Цена", price: { free: "Бесплатно", paid: "Платно", unsure: "Не знаю" }, fPriceHint: "например, £12 за занятие", howMuch: "Сколько?",
    fNote: "Что ещё стоит знать родителям?", fNoteHint: "например, Без записи. Первое занятие бесплатно.",
    fPreview: "Так это увидят родители", fresh: "Новое", agesUnknown: "Возраст ?",
    tickOrg: "Занятие проводит организация, школа, клуб или компания, а не частное лицо.",
    tickTrue: "Насколько я знаю, всё указано верно.",
    stillNeeded: (list) => `Ещё нужно: ${list}.`,
    need: { name: "название", org: "кто проводит", kind: "как проходит", cat: "направление", ages: "возраст",
      agesOrder: "возраст по порядку", lang: "язык", otherLang: "какой другой язык",
      address: "адрес", postcode: "индекс", postcodeFull: "полный индекс, например W5 5JY",
      date: "дата", days: "дни", price: "цена", priceText: "сколько стоит", ticks: "обе галочки" },
    postcodeNotFound: "Не нашли такой индекс. Проверьте и попробуйте снова.",
    doneTitle: "Занятие на карте!",
    doneText: "Родители уже видят его с пометкой «Пока не подтверждено». Когда другой родитель подтвердит, пометка исчезнет.",
    pendingTitle: "Спасибо! Сначала проверим",
    pendingText: "Занятия из раздела «Другое» мы проверяем перед публикацией, обычно в течение дня.",
    seeIt: "Показать на карте", done: "Готово", addAnother: "Добавить ещё",
    failed: (m) => `Не получилось: ${m}`,
    addedBy: (ago) => `Добавил родитель · ${ago}`, needsRecheck: "Нужно перепроверить",
    checked: (date, how) => `Проверено ${date}${how ? ` · ${how}` : ""}`,
    checkedHow: { parent: "подтвердил родитель", web: "на сайте организатора" },
    recheckHint: "Не проверялось больше 3 месяцев. Если знаете, что занятие идёт, подтвердите.", today: "сегодня", yesterday: "вчера",
    daysAgo: (n) => `${n} ${ruForm(n, "день", "дня", "дней")} назад`,
    knowIt: "Вы знаете это занятие?",
    knowItText: "Если вы были там или знаете, что оно проходит, подтвердите. Достаточно одного подтверждения другого родителя.",
    yesReal: "Да, всё так", wrong: "Что-то не так", reportLink: "Что-то не так с этим занятием?",
    whatsWrong: "Что не так?", reportNote: "Что-нибудь добавить? (необязательно)", sendReport: "Отправить", cancel: "Отмена",
    reason: { gone: "Больше не проходит", wrong: "Неверные данные", private: "Проводит частное лицо",
      notkids: "Не для детей", spam: "Спам или обман" },
    youAdded: "Вы добавили это занятие. Когда другой родитель подтвердит его, пометка исчезнет.",
    youConfirmed: "Вы подтвердили это занятие. Спасибо!",
    youReported: "Спасибо, мы учли. Если ещё кто-то пожалуется, занятие скроем до проверки.",
    notAllowed: "Сейчас это сделать нельзя. Возможно, вы уже делали это недавно.",
    askSeen: (day) => `Вы смотрели это занятие: ${day}`, askTitle: (title) => `Вы ходили на «${title}»?`,
    askYes: "Да, всё как указано", askDiff: "Кое-что не так", askNo: "Мы не ходили",
    nudge: (n) => `${n} ${ruForm(n, "новое занятие рядом ещё не подтверждено", "новых занятия рядом ещё не подтверждены", "новых занятий рядом ещё не подтверждены")}.`,
    knowThem: "Знаете их?", showAll: "Показать все", caughtUp: "Всё подтверждено. Спасибо!",
    pickReason: "Сначала выберите, что не так.", andList: " и ", here: (n) => `Здесь ${classes(n)}`,
  },
};

const ICON = {
  pin: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
  chevron: '<svg class="i" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  sliders: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>',
  close: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  locate: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  external: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
  directions: '<svg class="i" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>',
  plus: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
  minus: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>',
  add: '<svg class="i" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  tick: '<svg class="i" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  check: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  mail: '<svg class="i" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>',
};

const state = {
  ui: "en", ages: [], radius: 3, langs: [], date: null, when: [], types: [], cats: [],
  showOnline: false, expanded: false, sheet: null, detail: null,
  place: { ...DEFAULT_PLACE }, placeStatus: "", placeWarn: false,
  items: [], loaded: false, error: false,
  // Accounts and community checks
  user: null, google: false, mine: { confirmed: {}, reported: {} },
  auth: null, afterSignIn: null, add: null, box: null, onlyNew: false,
  group: null, // classes behind a tapped map bubble
};

let map, markersLayer, pinsLayer;
let lastNearby = []; // what the pins show, so they can be regrouped after zooming
let fittedFor = ""; // place + distance the map was last framed for

// Sign-in and anything a parent adds go through supabase-js (vendor/supabase).
// Reading listings stays a plain fetch, so the map works even if this fails to load.
const sb = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  : null;

function $(id) { return document.getElementById(id); }
function T() { return STRINGS[state.ui]; }
function isRu() { return state.ui === "ru"; }

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- Remembered choices (per phone; the app works fine without them) ----

const PREFS_KEY = "aroundnow-prefs";
function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    if (Array.isArray(p.ages)) state.ages = p.ages.filter((a) => AGES.includes(a));
    if (Array.isArray(p.langs)) state.langs = p.langs.filter((x) => typeof x === "string");
    if (RADII.includes(p.radius)) state.radius = p.radius;
  } catch (e) { /* storage unavailable */ }
}
function savePrefs() {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ages: state.ages, langs: state.langs, radius: state.radius }));
  } catch (e) { /* storage unavailable */ }
}

// ---- Data ----

// PostgREST returns PostGIS points as hex EWKB: byte order, type (+SRID flag), [SRID], x, y
function parsePoint(loc) {
  if (!loc) return null;
  if (typeof loc === "object" && Array.isArray(loc.coordinates)) return { x: loc.coordinates[0], y: loc.coordinates[1] };
  if (typeof loc !== "string" || loc.length < 42) return null;
  const bytes = new Uint8Array(loc.match(/../g).map((h) => parseInt(h, 16)));
  const view = new DataView(bytes.buffer);
  const le = bytes[0] === 1;
  const offset = view.getUint32(1, le) & 0x20000000 ? 9 : 5;
  return { x: view.getFloat64(offset, le), y: view.getFloat64(offset + 8, le) };
}

function shortPrice(p) {
  if (!p) return "";
  if (/^free\b/i.test(p)) return isRu() ? "Бесплатно" : "Free";
  const m = p.match(/£\s?\d+(?:\.\d+)?(?:\s?[–-]\s?£?\d+)?/);
  if (!m) return "";
  return (/^(approx|about)/i.test(p) ? "~" : "") + m[0].replace(/\s/g, "");
}

function normalize(r) {
  const pt = parsePoint(r.location);
  const online = r.delivery_mode === "Online";
  if (!online && !pt) return null; // nowhere to show it yet
  let langs = r.languages || [];
  if (langs.includes("Bilingual")) {
    langs = [...new Set(langs.filter((x) => x !== "Bilingual").concat(["Russian", "English"]))];
  }
  return {
    i: r.id, t: r.title, a: online ? "Online" : r.location_area || "", y: pt ? pt.y : null, x: pt ? pt.x : null,
    ap: (r.address_source || "").startsWith("Approximate") ? 1 : 0, on: online ? 1 : 0,
    mn: r.age_min_months, mx: r.age_max_months, l: langs, d: r.days_of_week || [], tm: r.time_of_day || [],
    st: (r.start_time || "").slice(0, 5), et: (r.end_time || "").slice(0, 5), f: r.format || "", c: r.category || "", r: r.runs_when || "",
    h: r.holiday_club ? 1 : 0, s: r.schedule_text || "", p: r.price_text || "", ds: r.description || "",
    g: r.pros || "", b: r.cons || "", w: r.website || "", k: r.status === "Check" ? 1 : 0,
    ad: [r.address, r.postcode].filter(Boolean).join(", "),
    ca: r.created_at || "", lc: r.last_confirmed_at || "", cb: r.created_by || "", src: r.source || "",
    ed: r.event_date || "", ee: r.event_end_date || "",
  };
}

async function loadListings() {
  const cols = ["id", "title", "website", "delivery_mode", "location_area", "address", "postcode", "location", "address_source",
    "format", "category", "age_min_months", "age_max_months", "languages", "runs_when", "holiday_club", "days_of_week",
    "time_of_day", "start_time", "end_time", "schedule_text", "price_text", "description", "pros", "cons", "status",
    "created_at", "last_confirmed_at", "created_by", "source", "event_date", "event_end_date"].join(",");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/listings?select=${cols}&status=in.(Active,Check)`, {
      headers: { apikey: SUPABASE_KEY },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    state.items = (await res.json()).map(normalize).filter((l) => l && !expired(l));
    state.error = false;
  } catch (e) {
    console.warn("Load error", e);
    state.error = true;
  }
  state.loaded = true;
  render({ keepScroll: true });
}

// ---- Confirmation status (brief 7.2–7.4) ----
// Confirmed means another parent said "yes, it's real" in the last 90 days.
// After 120 days with no confirmation, or once a dated event is over, a listing is hidden (not deleted).

function unconfirmed(l) {
  return l.k === 1 || stale(l);
}
// Nobody has checked it for 90 days (a parent's confirmation, or when it was added or researched)
function stale(l) {
  const since = Date.parse(l.lc || l.ca || "");
  return !!since && Date.now() - since > 90 * DAY_MS;
}
function statusTag(l) {
  return `<span class="tag warn">${stale(l) ? T().needsRecheck : T().notConfirmed}</span>`;
}
// "Last checked 27 Oct 2026 · on the organiser's website"
function checkedText(l) {
  const t = T(), at = l.lc || l.ca;
  if (!at) return "";
  const date = new Date(at).toLocaleDateString(isRu() ? "ru-RU" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const how = l.lc && !l.k ? t.checkedHow.parent : l.src.startsWith("Web research") ? t.checkedHow.web : "";
  return t.checked(date, how);
}
function expired(l) {
  const end = l.ee || l.ed;
  if (end && end < isoDate(new Date())) return true;
  const since = Date.parse(l.lc || l.ca || "");
  return !!since && Date.now() - since > 120 * DAY_MS;
}
function mineAdded(l) { return !!(state.user && l.cb === state.user.id); }
// New community classes nobody has vouched for yet, which the list gently asks about
function needsYou(l) {
  return l.src === "Community" && unconfirmed(l) && Date.now() - Date.parse(l.ca || "") < 30 * DAY_MS
    && !mineAdded(l) && !state.mine.confirmed[l.i] && !state.mine.reported[l.i];
}

// ---- Filtering ----

function distKm(p, l) {
  const kx = 111.32 * Math.cos((p.lat * Math.PI) / 180);
  const dx = (l.x - p.lng) * kx;
  const dy = (l.y - p.lat) * 110.57;
  return Math.sqrt(dx * dx + dy * dy);
}

function fitsAge(l, a) { return (l.mn == null || l.mn <= a) && (l.mx == null || l.mx >= a); }

// ---- Dates ----
// Listings store a weekly pattern (days + term time / holidays), not dates,
// so "today" means: runs on today's weekday, and today is in term if it's term-time only.

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayKey(d) { return DAY_ORDER[(d.getDay() + 6) % 7]; }

function datesFor(key) {
  const now = new Date();
  const at = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + n);
  if (key === "today") return [at(0)];
  if (key === "tomorrow") return [at(1)];
  const dow = now.getDay(); // 0 = Sunday
  if (dow === 6) return [at(0), at(1)];
  if (dow === 0) return [at(0)];
  return [at(6 - dow), at(7 - dow)];
}

function schoolHoliday(d) {
  const iso = isoDate(d);
  return SCHOOL_HOLIDAYS.find((h) => h.from <= iso && iso <= h.to) || null;
}
// "term", "holiday", or null when we don't know the school calendar for that date
function termOn(d) {
  const iso = isoDate(d);
  if (iso < TERM_KNOWN.from || iso > TERM_KNOWN.to) return null;
  return schoolHoliday(d) ? "holiday" : "term";
}

// "regular", "club" (holiday club on a school-holiday weekday), or "" if not on that day
function runsOn(l, d) {
  const day = dayKey(d), term = termOn(d);
  if (regularOn(l, d, day, term)) return "regular";
  if (term === "holiday" && WEEKDAYS.includes(day) && (l.f === "Holiday camp" || l.h)) return "club";
  return "";
}
function regularOn(l, d, day, term) {
  // One-off events and dated camps run on their dates, whatever the school calendar says
  if (l.ed) return isoDate(d) >= l.ed && isoDate(d) <= (l.ee || l.ed) && !endedToday(l, d);
  const days = l.d.length ? l.d : (l.f === "Preschool / nursery" || l.f === "Holiday camp" ? WEEKDAYS : []);
  if (!days.includes(day)) return false;
  if (l.r === "Term time" && term === "holiday") return false;
  if ((l.r === "Holidays" || l.f === "Holiday camp") && term === "term") return false;
  return !endedToday(l, d);
}
function endedToday(l, d) {
  if (isoDate(d) !== isoDate(new Date()) || !l.et) return false;
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` >= l.et;
}
function onDates(l, dates) { return dates.some((d) => runsOn(l, d)); }
function hasDays(l) { return l.d.length > 0 || !!l.ed || l.f === "Preschool / nursery" || l.f === "Holiday camp"; }

// `skip` leaves one filter group out, which is how a chip knows whether it would find anything
function passes(l, skip) {
  const s = state;
  if (skip !== "ages" && s.ages.length && !s.ages.some((a) => fitsAge(l, a))) return false;
  if (skip !== "langs" && s.langs.length && !s.langs.some((x) => l.l.includes(x))) return false;
  if (skip !== "date" && s.date && !onDates(l, datesFor(s.date))) return false;
  if (skip !== "when" && s.when.length && !s.when.some((w) => WHEN[w](l))) return false;
  if (skip !== "types" && s.types.length && !s.types.some((t) => TYPES[t](l))) return false;
  if (skip !== "cats" && s.cats.length && !s.cats.includes(l.c)) return false;
  return true;
}

function compute() {
  const rows = state.items.map((l) => ({ l, d: l.on ? null : distKm(state.place, l) }));
  const inPerson = rows.filter((o) => !o.l.on);
  const pool = inPerson.filter((o) => o.d <= state.radius);
  const matching = pool.filter((o) => passes(o.l)).sort((a, b) => a.d - b.d);
  // "Know them?" narrows the list to new classes waiting for a confirmation
  const fresh = matching.filter((o) => needsYou(o.l));
  const nearby = state.onlyNew ? fresh : matching;
  const onlineAll = rows.filter((o) => o.l.on);
  const online = onlineAll.filter((o) => passes(o.l));
  const showOnline = state.showOnline || state.types.includes("online");
  return { rows, inPerson, pool, nearby, fresh, onlineAll, online, showOnline, shown: showOnline ? nearby.concat(online) : nearby };
}

// Would anything nearby show up if this one choice in `group` were picked?
function finds(c, group, test) { return c.pool.some((o) => passes(o.l, group) && test(o.l)); }

// Languages actually offered nearby, most common first
function nearbyLangs(c) {
  const counts = {};
  c.pool.filter((o) => passes(o.l, "langs")).forEach((o) => o.l.l.forEach((x) => { counts[x] = (counts[x] || 0) + 1; }));
  state.langs.forEach((x) => { if (!(x in counts)) counts[x] = 0; });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map((x) => ({ x, n: counts[x] }));
}

// ---- Wording ----

function ruForm(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
function classes(n) {
  return isRu() ? `${n} ${ruForm(n, "занятие", "занятия", "занятий")}` : `${n} ${n === 1 ? "class" : "classes"}`;
}
function km(v) {
  const s = v < 10 ? v.toFixed(1) : String(Math.round(v));
  return isRu() ? `${s.replace(".", ",")} км` : `${s} km`;
}
function rLabel(r) { return isRu() ? `${r} км` : `${r} km`; }
function ageWord(m) { return m === 6 ? T().under1 : m === 144 ? "12+" : String(m / 12); }

function ageText(l) {
  const ru = isRu();
  const f = (m) => {
    if (m === 0) return "0";
    if (m < 12) return ru ? `${m} мес.` : `${m} mo`;
    const y = m / 12;
    if (Number.isInteger(y)) return String(y);
    if (m % 12 === 6) return ru ? `${Math.floor(y)},5` : `${Math.floor(y)}½`;
    return ru ? y.toFixed(1).replace(".", ",") : y.toFixed(1);
  };
  const { mn, mx } = l;
  if (mn == null && mx == null) return T().agesNA;
  // Baby classes read better in months: "0–13 mo"
  if (mx != null && mx < 24 && mx % 12) return ru ? `${mn || 0}–${mx} мес.` : `${mn || 0}–${mx} mo`;
  if (ru) {
    if (mn != null && mx != null) return `${f(mn)}–${f(mx)} ${ruForm(Math.floor(mx / 12), "год", "года", "лет")}`;
    if (mn != null) return `от ${f(mn)}${mn < 12 ? "" : mn === 12 ? " года" : " лет"}`;
    return `до ${f(mx)}${mx === 12 ? " года" : " лет"}`;
  }
  if (mn != null && mx != null) return `Ages ${f(mn)}–${f(mx)}`;
  if (mn != null) return `Ages ${f(mn)}+`;
  return `Up to ${f(mx)}`;
}

function daysText(days) {
  const L = T().day;
  const ds = DAY_ORDER.filter((d) => days.includes(d));
  if (!ds.length) return "";
  const idx = ds.map((d) => DAY_ORDER.indexOf(d));
  const run = idx.every((v, n) => n === 0 || v === idx[n - 1] + 1);
  if (ds.length >= 3 && run) return `${L[ds[0]]}–${L[ds[ds.length - 1]]}`;
  return ds.map((d) => L[d]).join(", ");
}

function whenText(l) {
  const d = l.ed ? eventDateText(l) : daysText(l.d);
  return d && l.st ? `${d} ${l.st}` : d;
}

// "Sat 31 Oct", or "Mon 26 – Fri 30 Oct" for events over several days
function eventDateText(l) {
  const f = (iso, o) => new Date(`${iso}T12:00`).toLocaleDateString(isRu() ? "ru-RU" : "en-GB", o);
  if (!l.ee || l.ee === l.ed) return f(l.ed, { weekday: "short", day: "numeric", month: "short" });
  const sameMonth = l.ed.slice(0, 7) === l.ee.slice(0, 7);
  return `${f(l.ed, sameMonth ? { weekday: "short", day: "numeric" } : { weekday: "short", day: "numeric", month: "short" })} – ${f(l.ee, { weekday: "short", day: "numeric", month: "short" })}`;
}

function langText(l) { return l.l.map((x) => T().lang[x] || x).join(T().and); }

function whereText(l, d) {
  if (l.on) return T().online;
  return `${l.a} · ${l.ap ? "~" : ""}${km(d)}`;
}

function rangeText(h) {
  const f = (iso) => new Date(`${iso}T12:00`).toLocaleDateString(isRu() ? "ru-RU" : "en-GB", { day: "numeric", month: "short" });
  return `${f(h.from)} – ${f(h.to)}`;
}

function placeName() { return state.place.kind === "me" ? T().nearMe : state.place.name; }

function ago(iso) {
  const t = T(), days = Math.floor((Date.now() - Date.parse(iso)) / DAY_MS);
  return days <= 0 ? t.today : days === 1 ? t.yesterday : t.daysAgo(days);
}

// "a, b and c"
function listWords(words) {
  return words.length > 1 ? `${words.slice(0, -1).join(", ")}${T().andList}${words[words.length - 1]}` : words[0] || "";
}

// ---- Rendering ----

function pressed(on) { return `aria-pressed="${on ? "true" : "false"}"`; }

// Every filter is the same chip. No counts on chips: one that would find nothing is just dimmed.
function chipHtml(act, v, label, on, zero, aria) {
  const dim = zero && !on && state.loaded ? " zero" : "";
  const name = aria ? ` aria-label="${esc(aria)}"` : "";
  return `<button type="button" class="chip${dim}" data-act="${act}" data-v="${esc(v)}" ${pressed(on)}${name}>${esc(label)}</button>`;
}

function renderTop() {
  const t = T(), btn = $("placeBtn");
  btn.innerHTML = `${ICON.pin}<span class="place-text"><span class="name">${esc(placeName())}</span><span class="km">${t.within(rLabel(state.radius))}</span></span>${ICON.chevron}`;
  btn.setAttribute("aria-label", `${t.where}: ${placeName()}, ${rLabel(state.radius)}`);
  $("addBtn").setAttribute("aria-label", t.addClass);
  $("addBtn").hidden = !sb;
  document.documentElement.lang = state.ui;
}

function renderFilters(c) {
  const s = state, t = T(), el = $("filters");
  const ages = AGES.map((a) => chipHtml("age", a, a === 6 ? "<1" : ageWord(a), s.ages.includes(a),
    !finds(c, "ages", (l) => fitsAge(l, a)), a === 6 ? t.under1 : "")).join("");
  // Rarely used filters live in the Filters sheet; its badge says how many are on
  const hidden = s.when.length + s.types.length + s.cats.length + (s.showOnline ? 1 : 0);
  const filtersBtn = `<button type="button" class="chip${hidden ? " active" : ""}" data-act="sheet" data-v="filters">${ICON.sliders}<span>${t.filters}</span>${hidden ? `<span class="badge">${hidden}</span>` : ""}</button>`;
  const dates = DATES.map((k) => {
    const ds = datesFor(k);
    return chipHtml("date", k, t.date[k], s.date === k, !finds(c, "date", (l) => onDates(l, ds)));
  }).join("");
  const langs = nearbyLangs(c).map(({ x, n }) => chipHtml("lang", x, t.lang[x] || x, s.langs.includes(x), n === 0)).join("");

  // Keep each row's sideways scroll, so tapping "9" doesn't jump the row back to the start
  const keep = [...el.querySelectorAll(".scroller")].map((r) => r.scrollLeft);
  el.innerHTML = `<div class="scroller" role="group" aria-label="${esc(t.ageGroup)}"><span class="scroller-label">${t.age}</span>${ages}</div>
    <div class="scroller" role="group" aria-label="${esc(t.quick)}">${filtersBtn}${dates}${langs}</div>`;
  el.querySelectorAll(".scroller").forEach((r, n) => { r.scrollLeft = keep[n] || 0; });
}

function renderHead(c) {
  const s = state, t = T();
  const extra = c.showOnline && c.online.length ? t.plusOnline(c.online.length) : "";
  $("countLabel").textContent = s.loaded && !s.error ? t.nearby(c.nearby.length) + extra : "";
}

function renderPanel() {
  $("panel").classList.toggle("expanded", state.expanded);
  $("panelBtn").textContent = state.expanded ? T().showMap : T().fullList;
}

function cardHtml(o, dates, multi) {
  const s = state, t = T(), l = o.l;
  // Matched only through its holiday club: the term-time days would mislead
  const club = dates && !dates.some((d) => runsOn(l, d) === "regular");
  const meta = [club ? "" : whenText(l), langText(l), shortPrice(l.p)].filter(Boolean).join(" · ");
  const tags = [`<span class="agetag">${esc(ageText(l))}</span>`];
  if (multi && (l.mn != null || l.mx != null) && s.ages.every((a) => fitsAge(l, a))) {
    tags.push(`<span class="tag">${s.ages.length === 2 ? t.suitsBoth : t.suitsAll}</span>`);
  }
  if ((club || s.when.includes("holidays")) && l.h && l.f !== "Holiday camp") tags.push(`<span class="tag">${t.holidayClub}</span>`);
  if (unconfirmed(l)) tags.push(statusTag(l));
  const where = [t.cat[l.c] || l.c, l.on ? "" : l.a].filter(Boolean).join(" · ");
  const dist = l.on ? t.online : `${l.ap ? "~" : ""}${km(o.d)}`;
  return `<button type="button" class="card" data-act="open" data-v="${esc(l.i)}">
    <span class="card-top"><span class="dot" style="background:${catColor(l.c)}"></span><span class="card-cat">${esc(where)}</span><span class="card-km">${esc(dist)}</span></span>
    <span class="card-title">${esc(l.t)}</span>
    ${meta ? `<span class="card-meta">${esc(meta)}</span>` : ""}
    <span class="tags">${tags.join("")}</span>
  </button>`;
}

function renderList(c) {
  const s = state, t = T(), list = $("list");
  if (!s.loaded) { list.innerHTML = `<div class="loading">${t.loading}</div>`; return; }
  if (s.error) { list.innerHTML = `<div class="loading">${t.loadError}</div>`; return; }

  let html = "";
  // One question at a time: "did you go?" first, otherwise a quiet line about new classes
  const ask = s.onlyNew ? null : pendingAsk();
  if (ask) html += askHtml(ask);
  else if (c.fresh.length || s.onlyNew) {
    html += `<div class="nudge"><span>${esc(c.fresh.length ? t.nudge(c.fresh.length) : t.caughtUp)}</span>
      <button type="button" class="link-btn" data-act="onlyNew">${s.onlyNew ? t.showAll : t.knowThem}</button></div>`;
  }

  const dates = s.date ? datesFor(s.date) : null;
  const hol = dates && dates.map(schoolHoliday).find(Boolean);
  if (hol) html += `<div class="notice">${esc(t.holNote(t.hol[hol.k], rangeText(hol)))}</div>`;

  const w = widenInfo(c);
  if (w) {
    html += `<div class="notice"><span>${esc(w.text)}</span><button type="button" class="primary small" data-act="radius" data-v="${w.r}">${esc(w.cta)}</button></div>`;
  }

  const multi = s.ages.length >= 2;
  html += c.shown.map((o) => cardHtml(o, dates, multi)).join("");

  if (c.online.length && !s.types.includes("online")) {
    html += `<button type="button" class="online-row" data-act="online"><span>${esc(t.onlineToo(c.online.length))}</span><span>${s.showOnline ? t.hideWord : t.showWord}</span></button>`;
  }
  if (s.date) {
    const n = c.pool.filter((o) => passes(o.l, "date") && !hasDays(o.l)).length;
    if (n) html += `<p class="muted-row">${esc(t.noDays(n))}</p>`;
  }
  if (c.nearby.some((o) => o.l.ap)) html += `<p class="muted-row">${t.lighter}</p>`;
  if (!c.shown.length && !w) {
    const weekend = s.date && s.date !== "weekend"
      ? `<button type="button" class="chip" data-act="date" data-v="weekend">${t.tryWeekend}</button>` : "";
    html += `<div class="empty"><span>${t.nothing}</span><div class="wrap">${weekend}<button type="button" class="chip" data-act="clear">${t.clearAll}</button></div></div>`;
  }
  list.innerHTML = html;
}

function widenInfo(c) {
  const n = c.nearby.length;
  if (n >= 3 || state.onlyNew) return null;
  const next = RADII.filter((r) => r > state.radius)
    .map((r) => ({ r, n: c.inPerson.filter((o) => o.d <= r && passes(o.l)).length }))
    .find((x) => x.n > n);
  if (!next) return null;
  return { r: next.r, text: T().widenText(n, state.radius), cta: T().widenCta(next.r, next.n - n) };
}

function renderSheet(c) {
  const s = state, t = T(), el = $("sheet");
  if (!s.sheet) { el.hidden = true; el.innerHTML = ""; el.dataset.open = ""; el.dataset.step = ""; return; }
  // Re-rendering an open sheet keeps its scroll and typed text, and doesn't replay the slide-in.
  // The add form starts each new step at the top.
  const again = el.dataset.open === s.sheet;
  const step = s.sheet === "add" && s.add ? String(s.add.step) : "";
  const oldBody = el.querySelector(".sheet-body");
  const scrollTop = again && el.dataset.step === step && oldBody ? oldBody.scrollTop : 0;
  const typed = again && $("areaInput") ? $("areaInput").value : "";
  const p = s.sheet === "place" ? placeSheet(c) : s.sheet === "filters" ? filtersSheet(c)
    : s.sheet === "signin" ? signInSheet() : s.sheet === "group" ? groupSheet(c) : addSheet();

  el.innerHTML = `<button type="button" class="backdrop"${p.tall ? ' style="flex:none;height:64px"' : ""} data-act="closeSheet" aria-label="${t.close}"></button>
    <div class="sheet${p.tall ? " tall" : ""}${again ? "" : " enter"}" role="dialog" aria-label="${esc(p.title)}">
      <div class="sheet-head"><h2>${esc(p.title)}</h2><button type="button" class="chip sq" data-act="closeSheet" aria-label="${t.close}">${ICON.close}</button></div>
      ${p.top || ""}
      <div class="sheet-body">${p.body}</div>
      ${p.foot ? `<div class="sheet-foot${p.stack ? " stack" : ""}">${p.foot}</div>` : ""}
    </div>`;
  el.hidden = false;
  el.dataset.open = s.sheet;
  el.dataset.step = step;
  el.querySelector(".sheet-body").scrollTop = scrollTop;
  const form = $("areaForm");
  if (form) {
    $("areaInput").value = typed;
    form.addEventListener("submit", (e) => { e.preventDefault(); searchArea($("areaInput").value); });
  }
  const authForm = $("authForm");
  if (authForm) authForm.addEventListener("submit", (e) => { e.preventDefault(); run(s.auth.step === "code" ? "verifyCode" : "sendCode"); });
}

function placeSheet(c) {
  const s = state, t = T();
  const status = s.placeStatus ? `<p class="status${s.placeWarn ? " warn" : ""}">${esc(s.placeStatus)}</p>` : "";
  const areas = QUICK_AREAS.map((a, n) =>
    chipHtml("area", n, a.name, s.place.kind !== "me" && s.place.kind !== "search" && s.place.name === a.name, false)).join("");
  const radii = RADII.map((r) => chipHtml("radius", r, rLabel(r), s.radius === r, false)).join("");
  return {
    title: t.where,
    body: `<button type="button" class="row-btn" data-act="nearMe">${ICON.locate}<span>${t.useMyLocation}</span></button>
      <form class="search-form" id="areaForm"><input id="areaInput" type="text" placeholder="${t.searchArea}" autocomplete="off" aria-label="${t.searchArea}" />
      <button type="submit">${t.go}</button></form>${status}
      <div class="sec"><h3>${t.quickAreas}</h3><div class="wrap">${areas}</div></div>
      <div class="sec"><h3>${t.distance}</h3><div class="wrap">${radii}</div></div>`,
    foot: `<button type="button" class="primary" data-act="closeSheet">${esc(t.show(c.shown.length))}</button>`,
  };
}

function filtersSheet(c) {
  const s = state, t = T();
  const dates = DATES.map((k) => {
    const ds = datesFor(k);
    return chipHtml("date", k, t.date[k], s.date === k, !finds(c, "date", (l) => onDates(l, ds)));
  }).join("");
  const when = Object.keys(WHEN).map((w) => chipHtml("when", w, t.w[w], s.when.includes(w), !finds(c, "when", WHEN[w]))).join("");
  const types = Object.keys(TYPES).map((k) => {
    const src = k === "online" ? c.onlineAll : c.pool;
    return chipHtml("type", k, t.ty[k], s.types.includes(k), !src.some((o) => passes(o.l, "types") && TYPES[k](o.l)));
  }).join("");
  const counts = {};
  c.pool.filter((o) => passes(o.l, "cats")).forEach((o) => { counts[o.l.c] = (counts[o.l.c] || 0) + 1; });
  const cats = CATEGORIES.filter((k) => counts[k] || s.cats.includes(k))
    .map((k) => chipHtml("cat", k, t.cat[k] || k, s.cats.includes(k), !counts[k])).join("");
  const langs = nearbyLangs(c).map(({ x, n }) => chipHtml("lang", x, t.lang[x] || x, s.langs.includes(x), n === 0)).join("");
  return {
    title: t.filters,
    body: `<div class="sec"><h3>${t.dWhen}</h3><div class="wrap">${dates}${when}</div></div>
      <div class="sec"><h3>${t.type}</h3><div class="wrap">${types}</div></div>
      ${cats ? `<div class="sec"><h3>${t.activity}</h3><div class="wrap">${cats}</div></div>` : ""}
      ${langs ? `<div class="sec"><h3>${t.language}</h3><div class="wrap">${langs}</div></div>` : ""}
      <button type="button" class="row-btn switch-row" data-act="online" ${pressed(s.showOnline)}>
        <span>${t.includeOnline}</span><span class="switch${s.showOnline ? " on" : ""}"></span></button>`,
    foot: `<button type="button" class="text-btn" data-act="resetFilters">${t.reset}</button>
      <button type="button" class="primary" data-act="closeSheet">${esc(t.show(c.shown.length))}</button>`,
  };
}

// Classes behind one map bubble that share an address
function groupSheet(c) {
  const t = T(), ids = state.group || [];
  const items = c.nearby.filter((o) => ids.includes(o.l.i));
  const dates = state.date ? datesFor(state.date) : null;
  return {
    title: t.here(items.length),
    body: items.length
      ? `<div class="group-list">${items.map((o) => cardHtml(o, dates, state.ages.length >= 2)).join("")}</div>`
      : `<p class="lead">${t.nothing}</p>`,
  };
}

function signInSheet() {
  const t = T(), a = state.auth;
  const msg = a.error ? `<p class="form-msg" role="alert">${esc(a.error)}</p>` : "";
  if (a.step === "code") {
    return {
      title: t.signIn,
      body: `<p class="lead">${esc(t.codeSent(a.email))}</p>
        <p class="help">${t.codeInstead}</p>
        <form id="authForm" class="field">
          ${fieldHtml(t.code, inputHtml("auth.code", a.code, 'type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="10"'))}
          <button type="submit" class="primary"${a.busy ? " disabled" : ""}>${a.busy ? t.checking : t.verify}</button>
        </form>${msg}
        <button type="button" class="text-btn" data-act="authBack">${t.otherEmail}</button>`,
    };
  }
  const google = state.google ? `<button type="button" class="secondary light" data-act="google">${t.google}</button>` : "";
  return {
    title: t.signIn,
    body: `<p class="lead">${t.signInWhy}</p>${google}
      <form id="authForm" class="field">
        ${fieldHtml(t.email, inputHtml("auth.email", a.email, 'type="email" inputmode="email" autocomplete="email" maxlength="200"'))}
        <button type="submit" class="secondary"${a.busy ? " disabled" : ""}>${ICON.mail}<span>${a.busy ? t.sending : t.sendCode}</span></button>
      </form>${msg}`,
  };
}

// ---- The "Add a class" form ----

function fieldHtml(label, inner, help, optional) {
  const opt = optional ? ` <span class="opt">${T().optional}</span>` : "";
  return `<label class="field"><span class="field-label">${label}${opt}</span>${inner}${help ? `<span class="help">${help}</span>` : ""}</label>`;
}
// Like fieldHtml, for chips and pairs of inputs that can't sit inside one <label>
function groupHtml(label, inner, help, optional) {
  const opt = optional ? ` <span class="opt">${T().optional}</span>` : "";
  return `<div class="field" role="group" aria-label="${esc(label)}"><span class="field-label">${label}${opt}</span>${inner}${help ? `<span class="help">${help}</span>` : ""}</div>`;
}
function inputHtml(field, value, attrs) {
  return `<input class="input" data-field="${field}" value="${esc(value)}" ${attrs}>`;
}
function selectHtml(field, label, empty, options, value) {
  const opts = options.map(([v, text]) => `<option value="${v}"${String(v) === value ? " selected" : ""}>${esc(text)}</option>`).join("");
  return `<div class="select"><select class="input" data-field="${field}" aria-label="${esc(label)}"><option value="">${esc(empty)}</option>${opts}</select>${ICON.chevron}</div>`;
}
const wrap = (chips) => `<div class="wrap">${chips}</div>`;

function blankAdd() {
  return {
    step: 1, tried: 0, busy: false, error: "", name: "", org: "", link: "", kind: "", cat: "",
    ageFrom: "", ageTo: "", langs: ["English"], otherLang: "", mode: "inperson", venue: "", address: "",
    postcode: "", geo: null, days: [], runs: "term", date: "", dateTo: "", timeFrom: "", timeTo: "",
    price: "", priceText: "", note: "", orgOk: false, trueOk: false,
  };
}

// What a step still needs before it can move on. Only fields parents can't skip are checked.
function addMissing(n) {
  const a = state.add, need = T().need, out = [];
  if (n === 1) {
    if (!a.name.trim()) out.push(need.name);
    if (!a.org.trim()) out.push(need.org);
    if (!a.kind) out.push(need.kind);
  }
  if (n === 2) {
    if (!a.cat) out.push(need.cat);
    if (a.ageFrom === "" || a.ageTo === "") out.push(need.ages);
    else if (Number(a.ageTo) < Number(a.ageFrom)) out.push(need.agesOrder);
    if (!a.langs.length) out.push(need.lang);
    else if (a.langs.includes("Other") && !a.otherLang.trim()) out.push(need.otherLang);
  }
  if (n === 3) {
    if (a.mode !== "online") {
      if (!a.address.trim()) out.push(need.address);
      const pc = a.postcode.trim();
      if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc)) out.push(pc ? need.postcodeFull : need.postcode);
    }
    if (a.kind === "oneoff" && !a.date) out.push(need.date);
    if ((a.kind === "weekly" || a.kind === "nursery") && !a.days.length) out.push(need.days);
  }
  if (n === 4) {
    if (!a.price) out.push(need.price);
    else if (a.price === "paid" && !a.priceText.trim()) out.push(need.priceText);
    if (!a.orgOk || !a.trueOk) out.push(need.ticks);
  }
  return out;
}

function addSheet() {
  const t = T(), a = state.add, n = a.step;
  if (n === "done") {
    return {
      title: t.addClass, tall: true,
      body: `<div class="done">
        <span class="done-mark">${ICON.tick}</span>
        <h3>${a.pending ? t.pendingTitle : t.doneTitle}</h3>
        <p class="lead">${a.pending ? t.pendingText : t.doneText}</p>
        <button type="button" class="primary" data-act="addSeeIt">${a.pending ? t.done : t.seeIt}</button>
        <button type="button" class="secondary" data-act="addAgain">${t.addAnother}</button>
      </div>`,
    };
  }
  const miss = addMissing(n);
  const steps = [null, addStep1, addStep2, addStep3, addStep4];
  const who = state.user
    ? `<p class="who">${esc(t.signedInAs(state.user.email || ""))} · <button type="button" data-act="signOut">${t.signOut}</button></p>` : "";
  const msg = a.error || (a.tried === n && miss.length ? t.stillNeeded(listWords(miss)) : "");
  const label = a.busy ? (n === 4 ? t.adding : t.checking) : n === 4 ? t.addToMap : t.next;
  return {
    title: t.addClass, tall: true, stack: true,
    top: `<div class="steps"><span>${esc(t.step(n, t.steps[n]))}</span>
      <div class="bar">${[1, 2, 3, 4].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</div></div>`,
    body: steps[n](a) + who,
    foot: `${msg ? `<p class="form-msg" role="alert">${esc(msg)}</p>` : ""}
      <div class="foot-row">${n > 1 ? `<button type="button" class="text-btn" data-act="addBack">${t.back}</button>` : ""}
      <button type="button" id="addNext" class="primary${miss.length ? " wait" : ""}" data-act="addNext"${a.busy ? " disabled" : ""}>${label}</button></div>`,
  };
}

function addStep1(a) {
  const t = T();
  return fieldHtml(t.fName, inputHtml("name", a.name, `type="text" maxlength="120" placeholder="${t.fNameHint}"`))
    + fieldHtml(t.fOrg, inputHtml("org", a.org, `type="text" maxlength="120" placeholder="${t.fOrgHint}"`), t.fOrgHelp)
    + fieldHtml(t.fLink, inputHtml("link", a.link, `type="url" inputmode="url" maxlength="300" placeholder="${t.fLinkHint}"`), t.fLinkHelp, true)
    + groupHtml(t.fKind, wrap(Object.keys(ADD_KINDS).map((k) => chipHtml("fKind", k, t.kind[k], a.kind === k, false)).join("")));
}

function addStep2(a) {
  const t = T();
  const from = AGE_FROM.map((v) => [v, v === 0 ? t.birth : String(v)]);
  const to = AGE_TO.map((v) => [v, v === 99 ? t.noUpper : String(v)]);
  const langs = ["English", "Russian", "Other"].map((x) => chipHtml("fLang", x, x === "Other" ? t.otherLang : t.lang[x], a.langs.includes(x), false)).join("");
  const otherLang = a.langs.includes("Other")
    ? inputHtml("otherLang", a.otherLang, `type="text" maxlength="40" placeholder="${t.otherLangHint}" aria-label="${t.otherLangHint}"`) : "";
  return groupHtml(t.fCat, wrap(ADD_CATS.map((k) => chipHtml("fCat", k, t.addCat[k], a.cat === k, false)).join("")),
    a.cat === "Mixed" ? t.fOtherCat : "")
    + groupHtml(t.fAges, `<div class="pair">${selectHtml("ageFrom", t.youngest, t.ageFrom, from, a.ageFrom)}${selectHtml("ageTo", t.oldest, t.ageTo, to, a.ageTo)}</div>`)
    + groupHtml(t.fLangs, wrap(langs) + otherLang);
}

function addStep3(a) {
  const t = T();
  let html = groupHtml(t.fWhere, wrap(["inperson", "online"].map((m) =>
    chipHtml("fMode", m, m === "online" ? t.online : t.inPerson, a.mode === m, false)).join("")));
  if (a.mode !== "online") {
    html += fieldHtml(t.fVenue, inputHtml("venue", a.venue, `type="text" maxlength="80" placeholder="${t.fVenueHint}"`), "", true)
      + fieldHtml(t.fAddress, inputHtml("address", a.address, `type="text" maxlength="120" autocomplete="street-address" placeholder="${t.fAddressHint}"`))
      + fieldHtml(t.fPostcode, inputHtml("postcode", a.postcode, `type="text" maxlength="9" autocomplete="postal-code" autocapitalize="characters" placeholder="${t.fPostcodeHint}"`), t.fPostcodeHelp);
  }
  if (a.kind === "oneoff") {
    html += fieldHtml(t.fDate, inputHtml("date", a.date, `type="date" min="${isoDate(new Date())}"`));
  } else if (a.kind === "camp") {
    html += groupHtml(t.fDates, `<div class="pair">${inputHtml("date", a.date, `type="date" aria-label="${t.firstDay}"`)}${inputHtml("dateTo", a.dateTo, `type="date" aria-label="${t.lastDay}"`)}</div>`, t.fDatesHelp, true);
  } else {
    html += groupHtml(t.fDays, wrap(DAY_ORDER.map((d) => chipHtml("fDay", d, t.day[d], a.days.includes(d), false)).join("")))
      + groupHtml(t.fRuns, wrap(Object.keys(ADD_RUNS).map((r) => chipHtml("fRuns", r, t.runs[r], a.runs === r, false)).join("")));
  }
  return html + groupHtml(t.fTime, `<div class="pair">${inputHtml("timeFrom", a.timeFrom, `type="time" aria-label="${t.startsAt}"`)}${inputHtml("timeTo", a.timeTo, `type="time" aria-label="${t.endsAt}"`)}</div>`, "", true);
}

function addStep4(a) {
  const t = T();
  const howMuch = a.price === "paid"
    ? inputHtml("priceText", a.priceText, `type="text" maxlength="80" placeholder="${t.fPriceHint}" aria-label="${t.howMuch}"`) : "";
  return groupHtml(t.fPrice, wrap(["free", "paid", "unsure"].map((p) => chipHtml("fPrice", p, t.price[p], a.price === p, false)).join("")) + howMuch)
    + fieldHtml(t.fNote, `<textarea class="input" data-field="note" rows="3" maxlength="1000" placeholder="${t.fNoteHint}">${esc(a.note)}</textarea>`, "", true)
    + groupHtml(t.fPreview, previewHtml(a))
    + `<label class="tick"><input type="checkbox" data-field="orgOk"${a.orgOk ? " checked" : ""}><span>${t.tickOrg}</span></label>`
    + `<label class="tick"><input type="checkbox" data-field="trueOk"${a.trueOk ? " checked" : ""}><span>${t.tickTrue}</span></label>`;
}

function formDays(a) {
  if (a.kind === "oneoff") return a.date ? [dayKey(new Date(`${a.date}T12:00`))] : [];
  if (a.kind === "camp") return [];
  return DAY_ORDER.filter((d) => a.days.includes(d));
}
function formLangs(a) { return a.langs.map((x) => (x === "Other" ? a.otherLang.trim() : x)).filter(Boolean); }
function longDate(iso) {
  return new Date(`${iso}T12:00`).toLocaleDateString(isRu() ? "ru-RU" : "en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// The card as parents will see it, built from what's been typed so far
function previewHtml(a) {
  const t = T();
  const l = { mn: Number(a.ageFrom) * 12, mx: a.ageTo === "99" ? null : Number(a.ageTo) * 12, d: formDays(a), st: a.timeFrom, l: formLangs(a) };
  const when = a.kind === "oneoff" && a.date ? `${longDate(a.date)}${a.timeFrom ? ` ${a.timeFrom}` : ""}` : a.kind === "camp" ? t.kind.camp : whenText(l);
  const price = a.price === "free" ? t.price.free : a.price === "paid" ? a.priceText.trim() : "";
  const meta = [when, langText(l), price].filter(Boolean).join(" · ");
  const area = a.mode === "online" ? t.online : (a.geo && a.geo.area) || a.postcode.trim().toUpperCase();
  const where = [t.addCat[a.cat], area].filter(Boolean).join(" · ");
  return `<div class="card">
    <span class="card-top"><span class="dot" style="background:${catColor(a.cat)}"></span><span class="card-cat">${esc(where)}</span><span class="card-km">${t.fresh}</span></span>
    <span class="card-title">${esc(a.name)}</span>
    ${meta ? `<span class="card-meta">${esc(meta)}</span>` : ""}
    <span class="tags"><span class="agetag">${esc(a.ageFrom === "" ? t.agesUnknown : ageText(l))}</span><span class="tag warn">${t.notConfirmed}</span>${a.link.trim() ? "" : `<span class="tag">${t.noSource}</span>`}</span>
  </div>`;
}

function scheduleText(a) {
  const time = a.timeFrom ? (a.timeTo ? `${a.timeFrom}–${a.timeTo}` : a.timeFrom) : "";
  if (a.kind === "oneoff") return [longDate(a.date), time].filter(Boolean).join(", ");
  if (a.kind === "camp") {
    const dates = a.date ? (a.dateTo ? `${longDate(a.date)} – ${longDate(a.dateTo)}` : longDate(a.date)) : T().runs.hols;
    return [dates, time].filter(Boolean).join(", ");
  }
  return [daysText(a.days), time, T().runs[a.runs].toLowerCase()].filter(Boolean).join(", ");
}

// The new row for the listings table. The database fills in who added it, its id and status.
function listingFromForm(a) {
  const online = a.mode === "online";
  const startHour = a.timeFrom ? Number(a.timeFrom.slice(0, 2)) : null;
  let website = a.link.trim();
  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
  return {
    title: a.name.trim(), provider_name: a.org.trim(), website: website || null, contact_method: website ? "Website" : null,
    delivery_mode: online ? "Online" : "In-person",
    location_area: online ? null : a.geo.area || null,
    address: online ? null : [a.venue.trim(), a.address.trim()].filter(Boolean).join(", "),
    postcode: online ? null : a.geo.postcode,
    location: online ? null : `SRID=4326;POINT(${a.geo.lng} ${a.geo.lat})`,
    address_source: online ? null : "Community: postcode",
    format: ADD_KINDS[a.kind], category: a.cat,
    age_min_months: Number(a.ageFrom) * 12, age_max_months: a.ageTo === "99" ? null : Number(a.ageTo) * 12,
    languages: formLangs(a),
    runs_when: a.kind === "camp" ? "Holidays" : a.kind === "oneoff" ? null : ADD_RUNS[a.runs],
    days_of_week: formDays(a),
    time_of_day: startHour == null ? [] : [startHour < 12 ? "Morning" : startHour < 17 ? "Afternoon" : "Evening"],
    start_time: a.timeFrom || null, end_time: a.timeTo || null,
    event_date: (a.kind === "oneoff" || a.kind === "camp") && a.date ? a.date : null,
    event_end_date: a.kind === "camp" && a.dateTo ? a.dateTo : null,
    schedule_text: scheduleText(a),
    price_text: a.price === "free" ? "Free" : a.price === "paid" ? a.priceText.trim() : null,
    description: a.note.trim() || null,
  };
}

// UK postcode → map pin, from postcodes.io (free, open data, no key needed)
async function lookupPostcode(pc) {
  const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc.trim())}`);
  if (!res.ok) return null;
  const { result: r } = await res.json();
  return r ? { lat: r.latitude, lng: r.longitude, area: r.admin_ward || r.admin_district || "", postcode: r.postcode } : null;
}

async function addNext() {
  const a = state.add, t = T(), n = a.step;
  a.error = "";
  if (addMissing(n).length) { a.tried = n; render({ keepScroll: true }); return; }
  a.tried = 0;
  if (n === 3 && a.mode !== "online" && !a.geo) {
    a.busy = true;
    render({ keepScroll: true });
    a.geo = await lookupPostcode(a.postcode).catch(() => null);
    a.busy = false;
    if (!a.geo) { a.error = t.postcodeNotFound; render({ keepScroll: true }); return; }
  }
  if (n < 4) { a.step = n + 1; render({ keepScroll: true }); return; }

  a.busy = true;
  render({ keepScroll: true });
  const { data, error } = await sb.from("listings").insert(listingFromForm(a)).select("id, status").single();
  a.busy = false;
  if (error) {
    console.warn("Add failed", error);
    a.error = t.failed(error.message);
    render({ keepScroll: true });
    return;
  }
  Object.assign(a, { step: "done", newId: data.id, pending: data.status === "Pending" });
  await loadListings();
}

// ---- Confirming and reporting ----

function communityHtml(l) {
  const t = T(), s = state, b = s.box && s.box.id === l.i ? s.box : null;
  if (!sb) return "";
  const err = b && b.error ? `<p class="form-msg" role="alert">${esc(b.error)}</p>` : "";
  if (mineAdded(l)) return `<div class="community"><p>${t.youAdded}</p></div>`;
  if (s.mine.reported[l.i]) return `<div class="community"><p>${t.youReported}</p></div>`;
  if (s.mine.confirmed[l.i] && !unconfirmed(l)) return `<div class="community"><p>${t.youConfirmed}</p></div>`;
  if (b && b.mode === "report") {
    const reasons = REASONS.map((r) => chipHtml("reason", r, t.reason[r], b.reason === r, false)).join("");
    return `<div class="community"><b>${t.whatsWrong}</b>${wrap(reasons)}
      <textarea class="input" data-field="box.note" rows="2" maxlength="500" placeholder="${t.reportNote}" aria-label="${t.reportNote}">${esc(b.note || "")}</textarea>
      ${err}<div class="foot-row"><button type="button" class="text-btn" data-act="cancelReport">${t.cancel}</button>
      <button type="button" class="primary" data-act="sendReport" data-v="${esc(l.i)}"${b.busy ? " disabled" : ""}>${t.sendReport}</button></div></div>`;
  }
  if (unconfirmed(l)) {
    return `<div class="community"><b>${t.knowIt}</b><p>${t.knowItText}</p>${err}
      <button type="button" class="primary" data-act="confirm" data-v="${esc(l.i)}"${b && b.busy ? " disabled" : ""}>${ICON.check}<span>${t.yesReal}</span></button>
      <button type="button" class="secondary" data-act="report" data-v="${esc(l.i)}">${t.wrong}</button></div>`;
  }
  return `${err}<button type="button" class="link-btn report-link" data-act="report" data-v="${esc(l.i)}">${t.reportLink}</button>`;
}

async function confirmListing(id) {
  state.box = { id, busy: true };
  render({ keepScroll: true });
  const { error } = await sb.from("listing_confirmations").insert({ listing_id: id });
  if (error) {
    console.warn("Confirm failed", error);
    state.box = { id, error: error.code === "42501" ? T().notAllowed : T().failed(error.message) };
    render({ keepScroll: true });
    return;
  }
  state.box = null;
  state.mine.confirmed[id] = true;
  await loadListings();
}

async function sendReport(id) {
  const b = state.box;
  if (!b.reason) { b.error = T().pickReason; render({ keepScroll: true }); return; }
  b.busy = true;
  b.error = "";
  render({ keepScroll: true });
  const { error } = await sb.from("listing_reports").insert({ listing_id: id, reason: b.reason, note: (b.note || "").trim() || null });
  b.busy = false;
  if (error) {
    console.warn("Report failed", error);
    b.error = error.code === "42501" ? T().notAllowed : T().failed(error.message);
    render({ keepScroll: true });
    return;
  }
  state.box = null;
  state.mine.reported[id] = true;
  await loadListings();
}

// Someone who looked up the way there or the website is the best person to ask, a bit later, whether it was right.
// Kept only on this phone.
const VISITS_KEY = "aroundnow-visits";
function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; } catch (e) { return fallback; }
}
function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}
function rememberVisit(id) {
  const v = readJson(VISITS_KEY, {}), now = Date.now();
  Object.keys(v).forEach((k) => { if (now - v[k].at > 30 * DAY_MS) delete v[k]; });
  if (!v[id]) v[id] = { at: now, asked: false };
  writeJson(VISITS_KEY, v);
}
function markAsked(id) {
  const v = readJson(VISITS_KEY, {});
  if (v[id]) { v[id].asked = true; writeJson(VISITS_KEY, v); }
}
// Asked from half a day after the visit, for up to two weeks, and only once
function pendingAsk() {
  const v = readJson(VISITS_KEY, {}), now = Date.now();
  for (const id of Object.keys(v)) {
    const x = v[id];
    if (x.asked || now - x.at < 12 * 3600e3 || now - x.at > 14 * DAY_MS) continue;
    const l = state.items.find((i) => i.i === id);
    if (l && unconfirmed(l) && !mineAdded(l) && !state.mine.confirmed[id] && !state.mine.reported[id]) return { l, at: x.at };
  }
  return null;
}
function askHtml({ l, at }) {
  const t = T(), day = new Date(at).toLocaleDateString(isRu() ? "ru-RU" : "en-GB", { weekday: "long" });
  return `<div class="ask"><small>${esc(t.askSeen(day))}</small><b>${esc(t.askTitle(l.t))}</b>
    <div class="wrap"><button type="button" class="primary small" data-act="askYes" data-v="${esc(l.i)}">${t.askYes}</button>
    <button type="button" class="chip" data-act="askDiff" data-v="${esc(l.i)}">${t.askDiff}</button>
    <button type="button" class="text-btn" data-act="askNo" data-v="${esc(l.i)}">${t.askNo}</button></div></div>`;
}

// ---- Accounts (Supabase Auth: Google, or a code sent by email) ----

// The sign-in link may open in a new tab, and Google reloads the page, so what the person
// was in the middle of is kept on the phone for an hour
const AFTER_KEY = "aroundnow-after-sign-in";
function rememberAfter() { writeJson(AFTER_KEY, { after: state.afterSignIn, at: Date.now() }); }
function recallAfter() {
  const saved = readJson(AFTER_KEY, null);
  try { localStorage.removeItem(AFTER_KEY); } catch (e) { /* storage unavailable */ }
  return saved && Date.now() - saved.at < 3600e3 ? saved.after : null;
}

function openSignIn(after) {
  state.afterSignIn = after;
  state.auth = { step: "email", email: (state.auth && state.auth.email) || "", code: "", busy: false, error: "" };
  state.detail = null; // the sign-in sheet would otherwise sit underneath the class details
  state.sheet = "signin";
}

async function sendCode() {
  const a = state.auth, t = T();
  a.email = a.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) { a.error = t.badEmail; render({ keepScroll: true }); return; }
  a.busy = true;
  a.error = "";
  render({ keepScroll: true });
  rememberAfter();
  const { error } = await sb.auth.signInWithOtp({ email: a.email, options: { emailRedirectTo: location.origin + location.pathname } });
  a.busy = false;
  if (error) a.error = t.failed(error.message);
  else Object.assign(a, { step: "code", code: "" });
  render({ keepScroll: true });
}

async function verifyCode() {
  const a = state.auth;
  a.busy = true;
  a.error = "";
  render({ keepScroll: true });
  const { error } = await sb.auth.verifyOtp({ email: a.email, token: a.code.replace(/\s/g, ""), type: "email" });
  a.busy = false;
  // Success is picked up by onAuthStateChange below
  if (error) { a.error = T().failed(error.message); render({ keepScroll: true }); }
}

function signInWithGoogle() {
  rememberAfter();
  sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } });
}

async function signOut() {
  await sb.auth.signOut();
  state.add = null;
  state.sheet = null;
  render({ keepScroll: true });
}

// What this person has already confirmed or reported, so we don't ask twice
async function loadMine() {
  state.mine = { confirmed: {}, reported: {} };
  if (!sb || !state.user) return;
  const [c, r] = await Promise.all([
    sb.from("listing_confirmations").select("listing_id"),
    sb.from("listing_reports").select("listing_id").eq("resolved", false),
  ]);
  (c.data || []).forEach((x) => { state.mine.confirmed[x.listing_id] = true; });
  (r.data || []).forEach((x) => { state.mine.reported[x.listing_id] = true; });
}

// Carry on with whatever needed the sign-in: adding a class, or the class they were looking at
function afterSignedIn() {
  const saved = recallAfter();
  const after = state.afterSignIn || saved;
  state.afterSignIn = null;
  state.auth = null;
  if (state.sheet === "signin") state.sheet = null;
  if (after === "add") {
    if (!state.add || state.add.step === "done") state.add = blankAdd();
    state.sheet = "add";
  } else if (after && after.open) {
    state.detail = after.open;
  }
}

// True (and opens sign-in) when this needs an account first
function needSignIn(id) {
  if (state.user) return false;
  openSignIn({ open: id });
  return true;
}

function renderDetail(c) {
  const t = T(), el = $("detail");
  const o = state.detail && c.rows.find((x) => x.l.i === state.detail);
  if (!o) { el.hidden = true; el.innerHTML = ""; el.dataset.open = ""; return; }
  const again = el.dataset.open === state.detail;
  const l = o.l;
  const type = Object.keys(TYPES).find((k) => TYPES[k](l));
  const tags = [`<span class="agetag">${esc(ageText(l))}</span>`];
  if (type) tags.push(`<span class="tag">${esc(t.ty[type])}</span>`);
  if (l.l.length) tags.push(`<span class="tag">${esc(langText(l))}</span>`);
  if (l.h && l.f !== "Holiday camp") tags.push(`<span class="tag">${t.holidayClub}</span>`);
  const where = l.on ? t.online : l.ad || `${l.a} (${t.areaOnly})`;
  const notes = l.g || l.b ? `<div style="display:flex;flex-direction:column;gap:10px"><b style="font-size:16px">${t.parents}</b>
      ${l.g ? `<div class="note good">${ICON.plus}<div><b>${t.good}</b><span>${esc(l.g)}</span></div></div>` : ""}
      ${l.b ? `<div class="note bad">${ICON.minus}<div><b>${t.watch}</b><span>${esc(l.b)}</span></div></div>` : ""}</div>` : "";
  const dir = l.y != null && !l.on ? `https://www.google.com/maps/search/?api=1&query=${l.y},${l.x}` : "";
  const status = (unconfirmed(l) ? statusTag(l) : "")
    + (l.w ? "" : `<span class="tag">${t.noSource}</span>`);

  el.innerHTML = `<button type="button" class="backdrop" style="flex:none;height:64px" data-act="closeDetail" aria-label="${t.close}"></button>
    <div class="sheet tall${again ? "" : " enter"}" role="dialog" aria-label="${esc(l.t)}">
      <div class="sheet-head">
        <span class="card-top" style="flex:1;min-width:0"><span class="dot" style="background:${catColor(l.c)}"></span><span class="card-cat">${esc(t.cat[l.c] || l.c)}</span></span>
        <button type="button" class="chip sq" data-act="closeDetail" aria-label="${t.close}">${ICON.close}</button>
      </div>
      <div class="sheet-body" style="padding:0"><div class="detail-body">
        <h2>${esc(l.t)}</h2>
        ${l.src === "Community" && !l.lc && l.ca ? `<span class="muted">${esc(t.addedBy(ago(l.ca)))}</span>`
          : checkedText(l) ? `<span class="muted">${esc(checkedText(l))}</span>` : ""}
        ${stale(l) ? `<span class="muted">${t.recheckHint}</span>` : ""}
        ${status ? `<span class="tags">${status}</span>` : ""}
        <span class="where">${ICON.pin}<span>${esc(whereText(l, o.d))}</span></span>
        <span class="tags">${tags.join("")}</span>
        <dl class="facts">
          <div><dt>${t.dWhen}</dt><dd>${esc([l.ed ? whenText(l) : "", l.s || (l.ed ? "" : daysText(l.d))].filter(Boolean).join(". ") || "—")}</dd></div>
          <div><dt>${t.dPrice}</dt><dd>${esc(l.p || t.priceUnknown)}</dd></div>
          <div><dt>${t.dWhere}</dt><dd>${esc(where)}</dd></div>
        </dl>
        ${l.ds ? `<p>${esc(l.ds)}</p>` : ""}
        ${notes}
        ${communityHtml(l)}
      </div></div>
      <div class="actions">
        ${l.w ? `<a class="primary" href="${esc(l.w)}" target="_blank" rel="noreferrer" data-track="${esc(l.i)}"><span>${t.website}</span>${ICON.external}</a>` : ""}
        ${dir ? `<a class="secondary" href="${dir}" target="_blank" rel="noreferrer" data-track="${esc(l.i)}">${ICON.directions}<span>${t.directions}</span></a>` : ""}
      </div>
    </div>`;
  el.hidden = false;
  el.dataset.open = state.detail;
}

function ensureMap() {
  if (map) return;
  map = L.map("map", { zoomControl: false, attributionControl: false });
  // Top right, just under the search bar: the bottom of the map is covered by the results panel
  L.control.attribution({ position: "topright", prefix: false }).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  pinsLayer = L.layerGroup().addTo(map);
  map.on("zoomend", () => drawPins(lastNearby));
  map.setView([state.place.lat, state.place.lng], 13);
}

// Pins closer together than a fingertip on screen become one numbered bubble
function drawPins(nearby) {
  pinsLayer.clearLayers();
  const groups = [];
  for (const o of nearby) {
    const p = map.latLngToLayerPoint([o.l.y, o.l.x]);
    const g = groups.find((x) => x.p.distanceTo(p) < 24);
    if (g) g.items.push(o);
    else groups.push({ p, items: [o] });
  }
  for (const { items } of groups) {
    const l = items[0].l;
    if (items.length === 1) {
      L.circleMarker([l.y, l.x], {
        radius: 8, color: "#0d1322", weight: 3, opacity: l.ap ? 0.6 : 1, fillColor: catColor(l.c), fillOpacity: l.ap ? 0.45 : 1,
      }).on("click", () => { state.detail = l.i; render({ keepScroll: true }); }).addTo(pinsLayer);
      continue;
    }
    const lat = items.reduce((sum, o) => sum + o.l.y, 0) / items.length;
    const lng = items.reduce((sum, o) => sum + o.l.x, 0) / items.length;
    L.marker([lat, lng], {
      icon: L.divIcon({ className: "cluster", html: String(items.length), iconSize: [34, 34] }),
      title: T().here(items.length),
    }).on("click", () => openGroup(items)).addTo(pinsLayer);
  }
}

// A bubble zooms in to split up. Classes at the same address never split, so those are listed instead.
function openGroup(items) {
  const bounds = L.latLngBounds(items.map((o) => [o.l.y, o.l.x]));
  if (map.getZoom() < 16 && bounds.getNorthEast().distanceTo(bounds.getSouthWest()) > 60) {
    map.flyToBounds(bounds, { ...visibleArea(), maxZoom: 17, duration: 0.6 });
    return;
  }
  state.group = items.map((o) => o.l.i);
  state.sheet = "group";
  render({ keepScroll: true });
}

function renderMap(c) {
  ensureMap();
  markersLayer.clearLayers();
  const centre = [state.place.lat, state.place.lng];
  const lime = "#c8f560";
  L.circle(centre, {
    radius: state.radius * 1000, color: lime, weight: 1.5, opacity: 0.6, dashArray: "6 6", fillColor: lime, fillOpacity: 0.05, interactive: false,
  }).addTo(markersLayer);
  L.circleMarker(centre, { radius: 6, color: lime, weight: 10, opacity: 0.25, fillColor: lime, fillOpacity: 1, interactive: false }).addTo(markersLayer);

  lastNearby = c.nearby;
  drawPins(c.nearby);

  // Re-frame only when the place or distance changes, so filtering doesn't make the map jump
  const key = `${state.place.lat},${state.place.lng},${state.radius}`;
  if (key !== fittedFor) {
    fittedFor = key;
    fitMap();
  }
}

// The part of the map you can see: below the top bar, above the resting panel
function visibleArea() {
  const app = $("app"), h = app.clientHeight;
  const panelTop = Math.max(h * 0.45, h - 420); // same as .panel's resting top in style.css
  const below = $("topbar").getBoundingClientRect().bottom - app.getBoundingClientRect().top;
  return { paddingTopLeft: [16, below + 12], paddingBottomRight: [16, h - panelTop + 12] };
}

// Fit the search circle into the part of the map you can see
function fitMap() {
  const bounds = L.latLng(state.place.lat, state.place.lng).toBounds(state.radius * 2000);
  map.invalidateSize();
  map.fitBounds(bounds, visibleArea());
}

function render({ keepScroll = false } = {}) {
  const c = compute();
  renderTop();
  renderFilters(c);
  renderHead(c);
  renderPanel();
  if (!keepScroll) $("list").scrollTop = 0;
  renderList(c);
  renderMap(c);
  renderSheet(c);
  renderDetail(c);
}

// ---- Location ----

function useMyLocation({ quiet = false } = {}) {
  const t = T();
  if (!navigator.geolocation) {
    if (!quiet) { state.placeStatus = t.locFail; state.placeWarn = true; render({ keepScroll: true }); }
    return;
  }
  if (!quiet) { state.placeStatus = t.locating; state.placeWarn = false; render({ keepScroll: true }); }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.place = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: t.nearMe, kind: "me" };
      state.placeStatus = "";
      state.sheet = null;
      render();
    },
    (err) => {
      console.warn("Location error", err);
      if (quiet) return;
      state.placeStatus = err.code === err.PERMISSION_DENIED ? T().blocked : T().locFail;
      state.placeWarn = true;
      render({ keepScroll: true });
    },
    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 }
  );
}

// Geocode with OpenStreetMap's Nominatim. Their usage policy allows light use
// (max 1 request/second, no autocomplete), so we only search on submit.
async function searchArea(query) {
  query = query.trim();
  if (!query) return;
  state.placeStatus = T().searching;
  state.placeWarn = false;
  render({ keepScroll: true });
  try {
    const qs = new URLSearchParams({ q: query, format: "jsonv2", limit: "1", countrycodes: "gb" });
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs.toString()}`, {
      headers: { "Accept-Language": state.ui },
    });
    const results = await res.json();
    if (!Array.isArray(results) || !results.length) {
      state.placeStatus = T().notFound(query);
      state.placeWarn = true;
    } else {
      const p = results[0];
      state.place = { lat: Number(p.lat), lng: Number(p.lon), name: p.display_name.split(",")[0], kind: "search" };
      state.placeStatus = "";
      state.sheet = null;
    }
  } catch (e) {
    console.warn("Geocode error", e);
    state.placeStatus = T().locFail;
    state.placeWarn = true;
  }
  render();
}

// ---- Events ----

const flip = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : list.concat([v]));
function toggle(key, v) { state[key] = flip(state[key], v); }

const ACTIONS = {
  age: (v) => { toggle("ages", Number(v)); savePrefs(); },
  radius: (v) => { state.radius = Number(v); savePrefs(); },
  lang: (v) => { toggle("langs", v); savePrefs(); },
  date: (v) => { state.date = state.date === v ? null : v; },
  when: (v) => toggle("when", v),
  type: (v) => toggle("types", v),
  cat: (v) => toggle("cats", v),
  online: () => { state.showOnline = !state.showOnline; },
  clear: () => {
    Object.assign(state, { ages: [], langs: [], date: null, when: [], types: [], cats: [], showOnline: false });
    savePrefs();
  },
  // Everything except age, which is about the child rather than this search
  resetFilters: () => {
    Object.assign(state, { langs: [], date: null, when: [], types: [], cats: [], showOnline: false });
    savePrefs();
  },
  sheet: (v) => { state.sheet = v; state.placeStatus = ""; },
  // Closing the add form keeps what was typed, in case it was a mis-tap
  closeSheet: () => {
    if (state.sheet === "signin") state.afterSignIn = null;
    state.sheet = null;
  },
  open: (v) => { state.detail = v; state.box = null; },
  closeDetail: () => { state.detail = null; state.box = null; },
  panel: () => { state.expanded = !state.expanded; },
  nearMe: () => { useMyLocation(); return "async"; },
  area: (v) => {
    const a = QUICK_AREAS[Number(v)];
    state.place = { lat: a.lat, lng: a.lng, name: a.name, kind: "area" };
    state.sheet = null;
  },
  onlyNew: () => { state.onlyNew = !state.onlyNew; },

  // Signing in
  google: () => { signInWithGoogle(); return "async"; },
  sendCode: () => { sendCode(); return "async"; },
  verifyCode: () => { verifyCode(); return "async"; },
  authBack: () => { Object.assign(state.auth, { step: "email", code: "", error: "" }); },
  signOut: () => { signOut(); return "async"; },

  // Adding a class
  add: () => {
    if (!state.user) { openSignIn("add"); return; }
    if (!state.add || state.add.step === "done") state.add = blankAdd();
    state.detail = null;
    state.sheet = "add";
  },
  fKind: (v) => { state.add.kind = v; },
  fCat: (v) => { state.add.cat = v; },
  fLang: (v) => { state.add.langs = flip(state.add.langs, v); },
  fMode: (v) => { state.add.mode = v; },
  fDay: (v) => { state.add.days = flip(state.add.days, v); },
  fRuns: (v) => { state.add.runs = v; },
  fPrice: (v) => { state.add.price = v; },
  addNext: () => { addNext(); return "async"; },
  addBack: () => { Object.assign(state.add, { step: state.add.step - 1, tried: 0, error: "" }); },
  addAgain: () => { state.add = blankAdd(); },
  addSeeIt: () => {
    const { newId, pending } = state.add;
    state.add = null;
    state.sheet = null;
    if (!pending) state.detail = newId;
  },

  // Confirming and reporting
  confirm: (v) => { if (needSignIn(v)) return; confirmListing(v); return "async"; },
  report: (v) => { if (needSignIn(v)) return; state.box = { id: v, mode: "report", reason: "", note: "" }; },
  reason: (v) => { Object.assign(state.box, { reason: v, error: "" }); },
  cancelReport: () => { state.box = null; },
  sendReport: (v) => { sendReport(v); return "async"; },
  // Opens the class, so the thank-you (or any problem) shows where it happened
  askYes: (v) => {
    markAsked(v);
    if (needSignIn(v)) return;
    state.detail = v;
    confirmListing(v);
    return "async";
  },
  askDiff: (v) => {
    markAsked(v);
    if (needSignIn(v)) return;
    state.detail = v;
    state.box = { id: v, mode: "report", reason: "", note: "" };
  },
  askNo: (v) => { markAsked(v); },
};

// Only actions that change the results send the list back to the top
const RESETS_SCROLL = new Set(["age", "radius", "lang", "date", "when", "type", "cat", "online", "clear", "resetFilters", "area", "onlyNew"]);

function run(act, v) {
  if (ACTIONS[act](v) === "async") return;
  render({ keepScroll: !RESETS_SCROLL.has(act) });
}

document.addEventListener("click", (e) => {
  const track = e.target.closest("[data-track]");
  if (track) rememberVisit(track.dataset.track);
  const el = e.target.closest("[data-act]");
  if (el && ACTIONS[el.dataset.act]) run(el.dataset.act, el.dataset.v);
});

// Typing updates the form without re-rendering it, so the cursor stays where it is
function onField(e) {
  const f = e.target.dataset && e.target.dataset.field;
  if (!f) return;
  const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
  if (f.startsWith("auth.")) { if (state.auth) state.auth[f.slice(5)] = value; return; }
  if (f.startsWith("box.")) { if (state.box) state.box[f.slice(4)] = value; return; }
  if (!state.add) return;
  state.add[f] = value;
  if (f === "postcode") state.add.geo = null;
  const next = $("addNext");
  if (next) next.classList.toggle("wait", addMissing(state.add.step).length > 0);
}
document.addEventListener("input", onField);
document.addEventListener("change", onField);

// Drag the panel's handle or header up for the full list, down for the map; a tap toggles
const panel = $("panel");
let drag = null;

panel.addEventListener("pointerdown", (e) => {
  if (!e.target.closest(".drag-zone") || e.target.closest("button")) return;
  drag = { y: e.clientY, top: panel.offsetTop, moved: false };
  panel.setPointerCapture(e.pointerId);
  panel.classList.add("dragging");
});
panel.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dy = e.clientY - drag.y;
  if (Math.abs(dy) > 6) drag.moved = true;
  const h = $("app").clientHeight;
  panel.style.top = `${Math.min(h - 120, Math.max(60, drag.top + dy))}px`;
});
function endDrag(e) {
  if (!drag) return;
  const { y, moved } = drag;
  drag = null;
  panel.classList.remove("dragging");
  panel.style.top = "";
  if (e.type !== "pointercancel") {
    const dy = e.clientY - y;
    if (!moved) state.expanded = !state.expanded;
    else if (Math.abs(dy) > 40) state.expanded = dy < 0;
  }
  renderPanel();
}
panel.addEventListener("pointerup", endDrag);
panel.addEventListener("pointercancel", endDrag);

// Scrolling the list while the panel is low opens it fully
$("list").addEventListener("scroll", (e) => {
  if (!state.expanded && e.currentTarget.scrollTop > 24) {
    state.expanded = true;
    renderPanel();
  }
}, { passive: true });

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (state.detail) ACTIONS.closeDetail();
  else if (state.sheet) ACTIONS.closeSheet();
  else if (state.expanded) state.expanded = false;
  else return;
  render({ keepScroll: true });
});

if (sb) {
  sb.auth.onAuthStateChange((event, session) => {
    const was = state.user && state.user.id;
    state.user = session ? session.user : null;
    // supabase-js asks not to call it again from inside this callback, so follow up a moment later
    setTimeout(async () => {
      if ((state.user && state.user.id) !== was) await loadMine();
      if (event === "SIGNED_IN") afterSignedIn();
      render({ keepScroll: true });
    }, 0);
  });
  // Only offer Google once it's switched on in Supabase
  fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_KEY } })
    .then((res) => res.json())
    .then((s) => { state.google = !!(s.external && s.external.google); })
    .catch(() => {});
}

loadPrefs();
render();
loadListings();
useMyLocation({ quiet: true });
