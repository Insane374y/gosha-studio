/* =====================================================================
   ДАННЫЕ САЙТА. Всё, что нужно поменять под свою компанию, — здесь.
   ===================================================================== */

// Контакты компании (сейчас заглушки — замените на свои)
const COMPANY = {
  name: "РоллетПро",
  slogan: "Роллеты и ворота под ключ",
  phone: "8 (800) 000-00-00",
  phoneLink: "+78000000000",
  email: "info@example.ru",
  city: "г. Ваш город",
  address: "ул. Примерная, д. 1, офис 1",
  hours: "Пн–Пт 9:00–18:00, Сб 10:00–15:00",
};

// Разделы каталога (плитки на главной)
const CATEGORIES = [
  { id: "doors-windows", title: "Роллеты для дверей и окон", text: "Защита от взлома, шума и солнца", page: "catalog.html", pic: { type: "shutter", color: "#c9ced6" } },
  { id: "grilles", title: "Роллетные решётки", text: "Для витрин, магазинов и складов", page: "catalog.html", pic: { type: "grille", color: "#9aa5b1" } },
  { id: "garage", title: "Гаражные роллеты", text: "Компактно, без места под потолком", page: "catalog.html", pic: { type: "shutter", color: "#7b5a3c" } },
  { id: "sectional", title: "Секционные ворота", text: "Для гаражей и промышленных зданий", page: "catalog.html", pic: { type: "sectional", color: "#e9ecef" } },
  { id: "swing", title: "Распашные и откатные ворота", text: "Для частных домов и территорий", page: "catalog.html", pic: { type: "swing", color: "#4a5a6a" } },
  { id: "automation", title: "Автоматика", text: "Приводы, пульты, шлагбаумы", page: "catalog.html", pic: { type: "motor", color: "#f28c28" } },
];

// Цвета профиля
const COLORS = {
  white: { name: "Белый", hex: "#f2f3f5" },
  silver: { name: "Серебристый", hex: "#c9ced6" },
  beige: { name: "Бежевый", hex: "#d8c7a3" },
  brown: { name: "Коричневый", hex: "#7b5a3c" },
  graphite: { name: "Графит", hex: "#4a5560" },
};

// Товары раздела «Роллеты для дверей и окон».
// price — цена за 1 м² в рублях (ПРИМЕРНАЯ, замените на свою).
// control: "manual" — ручное, "electric" — электропривод
// place: "window" — окно, "door" — дверь, "garage" — гараж/проём
const PRODUCTS = [
  { id: 1, title: "Роллета на окно с ручным управлением", profile: "AR-37", profileType: "Пенонаполненный", control: "manual", place: "window", price: 3900, colors: ["white", "silver", "beige", "brown"], badge: "Хит", protection: "Базовая", maxWidth: 3.0, maxHeight: 3.0 },
  { id: 2, title: "Роллета на окно с электроприводом", profile: "AR-37", profileType: "Пенонаполненный", control: "electric", place: "window", price: 6900, colors: ["white", "silver", "brown"], badge: "", protection: "Базовая", maxWidth: 3.0, maxHeight: 3.0 },
  { id: 3, title: "Роллета на дверь, усиленная", profile: "AR-55", profileType: "Пенонаполненный", control: "manual", place: "door", price: 4700, colors: ["white", "silver", "beige", "brown", "graphite"], badge: "", protection: "Средняя", maxWidth: 4.0, maxHeight: 4.0 },
  { id: 4, title: "Роллета на дверь с электроприводом", profile: "AR-55", profileType: "Пенонаполненный", control: "electric", place: "door", price: 7600, colors: ["silver", "brown", "graphite"], badge: "Выбор покупателей", protection: "Средняя", maxWidth: 4.0, maxHeight: 4.0 },
  { id: 5, title: "Противовзломная роллета на окно", profile: "AER-44", profileType: "Экструдированный", control: "electric", place: "window", price: 11900, colors: ["silver", "graphite"], badge: "", protection: "Высокая", maxWidth: 3.5, maxHeight: 3.0 },
  { id: 6, title: "Противовзломная роллета на дверь", profile: "AER-55", profileType: "Экструдированный", control: "electric", place: "door", price: 13500, colors: ["silver", "graphite"], badge: "", protection: "Высокая", maxWidth: 4.5, maxHeight: 4.0 },
  { id: 7, title: "Роллета для проёма / гаража", profile: "AR-77", profileType: "Пенонаполненный", control: "electric", place: "garage", price: 6200, colors: ["white", "silver", "beige", "brown"], badge: "", protection: "Средняя", maxWidth: 6.0, maxHeight: 4.5 },
  { id: 8, title: "Роллета на балкон / лоджию", profile: "AR-37", profileType: "Пенонаполненный", control: "manual", place: "window", price: 3600, colors: ["white", "beige"], badge: "Выгодно", protection: "Базовая", maxWidth: 3.0, maxHeight: 2.8 },
  { id: 9, title: "Роллета на окно с пультом и таймером", profile: "AR-45", profileType: "Пенонаполненный", control: "electric", place: "window", price: 8400, colors: ["white", "silver", "brown", "graphite"], badge: "Новинка", protection: "Средняя", maxWidth: 3.5, maxHeight: 3.2 },
];

const LABELS = {
  control: { manual: "Ручное", electric: "Электропривод" },
  place: { window: "На окно", door: "На дверь", garage: "На проём / гараж" },
};

/* ---------- Рисунки (вместо фотографий) ----------
   Когда появятся настоящие фото — можно добавить в товар поле photo: "img/xxx.jpg",
   и сайт покажет фото вместо рисунка. */
function drawPicture(type, color) {
  const frame = "#5b6673";
  if (type === "grille") {
    let bars = "";
    for (let x = 30; x <= 170; x += 14) bars += `<rect x="${x}" y="40" width="4" height="130" fill="${color}"/>`;
    for (let y = 50; y <= 165; y += 14) bars += `<rect x="26" y="${y}" width="150" height="2" fill="${color}"/>`;
    return svgWrap(`<rect x="15" y="12" width="170" height="28" rx="4" fill="${frame}"/>
      <rect x="18" y="40" width="8" height="140" fill="${frame}"/><rect x="174" y="40" width="8" height="140" fill="${frame}"/>${bars}
      <rect x="26" y="168" width="148" height="6" fill="${frame}"/>`);
  }
  if (type === "sectional") {
    let panels = "";
    for (let i = 0; i < 5; i++) panels += `<rect x="28" y="${40 + i * 27}" width="144" height="25" rx="2" fill="${color}" stroke="#b8c0ca"/>`;
    return svgWrap(`<rect x="18" y="30" width="164" height="150" rx="4" fill="${frame}"/>${panels}
      <rect x="92" y="150" width="16" height="4" rx="2" fill="#5b6673"/>`);
  }
  if (type === "swing") {
    return svgWrap(`<rect x="14" y="40" width="10" height="140" fill="${frame}"/><rect x="176" y="40" width="10" height="140" fill="${frame}"/>
      <rect x="26" y="60" width="72" height="110" fill="${color}"/><rect x="102" y="60" width="72" height="110" fill="${color}"/>
      ${[0,1,2,3,4,5,6,7].map(i => `<rect x="${30 + i * 8.5}" y="64" width="5" height="102" fill="#fff" opacity=".12"/><rect x="${106 + i * 8.5}" y="64" width="5" height="102" fill="#fff" opacity=".12"/>`).join("")}
      <circle cx="94" cy="118" r="3" fill="#f28c28"/><circle cx="106" cy="118" r="3" fill="#f28c28"/>`);
  }
  if (type === "motor") {
    return svgWrap(`<rect x="40" y="60" width="120" height="70" rx="12" fill="#4a5560"/>
      <rect x="52" y="72" width="70" height="46" rx="6" fill="#5b6673"/>
      <circle cx="140" cy="95" r="12" fill="${color}"/>
      <rect x="70" y="140" width="34" height="50" rx="8" fill="#2c3540"/>
      <circle cx="87" cy="156" r="5" fill="${color}"/><circle cx="87" cy="174" r="5" fill="#c9ced6"/>
      <path d="M118 150 q12 -12 24 0 M112 142 q18 -20 36 0" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  }
  // по умолчанию — роллета
  let slats = "";
  for (let y = 46; y < 168; y += 9) slats += `<rect x="30" y="${y}" width="140" height="8" fill="${color}"/><rect x="30" y="${y + 7}" width="140" height="1.5" fill="#000" opacity=".12"/>`;
  return svgWrap(`<rect x="20" y="14" width="160" height="32" rx="5" fill="${color}" stroke="#000" stroke-opacity=".15"/>
    <rect x="20" y="40" width="160" height="6" fill="#000" opacity=".08"/>
    <rect x="20" y="46" width="10" height="132" fill="${color}" stroke="#000" stroke-opacity=".15"/>
    <rect x="170" y="46" width="10" height="132" fill="${color}" stroke="#000" stroke-opacity=".15"/>
    ${slats}
    <rect x="30" y="166" width="140" height="10" fill="#000" opacity=".25"/>`);
}

function svgWrap(inner) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    <rect x="6" y="186" width="188" height="6" rx="3" fill="#000" opacity=".06"/>${inner}</svg>`;
}
