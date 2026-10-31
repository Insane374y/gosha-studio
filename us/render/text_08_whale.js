// Все надписи ролика: en — в кадре, ru — перевод для автора. В v_08_whale.js они берутся по ключу: L("ключ").
const T2 = (en, ru) => ({ en, ru });
const TEXT = {
  title: { en: ["SWALLOWED", "BY A WHALE?"], ru: ["ПРОГЛОТИЛ", "КИТ?"] },
  labels: {
    noRescue: T2("NO RESCUE", "БЕЗ СПАСЕНИЯ"),
    gulf: T2("GULF OF MEXICO", "МЕКСИКАНСКИЙ ЗАЛИВ"),
    breath: T2("ONE BREATH", "ОДИН ВДОХ"),
    swallow: T2("CAN IT SWALLOW YOU?", "МОЖЕТ ЛИ ОН ТЕБЯ ПРОГЛОТИТЬ?"),
    humpback: T2("HUMPBACK", "ГОРБАЧ"), blue: T2("BLUE WHALE", "СИНИЙ КИТ"), sperm: T2("SPERM WHALE", "КАШАЛОТ"),
    no: T2("NO", "НЕТ"), yes: T2("YES", "ДА"), throat: T2("throat width · illustration", "ширина горла · иллюстрация"),
    fits: T2("A PERSON FITS", "ЧЕЛОВЕК ПРОЛЕЗАЕТ"),
    noAir: T2("NO AIR POCKET", "НЕТ ВОЗДУШНОГО КАРМАНА"), noLight: T2("NO LIGHT", "НЕТ СВЕТА"),
    lungs: T2("AIR IN YOUR LUNGS", "ВОЗДУХ В ЛЁГКИХ"), atm: T2("+1 ATMOSPHERE EVERY 33 FT", "+1 АТМОСФЕРА КАЖДЫЕ 33 ФУТА (10 М)"),
    ft: T2("FT", "ФУТ"),
    co2: T2("CO2 RISING", "УГЛЕКИСЛЫЙ ГАЗ РАСТЁТ"), breathe: T2("BREATHE!", "ВДОХНИ!"),
    acidSlow: T2("ACID IS SLOW.", "КИСЛОТА — МЕДЛЕННО."), airFast: T2("AIR IS FAST.", "ВОЗДУХ — БЫСТРО."),
    oxygen: T2("WITHOUT OXYGEN", "БЕЗ КИСЛОРОДА"),
    awake: T2("AWAKE", "В СОЗНАНИИ"), blackout: T2("BLACKOUT", "ОТКЛЮЧИЛСЯ"), damage: T2("BRAIN DAMAGE", "ПОВРЕЖДЕНИЕ МОЗГА"),
    minutes: T2("MINUTES", "МИНУТЫ"), avg: T2("typical ranges", "типичные значения"),
    days: T2("SURVIVE FOR DAYS?", "ВЫЖИТЬ НЕСКОЛЬКО ДНЕЙ?"), nope: T2("NO", "НЕТ"),
    airFirst: T2("AIR RUNS OUT FIRST", "ВОЗДУХ КОНЧИТСЯ РАНЬШЕ"),
    depth: T2("DEPTH", "ГЛУБИНА"), never: T2("IT NEVER NOTICED", "ОН ДАЖЕ НЕ ЗАМЕТИЛ"),
  },
};
