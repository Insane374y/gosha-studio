// «Что если Гоша станет ростом с муравья» — макро-мир: предметы огромные, Гоша обычного размера
const puddleProps = (g, fx, ty, k, t, layer) => { if (layer !== "front") return; const [x, y] = loc(fx, ty, k)(0, 0.12); g.save(); g.fillStyle = "rgba(140,210,255,0.5)"; g.strokeStyle = "#2a6fb0"; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y + 0.08 * k, 0.75 * k, 0.24 * k, 0, Math.PI, 0); g.lineTo(x + 0.75 * k, y + 0.08 * k); g.ellipse(x, y + 0.08 * k, 0.75 * k, 0.12 * k, 0, 0, Math.PI); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(x - 0.4 * k, y - 0.04 * k, 0.15 * k, 0.04 * k, -0.3, 0, 7); g.fill(); g.restore(); };
function tableEdge(sc, t) {
  sc.plane([[-60, 0, -30], [60, 0, -30], [60, 0, 20], [-60, 0, 20]], "#cfe0e6", false);
  for (let x = -20; x < 30; x += 2.4) sc.bg.push({ pts: [[x, 0.002, -30], [x + 0.06, 0.002, -30], [x + 0.06, 0.002, 20], [x, 0.002, 20]], col: "rgba(80,110,120,0.35)", line: false });
  sc.plane([[-60, 0, -30], [60, 0, -30], [60, 40, -30], [-60, 40, -30]], "#f2c9a0", false);
  sc.box([-20, 4, -5], [40, 8, 30], "#b8784a", { zb: 0.5, shadow: false });
  sc.box([-2.5, 4, 8], [2, 8, 2], "#7a4a2c", { zb: 0.3 });
  sc.box([9, 6, -14], [6, 12, 6], "#2f8f9d", { zb: 0.5 });
}

window.VIDEO = { total: TOTAL_T, titleEnd: 2.5, title: ["ГОША СТАНЕТ", "РОСТОМ С МУРАВЬЯ"], shots: [
  // 0. Кухня: Гоша сжимается
  { t0: 0, t1: 2.7, cam: [[0, [0.6, 1.0, 1.0], [0.55, 0.85, -0.75], 60], [2.7, [0.6, 0.9, 0.7], [0.55, 0.75, -0.75], 56]], focus: [0.55, 0.9, -0.75],
    build(sc, t) { kitchen(sc, t, { noTable: true });
      drawActor(sc, t, gosha({ pos: [0.55, 0, -0.75], expr: [[0, "smug"], [1.8, "shock"]], bigEyes: [[1.8, true]], scale: [[0, 1, 0], [1.8, 1, 0], [2.4, 0.18, 0]] })); } },
  // 1. Падает со стола и спокойно встаёт
  { t0: 2.7, t1: 7.9, cam: [[2.7, [3.5, 9.2, 5.5], [-0.5, 8.6, 0], 62], [3.9, [3.5, 9.0, 5.5], [0.2, 8.4, 0], 62], [5.4, [3.2, 2.0, 5.5], [0.8, 1.0, 0], 62], [7.9, [3.0, 1.6, 4.6], [0.9, 0.9, 0], 58]], focus: [0.8, 1.0, 0],
    build(sc, t) { tableEdge(sc, t);
      const fall = ramp(t, 3.9, 5.4);
      drawActor(sc, t, gosha({ walk: [[2.7, -1.2, 0], [3.8, -0.1, 0], [5.4, 0.9, 0]], lift: [[2.7, 8, 0], [3.9, 8, 0], [5.4, 0, 0]],
        roll: [[3.9, 0, 0], [4.6, 2.6, 0], [5.3, 6.28, 0], [5.4, 0, 0]], expr: [[2.7, "smug"], [3.9, "shock"], [5.4, "realize"], [6.1, "proud"], [6.7, "grin"]], bigEyes: [[3.9, true], [5.4, false]] }));
      tag(sc, [0.9, 2.0, 0], "НИ ЦАРАПИНЫ", t, 6.8, { size: 60, bg: "#f5c518" }); } },
  // 2. Капля — как мяч, крошка — обед на неделю
  { t0: 7.9, t1: 14.2, cam: [[7.9, [0.2, 1.3, 4.0], [0.2, 1.0, -0.5], 70], [14.2, [0.2, 1.25, 3.5], [0.25, 1.0, -0.5], 68]], focus: [0.2, 1.0, -0.4],
    build(sc, t) { bigTable(sc, t);
      const db = t > 10.3 ? bonkAt(t, 10.3, 0.3) : 1, cb = t > 12.0 ? bonkAt(t, 12.0, 0.3) : 1;
      sc.sprite([-0.75, 0.42, -0.4], 0, (g, x, y, k) => drawDrop(g, x, y, 0.45 * k * db));
      sc.sprite([1.05, 0.45, -0.4], 0, (g, x, y, k) => drawCrumb(g, x, y, 0.9 * k * cb));
      drawActor(sc, t, gosha({ pos: [0.2, 0, -0.4], expr: [[7.9, "neutral"], [8.7, "realize"], [10.3, "shock"], [12.0, "grin"], [13.1, "laugh"]], look: [[7.9, 0], [10.3, -0.8], [12.0, 0.8]], bigEyes: [[10.3, true], [12.0, false]] }));
      tag(sc, [-0.75, 1.1, -0.4], "КАПЛЯ", t, 10.4, { size: 58, until: 12.0 });
      tag(sc, [0.7, 1.25, -0.4], "ОБЕД НА НЕДЕЛЮ", t, 12.9, { size: 52, bg: "#f5c518" }); } },
  // 3. Прыжок с пятого этажа
  { t0: 14.2, t1: 18.3, cam: [[14.2, [-0.6, 7.6, 5.0], [-2.2, 7.4, -3.6], 60], [15.1, [-0.6, 7.4, 5.0], [-2.2, 7.0, -3.6], 60], [17.0, [-0.7, 1.4, 4.0], [-2.2, 0.6, -3.0], 60], [18.3, [-0.8, 1.2, 3.5], [-2.2, 0.5, -3.0], 58]], focus: [-2.2, 1.0, -3.2],
    build(sc, t) { street(sc, t, { noCars: true });
      sc.box([-2.2, 4.5, -4.5], [3.6, 9.0, 1.8], "#8fb8de", { zb: 0.6 });
      sc.decal([-2.2, 4.6, -3.595], 3.4, 8.6, 0, pFacade("#8fb8de"), "tall", { frame: false, zb: 0.55 });
      sc.box([-2.2, 7.15, -3.4], [1.2, 0.08, 0.4], "#e8e3d6", { zb: 0.3 });
      drawActor(sc, t, gosha({ pos: [-2.2, 0, -3.25], lift: [[14.2, 7.2, 0], [15.0, 7.2, 0], [17.0, 0, 0]], scale: 0.35, roll: [[15.0, 0, 0], [16.0, 0.4, 0], [17.0, 0, 0]],
        expr: [[14.2, "smug"], [15.0, "laugh"], [15.9, "realize"], [17.0, "proud"]] }));
      tag(sc, [-0.9, 7.8, -3.6], "5 ЭТАЖ", t, 14.3, { size: 60, until: 16.0 });
      tag(sc, [-1.4, 1.2, -3.2], "КАК СО СТУПЕНЬКИ", t, 17.0, { size: 48, bg: "#f5c518" }); } },
  // 4. Почему: вес и сопротивление воздуха
  { t0: 18.3, t1: 23.6,
    screen(g, t) { g.fillStyle = "#cfe9f7"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#e8f6ff"; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(((i * 211) % 1080), 200 + ((i * 137) % 600), 70 + (i % 3) * 25, 0, 7); g.fill(); }
      const arrow = (x, y, len, up, col, label, t0) => { const s = popScale(t, t0); if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.strokeStyle = "#000"; g.lineWidth = 6; const d = up ? -1 : 1, w2 = Math.max(16, len * 0.12);
        g.beginPath(); g.moveTo(-w2 / 2, 0); g.lineTo(w2 / 2, 0); g.lineTo(w2 / 2, d * len * 0.7); g.lineTo(w2 * 1.2, d * len * 0.7); g.lineTo(0, d * len); g.lineTo(-w2 * 1.2, d * len * 0.7); g.lineTo(-w2 / 2, d * len * 0.7); g.closePath(); g.fill(); g.stroke();
        g.font = `900 40px ${FONT_TITLE}`; g.fillStyle = "#111"; g.textAlign = "center"; g.fillText(label, 0, d * (len + 40)); g.restore(); };
      if (t > 19.4) { goshaSprite(g, 290, 980, 620, { expr: t > 20.1 ? "nervous" : "neutral" }); bubbleLabel(g, 290, 330, "БОЛЬШОЙ", t, 19.5, { size: 50 }); arrow(290, 990, 250, false, "#ff6b6b", "ВЕС", 19.8); arrow(110, 640, 110, true, "#7cc8ff", "ВОЗДУХ", 21.5); }
      if (t > 20.1) { goshaSprite(g, 800, 900, 110, { expr: "smug" }); bubbleLabel(g, 800, 1010, "КРОХА", t, 20.2, { size: 50 }); arrow(800, 905, 50, false, "#ff6b6b", "ВЕС", 20.8); arrow(800, 820, 150, true, "#7cc8ff", "ВОЗДУХ", 21.6); }
      if (t > 22.5) bubbleLabel(g, 540, 1660, "ВОЗДУХ ТОРМОЗИТ КРОХУ", t, 22.5, { size: 50, bg: "#f5c518" }); } },
  // 5. Камень и листок
  { t0: 23.6, t1: 28.7, cam: [[23.6, [0.2, 1.6, 4.0], [0.3, 2.0, -1.0], 66], [28.7, [0.2, 1.5, 3.6], [0.3, 1.8, -1.0], 64]], focus: [0.0, 1.5, -0.5],
    shake: (t) => (t > 26.35 && t < 26.7 ? 0.03 : 0),
    build(sc, t) { street(sc, t, { noCars: true });
      drawActor(sc, t, gosha({ pos: [-0.45, 0, -0.6], expr: [[23.6, "neutral"], [24.4, "smug"], [26.4, "shock"], [27.1, "realize"], [27.8, "grin"]], look: [[23.6, 0.7]], bigEyes: [[26.4, true], [27.1, false]] }));
      const sy = t < 25.6 ? 4.5 : Math.max(0.25, 4.5 - 9.8 * Math.pow(t - 25.6, 2) * 0.8);
      sc.sprite([0.5, sy, -0.5], -0.02, (g, x, y, k) => drawStone(g, x, y, 0.4 * k));
      const lt = Math.max(0, t - 25.6), ly = Math.max(0.1, 4.6 - lt * 1.4), lx = 1.15 + Math.sin(lt * 3) * 0.35;
      sc.sprite([lx, ly, -0.5], -0.02, (g, x, y, k) => drawLeaf(g, x, y, 0.45 * k, Math.sin(lt * 3) * 0.6));
      tag(sc, [0.5, 1.0, -0.5], "БУМ!", t, 26.4, { size: 80, bg: "#ff6b6b", fg: "#fff", until: 27.4 });
      tag(sc, [lx, ly + 0.5, -0.5], "ПЛАВНО…", t, 27.2, { size: 46 }); } },
  // 6. Муравей падает медленно — удар слабее щелчка
  { t0: 28.7, t1: 32.5, cam: [[28.7, [0.3, 1.6, 3.4], [0.6, 1.6, -0.6], 64], [32.5, [0.3, 1.3, 3.0], [0.6, 1.0, -0.6], 60]], focus: [0.8, 1.0, -0.6],
    build(sc, t) { bigTable(sc, t);
      const ay = Math.max(0.12, 4.2 - ramp(t, 28.8, 31.5) * 4.1);
      sc.sprite([1.0, ay, -0.6], -0.02, (g, x, y, k) => drawAnt(g, x, y, 0.55 * k, t));
      drawActor(sc, t, gosha({ pos: [-0.3, 0, -0.5], expr: [[28.7, "realize"], [29.6, "neutral"], [31.6, "grin"]], look: [[28.7, 0.8]] }));
      tag(sc, [1.0, 0.8, -0.6], "тык", t, 31.6, { size: 46 }); } },
  // 7. Капля — ловушка, держит как клей
  { t0: 32.5, t1: 37.2, cam: [[32.5, [0.3, 1.2, 2.6], [0.0, 0.8, -0.5], 62], [37.2, [0.25, 1.1, 2.2], [0.0, 0.8, -0.5], 58]], focus: [0.0, 0.8, -0.5],
    build(sc, t) { bigTable(sc, t);
      drawActor(sc, t, gosha({ pos: [0.0, 0, -0.5], expr: [[32.5, "smug"], [33.8, "nervous"], [34.2, "shock"], [35.9, "nervous"]], bigEyes: [[34.2, true]], props: puddleProps }));
      tag(sc, [0.0, 1.65, -0.5], "ЛОВУШКА!", t, 34.0, { size: 64, bg: "#ff6b6b", fg: "#fff", until: 35.8 });
      tag(sc, [0.0, 1.65, -0.5], "КАК КЛЕЙ", t, 36.0, { size: 64, bg: "#f5c518" }); } },
  // 8. Тянет ногу. Тянет. Тянет.
  { t0: 37.2, t1: 40.4, cam: [[37.2, [0.2, 1.1, 2.0], [0.0, 0.8, -0.5], 58], [40.4, [0.15, 1.0, 1.7], [0.0, 0.75, -0.5], 54]], focus: [0.0, 0.8, -0.5],
    build(sc, t) { bigTable(sc, t);
      drawActor(sc, t, gosha({ pos: [0.0, 0, -0.5], expr: [[37.2, "stern"], [37.9, "holdlaugh"], [38.5, "shock"], [39.4, "holdlaugh"]], props: puddleProps,
        lean: [[37.2, 0, 0], [37.9, -0.18, 0], [38.2, 0, 0], [38.5, -0.2, 0], [38.8, 0, 0], [39.4, -0.24, 0], [39.8, 0, 0]],
        handF: [[37.2, ...REST_FM], [37.5, -0.42, HZ + 0.1], [40.4, -0.42, HZ + 0.1]], handB: [[37.2, ...REST_BM], [37.5, 0.42, HZ + 0.1], [40.4, 0.42, HZ + 0.1]], bendF: [[37.2, -0.3]], bendB: [[37.2, 0.3]] }));
      for (const [tt, txt] of [[37.9, "ТЯНЕТ"], [38.5, "ТЯНЕТ!"], [39.4, "ТЯНЕТ!!"]]) tag(sc, [0.0, 1.62, -0.5], txt, t, tt, { size: 58, until: tt + 0.6 }); } },
  // 9. Спрыгнуть было легко, а выбраться из лужи — нет
  { t0: 40.4, t1: TOTAL_T, cam: [[40.4, [1.2, 1.6, 4.2], [-0.6, 1.8, -2.0], 66], [TOTAL_T, [1.1, 1.5, 3.8], [-0.6, 1.6, -2.0], 64]], focus: [0.0, 0.9, -0.5],
    build(sc, t) { bigTable(sc, t);
      drawActor(sc, t, gosha({ pos: [0.0, 0, -0.5], expr: [[40.4, "smug"], [41.5, "proud"], [42.1, "nervous"], [43.4, "blank"]], look: [[40.4, -0.7], [42.1, 0]], props: puddleProps })); } },
] };
