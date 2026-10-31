// «What if Fobbin got swallowed by a whale?» — кашалот, Мексиканский залив, честный таймер без кислорода. Тайминги — по голосу (cap_08_whale.js).
const seq = (t, a, b, from, to) => from + (to - from) * ramp(t, a, b);
// Смена ракурса по ходу рассказа: с момента t камера быстро (0.5 с) и плавно перелетает в новый ракурс, потом держит его с лёгким наездом.
const MOVE = 0.5;
const shotCam = (F, t1) => { const keys = [];
  F.forEach(([t, pos, look, fov], i) => { const start = i ? t + MOVE : t, end = i < F.length - 1 ? F[i + 1][0] : t1;
    const drift = v3.lerp(pos, look, 0.03); keys.push([start, pos, look, fov]); if (end > start + 0.05) keys.push([end, drift, look, fov]); });
  return keys; };
// камера, которая следит за точкой p(t): ключи каждые 0.2 с
const track3 = (t0, t1, p, off, aim = [0, 0, 0], fov = 52) => { const k = [];
  for (let tt = t0; tt <= t1 + 1e-6; tt += 0.2) { const c = p(tt); k.push([tt, v3.add(c, off), v3.add(c, aim), fov]); } return k; };

// ---------------------------------------------------------------- таймер без воздуха: 0:00 → 6:00 синхронно с голосом
const TIMER = [[17.0, 0], [25.4, 10], [36.2, 30], [53.3, 60], [56.2, 120], [58.5, 240], [59.2, 360]];
function timerSec(t) { if (t <= TIMER[0][0]) return 0; for (let i = 1; i < TIMER.length; i++) if (t <= TIMER[i][0]) { const [a, va] = TIMER[i - 1], [b, vb] = TIMER[i]; return va + (vb - va) * (t - a) / (b - a); } return 360; }
function drawTimer(g, t) {
  if (t < 17.0 || t > 61.7) return;
  const s = Math.floor(timerSec(t)), txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, k = popScale(t, 17.0), hot = s >= 60;
  g.save(); g.translate(W - 175, 150); g.scale(k, k);
  g.fillStyle = hot ? "#e8453c" : "#fffaf0"; g.strokeStyle = "#000"; g.lineWidth = 6; g.beginPath(); g.roundRect(-140, -52, 280, 104, 30); g.fill(); g.stroke();
  g.fillStyle = hot ? "#fff" : INKC; g.beginPath(); g.arc(-88, 0, 26, 0, 7); g.lineWidth = 6; g.strokeStyle = hot ? "#fff" : INKC; g.stroke();
  const a = (timerSec(t) % 60) / 60 * Math.PI * 2 - Math.PI / 2; g.beginPath(); g.moveTo(-88, 0); g.lineTo(-88 + Math.cos(a) * 18, Math.sin(a) * 18); g.lineWidth = 5; g.stroke();
  g.font = `900 64px ${FONT_TITLE}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 30, 4);
  g.restore();
}
const withTimer = (f) => (g, t) => { if (f) f(g, t); drawTimer(g, t); };

// ---------------------------------------------------------------- разрез: кит уходит в глубину, линейка в футах
function diveSection(g, t) {
  const D = t < 26.2 ? 0 : t < 31.6 ? seq(t, 26.2, 31.6, 0, 100) : seq(t, 31.6, 34.9, 100, 135);   // глубина головы кита, футы
  const PX = 7.2, cy = 1080, Yd = (ft) => cy + (ft - D) * PX;   // экранная Y для глубины
  const d01 = clamp(D / 260, 0, 1);
  const gr = g.createLinearGradient(0, Yd(0), 0, Yd(260)); gr.addColorStop(0, "#2f9ad2"); gr.addColorStop(1, "#04142a");
  g.fillStyle = "#04142a"; g.fillRect(0, 0, W, H); g.fillStyle = gr; g.fillRect(0, Math.max(0, Yd(0)), W, H);
  if (Yd(0) > 0) { const sky = g.createLinearGradient(0, 0, 0, Yd(0)); sky.addColorStop(0, "#6cc0f2"); sky.addColorStop(1, "#d8f1ff"); g.fillStyle = sky; g.fillRect(0, 0, W, Yd(0));
    g.strokeStyle = "#fff"; g.lineWidth = 6; g.beginPath(); for (let x = 0; x <= W; x += 10) g.lineTo(x, Yd(0) + Math.sin(x * 0.03 + t * 3) * 6); g.stroke(); emitGlow(W * 0.7, Yd(0) - 300, 260, "#fff4c0", 0.6); }
  // лучи у поверхности
  g.save(); g.globalCompositeOperation = "screen"; for (let i = 0; i < 5; i++) { const x0 = 150 + i * 210 + Math.sin(t * 0.6 + i) * 30, lg = g.createLinearGradient(0, Yd(0), 0, Yd(70));
    lg.addColorStop(0, "rgba(210,250,255,0.22)"); lg.addColorStop(1, "rgba(210,250,255,0)"); g.fillStyle = lg; g.beginPath(); g.moveTo(x0, Yd(0)); g.lineTo(x0 + 60, Yd(0)); g.lineTo(x0 + 160, Yd(70)); g.lineTo(x0 + 20, Yd(70)); g.fill(); } g.restore();
  // линейка глубины: каждые 33 фута — +1 атмосфера
  g.font = `900 40px ${FONT_TITLE}`; g.textBaseline = "middle";
  for (let ft = 0; ft <= 300; ft += 11) { const y = Yd(ft), major = ft % 33 === 0; if (y < -20 || y > H + 20) continue;
    g.strokeStyle = major ? "#fff" : "rgba(255,255,255,0.45)"; g.lineWidth = major ? 6 : 3; g.beginPath(); g.moveTo(0, y); g.lineTo(major ? 70 : 36, y); g.stroke();
    if (major && ft > 0) { g.setLineDash([14, 14]); g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 3; g.beginPath(); g.moveTo(80, y); g.lineTo(W, y); g.stroke(); g.setLineDash([]);
      g.textAlign = "left"; g.lineWidth = 8; g.strokeStyle = "#000"; g.strokeText(`${ft} ${L("ft")}`, 86, y - 26); g.fillStyle = "#fff"; g.fillText(`${ft} ${L("ft")}`, 86, y - 26);
      g.textAlign = "right"; g.strokeText(`${ft / 33 + 1} ATM`, W - 30, y - 26); g.fillStyle = "#9fe3ff"; g.fillText(`${ft / 33 + 1} ATM`, W - 30, y - 26); } }
  // кит головой вниз, в нём «рентгеном» — Fobbin
  const wx = 560, wy = cy + 120 + Math.sin(t * 1.2) * 6, k = 46, rot = t < 26.2 ? 0 : -0.55 * ramp(t, 26.2, 27.0);
  for (let i = 0; i < 6; i++) { const y = wy - 200 - ((t * 120 + i * 90) % 520); g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 3; g.beginPath(); g.arc(wx + 140 + Math.sin(t * 3 + i) * 12, y, 6 + (i % 3) * 3, 0, 7); g.stroke(); }
  drawWhale(g, wx, wy, k, t, { rot, flip: false });
  g.save(); g.translate(wx, wy); g.rotate(rot); const bx = 0.2 * k, by = 0.1 * k;
  g.fillStyle = "rgba(255,240,200,0.28)"; g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 4; g.setLineDash([10, 8]); g.beginPath(); g.arc(bx, by, 62, 0, 7); g.fill(); g.stroke(); g.setLineDash([]);
  g.rotate(-rot); fobbinSprite(g, bx * Math.cos(rot) - by * Math.sin(rot), bx * Math.sin(rot) + by * Math.cos(rot) + 46, 100, { expr: t > 34 ? "shock" : "holdlaugh" }); g.restore();
  // темнеет с глубиной
  if (d01 > 0) { g.fillStyle = `rgba(2,6,16,${d01 * 0.35})`; g.fillRect(0, 0, W, H); }
}

// ---------------------------------------------------------------- шкала «без кислорода» с зонами
function oxygenMeter(g, x, y, w, h, k, t) {
  const v = clamp(timerSec(t) / 360, 0, 1), bh = 74, by = y + 40, X = (m) => x + (w * m) / 6;
  const zones = [[0, 1, INFO.green], [1, 4, INFO.gold], [4, 6, INFO.hot]];
  g.save(); g.beginPath(); g.roundRect(x, by, w, bh, bh / 2); g.clip();
  for (const [a, b, c] of zones) { g.fillStyle = c; g.globalAlpha = 0.35; g.fillRect(X(a), by, X(b) - X(a), bh); g.globalAlpha = 1; g.fillRect(X(a), by, Math.max(0, Math.min(X(b), x + w * v * easeOut(k)) - X(a)), bh); }
  g.restore(); g.strokeStyle = INFO.ink; g.lineWidth = 5; g.beginPath(); g.roundRect(x, by, w, bh, bh / 2); g.stroke();
  const mx = x + w * v * easeOut(k); g.fillStyle = INFO.ink; g.beginPath(); g.moveTo(mx, by - 6); g.lineTo(mx - 18, by - 34); g.lineTo(mx + 18, by - 34); g.closePath(); g.fill();
  g.font = `800 30px ${FONT_TITLE}`; g.textAlign = "center"; g.fillStyle = INFO.muted;
  for (const m of [0, 1, 2, 4, 6]) g.fillText(`${m}`, X(m), by + bh + 34);
  g.font = `900 34px ${FONT_TITLE}`;
  for (const [m, key, c] of [[0.6, "awake", INFO.green], [2, "blackout", "#c98a1a"], [5.1, "damage", INFO.hot]]) { g.fillStyle = c; g.fillText(L(key), X(m), by + bh + 92); }
  g.font = `800 26px ${FONT_TITLE}`; g.fillStyle = INFO.muted; g.fillText(L("minutes"), x + w / 2, by + bh + 140);
}

// ---------------------------------------------------------------- шоты
const FOB_Y = (t) => smoothTrack(t, [[6.6, -1.2], [10.8, -4.0]])[0];   // глубина Fobbin в шоте 2
window.VIDEO = { total: TOTAL_T, titleEnd: 1.0, motes: 0, shots: [
  // 0. Крючок: Fobbin держит вдох, снизу из темноты распахивается челюсть кашалота — глоть
  { t0: 0, t1: 4.15, cam: [[0, [0.8, -1.55, -2.4], [0.45, -1.75, -5.5], 50], [0.9, [1.3, -1.7, -1.3], [0.2, -2.5, -6], 56], [1.5, [1.3, -1.7, -1.3], [0.2, -2.4, -6], 56], [3.6, [4.5, -3.0, 9], [0.6, -4.4, -6.5], 62], [4.15, [4.6, -3.0, 9.4], [0.6, -4.2, -6.5], 62]],
    focus: [0, -2.6, -5], shake: (t) => (t > 1.42 && t < 1.9 ? 0.03 * (1 - ramp(t, 1.42, 1.9)) : 0),
    build(sc, t) { underwater(sc, t, { depth: 0.15, bubbles: t < 1.45 ? [[0.12, -1.6, -5]] : [[0.4, -2.6, -6.2]] });
      const yc = t < 1.45 ? seq(t, 0, 1.45, -15, -7.3) : seq(t, 1.45, 4.15, -7.3, -5.8), jaw = t < 0.45 ? 0 : t < 0.9 ? ramp(t, 0.45, 0.9) : t < 1.35 ? 1 : 1 - ramp(t, 1.35, 1.47);
      sc.sprite([0.5, yc, -6.6], 0.6, (g, X, Y, k) => drawWhale(g, X, Y, k, t, { rot: Math.PI / 2 - (t > 1.45 ? 0.35 * ramp(t, 1.45, 4) : 0), jaw }));
      if (t < 1.47) drawActor(sc, t, fobbin({ pos: [0, -2.7, -5], lift: [[0, 0], [1.4, 0.15]], shadow: false, expr: [[0, "holdlaugh"], [0.95, "shock"]], bigEyes: [[0.95, true]] })); },
    over(g, t) { bubbleLabel(g, W / 2, 330, L("noRescue"), t, 3.2, { size: 80, bg: "#e8453c", fg: "#fff" }); } },
  // 1. Мексиканский залив: лодка, Fobbin делает вдох и прыгает
  { t0: 4.15, t1: 6.6, cam: shotCam([[4.15, [4.2, 2.0, 1.0], [0.3, 1.1, -5], 50], [5.6, [3.0, 1.3, -1.4], [0.9, 0.9, -5], 48]], 6.6), focus: [0, 1, -5],
    build(sc, t) { sc.skybox(beachSky(t, { noHills: true })); sc.ground(-90, 90, -90, 20, 0, "#2b88d0", texSea, "sea", { tile: 5, off: [t * 0.25, t * 0.7], dist: 40 });
      sc.box([0, 0.3, -5], [3.4, 0.6, 1.8], "#f7f3ea", { zb: 0.3, shadow: false }); sc.box([0, 0.62, -5], [3.4, 0.04, 1.8], "#c98a4b", { zb: 0.28, shadow: false, line: true });
      sc.box([-1.2, 1.05, -5.6], [0.06, 0.9, 0.06], "#e8453c", { shadow: false }); sc.box([-0.9, 1.4, -5.6], [0.55, 0.3, 0.02], "#e8453c", { shadow: false });   // флажок ныряльщика
      for (let i = 0; i < 4; i++) { const x = ((t * (1.2 + i * 0.3) + i * 9) % 40) - 20; sc.sprite([x, 8 + (i % 2), -22 - i * 3], -1, (g, X, Y, k) => drawGull(g, X, Y, k, t + i)); }
      if (t > 6.25) sc.sprite([1.9, 0.02, -5], -0.2, (g, X, Y, k) => { const p = ramp(t, 6.25, 6.6); g.fillStyle = `rgba(255,255,255,${1 - p})`; for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + 0.8 * i / 8); g.beginPath(); g.arc(X + Math.cos(a) * (0.3 + p) * k, Y + Math.sin(a) * (0.5 + p * 0.6) * k, 0.08 * k, 0, 7); g.fill(); } });
      if (t < 6.3) drawActor(sc, t, fobbin({ walk: [[4.15, 0, -5], [5.85, 0, -5], [6.3, 1.9, -5]], lift: [[4.15, 0.62, 0], [5.85, 0.62, 0], [6.05, 1.3, 0], [6.3, -0.3, 0]],
        ground: (x) => (x < 1.7 ? 0.62 : 0), expr: [[4.15, "grin"], [5.3, "holdlaugh"]] })); },
    over(g, t) { bubbleLabel(g, W / 2, 330, L("gulf"), t, 4.3, { size: 66 }); } },
  // 2. Под водой: один вдох; снизу из темноты — пасть кашалота
  { t0: 6.6, t1: 11.45, cam: [...track3(6.6, 9.1, (tt) => [0, FOB_Y(tt) + 1.2, -5], [1.3, 0.25, 2.6], [0, -0.05, 0], 48), [9.6, [2.8, -1.6, -0.6], [0.2, -4.6, -6.5], 58], [11.45, [2.7, -1.7, -0.9], [0.2, -4.7, -6.5], 58]], focus: [0, -3, -5],
    shake: (t) => (t > 10.8 && t < 11.2 ? 0.03 : 0), dark: (t) => (t > 10.85 ? ramp(t, 10.85, 11.1) * 0.95 : 0),
    build(sc, t) { underwater(sc, t, { depth: 0.1 + ramp(t, 6.6, 11) * 0.15, bubbles: t < 10.8 ? [[0.12, -1.5 - seq(t, 6.6, 11, 0, 2.8), -5]] : [] });
      const yc = seq(t, 9.1, 10.85, -21, -9.6), jaw = t < 9.7 ? 0 : t < 10.2 ? ramp(t, 9.7, 10.2) : t < 10.72 ? 1 : 1 - ramp(t, 10.72, 10.84);
      if (t > 9.1) sc.sprite([0.4, yc, -6.6], 0.6, (g, X, Y, k) => drawWhale(g, X, Y, k, t, { rot: Math.PI / 2, jaw, seed: 2 }));
      if (t < 10.84) drawActor(sc, t, fobbin({ pos: [0, 0, -5], lift: [[6.6, -1.2], [10.8, -4.0]], shadow: false, expr: [[6.6, "holdlaugh"], [10.2, "shock"]], bigEyes: [[10.2, true]] })); },
    over(g, t) { if (t < 9.0) bubbleLabel(g, W / 2, 330, L("breath"), t, 7.4, { size: 64, bg: "#9fe3ff" }); } },
  // 3. Только кашалот может: глотает гигантских кальмаров целиком + карточка «может ли он тебя проглотить»
  { t0: 11.45, t1: 17.0, cam: shotCam([[11.45, [1, -28.6, 9], [0, -30, -14], 56], [13.1, [-3.6, -29.6, -4.5], [-5.6, -30.4, -14], 50], [14.8, [-2.4, -29.9, -5.0], [-3.4, -30.6, -13], 50]], 17.0), focus: [-3, -30, -14],
    build(sc, t) { underwater(sc, t, { depth: 0.45, surface: false, fish: [[-9, -27, -18, 6, "#7fd0f0"]] });
      const wx = seq(t, 11.45, 17, 3.0, 1.6), jaw = t < 13.0 ? 0 : t < 13.5 ? ramp(t, 13.0, 13.5) : t < 14.0 ? 1 : 1 - ramp(t, 14.0, 14.3);
      sc.sprite([wx, -30, -14], 0.6, (g, X, Y, k) => drawWhale(g, X, Y, k, t, { jaw, seed: 1 }));
      if (t < 14.05) { const sx = wx - 8.6 + ramp(t, 13.3, 14.05) * 3.2; sc.sprite([sx, -30.2 + ramp(t, 13.3, 14.05) * -0.3, -13.9], 0.5, (g, X, Y, k) => drawSquid(g, X, Y, k * 0.9, t, { rot: Math.PI })); }
      if (t > 14.9) drawActor(sc, t, fobbin({ pos: [wx - 4.3, -31.2, -12.4], scale: [[14.9, 0.01], [15.2, 1]], shadow: false, expr: [[14.9, "realize"]], bigEyes: [[14.9, true]] })); },
    over(g, t) { infoCard(g, W / 2, 560, L("swallow"), t, 11.6, { w: 940, h: 560, until: 14.7, note: L("throat"),
        draw: (g2, x, y, w, h, k, tt) => chartBars(g2, x, y, w, h, [[L("humpback"), 30, INFO.muted, L("no")], [L("blue"), 22, INFO.muted, L("no")], [L("sperm"), 100, INFO.green, L("yes")]], k, { at: [11.9, 12.2, 12.5], t: tt, max: 100 }) });
      bubbleLabel(g, W / 2, 330, L("fits"), t, 15.2, { size: 62, bg: "#f5c518" }); } },
  // 4. Внутри: ноль секунд, полная темнота, стенки сжимают, нет воздушного кармана
  { t0: 17.0, t1: 25.4, cam: shotCam([[17.0, [0.55, 1.25, 1.0], [0, 1.0, -2], 44], [19.8, [1.5, 1.9, 2.6], [0, 0.8, -2.5], 56], [23.0, [0.35, 1.3, 0.1], [0, 1.15, -2], 40]], 25.4), focus: [0, 1, -2],
    shake: (t) => (t > 19.9 && t < 21.4 ? 0.012 : 0), dark: (t) => (t < 19.8 ? 0.8 - ramp(t, 18.9, 19.8) * 0.6 : 0.2), post: insideGrade(0.25),
    build(sc, t) { whaleInside(sc, t, { squeeze: t < 19.8 ? 0.1 : 0.1 + ramp(t, 19.8, 21.0) * 0.6 + Math.sin(t * 3) * 0.04 });
      drawActor(sc, t, fobbin({ pos: [0, 0, -2], expr: [[17.0, "shock"], [19.8, "holdlaugh"]], bigEyes: [[17.0, true], [19.8, false]], shiver: [[19.8, true], [21.6, false]] })); },
    over: withTimer((g, t) => { bubbleLabel(g, W / 2, 360, L("noAir"), t, 21.9, { size: 64, bg: "#fffaf0" }); bubbleLabel(g, W / 2, 490, L("noLight"), t, 23.0, { size: 56, bg: "#20180f", fg: "#fff" }); }) },
  // 5. Кит ныряет: разрез с линейкой глубины + график «воздух в лёгких»
  { t0: 25.4, t1: 34.9, screen: diveSection,
    over: withTimer((g, t) => infoCard(g, W / 2, 520, L("lungs"), t, 27.2, { w: 900, h: 500, until: 34.7, dur: 4.8, note: L("atm"),
      draw: (g2, x, y, w, h, k) => chartLine(g2, x, y, w, h, [[`0 ${L("ft")}`, 100], ["33", 50], ["66", 33], ["99", 25]], k, { min: 0, max: 110, fmt: (v) => v + "%", color: (v) => (v > 60 ? INFO.cold : v > 30 ? INFO.gold : INFO.hot) }) })) },
  // 6. Уши, углекислый газ, «вдохни!»
  { t0: 34.9, t1: 44.0, cam: shotCam([[34.9, [0.3, 1.3, -0.2], [0, 1.15, -2], 40], [36.2, [1.7, 1.15, 0.4], [0, 1.0, -2.2], 50], [40.1, [0.5, 0.45, 0.6], [0, 1.25, -2], 48]], 44.0), focus: [0, 1, -2],
    shake: (t) => (t < 35.9 || (t > 41.9 && t < 43.0) ? 0.012 : 0), dark: () => 0.2, post: insideGrade(0.25),
    build(sc, t) { whaleInside(sc, t, { squeeze: 0.45 + Math.sin(t * 2.4) * 0.08 });
      drawActor(sc, t, fobbin({ pos: [0, 0, -2], expr: [[34.9, "shock"], [36.2, "holdlaugh"], [39.0, "nervous"], [41.9, "shock"]], bigEyes: [[34.9, true], [36.2, false], [41.9, true]], shiver: [[39.0, true]] }));
      if (t < 36.3) for (const s of [-1, 1]) sc.overlay([s * 0.3, 1.25, -2], (g, X, Y) => drawRings(g, X, Y, 600, t, { dir: s < 0 ? Math.PI : 0, col: "rgba(255,240,180,0.95)", r1: 0.3 })); },
    over: withTimer((g, t) => { if (t < 40.6) bubbleLabel(g, W / 2, 360, L("co2"), t, 37.4, { size: 62, bg: "#f5c518" }); bubbleLabel(g, W / 2, 380, L("breathe"), t, 41.9, { size: 110, bg: "#e8453c", fg: "#fff" }); }) },
  // 7. Желудок: съезжает в первую камеру, стенки сжимаются как кулак; дальше — кислота. «Acid is slow. Air is fast.»
  { t0: 44.0, t1: 53.3, cam: shotCam([[44.0, [1.2, 1.7, 1.2], [0, 0.8, -4], 52], [46.5, [0.75, 1.3, -3.7], [0, 1.0, -6.6], 46], [48.2, [0.7, 2.5, -4.6], [0, 0.0, -11], 50], [51.0, [1.9, 1.5, -3.9], [-0.2, 0.5, -8.5], 52]], 53.3), focus: [0, 0.8, -7],
    shake: (t) => (t > 46.5 && t < 47.8 ? 0.016 : 0), dark: () => 0.18, post: insideGrade(0.22),
    build(sc, t) { whaleInside(sc, t, { squeeze: t < 46.5 ? 0.3 : t < 47.9 ? 0.3 + Math.sin(ramp(t, 46.5, 47.9) * Math.PI) * 0.6 : 0.3, acid: true, acidZ: -11 });
      drawActor(sc, t, fobbin({ walk: [[44.0, 0, -1.5], [45.8, 0, -6.6]], roll: [[44.0, 0], [44.4, -0.35], [45.6, -0.35], [46.0, 0]], lift: [[44, 0, 0], [44.4, 0.08, 0], [45.6, 0.08, 0], [46, 0, 0]],
        expr: [[44.0, "shock"], [46.5, "holdlaugh"], [48.4, "realize"], [51.0, "nervous"]], look: [[48.4, -0.6]], shiver: [[46.5, true], [47.9, false]] }));
      for (let i = 0; i < 5; i++) { const y = ((t * 0.5 + i * 0.3) % 1.2); sc.sprite([-0.8 + i * 0.4, 0.03 + y, -11 + Math.sin(i) * 0.6], -0.1, (g, X, Y, k) => { g.strokeStyle = `rgba(210,255,140,${1 - y / 1.2})`; g.lineWidth = 3; g.beginPath(); g.arc(X, Y, 0.05 * k, 0, 7); g.stroke(); }); } },
    over: withTimer((g, t) => { bubbleLabel(g, W / 2, 360, L("acidSlow"), t, 51.0, { size: 70, bg: "#b6e36a" }); bubbleLabel(g, W / 2, 500, L("airFast"), t, 52.6, { size: 78, bg: "#e8453c", fg: "#fff", rot: 0.03 }); }) },
  // 8. Одна минута… две… четыре–шесть: туннельное зрение, потеря сознания; шкала «без кислорода»
  { t0: 53.3, t1: 61.8, cam: shotCam([[53.3, [0.9, 1.4, -3.8], [0, 1.0, -6.6], 48], [57.1, [0.5, 1.5, -4.7], [0, 0.45, -6.6], 44]], 61.8), focus: [0, 0.8, -6.6],
    dark: (t) => 0.18 + ramp(t, 56.5, 57.8) * 0.4, post: (g, t) => { insideGrade(0.22)(g);
      const r = seq(t, 54.2, 57.6, H * 0.75, H * 0.12); const gr = g.createRadialGradient(W / 2, H * 0.47, r * 0.55, W / 2, H * 0.47, r); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.96)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H); },
    build(sc, t) { whaleInside(sc, t, { squeeze: 0.35 + Math.sin(t * 2) * 0.05, acid: true, acidZ: -11 });
      drawActor(sc, t, fobbin({ pos: [0, 0, -6.6], roll: [[57.1, 0], [57.8, -1.45]], lift: [[57.1, 0], [57.8, -0.2]], expr: [[53.3, "nervous"], [54.2, "blank"]], blinkHold: [[57.1, true]] })); },
    over: withTimer((g, t) => infoCard(g, W / 2, 470, L("oxygen"), t, 53.4, { w: 940, h: 420, until: 61.6, note: L("avg"), draw: (g2, x, y, w, h, k, tt) => oxygenMeter(g2, x, y, w, h, k, tt) })) },
  // 9. Честный ответ: снаружи кит спокойно плывёт дальше
  { t0: 61.8, t1: 70.0, cam: shotCam([[61.8, [2, -38.6, 10], [0, -40, -14], 58], [63.5, [-3.6, -39.2, -3.6], [-3.4, -40, -14], 50], [66.9, [4.2, -39.4, -2.2], [1.5, -40, -14], 52]], 70.0), focus: [0, -40, -14],
    build(sc, t) { underwater(sc, t, { depth: 0.6, surface: false, fish: [[-12, -36, -20, 6, "#7fd0f0"], [10, -43, -18, 5, "#f2b84b"]], bubbles: [[-6.4, -38.6, -13.8]] });
      sc.sprite([0.4 + Math.sin(t * 0.4) * 0.3, -40 + Math.sin(t * 0.8) * 0.15, -14], 0.6, (g, X, Y, k) => drawWhale(g, X, Y, k, t, { seed: 3 })); },
    over(g, t) { if (t < 66.6) { bubbleLabel(g, W / 2, 360, L("days"), t, 63.5, { size: 64 }); bubbleLabel(g, W / 2, 520, L("nope"), t, 64.2, { size: 120, bg: "#e8453c", fg: "#fff" }); }
      bubbleLabel(g, W / 2, 360, L("airFirst"), t, 67.3, { size: 64, bg: "#f5c518" }); } },
  // 10. Кит уходит на 3000 футов в темноту. «It never noticed.»
  { t0: 70.0, t1: TOTAL_T, cam: track3(70.0, TOTAL_T, (tt) => [seq(tt, 70, 74.9, 0, -4), seq(tt, 70, 74.9, -46, -54), -14], [3.5, 2.6, 15], [0, -0.6, 0], 56), focus: [0, -50, -14],
    build(sc, t) { underwater(sc, t, { depth: 0.65 + ramp(t, 70, 74.5) * 0.33, surface: false, fish: [] });
      sc.sprite([seq(t, 70, 74.9, 0, -4), seq(t, 70, 74.9, -46, -54), -14], 0.6, (g, X, Y, k) => drawWhale(g, X, Y, k, t, { rot: -0.45, seed: 4 })); },
    over(g, t) { infoCard(g, W / 2, 470, L("depth"), t, 70.1, { w: 760, h: 330, dur: 3.0, draw: (g2, x, y, w, h, k) => infoCounter(g2, x + w / 2, y + h / 2 - 10, 0, 3000, k, { suffix: " " + L("ft"), size: 120, color: INFO.cold }) });
      bubbleLabel(g, W / 2, 800, L("never"), t, 72.8, { size: 66, bg: "#fffaf0" }); } },
] };
