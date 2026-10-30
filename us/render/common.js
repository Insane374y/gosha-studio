// Общий кадр для американских роликов: шот → сцена → свет → экранные слои → титр → субтитры.
// Особенности:
//   • титр «WHAT IF …» не дольше 1 с и рисуется поверх действия, а не вместо него;
//   • все надписи берутся из text_NAME.js (en + ru), в коде шотов — только ключи: L("sun").
const cvs = document.getElementById("c"), G = cvs.getContext("2d");
const LANG = "en";
// надпись по ключу из TEXT (text_NAME.js); если ключа нет — сам ключ, чтобы ошибку было видно в кадре
const L = (key) => (TEXT.labels[key] ? TEXT.labels[key][LANG] : `?${key}?`);
const FOBBIN_LOOK = GOSHA_LOOK;   // образ тот же, поменялось только имя
const fobbin = (extra) => Object.assign({ id: "fobbin", seed: 3, lookStyle: FOBBIN_LOOK, pos: [0, 0, 0] }, extra);
const fobbinSprite = goshaSprite;
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

function fitText(g, txt, maxW, size) { g.font = `900 ${size}px ${FONT_TITLE}`; const w = g.measureText(txt).width; return w > maxW ? Math.floor(size * maxW / w) : size; }
function renderFrame(t) {
  const V = window.VIDEO, SH = V.shots, titleEnd = Math.min(V.titleEnd ?? 1.0, 1.0);
  const sh = SH.find((s) => t >= s.t0 && t < s.t1) ?? SH[SH.length - 1];
  G.setTransform(1, 0, 0, 1, 0, 0); G.filter = "none"; G.globalAlpha = 1;
  G.fillStyle = "#000"; G.fillRect(0, 0, W, H);
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
