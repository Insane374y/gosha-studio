// 2.5D-движок кадра: перспективная камера, комнаты и предметы-коробки с обводкой, дудлы-билборды,
// размытие по глубине, мягкий свет. Всё в метрах: x вправо, y вверх, z к камере. Время — секунды голоса.
const W = 1080, H = 1920, INKC = "#20180f";
// ---------------------------------------------------------------- световой слой: всё, что излучает свет (лампы, фонари, окна, солнце).
// Кадр получает из него мягкий ореол (common.js → bloom). Светится только то, что сюда нарисовано, а не любое яркое место.
const LIGHT_DS = 0.25;
const lightCv = document.createElement("canvas"); lightCv.width = W * LIGHT_DS; lightCv.height = H * LIGHT_DS;
const LX = lightCv.getContext("2d");
// персонажи этого кадра (силуэт и место) — для контурного света в common.js → rimLight
const ACTORS = [];
function lightReset() { ACTORS.length = 0; LX.setTransform(1, 0, 0, 1, 0, 0); LX.clearRect(0, 0, lightCv.width, lightCv.height); LX.setTransform(LIGHT_DS, 0, 0, LIGHT_DS, 0, 0); }
// светящееся пятно в экранных координатах — для плоских сцен и мелких источников (фонарик, звезда, экран)
function emitGlow(x, y, r, col, a = 1) { LX.save(); LX.globalAlpha = a; const gr = LX.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); LX.fillStyle = gr; LX.fillRect(x - r, y - r, 2 * r, 2 * r); LX.restore(); }
const v3 = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  lerp: (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k] };
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const easeOutBack = (k, s = 1.8) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);

// ---------------------------------------------------------------- камера
function makeCam(pos, target, fov) {
  const f = v3.norm(v3.sub(target, pos)), r = v3.norm(v3.cross(f, [0, 1, 0])), u = v3.cross(r, f);
  const F = H / 2 / Math.tan((fov * Math.PI) / 360);
  const toCam = (p) => { const d = v3.sub(p, pos); return [v3.dot(d, r), v3.dot(d, u), v3.dot(d, f)]; };
  const scr = (c) => [W / 2 + (c[0] / c[2]) * F, H / 2 - (c[1] / c[2]) * F];
  return { pos, f, r, u, F, toCam, scr, P: (p) => { const c = toCam(p); return c[2] > 0.02 ? [...scr(c), c[2]] : null; } };
}
function camAt(t, keys) {
  if (t <= keys[0][0]) return keys[0];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const a = keys[i - 1], b = keys[i], k = ease((t - a[0]) / (b[0] - a[0]));
    return [t, v3.lerp(a[1], b[1], k), v3.lerp(a[2], b[2], k), a[3] + (b[3] - a[3]) * k];
  }
  return keys[keys.length - 1];
}
// многоугольник в камеру с отсечением ближней плоскостью → экранные точки
function projPoly(cam, pts) {
  const NZ = 0.05; const c = pts.map(cam.toCam); const out = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length];
    if (a[2] >= NZ) out.push(a);
    if ((a[2] >= NZ) !== (b[2] >= NZ)) { const k = (NZ - a[2]) / (b[2] - a[2]); out.push(v3.lerp(a, b, k)); }
  }
  return out.map(cam.scr);
}
const pathPoly = (g, s) => { g.beginPath(); s.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); };
const shadeHex = (hex, k) => { const n = parseInt(hex.slice(1), 16); return `rgb(${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => clamp(Math.round(v * k), 0, 255)).join(",")})`; };
const LIGHT = v3.norm([-0.45, 0.8, 0.5]);

// ---------------------------------------------------------------- сцена = список элементов, отсортированных по глубине
class Scene {
  constructor(cam, focus, opts = {}) { this.cam = cam; this.items = []; this.bg = []; this.focusZ = cam.toCam(focus)[2]; this.opts = opts; }
  blurFor(z) { return clamp((Math.abs(z - this.focusZ) - 0.7) * 2.2, 0, this.opts.maxBlur ?? 5); }
  // большие плоскости комнаты (рисуются первыми)
  plane(pts, col, line = true) { this.bg.push({ pts, col, line }); }
  box(p, s, col, o = {}) {
    const c = this.cam.toCam(p);
    this.items.push({ z: c[2] + (o.zb ?? 0), draw: (g) => drawBox(g, this.cam, p, s, col, o) });
    if (o.shadow !== false && p[1] - s[1] / 2 < 0.05) this.items.push({ z: c[2] + 50, draw: (g) => groundShadow(g, this.cam, p, s) });
  }
  // плоская картинка на плоскости (вывеска, окно, экран): center, w, h, нормаль по оси rotY, painter(g, pw, ph)
  decal(center, w, h, rotY, painter, key, o = {}) {
    const c = this.cam.toCam(center);
    const emit = o.emit ?? painter.glow;   // painter.glow — светящаяся часть картинки (солнце в окне, горящие окна)
    this.items.push({ z: c[2] + (o.zb ?? 0.01), draw: (g) => { drawDecal(g, this.cam, center, w, h, rotY, painter, key, o);
      if (emit) drawDecal(LX, this.cam, center, w, h, rotY, emit, key && key + ":glow", { frame: false, live: o.live }); } });
  }
  overlay(p, draw) { this.items.push({ z: -100, noBlur: true, draw: (g) => { const s = this.cam.P(p); if (s) draw(g, s[0], s[1]); } }); }
  sprite(p, z_bias, draw) { const c = this.cam.toCam(p); if (c[2] <= 0.05) return; this.items.push({ z: c[2] + z_bias, draw: (g) => { const s = this.cam.P(p); if (s) draw(g, s[0], s[1], this.cam.F / s[2]); } }); }
  render(g) {
    // глубина резкости слоями: дальний слой и ближний рисуются в уменьшенный холст и растягиваются (мягкое размытие),
    // резкий слой — в полном разрешении. Так в десятки раз быстрее, чем фильтр blur на каждом предмете.
    const DS = 0.33;
    const layer = () => { const c = document.createElement("canvas"); c.width = Math.round(W * DS); c.height = Math.round(H * DS); const x = c.getContext("2d"); x.setTransform(DS, 0, 0, DS, 0, 0); return [c, x]; };
    const fz = this.focusZ, items = this.items;
    const shadows = items.filter((i) => i.z > 40), rest = items.filter((i) => i.z <= 40).sort((a, b) => b.z - a.z);
    const far = rest.filter((i) => !i.noBlur && i.z > fz + 0.75), near = rest.filter((i) => !i.noBlur && i.z < fz - 0.9), mid = rest.filter((i) => !far.includes(i) && !near.includes(i));
    const [fc, fx] = layer();
    for (const b of this.bg) {
      const s = projPoly(this.cam, b.pts); if (s.length < 3) continue;
      fx.fillStyle = b.col; pathPoly(fx, s); fx.fill();
      if (b.line) { fx.strokeStyle = INKC; fx.lineWidth = 3; fx.stroke(); }
    }
    for (const i of shadows) i.draw(fx);
    for (const i of far) i.draw(fx);
    g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.filter = "blur(1px)"; g.drawImage(fc, 0, 0, W, H); g.restore();
    for (const i of mid) i.draw(g);
    if (near.length) { const [nc, nx] = layer(); for (const i of near) i.draw(nx); g.save(); g.imageSmoothingQuality = "high"; g.filter = "blur(1.5px)"; g.drawImage(nc, 0, 0, W, H); g.restore(); }
  }
}
function drawBox(g, cam, p, s, col, o) {
  const [hx, hy, hz] = [s[0] / 2, s[1] / 2, s[2] / 2];
  const ry = o.rotY ?? 0, cy = Math.cos(ry), sy = Math.sin(ry);
  const T = (x, y, z) => [p[0] + x * cy + z * sy, p[1] + y, p[2] - x * sy + z * cy];
  const faces = [
    [[1, 0, 0], [[hx, -hy, -hz], [hx, hy, -hz], [hx, hy, hz], [hx, -hy, hz]]],
    [[-1, 0, 0], [[-hx, -hy, hz], [-hx, hy, hz], [-hx, hy, -hz], [-hx, -hy, -hz]]],
    [[0, 1, 0], [[-hx, hy, -hz], [-hx, hy, hz], [hx, hy, hz], [hx, hy, -hz]]],
    [[0, -1, 0], [[-hx, -hy, -hz], [hx, -hy, -hz], [hx, -hy, hz], [-hx, -hy, hz]]],
    [[0, 0, 1], [[-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]]],
    [[0, 0, -1], [[hx, -hy, -hz], [-hx, -hy, -hz], [-hx, hy, -hz], [hx, hy, -hz]]],
  ];
  const list = [];
  for (const [n0, vs] of faces) {
    const n = [n0[0] * cy + n0[2] * sy, n0[1], -n0[0] * sy + n0[2] * cy];
    const pts = vs.map((v) => T(...v));
    const ctr = v3.mul(pts.reduce((a, b) => v3.add(a, b)), 0.25);
    if (v3.dot(n, v3.sub(cam.pos, ctr)) <= 0) continue;
    const lit = 0.62 + 0.45 * Math.max(0, v3.dot(n, LIGHT)) + (n[1] > 0.5 ? 0.08 : 0);
    list.push({ s: projPoly(cam, pts), col: shadeHex(col, lit * (o.dark ?? 1)) });
  }
  for (const f of list) { if (f.s.length < 3) continue; g.fillStyle = f.col; pathPoly(g, f.s); g.fill(); }
  if (o.line !== false) { g.strokeStyle = INKC; g.lineWidth = o.lw ?? 3.2; g.lineJoin = "round"; for (const f of list) { if (f.s.length < 3) continue; pathPoly(g, f.s); g.stroke(); } }
  if (o.glow) for (const f of list) { if (f.s.length < 3) continue; g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = o.glow; g.fillStyle = col; pathPoly(g, f.s); g.fill(); g.restore();
    LX.save(); LX.globalAlpha = Math.min(1, o.glow * 2.5); LX.fillStyle = col; pathPoly(LX, f.s); LX.fill(); LX.restore(); }
}
function groundShadow(g, cam, p, s) {
  const c = cam.P([p[0], 0.002, p[2]]); if (!c) return;
  const e = cam.P([p[0] + s[0] / 2 + 0.08, 0.002, p[2]]), e2 = cam.P([p[0], 0.002, p[2] + s[2] / 2 + 0.08]);
  if (!e || !e2) return;
  const rx = Math.abs(e[0] - c[0]) + 10, ry = Math.max(8, Math.abs(e2[1] - c[1]) + 4);
  g.save(); g.translate(c[0], c[1]); g.scale(1, ry / rx);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, "rgba(10,8,20,0.28)"); gr.addColorStop(0.7, "rgba(10,8,20,0.16)"); gr.addColorStop(1, "rgba(10,8,20,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill(); g.restore();
}
const decalCache = {};
function drawDecal(g, cam, ctr, w, h, rotY, painter, key, o) {
  const cy = Math.cos(rotY), sy = Math.sin(rotY);
  const T = (x, y) => [ctr[0] + x * cy, ctr[1] + y, ctr[2] - x * sy];
  const tl = cam.P(T(-w / 2, h / 2)), tr = cam.P(T(w / 2, h / 2)), bl = cam.P(T(-w / 2, -h / 2)), br = cam.P(T(w / 2, -h / 2));
  if (!tl || !tr || !bl || !br) return;
  const pw = Math.round(clamp(Math.hypot(tr[0] - tl[0], tr[1] - tl[1]) * 1.2, 32, 1400)), ph = Math.round(clamp(pw * (h / w), 16, 1600));
  let cv = key ? decalCache[key] : null;
  if (!cv || cv.width !== pw || cv.height !== ph || !key || o.live) {
    cv = (key && decalCache[key]) || document.createElement("canvas"); cv.width = pw; cv.height = ph;
    const c2 = cv.getContext("2d"); c2.clearRect(0, 0, pw, ph); painter(c2, pw, ph);
    if (key) decalCache[key] = cv;
  }
  // аффинное приближение по трём углам + обрезка по четырёхугольнику
  g.save();
  g.beginPath(); g.moveTo(...tl.slice(0, 2)); g.lineTo(...tr.slice(0, 2)); g.lineTo(...br.slice(0, 2)); g.lineTo(...bl.slice(0, 2)); g.closePath(); g.clip();
  // две половинки (треугольники) для меньших искажений
  const tri = (p0, p1, p2, s0, s1, s2) => {
    g.save(); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.closePath(); g.clip();
    const [x0, y0] = s0, [x1, y1] = s1, [x2, y2] = s2;
    const den = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
    const a = (p0[0] * (y1 - y2) + p1[0] * (y2 - y0) + p2[0] * (y0 - y1)) / den, c = (p0[0] * (x2 - x1) + p1[0] * (x0 - x2) + p2[0] * (x1 - x0)) / den;
    const e = (p0[0] * (x1 * y2 - x2 * y1) + p1[0] * (x2 * y0 - x0 * y2) + p2[0] * (x0 * y1 - x1 * y0)) / den;
    const b = (p0[1] * (y1 - y2) + p1[1] * (y2 - y0) + p2[1] * (y0 - y1)) / den, d = (p0[1] * (x2 - x1) + p1[1] * (x0 - x2) + p2[1] * (x1 - x0)) / den;
    const f = (p0[1] * (x1 * y2 - x2 * y1) + p1[1] * (x2 * y0 - x0 * y2) + p2[1] * (x0 * y1 - x1 * y0)) / den;
    g.transform(a, b, c, d, e, f); g.drawImage(cv, 0, 0); g.restore();
  };
  tri(tl, tr, bl, [0, 0], [pw, 0], [0, ph]);
  tri(tr, br, bl, [pw, 0], [pw, ph], [0, ph]);
  g.restore();
  if (o.frame !== false) { g.strokeStyle = INKC; g.lineWidth = o.lw ?? 3; g.beginPath(); g.moveTo(...tl.slice(0, 2)); g.lineTo(...tr.slice(0, 2)); g.lineTo(...br.slice(0, 2)); g.lineTo(...bl.slice(0, 2)); g.closePath(); g.stroke(); }
}

// ---------------------------------------------------------------- персонаж-дудл
const HEAD_ZM = 0.4 + 0.36 + 0.27 * 0.78;
const REST_FM = [-0.2, 0.46], REST_BM = [0.2, 0.46];
function track(t, keys) {
  if (!keys || !keys.length) return null;
  if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const a = keys[i - 1], b = keys[i], k = easeOutBack(clamp((t - a[0]) / Math.max(1e-6, b[0] - a[0]), 0, 1));
    return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  }
  const l = keys[keys.length - 1]; return [l[1], l[2]];
}
function smoothTrack(t, keys) {
  if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i], k = ease((t - a[0]) / (b[0] - a[0])); return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  const l = keys[keys.length - 1]; return [l[1], l[2]];
}
const valAt = (t, keys, def) => { if (!keys) return def; let v = def; for (const [tt, x] of keys) if (t >= tt) v = x; return v; };
const pointKeysM = (t, dx, dz, hold = 1.0, side = "f") => {
  const rest = side === "f" ? REST_FM : REST_BM, sh = side === "f" ? -0.12 : 0.12;
  return [[t - 0.35, ...rest], [t - 0.12, sh * 0.2, HEAD_ZM + 0.15], [t, sh + dx * 0.6, 0.65 + dz * 0.6], [t + hold, sh + dx * 0.6, 0.65 + dz * 0.6], [t + hold + 0.25, ...rest]];
};
const actorCanvases = {};
function drawActor(scene, t, a) {
  const f2 = Math.floor(t * 30 / 2) * 2, tt = f2 / 30;   // мимика «по двойкам»
  let ex = a.expr[0][1], tc = -99;
  for (const [k, e] of a.expr) if (tt >= k) { ex = e; tc = k; }
  const tb = (tt - tc) * 30;
  const bonk = tb >= 0 && tb < 40 ? Math.exp(-tb / 3.5) * Math.cos(tb * 1.25) : 0;
  const blink = (f2 + a.seed * 37) % 79 < 3 || (tb >= 0 && tb < 2);
  const dart = valAt(tt, a.look, Math.sin(tt * 1.7 + a.seed * 2) > 0.7 ? 0.8 : Math.sin(tt * 1.3 + a.seed) < -0.75 ? -0.8 : 0);
  const pose = {
    expr: ex, blink, bonk, lookX: dart, tilt: Math.sin(tt * 1.1 + a.seed) * 0.03 + (valAt(tt, a.tilt, 0)),
    handF: track(tt, a.handF) ?? REST_FM, handB: track(tt, a.handB) ?? REST_BM,
    bendF: valAt(tt, a.bendF, 0.12), bendB: valAt(tt, a.bendB, -0.12),
    lean: a.lean ? smoothTrack(tt, a.lean)[0] : 0, mouth: valAt(tt, a.mouth, undefined), flyEyes: a.flyEyes ? smoothTrack(tt, a.flyEyes)[0] : 0,
    bigEyes: valAt(tt, a.bigEyes, false), eyeDirs: a.eyeL ? [smoothTrack(tt, a.eyeL), smoothTrack(tt, a.eyeR)] : null, tongue: a.tongue ? smoothTrack(tt, a.tongue)[0] : 0,
  };
  if (a.blinkHold && valAt(tt, a.blinkHold, false)) pose.blink = true;
  const key = a.id ?? "fobbin";
  const cv = actorCanvases[key] ?? (actorCanvases[key] = Object.assign(document.createElement("canvas"), { width: CW, height: CH }));
  drawDoodle(cv.getContext("2d"), a.lookStyle, pose);
  const pos = a.walk ? (() => { const [x, z] = smoothTrack(t, a.walk); return [x, 0, z]; })() : a.pos;
  const hop = a.hop ? Math.max(0, Math.sin(clamp((t - a.hop[0]) / a.hop[1], 0, 1) * Math.PI)) * 0.12 : 0;
  const lift = a.lift ? smoothTrack(t, a.lift)[0] : 0, sc0 = a.scale ? (Array.isArray(a.scale) ? smoothTrack(t, a.scale)[0] : a.scale) : 1;
  const roll = a.roll ? smoothTrack(t, a.roll)[0] : 0, shake = a.shiver && valAt(t, a.shiver, false) ? Math.sin(t * 60) * 0.01 : 0;
  const base = [pos[0] + shake, pos[1] + hop * sc0 + lift, pos[2]];
  const item = { z: scene.cam.toCam([pos[0], 1.0, pos[2]])[2], draw: (g) => {
    const b = scene.cam.P(base), top = scene.cam.P([base[0], base[1] + PLANE_H * sc0, base[2]]);
    if (!b || !top) return;
    const hpx = b[1] - top[1], wpx = (hpx * PLANE_W) / PLANE_H;
    if (a.props) a.props(g, b[0], top[1], hpx / PLANE_H, t, "back");
    if (roll) { g.save(); g.translate(b[0], b[1] - hpx * 0.4); g.rotate(roll); g.drawImage(cv, -wpx / 2, -hpx * 0.6, wpx, hpx); g.restore(); }
    else { g.drawImage(cv, b[0] - wpx / 2, top[1], wpx, hpx); if (a.rim !== false) ACTORS.push({ cv, x: b[0] - wpx / 2, y: top[1], w: wpx, h: hpx }); }
    if (a.props) a.props(g, b[0], top[1], hpx / PLANE_H, t, "front");
  } };
  scene.items.push(item);
}

// ---------------------------------------------------------------- спрайты
function drawFly(g, x, y, ppm, t, o = {}) {
  const s = ppm * 0.034 * (o.scale ?? 1);   // тело ~4.5 см «мультяшной» мухи
  g.save(); g.translate(x, y); g.rotate(o.rot ?? 0); if (o.flip) g.scale(-1, 1);
  const wing = Math.sin(t * 90) * 0.5 + 0.5;
  g.globalAlpha = 0.55; g.fillStyle = "#dff3ff"; g.strokeStyle = INKC; g.lineWidth = Math.max(1, s * 0.08);
  for (const sx of [-1, 1]) { g.save(); g.rotate(sx * (0.5 + wing * 0.6)); g.beginPath(); g.ellipse(sx * s * 0.6, -s * 0.9, s * 0.45, s * 1.05, sx * 0.4, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore(); }
  g.globalAlpha = 1;
  g.strokeStyle = INKC; g.lineWidth = Math.max(1.2, s * 0.1);
  for (const sx of [-1, 1]) for (const k of [-0.4, 0.1, 0.6]) { g.beginPath(); g.moveTo(sx * s * 0.4, k * s); g.lineTo(sx * s * 1.0, k * s + s * 0.45); g.stroke(); }
  g.fillStyle = "#2b2e35"; g.beginPath(); g.ellipse(0, s * 0.25, s * 0.55, s * 0.85, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  g.strokeStyle = "#556"; g.lineWidth = Math.max(1, s * 0.06); for (const k of [0.1, 0.45, 0.8]) { g.beginPath(); g.moveTo(-s * 0.45, s * k); g.lineTo(s * 0.45, s * k); g.stroke(); }
  g.strokeStyle = INKC; g.lineWidth = Math.max(1.2, s * 0.1);
  g.fillStyle = "#2b2e35"; g.beginPath(); g.arc(0, -s * 0.7, s * 0.45, 0, Math.PI * 2); g.fill(); g.stroke();
  for (const sx of [-1, 1]) {
    g.fillStyle = "#c62c34"; g.beginPath(); g.ellipse(sx * s * 0.38, -s * 0.85, s * 0.34, s * 0.4, sx * 0.3, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(sx * s * 0.3, -s * 1.0, s * 0.09, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}
function drawSlipper(g, x, y, ppm, rot) {
  const s = ppm * 0.14;
  g.save(); g.translate(x, y); g.rotate(rot);
  g.lineJoin = "round"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, s * 0.05);
  g.fillStyle = "#6b3f2a"; g.beginPath(); g.ellipse(0, s * 0.12, s * 1.05, s * 0.36, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  g.fillStyle = "#f07aa6"; g.beginPath(); g.moveTo(-s * 0.2, 0); g.bezierCurveTo(-s * 0.15, -s * 0.55, s * 0.85, -s * 0.5, s * 0.95, 0); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#fff"; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-s * 0.12 + i * s * 0.17, -s * 0.06 - Math.sin((i / 6) * Math.PI) * s * 0.26, s * 0.1, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
function motionLines(g, x, y, dx, dy, len, n = 3) {
  g.save(); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 5; g.lineCap = "round";
  const l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 18; g.beginPath(); g.moveTo(x - ux * 30 - uy * o, y - uy * 30 + ux * o); g.lineTo(x - ux * (30 + len) - uy * o, y - uy * (30 + len) + ux * o); g.stroke(); }
  g.restore();
}

// ---------------------------------------------------------------- экранные надписи
const FONT_TITLE = '"Inter Display", "Inter", "DejaVu Sans", sans-serif';
function outlinedText(g, txt, x, y, size, fill, stroke = 16, align = "center", rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.font = `900 ${size}px ${FONT_TITLE}`; g.textAlign = align; g.textBaseline = "middle"; g.lineJoin = "round";
  g.fillStyle = "rgba(0,0,0,0.55)"; g.fillText(txt, 0, 7);
  g.lineWidth = stroke; g.strokeStyle = "#000"; g.strokeText(txt, 0, 0); g.fillStyle = fill; g.fillText(txt, 0, 0);
  g.restore();
}
const popScale = (t, t0, dur = 0.4) => (t < t0 ? 0 : easeOutBack(clamp((t - t0) / dur, 0, 1), 2.4));
function bubbleLabel(g, x, y, txt, t, t0, o = {}) {
  const sc = popScale(t, t0); if (sc <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(sc, sc); g.rotate(o.rot ?? -0.04);
  g.font = `900 ${o.size ?? 64}px ${FONT_TITLE}`; const w = g.measureText(txt).width + 50, h = (o.size ?? 64) * 1.35;
  g.fillStyle = o.bg ?? "#ffffff"; g.strokeStyle = "#000"; g.lineWidth = 7;
  g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 26); g.fill(); g.stroke();
  if (o.tail) { g.beginPath(); g.moveTo(-14, h / 2 - 3); g.lineTo(o.tail, h / 2 + 46); g.lineTo(18, h / 2 - 3); g.closePath(); g.fill(); g.stroke(); g.fillRect(-12, h / 2 - 8, 28, 8); }
  g.fillStyle = o.fg ?? "#111"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 4);
  g.restore();
}

// ---------------------------------------------------------------- пост-обработка
function vignette(g, k = 0.45) {
  const gr = g.createRadialGradient(W / 2, H * 0.48, H * 0.25, W / 2, H * 0.5, H * 0.72);
  gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${k})`);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function warmLight(g, x, y, r, col, a) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col.replace("A", a)); gr.addColorStop(1, col.replace("A", 0));
  g.save(); g.globalCompositeOperation = "screen"; g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
}
