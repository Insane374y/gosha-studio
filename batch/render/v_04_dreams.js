// «Что если Гоша будет помнить все сны»
const ICONS = {
  fly: (g, x, y, s) => { goshaSprite(g, x, y + s * 0.42, s * 0.85, { expr: "laugh", handF: [-0.45, HZ + 0.1], handB: [0.45, HZ + 0.1], bendF: -0.2, bendB: 0.2 }); g.strokeStyle = "#7cc8ff"; g.lineWidth = 5; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(x - s * 0.55, y - s * 0.1 + i * s * 0.15); g.lineTo(x - s * 0.3, y - s * 0.1 + i * s * 0.15); g.stroke(); } },
  exam: (g, x, y, s) => { g.fillStyle = "#fff"; g.strokeStyle = "#20180f"; g.lineWidth = 4; g.save(); g.translate(x, y); g.rotate(-0.08); g.fillRect(-s * 0.32, -s * 0.38, s * 0.64, s * 0.76); g.strokeRect(-s * 0.32, -s * 0.38, s * 0.64, s * 0.76); g.fillStyle = "#d6453d"; g.font = `900 ${s * 0.15}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("ЭКЗАМЕН", 0, -s * 0.18); g.strokeStyle = "#9cc0e8"; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-s * 0.24, -s * 0.02 + i * s * 0.1); g.lineTo(s * 0.24, -s * 0.02 + i * s * 0.1); g.stroke(); } g.restore(); },
  dino: (g, x, y, s) => { drawDino(g, x + s * 0.05, y + s * 0.05, s * 0.45); drawPizza(g, x + s * 0.35, y + s * 0.15, s * 0.25); },
  zzz: (g, x, y, s) => { g.fillStyle = "#2f6fd6"; g.font = `900 ${s * 0.4}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("Z z z", x, y + s * 0.12); },
  star: (g, x, y, s) => { g.fillStyle = "#f5c518"; g.strokeStyle = "#20180f"; g.lineWidth = 4; g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? s * 0.16 : s * 0.38, a = i * Math.PI / 5 - Math.PI / 2; g[i ? "lineTo" : "moveTo"](x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); },
  cake: (g, x, y, s) => { g.fillStyle = "#f7a8c4"; g.strokeStyle = "#20180f"; g.lineWidth = 4; g.fillRect(x - s * 0.3, y - s * 0.1, s * 0.6, s * 0.3); g.strokeRect(x - s * 0.3, y - s * 0.1, s * 0.6, s * 0.3); g.fillStyle = "#fff"; g.fillRect(x - s * 0.3, y - s * 0.15, s * 0.6, s * 0.06); g.fillStyle = "#f5c518"; g.fillRect(x - s * 0.02, y - s * 0.35, s * 0.04, s * 0.2); },
  ufo: (g, x, y, s) => { g.fillStyle = "#c9ccd1"; g.strokeStyle = "#20180f"; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y, s * 0.4, s * 0.12, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#7cc8ff"; g.beginPath(); g.ellipse(x, y - s * 0.08, s * 0.18, s * 0.14, 0, Math.PI, 0); g.fill(); g.stroke(); },
};
const cloud = (g, t, t0, x, y, w, icon, tx, ty, fadeAt) => { if (t < t0) return; const sc = popScale(t, t0, 0.35), a = fadeAt ? 1 - ramp(t, fadeAt, fadeAt + 0.4) : 1; if (a <= 0) return; g.save(); g.translate(x, y); g.scale(sc, sc); g.translate(-x, -y); drawThought(g, x, y, w, w * 0.72, tx, ty, (gg, cx, cy, s) => ICONS[icon](gg, cx, cy, s * 0.9), a); g.restore(); };
const camcorder = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(0.35, 0.82); g.save(); g.translate(x, y); g.fillStyle = "#2a2d33"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.12 * k, -0.08 * k, 0.24 * k, 0.16 * k, 8); g.fill(); g.stroke(); g.fillStyle = "#6b7280"; g.beginPath(); g.arc(-0.14 * k, 0, 0.06 * k, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#9cc0e8"; g.beginPath(); g.arc(-0.14 * k, 0, 0.035 * k, 0, 7); g.fill(); g.fillStyle = "#555"; g.beginPath(); g.arc(0.07 * k, -0.04 * k, 0.018 * k, 0, 7); g.fill(); g.restore(); };
const notebookProps = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(0.0, 0.6); drawNotebook(g, x, y, k * 0.35, 1, -0.1); if (t > 36.4 && t < 41.5 || t > 37.5) { const w = Math.sin(t * 25) * 0.04 * k; g.save(); g.translate(x + w, y - 0.02 * k); g.rotate(0.6); g.fillStyle = "#f2c230"; g.strokeStyle = INKC; g.lineWidth = 3; g.fillRect(-0.01 * k, -0.12 * k, 0.02 * k, 0.12 * k); g.strokeRect(-0.01 * k, -0.12 * k, 0.02 * k, 0.12 * k); g.restore(); } };

window.VIDEO = { total: TOTAL_T, titleEnd: 2.8, title: ["ГОША БУДЕТ ПОМНИТЬ", "ВСЕ СНЫ"], shots: [
  // 0. Утро в спальне
  { t0: 0, t1: 3.0, cam: [[0, [-0.55, 1.0, 0.75], [-0.6, 1.0, -0.6], 60], [3.0, [-0.55, 1.0, 0.5], [-0.6, 1.0, -0.6], 56]], focus: [-0.6, 1.0, -0.6],
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { sun: true }) });
      drawActor(sc, t, gosha({ pos: [-0.6, 0, -0.6], expr: [[0, "blank"], [1.5, "realize"]], blinkHold: [[0, true], [1.4, false]] })); } },
  // 1. Проснулся и помнит всё: полёт, экзамен в пижаме, обед с динозавром
  { t0: 3.0, t1: 9.5, cam: [[3.0, [-0.4, 1.15, 1.7], [-0.7, 1.15, -0.8], 66], [9.5, [-0.45, 1.12, 1.45], [-0.7, 1.15, -0.8], 64]], focus: [-0.55, 1.0, -0.4],
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { sun: true }) });
      drawActor(sc, t, gosha({ pos: [-0.55, 0, -0.4], expr: [[3.0, "blank"], [3.6, "smug"], [4.4, "realize"], [5.3, "laugh"], [6.2, "nervous"], [7.8, "shock"]], bigEyes: [[7.8, true]],
        handF: [[3.3, ...REST_FM], [3.5, -0.45, HZ + 0.3], [4.2, -0.45, HZ + 0.3], [4.4, ...REST_FM]], handB: [[3.3, ...REST_BM], [3.5, 0.45, HZ + 0.3], [4.2, 0.45, HZ + 0.3], [4.4, ...REST_BM]], bendF: [[3.3, -0.2]], bendB: [[3.3, 0.2]] })); },
    over(g, t) { cloud(g, t, 5.3, 300, 380, 300, "fly", 480, 760); cloud(g, t, 6.2, 760, 330, 290, "exam", 580, 760); cloud(g, t, 7.8, 560, 170, 320, "dino", 560, 760); } },
  // 2. Все сны остаются в голове
  { t0: 9.5, t1: 14.1, cam: [[9.5, [-0.5, 1.05, 1.0], [-0.55, 1.0, -0.4], 60], [14.1, [-0.5, 1.03, 0.75], [-0.55, 1.0, -0.4], 56]], focus: [-0.55, 1.0, -0.4],
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { sun: true }) });
      drawActor(sc, t, gosha({ pos: [-0.55, 0, -0.4], expr: [[9.5, "realize"], [11.2, "nervous"], [12.6, "shock"]], bigEyes: [[12.6, true]] })); },
    over(g, t) { const C = [[10.6, 220, 330, "fly"], [10.9, 860, 330, "exam"], [11.2, 540, 180, "dino"], [11.5, 170, 620, "zzz"], [11.8, 910, 620, "star"], [12.1, 330, 120, "cake"], [12.4, 760, 110, "ufo"]];
      for (const [t0, x, y, ic] of C) cloud(g, t, t0, x, y, 230, ic, 540, 760); } },
  // 3. Правда ел пиццу с динозавром или это был сон?
  { t0: 14.1, t1: 19.4, cam: [[14.1, [0.6, 1.2, 1.3], [0.6, 0.95, -0.5], 62], [19.4, [0.6, 1.15, 1.0], [0.6, 0.95, -0.5], 58]], focus: [0.5, 1.0, -0.75],
    build(sc, t) { kitchen(sc, t, { noBowl: true, noFrontLegs: true });
      sc.sprite([0.85, 0.8, -0.4], -0.02, (g, x, y, k) => drawPizza(g, x, y, k * 0.2));
      drawActor(sc, t, gosha({ pos: [0.45, 0, -0.75], expr: [[14.1, "neutral"], [15.3, "blank"], [16.1, "realize"], [18.0, "shock"]], look: [[14.1, 0.6], [16.1, 0.9], [18.0, 0]], bigEyes: [[18.0, true]] }));
      tag(sc, [0.45, 1.6, -0.75], "?", t, 15.3, { size: 100, until: 18.0 }); tag(sc, [0.45, 1.6, -0.75], "СОН?!", t, 18.0, { size: 80, bg: "#f5c518" }); },
    over(g, t) { cloud(g, t, 16.6, 790, 330, 300, "dino", 600, 700); } },
  // 4. Во сне мозг почти не включает запись
  { t0: 19.4, t1: 25.9,
    screen(g, t) { g.fillStyle = "#1c2348"; g.fillRect(0, 0, W, H); spaceBg(g, t * 0.3, 7); g.fillStyle = "rgba(28,35,72,0.6)"; g.fillRect(0, 0, W, H);
      goshaSprite(g, 540, 2000, 1150, { expr: "blank", blink: true, tilt: 0.12 });
      g.save(); g.fillStyle = "#2f6fd6"; g.font = `900 70px ${FONT_TITLE}`; g.textAlign = "center"; g.fillText("Z z z", 860, 1080 + Math.sin(t * 2) * 10); g.restore();
      drawThought(g, 540, 560, 640, 480, 540, 980, (gg, x, y, s) => {
        gg.fillStyle = "#f7a8c4"; gg.strokeStyle = "#20180f"; gg.lineWidth = 7; gg.beginPath(); gg.ellipse(x, y - 10, s * 0.42, s * 0.3, 0, 0, 7); gg.fill(); gg.stroke();
        gg.lineWidth = 5; for (let i = 0; i < 5; i++) { gg.beginPath(); gg.arc(x - s * 0.3 + i * s * 0.15, y - 30 + (i % 2) * 30, s * 0.08, 0.2, Math.PI - 0.2); gg.stroke(); }
        const on = t < 23.0 ? Math.floor(t * 2) % 2 : 0; gg.fillStyle = on ? "#ff3b30" : "#777"; gg.beginPath(); gg.arc(x - 120, y + s * 0.38, 26, 0, 7); gg.fill(); gg.stroke();
        gg.fillStyle = "#111"; gg.font = `900 54px ${FONT_TITLE}`; gg.textAlign = "left"; gg.textBaseline = "middle"; gg.fillText(t < 23.0 ? "REC ?" : "REC: ВЫКЛ", x - 80, y + s * 0.38); });
      bubbleLabel(g, 540, 1000, "МОЗГ ВО СНЕ", t, 21.7, { size: 58, bg: "#f5c518" }); } },
  // 5. Камера снимает, но «запись» никто не нажал
  { t0: 25.9, t1: 29.9, cam: [[25.9, [0.25, 1.08, 1.35], [0.15, 1.0, -0.6], 58], [29.9, [0.25, 1.05, 1.1], [0.2, 0.95, -0.6], 56]], focus: [0.05, 0.95, -0.6],
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { sun: true }) });
      drawActor(sc, t, gosha({ pos: [0.0, 0, -0.6], expr: [[25.9, "smug"], [27.5, "grin"], [28.1, "realize"], [28.8, "nervous"]], look: [[25.9, 0.6]],
        handB: [[26.0, ...REST_BM], [26.2, 0.38, 0.82], [29.9, 0.38, 0.82]], bendB: [[26.0, 0.4]], props: camcorder }));
      tag(sc, [0.3, 1.25, -0.6], "REC", t, 28.1, { size: 60, bg: "#ddd", until: 28.8 }); tag(sc, [0.3, 1.25, -0.6], "НЕ НАЖАТО", t, 28.8, { size: 54, bg: "#ff6b6b", fg: "#fff" }); } },
  // 6. Забываем в первые минуты — надо сразу пересказать или записать
  { t0: 29.9, t1: 37.5, cam: [[29.9, [-0.4, 1.15, 1.6], [-0.6, 1.1, -0.8], 64], [37.5, [-0.4, 1.12, 1.3], [-0.6, 1.1, -0.8], 60]], focus: [-0.55, 1.0, -0.4],
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { sun: true }) });
      const hasBook = t > 34.0;
      drawActor(sc, t, gosha({ pos: [-0.55, 0, -0.4], expr: [[29.9, "nervous"], [31.6, "shock"], [33.8, "realize"], [35.6, "grin"], [36.6, "proud"]], bigEyes: [[31.6, true], [33.8, false]],
        mouth: [[35.0, ["open", 0.7]], [35.3, ["o", 0.6]], [35.6, ["open", 0.8]], [35.9, undefined]],
        handF: hasBook ? [[34.0, -0.1, 0.58], [40, -0.1, 0.58]] : null, handB: hasBook ? [[34.0, 0.12, 0.6], [40, 0.12, 0.6]] : null, bendF: [[34.0, -0.4]], bendB: [[34.0, 0.4]], props: hasBook ? notebookProps : null }));
      tag(sc, [1.8, 2.3, -1.95], "ПЕРВЫЕ МИНУТЫ", t, 31.7, { size: 46, until: 33.8 });
      tag(sc, [-0.25, 1.6, -0.4], "РАССКАЗАТЬ", t, 35.4, { size: 50, until: 36.5 }); tag(sc, [-0.25, 1.6, -0.4], "ЗАПИСАТЬ!", t, 36.5, { size: 56, bg: "#f5c518" }); },
    over(g, t) { const C = [[29.9, 220, 330, "fly"], [29.9, 860, 330, "exam"], [29.9, 540, 180, "dino"]]; C.forEach(([t0, x, y, ic], i) => cloud(g, t, t0, x, y, 230, ic, 540, 760, 30.6 + i * 0.6)); } },
  // 7. Тетрадь на сто страниц
  { t0: 37.5, t1: 41.5, cam: [[37.5, [1.1, 1.25, 0.7], [1.55, 0.85, -1.6], 62], [41.5, [1.15, 1.2, 0.45], [1.6, 0.85, -1.6], 58]], focus: [1.85, 0.9, -1.5],
    build(sc, t) { bedroom(sc, t, { window: pSky(t, { sun: true }) });
      const pages = 1 + Math.floor(ramp(t, 37.8, 40.5) * 11);
      sc.sprite([1.75, 0.76, -1.5], -0.05, (g, x, y, k) => drawNotebook(g, x, y - pages * 2, k * 0.42, pages, -0.05));
      drawActor(sc, t, gosha({ pos: [1.2, 0, -1.25], expr: [[37.5, "smug"], [38.7, "proud"], [40.2, "laugh"]], look: [[37.5, 0.8]],
        handB: [[37.6, 0.42, 0.7], [37.8, 0.5, 0.75], [38.0, 0.42, 0.7], [38.2, 0.5, 0.75], [38.4, 0.42, 0.7], [38.6, 0.5, 0.75], [38.8, 0.42, 0.7], [39.0, 0.5, 0.75]], bendB: [[37.5, 0.3]] }));
      tag(sc, [1.75, 1.15, -1.5], "100 СТРАНИЦ", t, 40.4, { size: 58, bg: "#f5c518" }); } },
  // 8. Последняя страница — а за окном…
  { t0: 41.5, t1: TOTAL_T, cam: [[41.5, [-0.2, 1.1, 1.2], [0.1, 1.35, -1.8], 62], [TOTAL_T, [-0.15, 1.08, 0.95], [0.15, 1.4, -1.8], 58]], focus: [-0.2, 1.0, -0.6],
    build(sc, t) { const dx = ramp(t, 43.6, 44.4);
      bedroom(sc, t, { window: pSky(t, { sun: true, extra: (g, w, h) => { if (dx > 0) drawDino(g, w * (1.25 - dx * 0.5), h * 0.62, h * 0.35); } }) });
      drawActor(sc, t, gosha({ pos: [-0.05, 0, -0.6], expr: [[41.5, "neutral"], [42.2, "realize"], [43.0, "nervous"], [43.8, "blank"]], look: [[41.5, -0.6]],
        handF: [[41.5, -0.1, 0.58], [50, -0.1, 0.58]], handB: [[41.5, 0.12, 0.6], [50, 0.12, 0.6]], bendF: [[41.5, -0.4]], bendB: [[41.5, 0.4]], props: notebookProps }));
      tag(sc, [0.0, 1.62, -0.6], "ДИНОЗАВР БЫЛ НАСТОЯЩИЙ?", t, 42.6, { size: 38 }); } },
] };
