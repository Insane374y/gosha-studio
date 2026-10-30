// «Что если Гоша заселится в общагу» (61.5 с)
const ROOM = (extra) => person("roommate", "room", extra);
const panProps = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(-0.42, 0.85); drawPan(g, x, y, k * 1.3, t); };
const suitcaseP = (sc, p) => sc.sprite(p, -0.02, (g, x, y, k) => drawSuitcase(g, x, y, k * 1.1));
const fishCam = [[0, [0, 1.3, 2.3], [0, 1.0, -0.8], 70]];

window.VIDEO = { total: TOTAL_T, titleEnd: 2.3, title: ["ГОША ЗАСЕЛИТСЯ", "В ОБЩАГУ"], shots: [
  // 0. Крупно: Гоша с чемоданом в дверях
  { t0: 0, t1: 2.3, cam: [[0, [0.1, 1.0, 1.4], [0.0, 1.0, -0.2], 58], [2.3, [0.1, 1.0, 1.15], [0.0, 1.0, -0.2], 54]], focus: [0, 1.0, -0.2],
    build(sc, t) { dormRoom(sc, t); suitcaseP(sc, [0.45, 0, -0.1]); drawActor(sc, t, gosha({ pos: [0, 0, -0.2], expr: [[0, "grin"], [1.3, "realize"]], look: [[0, 0.5]] })); } },
  // 1. Комната 3×4: две кровати, стол — и сосед с рыбой
  { t0: 2.3, t1: 9.4, cam: [[2.3, [0, 1.45, 2.8], [0, 1.0, -0.8], 70], [9.4, [0.05, 1.42, 2.5], [0, 1.0, -0.8], 68]], focus: [0.2, 1.0, 0.3],
    build(sc, t) { dormRoom(sc, t); suitcaseP(sc, [-0.55, 0, 0.75]);
      drawActor(sc, t, ROOM({ pos: [0.75, 0, 0.3], expr: [[2.3, "grin"], [7.6, "proud"]], look: [[2.3, -0.7]], handF: [[0, -0.42, 0.85], [99, -0.42, 0.85]], bendF: [[0, -0.3]], props: panProps }));
      drawActor(sc, t, gosha({ pos: [-0.25, 0, 0.55], expr: [[2.3, "neutral"], [3.4, "realize"], [5.0, "nervous"], [7.4, "shock"]], bigEyes: [[7.4, true]], look: [[2.3, -0.5], [4.2, 0.5], [7.0, 0.8]] }));
      tag(sc, [0, 2.5, -1.9], "3 × 4 М", t, 2.6, { size: 60, until: 4.2 });
      tag(sc, [0.75, 1.75, 0.3], "ЖАРЮ РЫБУ!", t, 7.5, { size: 50, bg: "#f5c518" }); } },
  // 2. Несколько лет с незнакомцем
  { t0: 9.4, t1: 14.0, cam: [[9.4, [0.25, 1.05, 2.45], [0.25, 1.0, 0.3], 56], [14.0, [0.25, 1.03, 2.25], [0.25, 1.0, 0.3], 52]], focus: [0.25, 1.0, 0.3],
    build(sc, t) { dormRoom(sc, t);
      drawActor(sc, t, gosha({ pos: [-0.15, 0, 0.35], expr: [[9.4, "neutral"], [10.5, "nervous"], [12.5, "blank"]], look: [[9.4, 0.8]] }));
      drawActor(sc, t, ROOM({ pos: [0.65, 0, 0.3], expr: [[9.4, "grin"], [12.5, "blank"]], look: [[9.4, -0.8]], handF: [[0, -0.42, 0.85], [99, -0.42, 0.85]], bendF: [[0, -0.3]], props: panProps }));
      tag(sc, [0.25, 1.75, 0.3], "НЕСКОЛЬКО ЛЕТ…", t, 10.6, { size: 52 }); } },
  // 3. Ссоры из-за мелочей: шум, уборка, еда
  { t0: 14.0, t1: 20.3, cam: [[14.0, [0, 1.4, 2.6], [0, 1.05, -0.8], 70], [20.3, [0, 1.38, 2.3], [0, 1.05, -0.8], 68]], focus: [0, 1.0, 0.2],
    build(sc, t) { dormRoom(sc, t);
      drawActor(sc, t, gosha({ pos: [-0.5, 0, 0.2], expr: [[14.0, "stern"], [16.5, "nervous"], [18.0, "stern"]], look: [[14.0, 0.8]] }));
      drawActor(sc, t, ROOM({ pos: [0.5, 0, 0.2], expr: [[14.0, "stern"], [17.4, "smug"]], look: [[14.0, -0.8]] })); },
    over(g, t) { [[17.0, "ШУМ", "#ff6b6b", 220, 420], [17.9, "УБОРКА", "#8fd0ff", 540, 300], [18.7, "ЧУЖАЯ ЕДА", "#f5c518", 860, 420]].forEach(([t0, s, c, x, y]) => { if (t > t0) bubbleLabel(g, x, y, s, t, t0, { size: 56, bg: c, rot: (x - 540) / 3000 }); }); } },
  // 4. Договоритесь в первый день — правила на дверь
  { t0: 20.3, t1: 27.9, cam: [[20.3, [-0.3, 1.35, 2.3], [1.4, 1.3, 0.9], 62], [27.9, [-0.2, 1.33, 2.1], [1.5, 1.35, 0.9], 58]], focus: [1.4, 1.4, 0.9],
    build(sc, t) { const n = t < 22.0 ? 0 : t < 23.2 ? 1 : t < 24.4 ? 2 : 3; dormRoom(sc, t, { rules: n || undefined });
      drawActor(sc, t, gosha({ pos: [0.4, 0, 1.1], expr: [[20.3, "realize"], [22.0, "proud"], [26.0, "grin"]], look: [[20.3, 0.8]], mouth: talkMouth(22.0, 25.6, 0.25) }));
      drawActor(sc, t, ROOM({ pos: [-0.35, 0, 0.6], expr: [[20.3, "neutral"], [23.0, "grin"]], look: [[20.3, 0.6]], tilt: nod(22.5, 25.5) }));
      tag(sc, [1.585, 2.05, 0.9], "НА ДВЕРЬ ✓", t, 25.8, { size: 46, bg: "#7bd389" }); } },
  // 5. Как правила в игре — договорились заранее
  { t0: 27.9, t1: 32.6, cam: [[27.9, [0, 1.15, 2.65], [0, 1.0, 0.3], 60], [32.6, [0, 1.13, 2.45], [0, 1.0, 0.3], 56]], focus: [0, 1.0, 0.3],
    build(sc, t) { dormRoom(sc, t, { rules: 4 });
      drawActor(sc, t, gosha({ pos: [-0.35, 0, 0.3], expr: [[27.9, "smug"], [29.5, "proud"]], look: [[27.9, 0.8]],
        handB: [[28.4, ...REST_BM], [28.7, 0.38, 0.72], [29.0, 0.38, 0.67], [29.4, 0.38, 0.72], [29.8, 0.38, 0.67], [30.2, 0.38, 0.72], [30.5, ...REST_BM]] }));
      drawActor(sc, t, ROOM({ pos: [0.4, 0, 0.3], expr: [[27.9, "grin"], [29.5, "proud"]], look: [[27.9, -0.8]],
        handF: [[28.4, ...REST_FM], [28.7, -0.38, 0.72], [29.0, -0.38, 0.67], [29.4, -0.38, 0.72], [29.8, -0.38, 0.67], [30.2, -0.38, 0.72], [30.5, ...REST_FM]] }));
      tag(sc, [0, 1.75, 0.3], "ПРАВИЛА ИГРЫ", t, 29.0, { size: 56, bg: "#f5c518" }); } },
  // 6. Подпиши еду. Беруши и маска
  { t0: 32.6, t1: 38.4, cam: [[32.6, [0.2, 1.15, 2.65], [0.0, 0.9, -0.5], 62], [38.4, [0.2, 1.13, 2.4], [0.0, 0.9, -0.5], 58]], focus: [-0.2, 0.9, 0.2],
    build(sc, t) { dormRoom(sc, t, { rules: 4 });
      sc.box([0.95, 0.4, -1.65], [0.5, 0.8, 0.5], "#eef1f4", { zb: 0.2 });
      if (t < 35.5) { sc.sprite([0.95, 0.88, -1.6], -0.05, (g, x, y, k) => { g.fillStyle = "#fff"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(x - 0.06 * k, y - 0.06 * k, 0.12 * k, 0.12 * k, 6); g.fill(); g.stroke(); g.fillStyle = "#d6453d"; g.font = `900 ${0.04 * k}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("ГОША", x, y + 0.01 * k); }); }
      const sleep = t > 35.5;
      drawActor(sc, t, gosha({ pos: [-0.2, 0, 0.2], expr: [[32.6, "smug"], [33.6, "proud"], [35.5, "neutral"], [36.6, "proud"]], look: [[32.6, 0.8]], blinkHold: [[35.5, true]] }));
      if (sleep) sc.overlay([-0.2, 1.0, 0.2], (g, x, y) => { const k = sc.cam.F / sc.cam.toCam([-0.2, 1.0, 0.2])[2]; g.fillStyle = "#2f3a6e"; g.strokeStyle = "#000"; g.lineWidth = 5; g.beginPath(); g.roundRect(x - 0.24 * k, y - 0.06 * k, 0.48 * k, 0.11 * k, 0.05 * k); g.fill(); g.stroke(); g.fillStyle = "#f5c518"; for (const s of [-1, 1]) { g.beginPath(); g.arc(x + s * 0.27 * k, y + 0.04 * k, 0.03 * k, 0, 7); g.fill(); g.stroke(); } });
      tag(sc, [0.95, 1.15, -1.6], "ПОДПИСАНО ✓", t, 33.4, { size: 46, until: 35.5 });
      tag(sc, [-0.2, 1.75, 0.2], "БЕРУШИ + МАСКА", t, 35.8, { size: 50, bg: "#f5c518" }); } },
  // 7. Берёшь чужое — спроси. Даже соль
  { t0: 38.4, t1: 42.4, cam: [[38.4, [0, 1.15, 2.65], [0, 1.0, 0.3], 60], [42.4, [0, 1.13, 2.45], [0, 1.0, 0.3], 56]], focus: [0, 1.0, 0.3],
    build(sc, t) { dormRoom(sc, t, { rules: 4 });
      drawActor(sc, t, gosha({ pos: [-0.35, 0, 0.3], expr: [[38.4, "neutral"], [38.9, "grin"]], look: [[38.4, 0.8]], mouth: talkMouth(38.9, 41.5, 0.25) }));
      drawActor(sc, t, ROOM({ pos: [0.4, 0, 0.3], expr: [[38.4, "neutral"], [40.0, "grin"]], look: [[38.4, -0.8]] }));
      tag(sc, [-0.35, 1.75, 0.3], "МОЖНО ЗАРЯДКУ?", t, 39.0, { size: 46, until: 40.6 });
      tag(sc, [-0.35, 1.75, 0.3], "А СОЛЬ?", t, 40.7, { size: 56 });
      tag(sc, [0.4, 1.8, 0.3], "КОНЕЧНО!", t, 41.2, { size: 52, bg: "#7bd389" }); } },
  // 8. Не копи обиды — скажи сразу. Иначе рванёт из-за ложки
  { t0: 42.4, t1: 50.1, cam: [[42.4, [0, 1.2, 2.85], [0, 1.0, 0.3], 62], [48.4, [0, 1.18, 2.6], [0, 1.0, 0.3], 58], [48.6, [0.03, 1.15, 2.57], [0, 0.98, 0.3], 58], [50.1, [0, 1.18, 1.7], [0, 1.0, 0.3], 58]], focus: [0, 1.0, 0.3],
    shake: (t) => (t > 48.3 && t < 49.0 ? 0.04 : 0),
    build(sc, t) { dormRoom(sc, t, { rules: 4 });
      drawActor(sc, t, gosha({ pos: [-0.35, 0, 0.3], expr: [[42.4, "stern"], [43.6, "neutral"], [46.0, "smug"], [48.3, "shock"]], bigEyes: [[48.3, true]], look: [[42.4, 0.8]], mouth: talkMouth(43.8, 45.6, 0.22) }));
      drawActor(sc, t, ROOM({ pos: [0.4, 0, 0.3], expr: [[42.4, "neutral"], [45.6, "grin"], [48.3, "shock"]], look: [[42.4, -0.8]], tilt: nod(44.0, 45.6) }));
      tag(sc, [-0.35, 1.75, 0.3], "ДАВАЙ ТАК НЕ БУДЕМ", t, 43.8, { size: 44, until: 46.4 });
      tag(sc, [0.0, 1.9, 0.3], "ЧЕРЕЗ МЕСЯЦ…", t, 46.5, { size: 50, until: 48.2 });
      tag(sc, [0.0, 1.9, 0.3], "БУМ! ИЗ-ЗА ЛОЖКИ", t, 48.3, { size: 56, bg: "#ff6b6b", fg: "#fff" }); } },
  // 9. Познакомься с этажом: столовая и утюг
  { t0: 50.1, t1: 55.7, cam: [[50.1, [0.2, 1.3, 2.3], [0.0, 1.05, -1.0], 66], [55.7, [0.2, 1.28, 2.05], [0.0, 1.05, -1.0], 62]], focus: [0, 1.0, -0.5],
    build(sc, t) { hallway(sc, t);
      drawActor(sc, t, person("n1", "c3", { pos: [-0.9, 0, -0.6], expr: [[50.1, "grin"], [52.6, "proud"]], look: [[50.1, 0.7]], mouth: talkMouth(52.0, 53.2) }));
      drawActor(sc, t, person("n2", "girl2", { pos: [0.95, 0, -0.7], expr: [[50.1, "grin"], [53.4, "proud"]], look: [[50.1, -0.7]], mouth: talkMouth(53.4, 54.6) }));
      drawActor(sc, t, gosha({ pos: [0.05, 0, -0.35], expr: [[50.1, "grin"], [52.0, "realize"], [53.4, "proud"]], look: [[50.1, -0.7], [53.3, 0.7]] }));
      tag(sc, [-0.9, 1.75, -0.6], "СТОЛОВАЯ →", t, 52.1, { size: 46 });
      tag(sc, [0.95, 1.75, -0.7], "У МЕНЯ УТЮГ", t, 53.5, { size: 46, bg: "#f5c518" }); } },
  // 10. Через неделю — лучшие друзья
  { t0: 55.7, t1: 58.7, cam: [[55.7, [0, 1.05, 2.35], [0, 1.0, 0.3], 56], [58.7, [0, 1.03, 2.15], [0, 1.0, 0.3], 52]], focus: [0, 1.0, 0.3],
    build(sc, t) { dormRoom(sc, t, { rules: 4 });
      drawActor(sc, t, gosha({ pos: [-0.3, 0, 0.3], expr: [[55.7, "laugh"], [57.4, "grin"]], look: [[55.7, 0.8]], handB: [[55.8, 0.32, HZ + 0.2], [99, 0.32, HZ + 0.2]], bendB: [[0, 0.3]] }));
      drawActor(sc, t, ROOM({ pos: [0.35, 0, 0.3], expr: [[55.7, "laugh"], [57.4, "grin"]], look: [[55.7, -0.8]], handF: [[55.8, -0.32, HZ + 0.2], [99, -0.32, HZ + 0.2]], bendF: [[0, -0.3]] }));
      tag(sc, [0, 1.8, 0.3], "ЧЕРЕЗ НЕДЕЛЮ", t, 55.8, { size: 52, bg: "#7bd389" }); } },
  // 11. Рыбу теперь жарят вдвоём
  { t0: 58.7, t1: TOTAL_T, cam: [[58.7, [0, 1.15, 2.55], [0, 1.0, 0.3], 58], [TOTAL_T, [0, 1.13, 2.35], [0, 1.0, 0.3], 54]], focus: [0, 1.0, 0.3],
    build(sc, t) { dormRoom(sc, t, { rules: 4 });
      drawActor(sc, t, gosha({ pos: [-0.35, 0, 0.3], expr: [[58.7, "proud"], [59.8, "laugh"]], look: [[58.7, 0.8]], handB: [[0, 0.42, 0.85], [99, 0.42, 0.85]], bendB: [[0, 0.3]],
        props: (g, fx, ty, k, tt, layer) => { if (layer === "front") { const [x, y] = loc(fx, ty, k)(0.42, 0.85); drawPan(g, x, y, k * 1.3, tt); } } }));
      drawActor(sc, t, ROOM({ pos: [0.4, 0, 0.3], expr: [[58.7, "grin"], [59.8, "laugh"]], look: [[58.7, -0.8]], handF: [[0, -0.42, 0.85], [99, -0.42, 0.85]], bendF: [[0, -0.3]], props: panProps }));
      tag(sc, [0, 1.85, 0.3], "ВДВОЁМ", t, 59.6, { size: 60, bg: "#f5c518" }); } },
] };
