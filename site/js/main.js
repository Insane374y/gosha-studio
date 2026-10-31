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
    <div class="cat-wrap"><a class="cat" href="${c.page}">
      <div class="cat__img">${drawPicture(c.pic.type, c.pic.color)}</div>
      <div class="cat__body"><h3>${c.title}</h3><p>${c.text}</p></div>
    </a></div>`).join("");
}

/* ---------- Карточка товара ---------- */
function productCard(p) {
  const color = COLORS[p.colors[0]].hex;
  const pic = p.photo ? `<img src="${p.photo}" alt="${p.title}">` : drawPicture("shutter", color);
  return `
  <article class="card">
    <a class="card__img" href="product.html#${p.id}">
      ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}${pic}
    </a>
    <div class="card__body">
      <a class="card__title" href="product.html#${p.id}">${p.title}</a>
      <ul class="card__props">
        <li>Профиль: ${p.profile} (${p.profileType.toLowerCase()})</li>
        <li>Управление: ${LABELS.control[p.control].toLowerCase()}</li>
        <li>Цветов: ${p.colors.length}</li>
      </ul>
      <div class="card__price">от ${rub(p.price)} <small>/ м²</small></div>
      <div class="card__actions">
        <a class="btn btn--outline" href="product.html#${p.id}">Подробнее</a>
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
  const id = +(location.hash.slice(1) || new URLSearchParams(location.search).get("id"));
  window.addEventListener("hashchange", () => location.reload());
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

/* =====================================================================
   АНИМАЦИИ И МЕХАНИКИ ПРИ ПРОКРУТКЕ
   ===================================================================== */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

/* ---------- Роллета в баннере: поднимается при прокрутке ---------- */
function heroShutterSvg() {
  let slats = "";
  for (let y = 50; y < 250; y += 10) {
    slats += `<rect x="40" y="${y}" width="220" height="10" fill="#d3deeb"/><rect x="40" y="${y + 8.5}" width="220" height="1.5" fill="#8fa6c2"/>`;
  }
  return `<svg viewBox="0 0 300 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Роллета на окне">
    <defs>
      <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb3ff"/><stop offset="1" stop-color="#d9ecff"/></linearGradient>
      <clipPath id="hs-clip"><rect x="40" y="50" width="220" height="205"/></clipPath>
    </defs>
    <rect x="44" y="54" width="212" height="196" fill="#f4f8fc"/>
    <rect x="54" y="64" width="192" height="176" fill="url(#hs-sky)"/>
    <circle cx="200" cy="105" r="20" fill="#fff6c8"/><circle cx="200" cy="105" r="30" fill="#fff6c8" opacity=".35"/>
    <path d="M54 205 Q100 170 150 195 T246 185 V240 H54 Z" fill="#3c7fd0"/>
    <path d="M54 222 Q120 195 180 215 T246 210 V240 H54 Z" fill="#1f5199"/>
    <rect x="147" y="64" width="6" height="176" fill="#f4f8fc"/><rect x="54" y="150" width="192" height="6" fill="#f4f8fc"/>
    <g clip-path="url(#hs-clip)"><g id="hs-slats">${slats}<rect x="40" y="248" width="220" height="8" fill="#6f87a6"/></g></g>
    <rect x="30" y="50" width="10" height="208" rx="2" fill="#e6edf6"/><rect x="260" y="50" width="10" height="208" rx="2" fill="#e6edf6"/>
    <rect x="26" y="16" width="248" height="38" rx="7" fill="#eef3f9"/><rect x="26" y="46" width="248" height="8" fill="#000" opacity=".08"/>
    <circle cx="256" cy="35" r="5" fill="#3b9eff"/>
  </svg>`;
}

function initHero() {
  const box = document.getElementById("hero-img");
  if (!box) return null;
  box.innerHTML = heroShutterSvg() + `<div class="hero__label" id="hero-label">Роллета открыта на 0%</div>`;
  const slats = document.getElementById("hs-slats");
  const label = document.getElementById("hero-label");
  const text = document.getElementById("hero-text");
  const hero = box.closest(".hero");
  return () => {
    const p = clamp01(window.scrollY / (hero.offsetHeight * 0.75));
    slats.setAttribute("transform", `translate(0 ${(-p * 205).toFixed(1)})`);
    label.textContent = p >= 0.99 ? "Роллета полностью открыта ☀" : `Роллета открыта на ${Math.round(p * 100)}%`;
    if (!reduceMotion && text) {
      text.style.transform = `translateY(${(window.scrollY * 0.25).toFixed(1)}px)`;
      text.style.opacity = (1 - p * 0.6).toFixed(2);
    }
  };
}

/* ---------- «Как мы работаем»: блок замирает, шаги листаются вбок ---------- */
function initPin() {
  const sec = document.querySelector(".pin");
  if (!sec) return null;
  const track = document.getElementById("pin-track");
  const line = document.getElementById("pin-line");
  const steps = [...track.children];
  const wide = window.matchMedia("(min-width: 901px)");
  const setMode = () => {
    sec.classList.toggle("pin--on", wide.matches && !reduceMotion);
    if (!sec.classList.contains("pin--on")) track.style.transform = "";
  };
  wide.addEventListener("change", setMode);
  setMode();

  return (headerH) => {
    const r = sec.getBoundingClientRect();
    let p;
    if (sec.classList.contains("pin--on")) {
      const total = sec.offsetHeight - (window.innerHeight - headerH);
      p = clamp01((headerH - r.top) / total);
      const maxShift = Math.max(0, track.scrollWidth - track.clientWidth);
      track.style.transform = `translateX(${(-p * maxShift).toFixed(1)}px)`;
    } else {
      p = clamp01((window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.2));
    }
    line.style.width = (p * 100).toFixed(1) + "%";
    steps.forEach((s, i) => s.classList.toggle("active", p >= i / (steps.length - 1) - 0.03));
  };
}

/* ---------- Блоки плавно выезжают снизу ---------- */
function initReveal() {
  if (!window.matchMedia("(min-width: 701px)").matches) document.getElementById("cats")?.setAttribute("data-stagger", "");
  const items = [];
  document.querySelectorAll("[data-reveal]").forEach((el) => items.push([el, 0]));
  document.querySelectorAll("[data-stagger]").forEach((wrap) => {
    [...wrap.children].forEach((el, i) => items.push([el, (i % 4) * 0.09]));
  });
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      el.classList.add("reveal-in");
      requestAnimationFrame(() => el.classList.remove("reveal-pending"));
      setTimeout(() => el.classList.remove("reveal-in"), 1400);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach(([el, d]) => {
    // то, что видно сразу при загрузке, не прячем
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.style.setProperty("--d", d + "s");
    el.classList.add("reveal-pending");
    io.observe(el);
  });
}

/* ---------- Цифры-счётчики ---------- */
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  const run = (el) => {
    const raw = el.dataset.count;
    const to = raw === "models" ? PRODUCTS.length : +raw;
    const from = to === 0 ? 5000 : 0; // «0 ₽» красиво «сбегает» с 5000 до нуля
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = to.toLocaleString("ru-RU") + suffix; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const k = clamp01((t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e).toLocaleString("ru-RU") + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { io.unobserve(e.target); run(e.target); }
  }), { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
}

/* ---------- Карточки наклоняются за мышью ---------- */
function initTilt() {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
  const sel = ".card, .cat, .feature, .stat";
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest(sel);
    document.querySelectorAll(".tilting").forEach((x) => { if (x !== el) resetTilt(x); });
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.classList.add("tilt", "tilting");
    el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
  });
  document.addEventListener("pointerleave", () => document.querySelectorAll(".tilting").forEach(resetTilt));
  function resetTilt(x) { x.classList.remove("tilting"); x.style.transform = ""; }
}

/* ---------- Запуск: всё, что зависит от прокрутки ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);

  const up = document.createElement("button");
  up.className = "to-top";
  up.setAttribute("aria-label", "Наверх");
  up.textContent = "↑";
  up.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  document.body.appendChild(up);

  const header = document.querySelector(".header");
  const heroUpdate = initHero();
  const pinUpdate = initPin();
  initReveal();
  initCounters();
  initTilt();

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
    header?.classList.toggle("compact", y > 60);
    up.classList.toggle("show", y > 600);
    const headerH = header ? header.offsetHeight : 0;
    document.documentElement.style.setProperty("--header-h", headerH + "px");
    heroUpdate?.();
    pinUpdate?.(headerH);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
});

/* =====================================================================
   СОВРЕМЕННЫЕ ЭФФЕКТЫ
   ===================================================================== */
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- Заголовок по словам ---------- */
function initSplit() {
  document.querySelectorAll("[data-split]").forEach((h) => {
    let i = 0;
    const wrap = (text, shine) => text.split(/(\s+)/).map((part) =>
      /^\s+$/.test(part) || !part ? part : `<span class="w${shine ? " shine" : ""}" style="--i:${i++}">${part}</span>`).join("");
    h.innerHTML = [...h.childNodes].map((n) =>
      n.nodeType === 3 ? wrap(n.textContent, false) : `<em>${wrap(n.textContent, true)}</em>`).join("");
  });
}

/* ---------- Бегущая строка: скорость и направление зависят от прокрутки ---------- */
function initTicker() {
  const track = document.getElementById("ticker");
  if (!track) return;
  track.innerHTML += track.innerHTML; // две копии — для бесконечной ленты
  if (reduceMotion) return;
  let x = 0, dir = 1, lastY = window.scrollY, boost = 0;
  const loop = () => {
    const y = window.scrollY, dy = y - lastY;
    lastY = y;
    if (dy !== 0) dir = dy > 0 ? 1 : -1;
    boost = boost * 0.92 + Math.min(Math.abs(dy), 80) * 0.08;
    x -= dir * (0.6 + boost * 0.9);
    const half = track.scrollWidth / 2;
    if (x <= -half) x += half;
    if (x > 0) x -= half;
    track.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${(-dir * Math.min(boost, 12) * 0.6).toFixed(2)}deg)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ---------- Каталог продукции раздвигается из стопки ---------- */
function initSpread() {
  const grid = document.getElementById("cats");
  if (!grid || reduceMotion) return null;
  const items = [...grid.children];
  const wide = window.matchMedia("(min-width: 701px)");
  if (!wide.matches) return null; // на телефоне карточки просто появляются по очереди
  const mid = (items.length - 1) / 2;
  return () => {
    if (!wide.matches) { items.forEach((el) => (el.style.transform = "")); return; }
    const r = grid.getBoundingClientRect();
    const p = clamp01((window.innerHeight - r.top) / (window.innerHeight * 0.75));
    const k = Math.pow(1 - p, 3); // 1 — стопка, 0 — разложены
    items.forEach((el, i) => {
      const dx = grid.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
      const dy = grid.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2);
      el.style.transform = k < 0.001 ? "" :
        `translate(${(dx * k).toFixed(1)}px, ${(dy * k).toFixed(1)}px) rotate(${((i - mid) * 8 * k).toFixed(2)}deg) scale(${(1 - 0.22 * k).toFixed(3)})`;
      el.style.zIndex = String(10 - Math.round(Math.abs(i - mid) * 2));
    });
  };
}

/* ---------- Lens sweep: координаты курсора для подсветки ---------- */
const GLOW_SEL = ".btn, .cat, .card, .feature, .stat, .cta, .hero__img, .contacts__box";
function initGlow() {
  document.addEventListener("pointermove", (e) => {
    let el = e.target.closest?.(GLOW_SEL);
    while (el) {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el = el.parentElement?.closest(GLOW_SEL);
    }
  }, { passive: true });
}

/* ---------- Свой курсор ---------- */
function initCursor() {
  if (!finePointer || reduceMotion) return;
  const ring = document.createElement("div"); ring.className = "cursor";
  const dot = document.createElement("div"); dot.className = "cursor-dot";
  document.body.append(ring, dot);
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    ring.classList.add("on"); dot.classList.add("on");
    ring.classList.toggle("big", !!e.target.closest?.("a, button, input, select, textarea, label, .cat, .card"));
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { ring.classList.remove("on"); dot.classList.remove("on"); });
  const loop = () => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ---------- Кнопки-магниты ---------- */
function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll(".hero__btns .btn, .header__cta, .cta .btn").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      b.style.transform = `translate(${(x * 0.22).toFixed(1)}px, ${(y * 0.3).toFixed(1)}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
}

/* ---------- Линия под заголовками ---------- */
function initHeadings() {
  const hs = document.querySelectorAll(".section h2, .seo-text h2");
  if (reduceMotion || !("IntersectionObserver" in window)) { hs.forEach((h) => h.classList.add("seen")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("seen"); io.unobserve(e.target); }
  }), { threshold: 0.6 });
  hs.forEach((h) => io.observe(h));
}

document.addEventListener("DOMContentLoaded", () => {
  initSplit();
  initTicker();
  initGlow();
  initCursor();
  initMagnetic();
  initHeadings();
  const spread = initSpread();
  if (spread) {
    let t = false;
    const go = () => { if (!t) { t = true; requestAnimationFrame(() => { t = false; spread(); }); } };
    window.addEventListener("scroll", go, { passive: true });
    window.addEventListener("resize", go);
    spread();
  }
});
