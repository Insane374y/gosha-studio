// «What if Fobbin saw the Sun go out?» — пробный ролик-образец.
// Тайминги шотов черновые: после записи английского голоса их нужно подогнать под субтитры.
const flash = (g, fx, ty, k, t, layer) => { if (layer !== "front" || t < 38.6) return; const [x, y] = loc(fx, ty, k)(0.42, 0.95); drawFlashlight(g, x, y, k, -1.05, t > 38.9); };
const hug = { handF: [[0, 0.06, 0.6], [99, 0.06, 0.6]], handB: [[0, -0.04, 0.62], [99, -0.04, 0.62]], bendF: [[0, -0.5]], bendB: [[0, 0.5]] };
const pMoved = (g, w, h) => { g.fillStyle = "#fffbe6"; g.fillRect(0, 0, w, h); g.strokeStyle = "#20180f"; g.lineWidth = w * 0.03; g.strokeRect(0, 0, w, h); g.fillStyle = "#d6453d"; g.font = `900 ${h * 0.34}px Inter, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(L("moved"), w / 2, h / 2); };
const frost = (g, a) => { if (a <= 0) return; const gr = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.7); gr.addColorStop(0, "rgba(220,240,255,0)"); gr.addColorStop(1, `rgba(220,240,255,${0.75 * a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = `rgba(255,255,255,${0.8 * a})`; g.lineWidth = 3; for (let i = 0; i < 26; i++) { const ang = i * 2.4, x = W / 2 + Math.cos(ang) * W * 0.62, y = H / 2 + Math.sin(ang) * H * 0.55; g.beginPath(); for (let k = 0; k < 6; k++) { const a2 = (k * Math.PI) / 3; g.moveTo(x, y); g.lineTo(x + Math.cos(a2) * 26, y + Math.sin(a2) * 26); } g.stroke(); } };
const SUN_OFF = 10.2;

const HOOK = 1.2;   // шот-крючок: Солнце гаснет в первом же кадре
const SHOTS_MAIN = [
  // 0. Солнечная комната
  { t0: 0, t1: 4.5, cam: [[0, [0.35, 1.05, 1.0], [0.2, 1.3, -1.6], 62], [4.5, [0.3, 1.02, 0.7], [0.2, 1.3, -1.6], 58]], focus: [0.0, 1.0, -0.7],
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { sun: true }) });
      drawActor(sc, t, fobbin({ pos: [-0.1, 0, -0.75], expr: [[0, "grin"], [1.6, "realize"], [3.2, "nervous"]], look: [[0, 0.6], [1.6, 0], [3.2, 0.7]] })); } },
  // 1. Минута, пять, восемь… темнота
  { t0: 4.5, t1: 10.4, cam: [[4.5, [-0.6, 1.2, 1.6], [0.3, 1.4, -1.8], 66], [10.4, [-0.45, 1.15, 1.3], [0.3, 1.4, -1.8], 62]], focus: [-0.4, 1.0, -0.6],
    dark: (t) => 0.62 * ramp(t, SUN_OFF, SUN_OFF + 0.15),
    build(sc, t) { const off = t > SUN_OFF; bedroom(sc, t, { window: pSky(t, { sun: !off, night: off ? 1 : 0 }), lamp: off ? false : undefined });
      drawActor(sc, t, fobbin({ pos: [-0.4, 0, -0.6], expr: [[4.5, "smug"], [5.7, "grin"], [6.7, "neutral"], [7.6, "blank"], [8.6, "smug"], [9.4, "realize"], [10.2, "shock"]], bigEyes: [[10.2, true]], look: [[4.5, 0.8], [10.2, 0]] }));
      for (const [tt, txt] of [[6.7, L("min1")], [7.6, L("min5")], [8.6, L("min8")]]) tag(sc, [0.2, 2.35, -1.95], txt, t, tt, { size: 60, bg: "#f5c518", until: tt === 8.6 ? 10.2 : tt + 0.9 });
      tag(sc, [0.2, 2.35, -1.95], L("dark"), t, 10.2, { size: 70 }); } },
  // 2. Оно погасло 8 минут назад
  { t0: 10.4, t1: 14.3, cam: [[10.4, [-0.35, 1.05, 0.65], [-0.4, 1.0, -0.6], 56], [14.3, [-0.35, 1.03, 0.45], [-0.4, 1.0, -0.6], 52]], focus: [-0.4, 1.0, -0.6],
    dark: () => 0.6,
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { night: 1 }), lamp: false });
      drawActor(sc, t, fobbin({ pos: [-0.4, 0, -0.6], expr: [[10.4, "nervous"], [12.1, "realize"], [13.2, "shock"]], bigEyes: [[12.9, true]] }));
      tag(sc, [-0.4, 1.62, -0.6], L("ago"), t, 12.8, { size: 60, bg: "#f5c518" }); } },
  // 3. Космос: свет летит 8 минут, а Солнце уже погасло
  { t0: 14.3, t1: 21.3,
    screen(g, t) { spaceBg(g, t, 3);
      const sx = 230, sy = 420, ex = 820, ey = 1330, dead = t > 15.4;
      g.save(); const sr = 170; g.fillStyle = dead ? "#5a5a66" : "#ffe066"; g.strokeStyle = "#20180f"; g.lineWidth = 8; g.beginPath(); g.arc(sx, sy, sr, 0, 7); g.fill(); g.stroke();
      if (!dead) { g.strokeStyle = "#ffd23f"; g.lineWidth = 12; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + t * 0.3; g.beginPath(); g.moveTo(sx + Math.cos(a) * sr * 1.2, sy + Math.sin(a) * sr * 1.2); g.lineTo(sx + Math.cos(a) * sr * 1.45, sy + Math.sin(a) * sr * 1.45); g.stroke(); } } g.restore();
      drawGlobe(g, ex, ey, 140, t);
      fobbinSprite(g, ex + 10, ey - 132, 90, { expr: t < 18.8 ? "realize" : "smug", lookX: -0.9 });
      // путь света
      g.save(); g.setLineDash([16, 18]); g.strokeStyle = "rgba(255,240,180,0.5)"; g.lineWidth = 5; g.beginPath(); g.moveTo(sx + 150, sy + 140); g.lineTo(ex - 120, ey - 100); g.stroke(); g.restore();
      const k = ramp(t, 15.4, 18.0), px = sx + 150 + (ex - 120 - sx - 150) * k, py = sy + 140 + (ey - 100 - sy - 140) * k;
      if (t > 15.4 && t < 18.6) { const gr = g.createRadialGradient(px, py, 0, px, py, 60); gr.addColorStop(0, "rgba(255,245,180,1)"); gr.addColorStop(1, "rgba(255,245,180,0)"); g.fillStyle = gr; g.beginPath(); g.arc(px, py, 60, 0, 7); g.fill(); }
      const mins = Math.min(8, Math.floor(ramp(t, 15.4, 18.0) * 8 + 0.0001));
      bubbleLabel(g, 760, 360, `${mins}:00 / 8:00`, t, 15.6, { size: 64, bg: "#ffffff" });
      if (t > 18.8) bubbleLabel(g, 560, 1080, L("oldLight"), t, 19.9, { size: 60, bg: "#f5c518" });
      bubbleLabel(g, sx, sy + 230, L("sun"), t, 14.5, { size: 50 }); bubbleLabel(g, ex, ey + 200, L("earth"), t, 14.7, { size: 50 }); } },
  // 4. Письмо пришло, а отправитель переехал
  { t0: 21.3, t1: 24.7, cam: [[21.3, [-1.6, 1.2, 1.6], [-2.1, 1.3, -3.6], 62], [24.7, [-1.65, 1.18, 1.3], [-2.1, 1.3, -3.6], 58]], focus: [-1.5, 1.0, -1.9],
    build(sc, t) { street(sc, t, { noCars: true });
      sc.decal([-2.75, 1.3, -3.58], 1.4, 0.45, 0, pMoved, "moved", { zb: 0.3, lw: 4 });
      drawActor(sc, t, fobbin({ pos: [-1.45, 0, -1.9], expr: [[21.3, "grin"], [22.4, "realize"], [23.4, "shock"]], look: [[21.3, 0], [23.0, -0.6]],
        handF: [[21.3, -0.12, 0.6], [24.7, -0.12, 0.6]], bendF: [[21.3, -0.4]],
        props: (g, fx, ty, k, t2, layer) => { if (layer === "front") { const [x, y] = loc(fx, ty, k)(-0.1, 0.63); drawEnvelope(g, x, y, k * 1.3, -0.15); } } }));
      tag(sc, [-2.75, 1.9, -3.58], L("late"), t, 23.4, { size: 58, bg: "#f5c518" }); } },
  // 5. Холод: батарея остывает, градусник падает
  { t0: 24.7, t1: 34.1, cam: [[24.7, [0.2, 1.15, 1.4], [0.4, 1.1, -1.6], 64], [34.1, [0.1, 1.12, 1.1], [0.4, 1.1, -1.6], 60]], focus: [0.0, 1.0, -0.8],
    dark: () => 0.5, post: (g, t) => frost(g, ramp(t, 25.0, 33.3)),
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { night: 1 }), lamp: false });
      const heat = 1 - ramp(t, 26.9, 31.5);
      sc.box([0.95, 0.45, -1.88], [0.9, 0.55, 0.12], heat > 0.3 ? "#f2a06b" : "#d8dde3", { glow: 0.35 * heat, zb: 0.1 });
      for (let i = 0; i < 6; i++) sc.box([0.6 + i * 0.14, 0.45, -1.8], [0.06, 0.5, 0.06], "#c9ccd1", { zb: 0.09, shadow: false });
      drawActor(sc, t, fobbin({ pos: [0.0, 0, -0.8], expr: [[24.7, "nervous"], [26.9, "realize"], [29.2, "nervous"], [31.4, "shock"]], shiver: [[24.9, true]], ...hug }));
      tag(sc, [0.95, 0.95, -1.85], L("warm"), t, 29.3, { size: 46, until: 31.0 }); },
    over(g, t) { const lv = 0.85 - 0.8 * ramp(t, 25.2, 33.0); drawThermo(g, 930, 520, 340, lv);
      if (t > 30.9) bubbleLabel(g, 800, 840, L("week"), t, 31.0, { size: 50 });
      if (t > 32.9) bubbleLabel(g, 780, 260, L("below"), t, 33.0, { size: 74, bg: "#8fd0ff" }); } },
  // 6. Луна тоже гаснет
  { t0: 34.1, t1: 38.2, cam: [[34.1, [-0.3, 1.1, 1.0], [0.2, 1.55, -1.8], 58], [38.2, [-0.2, 1.1, 0.75], [0.2, 1.6, -1.8], 54]], focus: [0.2, 1.7, -1.9],
    dark: () => 0.45,
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { night: 1, moon: 1 - ramp(t, 34.4, 35.3) }), lamp: false });
      drawActor(sc, t, fobbin({ pos: [-0.3, 0, -0.9], expr: [[34.1, "neutral"], [35.0, "shock"], [35.8, "realize"]], look: [[34.1, 0.8]] }));
      tag(sc, [0.0, 2.4, -1.95], L("moon"), t, 34.15, { size: 56, until: 35.3 });
      tag(sc, [0.2, 2.4, -1.95], L("sunlight"), t, 36.0, { size: 46, bg: "#f5c518" }); } },
  // 7. Фонарик и звёзды
  { t0: 38.2, t1: (TOTAL_T - HOOK), cam: [[38.2, [-0.5, 1.0, 1.4], [0.1, 1.6, -1.8], 66], [(TOTAL_T - HOOK), [-0.4, 0.98, 1.1], [0.15, 1.7, -1.8], 62]], focus: [-0.3, 1.0, -0.7],
    dark: (t) => 0.55 - 0.1 * ramp(t, 38.9, 39.2),
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { night: 1, stars: ramp(t, 39.6, 40.8) }), lamp: false });
      drawActor(sc, t, fobbin({ pos: [-0.35, 0, -0.7], expr: [[38.2, "nervous"], [38.9, "smug"], [39.9, "realize"], [40.8, "grin"], [42.0, "proud"]], look: [[38.2, 0.6]],
        handB: [[38.4, ...REST_BM], [38.7, 0.4, 0.95], [44, 0.4, 0.95]], bendB: [[38.4, 0.3]], props: flash }));
      tag(sc, [0.2, 2.5, -1.95], L("stars"), t, 40.8, { size: 56 }); } },
];

window.VIDEO = { total: TOTAL_T, titleEnd: 1.0, shots: [
  // крючок: полдень — и мгновенная темнота
  { t0: 0, t1: HOOK, cam: [[0, [-0.6, 1.2, 1.6], [0.3, 1.4, -1.8], 64], [HOOK, [-0.5, 1.15, 1.35], [0.3, 1.4, -1.8], 60]], focus: [-0.4, 1.0, -0.6],
    dark: (t) => 0.62 * ramp(t, 0.5, 0.58),
    build(sc, t) { const off = t > 0.5; bedroom(sc, t, { window: pSky(t, { sun: !off, night: off ? 1 : 0 }), lamp: off ? false : undefined });
      drawActor(sc, t, fobbin({ pos: [-0.4, 0, -0.6], expr: [[0, "grin"], [0.55, "shock"]], bigEyes: [[0.55, true]], look: [[0, 0.8], [0.55, 0]] })); } },
  ...shiftShots(SHOTS_MAIN, HOOK),
] };
