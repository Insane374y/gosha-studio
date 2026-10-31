// Пляж и океан: Гавайи, отлив перед цунами, склон для бегства, разрез океана. Используется в 05_ocean и дальше.
// Мир: x — вдоль берега, z — от зрителя к горизонту (море — в минусе z), y — вверх. Песок у зрителя, вода дальше.

// небо с солнцем и горизонтом; o.line — белая полоска цунами у горизонта (0..1), o.sepia — для флешбэка
function pBeachSky(t, o = {}) {
  const paint = (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, o.dusk ? "#f2a271" : "#5fb4f0"); sky.addColorStop(1, o.dusk ? "#ffd9a8" : "#cdeefe");
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    g.fillStyle = "#ffffff"; g.globalAlpha = 0.85;
    for (const [cx, cy, r] of [[0.18, 0.22, 0.05], [0.24, 0.2, 0.04], [0.7, 0.3, 0.045], [0.77, 0.28, 0.035]]) { g.beginPath(); g.arc(((cx + t * 0.002) % 1) * w, cy * h, r * w, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    if (!o.noSun) { g.fillStyle = "#ffe066"; g.strokeStyle = INKC; g.lineWidth = w * 0.003; g.beginPath(); g.arc(w * 0.78, h * 0.42, w * 0.035, 0, 7); g.fill(); g.stroke(); }
    if (o.line) { g.fillStyle = `rgba(255,255,255,${0.9 * o.line})`; g.fillRect(w * 0.05, h * 0.965, w * 0.9, h * 0.012); }
  };
  paint.glow = (g, w, h) => {   // светится только солнце (небо целиком давало молочную дымку на весь кадр)
    if (!o.noSun) { g.fillStyle = "#ffe27a"; g.beginPath(); g.arc(w * 0.78, h * 0.42, w * 0.06, 0, 7); g.fill(); } };
  return paint;
}

// пляж: o.water — где кромка воды по z (норма −6, при отливе до −26), o.boats, o.fish, o.towel
function beach(sc, t, o = {}) {
  const wl = o.water ?? -6, sea = o.seaY ?? 0.0;
  sc.decal([0, 9, -40], 120, 26, 0, pBeachSky(t, o), null, { live: true, frame: false, zb: 5 });
  sc.plane([[-60, 0, -40], [60, 0, -40], [60, 0, 12], [-60, 0, 12]], "#f1d9a6", false);                 // сухой песок
  sc.plane([[-60, 0.003, -6], [60, 0.003, -6], [60, 0.003, -40], [-60, 0.003, -40]], "#b8915f", false); // мокрое дно (видно при отливе)
  // рифы и камни на дне
  for (const [x, z, r] of [[-7, -12, 1.2], [5, -15, 1.6], [-2, -20, 1.0], [10, -10, 0.9], [-12, -17, 1.4]])   // риф видно только на обнажившемся дне
    if (z > wl + 0.5) sc.box([x, 0.06, z], [r, 0.12, r * 0.7], "#8a6d4c", { zb: 0.6, shadow: false });
  // море: от кромки до горизонта, пенная полоса, лёгкие волны
  const wz = Math.max(wl, -39.5);
  sc.plane([[-60, sea + 0.006, wz], [60, sea + 0.006, wz], [60, sea + 0.006, -40], [-60, sea + 0.006, -40]], "#2f8fd6", false);
  sc.box([0, sea + 0.03, wz - 0.12], [120, 0.04, 0.35], "#ffffff", { zb: 0.4, shadow: false, line: false });
  for (let i = 0; i < 6; i++) { const z = wz - 2 - i * 4 - ((t * 0.8) % 4); if (z > -39) sc.box([((i * 7) % 20) - 10, sea + 0.012, z], [4 + (i % 3), 0.01, 0.12], "#7cc4f2", { zb: 0.3, shadow: false, line: false }); }
  // пальмы по краям
  for (const [x, z, s] of o.palms ?? [[-6.5, -2, 0.55], [7, -3.5, 0.62], [-9, 2, 0.5]]) sc.sprite([x, 0, z], 0.4, (g, X, Y, k) => drawPalm(g, X, Y, k * s, t + x));
  // лодки на дне при отливе (или на воде)
  for (const [x, z, rot] of o.boats ?? []) sc.sprite([x, 0, z], 0.2, (g, X, Y, k) => drawBoat(g, X, Y, k, wl < z + 1 ? rot : 0));
  for (const [x, z] of o.fish ?? []) sc.sprite([x, 0.05, z], 0.1, (g, X, Y, k) => drawFish(g, X, Y, k, t, { flop: true }));
  if (o.towel !== false) sc.box([o.towelX ?? 2.2, 0.01, o.towelZ ?? 1.2], [1.4, 0.02, 0.7], "#e8453c", { zb: 0.2, shadow: false });
}

// склон для бегства: земля поднимается вправо; o.siren — мигающая сирена (0/1)
const hillY = (x) => Math.max(0, x * 0.32);
function hill(sc, t, o = {}) {
  sc.decal([0, 9, -30], 100, 26, 0, pBeachSky(t, {}), null, { live: true, frame: false, zb: 5 });
  const pts = []; for (let x = -30; x <= 30; x += 2) pts.push([x, hillY(x)]);
  for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    sc.plane([[x0, y0, -12], [x1, y1, -12], [x1, y1, 6], [x0, y0, 6]], x0 < 0 ? "#f1d9a6" : "#7fbf6a", false); }
  sc.plane([[-30, 0.01, -12], [-2, 0.01, -12], [-2, 0.01, -30], [-30, 0.01, -30]], "#2f8fd6", false);
  for (const [x, z, s] of [[-4, -3, 0.55], [4, -4, 0.6], [9, -2.5, 0.5], [14, -5, 0.65]]) sc.sprite([x, hillY(x), z], 0.4, (g, X, Y, k) => drawPalm(g, X, Y, k * s, t + x));
  if (o.siren != null) { const on = o.siren && Math.floor(t * 3) % 2 === 0, sx = 9.5;
    sc.box([sx, hillY(sx) + 1.3, -2.2], [0.14, 2.6, 0.14], "#5b5f68", { zb: 0.2 });
    sc.box([sx, hillY(sx) + 2.75, -2.2], [0.7, 0.35, 0.5], on ? "#ff4a3d" : "#9b2a24", { glow: on ? 0.9 : 0, shadow: false }); }
}

// город у берега, вид с холма; o.waterY — уровень воды (0 — норма, растёт при цунами)
function townView(sc, t, o = {}) {
  sc.decal([0, 10, -48], 140, 30, 0, pBeachSky(t, { noSun: o.noSun }), null, { live: true, frame: false, zb: 5 });
  sc.plane([[-70, 0, -48], [70, 0, -48], [70, 0, 50], [-70, 0, 50]], "#f1d9a6", false);
  sc.plane([[-70, 0.002, -4], [70, 0.002, -4], [70, 0.002, 50], [-70, 0.002, 50]], "#7fbf6a", false);
  sc.plane([[-70, 0.004, 1], [70, 0.004, 1], [70, 0.004, 3], [-70, 0.004, 3]], "#6b6f78", false);   // улица
  const houses = [[-15, 2.2, "#e8a87c"], [-9, 2.6, "#8fb8de"], [-3, 2.3, "#f2c94c"], [3, 2.7, "#c38fd6"], [9, 2.4, "#9cc59a"], [15, 2.5, "#e8a87c"]];
  for (const [x, h, c] of houses) { sc.box([x, h / 2, 5.5], [3.2, h, 2.4], c, { zb: 0.5 }); sc.box([x, h + 0.2, 5.5], [3.4, 0.4, 2.6], "#a0563a", { zb: 0.5 }); }   // крыши (shadeHex даёт rgb(), а box ждёт #hex)
  for (const [x, z, s] of [[-18, -2, 0.6], [-5, -3, 0.55], [7, -2.5, 0.65], [19, -3, 0.55]]) sc.sprite([x, 0, z], 0.4, (g, X, Y, k) => drawPalm(g, X, Y, k * s, t + x));
  const wy = o.waterY ?? 0, edge = o.edge ?? -10;   // вода: уровень wy, передний край edge (z)
  sc.plane([[-70, wy + 0.01, edge], [70, wy + 0.01, edge], [70, wy + 0.01, -48], [-70, wy + 0.01, -48]], "#2f8fd6", false);
  if (wy > 0.05) { sc.box([0, wy / 2, edge], [140, wy, 0.1], "#2a7fc4", { zb: -0.2, shadow: false, line: false });
    for (let i = 0; i < 8; i++) sc.box([((i * 17 + t * 6) % 140) - 70, wy + 0.03, edge - 0.4 - (i % 3)], [3, 0.03, 0.15], "#d8f0ff", { zb: 0.3, shadow: false, line: false }); }
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
