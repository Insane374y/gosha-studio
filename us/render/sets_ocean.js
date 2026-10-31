// Пляж и океан: Гавайи, отлив перед цунами, склон для бегства, разрез океана. Используется в 05_ocean и дальше.
// Мир: x — вдоль берега, z — от зрителя к горизонту (море — в минусе z), y — вверх. Песок у зрителя, вода дальше.

// ------------------------------------------------ текстуры (плитки, бесшовные: элементы у края повторяются с другой стороны)
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const wrap = (w, h, x, y, f) => { for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) f(x + dx, y + dy); };
function texSand(g, w, h) {   // сухой песок: песчинки, ветровая рябь, ракушки и камешки
  const R = rng(7); g.fillStyle = "#f0d6a0"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) { const x = R() * w, y = R() * h, r = 30 + R() * 60; wrap(w, h, x, y, (X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, R() > 0.5 ? "rgba(255,240,205,0.5)" : "rgba(214,182,128,0.35)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r); }); }
  g.lineWidth = 3; g.lineCap = "round";
  for (let i = 0; i < 16; i++) { const x = R() * w, y = R() * h, len = 60 + R() * 90; wrap(w, h, x, y, (X, Y) => { g.strokeStyle = "rgba(196,160,104,0.45)"; g.beginPath(); g.moveTo(X, Y); g.quadraticCurveTo(X + len / 2, Y - 10, X + len, Y); g.stroke(); g.strokeStyle = "rgba(255,244,214,0.6)"; g.beginPath(); g.moveTo(X, Y + 4); g.quadraticCurveTo(X + len / 2, Y - 6, X + len, Y + 4); g.stroke(); }); }
  const cols = ["#d8b67c", "#fff3d6", "#c9a46a", "#e8c891"];
  for (let i = 0; i < 500; i++) { g.fillStyle = cols[i % 4]; g.globalAlpha = 0.5; g.fillRect(R() * w, R() * h, 2, 2); } g.globalAlpha = 1;   // песчинок мало и они мягкие — картинка чище
  for (let i = 0; i < 5; i++) { const x = R() * w, y = R() * h, sh = R() > 0.5; wrap(w, h, x, y, (X, Y) => {   // ракушки и камешки
    g.fillStyle = sh ? "#f6c9c0" : "#a99a86"; g.strokeStyle = "rgba(42,29,26,0.55)"; g.lineWidth = 2; g.beginPath();
    if (sh) { g.moveTo(X - 9, Y + 5); g.quadraticCurveTo(X, Y - 12, X + 9, Y + 5); g.closePath(); } else g.ellipse(X, Y, 7, 5, R(), 0, 7); g.fill(); g.stroke(); }); }
}
function texWet(g, w, h) {   // мокрое дно: гладкое, мягкие тёмные пятна, спокойная рябь, лужицы с бликом — без мелких песчинок
  const R = rng(11); g.fillStyle = "#b28a5c"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 12; i++) { const x = R() * w, y = R() * h, r = 60 + R() * 90; wrap(w, h, x, y, (X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, "rgba(130,94,58,0.28)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r); }); }
  g.lineWidth = 5; g.lineCap = "round";
  for (let y = 18; y < h; y += 46) { g.strokeStyle = "rgba(140,102,64,0.32)"; g.beginPath(); for (let x = 0; x <= w; x += 16) g.lineTo(x, y + Math.sin((x / w) * Math.PI * 4 + y * 0.1) * 6); g.stroke(); }
  for (let i = 0; i < 3; i++) { const x = R() * w, y = R() * h, rx = 34 + R() * 30; wrap(w, h, x, y, (X, Y) => { g.fillStyle = "rgba(140,195,225,0.8)"; g.beginPath(); g.ellipse(X, Y, rx, rx * 0.42, 0, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,0.65)"; g.beginPath(); g.ellipse(X - rx * 0.3, Y - 3, rx * 0.35, 3, 0, 0, 7); g.fill(); }); }
}
function texSea(g, w, h) {   // вода: полосы волн светлее/темнее, блики
  const R = rng(5); g.fillStyle = "#2b88d0"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 18; i++) { const y = (i / 18) * h + R() * 8, dark = i % 2; g.strokeStyle = dark ? "rgba(20,90,160,0.55)" : "rgba(120,195,245,0.6)"; g.lineWidth = dark ? 7 : 5;
    g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin((x / w) * Math.PI * 2 * (2 + (i % 3)) + i) * 7); g.stroke(); }
  for (let i = 0; i < 70; i++) { const x = R() * w, y = R() * h, l = 6 + R() * 16; wrap(w, h, x, y, (X, Y) => { g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 3; g.beginPath(); g.moveTo(X, Y); g.lineTo(X + l, Y); g.stroke(); }); }
}
function texGrass(g, w, h) {   // трава: стебельки, пятна, мелкие цветы
  const R = rng(3); g.fillStyle = "#79b964"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 18; i++) { const x = R() * w, y = R() * h, r = 50 + R() * 60; wrap(w, h, x, y, (X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, R() > 0.5 ? "rgba(150,210,120,0.45)" : "rgba(80,140,70,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r); }); }
  g.lineCap = "round";
  for (let i = 0; i < 900; i++) { const x = R() * w, y = R() * h; g.strokeStyle = ["#5c9e4c", "#9ad37f", "#6fae5a"][i % 3]; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - 0.5) * 6, y - 8 - R() * 8); g.stroke(); }
  for (let i = 0; i < 10; i++) { const x = R() * w, y = R() * h; wrap(w, h, x, y, (X, Y) => { g.fillStyle = ["#fff", "#f7d24a", "#f29bc3"][i % 3]; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(X + Math.cos(k * 1.26) * 4, Y + Math.sin(k * 1.26) * 4, 3, 0, 7); g.fill(); } g.fillStyle = "#f2a33c"; g.beginPath(); g.arc(X, Y, 2.5, 0, 7); g.fill(); }); }
}
function texStreet(g, w, h) { const R = rng(9); g.fillStyle = "#6b6f78"; g.fillRect(0, 0, w, h); for (let i = 0; i < 1800; i++) { g.fillStyle = i % 2 ? "#5d6169" : "#80848c"; g.fillRect(R() * w, R() * h, 2, 2); } }

// небо на весь экран (skybox): градиент, кучевые облака, солнце с ореолом, горы Гавайев на горизонте.
// Всё задано углами (рысканье/высота), поэтому при повороте камеры небо и горизонт сдвигаются правильно и никогда не кончаются.
// o.line — белая полоса цунами на горизонте (0..1), o.noSun
const SKY_CLOUDS = [[-1.2, 0.30, 0.10], [-0.75, 0.42, 0.14], [-0.35, 0.26, 0.08], [0.05, 0.48, 0.16], [0.4, 0.33, 0.09], [0.75, 0.52, 0.13], [1.1, 0.28, 0.1], [1.5, 0.4, 0.12], [-1.6, 0.5, 0.12], [2.0, 0.35, 0.1]];
const SKY_HILLS = [[-2.2, 0.03], [-1.9, 0.07], [-1.7, 0.09], [-1.5, 0.05], [-1.2, 0.02], [-0.6, 0.015], [-0.3, 0.04], [-0.1, 0.075], [0.05, 0.1], [0.2, 0.06], [0.5, 0.02], [1.0, 0.03], [1.3, 0.06], [1.45, 0.045], [1.8, 0.02], [2.3, 0.04]];
function beachSky(t, o = {}) {
  return (g, cam) => {
    const f = cam.f, yaw = Math.atan2(f[0], -f[2]), F = cam.F;
    const hz = cam.P([cam.pos[0] + f[0] * 4000, cam.pos[1], cam.pos[2] + f[2] * 4000]), hy = hz ? hz[1] : H * 0.55;
    const X = (a) => W / 2 + (a - yaw) * F, Y = (e) => hy - Math.tan(e) * F;
    const sky = g.createLinearGradient(0, Y(0.9), 0, hy); sky.addColorStop(0, "#2f8ee0"); sky.addColorStop(0.65, "#8fcdf6"); sky.addColorStop(1, "#e3f5ff");
    g.fillStyle = sky; g.fillRect(0, 0, W, Math.max(0, hy + 4));
    g.fillStyle = o.below ?? "#2a82c8"; g.fillRect(0, hy, W, H);   // ниже горизонта — даль моря (земля и вода рисуются поверх)
    if (!o.noSun) { const sx = X(0.32), sy = Y(0.3), r = 0.035 * F;
      const halo = g.createRadialGradient(sx, sy, r, sx, sy, r * 8); halo.addColorStop(0, "rgba(255,248,210,0.85)"); halo.addColorStop(1, "rgba(255,248,210,0)"); g.fillStyle = halo; g.fillRect(sx - r * 8, sy - r * 8, r * 16, r * 16);
      g.fillStyle = "#fff1a0"; g.beginPath(); g.arc(sx, sy, r, 0, 7); g.fill(); emitGlow(sx, sy, r * 3.5, "#ffe27a", 1); }
    for (const [a0, e, sz] of SKY_CLOUDS) { const a = a0 + t * 0.004, cx = X(a), cy = Y(e), s = sz * F * 0.5;
      if (cx < -3 * s || cx > W + 3 * s) continue;
      const puffs = [[-1.1, 0.15, 0.55], [-0.5, -0.2, 0.75], [0.2, -0.35, 0.85], [0.9, -0.05, 0.6], [1.4, 0.2, 0.42]];
      g.fillStyle = "#c6def3"; for (const [dx, dy, r] of puffs) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s + s * 0.14, r * s, 0, 7); g.fill(); }
      g.fillStyle = "#ffffff"; for (const [dx, dy, r] of puffs) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s * 0.94, 0, 7); g.fill(); }
      g.fillStyle = "#c6def3"; g.fillRect(cx - 1.55 * s, cy + 0.36 * s, 3.2 * s, 0.24 * s); }
    // горы на горизонте: два слоя в дымке
    if (!o.noHills) for (const [col, k] of [["#87adcf", 1], ["#a8c6e0", 0.45]]) { g.fillStyle = col; g.beginPath(); g.moveTo(-10, hy + 2);
      for (let i = 0; i < SKY_HILLS.length; i++) { const [a, e] = SKY_HILLS[i]; g.lineTo(X(a + (k < 1 ? 0.3 : 0)), Y(e * k)); } g.lineTo(W + 10, hy + 2); g.closePath(); g.fill(); }
    if (o.line) { g.fillStyle = `rgba(255,255,255,${0.95 * o.line})`; g.fillRect(0, hy - 0.006 * F, W, 0.008 * F); emitGlow(W / 2, hy, W * 0.4, "#ffffff", 0.25 * o.line); }
  };
}

// пляж: o.water — где кромка воды по z (норма −6, при отливе до −26), o.boats, o.fish, o.towel, o.props (false — без зонтов/вышки)
function beach(sc, t, o = {}) {
  const wl = o.water ?? -6, sea = o.seaY ?? 0.0, wz = Math.max(wl, -44.5);
  sc.skybox(beachSky(t, o));
  sc.ground(-70, 70, -6, 14, 0, "#f0d6a0", texSand, "sand", { tile: 3.5 });                   // сухой песок
  sc.ground(-70, 70, wz, -6, 0.003, "#b08657", texWet, "wet", { tile: 3 });                   // мокрое дно (видно при отливе)
  sc.ground(-70, 70, -45, wz, sea + 0.006, "#2b88d0", texSea, "sea", { tile: 5, off: [t * 0.25, t * 0.7], dist: 40 });
  // пена у кромки: неровная белая полоса
  sc.sprite([0, sea + 0.02, wz], 0.35, (g, X, Y, k) => { g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.moveTo(-W, Y);
    for (let x = -W; x <= 2 * W; x += 24) g.lineTo(x, Y - 4 - Math.abs(Math.sin(x * 0.02 + t * 2)) * 0.12 * k); g.lineTo(2 * W, Y + 0.05 * k); g.lineTo(-W, Y + 0.05 * k); g.closePath(); g.fill(); });
  // на обнажившемся дне: камни рифа, морские звёзды, водоросли
  for (const [x, z, r] of [[-7, -12, 1.2], [5, -15, 1.6], [-2, -20, 1.0], [10, -10, 0.9], [-12, -17, 1.4], [3, -9, 0.6]])
    if (z > wl + 0.5) sc.sprite([x, 0, z], 0.5, (g, X, Y, k) => drawRock(g, X, Y, k * r));
  for (const [x, z, c] of [[-1.5, -8.5, "#e8603c"], [2.6, -10.2, "#f2b84b"], [-3.8, -13, "#e86a8f"], [1, -14.5, "#e8603c"]])
    if (z > wl + 0.5) sc.sprite([x, 0.01, z], 0.3, (g, X, Y, k) => drawStar(g, X, Y, k, c));
  for (const [x, z] of [[-2.8, -9.6], [3.8, -11.8], [0.4, -12.8]]) if (z > wl + 0.5) sc.sprite([x, 0, z], 0.3, (g, X, Y, k) => drawWeed(g, X, Y, k, t));
  // пальмы разной высоты
  for (const [x, z, s] of o.palms ?? [[-6.5, -2, 0.62], [-8.5, 1, 0.5], [7, -3.5, 0.68], [9.5, -1, 0.55], [-11, -4, 0.7], [12, -5.5, 0.6]])
    sc.sprite([x, 0, z], 0.4, (g, X, Y, k) => drawPalm(g, X, Y, k * s, t + x));
  if (o.props !== false) {
    // вышка спасателей (очень американская деталь), зонтики, доска для сёрфинга
    lifeguardTower(sc, -4.6, 1.8);
    for (const [x, z, c] of [[4.2, 2.2, "#e8453c"], [-2.4, 4.2, "#2f6fd6"]]) sc.sprite([x, 0, z], 0.3, (g, X, Y, k) => drawUmbrella(g, X, Y, k, c));
    sc.sprite([-1.6, 0, 1.2], 0.2, (g, X, Y, k) => drawSurfboard(g, X, Y, k));
  }
  // крабы бегают по песку, чайки летают
  for (const [i, z] of [[0, 0.4], [1, -3.2], [2, -5.2]]) { const x = ((t * (0.6 + i * 0.25) + i * 7) % 16) - 8; sc.sprite([x, 0, z], 0.1, (g, X, Y, k) => drawCrab(g, X, Y, k, t + i)); }
  for (let i = 0; i < 5; i++) { const x = ((t * (1.2 + i * 0.3) + i * 9) % 50) - 25; sc.sprite([x, 7 + (i % 3) * 1.4 + Math.sin(t + i) * 0.3, -16 - i * 3], -1, (g, X, Y, k) => drawGull(g, X, Y, k, t + i)); }
  for (const [x, z, rot] of o.boats ?? []) sc.sprite([x, 0, z], 0.2, (g, X, Y, k) => drawBoat(g, X, Y, k, wl < z + 1 ? rot : 0));
  for (const [x, z] of o.fish ?? []) sc.sprite([x, 0.05, z], 0.1, (g, X, Y, k) => drawFish(g, X, Y, k, t, { flop: true }));
  if (o.towel !== false) sc.box([o.towelX ?? 2.2, 0.01, o.towelZ ?? 1.2], [1.4, 0.02, 0.7], "#e8453c", { zb: 0.2, shadow: false });
}
function lifeguardTower(sc, x, z) {
  for (const dx of [-0.6, 0.6]) for (const dz of [-0.5, 0.5]) sc.box([x + dx, 0.9, z + dz], [0.12, 1.8, 0.12], "#f7f3ea", { zb: 0.3 });
  sc.box([x, 2.25, z], [1.8, 0.9, 1.5], "#e8453c", { zb: 0.25 }); sc.box([x, 2.25, z + 0.76], [1.4, 0.4, 0.02], "#bfe6ff", { zb: 0.2, shadow: false });
  sc.box([x, 2.8, z], [2.1, 0.18, 1.8], "#f7f3ea", { zb: 0.25, shadow: false });
}

// склон для бегства: земля поднимается вправо; трава с кустами и цветами; o.siren — мигающая сирена (0/1)
const hillY = (x) => Math.max(0, x * 0.32);
function hill(sc, t, o = {}) {
  sc.skybox(beachSky(t, {}));
  sc.ground(-60, -2, -40, -12, 0.01, "#2b88d0", texSea, "sea", { tile: 5, off: [t * 0.25, t * 0.7], dist: 40 });
  const pts = []; for (let x = -30; x <= 30; x += 2) pts.push([x, hillY(x)]);
  for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    sc.plane([[x0, y0, -12], [x1, y1, -12], [x1, y1, 6], [x0, y0, 6]], x0 < 0 ? "#f0d6a0" : "#79b964", false); }
  // кусты, пучки травы, цветы и камни вдоль тропы — чтобы склон не был пустым
  const R = rng(21);
  for (let i = 0; i < 70; i++) { const x = -12 + R() * 34, z = -7 + R() * 5.5, kind = R(); if (x < -1) continue;   // не ближе z = −1.5: не лезть в камеру
    sc.sprite([x, hillY(x), z], 0.2, (g, X, Y, k) => (kind < 0.55 ? drawTuft(g, X, Y, k) : kind < 0.8 ? drawBush(g, X, Y, k * (0.6 + (i % 3) * 0.2)) : drawRock(g, X, Y, k * 0.35))); }
  for (const [x, z, s] of [[-4, -3, 0.62], [4, -4, 0.66], [9, -2.5, 0.55], [14, -5, 0.7], [-8, -6, 0.6], [18, -3, 0.6]]) sc.sprite([x, hillY(x), z], 0.4, (g, X, Y, k) => drawPalm(g, X, Y, k * s, t + x));
  for (let i = 0; i < 4; i++) { const x = ((t * (1.4 + i * 0.3) + i * 9) % 40) - 15; sc.sprite([x, 9 + (i % 2) * 1.5, -18 - i * 2], -1, (g, X, Y, k) => drawGull(g, X, Y, k, t + i)); }
  if (o.siren != null) { const on = o.siren && Math.floor(t * 3) % 2 === 0, sx = 9.5;
    sc.box([sx, hillY(sx) + 1.3, -2.2], [0.14, 2.6, 0.14], "#5b5f68", { zb: 0.2 });
    sc.box([sx, hillY(sx) + 2.75, -2.2], [0.7, 0.35, 0.5], on ? "#ff4a3d" : "#9b2a24", { glow: on ? 0.9 : 0, shadow: false }); }
}

// город у берега, вид с холма; o.waterY — уровень воды (0 — норма, растёт при цунами), o.edge — передний край воды
function townView(sc, t, o = {}) {
  sc.skybox(beachSky(t, { noSun: o.noSun }));
  sc.ground(-80, 80, -10, -4, 0, "#f0d6a0", texSand, "sand", { tile: 3.5, dist: 60 });
  sc.ground(-80, 80, -4, 1, 0.002, "#79b964", texGrass, "grass", { tile: 4, dist: 60 });
  sc.ground(-80, 80, 1, 3, 0.004, "#6b6f78", texStreet, "street", { tile: 3, dist: 60 });
  sc.ground(-80, 80, 3, 50, 0.002, "#79b964", texGrass, "grass", { tile: 4, dist: 60 });
  const houses = [[-15, 2.2, "#e8a87c"], [-9, 2.6, "#8fb8de"], [-3, 2.3, "#f2c94c"], [3, 2.7, "#c38fd6"], [9, 2.4, "#9cc59a"], [15, 2.5, "#e8a87c"]];
  for (const [x, h, c] of houses) { sc.box([x, h / 2, 5.5], [3.2, h, 2.4], c, { zb: 0.5 }); sc.box([x, h + 0.2, 5.5], [3.4, 0.4, 2.6], "#a0563a", { zb: 0.5 });   // крыши (shadeHex даёт rgb(), а box ждёт #hex)
    sc.decal([x, h / 2 + 0.1, 4.29], 3.0, h - 0.5, 0, pFacade(c, "#a9d8ff"), "fac" + x, { frame: false, zb: 0.45 }); }
  for (const [x, z, s] of [[-18, -2, 0.62], [-11, 0, 0.5], [-5, -3, 0.58], [1, -1.5, 0.5], [7, -2.5, 0.66], [13, 0, 0.55], [19, -3, 0.6]]) sc.sprite([x, 0, z], 0.4, (g, X, Y, k) => drawPalm(g, X, Y, k * s, t + x));
  for (let i = 0; i < 5; i++) { const x = ((t * (1.4 + i * 0.3) + i * 11) % 60) - 30; sc.sprite([x, 12 + (i % 3) * 1.5, -20 - i * 3], -1, (g, X, Y, k) => drawGull(g, X, Y, k, t + i)); }
  const wy = o.waterY ?? 0, edge = o.edge ?? -10;
  sc.ground(-80, 80, -52, edge, wy + 0.01, "#2b88d0", texSea, "sea", { tile: 5, off: [t * 0.25, t * 1.4], dist: 70 });
  if (wy > 0.05) { sc.box([0, wy / 2, edge], [160, wy, 0.1], "#2a7fc4", { zb: -0.2, shadow: false, line: false });
    sc.sprite([0, wy + 0.02, edge], -0.3, (g, X, Y, k) => { g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.moveTo(-W, Y);
      for (let x = -W; x <= 2 * W; x += 20) g.lineTo(x, Y - 3 - Math.abs(Math.sin(x * 0.03 + t * 4)) * 0.25 * k); g.lineTo(2 * W, Y + 0.08 * k); g.lineTo(-W, Y + 0.08 * k); g.closePath(); g.fill(); }); }
}

// ------------------------------------------------ спрайты (k — пикселей на метр)
function drawPalm(g, x, y, k, t) {
  const sway = Math.sin(t * 0.9) * 0.08;
  g.save(); g.translate(x, y); g.lineCap = "round";
  g.strokeStyle = INKC; g.lineWidth = 0.32 * k; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(0.4 * k, -2.2 * k, (0.3 + sway) * k, -4.4 * k); g.stroke();
  g.strokeStyle = "#a8743f"; g.lineWidth = 0.22 * k; g.stroke();
  const tx = (0.3 + sway) * k, ty = -4.4 * k;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.55 + sway, len = 2.1 * k;
    g.fillStyle = i % 2 ? "#3fa356" : "#2f8a46"; g.strokeStyle = INKC; g.lineWidth = 0.05 * k;
    g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + Math.cos(a) * len * 0.6, ty + Math.sin(a) * len * 0.6 - 0.4 * k, tx + Math.cos(a) * len, ty + Math.sin(a) * len + 0.5 * k);
    g.quadraticCurveTo(tx + Math.cos(a) * len * 0.5, ty + Math.sin(a) * len * 0.5 + 0.1 * k, tx, ty); g.fill(); g.stroke(); }
  g.fillStyle = "#6b4a2a"; for (const dx of [-0.15, 0.15]) { g.beginPath(); g.arc(tx + dx * k, ty + 0.2 * k, 0.16 * k, 0, 7); g.fill(); }
  g.restore();
}
function drawBoat(g, x, y, k, rot) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = "#f7f3ea"; g.strokeStyle = INKC; g.lineWidth = 0.05 * k;
  g.beginPath(); g.moveTo(-1.6 * k, -0.7 * k); g.lineTo(1.6 * k, -0.7 * k); g.lineTo(1.1 * k, 0); g.lineTo(-1.2 * k, 0); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#d6453d"; g.fillRect(-1.5 * k, -0.55 * k, 3.0 * k, 0.12 * k);
  g.strokeStyle = INKC; g.lineWidth = 0.07 * k; g.beginPath(); g.moveTo(0, -0.7 * k); g.lineTo(0, -2.6 * k); g.stroke();
  g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(0.05 * k, -2.5 * k); g.lineTo(1.1 * k, -0.9 * k); g.lineTo(0.05 * k, -0.9 * k); g.closePath(); g.fill(); g.lineWidth = 0.04 * k; g.stroke();
  g.restore();
}
function drawFish(g, x, y, k, t, o = {}) {
  const f = o.flop ? Math.sin(t * 9 + x) * 0.5 : 0, s = (o.scale ?? 1) * k;
  g.save(); g.translate(x, y - (o.flop ? Math.abs(Math.sin(t * 9 + x)) * 0.15 * k : 0)); g.rotate(f * 0.6); if (o.flip) g.scale(-1, 1);
  g.fillStyle = o.color ?? "#f2a33c"; g.strokeStyle = INKC; g.lineWidth = 0.04 * s;
  g.beginPath(); g.ellipse(0, 0, 0.32 * s, 0.17 * s, 0, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(0.28 * s, 0); g.lineTo(0.5 * s, -0.16 * s); g.lineTo(0.5 * s, 0.16 * s); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(-0.17 * s, -0.04 * s, 0.07 * s, 0, 7); g.fill(); g.stroke();
  g.fillStyle = INKC; g.beginPath(); g.arc(-0.19 * s, -0.04 * s, 0.035 * s, 0, 7); g.fill();
  if (o.mask) { g.fillStyle = "rgba(150,220,255,0.45)"; g.strokeStyle = "#f2c230"; g.lineWidth = 0.05 * s; g.beginPath(); g.ellipse(-0.17 * s, -0.04 * s, 0.13 * s, 0.1 * s, 0, 0, 7); g.fill(); g.stroke();
    g.strokeStyle = "#e8603c"; g.lineWidth = 0.06 * s; g.beginPath(); g.moveTo(-0.05 * s, -0.08 * s); g.lineTo(0.02 * s, -0.42 * s); g.stroke(); }
  g.restore();
}
// маска с трубкой на голове Fobbin (props-слой "front")
const snorkelProp = (until = 99) => (g, fx, ty, k, t, layer) => {
  if (layer !== "front" || t > until) return;
  const P = loc(fx, ty, k), [cx, cy] = P(0, HEAD_ZM + 0.02);
  g.save(); g.fillStyle = "rgba(150,220,255,0.35)"; g.strokeStyle = "#f2c230"; g.lineWidth = 0.025 * k;
  g.beginPath(); g.ellipse(cx, cy, 0.24 * k, 0.12 * k, 0, 0, 7); g.fill(); g.stroke();
  const [sx, sy] = P(0.27, HEAD_ZM - 0.02), [ex, ey] = P(0.33, HEAD_ZM + 0.4);
  g.strokeStyle = INKC; g.lineWidth = 0.05 * k; g.lineCap = "round"; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.stroke();
  g.strokeStyle = "#e8603c"; g.lineWidth = 0.032 * k; g.stroke(); g.restore();
};
// телефон в руке зрителя (props "front"): вспышка-блик
const phoneProp = (t0) => (g, fx, ty, k, t, layer) => { if (layer !== "front" || t < t0) return;
  const [x, y] = loc(fx, ty, k)(0.3, 1.05); g.fillStyle = INKC; g.fillRect(x - 0.05 * k, y - 0.09 * k, 0.1 * k, 0.18 * k);
  g.fillStyle = "#bfe6ff"; g.fillRect(x - 0.035 * k, y - 0.075 * k, 0.07 * k, 0.15 * k);
  if (Math.floor((t - t0) * 4) % 3 === 0) emitGlow(x, y, 0.25 * k, "#ffffff", 0.8); };
// второстепенные герои: безымянные, разные цвета
const EXTRA_LOOKS = [
  { body: "#3aa6a0", hair: "spiky", shoes: "#20180f" },
  { body: "#e86a8f", hair: "long", hairColor: "#6b3a1e", shoes: "#2f6fd6" },
  { body: "#8f63d2", shoes: "#20180f" },
];
const extra = (i, extraOpts) => Object.assign({ id: "extra" + i, seed: 11 + i * 7, lookStyle: EXTRA_LOOKS[i % EXTRA_LOOKS.length], pos: [0, 0, 0], expr: [[0, "neutral"]] }, extraOpts);

function drawGull(g, x, y, k, t) {   // чайка: «галочка» с машущими крыльями
  const f = Math.sin(t * 8) * 0.35, s = 0.45 * k;
  g.save(); g.translate(x, y); g.strokeStyle = INKC; g.lineWidth = Math.max(2, 0.07 * s); g.lineCap = "round"; g.lineJoin = "round";
  g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(-s, -f * s); g.quadraticCurveTo(-s * 0.45, -s * 0.5 - f * s * 0.4, 0, 0); g.quadraticCurveTo(s * 0.45, -s * 0.5 - f * s * 0.4, s, -f * s); g.stroke();
  g.restore();
}
function drawCrab(g, x, y, k, t) {
  const s = 0.22 * k, step = Math.sin(t * 14) * 0.15;
  g.save(); g.translate(x, y); g.strokeStyle = INKC; g.lineWidth = Math.max(1.5, 0.08 * s);
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(sx * 0.3 * s, -0.25 * s); g.lineTo(sx * (0.75 + i * 0.12) * s, (-0.05 + (i % 2 ? step : -step)) * s); g.stroke(); }
  g.fillStyle = "#e8603c"; g.beginPath(); g.ellipse(0, -0.35 * s, 0.55 * s, 0.32 * s, 0, 0, 7); g.fill(); g.stroke();
  for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 0.7 * s, -0.75 * s, 0.18 * s, 0, 7); g.fill(); g.stroke(); }
  g.fillStyle = INKC; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 0.15 * s, -0.68 * s, 0.07 * s, 0, 7); g.fill(); }
  g.restore();
}
function drawRock(g, x, y, k) {
  g.save(); g.translate(x, y); g.fillStyle = "#8d7b66"; g.strokeStyle = INKC; g.lineWidth = Math.max(1.5, 0.04 * k);
  g.beginPath(); g.moveTo(-0.6 * k, 0); g.quadraticCurveTo(-0.55 * k, -0.45 * k, -0.1 * k, -0.5 * k); g.quadraticCurveTo(0.5 * k, -0.48 * k, 0.6 * k, 0); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.ellipse(-0.15 * k, -0.35 * k, 0.2 * k, 0.07 * k, -0.2, 0, 7); g.fill();
  g.restore();
}
function drawStar(g, x, y, k, col) {
  const s = 0.18 * k; g.save(); g.translate(x, y); g.scale(1, 0.5); g.fillStyle = col; g.strokeStyle = INKC; g.lineWidth = Math.max(1.5, 0.12 * s);
  g.beginPath(); for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5 - Math.PI / 2, r = i % 2 ? s * 0.42 : s; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); g.restore();
}
function drawWeed(g, x, y, k, t) {
  g.save(); g.translate(x, y); g.strokeStyle = "#3d7a3a"; g.lineWidth = Math.max(2, 0.05 * k); g.lineCap = "round";
  for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 0.06 * k, 0); g.quadraticCurveTo((i * 0.12 + Math.sin(t + i) * 0.05) * k, -0.2 * k, (i * 0.2) * k, -0.08 * k); g.stroke(); }
  g.restore();
}
function drawTuft(g, x, y, k) {
  g.save(); g.translate(x, y); g.strokeStyle = "#4f8f42"; g.lineWidth = Math.max(1.5, 0.035 * k); g.lineCap = "round";
  for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 0.03 * k, 0); g.lineTo(i * 0.07 * k, -(0.22 + (i % 2) * 0.08) * k); g.stroke(); }
  g.restore();
}
function drawBush(g, x, y, k) {
  g.save(); g.translate(x, y); g.strokeStyle = INKC; g.lineWidth = Math.max(1.5, 0.035 * k);
  for (const [dx, dy, r, c] of [[-0.35, -0.3, 0.38, "#4f9a4a"], [0.3, -0.32, 0.36, "#4f9a4a"], [0, -0.55, 0.45, "#5fae56"]]) { g.fillStyle = c; g.beginPath(); g.arc(dx * k, dy * k, r * k, 0, 7); g.fill(); g.stroke(); }
  g.fillStyle = "#f29bc3"; for (const [dx, dy] of [[-0.2, -0.6], [0.25, -0.45], [0.05, -0.8]]) { g.beginPath(); g.arc(dx * k, dy * k, 0.06 * k, 0, 7); g.fill(); }
  g.restore();
}
function drawUmbrella(g, x, y, k, col) {
  g.save(); g.translate(x, y); g.strokeStyle = INKC; g.lineWidth = Math.max(2, 0.05 * k);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0.15 * k, -2.0 * k); g.stroke();
  const cx = 0.15 * k, cy = -2.0 * k;
  for (let i = 0; i < 6; i++) { const a0 = Math.PI + (i * Math.PI) / 6, a1 = a0 + Math.PI / 6; g.fillStyle = i % 2 ? "#ffffff" : col;
    g.beginPath(); g.moveTo(cx, cy - 0.15 * k); g.lineTo(cx + Math.cos(a0) * 1.2 * k, cy + Math.sin(a0) * 0.55 * k + 0.35 * k); g.lineTo(cx + Math.cos(a1) * 1.2 * k, cy + Math.sin(a1) * 0.55 * k + 0.35 * k); g.closePath(); g.fill(); g.stroke(); }
  g.restore();
}
function drawSurfboard(g, x, y, k) {
  g.save(); g.translate(x, y); g.rotate(-0.12); g.fillStyle = "#f2c230"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, 0.045 * k);
  g.beginPath(); g.ellipse(0, -0.95 * k, 0.24 * k, 1.0 * k, 0, 0, 7); g.fill(); g.stroke();
  g.strokeStyle = "#e8453c"; g.lineWidth = 0.06 * k; g.beginPath(); g.moveTo(0, -1.9 * k); g.lineTo(0, 0); g.stroke(); g.restore();
}
