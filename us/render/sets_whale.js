// Под водой и внутри кита: открытое море (Мексиканский залив), кашалот, гигантский кальмар, желудок кита.
// Мир под водой: поверхность — плоскость y = 0, вниз — минус y. Свет только от солнца через поверхность (лучи, блик).

// ------------------------------------------------ толща воды (skybox): светлее к поверхности, темнее в глубину
// o.depth — 0..1, насколько глубоко (всё темнеет до почти чёрного), o.rays — сила солнечных лучей
function seaSky(t, o = {}) {
  return (g, cam) => {
    const f = cam.f, F = cam.F, d = o.depth ?? 0;
    const hz = cam.P([cam.pos[0] + f[0] * 4000, cam.pos[1], cam.pos[2] + f[2] * 4000]), hy = hz ? hz[1] : H * 0.5;
    const Y = (e) => hy - Math.tan(e) * F;
    const mixc = (a, b, k) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); return `rgb(${[16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k)).join(",")})`; };
    const top = mixc("#5fd0e8", "#0b2a4a", d), mid = mixc("#1f7fb8", "#061a33", d), low = mixc("#0b3561", "#02070f", d);
    const gr = g.createLinearGradient(0, Y(1.2), 0, Y(-1.2));
    gr.addColorStop(0, top); gr.addColorStop(0.5, mid); gr.addColorStop(1, low);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // солнечные лучи сверху: мягкие клинья, качаются; светятся (идут в световой слой)
    const rays = (o.rays ?? 1) * (1 - d);
    if (rays > 0.02) {
      const sy = Y(1.1);
      g.save(); g.globalCompositeOperation = "screen";
      for (let i = 0; i < 7; i++) { const x0 = W * (0.1 + i * 0.14) + Math.sin(t * 0.5 + i * 2) * 40, sp = 70 + (i % 3) * 40, len = H * 1.1;
        const lg = g.createLinearGradient(0, sy, 0, sy + len); lg.addColorStop(0, `rgba(210,250,255,${0.28 * rays})`); lg.addColorStop(1, "rgba(210,250,255,0)");
        g.fillStyle = lg; g.beginPath(); g.moveTo(x0 - sp * 0.3, sy); g.lineTo(x0 + sp * 0.3, sy); g.lineTo(x0 + sp + 120, sy + len); g.lineTo(x0 - sp + 60, sy + len); g.closePath(); g.fill(); }
      g.restore();
      if (sy > -200) emitGlow(W * 0.55, Math.max(sy, -40), W * 0.5, "#bff4ff", 0.5 * rays);
    }
  };
}
// поверхность воды снизу: светлая рябь
function texSurface(g, w, h) {
  const R = rng(17); g.fillStyle = "#8fe3f2"; g.fillRect(0, 0, w, h);
  g.lineWidth = 6; g.lineCap = "round";
  for (let i = 0; i < 40; i++) { const x = R() * w, y = R() * h, l = 40 + R() * 70; wrap(w, h, x, y, (X, Y) => { g.strokeStyle = R() > 0.5 ? "rgba(255,255,255,0.75)" : "rgba(60,170,210,0.6)"; g.beginPath(); g.moveTo(X, Y); g.quadraticCurveTo(X + l / 2, Y - 14, X + l, Y); g.stroke(); }); }
}
function underwater(sc, t, o = {}) {
  sc.skybox(seaSky(t, o));
  // стайки мелких рыб — живая деталь
  for (const [cx, cy, cz, n, col] of o.fish ?? [[-5, -2.5, -12, 7, "#f2b84b"], [6, -4, -16, 6, "#7fd0f0"]])
    for (let i = 0; i < n; i++) { const x = cx + ((t * 0.8 + i * 0.7) % 6) - 3, y = cy + Math.sin(i * 1.7 + t) * 0.4, z = cz + Math.cos(i * 2.3) * 0.8;
      sc.sprite([x, y, z], 0, (g, X, Y, k) => drawFish(g, X, Y, k * 0.6, t, { color: col })); }
  // пузырьки
  for (const [x, y0, z] of o.bubbles ?? []) for (let i = 0; i < 5; i++) { const y = y0 + ((t * 0.9 + i * 0.37) % 2.2);
    sc.sprite([x + Math.sin(t * 3 + i) * 0.06, y, z], -0.1, (g, X, Y, k) => { g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = Math.max(1.5, 0.012 * k); g.beginPath(); g.arc(X, Y, (0.03 + (i % 3) * 0.015) * k, 0, 7); g.stroke(); }); }
}

// ------------------------------------------------ кашалот (вид сбоку). k — пикселей на метр, длина ~13 м.
// o.jaw 0..1 — насколько открыта нижняя челюсть; o.rot — наклон (голова вниз при нырянии > 0); o.flip — смотрит вправо
function drawWhale(g, x, y, k, t, o = {}) {
  const s = k; g.save(); g.translate(x, y); if (o.flip) g.scale(-1, 1); g.rotate(o.rot ?? 0);
  g.lineJoin = "round"; g.lineCap = "round";
  const fl = Math.sin(t * 2.2 + (o.seed ?? 0)) * 0.5;   // взмах хвоста
  const ink = Math.max(2.5, 0.06 * s);
  // хвостовые лопасти
  g.fillStyle = "#4a5361"; g.strokeStyle = INKC; g.lineWidth = ink;
  g.beginPath(); g.moveTo(5.6 * s, 0.1 * s); g.quadraticCurveTo(6.6 * s, (-0.9 + fl) * s, 7.4 * s, (-1.4 + fl * 1.4) * s); g.quadraticCurveTo(6.9 * s, (0 + fl * 0.6) * s, 7.4 * s, (1.4 + fl * 1.4) * s);
  g.quadraticCurveTo(6.6 * s, (0.9 + fl) * s, 5.6 * s, 0.25 * s); g.closePath(); g.fill(); g.stroke();
  // нижняя челюсть (за головой): узкая, длинная, с зубами; открывается вниз вокруг шарнира
  const a = (o.jaw ?? 0) * 0.85;
  if (a > 0.02) {   // открытая пасть: тёмно-красное нутро
    g.fillStyle = "#5a1620"; g.beginPath(); g.moveTo(-2.4 * s, 0.95 * s); g.lineTo(-6.2 * s, 1.0 * s);
    g.lineTo(-2.4 * s - Math.cos(a) * 3.7 * s, 0.95 * s + Math.sin(a) * 3.7 * s); g.closePath(); g.fill();
    g.fillStyle = "#2a0710"; g.beginPath(); g.ellipse(-2.6 * s, 1.05 * s, 0.35 * s, 0.25 * s, 0, 0, 7); g.fill();   // глотка
  }
  g.save(); g.translate(-2.4 * s, 0.95 * s); g.rotate(-a);
  g.fillStyle = "#d9dde2"; g.strokeStyle = INKC; g.lineWidth = ink;
  g.beginPath(); g.moveTo(0, -0.15 * s); g.lineTo(-3.7 * s, -0.05 * s); g.quadraticCurveTo(-3.95 * s, 0.12 * s, -3.6 * s, 0.25 * s); g.lineTo(0, 0.4 * s); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#fffaf0"; for (let i = 0; i < 9; i++) { const tx = (-0.5 - i * 0.36) * s; g.beginPath(); g.moveTo(tx, -0.1 * s); g.lineTo(tx + 0.09 * s, -0.33 * s); g.lineTo(tx + 0.18 * s, -0.1 * s); g.closePath(); g.fill(); g.lineWidth = ink * 0.5; g.stroke(); }
  g.restore();
  // тело: огромная «коробка» головы и сужение к хвосту
  const body = () => { g.beginPath(); g.moveTo(-6.4 * s, -0.9 * s); g.quadraticCurveTo(-6.5 * s, -1.75 * s, -5.4 * s, -1.75 * s); g.lineTo(-2.0 * s, -1.8 * s);
    g.quadraticCurveTo(1.5 * s, -1.75 * s, 3.4 * s, -0.95 * s); g.quadraticCurveTo(4.8 * s, -0.4 * s, 5.8 * s, 0.05 * s); g.lineTo(5.8 * s, 0.35 * s);
    g.quadraticCurveTo(3.5 * s, 0.9 * s, 0.5 * s, 1.35 * s); g.quadraticCurveTo(-1.5 * s, 1.5 * s, -2.4 * s, 1.0 * s); g.lineTo(-6.0 * s, 0.85 * s); g.quadraticCurveTo(-6.45 * s, 0.6 * s, -6.4 * s, -0.9 * s); g.closePath(); };
  const bg = g.createLinearGradient(0, -1.8 * s, 0, 1.4 * s); bg.addColorStop(0, "#5b6676"); bg.addColorStop(0.7, "#4a5361"); bg.addColorStop(1, "#6f7a88");
  g.fillStyle = bg; body(); g.fill();
  // морщины на коже (кашалот — морщинистый), спинной горб, грудной плавник, глаз, дыхало
  g.save(); body(); g.clip();
  g.strokeStyle = "rgba(30,36,46,0.35)"; g.lineWidth = Math.max(1.5, 0.035 * s);
  for (let i = 0; i < 16; i++) { const xx = (-0.5 + i * 0.38) * s; g.beginPath(); g.moveTo(xx, -1.6 * s); g.quadraticCurveTo(xx + 0.15 * s, 0, xx - 0.05 * s, 1.4 * s); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.1)"; g.beginPath(); g.ellipse(-4.2 * s, -1.25 * s, 1.8 * s, 0.25 * s, 0, 0, 7); g.fill();
  g.restore();
  g.strokeStyle = INKC; g.lineWidth = ink; body(); g.stroke();
  g.fillStyle = "#4a5361"; g.beginPath(); g.moveTo(2.2 * s, -1.45 * s); g.quadraticCurveTo(2.7 * s, -1.85 * s, 3.1 * s, -1.2 * s); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-1.6 * s, 0.9 * s); g.quadraticCurveTo(-1.0 * s, (1.8 + fl * 0.2) * s, -0.4 * s, 1.75 * s); g.quadraticCurveTo(-0.8 * s, 1.3 * s, -1.0 * s, 1.0 * s); g.fill(); g.stroke();
  g.fillStyle = "#fffaf0"; g.beginPath(); g.ellipse(-2.15 * s, 0.45 * s, 0.17 * s, 0.13 * s, 0, 0, 7); g.fill(); g.lineWidth = ink * 0.7; g.stroke();
  g.fillStyle = INKC; g.beginPath(); g.arc(-2.2 * s, 0.46 * s, 0.08 * s, 0, 7); g.fill();
  g.beginPath(); g.ellipse(-6.0 * s, -1.68 * s, 0.14 * s, 0.05 * s, -0.3, 0, 7); g.fill();
  g.restore();
}
// гигантский кальмар: длинная мантия, глаз, щупальца волной
function drawSquid(g, x, y, k, t, o = {}) {
  const s = k; g.save(); g.translate(x, y); g.rotate(o.rot ?? 0); g.lineJoin = "round"; g.lineCap = "round";
  g.strokeStyle = "#b8403a"; for (let i = 0; i < 8; i++) { g.lineWidth = Math.max(2, (i < 2 ? 0.09 : 0.12) * s); g.beginPath(); g.moveTo(-0.2 * s, (i - 3.5) * 0.08 * s);
    for (let j = 1; j <= 8; j++) { const xx = -0.2 * s - j * (i < 2 ? 0.55 : 0.32) * s, yy = (i - 3.5) * (0.08 + j * 0.03) * s + Math.sin(t * 4 + j * 0.8 + i) * 0.12 * s; g.lineTo(xx, yy); } g.stroke(); }
  g.fillStyle = "#e0685a"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, 0.05 * s);
  g.beginPath(); g.moveTo(-0.2 * s, -0.4 * s); g.quadraticCurveTo(1.6 * s, -0.55 * s, 2.6 * s, 0); g.quadraticCurveTo(1.6 * s, 0.55 * s, -0.2 * s, 0.4 * s); g.quadraticCurveTo(-0.45 * s, 0, -0.2 * s, -0.4 * s); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(2.1 * s, -0.12 * s); g.lineTo(2.9 * s, -0.5 * s); g.lineTo(2.6 * s, 0); g.lineTo(2.9 * s, 0.5 * s); g.lineTo(2.1 * s, 0.12 * s); g.fill(); g.stroke();
  g.fillStyle = "#fffaf0"; g.beginPath(); g.arc(0.1 * s, -0.05 * s, 0.16 * s, 0, 7); g.fill(); g.stroke(); g.fillStyle = INKC; g.beginPath(); g.arc(0.06 * s, -0.05 * s, 0.08 * s, 0, 7); g.fill();
  g.restore();
}

// ------------------------------------------------ внутри кита: мясистые стенки, складки, слизь. Освещение условное (тускло-красное),
// без источников света — «полная темнота» показана тёмной гаммой. o.squeeze 0..1 — стенки сжимаются; o.acid — зелёная лужа кислоты вдали
function texFlesh(g, w, h) {
  const R = rng(23); g.fillStyle = "#7a2a33"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 16; i++) { const x = R() * w, y = R() * h, r = 50 + R() * 80; wrap(w, h, x, y, (X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, R() > 0.5 ? "rgba(160,70,80,0.45)" : "rgba(70,18,26,0.45)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r); }); }
  g.lineWidth = 7; g.lineCap = "round";
  for (let y = 30; y < h; y += 64) { g.strokeStyle = "rgba(50,10,18,0.5)"; g.beginPath(); for (let x = 0; x <= w; x += 16) g.lineTo(x, y + Math.sin((x / w) * Math.PI * 4 + y) * 12); g.stroke();
    g.strokeStyle = "rgba(210,120,130,0.35)"; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= w; x += 16) g.lineTo(x, y - 8 + Math.sin((x / w) * Math.PI * 4 + y) * 12); g.stroke(); g.lineWidth = 7; }
  for (let i = 0; i < 6; i++) { const x = R() * w, y = R() * h, rx = 20 + R() * 26; wrap(w, h, x, y, (X, Y) => { g.fillStyle = "rgba(255,210,215,0.35)"; g.beginPath(); g.ellipse(X, Y, rx, rx * 0.4, 0, 0, 7); g.fill(); }); }
}
function texAcid(g, w, h) {
  const R = rng(29); g.fillStyle = "#6fae2e"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 30; i++) { const x = R() * w, y = R() * h, r = 8 + R() * 22; wrap(w, h, x, y, (X, Y) => { g.strokeStyle = "rgba(220,255,140,0.8)"; g.lineWidth = 4; g.beginPath(); g.arc(X, Y, r, 0, 7); g.stroke(); }); }
}
// стенка-складка: большой мягкий бугор (спрайт), k — пикселей на метр
function drawFold(g, x, y, k, side, sq) {
  g.save(); g.translate(x, y); g.scale(side, 1);
  const w = (0.9 + sq * 0.4) * k, h = 2.6 * k;
  const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, "#4a1018"); gr.addColorStop(0.7, "#8a3440"); gr.addColorStop(1, "#a8505c");
  g.fillStyle = gr; g.strokeStyle = INKC; g.lineWidth = Math.max(2.5, 0.04 * k);
  g.beginPath(); g.moveTo(-0.5 * k, 0.2 * k); g.quadraticCurveTo(w * 1.1, -0.2 * k, w * 0.8, -h * 0.5); g.quadraticCurveTo(w * 1.05, -h * 0.85, -0.5 * k, -h); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = "rgba(255,200,205,0.45)"; g.lineWidth = Math.max(2, 0.03 * k); g.beginPath(); g.moveTo(w * 0.55, -h * 0.25); g.quadraticCurveTo(w * 0.85, -h * 0.5, w * 0.6, -h * 0.75); g.stroke();
  g.restore();
}
function whaleInside(sc, t, o = {}) {
  const sq = o.squeeze ?? 0;
  sc.skybox((g) => { const gr = g.createRadialGradient(W / 2, H * 0.45, 40, W / 2, H * 0.5, H * 0.8); gr.addColorStop(0, "#5a1a24"); gr.addColorStop(0.55, "#2a080e"); gr.addColorStop(1, "#080103"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // кольцевые складки уходят вглубь (тоннель)
    g.strokeStyle = "rgba(150,60,70,0.35)"; g.lineWidth = 10; for (let i = 0; i < 5; i++) { const r = (180 + i * 160) * (1 - sq * 0.12); g.beginPath(); g.ellipse(W / 2, H * 0.45, r * 0.9, r, 0, 0, 7); g.stroke(); } });
  sc.ground(-6, 6, -30, 6, 0, "#7a2a33", texFlesh, "flesh", { tile: 2.5, dist: 30 });
  if (o.acid) sc.ground(-1.6, 1.6, o.acidZ - 1.4, o.acidZ + 1.4, 0.02, "#6fae2e", texAcid, "acid", { tile: 1.5, off: [0, t * 0.3] });
  // стенки по бокам — ряды складок, сжимаются; ближе к зрителю шире
  const gap = 1.35 - sq * 0.55;
  for (let i = 0; i < 9; i++) { const z = 2 - i * 2.2, wob = Math.sin(t * 2 + i) * 0.04;
    if (sc.cam.toCam([0, 0, z])[2] < 1.6) continue;   // складки вплотную к камере закрыли бы весь кадр
    for (const side of [-1, 1]) sc.sprite([side * (gap + wob + i * 0.05), 0, z], 0.3, (g, X, Y, k) => drawFold(g, X, Y, k, -side, sq)); }
  // капли слизи сверху
  for (let i = 0; i < 4; i++) { const x = -0.9 + i * 0.6, z = -1 - i * 1.7, y = 2.6 - ((t * 0.6 + i * 0.4) % 2.6);
    sc.sprite([x, y, z], -0.1, (g, X, Y, k) => { g.fillStyle = "rgba(255,200,205,0.55)"; g.beginPath(); g.ellipse(X, Y, 0.025 * k, 0.045 * k, 0, 0, 7); g.fill(); }); }
}
// темнота внутри кита: тонировка кадра в тёмно-бордовый (поверх сцены, под надписями)
const insideGrade = (k = 0.45) => (g) => { g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = `rgba(120,40,50,${k})`; g.fillRect(0, 0, W, H); g.restore(); };
