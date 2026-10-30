// Turnaround: человечек-дудл в любом ракурсе (поворот вокруг вертикали) + кот Бублик в 4 ракурсах.
// Голова — сфера: волосы, глаза, очки, пластырь заданы точками на сфере и проецируются с учётом поворота.
const TI = "#2a1d1a";
const TW = 0.27, TH = 0.36, THIP = 0.4, TR = 0.27, THEAD = THIP + TH + TR * 0.78;
const tshade = (hex, k) => { const n = parseInt(hex.slice(1), 16); return `rgb(${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k)).join(",")})`; };

// a — угол поворота (0 = анфас, π/2 = профиль, π = спина). Персонаж поворачивается лицом влево экрана.
function drawPerson(g, look, cx, base, S, a) {
  const dir = -1, ca = Math.cos(a), sa = Math.sin(a);
  const P = (x, y, z) => [cx + (x * ca + z * sa * dir) * S, base - y * S, -x * sa * dir + z * ca]; // тело: метры
  const L = (w, col = TI) => { g.strokeStyle = col; g.lineWidth = w * S; };
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  // тень
  g.fillStyle = "rgba(0,0,0,0.16)"; g.beginPath(); g.ellipse(cx, base, TW * 0.95 * S, 0.035 * S, 0, 0, Math.PI * 2); g.fill();
  const bw = TW * (1 - 0.12 * Math.abs(sa));
  // ноги и стопы
  const legs = [-1, 1].map((s) => ({ s, hip: P(s * TW * 0.2, THIP + 0.05, s * 0.02), foot: P(s * 0.08, 0.03, s * 0.045), toe: P(s * 0.08, 0.022, s * 0.045 + 0.035) })).sort((p, q) => p.foot[2] - q.foot[2]);
  for (const l of legs) {
    L(0.032); g.beginPath(); g.moveTo(l.hip[0], l.hip[1]); g.lineTo(l.foot[0], l.foot[1]); g.stroke();
    const rx = 0.05 * (0.75 + 0.45 * Math.abs(sa)) * S;
    g.fillStyle = look.shoes ?? TI; L(0.01);
    g.beginPath(); g.ellipse(l.toe[0], l.toe[1], rx, 0.026 * S, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  }
  // руки (дальняя — за телом, ближняя — поверх)
  const arms = [-1, 1].map((s) => ({ sh: P(s * TW * 0.44, THIP + TH * 0.7, 0), hd: P(s * 0.2, THIP + 0.06, 0.02) }));
  const arm = (m) => {
    L(0.032); g.beginPath(); g.moveTo(m.sh[0], m.sh[1]); g.quadraticCurveTo((m.sh[0] + m.hd[0]) / 2 + (m.hd[0] > cx ? 0.03 : -0.03) * S * Math.max(0.2, Math.abs(ca)), (m.sh[1] + m.hd[1]) / 2, m.hd[0], m.hd[1]); g.stroke();
    g.fillStyle = TI; g.beginPath(); g.arc(m.hd[0], m.hd[1], 0.05 * S, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(m.hd[0] - 0.017 * S, m.hd[1] - 0.017 * S, 0.009 * S, 0.006 * S, 0.6, 0, Math.PI * 2); g.fill();
  };
  const backArms = arms.filter((m) => m.hd[2] < -0.005), frontArms = arms.filter((m) => m.hd[2] >= -0.005);
  // рюкзак: коробка за спиной
  let pack = null;
  if (look.backpack) {
    const c = P(0, THIP + 0.19, -(bw * 0.5 + 0.06));
    const w = (bw * 0.95 * Math.abs(ca) + 0.13 * Math.abs(sa)) * S, h = 0.3 * S;
    pack = { x: c[0], y: c[1], w, h, front: c[2] >= 0 };
  }
  const drawPack = () => {
    g.fillStyle = look.backpack; L(0.022);
    g.beginPath(); g.roundRect(pack.x - pack.w / 2, pack.y - pack.h / 2, pack.w, pack.h, Math.min(pack.w, pack.h) * 0.28); g.fill(); g.stroke();
    if (pack.front) { // вид сзади: карман, молния, ручка
      g.fillStyle = tshade(look.backpack, 0.8); L(0.012);
      g.beginPath(); g.roundRect(pack.x - pack.w * 0.32, pack.y, pack.w * 0.64, pack.h * 0.38, pack.w * 0.1); g.fill(); g.stroke();
      L(0.008, "#f2c230"); g.beginPath(); g.moveTo(pack.x - pack.w * 0.25, pack.y + pack.h * 0.06); g.lineTo(pack.x + pack.w * 0.25, pack.y + pack.h * 0.06); g.stroke();
      L(0.014); g.beginPath(); g.arc(pack.x, pack.y - pack.h / 2, pack.w * 0.12, Math.PI, Math.PI * 2); g.stroke();
    } else if (Math.abs(sa) > 0.9) { // профиль: боковой карман
      g.fillStyle = tshade(look.backpack, 0.8); L(0.01);
      g.beginPath(); g.roundRect(pack.x - pack.w * 0.3, pack.y + pack.h * 0.05, pack.w * 0.6, pack.h * 0.3, pack.w * 0.12); g.fill(); g.stroke();
    }
  };
  if (pack && !pack.front) drawPack();
  backArms.forEach(arm);
  // тело
  const bl = cx - (bw / 2) * S, bt = base - (THIP + TH) * S, bW = bw * S, bH = TH * S;
  const body = () => { g.beginPath(); g.roundRect(bl, bt, bW, bH, bW * 0.45); };
  g.fillStyle = look.body; body(); g.fill();
  g.save(); body(); g.clip();
  g.fillStyle = tshade(look.body, 0.62); g.fillRect(bl + bW * 0.7, bt, bW, bH);
  if (look.stripe) { g.fillStyle = look.stripe; g.fillRect(bl, bt + bH * 0.38, bW, bH * 0.2); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(bl + bW * 0.7, bt + bH * 0.38, bW, bH * 0.2); }
  g.restore();
  L(0.028); body(); g.stroke();
  // воротник: V спереди, дуга сзади
  if (ca > 0.3) {
    const vx = cx + dir * sa * bw * 0.35 * S, vw = TW * 0.2 * ca * S;
    g.fillStyle = "#f7f7f2"; L(0.01);
    g.beginPath(); g.moveTo(vx - vw, bt); g.lineTo(vx, bt + bH * 0.38 * Math.min(1, ca + 0.2)); g.lineTo(vx + vw, bt); g.closePath(); g.fill(); g.stroke();
  } else if (ca < -0.3) { L(0.01); g.beginPath(); g.arc(cx, bt - bH * 0.02, bW * 0.22, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }
  // лямки рюкзака на груди
  if (look.backpack && !pack.front) for (const s of [-1, 1]) {
    const p = P(s * bw * 0.3, THIP + TH * 0.6, bw * 0.5);
    if (p[2] <= 0.02) continue;
    const sw = bw * 0.12 * S * Math.max(0.45, Math.abs(ca));
    g.fillStyle = tshade(look.backpack, 0.85); L(0.012);
    g.beginPath(); g.roundRect(p[0] - sw / 2, bt, sw, bH * 0.62, sw * 0.4); g.fill(); g.stroke();
  }
  if (pack && pack.front) drawPack();
  drawHead(g, look, cx, base - THEAD * S, TR * S, a, dir);
  frontArms.forEach(arm);
  g.restore();
}

function drawHead(g, look, hx, hy, r, a, dir) {
  const ca = Math.cos(a), sa = Math.sin(a);
  const Q = (x, y, z) => [hx + (x * ca + z * sa * dir) * r, hy - y * r, -x * sa * dir + z * ca]; // голова: в радиусах
  const L = (w, col = TI) => { g.strokeStyle = col; g.lineWidth = w * r / 0.27; };
  // ---- волосы: точки на сфере
  const pts = [];
  const hairType = look.hair;
  const els = [-30, -15, 0, 15, 30, 45, 60, 75, 90];
  for (const e of els) {
    const n = e === 90 ? 1 : Math.max(6, Math.round(14 * Math.cos((e * Math.PI) / 180)));
    for (let i = 0; i < n; i++) {
      const al = (i / n) * Math.PI * 2 + (e % 30 ? 0.2 : 0);
      const er = (e * Math.PI) / 180;
      const x = Math.cos(er) * Math.sin(al), z = Math.cos(er) * Math.cos(al), y = Math.sin(er);
      const front = (1 + Math.cos(al)) / 2;
      const ymin = hairType === "curly" ? -0.4 + 1.12 * Math.pow(front, 0.6) : -0.45 + 1.05 * Math.pow(front, 0.6);
      if (y >= ymin) pts.push([x * 1.04, y * 1.04, z * 1.04, hairType === "curly" ? 0.27 : 0.26]);
    }
  }
  if (hairType === "long") for (let y = -0.25; y >= -1.15; y -= 0.15) for (let k = -4; k <= 4; k++) {
    const al = Math.PI + k * 0.3; pts.push([Math.sin(al) * 0.92, y, Math.cos(al) * 0.55 - 0.2, 0.24]);
  }
  const hc = look.hairColor ?? "#1b1615";
  const proj = pts.map(([x, y, z, rr]) => { const q = Q(x, y, z); return [q[0], q[1], q[2], rr * r]; });
  const layer = (list, curl) => {
    g.fillStyle = TI; for (const [x, y, , rr] of list) { g.beginPath(); g.arc(x, y, rr + 0.014 * r / 0.27, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = hc; for (const [x, y, , rr] of list) { g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill(); }
    if (curl) { g.strokeStyle = tshade(hc, 0.55); g.lineWidth = 0.008 * r / 0.27;
      for (const [x, y, , rr] of list) { g.beginPath(); g.arc(x + rr * 0.1, y + rr * 0.1, rr * 0.5, Math.PI * 0.2, Math.PI * 1.1); g.stroke(); } }
  };
  const back = proj.filter((p) => p[2] < 0).sort((p, q) => p[2] - q[2]);
  const front = proj.filter((p) => p[2] >= 0).sort((p, q) => p[2] - q[2]);
  // бантик
  const bowP = look.bow ? Q(0.62, 0.72, 0.1) : null;
  const drawBow = () => {
    const sc = Math.max(0.35, Math.abs(Math.cos(a - 0.2)));
    g.fillStyle = look.bow; L(0.014);
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(bowP[0], bowP[1]); g.lineTo(bowP[0] + s * r * 0.3 * sc, bowP[1] - r * 0.2); g.lineTo(bowP[0] + s * r * 0.3 * sc, bowP[1] + r * 0.2); g.closePath(); g.fill(); g.stroke(); }
    g.beginPath(); g.arc(bowP[0], bowP[1], r * 0.08, 0, Math.PI * 2); g.fill(); g.stroke();
  };
  if (bowP && bowP[2] < -0.15) drawBow();
  layer(back, hairType === "curly");
  // ---- лицо-круг
  g.fillStyle = "#f5f1ea"; g.beginPath(); g.arc(hx, hy, r, 0, Math.PI * 2); g.fill();
  g.save(); g.beginPath(); g.arc(hx, hy, r, 0, Math.PI * 2); g.clip();
  g.fillStyle = "#d8d2c8"; g.beginPath(); g.arc(hx, hy, r, 0, Math.PI * 2); g.arc(hx - r * 0.1, hy - r * 0.08, r * 0.82, 0, Math.PI * 2, true); g.fill("evenodd");
  g.restore();
  L(0.028); g.beginPath(); g.arc(hx, hy, r, 0, Math.PI * 2); g.stroke();
  // ---- черты лица (только видимые)
  const fa = a * 0.78, fc = Math.cos(fa), fs = Math.sin(fa);
  const Qf = (x, y, z) => [hx + (x * fc + z * fs * dir) * r, hy - y * r, -x * fs * dir + z * fc];
  const eyes = [-1, 1].map((s) => { const q = Qf(s * 0.34, 0.02, 0.94); return { s, q, k: Math.max(0.32, q[2]) }; }).filter((e) => e.q[2] > 0.2);
  for (const e of eyes) {
    g.fillStyle = TI; g.beginPath(); g.ellipse(e.q[0], e.q[1], r * 0.095 * e.k, r * 0.13, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(e.q[0] - r * 0.03 * e.k, e.q[1] - r * 0.05, r * 0.03 * e.k, r * 0.035, 0, 0, Math.PI * 2); g.fill();
    L(0.028); g.beginPath(); g.moveTo(e.q[0] - r * 0.14 * e.k, e.q[1] - r * 0.27); g.lineTo(e.q[0] + r * 0.14 * e.k, e.q[1] - r * 0.29); g.stroke();
  }
  const m = Qf(0, -0.45, 0.89);
  if (m[2] > 0.15) { const k = Math.max(0.35, m[2]); L(0.018); g.beginPath(); g.moveTo(m[0] - r * 0.16 * k, m[1] - r * 0.03); g.quadraticCurveTo(m[0], m[1] + r * 0.09, m[0] + r * 0.16 * k, m[1] - r * 0.03); g.stroke(); }
  if (look.plaster) { const p = Qf(0.5, -0.4, 0.77); if (p[2] > 0.15) { const k = Math.max(0.4, p[2]);
    g.save(); g.translate(p[0], p[1]); g.rotate(-0.45); g.scale(k, 1);
    g.fillStyle = "#f2c79a"; L(0.01); g.beginPath(); g.roundRect(-r * 0.2, -r * 0.07, r * 0.4, r * 0.14, r * 0.06); g.fill(); g.stroke();
    g.fillStyle = "#e0a877"; g.fillRect(-r * 0.06, -r * 0.06, r * 0.12, r * 0.12); g.restore(); } }
  if (look.glasses) {
    const gr = r * 0.25;
    L(0.022, look.glasses); g.fillStyle = "rgba(200,230,255,0.25)";
    for (const e of eyes) { g.beginPath(); g.ellipse(e.q[0], e.q[1], gr * e.k, gr, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
    if (eyes.length === 2) { const [l, rr] = eyes[0].q[0] < eyes[1].q[0] ? eyes : [eyes[1], eyes[0]];
      g.beginPath(); g.moveTo(l.q[0] + gr * l.k, l.q[1] - r * 0.04); g.quadraticCurveTo((l.q[0] + rr.q[0]) / 2, l.q[1] - r * 0.12, rr.q[0] - gr * rr.k, rr.q[1] - r * 0.04); g.stroke(); }
    for (const s of [-1, 1]) { const st = Qf(s * 0.58, 0.0, 0.8), en = Qf(s * 0.98, 0.06, -0.15);
      if (st[2] > 0.05 && (en[2] > -0.4)) { g.beginPath(); g.moveTo(st[0], st[1]); g.lineTo(en[0], en[1]); g.stroke(); } }
    if (Math.abs(sa) > 0.95) { const st = Qf(0, 0, 1); L(0.022, look.glasses); g.beginPath(); g.moveTo(st[0], st[1]); g.lineTo(st[0] + dir * r * 0.06, st[1] - r * 0.03); g.stroke(); }
  }
  layer(front, hairType === "curly");
  if (bowP && bowP[2] >= -0.15) drawBow();
}

// Кот Бублик в 4 ракурсах (сидит). view: front | q34 | side | back
function drawCatView(g, x, y, s, view) {
  const L = (w, c = TI) => { g.lineWidth = w * s; g.strokeStyle = c; };
  const OR = "#e8873a", DK = "#a9521c", CR = "#fbf3e4";
  g.save(); g.translate(x, y); g.lineCap = "round"; g.lineJoin = "round";
  g.fillStyle = "rgba(0,0,0,0.16)"; g.beginPath(); g.ellipse(0, 0, 78 * s, 10 * s, 0, 0, Math.PI * 2); g.fill();
  const tail = (pts) => { L(16); g.beginPath(); g.moveTo(...pts[0]); g.bezierCurveTo(...pts[1], ...pts[2], ...pts[3]); g.stroke(); L(10, OR); g.stroke();
    L(4, DK); g.setLineDash([6 * s, 12 * s]); g.stroke(); g.setLineDash([]); };
  const ear = (bx, by, tx, ty, ex, ey, inner = true) => {
    g.fillStyle = OR; L(5); g.beginPath(); g.moveTo(bx, by); g.lineTo(tx, ty); g.lineTo(ex, ey); g.closePath(); g.fill(); g.stroke();
    if (inner) { g.fillStyle = "#f2a9a0"; g.beginPath(); g.moveTo(bx + (ex - bx) * 0.25, by + (ey - by) * 0.25); g.lineTo(tx + (bx + ex - 2 * tx) * 0.18, ty + (by + ey - 2 * ty) * 0.22); g.lineTo(bx + (ex - bx) * 0.8, by + (ey - by) * 0.8); g.closePath(); g.fill(); }
  };
  const eye = (ex, ey, k = 1) => { g.fillStyle = TI; g.beginPath(); g.ellipse(ex, ey, 8 * s * k, 7 * s, 0, 0, Math.PI * 2); g.fill(); L(4); g.beginPath(); g.moveTo(ex - 10 * s * k, ey - 5 * s); g.lineTo(ex + 10 * s * k, ey - 5 * s); g.stroke(); };
  const stripes = (cx, cy, rad, from, to, n = 3) => { L(6, DK); for (let i = 0; i < n; i++) { const a = from + ((to - from) * (i + 0.5)) / n; g.beginPath(); g.arc(cx, cy, rad, a - 0.12, a + 0.12); g.stroke(); } };
  const hy = -120 * s;
  if (view === "front" || view === "q34") {
    const q = view === "q34", sh = q ? -14 * s : 0; // сдвиг морды влево
    if (true) tail(q ? [[40 * s, -22 * s], [115 * s, -20 * s], [115 * s, -105 * s], [78 * s, -118 * s]] : [[45 * s, -25 * s], [110 * s, -30 * s], [105 * s, -110 * s], [70 * s, -115 * s]]);
    g.fillStyle = OR; L(5); g.beginPath(); g.ellipse(q ? 6 * s : 0, -48 * s, (q ? 62 : 58) * s, 48 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = CR; g.beginPath(); g.ellipse(-5 * s + sh * 1.2, -38 * s, (q ? 22 : 28) * s, 32 * s, 0, 0, Math.PI * 2); g.fill();
    stripes(30 * s, -50 * s, 30 * s, -0.4, 0.4);
    g.fillStyle = CR; L(4); for (const dx of q ? [-30, 0] : [-25, 12]) { g.beginPath(); g.ellipse(dx * s, -6 * s, 15 * s, 9 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
    ear(-18 * s + sh, hy - 38 * s, -46 * s + sh * 0.5, hy - 70 * s, -50 * s + sh * 0.3, hy - 18 * s);
    ear(18 * s + sh * 1.4, hy - 38 * s, (q ? 40 : 46) * s, hy - 70 * s, 50 * s, hy - 18 * s);
    g.fillStyle = OR; L(5); g.beginPath(); g.ellipse(0, hy, 55 * s, 46 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    L(6, DK); for (const dx of [-12, 0, 12]) { g.beginPath(); g.moveTo(dx * s + sh * 0.5, hy - 44 * s); g.lineTo(dx * 0.8 * s + sh * 0.5, hy - 28 * s); g.stroke(); }
    g.fillStyle = CR; g.beginPath(); g.ellipse(sh * 1.3, hy + 18 * s, (q ? 22 : 26) * s, 18 * s, 0, 0, Math.PI * 2); g.fill();
    eye(-21 * s + sh * 1.3, hy - 2 * s, q ? 0.8 : 1); eye(21 * s + sh * 1.1, hy - 2 * s, q ? 0.9 : 1);
    const nx = sh * 1.4;
    g.fillStyle = "#e46b78"; g.beginPath(); g.moveTo(nx - 6 * s, hy + 10 * s); g.lineTo(nx + 6 * s, hy + 10 * s); g.lineTo(nx, hy + 17 * s); g.closePath(); g.fill();
    L(3.5); g.beginPath(); g.moveTo(nx, hy + 17 * s); g.quadraticCurveTo(nx - 6 * s, hy + 26 * s, nx - 13 * s, hy + 20 * s); g.moveTo(nx, hy + 17 * s); g.quadraticCurveTo(nx + 6 * s, hy + 26 * s, nx + 13 * s, hy + 20 * s); g.stroke();
    L(2.5); for (const sx of [-1, 1]) for (const dy of [-3, 6]) { g.beginPath(); g.moveTo(nx + sx * 28 * s, hy + 14 * s); g.lineTo(nx + sx * (q && sx > 0 ? 58 : 72) * s, hy + (14 + dy * 2) * s); g.stroke(); }
    L(4); g.fillStyle = "#2f6fd6"; g.beginPath(); g.roundRect(-34 * s, hy + 38 * s, 68 * s, 10 * s, 5 * s); g.fill(); g.stroke();
    g.fillStyle = "#e6b25a"; g.beginPath(); g.arc(sh, hy + 56 * s, 10 * s, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OR; g.beginPath(); g.arc(sh, hy + 56 * s, 3.5 * s, 0, 7); g.fill(); g.stroke();
  } else if (view === "side") { // профиль, морда влево
    tail([[55 * s, -18 * s], [125 * s, -10 * s], [120 * s, -100 * s], [92 * s, -120 * s]]);
    g.fillStyle = OR; L(5); g.beginPath(); g.ellipse(18 * s, -50 * s, 62 * s, 50 * s, -0.15, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = CR; g.beginPath(); g.ellipse(-28 * s, -42 * s, 16 * s, 30 * s, 0.15, 0, Math.PI * 2); g.fill();
    stripes(30 * s, -55 * s, 34 * s, -1.9, -0.6, 4);
    g.fillStyle = CR; L(4); g.beginPath(); g.ellipse(-30 * s, -6 * s, 18 * s, 9 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(40 * s, -8 * s, 22 * s, 10 * s, 0, 0, Math.PI * 2); g.fillStyle = OR; g.fill(); g.stroke();
    ear(-6 * s, hy - 40 * s, 8 * s, hy - 74 * s, 24 * s, hy - 32 * s);
    g.fillStyle = OR; L(5); g.beginPath(); g.ellipse(-6 * s, hy, 48 * s, 44 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = OR; L(5); g.beginPath(); g.ellipse(-42 * s, hy + 14 * s, 18 * s, 15 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = OR; g.beginPath(); g.ellipse(-30 * s, hy + 10 * s, 18 * s, 18 * s, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = CR; g.beginPath(); g.ellipse(-44 * s, hy + 20 * s, 12 * s, 8 * s, 0, 0, Math.PI * 2); g.fill();
    L(6, DK); for (const dx of [0, 14]) { g.beginPath(); g.moveTo(dx * s, hy - 42 * s); g.lineTo(dx * s + 2 * s, hy - 26 * s); g.stroke(); }
    stripes(0, hy + 4 * s, 40 * s, -0.5, 0.4, 2);
    eye(-30 * s, hy - 4 * s, 0.7);
    g.fillStyle = "#e46b78"; g.beginPath(); g.ellipse(-58 * s, hy + 9 * s, 5 * s, 4 * s, 0, 0, Math.PI * 2); g.fill();
    L(3.5); g.beginPath(); g.moveTo(-56 * s, hy + 14 * s); g.quadraticCurveTo(-50 * s, hy + 24 * s, -40 * s, hy + 20 * s); g.stroke();
    L(2.5); for (const dy of [-2, 6]) { g.beginPath(); g.moveTo(-44 * s, hy + 14 * s); g.lineTo(-92 * s, hy + (14 + dy * 2) * s); g.stroke(); }
    L(4); g.fillStyle = "#2f6fd6"; g.beginPath(); g.roundRect(-40 * s, hy + 34 * s, 56 * s, 10 * s, 5 * s); g.fill(); g.stroke();
    g.fillStyle = "#e6b25a"; g.beginPath(); g.arc(-36 * s, hy + 52 * s, 9 * s, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OR; g.beginPath(); g.arc(-36 * s, hy + 52 * s, 3 * s, 0, 7); g.fill(); g.stroke();
  } else { // сзади
    g.fillStyle = OR; L(5); g.beginPath(); g.ellipse(0, -50 * s, 60 * s, 50 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    L(6, DK); for (const yy of [-78, -58, -38]) { g.beginPath(); g.moveTo(-34 * s, yy * s); g.quadraticCurveTo(0, (yy + 10) * s, 34 * s, yy * s); g.stroke(); }
    g.fillStyle = OR; L(4); for (const dx of [-38, 38]) { g.beginPath(); g.ellipse(dx * s, -6 * s, 20 * s, 9 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
    tail([[10 * s, -8 * s], [70 * s, 10 * s], [95 * s, -60 * s], [62 * s, -100 * s]]);
    ear(-18 * s, hy - 38 * s, -46 * s, hy - 70 * s, -50 * s, hy - 18 * s, false);
    ear(18 * s, hy - 38 * s, 46 * s, hy - 70 * s, 50 * s, hy - 18 * s, false);
    g.fillStyle = OR; L(5); g.beginPath(); g.ellipse(0, hy, 55 * s, 46 * s, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    L(6, DK); for (const dx of [-16, 0, 16]) { g.beginPath(); g.moveTo(dx * s, hy - 40 * s); g.lineTo(dx * 0.85 * s, hy - 10 * s); g.stroke(); }
    L(2.5); for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 52 * s, hy + 16 * s); g.lineTo(sx * 72 * s, hy + 18 * s); g.stroke(); }
    L(4); g.fillStyle = "#2f6fd6"; g.beginPath(); g.roundRect(-34 * s, hy + 36 * s, 68 * s, 10 * s, 5 * s); g.fill(); g.stroke();
  }
  g.restore();
}
