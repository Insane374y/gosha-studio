// «Что если Гоша выйдет на первую работу» (65 с)
const W_ = (extra) => gosha(Object.assign({ lookStyle: GOSHA_WORK }, extra));
const MARINA = (extra) => person("marina", "marina", extra);
const BOSS = (extra) => person("boss", "boss", Object.assign({ scale: 1.08 }, extra));
const queue = (sc, t, xs, o = {}) => ["c1", "c2", "c3", "c4"].slice(0, xs.length).forEach((c, i) => drawActor(sc, t, person("q" + i, c, { pos: [xs[i][0], 0, xs[i][1]], expr: o.expr?.[i] ?? [[0, "stern"], [5 + i, "nervous"]], look: [[0, -0.7]] })));
const noteProps = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(0.0, 0.6); drawNotebook(g, x, y, k * 0.3, 1, -0.1); const w = Math.sin(t * 25) * 0.03 * k; g.save(); g.translate(x + w, y - 0.02 * k); g.rotate(0.6); g.fillStyle = "#2f6fd6"; g.strokeStyle = INKC; g.lineWidth = 3; g.fillRect(-0.01 * k, -0.12 * k, 0.02 * k, 0.12 * k); g.strokeRect(-0.01 * k, -0.12 * k, 0.02 * k, 0.12 * k); g.restore(); };
const cupProps = (foam) => (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(0.36, 0.86); drawCup(g, x, y, k * 1.4, foam); };
const BEHIND = -1.4;

window.VIDEO = { total: TOTAL_T, titleEnd: 2.6, title: ["ГОША ВЫЙДЕТ", "НА ПЕРВУЮ РАБОТУ"], shots: [
  // 0. Крупно: Гоша в фартуке за стойкой
  { t0: 0, t1: 2.6, cam: [[0, [-0.6, 1.05, 0.3], [-0.6, 0.95, BEHIND], 56], [2.6, [-0.6, 1.05, 0.1], [-0.6, 0.95, BEHIND], 52]], focus: [-0.6, 1.1, BEHIND],
    build(sc, t) { cafe(sc, t); drawActor(sc, t, W_({ pos: [-0.6, 0, BEHIND], expr: [[0, "proud"], [1.6, "grin"]] })); } },
  // 1. Очередь до двери, Гоша ищет кнопку «капучино»
  { t0: 2.6, t1: 8.8, cam: [[2.6, [1.4, 1.4, 2.7], [-0.7, 0.9, -0.6], 66], [8.8, [1.25, 1.38, 2.4], [-0.7, 0.9, -0.6], 64]], focus: [-0.6, 1.1, -0.5],
    build(sc, t) { cafe(sc, t, { door: true });
      drawActor(sc, t, W_({ pos: [-1.1, 0, BEHIND], expr: [[2.6, "smug"], [4.2, "nervous"], [6.2, "shock"]], bigEyes: [[6.2, true]], look: [[2.6, 0.6], [4.2, -0.5], [5.0, 0.5], [5.8, -0.5]] }));
      queue(sc, t, [[-0.9, -0.3], [-1.3, 0.35], [-1.75, 1.0], [-2.25, 1.65]]);
      tag(sc, [-1.1, 1.45, BEHIND], "КАПУЧИНО?..", t, 6.6, { size: 52 }); } },
  // 2. Все бегают — а ты ничего не понимаешь. Это нормально
  { t0: 8.8, t1: 16.2, cam: [[8.8, [-0.3, 1.2, 1.5], [-0.3, 0.95, BEHIND], 62], [16.2, [-0.3, 1.18, 1.25], [-0.3, 0.95, BEHIND], 58]], focus: [-0.3, 1.1, BEHIND],
    build(sc, t) { cafe(sc, t);
      drawActor(sc, t, MARINA({ walk: [[8.8, 1.3, -1.6], [10.0, -1.5, -1.6], [11.2, 1.3, -1.6], [12.4, -1.5, -1.6], [13.6, 1.3, -1.6]], expr: [[8.8, "stern"]], look: [[8.8, -0.8]] }));
      drawActor(sc, t, W_({ pos: [-0.3, 0, BEHIND], expr: [[8.8, "blank"], [10.5, "nervous"], [13.5, "realize"], [14.8, "grin"]], look: [[8.8, 0.8], [9.4, -0.8], [10.0, 0.8], [10.6, -0.8], [13.5, 0]] }));
      tag(sc, [-0.3, 1.75, BEHIND], "ЭТО НОРМАЛЬНО", t, 14.6, { size: 56, bg: "#7bd389" }); } },
  // 3. Приходи на 10 минут раньше
  { t0: 16.2, t1: 21.7, cam: [[16.2, [-0.6, 1.3, 2.2], [-1.8, 1.3, -0.8], 66], [21.7, [-0.7, 1.3, 2.0], [-1.8, 1.4, -0.8], 64]], focus: [-1.9, 1.0, 0.4],
    build(sc, t) { cafe(sc, t, { door: true });
      drawActor(sc, t, gosha({ walk: [[16.2, -3.4, 0.6], [17.6, -1.9, 0.4]], expr: [[16.2, "smug"], [17.8, "proud"]], look: [[17.6, 0.6]] }));
      tag(sc, [-1.9, 1.7, 0.4], "8:50", t, 18.0, { size: 70, bg: "#f5c518", until: 19.6 });
      tag(sc, [-1.9, 1.7, 0.4], "−10 МИНУТ ✓", t, 19.6, { size: 56, bg: "#7bd389" }); } },
  // 4. Блокнот: пароль от кассы, кто за что, где стаканы
  { t0: 21.7, t1: 28.7, cam: [[21.7, [-0.35, 1.1, 0.45], [-0.35, 0.95, BEHIND], 56], [28.7, [-0.35, 1.08, 0.25], [-0.35, 0.95, BEHIND], 52]], focus: [-0.35, 1.05, BEHIND],
    build(sc, t) { cafe(sc, t); drawActor(sc, t, W_({ pos: [-0.35, 0, BEHIND], expr: [[21.7, "realize"], [22.6, "stern"], [26.8, "smug"]], look: [[21.7, 0]], ...HANDS_HOLD, props: noteProps })); },
    over(g, t) { const L = [[23.4, "ПАРОЛЬ КАССЫ"], [24.3, "КТО ЗА ЧТО"], [25.2, "СТАКАНЫ — ПОЛКА 2"]]; L.forEach(([t0, s], i) => { if (t > t0) bubbleLabel(g, 540, 300 + i * 120, "✎ " + s, t, t0, { size: 50, rot: i % 2 ? 0.02 : -0.02 }); }); } },
  // 5. Спрашивай: один вопрос лучше десяти переделок
  { t0: 28.7, t1: 36.3, cam: [[28.7, [0.15, 1.2, 1.4], [0.15, 0.95, BEHIND], 60], [36.3, [0.15, 1.18, 1.15], [0.15, 0.95, BEHIND], 56]], focus: [0.15, 1.1, BEHIND],
    build(sc, t) { cafe(sc, t);
      drawActor(sc, t, W_({ pos: [-0.35, 0, BEHIND], expr: [[28.7, "nervous"], [29.6, "realize"], [32.3, "neutral"], [34.0, "grin"]], look: [[28.7, 0.8]], mouth: talkMouth(29.7, 30.9),
        handF: [[29.5, ...REST_FM], [29.7, -0.3, HZ + 0.35], [31.0, -0.3, HZ + 0.35], [31.3, ...REST_FM]] }));
      drawActor(sc, t, MARINA({ pos: [0.6, 0, -1.45], expr: [[28.7, "neutral"], [31.2, "grin"], [34.0, "proud"]], look: [[28.7, -0.8]], mouth: talkMouth(31.3, 33.6),
        handB: pointKeysM(31.6, 0.6, 0.6, 1.2, "b") }));
      tag(sc, [-0.35, 1.75, BEHIND], "А ГДЕ…?", t, 29.8, { size: 56, until: 32.0 });
      tag(sc, [0.6, 1.85, -1.45], "НОВИЧКУ МОЖНО!", t, 34.3, { size: 48, bg: "#7bd389" }); } },
  // 6. Имена: «Приятно познакомиться, Марина!»
  { t0: 36.3, t1: 43.2, cam: [[36.3, [0.1, 1.15, 1.1], [0.1, 0.95, BEHIND], 58], [43.2, [0.1, 1.12, 0.9], [0.1, 0.95, BEHIND], 54]], focus: [0.1, 1.1, BEHIND],
    build(sc, t) { cafe(sc, t);
      drawActor(sc, t, W_({ pos: [-0.3, 0, BEHIND], expr: [[36.3, "neutral"], [38.0, "grin"], [40.4, "proud"]], look: [[36.3, 0.8]], mouth: talkMouth(38.2, 40.2),
        handB: [[37.6, ...REST_BM], [37.9, 0.36, 0.72], [38.2, 0.36, 0.67], [38.6, 0.36, 0.72], [39.0, 0.36, 0.67], [39.4, 0.36, 0.72], [39.7, ...REST_BM]] }));
      drawActor(sc, t, MARINA({ pos: [0.5, 0, -1.45], expr: [[36.3, "grin"], [39.0, "proud"]], look: [[36.3, -0.8]],
        handF: [[37.6, ...REST_FM], [37.9, -0.36, 0.72], [38.2, -0.36, 0.67], [38.6, -0.36, 0.72], [39.0, -0.36, 0.67], [39.4, -0.36, 0.72], [39.7, ...REST_FM]] }));
      tag(sc, [0.5, 1.8, -1.45], "МАРИНА", t, 38.6, { size: 64, bg: "#f5c518" });
      tag(sc, [-0.3, 1.75, BEHIND], "ЗАПОМНИЛ ✓", t, 41.0, { size: 50 }); } },
  // 7. Ошибся — не прячь
  { t0: 43.2, t1: 50.9, cam: [[43.2, [0.2, 1.35, 2.3], [-0.6, 0.95, -0.9], 62], [50.9, [0.15, 1.33, 2.05], [-0.6, 0.95, -0.9], 58]], focus: [-0.6, 1.1, -0.6],
    build(sc, t) { cafe(sc, t);
      drawActor(sc, t, W_({ pos: [-0.75, 0, BEHIND], expr: [[43.2, "proud"], [44.4, "shock"], [45.6, "nervous"], [46.3, "neutral"], [48.0, "grin"]], bigEyes: [[44.4, true], [45.6, false]], look: [[43.2, -0.5]], mouth: talkMouth(46.4, 47.8) }));
      drawActor(sc, t, person("q0", "c1", { pos: [-0.75, 0, -0.2], expr: [[43.2, "neutral"], [44.4, "stern"], [48.0, "grin"]], look: [[43.2, 0.7]] }));
      if (t > 43.6) sc.sprite([-0.6, 0.78, -0.75], -0.1, (g, x, y, k) => drawCup(g, x, y, k * 1.4, false));
      tag(sc, [-0.6, 1.05, -0.75], "НЕ ТОТ ЗАКАЗ", t, 44.4, { size: 50, bg: "#ff6b6b", fg: "#fff", until: 46.2 });
      tag(sc, [-0.75, 1.75, BEHIND], "«Я ПЕРЕПУТАЛ, ИСПРАВЛЮ»", t, 46.4, { size: 40 });
      tag(sc, [-0.75, 1.65, -0.2], "ОК!", t, 48.2, { size: 60, bg: "#7bd389" }); } },
  // 8. Конец смены: «Что мне завтра сделать лучше?»
  { t0: 50.9, t1: 57.6, cam: [[50.9, [0.3, 1.2, 1.9], [0.3, 0.95, -1.0], 62], [57.6, [0.3, 1.18, 1.65], [0.3, 0.95, -1.0], 58]], focus: [0.3, 1.1, -0.4],
    build(sc, t) { cafe(sc, t, { door: true });
      drawActor(sc, t, BOSS({ pos: [0.8, 0, -0.35], expr: [[50.9, "stern"], [53.2, "realize"], [54.6, "proud"]], look: [[50.9, -0.7]] }));
      drawActor(sc, t, W_({ pos: [-0.15, 0, -0.3], expr: [[50.9, "neutral"], [51.7, "grin"], [54.6, "proud"]], look: [[50.9, 0.8]], mouth: talkMouth(51.8, 53.1) }));
      tag(sc, [-0.15, 1.75, -0.3], "ЧТО УЛУЧШИТЬ?", t, 51.9, { size: 52, until: 54.5 });
      tag(sc, [0.8, 2.0, -0.35], "ЗАПОМНИЛ ЕГО", t, 55.0, { size: 48, bg: "#f5c518" }); } },
  // 9. Вечер: идеальный капучино
  { t0: 57.6, t1: 62.9, cam: [[57.6, [0.6, 1.1, 0.4], [0.7, 0.95, BEHIND], 56], [62.9, [0.65, 1.08, 0.2], [0.75, 0.95, BEHIND], 50]], focus: [0.65, 1.1, BEHIND],
    build(sc, t) { cafe(sc, t);
      drawActor(sc, t, W_({ pos: [0.7, 0, BEHIND], expr: [[57.6, "realize"], [59.0, "grin"], [61.0, "proud"]], look: [[57.6, 0.7]],
        handB: [[60.5, ...REST_BM], [60.8, 0.36, 0.86], [99, 0.36, 0.86]], bendB: [[60.5, 0.3]], props: (g, fx, ty, k, tt, layer) => { if (tt > 60.8) cupProps(true)(g, fx, ty, k, tt, layer); } }));
      tag(sc, [0.7, 1.7, BEHIND], "ИДЕАЛЬНАЯ ПЕНКА", t, 61.3, { size: 50, bg: "#f5c518" }); } },
  // 10. …а заказывали чай
  { t0: 62.9, t1: TOTAL_T, cam: [[62.9, [0.1, 1.25, 2.0], [0.05, 0.95, -0.8], 60], [TOTAL_T, [0.1, 1.23, 1.8], [0.05, 0.95, -0.8], 58]], focus: [0.0, 1.1, -0.6],
    build(sc, t) { cafe(sc, t);
      drawActor(sc, t, W_({ pos: [0.45, 0, BEHIND], expr: [[62.9, "proud"], [63.8, "blank"]], look: [[62.9, -0.6]], handB: [[0, 0.36, 0.86], [99, 0.36, 0.86]], bendB: [[0, 0.3]], props: cupProps(true) }));
      drawActor(sc, t, person("q2", "c2", { pos: [-0.35, 0, -0.2], expr: [[62.9, "neutral"], [63.4, "stern"]], look: [[62.9, 0.7]] }));
      tag(sc, [-0.35, 1.7, -0.2], "Я ПРОСИЛА ЧАЙ", t, 63.3, { size: 50, bg: "#ffffff" }); } },
] };
