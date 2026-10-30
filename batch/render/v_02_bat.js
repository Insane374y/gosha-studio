// «Что если Гоша будет слышать, как летучая мышь»
const EARS = { handF: [[0, -0.36, HZ], [9, -0.36, HZ]], handB: [[0, 0.36, HZ], [9, 0.36, HZ]], bendF: [[0, -0.3]], bendB: [[0, 0.3]] };
const pHole = (g, w, h) => { g.fillStyle = "#1b1410"; g.beginPath(); g.moveTo(0, h); g.lineTo(0, h * 0.45); g.arc(w / 2, h * 0.45, w / 2, Math.PI, 0); g.lineTo(w, h); g.closePath(); g.fill(); g.fillStyle = "#ffd23f"; for (const dx of [0.35, 0.62]) { g.beginPath(); g.arc(w * dx, h * 0.62, w * 0.06, 0, 7); g.fill(); } };
const whistle = (g, fx, ty, k, t, layer) => { if (layer !== "front" || t < 20.9 || t > 24.6) return; const [x, y] = loc(fx, ty, k)(-0.12, HZ - 0.14); g.save(); g.translate(x, y); g.rotate(-0.3); g.fillStyle = "#c9ccd1"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.09 * k, -0.025 * k, 0.12 * k, 0.05 * k, 6); g.fill(); g.stroke(); g.beginPath(); g.arc(0.04 * k, 0.01 * k, 0.035 * k, 0, 7); g.fill(); g.stroke(); g.restore(); };
const ringsAt = (sc, p, t, t0, t1, o = {}) => { if (t > t0 && t < t1) sc.overlay(p, (g, x, y) => drawRings(g, x, y, sc.cam.F / Math.max(0.5, sc.cam.toCam(p)[2]), t, o)); };
const MIDGES = Array.from({ length: 9 }, (_, i) => i);

window.VIDEO = { total: TOTAL_T, titleEnd: 2.6, title: ["ГОША СЛЫШИТ,", "КАК ЛЕТУЧАЯ МЫШЬ"], shots: [
  // 0. Крупно: Гоша зажимает уши, вокруг волны
  { t0: 0, t1: 2.8, cam: [[0, [-1.25, 0.9, 0.75], [-1.3, 0.95, -0.9], 60], [2.8, [-1.25, 0.9, 0.45], [-1.3, 0.95, -0.9], 56]], focus: [-1.3, 0.98, -0.9],
    build(sc, t) { kitchen(sc, t, { noTable: true });
      drawActor(sc, t, gosha({ pos: [-1.3, 0, -0.9], expr: [[0, "nervous"], [1.4, "shock"]], bigEyes: [[1.4, true]], ...EARS }));
      ringsAt(sc, [-1.3, 1.0, -0.85], t, 0.2, 2.8, { span: Math.PI * 2, r0: 0.3, r1: 0.5, n: 4, col: "rgba(150,230,255,0.85)" }); } },
  // 1. Холодильник визжит, как сирена
  { t0: 2.8, t1: 6.8, cam: [[2.8, [1.0, 1.2, 1.2], [2.2, 1.05, -1.4], 64], [6.8, [1.2, 1.18, 0.95], [2.25, 1.05, -1.4], 60]], focus: [1.85, 1.0, -0.85],
    build(sc, t) { kitchen(sc, t, { noTable: true });
      drawActor(sc, t, gosha({ pos: [1.85, 0, -0.85], expr: [[2.8, "smug"], [3.7, "grin"], [4.5, "shock"], [5.5, "nervous"]], bigEyes: [[4.5, true]], look: [[2.8, 0.8], [4.5, 0]],
        handB: [[3.0, ...REST_BM], [3.3, 0.45, 0.85], [4.4, 0.45, 0.85], [4.6, 0.36, HZ], [6.8, 0.36, HZ]], handF: [[4.4, ...REST_FM], [4.6, -0.36, HZ], [6.8, -0.36, HZ]], bendF: [[4.5, -0.3]], bendB: [[4.5, 0.3]], hop: [4.5, 0.4] }));
      ringsAt(sc, [2.6, 1.2, -1.15], t, 4.4, 6.8, { dir: Math.PI, span: Math.PI * 1.2, r1: 0.9, n: 4, col: "rgba(255,120,120,0.9)", lw: 9 });
      tag(sc, [2.6, 2.0, -1.2], "ИИИИИ!", t, 4.6, { size: 84, bg: "#ff6b6b", fg: "#fff" }); } },
  // 2. Зарядка пищит, телевизор свистит, мыши переговариваются
  { t0: 6.8, t1: 14.9, cam: [[6.8, [0.2, 1.25, 2.1], [0.0, 1.0, -1.0], 72], [14.9, [0.05, 1.22, 1.8], [-0.1, 0.95, -1.0], 72]], focus: [0.1, 1.0, -0.6],
    build(sc, t) { livingRoom(sc, t);
      sc.box([0.85, 0.85, -1.96], [0.14, 0.18, 0.06], "#f4f4f0", { zb: 0.05 }); sc.box([0.85, 0.7, -1.92], [0.1, 0.07, 0.1], "#20180f", { zb: 0.04 });
      sc.decal([-0.4, 0.17, -1.985], 0.3, 0.34, 0, pHole, "hole", { frame: false, zb: 0 });
      drawActor(sc, t, gosha({ pos: [0.1, 0, -0.6], expr: [[6.8, "neutral"], [7.8, "realize"], [10.2, "nervous"], [11.4, "shock"], [12.6, "realize"], [13.6, "laugh"]], bigEyes: [[10.2, true]],
        look: [[6.8, 0], [10.2, 0.6], [11.4, 0.8], [12.6, -0.8]] }));
      ringsAt(sc, [0.85, 0.92, -1.9], t, 10.2, 11.4, { dir: -Math.PI / 2, n: 3, col: "rgba(150,230,255,0.9)" });
      ringsAt(sc, [1.35, 1.12, -1.75], t, 11.4, 12.6, { dir: -Math.PI / 2, span: Math.PI, r1: 0.6, n: 3 });
      ringsAt(sc, [-0.4, 0.22, -1.9], t, 12.6, 14.9, { dir: -Math.PI / 2, n: 3, col: "rgba(255,230,120,0.9)" });
      tag(sc, [0.85, 1.25, -1.9], "ПИИИ", t, 10.2, { size: 56, until: 11.4 });
      tag(sc, [1.35, 1.7, -1.8], "ФЬЮЮЮ", t, 11.4, { size: 56, until: 12.6 });
      tag(sc, [-0.6, 0.7, -1.9], "ПИ-ПИ?", t, 12.7, { size: 52, bg: "#f5c518", until: 14.9 });
      tag(sc, [-0.1, 0.95, -1.9], "ПИ!", t, 13.4, { size: 52, until: 14.9 }); } },
  // 3. Это ультразвук: шкала частот
  { t0: 14.9, t1: 20.7, cam: [[14.9, [0.15, 1.05, 0.9], [0.0, 1.05, -0.8], 58], [20.7, [0.1, 1.02, 0.65], [0.0, 1.0, -0.8], 54]], focus: [0, 1.0, -0.6],
    build(sc, t) { livingRoom(sc, t);
      drawActor(sc, t, gosha({ pos: [0, 0, -0.6], expr: [[14.9, "blank"], [15.8, "realize"], [16.6, "neutral"], [18.9, "realize"], [19.5, "proud"]], look: [[14.9, 0.5], [16.6, 0]],
        handB: [[16.4, ...REST_BM], [16.7, 0.36, HZ + 0.02], [18.8, 0.36, HZ + 0.02], [19.1, ...REST_BM]], bendB: [[16.4, 0.3], [19.1, -0.12]] })); },
    over(g, t) { if (t < 16.4) return; const a = ramp(t, 16.4, 16.8); g.save(); g.globalAlpha = a;
      const x0 = 90, x1 = 990, y = 330, mid = x0 + (x1 - x0) * 0.42;
      g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 7; g.beginPath(); g.roundRect(60, 210, 960, 250, 30); g.fill(); g.stroke();
      g.fillStyle = "#6ccf7a"; g.fillRect(x0, y - 30, mid - x0, 60); g.fillStyle = "#8f63d2"; g.fillRect(mid, y - 30, x1 - mid, 60); g.strokeRect(x0, y - 30, x1 - x0, 60);
      g.font = `900 46px ${FONT_TITLE}`; g.fillStyle = "#111"; g.textAlign = "center"; g.fillText("ЧЕЛОВЕК", (x0 + mid) / 2, y - 55); g.fillText("УЛЬТРАЗВУК", (mid + x1) / 2, y - 55);
      g.font = `800 34px ${FONT_TITLE}`; g.fillText("слышим", (x0 + mid) / 2, y + 75); g.fillText("не слышим", (mid + x1) / 2, y + 75);
      const mk = x0 + (x1 - x0) * (0.2 + 0.6 * ramp(t, 16.9, 18.9)); g.fillStyle = "#f5c518"; g.beginPath(); g.moveTo(mk, y - 40); g.lineTo(mk - 22, y - 78); g.lineTo(mk + 22, y - 78); g.closePath(); g.fill(); g.stroke();
      g.restore(); } },
  // 4. Собачий свисток: собака в телевизоре подпрыгивает, Гоша не слышит
  { t0: 20.7, t1: 24.7, cam: [[20.7, [0.6, 1.15, 1.4], [0.7, 1.05, -1.3], 64], [24.7, [0.6, 1.12, 1.15], [0.75, 1.05, -1.3], 60]], focus: [0.2, 1.0, -0.5],
    build(sc, t) { livingRoom(sc, t, { tvPaint: pDogTV(t, t > 22.3 && t < 23.6) });
      drawActor(sc, t, gosha({ pos: [0.2, 0, -0.5], expr: [[20.7, "smug"], [21.6, "proud"], [22.3, "realize"], [23.3, "blank"]], look: [[20.7, 0.3], [22.3, 0.8]],
        handF: [[20.8, ...REST_FM], [21.0, -0.14, HZ - 0.16], [23.2, -0.14, HZ - 0.16], [23.5, ...REST_FM]], bendF: [[20.8, -0.3]], props: whistle }));
      ringsAt(sc, [0.08, 0.95, -0.45], t, 21.6, 23.2, { dir: 0, span: Math.PI * 0.6, n: 3, col: "rgba(190,150,255,0.9)" });
      tag(sc, [0.3, 1.6, -0.5], "…?", t, 23.4, { size: 70 }); } },
  // 5. Ночь: летучая мышь у фонаря — крик, эхо, мошки
  { t0: 24.7, t1: 34.5, cam: [[24.7, [1.0, 1.7, 2.2], [2.0, 3.0, -2.0], 66], [34.5, [1.2, 1.8, 1.8], [2.1, 3.2, -2.0], 62]], focus: [2.0, 3.4, -2.0], warm: 0.05,
    dark: () => 0.15,
    build(sc, t) { street(sc, t, { night: 1, noCars: true });
      drawActor(sc, t, gosha({ pos: [1.3, 0, -1.4], expr: [[24.7, "realize"], [26.9, "grin"], [29.4, "realize"], [31.0, "shock"], [33.4, "proud"]], look: [[24.7, 0.6]] }));
      const caught = t > 31.0;
      const bp = t < 30.6 ? [2.2 + Math.cos(t * 1.4) * 0.9, 3.5 + Math.sin(t * 2.1) * 0.3, -1.8 + Math.sin(t * 1.4) * 0.4] : lerpPath(t, 30.6, 31.0, [2.2 + Math.cos(30.6 * 1.4) * 0.9, 3.5, -1.8], [2.55, 3.75, -1.9]);
      const bpp = t > 31.0 ? [2.2 + Math.cos(t * 1.4) * 0.9, 3.5 + Math.sin(t * 2.1) * 0.3, -1.8 + Math.sin(t * 1.4) * 0.4] : bp;
      sc.sprite(bpp, -0.1, (g, x, y, k) => drawBat(g, x, y, k * 3.2, t));
      for (const i of MIDGES) { if (caught && i === 0) continue; const mp = i === 0 ? [2.55, 3.75, -1.9] : [2.2 + Math.sin(t * 3 + i) * 0.5, 3.7 + Math.cos(t * 2.5 + i * 2) * 0.35, -2.0 + Math.sin(i) * 0.3];
        sc.sprite(mp, -0.05, (g, x, y, k) => { g.fillStyle = "#ffe9a8"; g.beginPath(); g.arc(x, y, Math.max(3, k * 0.012), 0, 7); g.fill(); }); }
      ringsAt(sc, bpp, t, 25.0, 34.5, { dir: -0.6, span: Math.PI * 0.8, n: 3, r1: 0.8, col: "rgba(150,230,255,0.9)" });
      if (t > 26.9 && t < 30.2) ringsAt(sc, [1.6, 3.4, -3.55], t, 26.9, 30.2, { dir: -Math.PI / 2 + 0.6, span: Math.PI * 0.6, n: 3, r1: 0.9, col: "rgba(255,230,120,0.85)" });
      tag(sc, [1.6, 3.2, -3.55], "СТЕНА", t, 29.4, { size: 54, until: 31.6 });
      tag(sc, [2.55, 4.1, -1.9], "МОШКА", t, 30.2, { size: 50, bg: "#f5c518", until: 31.6 });
      tag(sc, [2.0, 4.5, -2.0], "СОТНИ ЗА ЧАС", t, 33.3, { size: 60, bg: "#f5c518" }); } },
  // 6. Гоша с закрытыми глазами щёлкает и «видит» стены
  { t0: 34.5, t1: 41.0, cam: [[34.5, [0.2, 1.25, 2.1], [0.1, 1.0, -1.0], 70], [41.0, [0.4, 1.22, 1.9], [0.4, 1.0, -1.0], 70]], focus: [0.0, 1.0, -0.4],
    dark: () => 0.42,
    build(sc, t) { livingRoom(sc, t, { door: true });
      sc.box([-1.3, 0.46, 0.2], [0.46, 0.06, 0.46], "#e46b2b", { zb: 0.3 }); sc.box([-1.51, 0.8, 0.2], [0.05, 0.62, 0.46], "#e46b2b", { zb: 0.3 }); sc.box([-1.3, 0.22, 0.2], [0.05, 0.44, 0.05], "#2a2d33", { shadow: false, zb: 0.3 });
      drawActor(sc, t, gosha({ walk: [[34.5, -0.6, -0.4], [36.9, -0.6, -0.4], [40.6, 0.7, -0.3]], expr: [[34.5, "neutral"], [35.8, "smug"], [38.4, "proud"], [40.0, "grin"]],
        blinkHold: [[35.2, true]], mouth: [[35.8, ["o", 0.5]], [36.3, undefined]] }));
      for (const tc of [35.8, 36.6, 37.4, 38.2, 39.0, 39.8]) if (t > tc && t < tc + 0.9) { const gx = -0.6 + 1.3 * ramp(t, 36.9, 40.6); ringsAt(sc, [gx, 0.95, -0.35], t, tc, tc + 0.9, { span: Math.PI * 2, n: 2, r1: 1.2, col: "rgba(150,230,255,0.75)", speed: 1.1 }); }
      tag(sc, [0.3, 2.2, -1.95], "СТЕНА", t, 38.4, { size: 56 });
      tag(sc, [-1.3, 1.3, 0.2], "СТУЛ", t, 39.3, { size: 56 });
      tag(sc, [-2.98, 2.3, -0.6], "ДВЕРЬ", t, 40.0, { size: 56 }); } },
  // 7. Лего на полу — не услышал
  { t0: 41.0, t1: TOTAL_T, cam: [[41.0, [0.95, 0.95, 1.7], [0.75, 0.72, -0.4], 64], [TOTAL_T, [0.95, 0.95, 1.5], [0.75, 0.72, -0.4], 62]], focus: [0.75, 0.6, -0.35],
    dark: () => 0.3,
    build(sc, t) { livingRoom(sc, t, { door: true });
      sc.sprite([0.95, 0.02, -0.2], -0.02, (g, x, y, k) => drawLego(g, x, y, k * 2.2));
      drawActor(sc, t, gosha({ walk: [[41.0, 0.55, -0.32], [41.6, 0.8, -0.3]], expr: [[41.0, "smug"], [41.7, "shock"], [42.4, "nervous"]], blinkHold: [[41.0, true], [41.65, false]], bigEyes: [[41.7, true]],
        hop: [41.7, 0.5], handF: [[41.7, ...REST_FM], [41.9, -0.4, HZ + 0.15], [43.4, -0.4, HZ + 0.15]], handB: [[41.7, ...REST_BM], [41.9, 0.4, HZ + 0.15], [43.4, 0.4, HZ + 0.15]], bendF: [[41.7, -0.3]], bendB: [[41.7, 0.3]] }));
      tag(sc, [0.8, 1.65, -0.3], "АЙ!", t, 41.75, { size: 90, bg: "#ff6b6b", fg: "#fff" }); } },
] };
