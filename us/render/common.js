// Общий кадр для американских роликов: шот → сцена → свет → экранные слои → титр → субтитры.
// Особенности:
//   • титр «WHAT IF …» не дольше 1 с и рисуется поверх действия, а не вместо него;
//   • все надписи берутся из text_NAME.js (en + ru), в коде шотов — только ключи: L("sun");
//   • мягкое свечение: всё, что излучает свет (лампы, фонари, окна, солнце, фонарик, emitGlow), получает ореол;
//     сила — VIDEO.bloom / shot.bloom (по умолчанию 1), 0 — выключить. Плюс редкие тёплые пылинки в воздухе (motes);
//   • контурный свет: персонаж рядом с источником света получает светлую кромку и подсветку с его стороны,
//     цветом этого света (rimLight). Сила — VIDEO.rim / shot.rim (по умолчанию 1); у актёра rim: false — выключить.
const cvs = document.getElementById("c"), G = cvs.getContext("2d");
const LANG = "en";
// надпись по ключу из TEXT (text_NAME.js); если ключа нет — сам ключ, чтобы ошибку было видно в кадре
const L = (key) => (TEXT.labels[key] ? TEXT.labels[key][LANG] : `?${key}?`);
const fobbin = (extra) => Object.assign({ id: "fobbin", seed: 3, lookStyle: FOBBIN_LOOK, pos: [0, 0, 0] }, extra);
const lerpPath = (t, t0, t1, a, b) => v3.lerp(a, b, clamp((t - t0) / (t1 - t0), 0, 1));
const HZ = HEAD_ZM;
const fly = (sc, t, p, o = {}) => sc.sprite(p, -0.05, (g, x, y, k) => drawFly(g, x + Math.sin(t * 23) * 2, y + Math.cos(t * 19) * 2, k, t, o));
const buzz = (t, c, r = 0.12, sp = 2.2) => [c[0] + Math.sin(t * sp) * r, c[1] + Math.sin(t * sp * 1.7) * r * 0.5, c[2] + Math.cos(t * sp) * r * 0.6];
function bonkAt(t, t0, amt = 0.35) { const tb = (t - t0) * 30; return tb > 0 ? 1 + amt * Math.exp(-tb / 3.5) * Math.cos(tb * 1.25) : 0.01; }
const ramp = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
// экранная подпись, привязанная к точке сцены
const tag = (sc, p, txt, t, t0, o = {}) => { if (t > t0 && (o.until == null || t < o.until)) sc.overlay(p, (g, x, y) => bubbleLabel(g, x + (o.dx ?? 0), y + (o.dy ?? 0), txt, t, t0, o)); };

// Сдвинуть готовые шоты на d секунд (чтобы поставить перед ними шот-крючок).
function shiftShots(shots, d) {
  const sh = (f) => f && ((...a) => { const i = a.findIndex((x) => typeof x === "number"); a[i] -= d; return f(...a); });
  return shots.map((s) => Object.assign({}, s, {
    t0: s.t0 + d, t1: s.t1 + d,
    cam: s.cam && s.cam.map(([tt, ...rest]) => [tt + d, ...rest]),
    build: sh(s.build), screen: sh(s.screen), dark: sh(s.dark), post: sh(s.post), over: sh(s.over), shake: sh(s.shake),
  }));
}

// Мягкое свечение: световой слой (engine.js → LX) размывается в двух радиусах и ложится на кадр «экраном».
const BLA = document.createElement("canvas"), BLB = document.createElement("canvas");
for (const c of [BLA, BLB]) { c.width = lightCv.width; c.height = lightCv.height; }
function bloom(g, k) {
  if (k <= 0) return;
  const a = BLA.getContext("2d"), b = BLB.getContext("2d");
  a.clearRect(0, 0, BLA.width, BLA.height); a.filter = "blur(3px)"; a.drawImage(lightCv, 0, 0); a.filter = "none";
  b.clearRect(0, 0, BLB.width, BLB.height); b.filter = "blur(16px)"; b.drawImage(lightCv, 0, 0); b.filter = "none";
  g.save(); g.globalCompositeOperation = "screen"; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  g.globalAlpha = 0.85 * k; g.drawImage(BLA, 0, 0, W, H);
  g.globalAlpha = 0.9 * k; g.drawImage(BLB, 0, 0, W, H); g.drawImage(BLB, 0, 0, W, H);
  g.restore();
}
// Контурный свет: смотрим в световой слой, откуда, насколько ярко и каким цветом светит рядом с персонажем,
// и кладём с этой стороны кромку по силуэту + мягкую подсветку половины фигуры. Дальний свет слабее (1 / (1 + (d/R)²)).
const RIM = document.createElement("canvas"), RX = RIM.getContext("2d");
const NI = document.createElement("canvas"), NX = NI.getContext("2d", { willReadFrequently: true });
// силуэт без чёрного контура и линий-палочек: свет ложится только на цветные части (волосы, лицо, одежда)
function fillMask(cv, w, h) {
  if (NI.width !== w || NI.height !== h) { NI.width = w; NI.height = h; } else NX.clearRect(0, 0, w, h);
  NX.drawImage(cv, 0, 0, w, h); const im = NX.getImageData(0, 0, w, h), d = im.data;
  for (let i = 0; i < d.length; i += 4) if (Math.max(d[i], d[i + 1], d[i + 2]) < 80) d[i + 3] = 0;
  NX.putImageData(im, 0, 0); return NI;
}
function rimLight(g, k) {
  if (k <= 0 || !ACTORS.length) return;
  const lw = lightCv.width, lh = lightCv.height, px = LX.getImageData(0, 0, lw, lh).data, S = [], step = 3;
  for (let y = 0; y < lh; y += step) for (let x = 0; x < lw; x += step) {
    const i = (y * lw + x) * 4, I = (px[i + 3] / 255) * (Math.max(px[i], px[i + 1], px[i + 2]) / 255);
    if (I > 0.12) S.push([x / LIGHT_DS, y / LIGHT_DS, I, px[i], px[i + 1], px[i + 2]]);
  }
  if (!S.length) return;
  for (const a of ACTORS) {
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.45, R = a.h * 0.9;
    let vx = 0, vy = 0, sum = 0, cr = 0, cg = 0, cb = 0;
    for (const [x, y, I, r, gg, b] of S) {
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, wgt = I / (1 + (d / R) ** 2);
      vx += (wgt * dx) / d; vy += (wgt * dy) / d; sum += wgt; cr += wgt * r; cg += wgt * gg; cb += wgt * b;
    }
    const s = clamp(sum / 60, 0, 1) * 0.75 * k; if (s < 0.04) continue;
    const n = Math.hypot(vx, vy) || 1, dx = vx / n, dy = vy / n, col = `${Math.round(cr / sum)},${Math.round(cg / sum)},${Math.round(cb / sum)}`;
    const w = Math.ceil(a.w), h = Math.ceil(a.h), off = a.w * 0.055, m = fillMask(a.cv, w, h);
    if (RIM.width !== w || RIM.height !== h) { RIM.width = w; RIM.height = h; } else RX.clearRect(0, 0, w, h);
    // 1) мягкая подсветка стороны, обращённой к свету
    RX.globalCompositeOperation = "source-over"; RX.drawImage(m, 0, 0);
    RX.globalCompositeOperation = "source-in";
    const gr = RX.createLinearGradient(w / 2 + (dx * w) / 2, h * 0.45 + (dy * h) / 3, w / 2 - (dx * w) / 2, h * 0.45 - (dy * h) / 3);
    gr.addColorStop(0, `rgba(${col},0.35)`); gr.addColorStop(0.6, `rgba(${col},0)`); RX.fillStyle = gr; RX.fillRect(0, 0, w, h);
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = s; g.drawImage(RIM, a.x, a.y, a.w, a.h); g.restore();
    // 2) кромка по ВНЕШНЕМУ краю: полный силуэт минус он же, сдвинутый от света; затем только цветные части
    //    (так кромка ложится внутрь чёрного контура и не появляется на внутренних линиях — завитках, очках, лице)
    RX.globalCompositeOperation = "source-over"; RX.clearRect(0, 0, w, h); RX.drawImage(a.cv, 0, 0, w, h);
    RX.globalCompositeOperation = "destination-out"; RX.drawImage(a.cv, -dx * off, -dy * off, w, h);
    RX.globalCompositeOperation = "destination-in"; RX.drawImage(m, 0, 0);
    RX.globalCompositeOperation = "source-in"; RX.fillStyle = `rgb(${col})`; RX.fillRect(0, 0, w, h);
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = Math.min(1, s * 1.2); g.filter = "blur(2px)"; g.drawImage(RIM, a.x, a.y, a.w, a.h); g.restore();
  }
  RX.globalCompositeOperation = "source-over";
}

// Пылинки в воздухе: редкие, тёплые, медленно плывут — для глубины и «живого» воздуха, не отвлекают.
function motes(g, t, k) {
  if (k <= 0) return;
  g.save(); g.globalCompositeOperation = "screen";
  for (let i = 0; i < 28; i++) {
    const h1 = Math.sin(i * 12.9898) * 43758.5453, h2 = Math.sin(i * 78.233) * 12345.678, fx = h1 - Math.floor(h1), fy = h2 - Math.floor(h2);
    const x = ((fx * W + t * (8 + fx * 14) + Math.sin(t * 0.4 + i) * 30) % (W + 40) + W + 40) % (W + 40) - 20;
    const y = ((fy * H - t * (10 + fy * 18)) % H + H) % H, r = 2 + (i % 4) * 1.6, a = k * (0.12 + 0.18 * (0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.7)));
    const gr = g.createRadialGradient(x, y, 0, x, y, r * 3); gr.addColorStop(0, `rgba(255,236,200,${a})`); gr.addColorStop(1, "rgba(255,236,200,0)");
    g.fillStyle = gr; g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  }
  g.restore();
}

function fitText(g, txt, maxW, size) { g.font = `900 ${size}px ${FONT_TITLE}`; const w = g.measureText(txt).width; return w > maxW ? Math.floor(size * maxW / w) : size; }
function renderFrame(t) {
  const V = window.VIDEO, SH = V.shots, titleEnd = Math.min(V.titleEnd ?? 1.0, 1.0);
  const sh = SH.find((s) => t >= s.t0 && t < s.t1) ?? SH[SH.length - 1];
  G.setTransform(1, 0, 0, 1, 0, 0); G.filter = "none"; G.globalAlpha = 1;
  G.fillStyle = "#000"; G.fillRect(0, 0, W, H); lightReset();
  if (sh.screen) sh.screen(G, t);       // плоская экранная сцена (космос, схема)
  else {
    const [, p, l, fov] = camAt(t, sh.cam);
    const sk = sh.shake ? sh.shake(t) : 0;
    const pos = [p[0] + Math.sin(t * 0.9) * 0.012 + Math.sin(t * 47) * sk, p[1] + Math.sin(t * 1.3) * 0.008 + Math.cos(t * 53) * sk, p[2]];
    const cam = makeCam(pos, l, fov);
    const sc = new Scene(cam, sh.focus);
    sh.build(sc, t);
    sc.render(G);
    warmLight(G, W * 0.15, H * 0.3, H * 0.6, "rgba(255,220,170,A)", sh.warm ?? 0.22);
  }
  if (sh.dark) { const d = sh.dark(t); if (d > 0) { G.fillStyle = `rgba(8,10,35,${d})`; G.fillRect(0, 0, W, H); } }
  rimLight(G, sh.rim ?? V.rim ?? 1);
  bloom(G, sh.bloom ?? V.bloom ?? 1);
  motes(G, t, sh.motes ?? (sh.screen ? 0 : V.motes ?? 1));
  if (sh.post) sh.post(G, t);
  vignette(G, 0.42);
  if (sh.over) sh.over(G, t);
  // титр: ≤1 с, поверх действия, без затемнения кадра
  if (t < titleEnd) {
    const out = clamp((t - (titleEnd - 0.2)) / 0.2, 0, 1);
    G.save(); G.globalAlpha = 1 - out;
    const s1 = popScale(t, 0.0), s2 = popScale(t, 0.12);
    if (s1 > 0) { G.save(); G.translate(W / 2, 200); G.scale(s1, s1); outlinedText(G, "WHAT IF", 0, 0, 110, "#ffffff", 20, "center", -0.04); G.restore(); }
    if (s2 > 0) { G.save(); G.translate(W / 2, 330); G.scale(s2, s2);
      TEXT.title[LANG].forEach((ln, i) => { const sz = fitText(G, ln, 960, 104); outlinedText(G, ln, 0, i * (sz + 12), sz, "#f5c518", 18, "center", i % 2 ? -0.02 : 0.02); }); G.restore(); }
    G.restore();
  }
  // субтитры
  if (t >= titleEnd - 0.05) {
    const c = CAPTIONS.find((c) => t >= c.s && t < Math.max(c.e, c.s + 0.2));
    if (c) { const k = clamp((t - c.s) / 0.18, 0, 1), s = 0.72 + 0.28 * easeOutBack(k, 2.0);
      G.save(); G.translate(W / 2, H - 540); G.scale(s, s); G.font = `900 92px ${FONT_TITLE}`; G.textAlign = "center"; G.textBaseline = "middle"; G.lineJoin = "round";
      const words = c.text.toUpperCase().split(" "), lines = []; let cur = "";
      for (const w of words) { const tr = cur ? cur + " " + w : w; if (G.measureText(tr).width > 940 && cur) { lines.push(cur); cur = w; } else cur = tr; } if (cur) lines.push(cur);
      lines.forEach((ln, i) => { const y = (i - (lines.length - 1) / 2) * 100; G.fillStyle = "rgba(0,0,0,0.55)"; G.fillText(ln, 0, y + 7); G.lineWidth = 18; G.strokeStyle = "#000"; G.strokeText(ln, 0, y); G.fillStyle = "#fff"; G.fillText(ln, 0, y); });
      G.restore(); }
  }
  const cut = SH.find((s) => s.t0 > 0 && t >= s.t0 && t < s.t0 + 0.08); if (cut) { G.fillStyle = "rgba(255,255,255,0.18)"; G.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
window.ready = Promise.all([document.fonts.load('900 92px "Inter Display"'), document.fonts.load('800 40px "Inter"')]).then(() => true);
Object.defineProperty(window, "TOTAL", { get: () => window.VIDEO.total });
