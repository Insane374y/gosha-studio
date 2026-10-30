// «Что если Гоша признается девочке, что она ему нравится» (64.5 с)
const GIRL5 = (extra) => person("girl5", "girl2", Object.assign({ scale: 0.95 }, extra));
const rehearse = (t0, t1) => { const k = []; for (let t = t0, i = 0; t < t1; t += 0.5, i++) k.push([t, i % 2 ? -0.42 : -0.3, i % 2 ? HZ + 0.1 : 0.7]); return k; };
const STOP = [-0.4, 0, -1.75];

window.VIDEO = { total: TOTAL_T, titleEnd: 3.4, title: ["ГОША ПРИЗНАЕТСЯ ДЕВОЧКЕ,", "ЧТО ОНА ЕМУ НРАВИТСЯ"], shots: [
  // 0. Остановка, крупно
  { t0: 0, t1: 3.6, cam: [[0, [-0.35, 1.0, -0.35], [-0.4, 0.98, -1.75], 68], [3.6, [-0.35, 1.0, -0.5], [-0.4, 0.98, -1.75], 64]], focus: STOP,
    build(sc, t) { busStop(sc, t); drawActor(sc, t, gosha({ pos: STOP, expr: [[0, "nervous"], [1.8, "realize"]], look: [[0, 0.6]] })); } },
  // 1. Час репетирует на остановке
  { t0: 3.6, t1: 10.2, cam: [[3.6, [0.6, 1.3, 1.0], [-0.4, 1.1, -1.9], 62], [10.2, [0.45, 1.28, 0.75], [-0.4, 1.1, -1.9], 58]], focus: STOP,
    build(sc, t) { busStop(sc, t);
      drawActor(sc, t, gosha({ pos: STOP, expr: [[3.6, "smug"], [5.2, "grin"], [6.0, "nervous"], [7.1, "neutral"], [8.6, "nervous"]], look: [[3.6, -0.6]], mouth: talkMouth(5.0, 9.4, 0.22),
        handF: rehearse(5.0, 9.4) }));
      tag(sc, [-0.4, 1.75, -1.75], "«ПРИВЕТ. ТЫ МНЕ…»", t, 5.1, { size: 46, until: 6.0 });
      tag(sc, [-0.4, 1.75, -1.75], "НЕТ.", t, 6.0, { size: 64, bg: "#ff6b6b", fg: "#fff", until: 7.1 });
      tag(sc, [-0.4, 1.75, -1.75], "«СЛУШАЙ, Я ТУТ…»", t, 7.2, { size: 46, until: 8.6 });
      tag(sc, [-0.4, 1.75, -1.75], "НЕТ!", t, 8.7, { size: 64, bg: "#ff6b6b", fg: "#fff" });
      tag(sc, [0.9, 2.95, -2.2], "1 ЧАС", t, 3.8, { size: 52, bg: "#f5c518", until: 5.0 }); } },
  // 2. Сердце стучит, ладони мокрые, в голове пусто
  { t0: 10.2, t1: 19.0, cam: [[10.2, [-0.35, 1.02, -0.3], [-0.4, 0.98, -1.75], 68], [19.0, [-0.35, 1.02, -0.6], [-0.4, 0.98, -1.75], 62]], focus: STOP,
    build(sc, t) { busStop(sc, t); drawActor(sc, t, gosha({ pos: STOP, expr: [[10.2, "nervous"], [12.9, "shock"], [15.3, "blank"], [16.4, "nervous"]], bigEyes: [[12.9, true], [15.3, false]] })); },
    over(g, t) { const beat = 1 + 0.18 * Math.max(0, Math.sin(t * 9)); if (t > 10.6) drawHeart(g, 860, 470, 180 * popScale(t, 10.6), beat);
      if (t > 15.3) bubbleLabel(g, 540, 330, "В ГОЛОВЕ: …", t, 15.4, { size: 58 });
      if (t > 16.6) bubbleLabel(g, 540, 1150, "ТАК У ВСЕХ", t, 16.7, { size: 58, bg: "#7bd389" }); } },
  // 3. Без красивой речи: «Ты мне нравишься. Хочешь в кино в субботу?»
  { t0: 19.0, t1: 25.9, cam: [[19.0, [-0.35, 1.1, 0.1], [-0.4, 1.0, -1.75], 58], [25.9, [-0.35, 1.08, -0.15], [-0.4, 1.0, -1.75], 54]], focus: STOP,
    build(sc, t) { busStop(sc, t); drawActor(sc, t, gosha({ pos: STOP, expr: [[19.0, "realize"], [20.6, "smug"], [22.0, "proud"]], mouth: talkMouth(22.2, 25.0, 0.24) }));
      tag(sc, [-0.4, 1.78, -1.75], "ПРОСТО", t, 20.0, { size: 56, bg: "#f5c518", until: 22.0 }); },
    over(g, t) { if (t > 22.2) bubbleLabel(g, 540, 330, "«ТЫ МНЕ НРАВИШЬСЯ.»", t, 22.3, { size: 56 }); if (t > 23.6) bubbleLabel(g, 540, 460, "«В КИНО В СУББОТУ?»", t, 23.7, { size: 56, bg: "#f5c518" }); } },
  // 4. Не при всём классе и не в 2 часа ночи
  { t0: 25.9, t1: 31.6,
    screen(g, t) { g.fillStyle = "#f6efe2"; g.fillRect(0, 0, W, H);
      const card = (x, y, ok, t0, draw, label) => { const s = popScale(t, t0); if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 8; g.beginPath(); g.roundRect(-230, -230, 460, 460, 30); g.fill(); g.stroke(); draw(g); g.fillStyle = "#111"; g.font = `900 40px ${FONT_TITLE}`; g.textAlign = "center"; g.fillText(label, 0, 195);
        g.lineWidth = 22; g.strokeStyle = ok ? "#3aa676" : "#e8453c"; g.beginPath(); if (ok) { g.moveTo(130, -170); g.lineTo(165, -130); g.lineTo(220, -210); } else { g.moveTo(140, -210); g.lineTo(210, -140); g.moveTo(210, -210); g.lineTo(140, -140); } g.stroke(); g.restore(); };
      card(300, 470, false, 26.0, (gg) => { for (let i = 0; i < 6; i++) { gg.fillStyle = ["#8fb8de", "#e8a87c", "#9cc59a", "#f2c94c", "#c38fd6", "#ff9ec0"][i]; gg.beginPath(); gg.arc(-150 + (i % 3) * 150, -80 + Math.floor(i / 3) * 120, 50, 0, 7); gg.fill(); gg.stroke(); } }, "ПРИ ВСЁМ КЛАССЕ");
      card(780, 470, false, 28.0, (gg) => { gg.fillStyle = "#1c2348"; gg.beginPath(); gg.roundRect(-110, -170, 220, 320, 26); gg.fill(); gg.stroke(); gg.fillStyle = "#fff"; gg.font = `900 70px ${FONT_TITLE}`; gg.textAlign = "center"; gg.fillText("02:00", 0, -10); }, "НОЧЬЮ В ЛИЧКЕ");
      card(540, 990, true, 29.4, (gg) => { goshaSprite(gg, -85, 160, 420, { expr: "grin", lookX: 0.8 }); gg.save(); gg.translate(95, 160); const c = drawSprite._c; drawDoodle(c.getContext("2d"), LOOK.girl2, { expr: "grin", blink: false, bonk: 0, breathe: 0, lookX: -0.8 }); gg.drawImage(c, -400 * PLANE_W / PLANE_H / 2, -400, 400 * PLANE_W / PLANE_H, 400); gg.restore(); }, "ВДВОЁМ"); } },
  // 5. Смотри в глаза, говори спокойно
  { t0: 31.6, t1: 36.6, cam: [[31.6, [-0.35, 1.02, -0.3], [-0.4, 0.98, -1.75], 66], [36.6, [-0.35, 1.02, -0.5], [-0.4, 0.98, -1.75], 62]], focus: STOP,
    build(sc, t) { busStop(sc, t); drawActor(sc, t, gosha({ pos: STOP, expr: [[31.6, "neutral"], [32.8, "stern"], [34.4, "proud"]], look: [[31.6, 0]] }));
      tag(sc, [-0.4, 1.7, -1.75], "СПОКОЙНО", t, 33.0, { size: 58, until: 34.6 });
      tag(sc, [-0.4, 1.7, -1.75], "БЕЗ ШУТОЧЕК", t, 34.7, { size: 54, bg: "#f5c518" }); } },
  // 6. Как прыжок в бассейн: страшно только до прыжка
  { t0: 36.6, t1: 41.0,
    screen(g, t) { const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, "#8fd0ff"); sk.addColorStop(1, "#d9f1ff"); g.fillStyle = sk; g.fillRect(0, 0, W, H);
      g.fillStyle = "#3aa0e8"; g.fillRect(0, 1350, W, 570); g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 8; for (let i = 0; i < 6; i++) { g.beginPath(); for (let x = 0; x <= W; x += 30) g.lineTo(x, 1420 + i * 80 + Math.sin(x / 70 + t * 3 + i) * 10); g.stroke(); }
      g.fillStyle = "#e8e3d6"; g.strokeStyle = "#000"; g.lineWidth = 7; g.fillRect(120, 600, 60, 760); g.strokeRect(120, 600, 60, 760); g.fillRect(150, 580, 420, 40); g.strokeRect(150, 580, 420, 40);
      const jump = ramp(t, 38.4, 39.6), x = 500 + jump * 120, y = 580 - Math.sin(jump * Math.PI) * 200 + jump * jump * 900;
      if (jump < 1) goshaSprite(g, x, y, 520, { expr: t < 38.4 ? "nervous" : "laugh", handF: [-0.45, HZ + 0.3], handB: [0.45, HZ + 0.3], bendF: -0.2, bendB: 0.2 });
      if (jump >= 1) { g.fillStyle = "#fff"; for (let i = 0; i < 8; i++) { const a = -Math.PI * (0.1 + i * 0.1), r = 60 + (t - 39.6) * 300; g.beginPath(); g.arc(620 + Math.cos(a) * r, 1380 + Math.sin(a) * r * 0.7, 18, 0, 7); g.fill(); } }
      if (t > 37.0 && t < 38.6) bubbleLabel(g, 760, 360, "СТРАШНО…", t, 37.1, { size: 60 });
      if (t > 39.8) bubbleLabel(g, 760, 360, "А ПОТОМ ЛЕГЧЕ!", t, 39.9, { size: 60, bg: "#7bd389" }); } },
  // 7. Любой ответ — нормальный
  { t0: 41.0, t1: 52.4, cam: [[41.0, [-0.1, 1.2, 0.6], [-0.1, 1.0, -1.75], 62], [52.4, [-0.1, 1.18, 0.35], [-0.1, 1.0, -1.75], 58]], focus: [-0.1, 1.0, -1.7],
    build(sc, t) { busStop(sc, t);
      drawActor(sc, t, GIRL5({ pos: [0.3, 0, -1.65], expr: [[41.0, "neutral"], [44.2, "grin"], [46.0, "neutral"], [47.0, "nervous"]], look: [[41.0, -0.7]] }));
      drawActor(sc, t, gosha({ pos: [-0.55, 0, -1.7], expr: [[41.0, "neutral"], [44.2, "laugh"], [46.0, "neutral"], [47.0, "blank"], [48.3, "proud"]], look: [[41.0, 0.7]], mouth: talkMouth(48.4, 50.2, 0.22) }));
      tag(sc, [0.3, 1.7, -1.65], "ДА!", t, 44.0, { size: 70, bg: "#7bd389", until: 45.9 });
      tag(sc, [0.3, 1.7, -1.65], "НЕТ…", t, 46.6, { size: 64, bg: "#ff6b6b", fg: "#fff", until: 48.3 });
      tag(sc, [-0.55, 1.75, -1.7], "«ПОНЯЛ, СПАСИБО, ЧТО ЧЕСТНО»", t, 48.4, { size: 38 });
      tag(sc, [-0.1, 2.15, -1.7], "НЕ ДАВИ", t, 50.3, { size: 56, bg: "#f5c518" }); } },
  // 8. Смелость — решиться сказать
  { t0: 52.4, t1: 57.6, cam: [[52.4, [-0.35, 1.0, -0.3], [-0.4, 0.98, -1.75], 66], [57.6, [-0.35, 1.0, -0.55], [-0.4, 0.98, -1.75], 60]], focus: STOP,
    build(sc, t) { busStop(sc, t); drawActor(sc, t, gosha({ pos: STOP, expr: [[52.4, "neutral"], [54.5, "realize"], [55.6, "proud"]] }));
      tag(sc, [-0.4, 1.7, -1.75], "СМЕЛОСТЬ = СКАЗАТЬ", t, 55.2, { size: 50, bg: "#f5c518" }); } },
  // 9. Гоша говорит — она улыбается
  { t0: 57.6, t1: 61.0, cam: [[57.6, [-0.1, 1.15, 0.9], [-0.1, 1.0, -1.75], 58], [61.0, [-0.1, 1.13, 0.7], [-0.1, 1.0, -1.75], 56]], focus: [-0.1, 1.0, -1.7],
    build(sc, t) { busStop(sc, t);
      drawActor(sc, t, GIRL5({ walk: [[57.6, 1.6, -1.65], [58.6, 0.3, -1.65]], expr: [[57.6, "neutral"], [59.6, "grin"]], look: [[57.6, -0.7]] }));
      drawActor(sc, t, gosha({ pos: [-0.55, 0, -1.7], expr: [[57.6, "nervous"], [58.7, "neutral"], [60.0, "grin"]], look: [[57.6, 0.7]], mouth: talkMouth(58.8, 59.9, 0.22) }));
      tag(sc, [-0.25, 1.85, -1.7], "«ТЫ МНЕ НРАВИШЬСЯ»", t, 58.8, { size: 42 }); } },
  // 10. «Я знаю. Ты час репетировал на моей остановке»
  { t0: 61.0, t1: TOTAL_T, cam: [[61.0, [-0.1, 1.12, 0.6], [-0.1, 1.0, -1.75], 56], [TOTAL_T, [-0.1, 1.12, 0.35], [-0.1, 1.0, -1.75], 52]], focus: [-0.1, 1.0, -1.7],
    build(sc, t) { busStop(sc, t);
      drawActor(sc, t, GIRL5({ pos: [0.3, 0, -1.65], expr: [[61.0, "smug"], [62.4, "grin"]], look: [[61.0, -0.7]], mouth: talkMouth(61.1, 63.2, 0.22) }));
      drawActor(sc, t, gosha({ pos: [-0.55, 0, -1.7], expr: [[61.0, "grin"], [61.8, "shock"], [62.8, "holdlaugh"]], bigEyes: [[61.8, true], [62.8, false]], look: [[61.0, 0.7]] }));
      tag(sc, [0.05, 1.85, -1.65], "Я ЗНАЮ :)", t, 61.1, { size: 56, bg: "#ff9ec0" }); } },
] };
