// Инфографика: всплывающие карточки с графиками, столбиками, счётчиками и шкалами — поверх сцены, в стиле канала
// (белая карточка, чёрный контур, как плашки bubbleLabel). Вставлять в нужные моменты: когда голос называет
// число, сравнение или процесс. Карточка «выпрыгивает» в t0 и прячется в o.until; свуш ставится автоматически
// (tools/sound.py ловит infoCard так же, как bubbleLabel). Светящиеся точки графиков идут в световой слой.
const INFO = { card: "#fffaf0", ink: "#20180f", title: "#20180f", muted: "#8a7f72", grid: "rgba(32,24,15,0.12)", hot: "#e8603c", cold: "#3d9be9", gold: "#f2b84b", green: "#3aa676" };
const easeOut = (k) => 1 - Math.pow(1 - clamp(k, 0, 1), 3);

// Карточка: заголовок + содержимое draw(g, x, y, w, h, k) во внутренней области; k — прогресс появления 0..1.
//   infoCard(g, cx, cy, "TEMPERATURE", t, t0, { w, h, until, draw })
function infoCard(g, cx, cy, txt, t, t0, o = {}) {
  if (t < t0 || (o.until != null && t > o.until + 0.25)) return;
  const inK = easeOutBack(clamp((t - t0) / 0.35, 0, 1), 2.0), outK = o.until != null ? 1 - clamp((t - o.until) / 0.25, 0, 1) : 1, s = Math.max(0.01, inK * outK);
  const w = o.w ?? 860, h = o.h ?? 520, x = -w / 2, y = -h / 2, head = txt ? 92 : 0;
  g.save(); g.translate(cx, cy); g.scale(s, s); g.rotate(o.tilt ?? -0.015);
  g.fillStyle = "rgba(0,0,0,0.28)"; g.beginPath(); g.roundRect(x + 10, y + 14, w, h, 34); g.fill();
  g.fillStyle = INFO.card; g.strokeStyle = INFO.ink; g.lineWidth = 7; g.beginPath(); g.roundRect(x, y, w, h, 34); g.fill(); g.stroke();
  if (txt) { g.font = `900 50px ${FONT_TITLE}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = INFO.title; g.fillText(txt.toUpperCase(), 0, y + 58); }
  if (o.draw) o.draw(g, x + 40, y + head + 20, w - 80, h - head - 50, clamp((t - t0 - 0.2) / (o.dur ?? 1.4), 0, 1), t);
  if (o.note) { g.font = `700 26px ${FONT_TITLE}`; g.textAlign = "right"; g.fillStyle = INFO.muted; g.fillText(o.note, -x - 30, -y - 18); }
  g.restore();
}
// График-линия внутри карточки: pts = [[подпись, значение], …]; рисуется слева направо по k.
function chartLine(g, x, y, w, h, pts, k, o = {}) {
  const vals = pts.map((p) => p[1]), lo = o.min ?? Math.min(...vals), hi = o.max ?? Math.max(...vals);
  const X = (i) => x + 30 + ((w - 60) * i) / (pts.length - 1), Y = (v) => y + 20 + (h - 110) * (1 - (v - lo) / (hi - lo || 1));
  g.strokeStyle = INFO.grid; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 4; i++) { const yy = y + 20 + ((h - 110) * i) / 3; g.moveTo(x, yy); g.lineTo(x + w, yy); } g.stroke();
  const n = (pts.length - 1) * easeOut(k), last = Math.floor(n), frac = n - last;
  const colAt = (v) => (typeof o.color === "function" ? o.color(v) : (o.color ?? INFO.hot));
  const lg = g.createLinearGradient(X(0), 0, X(pts.length - 1), 0); vals.forEach((v, i) => lg.addColorStop(i / (pts.length - 1), colAt(v)));
  g.strokeStyle = lg; g.lineWidth = 9; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(X(0), Y(vals[0]));
  for (let i = 1; i <= last; i++) g.lineTo(X(i), Y(vals[i]));
  let hx = X(last), hy = Y(vals[last]);
  if (last < pts.length - 1) { hx = X(last) + (X(last + 1) - X(last)) * frac; hy = Y(vals[last]) + (Y(vals[last + 1]) - Y(vals[last])) * frac; g.lineTo(hx, hy); }
  g.stroke();
  pts.forEach(([label, v], i) => { if (i > n + 0.01) return;
    const c = colAt(v);
    g.fillStyle = c; g.strokeStyle = INFO.ink; g.lineWidth = 4; g.beginPath(); g.arc(X(i), Y(v), 15, 0, 7); g.fill(); g.stroke();
    g.font = `900 40px ${FONT_TITLE}`; g.textAlign = "center"; g.fillStyle = c; if (!o.noValues) g.fillText((o.fmt ? o.fmt(v) : v), X(i), Y(v) - 42);
    g.font = `800 32px ${FONT_TITLE}`; g.fillStyle = INFO.muted; g.fillText(label, X(i), y + h - 30); });
  const m = g.getTransform(), p = m.transformPoint(new DOMPoint(hx, hy)); emitGlow(p.x, p.y, 70, "#ffe2a8", 0.7);
}
// Столбики: bars = [[подпись, значение, цвет?, текст над столбиком?], …]; растут по k,
// или каждый в своё время: o.at = [t0, t1, …] + o.t (время кадра) — чтобы совпадать с голосом.
function chartBars(g, x, y, w, h, bars, k, o = {}) {
  const hi = o.max ?? Math.max(...bars.map((b) => b[1])), bw = (w / bars.length) * 0.6;
  bars.forEach(([label, v, col], i) => {
    const kk = o.at ? easeOut(clamp((o.t - o.at[i]) / 0.6, 0, 1)) : easeOut(clamp(k * 1.4 - i * 0.15, 0, 1)), bh = (h - 120) * (v / hi) * kk, bx = x + (w / bars.length) * (i + 0.2), by = y + h - 70 - bh;
    g.fillStyle = col ?? INFO.gold; g.strokeStyle = INFO.ink; g.lineWidth = 5; g.beginPath(); g.roundRect(bx, by, bw, bh, 10); g.fill(); if (bh > 4) g.stroke();
    g.font = `900 40px ${FONT_TITLE}`; g.textAlign = "center"; g.fillStyle = INFO.ink; if (kk > 0.2) g.fillText(bars[i][3] ?? (o.fmt ? o.fmt(v * kk) : Math.round(v * kk)), bx + bw / 2, by - 24);
    g.font = `800 32px ${FONT_TITLE}`; g.fillStyle = INFO.muted; g.fillText(label, bx + bw / 2, y + h - 28); });
}
// Крупное число, которое набегает от from до to (деньги, проценты, градусы) — внутри карточки или само по себе.
function infoCounter(g, x, y, from, to, k, o = {}) {
  const v = from + (to - from) * easeOut(k), txt = (o.prefix ?? "") + (o.fmt ? o.fmt(v) : Math.round(v).toLocaleString("en-US")) + (o.suffix ?? "");
  g.font = `900 ${o.size ?? 140}px ${FONT_TITLE}`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  g.lineWidth = 14; g.strokeStyle = INFO.ink; g.strokeText(txt, x, y); g.fillStyle = o.color ?? INFO.gold; g.fillText(txt, x, y);
}
// Шкала-прогресс: value 0..1 (доля, риск, заряд); цвет и подпись по желанию.
function infoMeter(g, x, y, w, h, value, k, o = {}) {
  g.fillStyle = "#efe6d6"; g.strokeStyle = INFO.ink; g.lineWidth = 5; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.fill();
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.clip(); g.fillStyle = o.color ?? INFO.green; g.fillRect(x, y, w * clamp(value, 0, 1) * easeOut(k), h); g.restore();
  g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.stroke();
}
