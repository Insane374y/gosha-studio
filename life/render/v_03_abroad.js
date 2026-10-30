// «Что если Гоша поедет за границу один» (63 с)
const suitcase = (sc, p) => sc.sprite(p, -0.02, (g, x, y, k) => drawSuitcase(g, x, y, k * 1.2));
const passProps = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(0.42, 0.98); drawPassport(g, x, y, k * 1.4); };
const phoneProps = (side = "b") => (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(side === "b" ? 0.42 : -0.42, 0.98); drawPhone(g, x, y, k * 1.6); };
const HOLD_B = { handB: [[0, 0.42, 0.95], [999, 0.42, 0.95]], bendB: [[0, 0.3]] };
const HOLD_F = { handF: [[0, -0.42, 0.95], [999, -0.42, 0.95]], bendF: [[0, -0.3]] };
const mapScreen = (g, x, y, w, h, t) => { g.fillStyle = "#e8eef2"; g.fillRect(x, y, w, h); g.strokeStyle = "#fff"; g.lineWidth = 22; for (const [a, b, c, d] of [[0, 0.3, 1, 0.45], [0.3, 0, 0.45, 1], [0, 0.75, 1, 0.65], [0.7, 0, 0.8, 1]]) { g.beginPath(); g.moveTo(x + a * w, y + b * h); g.lineTo(x + c * w, y + d * h); g.stroke(); }
  g.fillStyle = "#9cd6a0"; g.fillRect(x + w * 0.05, y + h * 0.05, w * 0.22, h * 0.18); g.fillStyle = "#9ec8ef"; g.fillRect(x + w * 0.5, y + h * 0.8, w * 0.45, h * 0.15);
  g.strokeStyle = "#2f6fd6"; g.lineWidth = 12; g.setLineDash([22, 14]); g.beginPath(); g.moveTo(x + w * 0.2, y + h * 0.85); g.lineTo(x + w * 0.38, y + h * 0.5); g.lineTo(x + w * 0.72, y + h * 0.35); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#e8453c"; g.beginPath(); g.arc(x + w * 0.72, y + h * 0.3, 26, Math.PI, 0); g.lineTo(x + w * 0.72, y + h * 0.37); g.closePath(); g.fill(); g.fillStyle = "#2f6fd6"; g.beginPath(); g.arc(x + w * 0.2, y + h * 0.85, 18, 0, 7); g.fill(); };

window.VIDEO = { total: TOTAL_T, titleEnd: 2.7, title: ["ГОША ПОЕДЕТ", "ЗА ГРАНИЦУ ОДИН"], shots: [
  // 0. Аэропорт, крупно
  { t0: 0, t1: 2.7, cam: [[0, [0.3, 1.0, 1.1], [0.2, 1.0, -0.8], 58], [2.7, [0.3, 1.0, 0.8], [0.2, 1.0, -0.8], 54]], focus: [0.2, 1.0, -0.8],
    build(sc, t) { airport(sc, t); suitcase(sc, [0.75, 0.0, -0.7]); drawActor(sc, t, gosha({ pos: [0.2, 0, -0.8], expr: [[0, "proud"], [1.5, "grin"]] })); } },
  // 1. Чемодан, рюкзак… а паспорт? Дома на столе
  { t0: 2.7, t1: 8.4, cam: [[2.7, [0.6, 1.35, 2.4], [0.2, 1.3, -1.5], 64], [8.4, [0.5, 1.32, 2.1], [0.2, 1.3, -1.5], 62]], focus: [0.2, 1.0, -0.8],
    build(sc, t) { airport(sc, t); suitcase(sc, [0.75, 0.0, -0.7]);
      drawActor(sc, t, gosha({ pos: [0.2, 0, -0.8], expr: [[2.7, "proud"], [3.6, "smug"], [4.6, "realize"], [5.6, "shock"]], bigEyes: [[5.6, true]], look: [[2.7, 0.7], [3.6, 0], [4.6, -0.5]],
        handF: [[4.7, ...REST_FM], [4.9, -0.2, 0.42], [5.1, -0.2, 0.5], [5.3, -0.2, 0.42], [5.5, ...REST_FM], [5.7, -0.45, HZ + 0.15], [8.4, -0.45, HZ + 0.15]],
        handB: [[4.7, ...REST_BM], [4.9, 0.2, 0.42], [5.1, 0.2, 0.5], [5.3, 0.2, 0.42], [5.5, ...REST_BM], [5.7, 0.45, HZ + 0.15], [8.4, 0.45, HZ + 0.15]], bendF: [[5.6, -0.3]], bendB: [[5.6, 0.3]] }));
      tag(sc, [0.75, 1.0, -0.7], "ЧЕМОДАН ✓", t, 3.2, { size: 46, until: 4.4 });
      tag(sc, [0.2, 1.75, -0.8], "ПАСПОРТ?!", t, 4.6, { size: 60, bg: "#ff6b6b", fg: "#fff" }); },
    over(g, t) { if (t < 6.1) return; const s = popScale(t, 6.1); g.save(); g.translate(800, 380); g.scale(s, s); g.translate(-800, -380);
      drawThought(g, 800, 380, 340, 250, 620, 720, (gg, cx, cy, sz) => { gg.fillStyle = "#b8784a"; gg.strokeStyle = "#000"; gg.lineWidth = 5; gg.fillRect(cx - sz * 0.45, cy + sz * 0.1, sz * 0.9, sz * 0.12); gg.strokeRect(cx - sz * 0.45, cy + sz * 0.1, sz * 0.9, sz * 0.12); drawPassport(gg, cx, cy - sz * 0.05, sz * 1.1); }); g.restore(); } },
  // 2. Один в чужой стране
  { t0: 8.4, t1: 13.3, cam: [[8.4, [0.3, 1.3, 2.4], [0.6, 1.5, -2.5], 66], [13.3, [0.4, 1.28, 2.1], [0.6, 1.5, -2.5], 62]], focus: [0.3, 1.0, -0.8],
    build(sc, t) { foreignStreet(sc, t); suitcase(sc, [0.8, 0, -0.7]);
      drawActor(sc, t, gosha({ pos: [0.3, 0, -0.8], expr: [[8.4, "neutral"], [9.4, "nervous"], [11.0, "blank"], [12.0, "nervous"]], look: [[8.4, -0.8], [9.6, 0.8], [10.8, -0.8]] }));
      tag(sc, [-1.6, 1.9, -1.6], "BONJOUR!", t, 9.5, { size: 46 }); tag(sc, [2.0, 2.1, -1.6], "¿QUÉ TAL?", t, 10.3, { size: 46 }); tag(sc, [-0.6, 2.6, -1.8], "GRAZIE!", t, 11.1, { size: 46 });
      tag(sc, [0.3, 1.75, -0.8], "…МАМА?", t, 12.2, { size: 54 }); } },
  // 3. Фото паспорта → облако и почта
  { t0: 13.3, t1: 18.2,
    screen(g, t) { g.fillStyle = "#cfe9f7"; g.fillRect(0, 0, W, H); goshaSprite(g, 290, 1750, 1150, { expr: t < 15 ? "realize" : "proud", handB: [0.42, 0.95], bendB: 0.3, lookX: 0.6 });
      phoneScreen(g, t, 13.4, (gg, x, y, w, h) => { gg.fillStyle = "#333"; gg.fillRect(x, y, w, h); drawPassport(gg, x + w / 2, y + h * 0.42, 1500); const fl = t > 14.4 && t < 14.7; if (fl) { gg.fillStyle = "rgba(255,255,255,0.85)"; gg.fillRect(x, y, w, h); }
        gg.fillStyle = "#fff"; gg.beginPath(); gg.arc(x + w / 2, y + h * 0.9, 34, 0, 7); gg.fill(); }, { x: 690, y: 820, w: 420, h: 760 });
      if (t > 15.6) { const k = ramp(t, 15.6, 16.6); bubbleLabel(g, 760, 290, "☁ ОБЛАКО ✓", t, 15.7, { size: 54 }); if (t > 16.6) bubbleLabel(g, 760, 410, "✉ ПОЧТА ✓", t, 16.7, { size: 54, bg: "#f5c518" }); } } },
  // 4. Деньги по разным карманам
  { t0: 18.2, t1: 25.2, cam: [[18.2, [0.2, 1.1, 1.0], [0.2, 0.95, -0.8], 58], [25.2, [0.2, 1.08, 0.8], [0.2, 0.95, -0.8], 54]], focus: [0.2, 0.95, -0.8],
    build(sc, t) { foreignStreet(sc, t); drawActor(sc, t, gosha({ pos: [0.2, 0, -0.8], expr: [[18.2, "realize"], [19.5, "smug"], [22.8, "proud"]], look: [[18.2, 0]] })); },
    over(g, t) { const items = [[19.4, "КАРТА", "#2f6fd6", 230, 1040], [20.2, "ЗАПАСНАЯ", "#3aa676", 850, 1040], [21.0, "НАЛИЧНЫЕ", "#7bd389", 540, 380]];
      for (const [t0, txt, c, x, y] of items) { if (t < t0) continue; const s = popScale(t, t0); g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.strokeStyle = "#000"; g.lineWidth = 7; g.beginPath(); g.roundRect(-110, -70, 220, 140, 18); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.font = `900 34px ${FONT_TITLE}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 0); g.restore(); }
      if (t > 22.6) bubbleLabel(g, 540, 1180, "ПОТЕРЯЛ ОДНО — НЕ ВСЁ", t, 22.7, { size: 52, bg: "#f5c518" }); } },
  // 5. Офлайн-карта: интернет пропал
  { t0: 25.2, t1: 29.4,
    screen(g, t) { g.fillStyle = "#e8d9bf"; g.fillRect(0, 0, W, H); goshaSprite(g, 250, 1750, 1150, { expr: t < 27 ? "nervous" : "smug", handB: [0.42, 0.95], bendB: 0.3, lookX: 0.7 });
      phoneScreen(g, t, 25.3, (gg, x, y, w, h) => { mapScreen(gg, x, y, w, h, t); gg.fillStyle = "#ff6b6b"; gg.beginPath(); gg.roundRect(x + 20, y + 20, w - 40, 70, 16); gg.fill(); gg.fillStyle = "#fff"; gg.font = `900 38px ${FONT_TITLE}`; gg.textAlign = "center"; gg.textBaseline = "middle"; gg.fillText(t > 27.0 ? "ОФЛАЙН ✓" : "НЕТ СЕТИ", x + w / 2, y + 56); }, { x: 690, y: 800 }); } },
  // 6. Адрес отеля на местном языке — показать таксисту
  { t0: 29.4, t1: 34.5, cam: [[29.4, [0.4, 1.35, 3.6], [0.6, 0.95, -0.5], 62], [34.5, [0.45, 1.33, 3.3], [0.6, 0.95, -0.5], 60]], focus: [0.3, 0.95, -0.2],
    build(sc, t) { foreignStreet(sc, t, { noCars: false, cars: [[1.4, "#f2c230"]] });
      drawActor(sc, t, person("driver", "driver", { pos: [1.3, 0.25, 0.1], scale: 0.85, expr: [[29.4, "neutral"], [32.4, "grin"]], look: [[29.4, -0.7]] }));
      drawActor(sc, t, gosha({ pos: [-0.2, 0, 0.35], expr: [[29.4, "realize"], [30.8, "smug"], [32.4, "proud"]], look: [[29.4, 0.7]], ...HOLD_B, props: phoneProps("b") }));
      tag(sc, [0.4, 1.55, 0.35], "HÔTEL LUNE, 12 RUE…", t, 30.4, { size: 40 });
      tag(sc, [1.3, 1.6, 0.1], "OUI!", t, 32.5, { size: 56, bg: "#7bd389" }); } },
  // 7. «Таксисты» у выхода — нет. Официальное такси
  { t0: 34.5, t1: 42.1, cam: [[34.5, [0.4, 1.35, 2.6], [0.5, 1.3, -1.5], 66], [42.1, [0.55, 1.33, 2.3], [0.55, 1.3, -1.5], 62]], focus: [0.3, 1.0, -0.5],
    build(sc, t) { airport(sc, t, { taxiSign: true }); suitcase(sc, [1.15, 0, -0.35]);
      for (const [i, x] of [[0, -0.45], [1, 0.0]]) drawActor(sc, t, person("sh" + i, "driver", { pos: [x, 0, -0.9], expr: [[34.5, "smug"], [36.5, "grin"]], look: [[34.5, 0.8]], mouth: talkMouth(34.7, 36.4, 0.2),
        handB: [[34.6, 0.42, HZ + 0.25], [35.0, 0.3, HZ + 0.1], [35.4, 0.42, HZ + 0.25], [35.8, 0.3, HZ + 0.1], [36.4, ...REST_BM]] }));
      drawActor(sc, t, gosha({ walk: [[34.5, 0.75, -0.4], [37.6, 0.75, -0.4], [41.0, 1.55, -0.9]], expr: [[34.5, "nervous"], [36.5, "stern"], [38.0, "proud"]], look: [[34.5, -0.8], [37.6, 0.6]],
        handF: [[36.6, ...REST_FM], [36.8, -0.42, HZ + 0.05], [37.5, -0.42, HZ + 0.05], [37.7, ...REST_FM]] }));
      tag(sc, [-0.2, 1.95, -0.9], "TAXI! TAXI!", t, 34.6, { size: 50, until: 36.6 });
      tag(sc, [0.75, 1.75, -0.4], "НЕТ, СПАСИБО", t, 36.8, { size: 50, until: 38.4 });
      tag(sc, [-0.2, 1.95, -0.9], "×3 ЦЕНА", t, 39.8, { size: 56, bg: "#ff6b6b", fg: "#fff" }); } },
  // 8. Пять слов
  { t0: 42.1, t1: 47.7, cam: [[42.1, [0.2, 1.1, 1.05], [0.2, 0.92, -0.8], 58], [47.7, [0.2, 1.08, 0.85], [0.2, 0.92, -0.8], 54]], focus: [0.2, 0.95, -0.8],
    build(sc, t) { foreignStreet(sc, t); drawActor(sc, t, gosha({ pos: [0.2, 0, -0.8], expr: [[42.1, "realize"], [43.2, "grin"], [45.0, "proud"]], mouth: talkMouth(43.2, 46.8, 0.25) })); },
    over(g, t) { const W5 = [[43.0, "ПРИВЕТ"], [43.6, "СПАСИБО"], [44.3, "СКОЛЬКО СТОИТ?"], [45.4, "ПОМОГИТЕ!"], [46.1, "ГДЕ ТУАЛЕТ?"]];
      W5.forEach(([t0, s], i) => { if (t > t0) bubbleLabel(g, i % 2 ? 690 : 390, 250 + i * 115, `${i + 1}. ${s}`, t, t0, { size: 48, bg: i === 4 ? "#f5c518" : "#fff", rot: i % 2 ? 0.03 : -0.03 }); }); } },
  // 9. Посольство и 112
  { t0: 47.7, t1: 53.8,
    screen(g, t) { g.fillStyle = "#cfe9f7"; g.fillRect(0, 0, W, H); goshaSprite(g, 260, 1750, 1150, { expr: t < 50.5 ? "realize" : "proud", handB: [0.42, 0.95], bendB: 0.3, lookX: 0.7 });
      phoneScreen(g, t, 47.8, (gg, x, y, w, h) => { gg.fillStyle = "#f4f6fa"; gg.fillRect(x, y, w, h); gg.fillStyle = "#111"; gg.font = `800 34px ${FONT_TITLE}`; gg.textAlign = "center"; gg.fillText("КОНТАКТЫ", x + w / 2, y + 60);
        gg.fillStyle = "#e8eef2"; gg.beginPath(); gg.roundRect(x + 20, y + 100, w - 40, 90, 16); gg.fill(); gg.fillStyle = "#111"; gg.font = `800 32px ${FONT_TITLE}`; gg.fillText("ПОСОЛЬСТВО", x + w / 2, y + 155);
        if (t > 50.0) { gg.fillStyle = "#e8453c"; gg.beginPath(); gg.roundRect(x + 20, y + 230, w - 40, 260, 22); gg.fill(); gg.fillStyle = "#fff"; gg.font = `900 150px ${FONT_TITLE}`; gg.fillText("112", x + w / 2, y + 400); gg.font = `800 30px ${FONT_TITLE}`; gg.fillText("ВСЕ СТРАНЫ ЕС", x + w / 2, y + 465); } }, { x: 690, y: 820 }); } },
  // 10. Маршрут родителям, связь каждый вечер
  { t0: 53.8, t1: 57.7,
    screen(g, t) { g.fillStyle = "#1c2348"; g.fillRect(0, 0, W, H); spaceBg(g, t * 0.2, 9); g.fillStyle = "rgba(28,35,72,0.5)"; g.fillRect(0, 0, W, H);
      goshaSprite(g, 260, 1750, 1150, { expr: "grin", handB: [0.42, 0.95], bendB: 0.3, lookX: 0.7 });
      phoneScreen(g, t, 53.9, (gg, x, y, w, h) => { gg.fillStyle = "#eef3f8"; gg.fillRect(x, y, w, h); gg.fillStyle = "#111"; gg.font = `800 32px ${FONT_TITLE}`; gg.textAlign = "center"; gg.fillText("МАМА", x + w / 2, y + 55);
        const msg = (yy, txt, me, t0) => { if (t < t0) return; gg.font = `700 30px ${FONT_TITLE}`; const ww = gg.measureText(txt).width + 40; gg.fillStyle = me ? "#7bd389" : "#fff"; gg.beginPath(); gg.roundRect(me ? x + w - ww - 20 : x + 20, yy, ww, 64, 18); gg.fill(); gg.fillStyle = "#111"; gg.textAlign = "left"; gg.fillText(txt, (me ? x + w - ww - 20 : x + 20) + 20, yy + 42); };
        msg(y + 110, "Маршрут: отель → музей", true, 54.3); msg(y + 200, "Я в отеле ✓", true, 55.4); msg(y + 290, "Умничка!", false, 56.3); }, { x: 690, y: 820 }); } },
  // 11. Аэропорт: всё готово, паспорт в руке
  { t0: 57.7, t1: 61.4, cam: [[57.7, [0.3, 1.05, 1.0], [0.25, 1.0, -0.8], 58], [61.4, [0.3, 1.05, 0.8], [0.25, 1.0, -0.8], 54]], focus: [0.25, 1.0, -0.8],
    build(sc, t) { airport(sc, t); suitcase(sc, [0.8, 0, -0.7]); drawActor(sc, t, gosha({ pos: [0.2, 0, -0.8], expr: [[57.7, "smug"], [59.5, "proud"]], ...HOLD_B, props: passProps })); tag(sc, [0.2, 1.75, -0.8], "ВСЁ ГОТОВО ✓", t, 59.6, { size: 54, bg: "#7bd389" }); } },
  // 12. Только билет на завтра
  { t0: 61.4, t1: TOTAL_T, cam: [[61.4, [0.5, 1.6, 1.8], [0.4, 2.0, -3.9], 58], [TOTAL_T, [0.45, 1.65, 1.5], [0.35, 2.2, -3.9], 54]], focus: [0.3, 2.9, -3.9],
    build(sc, t) { airport(sc, t, { board: pBoard([["РЕЙС", "ВЫЛЕТ"], ["SU 2450  ПАРИЖ", "30.10"], ["DL 116  РИМ", "29.10"], ["TK 412  СТАМБУЛ", "29.10"]], { hi: 1 }), boardKey: "board2" }); suitcase(sc, [0.8, 0, -0.7]);
      drawActor(sc, t, gosha({ pos: [0.2, 0, -0.8], expr: [[61.4, "proud"], [62.0, "blank"]], ...HOLD_B, props: passProps }));
      tag(sc, [0.3, 3.75, -3.9], "ЗАВТРА", t, 62.0, { size: 64, bg: "#ff6b6b", fg: "#fff" }); } },
] };
