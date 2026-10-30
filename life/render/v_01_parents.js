// «Что если Гоша познакомится с родителями девушки» (64 с)
const cakeProps = (until = 999) => (g, fx, ty, k, t, layer) => { if (layer !== "front" || t > until) return; const [x, y] = loc(fx, ty, k)(0.01, 0.66); drawCakeBox(g, x, y, k * 1.2); };
const flowersProps = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(-0.36, 0.72); drawFlowers(g, x, y, k * 1.2); };
const platesProps = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(0.01, 0.66); drawPlate(g, x, y, k * 1.2); };
const DAD = (extra) => person("dad", "dad", Object.assign({ scale: 1.18 }, extra));
const MOM = (extra) => person("mom", "mom", extra);
const GIRL = (extra) => person("girl", "girl", Object.assign({ scale: 0.95 }, extra));
const thoughtIcons = (g, t, t0, x, y, icon, until) => { if (t < t0 || (until && t > until)) return; const s = popScale(t, t0, 0.35); g.save(); g.translate(x, y); g.scale(s, s); g.translate(-x, -y);
  drawThought(g, x, y, 260, 190, x + 60, y + 190, (gg, cx, cy, sz) => { if (icon === "fish") { gg.fillStyle = "#7cc8ff"; gg.strokeStyle = "#000"; gg.lineWidth = 5; gg.beginPath(); gg.ellipse(cx - 10, cy, sz * 0.32, sz * 0.18, 0, 0, 7); gg.fill(); gg.stroke(); gg.beginPath(); gg.moveTo(cx + sz * 0.2, cy); gg.lineTo(cx + sz * 0.4, cy - sz * 0.15); gg.lineTo(cx + sz * 0.4, cy + sz * 0.15); gg.closePath(); gg.fill(); gg.stroke(); gg.fillStyle = "#000"; gg.beginPath(); gg.arc(cx - sz * 0.25, cy - 6, 6, 0, 7); gg.fill(); }
    else { gg.fillStyle = "#d6453d"; gg.strokeStyle = "#000"; gg.lineWidth = 5; gg.beginPath(); gg.roundRect(cx - sz * 0.4, cy - sz * 0.05, sz * 0.8, sz * 0.22, 8); gg.fill(); gg.stroke(); gg.beginPath(); gg.roundRect(cx - sz * 0.22, cy - sz * 0.2, sz * 0.4, sz * 0.17, 8); gg.fill(); gg.stroke(); gg.fillStyle = "#222"; for (const dx of [-0.25, 0.25]) { gg.beginPath(); gg.arc(cx + dx * sz, cy + sz * 0.18, sz * 0.08, 0, 7); gg.fill(); } } }); g.restore(); };

window.VIDEO = { total: TOTAL_T, titleEnd: 3.0, title: ["ГОША ПОЗНАКОМИТСЯ", "С РОДИТЕЛЯМИ ДЕВУШКИ"], shots: [
  // 0. Подъезд, крупно: Гоша с тортом у двери
  { t0: 0, t1: 3.1, cam: [[0, [0.5, 1.0, 0.85], [0.45, 1.0, -0.9], 58], [3.1, [0.5, 1.0, 0.55], [0.45, 1.0, -0.9], 54]], focus: [0.45, 1.0, -0.9],
    build(sc, t) { hallway(sc, t);
      drawActor(sc, t, gosha({ pos: [0.45, 0, -0.9], expr: [[0, "nervous"], [1.6, "smug"], [2.5, "nervous"]], look: [[0, -0.7]], ...HANDS_HOLD, props: cakeProps() })); } },
  // 1. Дверь открывает папа — огромный, с усами
  { t0: 3.1, t1: 8.4, cam: [[3.1, [1.2, 1.3, 1.9], [0, 1.3, -1.5], 62], [8.4, [1.0, 1.35, 1.6], [0, 1.35, -1.5], 60]], focus: [0, 1.2, -1.3],
    build(sc, t) { const open = t > 3.4; hallway(sc, t, { open });
      if (open) drawActor(sc, t, DAD({ pos: [0, 0, -1.6], expr: [[3.1, "neutral"], [5.0, "stern"]], look: [[3.1, 0.5]] }));
      drawActor(sc, t, gosha({ pos: [0.75, 0, -0.95], expr: [[3.1, "grin"], [4.0, "shock"], [5.6, "nervous"], [7.0, "blank"]], bigEyes: [[4.0, true]], look: [[3.1, -0.8]], ...HANDS_HOLD, props: cakeProps() }));
      tag(sc, [0, 2.45, -1.6], "…", t, 6.6, { size: 70 }); } },
  // 2. Пара секунд: первое впечатление
  { t0: 8.4, t1: 15.7, cam: [[8.4, [0.7, 1.05, 0.25], [0.75, 1.0, -0.95], 56], [15.7, [0.7, 1.03, 0.05], [0.75, 1.0, -0.95], 52]], focus: [0.75, 1.0, -0.95],
    build(sc, t) { hallway(sc, t, { open: true });
      drawActor(sc, t, gosha({ pos: [0.75, 0, -0.95], expr: [[8.4, "nervous"], [10.5, "shock"], [13.0, "realize"]], bigEyes: [[10.5, true], [13.0, false]], ...HANDS_HOLD, props: cakeProps() })); },
    over(g, t) { if (t < 9.6) return; const left = Math.max(0, 2 - (t - 9.6) * 0.5); bubbleLabel(g, 540, 330, `0:0${Math.ceil(left)}`, t, 9.7, { size: 110, bg: left > 1 ? "#ffffff" : "#ff6b6b", fg: left > 1 ? "#111" : "#fff" });
      if (t > 12.0) bubbleLabel(g, 540, 520, "ПЕРВОЕ ВПЕЧАТЛЕНИЕ", t, 12.1, { size: 58, bg: "#f5c518" }); } },
  // 3. Вовремя, не с пустыми руками: торт и цветы маме
  { t0: 15.7, t1: 23.1, cam: [[15.7, [0.3, 1.2, 1.7], [0.2, 1.1, -1.2], 64], [23.1, [0.35, 1.18, 1.4], [0.2, 1.1, -1.2], 60]], focus: [0.4, 1.0, -0.9],
    build(sc, t) { hallway(sc, t, { open: t > 20.0 });
      if (t > 20.3) drawActor(sc, t, MOM({ pos: [-0.15, 0, -1.6], expr: [[20.3, "grin"], [21.5, "proud"]], look: [[20.3, 0.6]] }));
      const fl = t > 20.8;
      drawActor(sc, t, gosha({ pos: [0.5, 0, -0.95], expr: [[15.7, "smug"], [17.1, "proud"], [18.6, "grin"], [20.8, "proud"]], look: [[15.7, 0.3]],
        handF: fl ? [[20.8, -0.36, 0.72], [99, -0.36, 0.72]] : HANDS_HOLD.handF, handB: HANDS_HOLD.handB, bendF: [[0, -0.4]], bendB: [[0, 0.4]],
        props: (g, fx, ty, k, tt, layer) => { cakeProps()(g, fx, ty, k, tt, layer); if (fl) flowersProps(g, fx, ty, k, tt, layer); } }));
      tag(sc, [1.6, 2.2, -1.9], "ВОВРЕМЯ ✓", t, 16.3, { size: 54, until: 18.6 });
      tag(sc, [0.5, 1.75, -0.95], "ТОРТ ✓", t, 18.9, { size: 56, bg: "#f5c518", until: 20.7 });
      tag(sc, [-0.15, 2.45, -1.6], "ЦВЕТЫ МАМЕ ✓", t, 21.2, { size: 52, bg: "#ff9ec0" }); } },
  // 4. Поздоровайся с каждым: маме улыбка, папе рукопожатие
  { t0: 23.1, t1: 31.1, cam: [[23.1, [0.3, 1.35, 2.6], [0.2, 1.2, -1.0], 66], [31.1, [0.25, 1.32, 2.3], [0.2, 1.2, -1.0], 64]], focus: [0.2, 1.1, -0.8],
    build(sc, t) { livingRoom(sc, t, { door: true });
      drawActor(sc, t, MOM({ pos: [-1.1, 0, -1.1], expr: [[23.1, "grin"], [24.4, "proud"]], look: [[23.1, 0.7]] }));
      drawActor(sc, t, GIRL({ pos: [-0.45, 0, -1.3], expr: [[23.1, "grin"], [28.0, "proud"]], look: [[23.1, 0.7]] }));
      drawActor(sc, t, DAD({ pos: [0.95, 0, -0.85], expr: [[23.1, "stern"], [26.2, "neutral"], [27.6, "smug"]], look: [[23.1, -0.7]],
        handF: [[25.3, ...REST_FM], [25.6, -0.42, 0.72], [27.4, -0.42, 0.72], [27.7, ...REST_FM]] }));
      drawActor(sc, t, gosha({ pos: [0.25, 0, -0.8], expr: [[23.1, "nervous"], [24.0, "grin"], [25.6, "stern"], [26.8, "proud"], [29.0, "nervous"]], look: [[23.1, -0.7], [25.3, 0.8]],
        handB: [[25.3, ...REST_BM], [25.6, 0.42, 0.72], [26.0, 0.42, 0.67], [26.4, 0.42, 0.72], [26.8, 0.42, 0.67], [27.4, 0.42, 0.72], [27.7, ...REST_BM]] }));
      tag(sc, [-1.1, 1.85, -1.1], "УЛЫБКА!", t, 24.0, { size: 64, until: 25.4 });
      tag(sc, [0.6, 1.6, -0.8], "ГЛАЗА В ГЛАЗА", t, 26.4, { size: 48, until: 29.0 });
      tag(sc, [-0.45, 1.75, -1.3], "НЕ ПРЯЧЬСЯ", t, 29.2, { size: 50, bg: "#f5c518" }); } },
  // 5. Обувь снимай сам
  { t0: 31.1, t1: 36.8, cam: [[31.1, [0.55, 0.95, 1.3], [0.5, 0.7, -1.0], 62], [36.8, [0.5, 0.95, 1.15], [0.5, 0.7, -1.0], 60]], focus: [0.45, 0.6, -1.0],
    build(sc, t) { hallway(sc, t, { open: true });
      drawActor(sc, t, gosha({ pos: [0.45, 0, -1.0], expr: [[31.1, "realize"], [32.2, "proud"]], lean: [[31.6, 0, 0], [32.0, 0.2, 0], [33.3, 0.2, 0], [33.7, 0, 0]] }));
      if (t > 33.0) sc.sprite([0.75, 0.02, -0.7], -0.02, (g, x, y, k) => { for (const dx of [-0.07, 0.07]) { g.fillStyle = "#2f6fd6"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.ellipse(x + dx * k, y, 0.06 * k, 0.03 * k, 0, 0, 7); g.fill(); g.stroke(); } });
      tag(sc, [0.75, 0.45, -0.7], "САМ ✓", t, 33.2, { size: 60, bg: "#f5c518" });
      tag(sc, [0.45, 1.75, -1.0], "ЗАМЕТИЛИ!", t, 35.0, { size: 48 }); } },
  // 6. За столом: телефон в карман, вопрос папе про рыбалку
  { t0: 36.8, t1: 42.7, cam: [[36.8, [0.1, 1.25, 1.6], [0.1, 1.05, -1.2], 64], [42.7, [0.15, 1.22, 1.35], [0.15, 1.05, -1.2], 60]], focus: [0.1, 1.0, -1.2],
    build(sc, t) { dining(sc, t);
      drawActor(sc, t, DAD({ pos: [0.65, 0, -1.35], expr: [[36.8, "neutral"], [40.0, "realize"], [41.4, "grin"]], look: [[36.8, -0.6]] }));
      drawActor(sc, t, MOM({ pos: [-0.75, 0, -1.4], expr: [[36.8, "grin"]], look: [[36.8, 0.5]] }));
      drawActor(sc, t, gosha({ pos: [-0.1, 0, -1.25], expr: [[36.8, "neutral"], [37.6, "smug"], [39.6, "grin"]], look: [[36.8, 0.2], [39.6, 0.8]], mouth: talkMouth(39.8, 41.4),
        handF: [[36.9, -0.12, 0.66], [37.6, -0.12, 0.66], [37.9, -0.2, 0.42], [99, -0.2, 0.42]],
        props: (g, fx, ty, k, tt, layer) => { if (layer === "front" && tt < 37.8) { const [x, y] = loc(fx, ty, k)(-0.12, 0.7); drawPhone(g, x, y, k * 1.2); } } }));
      tag(sc, [-0.1, 1.7, -1.25], "ТЕЛЕФОН → КАРМАН", t, 37.0, { size: 44, until: 39.5 }); },
    over(g, t) { thoughtIcons(g, t, 40.2, 760, 420, "fish", 41.6); thoughtIcons(g, t, 41.6, 760, 420, "car"); } },
  // 7. Папа рассказывает, Гоша кивает
  { t0: 42.7, t1: 48.1, cam: [[42.7, [0.4, 1.45, 1.1], [0.4, 1.15, -1.35], 56], [48.1, [0.35, 1.42, 0.9], [0.4, 1.15, -1.35], 52]], focus: [0.65, 1.2, -1.35],
    build(sc, t) { dining(sc, t);
      drawActor(sc, t, DAD({ pos: [0.65, 0, -1.35], expr: [[42.7, "laugh"], [44.3, "proud"], [45.8, "grin"]], look: [[42.7, -0.6]], mouth: talkMouth(42.8, 45.6, 0.22),
        handB: [[43.0, ...REST_BM], [43.3, 0.5, 1.0], [44.0, 0.45, 0.9], [44.6, 0.52, 1.02], [45.4, ...REST_BM]] }));
      drawActor(sc, t, gosha({ pos: [-0.1, 0, -1.25], expr: [[42.7, "grin"], [45.0, "proud"]], look: [[42.7, 0.8]], tilt: nod(43.0, 46.5) }));
      tag(sc, [0.65, 2.35, -1.35], "«КАКОЙ ИНТЕРЕСНЫЙ ПАРЕНЬ»", t, 46.0, { size: 40, bg: "#f5c518" }); },
    over(g, t) { thoughtIcons(g, t, 43.0, 820, 330, "fish"); } },
  // 8. Не притворяйся: «не знаю» — честно
  { t0: 48.1, t1: 53.9, cam: [[48.1, [0.1, 1.25, 1.5], [0.15, 1.05, -1.2], 62], [53.9, [0.15, 1.22, 1.25], [0.15, 1.05, -1.2], 58]], focus: [0.15, 1.0, -1.25],
    build(sc, t) { dining(sc, t);
      drawActor(sc, t, DAD({ pos: [0.65, 0, -1.35], expr: [[48.1, "smug"], [50.6, "realize"], [51.6, "proud"]], look: [[48.1, -0.6]], mouth: talkMouth(48.2, 49.4) }));
      drawActor(sc, t, MOM({ pos: [-0.75, 0, -1.4], expr: [[48.1, "neutral"], [51.6, "grin"]], look: [[48.1, 0.5]] }));
      drawActor(sc, t, gosha({ pos: [-0.1, 0, -1.25], expr: [[48.1, "nervous"], [49.6, "neutral"], [51.3, "grin"]], look: [[48.1, 0.8]], mouth: talkMouth(49.8, 50.8) }));
      tag(sc, [0.65, 2.35, -1.35], "КАРБЮРАТОР?", t, 48.3, { size: 50, until: 49.6 });
      tag(sc, [-0.1, 1.72, -1.25], "ЧЕСТНО — НЕ ЗНАЮ", t, 49.8, { size: 46, bg: "#ffffff" });
      tag(sc, [0.65, 2.35, -1.35], "ОТЛИЧНО!", t, 51.7, { size: 64 }); } },
  // 9. Помочь убрать со стола
  { t0: 53.9, t1: 57.9, cam: [[53.9, [-0.2, 1.25, 1.6], [0.0, 1.05, -1.2], 64], [57.9, [-0.15, 1.22, 1.35], [0.0, 1.05, -1.2], 60]], focus: [0.0, 1.0, -1.25],
    build(sc, t) { dining(sc, t, { noCake: true });
      drawActor(sc, t, MOM({ pos: [-0.75, 0, -1.4], expr: [[53.9, "realize"], [55.2, "grin"], [56.4, "proud"]], look: [[53.9, 0.6]] }));
      drawActor(sc, t, gosha({ walk: [[53.9, -0.6, 0.05], [55.0, -0.6, 0.05], [57.6, 1.4, 0.05]], expr: [[53.9, "smug"], [55.0, "proud"]], ...HANDS_HOLD, props: platesProps }));
      tag(sc, [-0.75, 2.2, -1.4], "КАКОЙ ЗЯТЬ…", t, 56.0, { size: 46, bg: "#ff9ec0" }); } },
  // 10. Папа провожает до двери — и улыбается под усами
  { t0: 57.9, t1: TOTAL_T, cam: [[57.9, [0.3, 1.45, 1.3], [0.15, 1.25, -1.6], 60], [61.0, [0.1, 1.5, 0.75], [0.0, 1.3, -1.6], 52], [TOTAL_T, [0.05, 1.52, 0.6], [0.0, 1.32, -1.6], 48]], focus: [0, 1.5, -1.6],
    build(sc, t) { hallway(sc, t, { open: true });
      drawActor(sc, t, DAD({ pos: [0, 0, -1.6], expr: [[57.9, "stern"], [60.0, "neutral"], [61.6, "proud"]], look: [[57.9, 0.4]], blinkHold: [[61.3, true], [61.5, false]] }));
      drawActor(sc, t, gosha({ pos: [0.8, 0, -0.95], expr: [[57.9, "nervous"], [61.7, "grin"]], look: [[57.9, -0.8]] }));
      tag(sc, [0, 2.6, -1.6], ":)", t, 61.8, { size: 70 }); } },
] };
