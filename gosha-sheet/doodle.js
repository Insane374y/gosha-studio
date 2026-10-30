// Дудл-персонаж (порт src/doodle.ts) + доработки для Гоши: вихор, худи со знаком «?», бантик для Ники, кот Бублик.
const INK = "#2a1d1a";
const PLANE_W = 1.4, PLANE_H = 2.1;
const CW = 560, CH = Math.round((CW * PLANE_H) / PLANE_W);
const K = CW / PLANE_W;
const X = (x) => CW / 2 + x * K;
const Y = (z) => CH - z * K;
const R0 = 0.27, W = 0.27, H = 0.36, HIP = 0.4;
const HEAD_Z = HIP + 0.36 + 0.27 * 0.78;

const EXPR = {
  neutral: { eyes: "oval", brow: [0, 0], mouth: ["flat", 0] },
  smug: { eyes: "lid", brow: [0.25, 0.015], mouth: ["smirk", 0.6] },
  proud: { eyes: "happy", brow: [0.2, 0.02], mouth: ["grin", 0.8] },
  grin: { eyes: "oval", brow: [-0.15, 0], mouth: ["grin", 1] },
  laugh: { eyes: "happy", brow: [0.25, 0.03], mouth: ["open", 0.85] },
  nervous: { eyes: "wide", brow: [0.4, 0.03], mouth: ["squiggle", 0], sweat: true, look: -0.35 },
  shock: { eyes: "wide", brow: [0.55, 0.06], mouth: ["open", 0.95], sweat: true },
  realize: { eyes: "wide", brow: [0.45, 0.05], mouth: ["o", 0.7] },
  blank: { eyes: "lid", brow: [0, -0.01], mouth: ["o", 0.3] },
  holdlaugh: { eyes: "squeeze", brow: [0.3, 0], mouth: ["pressed", 0], cheeks: true },
  stern: { eyes: "lid", brow: [-0.45, -0.02], mouth: ["flat", -0.2] },
};
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k)).join(",")})`;
};

function drawDoodle(ctx, look, p) {
  ctx.clearRect(0, 0, CW, CH);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  const E = EXPR[p.expr] ?? EXPR.neutral;
  const sq = 1, hip = HIP, lean = p.lean ?? 0;
  const bh = H * sq, bw = W / Math.sqrt(sq);
  const B = (x, z) => { const c = Math.cos(lean), s = Math.sin(lean); return [x * c + z * s, hip - x * s + z * c]; };
  const stroke = (w, col = INK) => { ctx.strokeStyle = col; ctx.lineWidth = w * K; };
  ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.beginPath(); ctx.ellipse(X(0), Y(0.01), W * 0.95 * K, 0.035 * K, 0, 0, Math.PI * 2); ctx.fill();
  const limb = (a, b, bend) => {
    const dx = b[0] - a[0], dz = b[1] - a[1];
    const cx = (a[0] + b[0]) / 2 - dz * bend, cz = (a[1] + b[1]) / 2 + dx * bend;
    stroke(0.032); ctx.beginPath(); ctx.moveTo(X(a[0]), Y(a[1])); ctx.quadraticCurveTo(X(cx), Y(cz), X(b[0]), Y(b[1])); ctx.stroke();
  };
  const hand = (h) => {
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(X(h[0]), Y(h[1]), 0.05 * K, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(X(h[0] - 0.017), Y(h[1] + 0.017), 0.009 * K, 0.006 * K, 0.6, 0, Math.PI * 2); ctx.fill();
  };
  for (const s of [1, -1]) {
    limb(B(s * W * 0.2, 0.05), [s * 0.08, 0.03], s * 0.04);
    ctx.fillStyle = look.shoes ?? INK; ctx.beginPath(); ctx.ellipse(X(s * 0.08 + 0.015), Y(0.022), 0.05 * K, 0.026 * K, 0, 0, Math.PI * 2); ctx.fill();
    if (look.shoes) { stroke(0.01); ctx.stroke(); }
  }
  if (look.backpack) {
    ctx.save(); const ob = B(0, 0); ctx.translate(X(ob[0]), Y(ob[1])); ctx.rotate(lean);
    ctx.fillStyle = look.backpack; stroke(0.022);
    ctx.beginPath(); ctx.roundRect(-bw * 0.68 * K, -bh * 0.98 * K, bw * 1.36 * K, bh * 0.86 * K, bw * 0.3 * K); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  const shB = B(W * 0.44, bh * 0.7), shF = B(-W * 0.44, bh * 0.7);
  const hB = p.handB ?? [W * 0.75, HIP + 0.06], hF = p.handF ?? [-W * 0.75, HIP + 0.06];
  limb(shB, hB, p.bendB ?? -0.12); hand(hB);
  // тело
  ctx.save();
  const o = B(0, 0); ctx.translate(X(o[0]), Y(o[1])); ctx.rotate(lean);
  const body = () => { ctx.beginPath(); ctx.roundRect(-bw / 2 * K, -bh * K, bw * K, bh * K, bw * 0.45 * K); };
  ctx.fillStyle = look.body; body(); ctx.fill();
  ctx.save(); body(); ctx.clip(); ctx.fillStyle = shade(look.body, 0.62); ctx.fillRect(bw * 0.2 * K, -bh * K, bw * K, bh * K);
  if (look.hoodie) {
    // карман-кенгуру и манжета снизу
    ctx.fillStyle = shade(look.body, 0.8); ctx.fillRect(-bw / 2 * K, -bh * 0.1 * K, bw * K, bh * 0.1 * K);
    stroke(0.008); ctx.beginPath(); ctx.moveTo(-bw / 2 * K, -bh * 0.1 * K); ctx.lineTo(bw / 2 * K, -bh * 0.1 * K); ctx.stroke();
  }
  if (look.stripe) { ctx.fillStyle = look.stripe; ctx.fillRect(-bw * K, -bh * 0.62 * K, bw * 2 * K, bh * 0.2 * K);
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(bw * 0.2 * K, -bh * 0.62 * K, bw * K, bh * 0.2 * K); }
  ctx.restore();
  stroke(0.028); body(); ctx.stroke();
  if (look.backpack) {
    for (const sx of [-1, 1]) { ctx.fillStyle = shade(look.backpack, 0.85); stroke(0.012);
      ctx.beginPath(); ctx.roundRect((sx * bw * 0.3 - bw * 0.06) * K, -bh * 1.0 * K, bw * 0.12 * K, bh * 0.62 * K, bw * 0.05 * K); ctx.fill(); ctx.stroke(); }
  }
  if (look.hoodie) {
    // капюшон-воротник вокруг шеи + шнурки
    ctx.fillStyle = shade(look.body, 0.78); stroke(0.014);
    ctx.beginPath(); ctx.ellipse(0, -bh * 0.98 * K, bw * 0.42 * K, bh * 0.1 * K, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    stroke(0.009, "#f7f3ea");
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * bw * 0.12 * K, -bh * 0.92 * K); ctx.lineTo(s * bw * 0.14 * K, -bh * 0.74 * K); ctx.stroke();
      ctx.fillStyle = "#f7f3ea"; ctx.beginPath(); ctx.arc(s * bw * 0.14 * K, -bh * 0.72 * K, 0.012 * K, 0, Math.PI * 2); ctx.fill(); }
    if (look.mark) {
      ctx.save(); ctx.translate(-bw * 0.04 * K, -bh * 0.4 * K); ctx.rotate(-0.08);
      ctx.font = `900 ${bh * 0.5 * K}px "DejaVu Sans", sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.lineWidth = 0.014 * K; ctx.strokeStyle = INK; ctx.strokeText(look.mark, 0, 0);
      ctx.fillStyle = "#fbf8f0"; ctx.fillText(look.mark, 0, 0); ctx.restore();
    }
  } else {
    ctx.fillStyle = "#f7f7f2"; stroke(0.01);
    ctx.beginPath(); ctx.moveTo(-W * 0.2 * K, -bh * K); ctx.lineTo(0, -bh * 0.62 * K); ctx.lineTo(W * 0.2 * K, -bh * K); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (look.mark) {
      ctx.font = `900 ${bh * 0.28 * K}px "DejaVu Sans", sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#fbf8f0"; ctx.lineWidth = 0.01 * K; ctx.strokeStyle = INK;
      ctx.strokeText(look.mark, -bw * 0.05 * K, -bh * 0.35 * K); ctx.fillText(look.mark, -bw * 0.05 * K, -bh * 0.35 * K);
    }
  }
  ctx.restore();
  // голова
  const top = B(0, bh + R0 * 0.78);
  const hr = R0;
  ctx.save();
  ctx.translate(X(top[0]), Y(top[1])); ctx.rotate(lean * 0.7 + (p.tilt ?? 0));
  const r = hr * K;
  // длинные волосы — позади головы
  if (look.hair === "long") { ctx.fillStyle = "#1b1615"; stroke(0.022);
    ctx.beginPath(); ctx.moveTo(-r * 1.05, -r * 0.1); ctx.quadraticCurveTo(-r * 1.25, r * 0.9, -r * 0.85, r * 1.15); ctx.lineTo(r * 0.85, r * 1.15);
    ctx.quadraticCurveTo(r * 1.25, r * 0.9, r * 1.05, -r * 0.1); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = "#f5f1ea"; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = "#d8d2c8"; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.arc(-r * 0.1, -r * 0.08, r * 0.82, 0, Math.PI * 2, true); ctx.fill("evenodd");
  ctx.restore();
  stroke(0.028); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#1b1615";
  if (look.hair === "spiky") for (let i = 0; i < 6; i++) { const a = Math.PI * (1.08 + i * 0.17);
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r * 0.9); ctx.lineTo(Math.cos(a + 0.08) * r * 1.28, Math.sin(a + 0.08) * r * 1.22); ctx.lineTo(Math.cos(a + 0.17) * r, Math.sin(a + 0.17) * r * 0.9); ctx.fill(); }
  if (look.hair === "curly") {
    const hc = look.hairColor ?? "#5a2e1a";
    const curls = [];
    for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.0 + i * 0.1); curls.push([Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98 - r * 0.12, r * 0.29]); }
    for (const [x, y] of [[-r * 0.45, -r * 0.95], [0, -r * 1.12], [r * 0.45, -r * 0.95], [-r * 0.2, -r * 1.25], [r * 0.25, -r * 1.22]]) curls.push([x, y, r * 0.3]);
    for (const x of [-0.55, -0.2, 0.15, 0.5]) curls.push([x * r, -r * 0.66, r * 0.2]);
    ctx.fillStyle = INK; for (const [x, y, rr] of curls) { ctx.beginPath(); ctx.arc(x, y, rr + 0.014 * K, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = hc; for (const [x, y, rr] of curls) { ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = shade(hc, 0.55); ctx.lineWidth = 0.008 * K;
    for (const [x, y, rr] of curls) { ctx.beginPath(); ctx.arc(x + rr * 0.1, y + rr * 0.1, rr * 0.5, Math.PI * 0.2, Math.PI * 1.1); ctx.stroke(); }
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 0.01 * K;
    for (const [x, y, rr] of curls.slice(11, 16)) { ctx.beginPath(); ctx.arc(x, y, rr * 0.6, Math.PI * 1.2, Math.PI * 1.5); ctx.stroke(); }
  } else {
  ctx.beginPath(); ctx.arc(0, 0, r * 1.05, Math.PI, Math.PI * 2);
  const fr = 0.46;
  ctx.lineTo(r * 0.85, -r * (fr - 0.04)); ctx.lineTo(r * 0.45, -r * (fr + 0.02)); ctx.lineTo(-r * 0.2, -r * (fr + 0.06)); ctx.lineTo(-r * 0.8, -r * fr);
  ctx.closePath(); ctx.fill(); stroke(0.022); ctx.stroke();
  }
  if (look.cowlick) {
    // фирменный вихор: закрученная прядь на макушке
    ctx.fillStyle = "#1b1615"; stroke(0.018);
    ctx.beginPath(); ctx.moveTo(-r * 0.12, -r * 1.0);
    ctx.bezierCurveTo(-r * 0.2, -r * 1.55, r * 0.35, -r * 1.75, r * 0.38, -r * 1.42);
    ctx.bezierCurveTo(r * 0.4, -r * 1.25, r * 0.15, -r * 1.25, r * 0.16, -r * 1.38);
    ctx.bezierCurveTo(r * 0.05, -r * 1.3, r * 0.1, -r * 1.12, r * 0.14, -r * 1.0);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  if (look.bow) {
    ctx.fillStyle = look.bow; stroke(0.014);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(r * 0.62, -r * 0.82); ctx.lineTo(r * 0.62 + s * r * 0.3, -r * 0.82 - r * 0.2); ctx.lineTo(r * 0.62 + s * r * 0.3, -r * 0.82 + r * 0.2); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(r * 0.62, -r * 0.82, r * 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  stroke(0.012, "#ffffff"); ctx.beginPath(); ctx.arc(-r * 0.15, -r * 0.2, r * 0.75, Math.PI * 1.25, Math.PI * 1.5); ctx.stroke();
  const eyes = E.eyes;
  const lx = (p.lookX ?? 0) * r;
  const [bt, bhh] = E.brow;
  for (const s of [-1, 1]) {
    const ex = s * r * 0.34, ey = -r * 0.02;
    ctx.fillStyle = INK;
    if (eyes === "oval") {
      ctx.beginPath(); ctx.ellipse(ex + lx * 0.06, ey, r * 0.095, r * 0.13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(ex + lx * 0.06 - r * 0.03, ey - r * 0.05, r * 0.03, r * 0.035, 0, 0, Math.PI * 2); ctx.fill();
    } else if (eyes === "wide") {
      ctx.fillStyle = "#fff"; stroke(0.016); ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.19, r * 0.15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(ex + lx * 0.09, ey + (E.look ?? 0) * -r * 0.1, r * 0.045, r * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    } else if (eyes === "lid") {
      ctx.beginPath(); ctx.ellipse(ex + lx * 0.05, ey + r * 0.02, r * 0.09, r * 0.08, 0, 0, Math.PI * 2); ctx.fill();
      stroke(0.018); ctx.beginPath(); ctx.moveTo(ex - r * 0.14, ey - r * 0.045); ctx.lineTo(ex + r * 0.14, ey - r * 0.045); ctx.stroke();
    } else if (eyes === "happy") {
      stroke(0.022); ctx.beginPath(); ctx.arc(ex, ey + r * 0.07, r * 0.12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else if (eyes === "squeeze") {
      stroke(0.022); ctx.beginPath(); ctx.moveTo(ex - s * r * 0.13, ey - r * 0.08); ctx.lineTo(ex + s * r * 0.09, ey); ctx.lineTo(ex - s * r * 0.13, ey + r * 0.08); ctx.stroke();
    }
    const by = ey - r * 0.27 - bhh * r * 2 - (eyes === "wide" ? 0.04 * r : 0);
    const inner = ex - s * r * 0.13, outer = ex + s * r * 0.15;
    stroke(0.028); ctx.beginPath(); ctx.moveTo(outer, by + bt * r * 0.07); ctx.lineTo((inner + outer) / 2, by - r * 0.02); ctx.lineTo(inner, by - bt * r * 0.14); ctx.stroke();
  }
  if (look.glasses) {
    const gr = r * 0.25;
    ctx.fillStyle = "rgba(200,230,255,0.25)"; stroke(0.022, look.glasses);
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * r * 0.34, -r * 0.02, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-r * 0.34 + gr, -r * 0.06); ctx.quadraticCurveTo(0, -r * 0.14, r * 0.34 - gr, -r * 0.06); ctx.stroke();
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * (r * 0.34 + gr), -r * 0.06); ctx.lineTo(sx * r * 0.97, -r * 0.12); ctx.stroke(); }
    stroke(0.008, "#ffffff"); for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * r * 0.34, -r * 0.02, gr * 0.72, Math.PI * 1.15, Math.PI * 1.4); ctx.stroke(); }
  }
  if (look.plaster) {
    ctx.save(); ctx.translate(r * 0.5, r * 0.4); ctx.rotate(-0.45);
    ctx.fillStyle = "#f2c79a"; stroke(0.01); ctx.beginPath(); ctx.roundRect(-r * 0.2, -r * 0.07, r * 0.4, r * 0.14, r * 0.06); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#e0a877"; ctx.fillRect(-r * 0.06, -r * 0.06, r * 0.12, r * 0.12);
    ctx.restore();
  }
  if (look.freckles) { ctx.fillStyle = "#c8876a"; for (const s of [-1, 1]) for (const [dx, dy] of [[0, 0], [0.09, 0.04], [-0.05, 0.07]]) { ctx.beginPath(); ctx.arc(s * r * (0.5 + dx), r * (0.2 + dy), r * 0.025, 0, Math.PI * 2); ctx.fill(); } }
  if (E.cheeks) { ctx.fillStyle = "#f0b3a4"; for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * r * 0.55, r * 0.3, r * 0.2, r * 0.14, 0, 0, Math.PI * 2); ctx.fill(); } }
  let [mt, mp] = E.mouth;
  const my = r * 0.45, mx = lx * 0.04;
  stroke(0.018);
  if (mt === "flat") { ctx.beginPath(); ctx.moveTo(mx - r * 0.17, my); ctx.quadraticCurveTo(mx, my - mp * r * 0.12, mx + r * 0.17, my); ctx.stroke(); }
  else if (mt === "smirk") { ctx.beginPath(); ctx.moveTo(mx - r * 0.14, my); ctx.quadraticCurveTo(mx + r * 0.05, my + r * 0.12, mx + r * 0.22, my - r * 0.08); ctx.stroke(); }
  else if (mt === "squiggle") { ctx.beginPath(); for (let i = 0; i <= 16; i++) { const x = -r * 0.22 + (i / 16) * r * 0.44; const yy = my + Math.sin((x / r) * 20) * r * 0.045; i ? ctx.lineTo(mx + x, yy) : ctx.moveTo(mx + x, yy); } ctx.stroke(); }
  else if (mt === "pressed") { stroke(0.022); ctx.beginPath(); ctx.moveTo(mx - r * 0.13, my); ctx.lineTo(mx + r * 0.13, my); ctx.stroke(); }
  else if (mt === "o") { ctx.fillStyle = "#5e1f22"; ctx.beginPath(); ctx.ellipse(mx, my, r * 0.07 * (0.7 + mp), r * 0.09 * (0.7 + mp), 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  else if (mt === "grin") {
    const mw = r * 0.36;
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(mx - mw, my - r * 0.05); ctx.quadraticCurveTo(mx, my + r * 0.36 * mp, mx + mw, my - r * 0.05); ctx.closePath(); ctx.fill(); ctx.stroke();
    stroke(0.008); for (const k of [-0.5, -0.17, 0.17, 0.5]) { ctx.beginPath(); ctx.moveTo(mx + k * mw, my - r * 0.04); ctx.lineTo(mx + k * mw * 0.95, my + r * 0.13 * mp); ctx.stroke(); }
  } else if (mt === "open") {
    const mw = r * 0.24, mh = r * 0.08 + r * 0.24 * mp;
    ctx.fillStyle = "#5e1f22"; ctx.beginPath(); ctx.moveTo(mx - mw, my - r * 0.05); ctx.quadraticCurveTo(mx, my - r * 0.05 + mh * 1.9, mx + mw, my - r * 0.05); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#d66a6c"; ctx.beginPath(); ctx.ellipse(mx, my + mh * 0.6, mw * 0.5, mh * 0.25, 0, 0, Math.PI * 2); ctx.fill();
    stroke(0.024, "#fff"); ctx.beginPath(); ctx.moveTo(mx - mw * 0.75, my - r * 0.025); ctx.lineTo(mx + mw * 0.75, my - r * 0.025); ctx.stroke();
  }
  if (E.sweat) { ctx.fillStyle = "#c9e6ff"; stroke(0.01, "#3d7fd0"); ctx.beginPath(); ctx.moveTo(r * 0.98, -r * 0.5); ctx.quadraticCurveTo(r * 1.1, -r * 0.25, r * 0.98, -r * 0.18); ctx.quadraticCurveTo(r * 0.86, -r * 0.25, r * 0.98, -r * 0.5); ctx.fill(); ctx.stroke(); }
  ctx.restore();
  limb(shF, hF, p.bendF ?? 0.12); hand(hF);
}

// Кот Бублик: рыжий, полосатый, вечно довольный.
function drawCat(ctx, x, y, s, mood = "smug") {
  const L = (w) => { ctx.lineWidth = w * s; ctx.strokeStyle = INK; };
  ctx.save(); ctx.translate(x, y); ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.beginPath(); ctx.ellipse(0, 0, 70 * s, 9 * s, 0, 0, Math.PI * 2); ctx.fill();
  // хвост
  L(16); ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(45 * s, -25 * s); ctx.bezierCurveTo(110 * s, -30 * s, 105 * s, -110 * s, 70 * s, -115 * s); ctx.stroke();
  L(10); ctx.strokeStyle = "#e8873a"; ctx.stroke();
  // тело
  ctx.fillStyle = "#e8873a"; L(5); ctx.beginPath(); ctx.ellipse(0, -48 * s, 58 * s, 48 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fbf3e4"; ctx.beginPath(); ctx.ellipse(-5 * s, -38 * s, 28 * s, 32 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#a9521c"; ctx.lineWidth = 6 * s; for (const a of [-0.4, 0, 0.4]) { ctx.beginPath(); ctx.arc(30 * s, -50 * s, 30 * s, a - 0.15, a + 0.15); ctx.stroke(); }
  // лапки
  ctx.fillStyle = "#fbf3e4"; L(4); for (const dx of [-25, 12]) { ctx.beginPath(); ctx.ellipse(dx * s, -6 * s, 15 * s, 9 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  // голова
  const hy = -120 * s;
  ctx.fillStyle = "#e8873a"; L(5);
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 18 * s, hy - 38 * s); ctx.lineTo(sx * 46 * s, hy - 70 * s); ctx.lineTo(sx * 50 * s, hy - 18 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#f2a9a0"; ctx.beginPath(); ctx.moveTo(sx * 26 * s, hy - 38 * s); ctx.lineTo(sx * 43 * s, hy - 58 * s); ctx.lineTo(sx * 44 * s, hy - 28 * s); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#e8873a"; }
  ctx.beginPath(); ctx.ellipse(0, hy, 55 * s, 46 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#a9521c"; ctx.lineWidth = 6 * s; for (const dx of [-12, 0, 12]) { ctx.beginPath(); ctx.moveTo(dx * s, hy - 44 * s); ctx.lineTo(dx * 0.8 * s, hy - 28 * s); ctx.stroke(); }
  ctx.fillStyle = "#fbf3e4"; ctx.beginPath(); ctx.ellipse(0, hy + 18 * s, 26 * s, 18 * s, 0, 0, Math.PI * 2); ctx.fill();
  // глаза: довольный прищур
  ctx.fillStyle = INK;
  for (const sx of [-1, 1]) {
    if (mood === "smug") { ctx.beginPath(); ctx.ellipse(sx * 21 * s, hy - 2 * s, 8 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill(); L(4); ctx.beginPath(); ctx.moveTo(sx * 31 * s, hy - 7 * s); ctx.lineTo(sx * 11 * s, hy - 7 * s); ctx.stroke(); }
    else { ctx.beginPath(); ctx.ellipse(sx * 21 * s, hy - 2 * s, 9 * s, 12 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(sx * 21 * s - 3 * s, hy - 7 * s, 3 * s, 0, 7); ctx.fill(); ctx.fillStyle = INK; }
  }
  ctx.fillStyle = "#e46b78"; ctx.beginPath(); ctx.moveTo(-6 * s, hy + 10 * s); ctx.lineTo(6 * s, hy + 10 * s); ctx.lineTo(0, hy + 17 * s); ctx.closePath(); ctx.fill();
  L(3.5); ctx.beginPath(); ctx.moveTo(0, hy + 17 * s); ctx.quadraticCurveTo(-6 * s, hy + 26 * s, -13 * s, hy + 20 * s); ctx.moveTo(0, hy + 17 * s); ctx.quadraticCurveTo(6 * s, hy + 26 * s, 13 * s, hy + 20 * s); ctx.stroke();
  L(2.5); for (const sx of [-1, 1]) for (const dy of [-3, 6]) { ctx.beginPath(); ctx.moveTo(sx * 30 * s, hy + 14 * s); ctx.lineTo(sx * 72 * s, hy + (14 + dy * 2) * s); ctx.stroke(); }
  // ошейник с бубликом-медальоном
  L(4); ctx.fillStyle = "#2f6fd6"; ctx.beginPath(); ctx.roundRect(-34 * s, hy + 38 * s, 68 * s, 10 * s, 5 * s); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e6b25a"; ctx.beginPath(); ctx.arc(0, hy + 56 * s, 10 * s, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e8873a"; ctx.beginPath(); ctx.arc(0, hy + 56 * s, 3.5 * s, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}
