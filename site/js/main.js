/* =====================================================================
   Логика сайта: шапка, подвал, окно заявки, каталог с фильтрами,
   страница товара с калькулятором.
   ===================================================================== */

const rub = (n) => Math.round(n).toLocaleString("ru-RU") + " ₽";

/* ---------- Шапка и подвал (одни на все страницы) ---------- */
function renderHeader(active) {
  const links = [
    ["index.html", "Главная"],
    ["catalog.html", "Каталог"],
    ["index.html#services", "Услуги"],
    ["index.html#steps", "Как мы работаем"],
    ["contacts.html", "Контакты"],
  ];
  const el = document.getElementById("header");
  if (!el) return;
  el.innerHTML = `
  <div class="topbar"><div class="container">
    <span class="topbar__address">📍 ${COMPANY.city}, ${COMPANY.address}</span>
    <a href="mailto:${COMPANY.email}">✉ ${COMPANY.email}</a>
  </div></div>
  <header class="header"><div class="container header__row">
    <a class="logo" href="index.html">
      <span class="logo__mark">${logoSvg()}</span>
      <span>${COMPANY.name}<small>${COMPANY.slogan}</small></span>
    </a>
    <div class="header__contacts">
      <a class="header__phone" href="tel:${COMPANY.phoneLink}">${COMPANY.phone}</a>
      <div class="header__hours">${COMPANY.hours}</div>
    </div>
    <button class="btn header__cta" data-modal="Заказать звонок">Заказать звонок</button>
    <button class="burger" aria-label="Меню" onclick="document.getElementById('nav').classList.toggle('open')"><span></span><span></span><span></span></button>
  </div>
  <nav class="nav" id="nav"><div class="container"><ul>
    ${links.map(([href, t]) => `<li><a href="${href}" class="${active === href ? "active" : ""}">${t}</a></li>`).join("")}
  </ul></div></nav>
  </header>`;
}

function logoSvg() {
  return `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="5" rx="1" fill="#fff"/>
  <rect x="4" y="9" width="16" height="2" fill="#fff"/><rect x="4" y="13" width="16" height="2" fill="#fff"/><rect x="4" y="17" width="16" height="2" fill="#fff"/></svg>`;
}

function renderFooter() {
  const el = document.getElementById("footer");
  if (!el) return;
  el.innerHTML = `
  <footer class="footer"><div class="container">
    <div class="footer__grid">
      <div>
        <h4>${COMPANY.name}</h4>
        <p>${COMPANY.slogan}. Замер, изготовление, установка и сервис.</p>
      </div>
      <div><h4>Каталог</h4><ul>
        ${CATEGORIES.slice(0, 4).map(c => `<li><a href="${c.page}">${c.title}</a></li>`).join("")}
      </ul></div>
      <div><h4>Компания</h4><ul>
        <li><a href="index.html#services">Услуги</a></li>
        <li><a href="index.html#steps">Как мы работаем</a></li>
        <li><a href="contacts.html">Контакты</a></li>
      </ul></div>
      <div><h4>Контакты</h4><ul>
        <li><a href="tel:${COMPANY.phoneLink}">${COMPANY.phone}</a></li>
        <li><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></li>
        <li>${COMPANY.city}, ${COMPANY.address}</li>
      </ul></div>
    </div>
    <div class="footer__bottom">© ${new Date().getFullYear()} ${COMPANY.name}. Информация на сайте не является публичной офертой.</div>
  </div></footer>`;
}

/* ---------- Всплывающее окно «Заявка» ---------- */
function renderModal() {
  const div = document.createElement("div");
  div.className = "modal";
  div.id = "modal";
  div.innerHTML = `
  <div class="modal__box">
    <button class="modal__close" aria-label="Закрыть">×</button>
    <div class="modal__form">
      <h3 id="modal-title">Заказать звонок</h3>
      <p class="form__note" id="modal-sub">Оставьте телефон — перезвоним в течение 15 минут в рабочее время.</p>
      <form class="form" data-form>
        <input type="text" name="name" placeholder="Ваше имя" required>
        <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required>
        <input type="hidden" name="subject" id="modal-subject">
        <button class="btn btn--block" type="submit">Отправить</button>
        <p class="form__note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
      </form>
    </div>
    <div class="modal__ok"><h3>Спасибо!</h3><p>Заявка принята. Мы скоро свяжемся с вами.</p></div>
  </div>`;
  document.body.appendChild(div);

  div.addEventListener("click", (e) => {
    if (e.target === div || e.target.classList.contains("modal__close")) closeModal();
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());
}

function openModal(title, subject) {
  const m = document.getElementById("modal");
  m.querySelector(".modal__form").style.display = "";
  m.querySelector(".modal__ok").classList.remove("show");
  document.getElementById("modal-title").textContent = title || "Заказать звонок";
  document.getElementById("modal-subject").value = subject || title || "";
  m.classList.add("open");
  m.querySelector("input[name=name]").focus();
}
function closeModal() { document.getElementById("modal")?.classList.remove("open"); }

// Кнопки с атрибутом data-modal открывают окно
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-modal]");
  if (b) { e.preventDefault(); openModal(b.dataset.modal, b.dataset.subject); }
});

// Отправка любой формы с data-form.
// ВАЖНО: сейчас заявка никуда не уходит — только показывается «Спасибо».
// Чтобы получать заявки, нужно подключить отправку (на почту / в Telegram) — см. README.
document.addEventListener("submit", (e) => {
  const form = e.target.closest("[data-form]");
  if (!form) return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  console.log("Заявка:", data);
  const modal = form.closest(".modal");
  if (modal) {
    modal.querySelector(".modal__form").style.display = "none";
    modal.querySelector(".modal__ok").classList.add("show");
  } else {
    form.innerHTML = `<p style="font-size:18px"><b>Спасибо!</b> Заявка принята, мы скоро свяжемся с вами.</p>`;
  }
});

/* ---------- Главная: плитки разделов ---------- */
function renderCategories() {
  const el = document.getElementById("cats");
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => `
    <a class="cat" href="${c.page}">
      <div class="cat__img">${drawPicture(c.pic.type, c.pic.color)}</div>
      <div class="cat__body"><h3>${c.title}</h3><p>${c.text}</p></div>
    </a>`).join("");
}

/* ---------- Карточка товара ---------- */
function productCard(p) {
  const color = COLORS[p.colors[0]].hex;
  const pic = p.photo ? `<img src="${p.photo}" alt="${p.title}">` : drawPicture("shutter", color);
  return `
  <article class="card">
    <a class="card__img" href="product.html?id=${p.id}">
      ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}${pic}
    </a>
    <div class="card__body">
      <a class="card__title" href="product.html?id=${p.id}">${p.title}</a>
      <ul class="card__props">
        <li>Профиль: ${p.profile} (${p.profileType.toLowerCase()})</li>
        <li>Управление: ${LABELS.control[p.control].toLowerCase()}</li>
        <li>Цветов: ${p.colors.length}</li>
      </ul>
      <div class="card__price">от ${rub(p.price)} <small>/ м²</small></div>
      <div class="card__actions">
        <a class="btn btn--outline" href="product.html?id=${p.id}">Подробнее</a>
        <button class="btn" data-modal="Рассчитать стоимость" data-subject="${p.title}">Расчёт</button>
      </div>
    </div>
  </article>`;
}

/* ---------- Каталог с фильтрами ---------- */
function initCatalog() {
  const list = document.getElementById("products");
  if (!list) return;

  const filters = document.getElementById("filters");
  const groups = [
    ["place", "Куда устанавливать", LABELS.place],
    ["control", "Управление", LABELS.control],
    ["profileType", "Тип профиля", { "Пенонаполненный": "Пенонаполненный", "Экструдированный": "Экструдированный (прочнее)" }],
    ["colors", "Цвет", Object.fromEntries(Object.entries(COLORS).map(([k, v]) => [k, v.name]))],
  ];
  const prices = PRODUCTS.map(p => p.price);
  filters.querySelector("[data-groups]").innerHTML = groups.map(([key, title, opts]) => `
    <div class="filter-group"><div class="filter-group__title">${title}</div>
      ${Object.entries(opts).map(([v, t]) => `<label><input type="checkbox" name="${key}" value="${v}"> ${t}</label>`).join("")}
    </div>`).join("") + `
    <div class="filter-group"><div class="filter-group__title">Цена за м², ₽</div>
      <div class="price-range">
        <input type="number" id="price-min" placeholder="от ${Math.min(...prices)}" min="0" step="100">
        <input type="number" id="price-max" placeholder="до ${Math.max(...prices)}" min="0" step="100">
      </div>
    </div>`;

  const sort = document.getElementById("sort");
  const count = document.getElementById("count");

  function apply() {
    const checked = (name) => [...filters.querySelectorAll(`input[name=${name}]:checked`)].map(i => i.value);
    const min = +document.getElementById("price-min").value || 0;
    const max = +document.getElementById("price-max").value || Infinity;
    let items = PRODUCTS.filter(p => {
      for (const [key] of groups) {
        const sel = checked(key);
        if (!sel.length) continue;
        const val = p[key];
        if (Array.isArray(val) ? !sel.some(s => val.includes(s)) : !sel.includes(val)) return false;
      }
      return p.price >= min && p.price <= max;
    });
    if (sort.value === "cheap") items.sort((a, b) => a.price - b.price);
    if (sort.value === "expensive") items.sort((a, b) => b.price - a.price);
    count.textContent = `Найдено товаров: ${items.length}`;
    list.innerHTML = items.length ? items.map(productCard).join("")
      : `<div class="empty">Ничего не нашлось. Попробуйте убрать часть фильтров.</div>`;
  }

  filters.addEventListener("input", apply);
  sort.addEventListener("change", apply);
  document.getElementById("reset").addEventListener("click", () => {
    filters.querySelectorAll("input").forEach(i => (i.type === "checkbox" ? (i.checked = false) : (i.value = "")));
    apply();
  });
  document.getElementById("filters-toggle").addEventListener("click", () => filters.classList.toggle("open"));
  apply();
}

/* ---------- Страница товара ---------- */
function initProduct() {
  const el = document.getElementById("product");
  if (!el) return;
  const id = +new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  document.title = `${p.title} — ${COMPANY.name}`;
  document.getElementById("crumb").textContent = p.title;

  el.innerHTML = `
    <div class="product__img" id="pimg">${drawPicture("shutter", COLORS[p.colors[0]].hex)}</div>
    <div>
      <h1>${p.title}</h1>
      <div class="product__price">от ${rub(p.price)} <small>за м²</small></div>
      <div>Цвет: <b id="color-name">${COLORS[p.colors[0]].name}</b></div>
      <div class="colors">${p.colors.map((c, i) => `<button class="color ${i === 0 ? "active" : ""}" data-color="${c}" title="${COLORS[c].name}" style="background:${COLORS[c].hex}"></button>`).join("")}</div>
      <div class="calc">
        <b>Калькулятор стоимости</b>
        <div class="calc__row" style="margin-top:10px">
          <label>Ширина, м <input type="number" id="w" value="1.5" min="0.5" max="${p.maxWidth}" step="0.1"></label>
          <label>Высота, м <input type="number" id="h" value="1.5" min="0.5" max="${p.maxHeight}" step="0.1"></label>
        </div>
        <div>Примерная цена: <span class="calc__result" id="total"></span></div>
        <div class="form__note">Точная цена — после бесплатного замера. Минимальный заказ — 1 м².</div>
      </div>
      <button class="btn" data-modal="Вызвать замерщика" data-subject="${p.title}">Вызвать замерщика бесплатно</button>
      <table class="specs">
        <tr><td>Профиль</td><td>${p.profile}</td></tr>
        <tr><td>Тип профиля</td><td>${p.profileType}</td></tr>
        <tr><td>Управление</td><td>${LABELS.control[p.control]}</td></tr>
        <tr><td>Назначение</td><td>${LABELS.place[p.place]}</td></tr>
        <tr><td>Защита от взлома</td><td>${p.protection}</td></tr>
        <tr><td>Макс. размер (Ш × В)</td><td>${p.maxWidth} × ${p.maxHeight} м</td></tr>
        <tr><td>Гарантия</td><td>3 года</td></tr>
      </table>
    </div>`;

  const calc = () => {
    const w = Math.max(0, +document.getElementById("w").value);
    const h = Math.max(0, +document.getElementById("h").value);
    const area = Math.max(1, w * h);
    let txt = rub(area * p.price);
    if (w > p.maxWidth || h > p.maxHeight) txt += " (размер больше стандартного — уточните у менеджера)";
    document.getElementById("total").textContent = txt;
  };
  el.addEventListener("input", calc);
  el.querySelectorAll(".color").forEach(b => b.addEventListener("click", () => {
    el.querySelectorAll(".color").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    document.getElementById("color-name").textContent = COLORS[b.dataset.color].name;
    document.getElementById("pimg").innerHTML = drawPicture("shutter", COLORS[b.dataset.color].hex);
  }));
  calc();

  // Похожие товары
  const similar = PRODUCTS.filter(x => x.id !== p.id && (x.place === p.place || x.control === p.control)).slice(0, 4);
  document.getElementById("similar").innerHTML = similar.map(productCard).join("");
}

/* ---------- Запуск ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader(document.body.dataset.page);
  renderFooter();
  renderModal();
  renderCategories();
  initCatalog();
  initProduct();
  document.querySelectorAll("[data-phone]").forEach(e => { e.textContent = COMPANY.phone; e.href = "tel:" + COMPANY.phoneLink; });
  document.querySelectorAll("[data-email]").forEach(e => { e.textContent = COMPANY.email; e.href = "mailto:" + COMPANY.email; });
  document.querySelectorAll("[data-address]").forEach(e => { e.textContent = `${COMPANY.city}, ${COMPANY.address}`; });
  document.querySelectorAll("[data-hours]").forEach(e => { e.textContent = COMPANY.hours; });
});
