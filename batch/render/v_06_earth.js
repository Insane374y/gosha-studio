// «Что если Гоша будет на улице, когда Земля остановится на секунду»
const ICE_HAND = { handF: [[0, -0.26, 0.88], [99, -0.26, 0.88]], bendF: [[0, -0.35]] };
const iceProps = (scoopUntil) => (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(-0.26, 0.93); drawIceCream(g, x, y, k * 1.4, t < scoopUntil); };
const lines = (g, t, a) => { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 18; i++) { const y = (i * 113) % H, x = ((t * 1800 + i * 300) % (W + 400)) - 200; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 160, y); g.stroke(); } g.restore(); };
const pBus = (g, w, h) => {   // борт автобуса с прозрачными окнами
  g.fillStyle = "#f2c230"; g.strokeStyle = "#20180f"; g.lineWidth = w * 0.008; g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, h * 0.12); g.fill(); g.stroke();
  for (let i = 0; i < 4; i++) { const x = w * (0.06 + i * 0.22), y = h * 0.14, ww = w * 0.18, hh = h * 0.42; g.clearRect(x, y, ww, hh); g.strokeRect(x, y, ww, hh); }
  g.fillStyle = "#20180f"; g.font = `900 ${h * 0.14}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("АВТОБУС 42", w * 0.5, h * 0.78);
  g.fillStyle = "#2a2d33"; for (const x of [0.18, 0.8]) { g.beginPath(); g.arc(w * x, h * 0.98, h * 0.15, Math.PI, 0); g.fill(); } };

window.VIDEO = { total: TOTAL_T, titleEnd: 3.6, title: ["ЗЕМЛЯ ОСТАНОВИТСЯ", "НА СЕКУНДУ"], shots: [
  // 0. Улица, Гоша с мороженым
  { t0: 0, t1: 4.1, cam: [[0, [0.1, 1.0, 1.2], [0.0, 1.0, -1.0], 60], [4.1, [0.1, 1.0, 0.9], [0.0, 1.0, -1.0], 56]], focus: [0, 1.0, -0.8],
    build(sc, t) { street(sc, t);
      drawActor(sc, t, gosha({ pos: [0, 0, -0.8], expr: [[0, "grin"], [2.0, "realize"]], ...ICE_HAND, props: iceProps(99) })); } },
  // 1. Всё спокойно
  { t0: 4.1, t1: 6.9, cam: [[4.1, [0.4, 1.2, 2.2], [0.0, 1.1, -1.5], 66], [6.9, [0.3, 1.2, 1.9], [0.0, 1.1, -1.5], 64]], focus: [0, 1.0, -0.8],
    build(sc, t) { street(sc, t);
      drawActor(sc, t, gosha({ pos: [0, 0, -0.8], expr: [[4.1, "smug"], [5.7, "proud"]], tongue: [[4.6, 0, 0], [4.8, 0.6, 0], [5.2, 0, 0], [5.4, 0.6, 0], [5.8, 0, 0]], mouth: [[4.6, ["open", 0.5]], [5.9, undefined]], ...ICE_HAND, props: iceProps(99) })); } },
  // 2. Ты несёшься на восток почти 1000 км/ч
  { t0: 6.9, t1: 15.8,
    screen(g, t) { spaceBg(g, t, 5); const rot = t * 0.25; drawGlobe(g, 540, 1050, 400, t, { rot });
      goshaSprite(g, 540, 660, 220, { expr: t < 12.3 ? "realize" : "smug", lookX: 0.6, handF: [-0.26, 0.88], bendF: -0.35 });
      if (t > 8.6) { const a = popScale(t, 8.6); g.save(); g.translate(540, 400); g.scale(a, a); g.fillStyle = "#f5c518"; g.strokeStyle = "#000"; g.lineWidth = 7; g.beginPath(); g.moveTo(-160, -24); g.lineTo(120, -24); g.lineTo(120, -60); g.lineTo(220, 0); g.lineTo(120, 60); g.lineTo(120, 24); g.lineTo(-160, 24); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#111"; g.font = `900 40px ${FONT_TITLE}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ВОСТОК", 0, 2); g.restore(); }
      if (t > 10.2) bubbleLabel(g, 540, 250, "≈ 1000 КМ/Ч", t, 10.2, { size: 84, bg: "#ff6b6b", fg: "#fff" });
      if (t > 13.0) bubbleLabel(g, 540, 1560, "ВМЕСТЕ С ЗЕМЛЁЙ", t, 13.0, { size: 56 }); } },
  // 3. Земля тормозит — а Гоша нет
  { t0: 15.8, t1: 18.7, cam: [[15.8, [0.6, 1.3, 2.6], [0.8, 1.1, -1.5], 68], [18.7, [0.9, 1.3, 2.4], [1.6, 1.2, -1.5], 68]], focus: [0.5, 1.0, -0.8],
    shake: (t) => (t > 16.4 && t < 17.6 ? 0.05 : 0),
    post: (g, t) => lines(g, t, ramp(t, 17.4, 17.7)),
    build(sc, t) { street(sc, t);
      drawActor(sc, t, gosha({ walk: [[15.8, 0, -0.8], [17.4, 0, -0.8], [18.7, 3.2, -0.8]], lift: [[17.4, 0, 0], [18.0, 0.8, 0], [18.7, 1.2, 0]], roll: [[17.4, 0, 0], [18.7, 0.9, 0]],
        expr: [[15.8, "smug"], [16.6, "nervous"], [17.4, "shock"]], bigEyes: [[17.4, true]], ...ICE_HAND, props: iceProps(99) }));
      tag(sc, [-1.0, 2.6, -1.5], "ЗЕМЛЯ: СТОП!", t, 16.4, { size: 64, bg: "#ff6b6b", fg: "#fff" }); } },
  // 4. Как в автобусе: тормоз — ты летишь вперёд
  { t0: 18.7, t1: 23.9, cam: [[18.7, [0.2, 1.4, 4.8], [0.0, 1.2, -1.0], 62], [23.9, [0.0, 1.4, 4.4], [-0.3, 1.2, -1.0], 60]], focus: [0, 1.2, -0.3],
    build(sc, t) { street(sc, t, { noCars: true });
      const bx = t < 21.4 ? 1.6 - (t - 18.7) * 0.6 : 1.6 - 2.7 * 0.6;
      const gx = t < 21.4 ? bx + 0.4 : t < 22.3 ? bx + 0.4 - (t - 21.4) * 0.3 : bx + 0.13 - (t - 22.3) * 2.2;
      drawActor(sc, t, gosha({ pos: [gx, 0.35, -0.55], lift: [[22.3, 0, 0], [23.1, 0.25, 0]], roll: [[21.4, 0, 0], [22.0, -0.25, 0], [23.1, -0.7, 0]],
        expr: [[18.7, "smug"], [19.9, "neutral"], [20.9, "realize"], [21.4, "shock"], [22.7, "nervous"]], bigEyes: [[21.4, true]] }));
      sc.decal([bx, 1.15, -0.2], 4.2, 2.1, 0, pBus, "bus", { frame: false, zb: -0.2 });
      for (const dx of [-1.3, 1.3]) sc.box([bx + dx, 0.15, -0.15], [0.3, 0.3, 0.1], "#20180f", { zb: -0.25, shadow: false });
      tag(sc, [bx - 1.5, 2.5, -0.2], "ТОРМОЗ!", t, 20.6, { size: 60, bg: "#ff6b6b", fg: "#fff", until: 22.2 });
      tag(sc, [gx - 0.2, 1.9, -0.55], "ВПЕРЁД!", t, 22.6, { size: 58, bg: "#f5c518" }); } },
  // 5. Целая планета: Гоша, машины, деревья, вода — всё на восток
  { t0: 23.9, t1: 31.2, cam: [[23.9, [-1.0, 1.6, 3.4], [0.5, 1.3, -1.5], 70], [31.2, [-0.6, 1.6, 3.0], [2.5, 1.3, -1.5], 70]], focus: [0.5, 1.2, -0.6],
    shake: (t) => (t > 26.2 ? 0.035 : 0), post: (g, t) => { lines(g, t, ramp(t, 26.3, 26.8));
      if (t > 27.8) { const k = ramp(t, 27.8, 29.0); g.save(); g.fillStyle = "rgba(60,140,230,0.75)"; g.strokeStyle = "#fff"; g.lineWidth = 8; g.beginPath(); g.moveTo(-50, H); for (let x = -50; x <= W + 50; x += 30) g.lineTo(x, H - 260 * k - Math.sin(x / 60 + t * 8) * 30 * k); g.lineTo(W + 50, H); g.closePath(); g.fill(); g.stroke(); g.restore(); } },
    build(sc, t) { const go = (t0) => (tt) => (tt < t0 ? 0 : (tt - t0) * (tt - t0) * 3.0);
      street(sc, t, { cars: [[(tt) => -2.5 + go(26.8)(tt), "#d6453d"], [(tt) => 3.0 + go(26.9)(tt), "#2f6fd6"]] });
      drawActor(sc, t, gosha({ walk: [[23.9, -0.2, -0.6], [26.3, -0.2, -0.6], [31.2, 7.0, -0.6]], lift: [[26.3, 0, 0], [27.0, 1.0, 0], [31.2, 1.6, 0]], roll: [[26.3, 0, 0], [31.2, 3.5, 0]],
        expr: [[23.9, "nervous"], [26.4, "shock"]], bigEyes: [[26.4, true]], ...ICE_HAND, props: iceProps(99) }));
      tag(sc, [-0.6, 2.8, -1.8], "ДЕРЕВЬЯ!", t, 27.3, { size: 50, until: 29.4 });
      tag(sc, [1.5, 3.0, -1.8], "ВСЁ → НА ВОСТОК", t, 29.5, { size: 60, bg: "#f5c518" }); } },
  // 6. Хорошая новость: так резко Земля не остановится
  { t0: 31.2, t1: 41.3, cam: [[31.2, [0.2, 1.2, 2.0], [0.0, 1.1, -1.5], 64], [41.3, [0.15, 1.15, 1.6], [0.0, 1.05, -1.5], 60]], focus: [0, 1.0, -0.8],
    build(sc, t) { street(sc, t);
      drawActor(sc, t, gosha({ pos: [0, 0, -0.8], expr: [[31.2, "nervous"], [32.2, "realize"], [33.7, "grin"], [36.1, "neutral"], [37.8, "realize"], [40.2, "proud"]], ...ICE_HAND, props: iceProps(99) }));
      tag(sc, [0.0, 1.65, -0.8], "ХОРОШАЯ НОВОСТЬ", t, 31.3, { size: 54, bg: "#7bd389", until: 34.4 }); },
    over(g, t) { if (t < 34.4) return; const a = popScale(t, 34.4); g.save(); g.translate(860, 330); g.scale(a, a); drawGlobe(g, 0, 0, 120, t * 0.15); g.restore();
      if (t > 35.4) bubbleLabel(g, 860, 520, "ОЧЕНЬ МЕДЛЕННО", t, 35.5, { size: 40 });
      if (t > 37.6) bubbleLabel(g, 520, 640, "+0,002 с за 100 лет", t, 37.8, { size: 60, bg: "#f5c518" }); } },
  // 7. Гоша выдыхает. Земля крутится
  { t0: 41.3, t1: 44.0, cam: [[41.3, [0.05, 1.0, 1.0], [0.0, 1.0, -0.8], 58], [44.0, [0.05, 1.0, 0.8], [0.0, 1.0, -0.8], 56]], focus: [0, 1.0, -0.8],
    build(sc, t) { street(sc, t);
      drawActor(sc, t, gosha({ pos: [0, 0, -0.8], expr: [[41.3, "proud"], [42.6, "grin"]], blinkHold: [[41.3, true], [42.4, false]], mouth: [[41.4, ["o", 0.5]], [42.3, undefined]], ...ICE_HAND, props: iceProps(99) })); } },
  // 8. А мороженое всё-таки упало. От испуга
  { t0: 44.0, t1: TOTAL_T, cam: [[44.0, [0.1, 0.9, 1.3], [-0.1, 0.7, -0.8], 60], [TOTAL_T, [0.1, 0.9, 1.1], [-0.1, 0.65, -0.8], 58]], focus: [-0.1, 0.8, -0.8],
    build(sc, t) { street(sc, t);
      const fallT = 44.6, land = 45.0;
      drawActor(sc, t, gosha({ pos: [0, 0, -0.8], expr: [[44.0, "grin"], [45.0, "shock"], [45.8, "blank"]], bigEyes: [[45.0, true]], ...ICE_HAND, props: iceProps(fallT) }));
      if (t > fallT) { const y = t < land ? 1.0 - ramp(t, fallT, land) * 0.98 : 0.02; sc.sprite([-0.32, y, -0.75], -0.1, (g, x, yy, k) => drawScoop(g, x, yy, k * 1.4, t >= land)); }
      tag(sc, [-0.3, 0.6, -0.75], "ПЛЮХ", t, 45.05, { size: 54, bg: "#f7a8c4" }); } },
] };
