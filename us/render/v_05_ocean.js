// «What if Fobbin saw the ocean suddenly disappear?» — Гавайи, отлив перед цунами. Тайминги — по голосу (cap_05_ocean.js).
const SNORKEL = snorkelProp(52.5);
const BEACH_CAM = (t0, t1, a = [0, 2.2, 7], b = [0, 2.0, 5.5], look = [0, 1.0, -8], fov = 56) => [[t0, a, look, fov], [t1, b, look, fov - 3]];
const seq = (t, a, b, from, to) => from + (to - from) * ramp(t, a, b);
// камера, которая ведёт Fobbin: ключи каждые 0.2 с по его же траектории (pos(t) → [x, y, z]); Fobbin крупно, 50–60 % кадра
const follow = (t0, t1, pos, off = [1.3, 0.3, 3.4], aim = [0, 0.95, -1], fov = 50) => { const k = [];
  for (let tt = t0; tt <= t1 + 1e-6; tt += 0.2) { const [x, y, z] = pos(tt); k.push([tt, [x + off[0], y + 1 + off[1], z + off[2]], [x + aim[0], y + aim[1], z + aim[2]], fov]); } return k; };
// Смена ракурса по ходу рассказа: ракурсы F = [[t, pos, look, fov], …]. С момента t камера быстро (0.5 с) и плавно
// перелетает в новый ракурс, потом держит его с лёгким наездом (3 %), пока не придёт время следующего.
const MOVE = 0.5;
const shotCam = (F, t1) => { const keys = [];
  F.forEach(([t, pos, look, fov], i) => { const start = i ? t + MOVE : t, end = i < F.length - 1 ? F[i + 1][0] : t1;
    const drift = v3.lerp(pos, look, 0.03); keys.push([start, pos, look, fov]); if (end > start + 0.05) keys.push([end, drift, look, fov]); });
  return keys; };
const path = (keys) => (t) => { const [x, z] = smoothTrack(t, keys.map(([tt, x, z]) => [tt, x, z])); return [x, 0, z]; };
// сепия + зерно для флешбэка 1946
const sepia = (g, t) => { g.save(); g.globalCompositeOperation = "saturation"; g.fillStyle = "#808080"; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = "multiply"; g.fillStyle = "#e3c596"; g.fillRect(0, 0, W, H); g.globalCompositeOperation = "source-over";
  g.globalAlpha = 0.08; g.fillStyle = "#3b2a18"; for (let i = 0; i < 40; i++) { const x = (Math.sin(i * 91 + Math.floor(t * 12) * 13) * 0.5 + 0.5) * W; g.fillRect(x, 0, 2, H); } g.restore(); };
// мокрый песок — горизонт и фигурки на разрезе
function crossSection(g, t) {
  const sky = g.createLinearGradient(0, 0, 0, 760); sky.addColorStop(0, "#5fb4f0"); sky.addColorStop(1, "#cdeefe"); g.fillStyle = sky; g.fillRect(0, 0, W, 760);
  const SEA = 760, floor = (x) => (x < 760 ? 1500 - Math.sin(x * 0.01) * 20 : 1500 - ((x - 760) / 320) * 760);
  // где волна: быстро по открытому океану, у берега медленно и выше
  const wx = t < 29.6 ? 150 : t < 37.5 ? seq(t, 29.6, 37.5, 150, 650) : seq(t, 37.5, 45.5, 650, 840);
  const wh = t < 29.6 ? 0 : t < 37.5 ? 34 : seq(t, 37.5, 44.0, 34, 230), ww = t < 37.5 ? 130 : seq(t, 37.5, 44, 130, 80);
  const surf = (x) => SEA - wh * Math.exp(-(((x - wx) / ww) ** 2));
  const water = g.createLinearGradient(0, SEA, 0, 1500); water.addColorStop(0, "#2f8fd6"); water.addColorStop(1, "#123a6b");
  g.fillStyle = water; g.beginPath(); g.moveTo(0, surf(0)); for (let x = 0; x <= W; x += 6) g.lineTo(x, Math.min(surf(x), floor(x) + 1)); g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
  g.fillStyle = "#b8915f"; g.strokeStyle = INKC; g.lineWidth = 6; g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W; x += 6) { const quake = t > 28.3 && t < 29.6 && x < 300 ? Math.sin(t * 60) * 10 * (1 - x / 300) : 0; g.lineTo(x, floor(x) + quake); } g.lineTo(W, H); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 4; g.beginPath(); for (let x = 0; x <= W; x += 6) x ? g.lineTo(x, surf(x)) : g.moveTo(x, surf(x)); g.stroke();
  if (wh > 0) { g.strokeStyle = "#ffffff"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); for (let x = wx - ww; x <= wx + ww * 0.6; x += 6) x > wx - ww ? g.lineTo(x, surf(x)) : g.moveTo(x, surf(x)); g.stroke();
    bubbleLabel(g, wx, surf(wx) - 90, L("tsunami"), t, 29.7, { size: 44, bg: "#ffffff", tail: 0 }); }
  drawPalm(g, 1010, floor(1010), 22, t); fobbinSprite(g, 930, floor(930), 110, { expr: t < 41 ? "neutral" : "shock" });
  if (t > 28.3 && t < 31) emitGlow(150, 1480, 160, "#ffb050", 1 - ramp(t, 29.6, 31));   // толчок дна
  if (t > 36.4 && t < 37.6) { const px = wx; g.save(); g.translate(px, SEA - 170); g.fillStyle = "#f7f3ea"; g.strokeStyle = INKC; g.lineWidth = 4;
    g.beginPath(); g.ellipse(0, 0, 70, 14, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-10, 0); g.lineTo(-30, -40); g.lineTo(10, 0); g.fill(); g.stroke(); g.restore(); }
  bubbleLabel(g, 190, 1180, L("alaska"), t, 28.3, { size: 46 });
  bubbleLabel(g, 900, 640, L("hawaii"), t, 27.2, { size: 46 });
  if (t > 36.5 && t < 37.8) bubbleLabel(g, wx, SEA - 260, L("jet"), t, 36.5, { size: 52, bg: "#f5c518" });
}

window.VIDEO = { total: TOTAL_T, titleEnd: 1.0, shots: [
  // 0. Крючок: прыжок в волну — вода уходит из-под него, шлепок о мокрый песок
  { t0: 0, t1: 3.3, cam: [[0, [1.7, 1.2, 0.6], [-0.3, 0.95, -2.6], 52], [0.62, [1.9, 1.0, -1.5], [0, 0.7, -4.4], 50], [3.3, [1.5, 0.85, -2.1], [0, 0.45, -4.6], 46]], focus: [0, 0.8, -4.4],
    build(sc, t) { beach(sc, t, { water: seq(t, 0.4, 2.6, -5.2, -9.5), boats: [[-5, -13, 0.35], [6, -16, -0.3]] });
      drawActor(sc, t, fobbin({ walk: [[0, -0.6, -2.4], [0.62, 0, -4.4], [3.3, 0, -4.5]], run: [[0, 1], [0.62, 0]],
        roll: [[0, 0, 0], [0.62, 0, 0], [0.86, -1.45, 0], [3.3, -1.45, 0]], lift: [[0.62, 0, 0], [0.74, 0.35, 0], [0.9, -0.2, 0], [3.3, -0.2, 0]],
        expr: [[0, "grin"], [0.88, "shock"], [2.2, "realize"]], bigEyes: [[0.88, true]], props: SNORKEL })); } },
  // 1. «Hawaii.» — бежит в прибой, а прибой убегает от него
  { t0: 3.3, t1: 9.1, join: true, cam: [[3.3, [1.5, 0.85, -2.1], [0, 0.45, -4.6], 46], ...follow(3.8, 9.1, path([[3.8, 0, -4.5], [4.2, 0, -4.5], [7.2, 0, -9.5]]), [1.5, 0.35, 3.6], [0, 0.95, -1.2], 50)], focus: [0, 1, -6],
    build(sc, t) { beach(sc, t, { water: seq(t, 3.3, 8.8, -9.5, -22), boats: [[-5, -13, 0.35], [6, -16, -0.3]] });
      drawActor(sc, t, fobbin({ walk: [[3.3, 0, -4.5], [4.2, 0, -4.5], [7.2, 0, -9.5]], run: [[3.3, 0], [4.3, 1], [7.2, 0]],
        roll: [[3.3, -1.45, 0], [3.85, 0, 0]], lift: [[3.3, -0.2, 0], [3.85, 0, 0]],
        expr: [[3.3, "realize"], [4.3, "grin"], [7.4, "blank"]], props: SNORKEL })); },
    over(g, t) { if (t < 6.8) bubbleLabel(g, W / 2, 330, L("hawaii"), t, 3.4, { size: 66 }); } },
  // 2. Вода ушла дальше любого отлива: лодки на песке, рыба на рифе, все достают телефоны
  { t0: 9.1, t1: 18.1, join: true, cam: shotCam([
      [9.1, [1.5, 1.35, -5.9], [0, 0.95, -10.7], 50],          // продолжение шота 1
      [10.2, [2.6, 2.6, -4.2], [0, 0.6, -14], 54],             // «дальше любого отлива» — видно голое дно
      [12.1, [-2.2, 1.6, -9.5], [-4.5, 0.6, -13.5], 50],       // «лодки на голом песке»
      [14.0, [2.6, 0.55, -9.2], [1.7, 0.15, -11.2], 46],       // «рыба бьётся на рифе» — низко, крупно
      [15.8, [1.0, 1.45, -8.0], [2.6, 1.0, -12.2], 52],        // «все достают телефоны»
      [17.4, [1.3, 1.2, -6.6], [0, 0.85, -10.6], 48],          // снова Fobbin
    ], 18.1), focus: [0, 0.9, -9.5],
    build(sc, t) { beach(sc, t, { water: seq(t, 9.1, 18, -22, -27), line: ramp(t, 12, 16) * 0.7, boats: [[-5, -13, 0.35], [6, -16, -0.3], [-1, -19, 0.5]], fish: [[-1.4, -10.4], [1.7, -11.2], [3.6, -12.4]] });
      for (const [i, x, z] of [[0, -2.7, -11.8], [1, 2.9, -12.6], [2, 4.8, -11.0]])
        drawActor(sc, t, extra(i, { pos: [x, 0, z], expr: [[9.1, "realize"], [15.9, "grin"]], props: phoneProp(15.9 + i * 0.25) }));
      drawActor(sc, t, fobbin({ pos: [0, 0, -9.5], expr: [[9.1, "blank"], [12.2, "realize"], [16.6, "grin"]], props: SNORKEL })); },
    over(g, t) { if (t < 12.0) bubbleLabel(g, W / 2, 330, L("notLow"), t, 10.3, { size: 62, bg: "#f5c518" }); } },
  // 3. Fobbin идёт по дну за рыбой
  { t0: 18.1, t1: 20.3, join: true, cam: [[18.1, [1.3, 1.2, -6.6], [0, 0.85, -10.6], 48], ...follow(18.5, 20.3, path([[18.1, 0, -9.6], [19.9, 0.1, -11.6]]), [1.2, 0.15, 3.0], [0, 0.8, -1.0], 48)], focus: [0, 0.8, -11],
    build(sc, t) { beach(sc, t, { water: -27, line: 0.7, fish: [[0.6, -12.6]] });
      drawActor(sc, t, fobbin({ walk: [[18.1, 0, -9.6], [19.9, 0.1, -11.6]], run: [[18.1, 0.55], [19.9, 0]],
        expr: [[18.1, "grin"], [19.6, "smug"]], handF: [[19.5, -0.2, 0.46], [19.9, -0.45, 0.35]], props: SNORKEL })); } },
  // 4. «Stop.» — флешбэк: Хило, 1946 — люди тоже пошли за рыбой… и океан вернулся
  { t0: 20.3, t1: 26.6, cam: shotCam([[20.3, [0.6, 1.7, -4.2], [0, 0.9, -12], 54], [22.3, [1.2, 1.25, -7.0], [0, 0.9, -11.5], 46], [24.7, [0.4, 2.2, -2.4], [0, 0.8, -14], 56]], 26.6), focus: [0, 0.9, -10],
    post: (g, t) => sepia(g, t), motes: 0,
    build(sc, t) { const back = ramp(t, 24.8, 26.5); beach(sc, t, { water: -27 + back * 21, seaY: back * 0.5, line: 1 - back, noSun: true, boats: [[-5, -13, 0.35], [6, -16, -0.3]], fish: [[-2, -12], [2.5, -13]], towel: false });
      for (const [i, x] of [[0, -2.6], [1, 0.4], [2, 3.0]])
        drawActor(sc, t, extra(i, { walk: [[20.3, x, -9], [24.8, x * 1.1, -12.5], [26.6, x * 1.2, -6]], run: [[20.3, 0.5], [24.8, 1]],
          expr: [[20.3, "grin"], [24.9, "shock"]], bigEyes: [[24.9, true]], rim: false })); },
    over(g, t) { if (t < 21.3) bubbleLabel(g, W / 2, 380, L("stop"), t, 20.35, { size: 120, bg: "#e8453c", fg: "#fff" });
      bubbleLabel(g, W / 2, 380, L("hilo"), t, 21.6, { size: 62, bg: "#f7f3ea" }); } },
  // 5–6. Разрез океана: толчок у Аляски, волна несётся со скоростью самолёта, у берега тормозит и растёт + карточка скоростей
  { t0: 26.6, t1: 46.0, screen: crossSection,
    over(g, t) { infoCard(g, W / 2, 1060, L("speed"), t, 33.7, { w: 920, h: 470, until: 45.8,
      draw: (g2, x, y, w, h, k, tt) => chartBars(g2, x, y, w, h, [[L("open"), 500, INFO.cold, "500+"], [L("shore"), 30, INFO.gold, "20–30"], [L("human"), 28, INFO.hot, "~28"]], k,
        { at: [34.4, 38.6, 42.6], t: tt, max: 500 }) }); } },
  // 7. «Don't look. Run.» — Fobbin на дне видит белую полосу; карточка «на возвышенность»
  { t0: 46.0, t1: 52.0, cam: [...shotCam([[46.0, [0.9, 1.2, -8.0], [0, 0.95, -11], 48], [46.5, [0.45, 1.3, -8.3], [0, 0.85, -11], 46], [47.3, [1.0, 1.35, -7.4], [0, 1.1, -14], 52]], 48.2),
      [52.0, [0.7, 1.3, -3.0], [0, 1.0, -6.8], 52]], focus: [0, 1, -9],
    shake: (t) => (t > 46 && t < 47.4 ? 0.01 : 0),
    build(sc, t) { beach(sc, t, { water: -27, line: 1, fish: [[0.9, -12.4]] });
      drawActor(sc, t, fobbin({ walk: [[48.2, 0, -11], [52, 0, -6.5]], run: [[46, 0], [48.2, 1]],
        expr: [[46, "smug"], [46.6, "shock"], [48.2, "nervous"]], bigEyes: [[46.6, true]], props: SNORKEL })); },
    over(g, t) { if (t < 48.8) bubbleLabel(g, W / 2, 330, L("run"), t, 47.4, { size: 70, bg: "#e8453c", fg: "#fff" });
      infoCard(g, W / 2, 420, L("goHigh"), t, 48.9, { w: 900, h: 330, until: 51.8,
        draw: (g2, x, y, w, h, k) => { infoMeter(g2, x, y + 30, w, 70, 1, k, { color: INFO.green });
          g2.font = `800 34px ${FONT_TITLE}`; g2.fillStyle = INFO.hot; g2.textAlign = "left"; g2.fillText(L("beach"), x, y + h);
          g2.fillStyle = INFO.green; g2.textAlign = "right"; g2.fillText(L("high"), x + w, y + h); } }); } },
  // 8. Бежит в гору, роняет трубку; на полпути — сирены
  { t0: 52.0, t1: 56.7, cam: Array.from({ length: 48 }, (_, i) => 52 + (i * 4.7) / 47).map((tt) => { const x = seq(tt, 52, 56.7, -6, 8); return [tt, [x + 0.5, hillY(x) + 1.35, 3.4], [x + 0.5, hillY(x) + 1.05, -0.6], 52]; }),
    focus: [0, 1.5, -0.6],
    build(sc, t) { hill(sc, t, { siren: t > 55.6 ? 1 : 0 });
      if (t > 52.6) sc.sprite([-4.3, 0.05, -0.6], 0.1, (g, X, Y, k) => { g.strokeStyle = "#e8603c"; g.lineWidth = 0.06 * k; g.beginPath(); g.moveTo(X - 0.3 * k, Y); g.lineTo(X + 0.2 * k, Y - 0.08 * k); g.stroke(); });
      const xs = (tt) => seq(tt, 52, 56.7, -6, 8);
      const keys = []; for (let tt = 52; tt <= 56.71; tt += 0.1) keys.push([tt, xs(tt), -0.6]);   // частые ключи — ровный бег без рывков
      drawActor(sc, t, fobbin({ walk: keys, lift: keys.map(([tt, x]) => [tt, hillY(x), 0]), run: [[52, 1]], ground: hillY,
        expr: [[52, "nervous"], [55.6, "shock"]], props: SNORKEL })); } },
  // 9–10. С холма: море поднимается и переливается на улицы; карточка «уровень воды»
  { t0: 56.7, t1: 66.0, cam: shotCam([[56.7, [-0.4, 3.0, 26.0], [-0.3, 0.9, 14], 52], [59.3, [0, 10, 31], [0, 0, 1], 50], [64.2, [-0.3, 4.2, 27.5], [-0.3, 0.8, 12], 50]], 66.0), focus: [-0.9, 1, 22.4],
    build(sc, t) { townView(sc, t, { waterY: seq(t, 57.4, 61.6, 0, 1.3), edge: seq(t, 57.4, 61.6, -10, 7.5) });
      drawActor(sc, t, fobbin({ pos: [-0.9, 0, 22.4], expr: [[56.7, "shock"], [61.6, "nervous"]], bigEyes: [[56.7, true]] })); },
    over(g, t) { infoCard(g, W / 2, 470, L("level"), t, 61.6, { w: 920, h: 560, until: 65.9, dur: 2.6, note: L("illus"),
      draw: (g2, x, y, w, h, k) => chartLine(g2, x, y, w, h, [[L("normal"), 0], [L("pull"), -1], [L("w1"), 1.6], [L("w2"), 2.6], [L("w3"), 2.1]], k,
        { noValues: true, color: (v) => (v < 0 ? INFO.gold : INFO.cold), min: -1.4, max: 2.9 }) }); } },
  // 11. Отбой: полотенца нет, трубка на пальме — и в ней растерянная рыба
  { t0: 66.0, t1: TOTAL_T, cam: shotCam([[66.0, [0.4, 1.35, 2.6], [-1.2, 1.0, -1.6], 52], [67.6, [2.9, 1.3, 4.1], [2.0, 0.95, 0.6], 50], [69.3, [6.0, 2.4, 0.4], [7.15, 2.4, -3.2], 46], [71.8, [6.45, 2.5, -0.7], [7.15, 2.45, -3.2], 40]], TOTAL_T), focus: [7.15, 2.5, -3.2],
    build(sc, t) { beach(sc, t, { water: -6.4, towel: false, noSun: t > 69.5 });
      tag(sc, [2.2, 0.5, 1.2], "?", t, 68.1, { size: 70 });
      sc.sprite([7.15, 2.55, -3.2], -3, (g, X, Y, k) => { if (t < 72.0) { g.strokeStyle = INKC; g.lineWidth = 0.09 * k; g.lineCap = "round"; g.beginPath(); g.moveTo(X - 0.25 * k, Y); g.lineTo(X + 0.2 * k, Y - 0.45 * k); g.stroke();
          g.strokeStyle = "#e8603c"; g.lineWidth = 0.06 * k; g.stroke(); }
        else drawFish(g, X, Y, k * 1.5, t, { mask: true, flop: t < 72.6 }); });
      drawActor(sc, t, fobbin({ walk: [[66.8, -1.5, -1.5], [68.0, 2.0, 0.6]], run: [[66.8, 0.6], [68.0, 0]],
        expr: [[66, "neutral"], [67.7, "realize"], [69.5, "blank"], [72.6, "laugh"]], look: [[69.5, 0.8]] })); },
    over(g, t) { if (t < 69.2) bubbleLabel(g, W / 2, 330, L("clear"), t, 66.8, { size: 66, bg: "#3aa676", fg: "#fff" }); } },
] };
