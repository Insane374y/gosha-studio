// Зима: заснеженная загородная дорога в метель, машина снаружи и изнутри, снегопад. Используется в 10_blizzard_car.
// Мир: x — вдоль дороги, z — к зрителю (+) и от него (−), y — вверх. Машина стоит вдоль x, задом к +x.

// ------------------------------------------------ текстуры
function texSnow(g, w, h) {   // снег: мягкие голубоватые тени-наносы, искры
  const R = rng(41); g.fillStyle = "#eef4fb"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 18; i++) { const x = R() * w, y = R() * h, r = 60 + R() * 90; wrap(w, h, x, y, (X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, R() > 0.5 ? "rgba(190,210,235,0.45)" : "rgba(255,255,255,0.6)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r); }); }
  g.lineWidth = 4; g.lineCap = "round";
  for (let i = 0; i < 14; i++) { const x = R() * w, y = R() * h, l = 70 + R() * 90; wrap(w, h, x, y, (X, Y) => { g.strokeStyle = "rgba(170,195,225,0.5)"; g.beginPath(); g.moveTo(X, Y); g.quadraticCurveTo(X + l / 2, Y - 12, X + l, Y); g.stroke(); }); }
}
function texRoadSnow(g, w, h) {   // дорога под снегом: колеи, местами виден асфальт
  const R = rng(43); g.fillStyle = "#dfe6ef"; g.fillRect(0, 0, w, h);
  for (const y of [0.3, 0.42, 0.62, 0.74]) { g.fillStyle = "rgba(120,130,145,0.45)"; g.fillRect(0, y * h, w, 0.05 * h); }
  for (let i = 0; i < 10; i++) { const x = R() * w, y = R() * h, r = 40 + R() * 60; wrap(w, h, x, y, (X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, "rgba(255,255,255,0.7)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r); }); }
}

// небо метели: серо-голубая пелена, силуэты сосен в дымке; o.dusk 0..1 — темнеет к вечеру
function blizzardSky(t, o = {}) {
  return (g, cam) => {
    const f = cam.f, yaw = Math.atan2(f[0], -f[2]), F = cam.F, d = o.dusk ?? 0;
    const hz = cam.P([cam.pos[0] + f[0] * 4000, cam.pos[1], cam.pos[2] + f[2] * 4000]), hy = hz ? hz[1] : H * 0.55;
    const X = (a) => W / 2 + (a - yaw) * F;
    const top = d > 0.5 ? "#3a4560" : "#9fb0c8", low = d > 0.5 ? "#7d8aa3" : "#dfe7f1";
    const sky = g.createLinearGradient(0, hy - F * 0.8, 0, hy); sky.addColorStop(0, top); sky.addColorStop(1, low);
    g.fillStyle = sky; g.fillRect(0, 0, W, Math.max(0, hy + 4)); g.fillStyle = "#e3eaf3"; g.fillRect(0, hy, W, H);
    // два ряда сосен в дымке метели
    for (const [col, sc, off] of [["rgba(120,140,165,0.55)", 0.05, 0.13], ["rgba(85,105,130,0.75)", 0.075, 0]]) {
      g.fillStyle = col;
      for (let i = -40; i < 40; i++) { const a = i * 0.09 + off, x = X(a); if (x < -100 || x > W + 100) continue; const hh = sc * F * (0.7 + 0.5 * Math.abs(Math.sin(i * 7.3))), ww = hh * 0.36;
        g.beginPath(); g.moveTo(x, hy - hh); g.lineTo(x + ww, hy + 2); g.lineTo(x - ww, hy + 2); g.closePath(); g.fill(); } }
  };
}

// ------------------------------------------------ спрайты
function drawPine(g, x, y, k, snowK = 1) {
  g.save(); g.translate(x, y); g.strokeStyle = INKC; g.lineWidth = Math.max(2, 0.05 * k); g.lineJoin = "round";
  g.fillStyle = "#6b4a2a"; g.fillRect(-0.12 * k, -0.6 * k, 0.24 * k, 0.6 * k); g.strokeRect(-0.12 * k, -0.6 * k, 0.24 * k, 0.6 * k);
  for (let i = 0; i < 4; i++) { const yb = -0.5 - i * 0.9, w = 1.25 - i * 0.26, hh = 1.4;
    g.fillStyle = i % 2 ? "#2f6b4a" : "#2a5f42"; g.beginPath(); g.moveTo(0, (yb - hh) * k); g.lineTo(w * k, yb * k); g.lineTo(-w * k, yb * k); g.closePath(); g.fill(); g.stroke();
    if (snowK > 0) { g.fillStyle = "#f4f8fc"; g.beginPath(); g.moveTo(0, (yb - hh) * k); g.lineTo(w * 0.55 * k, (yb - hh * 0.45) * k); g.quadraticCurveTo(0, (yb - hh * 0.3) * k, -w * 0.55 * k, (yb - hh * 0.45) * k); g.closePath(); g.fill(); } }
  g.restore();
}
function drawSnowMound(g, x, y, k, w, h) {   // сугроб: мягкий бугор с голубой тенью
  if (h <= 0.01) return;
  g.save(); g.translate(x, y); g.strokeStyle = "rgba(60,80,110,0.55)"; g.lineWidth = Math.max(2, 0.03 * k);
  const gr = g.createLinearGradient(0, -h * k, 0, 0); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#c9d6e6");
  g.fillStyle = gr; g.beginPath(); g.moveTo(-w / 2 * k, 0); g.bezierCurveTo(-w * 0.45 * k, -h * 1.1 * k, w * 0.45 * k, -h * 1.1 * k, w / 2 * k, 0); g.closePath(); g.fill(); g.stroke();
  g.restore();
}
function drawPuff(g, x, y, r, a) { g.save(); g.globalAlpha = a; g.fillStyle = "#c7ccd4"; g.strokeStyle = "rgba(60,70,85,0.5)"; g.lineWidth = Math.max(1.5, r * 0.06);
  for (const [dx, dy, rr] of [[0, 0, 1], [-0.6, 0.2, 0.7], [0.6, 0.15, 0.75], [0, -0.45, 0.65]]) { g.beginPath(); g.arc(x + dx * r, y + dy * r, rr * r, 0, 7); g.fill(); g.stroke(); } g.restore(); }

// ------------------------------------------------ дорога в метель + машина. o.drift — высота сугроба у машины (м), o.exhaust 0/1 — мотор работает,
// o.carX/carZ, o.buried — 0..1 насколько засыпана выхлопная труба, o.lights — фары горят
function winterRoad(sc, t, o = {}) {
  sc.skybox(blizzardSky(t, o));
  sc.ground(-90, 90, -60, 40, 0, "#eef4fb", texSnow, "snow", { tile: 4, dist: 50 });
  sc.ground(-90, 90, -2.4, 2.4, 0.004, "#dfe6ef", texRoadSnow, "road", { tile: 4.8, dist: 50 });
  for (const [x, z, s] of o.pines ?? [[-9, -6, 1.1], [-4, -8, 1.3], [3, -7, 1.0], [8, -9, 1.4], [13, -6, 1.2], [-14, -10, 1.3], [17, -11, 1.1], [-7, 6, 1.2], [9, 7, 1.0], [20, 5, 1.2]])
    sc.sprite([x, 0, z], 0.4, (g, X, Y, k) => drawPine(g, X, Y, k * s));
  // столбики-отражатели вдоль обочины
  for (let x = -24; x <= 24; x += 8) sc.box([x, 0.5, -2.8], [0.08, 1.0, 0.08], "#e8453c", { zb: 0.1 });
  if (o.car !== false) car(sc, t, o);
}
function car(sc, t, o = {}) {
  const cx = o.carX ?? 0, cz = o.carZ ?? 0, col = o.color ?? "#d6453d", dr = o.drift ?? 0;
  sc.box([cx, 0.6, cz], [4.4, 0.7, 1.8], col, { zb: 0.3 });
  sc.box([cx + 0.25, 1.22, cz], [2.4, 0.58, 1.66], col, { zb: 0.29 });
  const glass = (g, w, h) => { g.fillStyle = "#9cc3e0"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,0.45)"; g.save(); g.translate(w * 0.25, 0); g.rotate(0.4); g.fillRect(0, -h, w * 0.12, h * 3); g.restore();
    g.strokeStyle = INKC; g.lineWidth = Math.max(2, w * 0.015); g.beginPath(); g.moveTo(w * 0.5, 0); g.lineTo(w * 0.5, h); g.stroke(); };
  sc.decal([cx + 0.25, 1.22, cz + 0.835], 2.2, 0.46, 0, glass, "carside", { zb: 0.2 });
  for (const dx of [-1.35, 1.3]) sc.box([cx + dx, 0.32, cz + 0.86], [0.66, 0.66, 0.14], "#20180f", { zb: 0.15, shadow: false });   // колёса
  // снег на крыше и капоте
  sc.box([cx + 0.25, 1.56, cz], [2.3, 0.12 + Math.min(0.25, dr * 0.2), 1.6], "#f4f8fc", { zb: 0.25, shadow: false, lw: 2 });
  sc.box([cx - 1.6, 0.99, cz], [1.1, 0.08 + Math.min(0.2, dr * 0.15), 1.7], "#f4f8fc", { zb: 0.25, shadow: false, lw: 2 });
  // фары и задние огни светятся (настоящие источники света)
  if (o.lights !== false) { sc.box([cx - 2.21, 0.72, cz + 0.6], [0.04, 0.16, 0.32], "#fff6c8", { glow: 0.9, shadow: false });
    sc.box([cx + 2.21, 0.72, cz + 0.62], [0.04, 0.14, 0.26], "#ff3b2f", { glow: 0.7, shadow: false }); }
  // выхлопная труба сзади + дым, пока не засыпана
  const px = cx + 2.25, pz = cz + 0.45, bur = o.buried ?? 0;
  sc.box([px, 0.28, pz], [0.22, 0.1, 0.1], "#5b5f68", { zb: 0.05, shadow: false });
  if (o.exhaust) { const n = 6; for (let i = 0; i < n; i++) { const ph = ((t * 0.8 + i / n) % 1), up = ph * 1.4 * (1 - bur);
      sc.sprite([px + 0.3 + ph * 1.2 * (1 - bur), 0.32 + up, pz + ph * 0.2], -0.1, (g, X, Y, k) => drawPuff(g, X, Y, (0.12 + ph * 0.3) * k, (1 - ph) * 0.7 * (1 - bur * 0.85))); } }
  // сугробы вокруг машины растут; сзади — над трубой
  if (dr > 0) for (const [dx, dz, w, hk] of [[2.6, 0.2, 1.8, 1.0], [-2.6, 0.1, 1.6, 0.8], [0.5, 1.15, 4.6, 0.75], [0.3, -1.2, 4.8, 0.9], [2.4, 1.0, 1.4, 1.1]])
    sc.sprite([cx + dx, 0, cz + dz], 0.2, (g, X, Y, k) => drawSnowMound(g, X, Y, k, w, dr * hk));
}

// ------------------------------------------------ салон машины: вид через лобовое стекло на водителя.
// Fobbin стоит в [0, 0, 0]; панель скрывает ноги. o.snowGlass 0..1 — лобовое стекло заносит снегом, o.radio — табло горит
function carInterior(sc, t, o = {}) {
  sc.skybox((g) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#2b3240"); gr.addColorStop(1, "#151a22"); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  // задняя стенка салона с задним окном (за ним — белая метель)
  sc.box([0, 1.2, -1.3], [2.4, 2.4, 0.1], "#3a4050", { zb: 0.5, shadow: false });
  sc.decal([0, 1.55, -1.24], 1.5, 0.55, 0, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#c9d3e0"); gr.addColorStop(1, "#eef3f8"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = "#fff"; for (let i = 0; i < 40; i++) { const x = ((i * 97 + t * 160) % w), y = ((i * 53 + t * 220 + i * i) % h); g.beginPath(); g.arc(x, y, w * 0.006, 0, 7); g.fill(); } }, null, { zb: 0.45, live: true });
  sc.box([0, 0.75, -0.42], [0.95, 1.5, 0.3], "#4b5262", { zb: 0.3, shadow: false });                    // спинка сиденья
  sc.box([0, 1.62, -0.42], [0.5, 0.3, 0.22], "#4b5262", { zb: 0.3, shadow: false });                    // подголовник
  sc.box([-1.0, 0.75, -0.42], [0.95, 1.5, 0.3], "#4b5262", { zb: 0.3, shadow: false });                 // пассажирское сиденье
  sc.box([0, 1.05, 2.75], [2.6, 0.06, 0.06], "#20180f", { zb: -0.2, shadow: false });                    // нижняя рамка стекла
  // приборная панель: ближе к камере, скрывает ноги; табло радио и часы светятся
  sc.box([0, 0.55, 0.85], [2.6, 0.9, 0.7], "#262b35", { zb: 0.05, shadow: false });
  sc.decal([0.55, 0.78, 1.205], 0.62, 0.22, 0, (g, w, h) => { g.fillStyle = "#0d1016"; g.fillRect(0, 0, w, h);
    if (o.radio !== false) { g.fillStyle = "#7fe0ff"; g.font = `800 ${h * 0.55}px ${FONT_TITLE}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(o.radioText ?? "♪ 98.7 FM", w / 2, h / 2); } },
    null, { zb: 0.01, live: true, emit: o.radio !== false ? (g, w, h) => { g.fillStyle = "#3fbfff"; g.fillRect(w * 0.1, h * 0.2, w * 0.8, h * 0.6); } : null });
  sc.decal([-0.35, 0.8, 1.205], 0.36, 0.2, 0, (g, w, h) => { g.fillStyle = "#0d1016"; g.fillRect(0, 0, w, h); g.strokeStyle = "#ffb347"; g.lineWidth = h * 0.08;
    g.beginPath(); g.arc(w / 2, h * 0.9, h * 0.6, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }, null, { zb: 0.01, emit: (g, w, h) => { g.fillStyle = "#ff9a30"; g.fillRect(w * 0.2, h * 0.3, w * 0.6, h * 0.5); } });
  // руль
  sc.sprite([0, 1.18, 0.62], -0.05, (g, X, Y, k) => { g.save(); g.translate(X, Y); g.scale(1, 0.85); g.strokeStyle = INKC; g.lineWidth = 0.08 * k; g.beginPath(); g.arc(0, 0, 0.27 * k, 0, 7); g.stroke();
    g.strokeStyle = "#3a3f4a"; g.lineWidth = 0.05 * k; g.stroke(); g.lineWidth = 0.05 * k; g.beginPath(); g.moveTo(-0.27 * k, 0); g.lineTo(0.27 * k, 0); g.moveTo(0, 0); g.lineTo(0, 0.27 * k); g.stroke();
    g.fillStyle = "#2a2f38"; g.beginPath(); g.arc(0, 0, 0.07 * k, 0, 7); g.fill(); g.restore(); });
  // лобовое стекло между камерой и водителем: лёгкий отблеск, по краям налипает снег
  const sg = o.snowGlass ?? 0;
  sc.sprite([0, 1.5, 1.6], -0.3, (g, X, Y, k) => { if (sg <= 0.01) return; g.save(); g.fillStyle = "#f4f8fc"; g.strokeStyle = "rgba(60,80,110,0.4)"; g.lineWidth = 3;
    const r = W * 1.2 * (1 - sg * 0.55); g.beginPath(); g.rect(-50, -50, W + 100, H + 100); g.ellipse(W / 2, H * 0.42, r * 0.55, r * 0.7, 0, 0, 7, true); g.fill("evenodd"); g.stroke(); g.restore(); });
}

// снегопад поверх кадра (крупные хлопья — это не «пыль», а сама метель). k — сила, wind — наклон
function snowfall(g, t, k = 1, wind = 0.5) {
  if (k <= 0) return;
  g.save(); g.fillStyle = "rgba(255,255,255,0.9)";
  const n = Math.round(110 * k);
  for (let i = 0; i < n; i++) { const h1 = Math.sin(i * 12.9898) * 43758.5453, fx = h1 - Math.floor(h1), sp = 180 + (i % 7) * 50, r = 2.5 + (i % 5) * 1.6;
    const y = ((fx * 7919 + t * sp) % (H + 40)) - 20, x = ((fx * W + t * sp * wind + Math.sin(t * 2 + i) * 20) % (W + 40) + W + 40) % (W + 40) - 20;
    g.globalAlpha = 0.5 + (i % 3) * 0.2; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.restore();
}
