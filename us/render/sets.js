// Общие локации и картинки для роликов про Гошу.
const GOSHA_LOOK = { body: "#f5c518", stripe: "#1f3a6e", hair: "curly", hairColor: "#a0522d", glasses: "#d6334a", backpack: "#3aa676", shoes: "#2f6fd6", plaster: true };
// ================================================================= картинки для плоскостей
function pWindow(t, ball) {
  return (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, "#8fd0ff"); sky.addColorStop(1, "#d9f1ff");
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    g.fillStyle = "#ffffff"; for (const [cx, cy, r] of [[0.25, 0.3, 0.12], [0.36, 0.26, 0.1], [0.72, 0.5, 0.09], [0.82, 0.46, 0.07]]) { g.beginPath(); g.arc(cx * w, cy * h, r * w, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#7cc36b"; g.beginPath(); g.ellipse(w * 0.3, h * 1.02, w * 0.5, h * 0.18, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#5aa65a"; g.beginPath(); g.ellipse(w * 0.85, h * 1.04, w * 0.45, h * 0.2, 0, 0, Math.PI * 2); g.fill();
    if (ball != null) {
      const bx = (0.1 + ball * 0.75) * w, by = h * (0.62 - Math.sin(ball * Math.PI) * 0.25), r = w * 0.07;
      g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = w * 0.012; g.setLineDash([w * 0.02, w * 0.02]);
      g.beginPath(); for (let k = 0; k <= 20; k++) { const b = (k / 20) * ball, x = (0.1 + b * 0.75) * w, y = h * (0.62 - Math.sin(b * Math.PI) * 0.25); k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
      g.save(); g.translate(bx, by); g.rotate(ball * 2);
      g.fillStyle = "#fff"; g.strokeStyle = "#20180f"; g.lineWidth = w * 0.01; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = "#20180f"; g.beginPath(); for (let k = 0; k < 5; k++) { const a = (k * 2 * Math.PI) / 5 - Math.PI / 2; g[k ? "lineTo" : "moveTo"](Math.cos(a) * r * 0.35, Math.sin(a) * r * 0.35); } g.fill();
      g.restore();
    }
    g.strokeStyle = "#f7f3ea"; g.lineWidth = w * 0.045; g.strokeRect(0, 0, w, h);
    g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h * 0.45); g.lineTo(w, h * 0.45); g.stroke();
    g.strokeStyle = "#20180f"; g.lineWidth = w * 0.008; g.strokeRect(w * 0.022, h * 0.022, w * 0.956, h * 0.956);
  };
}
const pDoor = (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, "#3b3350"); gr.addColorStop(1, "#5a4f73");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(255,220,160,0.25)"; g.fillRect(w * 0.15, h * 0.55, w * 0.7, h * 0.45);
  g.fillStyle = "#c97b4a"; g.strokeStyle = "#20180f"; g.lineWidth = w * 0.02;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(w * 0.28, h * 0.05); g.lineTo(w * 0.28, h * 0.97); g.lineTo(0, h); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#e3c27a"; g.beginPath(); g.arc(w * 0.22, h * 0.52, w * 0.025, 0, Math.PI * 2); g.fill();
};
const pClock = (g, w, h) => {
  const r = w / 2 - 4; g.fillStyle = "#fbf7ea"; g.beginPath(); g.arc(w / 2, h / 2, r, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "#1d1f23"; g.lineWidth = w * 0.06; g.stroke();
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; g.lineWidth = w * (i % 3 ? 0.015 : 0.03); g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * r * 0.75, h / 2 - Math.cos(a) * r * 0.75); g.lineTo(w / 2 + Math.sin(a) * r * 0.88, h / 2 - Math.cos(a) * r * 0.88); g.stroke(); }
  g.lineWidth = w * 0.04; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + r * 0.45, h / 2 - r * 0.1); g.stroke();
  g.lineWidth = w * 0.025; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 - r * 0.1, h / 2 - r * 0.7); g.stroke();
};
const pCalendar = (g, w, h) => {
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, w, h); g.fillStyle = "#d6453d"; g.fillRect(0, 0, w, h * 0.3);
  g.fillStyle = "#fff"; g.font = `900 ${h * 0.17}px Inter, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("OCTOBER", w / 2, h * 0.15);
  g.fillStyle = "#20180f"; g.font = `900 ${h * 0.45}px Inter, sans-serif`; g.fillText("29", w / 2, h * 0.63);
};
const pTiles = (g, w, h) => {
  g.fillStyle = "#e8f2f0"; g.fillRect(0, 0, w, h); const n = 24, s = w / n;
  g.strokeStyle = "rgba(60,110,110,0.35)"; g.lineWidth = Math.max(1, s * 0.06);
  for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, h); g.stroke(); }
  for (let j = 0; j <= h / s; j++) { g.beginPath(); g.moveTo(0, j * s); g.lineTo(w, j * s); g.stroke(); }
  g.fillStyle = "rgba(47,143,157,0.35)"; for (let i = 0; i < n; i += 3) for (let j = 0; j < h / s; j += 2) g.fillRect(i * s + ((j / 2) % 2) * s, j * s, s, s);
};
const pCabinet = (n) => (g, w, h) => {
  g.strokeStyle = "rgba(20,24,15,0.85)"; g.lineWidth = Math.max(2, w * 0.004);
  for (let i = 0; i < n; i++) { const x = (i * w) / n; g.strokeRect(x + w * 0.012, h * 0.06, w / n - w * 0.024, h * 0.88);
    g.fillStyle = "#e9e1cf"; g.fillRect(x + w / n / 2 - w * 0.03, h * 0.14, w * 0.06, h * 0.05); }
};
const pFridgeDoor = (g, w, h) => {
  g.strokeStyle = "rgba(20,24,15,0.85)"; g.lineWidth = Math.max(2, w * 0.012); g.beginPath(); g.moveTo(0, h * 0.36); g.lineTo(w, h * 0.36); g.stroke();
  g.fillStyle = "#c9ccd1"; g.fillRect(w * 0.82, h * 0.12, w * 0.05, h * 0.18); g.fillRect(w * 0.82, h * 0.42, w * 0.05, h * 0.22);
  const mags = [["#d6453d", 0.2, 0.5], ["#2f6fd6", 0.45, 0.58], ["#3aa676", 0.28, 0.7]];
  for (const [c, x, y] of mags) { g.fillStyle = c; g.beginPath(); g.arc(x * w, y * h, w * 0.05, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = "#fffbe6"; g.save(); g.translate(w * 0.42, h * 0.78); g.rotate(-0.08); g.fillRect(-w * 0.22, -h * 0.07, w * 0.44, h * 0.14);
  g.fillStyle = "#20180f"; g.font = `800 ${h * 0.035}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("BUY A", 0, -h * 0.015); g.fillText("FLYSWATTER", 0, h * 0.035); g.restore();
};
const pPicture = (g, w, h) => {
  g.fillStyle = "#fff3d6"; g.fillRect(0, 0, w, h); g.fillStyle = "#ffb347"; g.beginPath(); g.arc(w * 0.72, h * 0.32, w * 0.12, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#6aa84f"; g.beginPath(); g.moveTo(0, h); g.lineTo(w * 0.35, h * 0.45); g.lineTo(w * 0.62, h); g.fill();
  g.fillStyle = "#3f8a4b"; g.beginPath(); g.moveTo(w * 0.4, h); g.lineTo(w * 0.7, h * 0.55); g.lineTo(w, h); g.fill();
  g.strokeStyle = "#7a4a2c"; g.lineWidth = w * 0.06; g.strokeRect(0, 0, w, h);
};
// мультик на ТВ: персонаж-шарик прыгает, но кадры меняются рывками (слайд-шоу)
function pTV(t, choppy) {
  return (g, w, h) => {
    const tt = choppy ? Math.floor(t / 0.7) * 0.7 : t;
    g.fillStyle = "#73c2ff"; g.fillRect(0, 0, w, h); g.fillStyle = "#59b85a"; g.fillRect(0, h * 0.72, w, h * 0.28);
    g.fillStyle = "#ffe066"; g.beginPath(); g.arc(w * 0.85, h * 0.2, h * 0.1, 0, Math.PI * 2); g.fill();
    const x = ((tt * 0.25) % 1) * w * 0.8 + w * 0.1, y = h * 0.7 - Math.abs(Math.sin(tt * 3)) * h * 0.35;
    g.fillStyle = "#ff6b6b"; g.strokeStyle = "#20180f"; g.lineWidth = w * 0.012; g.beginPath(); g.arc(x, y - h * 0.08, h * 0.08, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = "#20180f"; g.beginPath(); g.arc(x - h * 0.025, y - h * 0.1, h * 0.012, 0, 7); g.arc(x + h * 0.025, y - h * 0.1, h * 0.012, 0, 7); g.fill();
    if (choppy) { g.fillStyle = "rgba(0,0,0,0.55)"; g.fillRect(w * 0.03, h * 0.05, w * 0.32, h * 0.16); g.fillStyle = "#fff"; g.font = `800 ${h * 0.09}px Inter, sans-serif`; g.textBaseline = "middle"; g.fillText("❚❚ frame " + (Math.floor(t / 0.7) % 9 + 1), w * 0.05, h * 0.13); }
    g.fillStyle = "rgba(255,255,255,0.12)"; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * 0.45, 0); g.lineTo(w * 0.2, h); g.lineTo(0, h); g.fill();
  };
}
function pPhone(t, t0) {
  return (g, w, h) => {
    g.fillStyle = "#0d1016"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#1c2433"; g.fillRect(w * 0.06, h * 0.05, w * 0.88, h * 0.9);
    const k = clamp((t - t0) / 6, 0, 1);
    g.fillStyle = "#7cc8ff"; g.beginPath(); const dy = h * (0.2 + k * 0.5); g.moveTo(w / 2, dy - h * 0.14); g.quadraticCurveTo(w * 0.78, dy + h * 0.02, w / 2, dy + h * 0.1); g.quadraticCurveTo(w * 0.22, dy + h * 0.02, w / 2, dy - h * 0.14); g.fill();
    g.fillStyle = "#ff3b30"; g.beginPath(); g.arc(w * 0.18, h * 0.1, w * 0.05, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = `900 ${w * 0.12}px Inter, sans-serif`; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("SLOW", w * 0.27, h * 0.1);
    g.font = `800 ${w * 0.11}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("240 fps", w / 2, h * 0.88);
  };
}

// ================================================================= локации
function kitchen(sc, t, o = {}) {
  const WALL = "#f2c9a0", WALL2 = "#e6b98d", FLOOR = "#c98f5a", TEAL = "#2f8f9d";
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 0, 4], [-3, 0, 4]], FLOOR, false);
  sc.plane([[-3, 3, -2], [-3, 3, 4], [3, 3, 4], [3, 3, -2]], "#efe8da");
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 3, -2], [-3, 3, -2]], WALL);
  sc.plane([[-3, 0, 4], [-3, 0, -2], [-3, 3, -2], [-3, 3, 4]], WALL2);
  sc.plane([[3, 0, -2], [3, 0, 4], [3, 3, 4], [3, 3, -2]], WALL2);
  // плинтус и доски пола
  sc.plane([[-3, 0, -1.99], [3, 0, -1.99], [3, 0.1, -1.99], [-3, 0.1, -1.99]], "#7a4a2c");
  for (let x = -2.7; x < 3; x += 0.6) sc.bg.push({ pts: [[x, 0.001, -2], [x + 0.012, 0.001, -2], [x + 0.012, 0.001, 4], [x, 0.001, 4]], col: "rgba(90,50,25,0.35)", line: false });
  sc.decal([-2.2, 1.05, -1.985], 0.95, 2.1, 0, pDoor, "door", { zb: 0 });
  sc.decal([0.2, 1.8, -1.985], 1.25, 0.95, 0, pWindow(t, o.ball), o.ball != null ? null : "window", { live: o.ball != null, zb: 0 });
  sc.decal([-1.05, 2.35, -1.985], 0.38, 0.38, 0, pClock, "clock", { frame: false, zb: 0 });
  sc.decal([-1.05, 1.6, -1.985], 0.36, 0.46, 0, pCalendar, "calendar", { zb: 0 });
  sc.decal([1.1, 1.22, -1.985], 3.8, 0.56, 0, pTiles, "tiles", { frame: false, zb: 0 });
  // столешница и шкафчики
  sc.box([1.1, 0.45, -1.7], [3.8, 0.9, 0.6], TEAL, { zb: 0.3 });
  sc.decal([1.1, 0.45, -1.395], 3.8, 0.84, 0, pCabinet(5), "cab", { frame: false, zb: 0.25 });
  sc.box([1.1, 0.93, -1.68], [3.9, 0.06, 0.66], "#8a5a3c", { zb: 0.2 });
  sc.box([0.2, 0.965, -1.66], [0.72, 0.02, 0.46], "#b8c2cc", { line: true, zb: 0.15 });
  sc.box([2.05, 2.18, -1.8], [1.6, 0.7, 0.36], TEAL, { zb: 0.3 });
  sc.decal([2.05, 2.18, -1.615], 1.6, 0.66, 0, pCabinet(3), "cab2", { frame: false, zb: 0.25 });
  // кран
  sc.box([0.2, 1.15, -1.9], [0.06, 0.4, 0.06], "#c9ccd1", { zb: 0.1 });
  sc.box([0.2, 1.33, -1.77], [0.06, 0.06, 0.3], "#c9ccd1", { zb: 0.05 });
  // холодильник
  sc.box([2.6, 0.97, -1.55], [0.75, 1.94, 0.75], "#eef1f4", { zb: 0.2 });
  sc.decal([2.6, 0.97, -1.17], 0.73, 1.9, 0, pFridgeDoor, "fridge", { frame: false, zb: 0.15 });
  // чайник, растение, кружки
  sc.box([1.45, 1.07, -1.72], [0.24, 0.22, 0.2], "#d6453d", { zb: 0.1 });
  sc.box([1.45, 1.2, -1.72], [0.1, 0.04, 0.1], "#20180f", { zb: 0.09 });
  sc.box([-0.55, 1.08, -1.75], [0.22, 0.24, 0.22], "#b5653a", { zb: 0.1 });
  for (let i = 0; i < 6; i++) sc.box([-0.55 + Math.cos(i * 1.1) * 0.06, 1.38, -1.75 + Math.sin(i * 1.1) * 0.06], [0.05, 0.4, 0.02], "#3f8a4b", { rotY: i, line: false, zb: 0.09 });
  sc.box([0.85, 1.02, -1.6], [0.1, 0.12, 0.1], "#2f6fd6", { zb: 0.08 });
  // стол со стулом
  if (!o.noTable) {
  sc.box([0.6, 0.75, -0.35], [1.3, 0.06, 0.8], "#b8784a", { zb: 0.2 });
  for (const [dx, dz] of [[-0.58, -0.33], [0.58, -0.33], [-0.58, 0.33], [0.58, 0.33]]) if (!(o.noFrontLegs && dz > 0)) sc.box([0.6 + dx, 0.36, -0.35 + dz], [0.06, 0.72, 0.06], "#7a4a2c", { shadow: false, zb: 0.25 });
  sc.box([1.55, 0.46, -0.35], [0.46, 0.06, 0.46], "#e46b2b", { zb: 0.3 }); sc.box([1.76, 0.8, -0.35], [0.05, 0.62, 0.46], "#e46b2b", { zb: 0.3 });
  sc.box([1.55, 0.22, -0.35], [0.05, 0.44, 0.05], "#2a2d33", { shadow: false, zb: 0.3 });
  if (!o.noBowl) { sc.box([0.95, 0.81, -0.5], [0.3, 0.07, 0.3], "#f2f2f2", { zb: 0.1 });
    sc.sprite([0.95, 0.88, -0.5], 0.09, (g, x, y, k) => { for (const [c, dx, dy] of [["#e8453c", -0.05, 0], ["#f2c230", 0.05, -0.01], ["#3aa676", 0, -0.05]]) { g.fillStyle = c; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.arc(x + dx * k, y + dy * k, 0.055 * k, 0, 7); g.fill(); g.stroke(); } }); }
  }
  // лампа на шнуре
  const lampOn = o.lamp ?? 1;
  sc.box([0.4, 2.85, -0.6], [0.02, 0.3, 0.02], "#20180f", { line: false, shadow: false });
  sc.box([0.4, 2.62, -0.6], [0.42, 0.2, 0.42], lampOn > 0.5 ? "#fff2b8" : "#7b7466", { shadow: false, glow: lampOn > 0.5 ? 0.25 : 0 });
}
function livingRoom(sc, t, o = {}) {
  const WALL = "#a9cfa4", WALL2 = "#97c092";
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 0, 4], [-3, 0, 4]], "#c2a07a", false);
  sc.plane([[-3, 3, -2], [-3, 3, 4], [3, 3, 4], [3, 3, -2]], "#efe8da");
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 3, -2], [-3, 3, -2]], WALL);
  sc.plane([[-3, 0, 4], [-3, 0, -2], [-3, 3, -2], [-3, 3, 4]], WALL2);
  sc.plane([[3, 0, -2], [3, 0, 4], [3, 3, 4], [3, 3, -2]], WALL2);
  sc.plane([[-3, 0, -1.99], [3, 0, -1.99], [3, 0.1, -1.99], [-3, 0.1, -1.99]], "#7a4a2c");
  sc.bg.push({ pts: [[-1.6, 0.002, -1.4], [1.9, 0.002, -1.4], [1.9, 0.002, 0.6], [-1.6, 0.002, 0.6]], col: "#d9534f", line: true });
  sc.bg.push({ pts: [[-1.4, 0.003, -1.25], [1.7, 0.003, -1.25], [1.7, 0.003, 0.45], [-1.4, 0.003, 0.45]], col: "#e8746a", line: false });
  sc.decal([-1.3, 1.85, -1.985], 0.9, 0.62, 0, pPicture, "pic", { zb: 0 });
  sc.decal([-2.3, 2.35, -1.985], 0.38, 0.38, 0, pClock, "clock", { frame: false, zb: 0 });
  // диван
  sc.box([-1.5, 0.25, -1.5], [1.8, 0.5, 0.8], "#4c6fb0", { zb: 0.3 });
  sc.box([-1.5, 0.75, -1.83], [1.8, 0.6, 0.18], "#4c6fb0", { zb: 0.35 });
  for (const s of [-1, 1]) sc.box([-1.5 + s * 0.95, 0.42, -1.5], [0.18, 0.5, 0.8], "#3d5c96", { zb: 0.3 });
  sc.box([-1.95, 0.62, -1.55], [0.42, 0.3, 0.14], "#f2c230", { rotY: 0.2, zb: 0.2 });
  // ТВ
  sc.box([1.35, 0.3, -1.65], [1.5, 0.6, 0.5], "#7a4a2c", { zb: 0.3 });
  sc.box([1.35, 1.12, -1.85], [1.25, 0.76, 0.07], "#22252b", { zb: 0.3 });
  sc.decal([1.35, 1.12, -1.81], 1.14, 0.66, 0, o.tvPaint ?? pTV(t, o.choppy), null, { live: true, frame: false, zb: 0.2 });
  if (o.twoTV) { sc.box([-0.25, 1.12, -1.85], [1.25, 0.76, 0.07], "#22252b", { zb: 0.3 }); sc.box([-0.25, 0.3, -1.65], [1.3, 0.6, 0.5], "#7a4a2c", { zb: 0.3 });
    sc.decal([-0.25, 1.12, -1.81], 1.14, 0.66, 0, o.tv2Paint, null, { live: true, frame: false, zb: 0.2 }); }
  if (o.door) sc.decal([-2.985, 1.05, -0.6], 0.95, 2.1, Math.PI / 2, pDoor, "doorL", { zb: 0 });
  sc.box([0.9, 0.67, -1.6], [0.25, 0.14, 0.2], "#e6e6e6", { zb: 0.1 });
  // полка с книгами, торшер, растение
  sc.box([2.6, 0.9, -1.8], [0.7, 1.8, 0.35], "#8a5a3c", { zb: 0.3 });
  const cols = ["#d64545", "#2f6fd6", "#f2c230", "#3f8a4b", "#efe6d2"];
  for (let k = 0; k < 3; k++) for (let i = 0; i < 6; i++) sc.box([2.33 + i * 0.1, 0.42 + k * 0.5, -1.62], [0.07, 0.3 - (i % 3) * 0.03, 0.05], cols[(i + k) % 5], { line: i % 2 === 0, shadow: false, zb: 0.05 });
  sc.box([-2.6, 0.75, -1.4], [0.05, 1.5, 0.05], "#2a2d33", { zb: 0.2 });
  sc.box([-2.6, 1.6, -1.4], [0.4, 0.3, 0.4], "#fff2b8", { glow: 0.2, zb: 0.2 });
  sc.box([0.2, 0.18, -1.75], [0.3, 0.36, 0.3], "#b5653a", { zb: 0.2 });
  for (let i = 0; i < 7; i++) sc.box([0.2 + Math.cos(i) * 0.08, 0.6, -1.75 + Math.sin(i) * 0.08], [0.06, 0.55, 0.02], "#3f8a4b", { rotY: i, line: false, zb: 0.19 });
}


// ================================================================= новые картинки
function pSky(t, o = {}) {   // окно: день/ночь, солнце, луна, звёзды, летучая мышь
  return (g, w, h) => {
    const night = o.night ?? 0;
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, mix("#8fd0ff", "#0b1030", night)); sky.addColorStop(1, mix("#d9f1ff", "#1b2350", night));
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    if (o.stars) { g.fillStyle = "#fff"; for (let i = 0; i < 40; i++) { const x = ((i * 97) % 100) / 100 * w, y = ((i * 57) % 70) / 100 * h, tw = 0.5 + 0.5 * Math.sin(t * 3 + i); g.globalAlpha = o.stars * tw; g.beginPath(); g.arc(x, y, w * 0.006 + (i % 3) * w * 0.002, 0, 7); g.fill(); } g.globalAlpha = 1; }
    if (o.sun) { const r = w * 0.13; g.fillStyle = "#ffe066"; g.strokeStyle = "#20180f"; g.lineWidth = w * 0.01; g.beginPath(); g.arc(w * 0.68, h * 0.3, r, 0, 7); g.fill(); g.stroke();
      g.strokeStyle = "#ffd23f"; g.lineWidth = w * 0.015; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + t * 0.3; g.beginPath(); g.moveTo(w * 0.68 + Math.cos(a) * r * 1.25, h * 0.3 + Math.sin(a) * r * 1.25); g.lineTo(w * 0.68 + Math.cos(a) * r * 1.55, h * 0.3 + Math.sin(a) * r * 1.55); g.stroke(); } }
    if (o.moon) { g.globalAlpha = o.moon; g.fillStyle = "#f4f1d0"; g.beginPath(); g.arc(w * 0.3, h * 0.28, w * 0.09, 0, 7); g.fill(); g.fillStyle = mix("#8fd0ff", "#0b1030", night); g.beginPath(); g.arc(w * 0.34, h * 0.25, w * 0.08, 0, 7); g.fill(); g.globalAlpha = 1; }
    g.fillStyle = mix("#7cc36b", "#1d2e2a", night); g.beginPath(); g.ellipse(w * 0.3, h * 1.02, w * 0.5, h * 0.18, 0, 0, 7); g.fill();
    g.fillStyle = mix("#5aa65a", "#16251f", night); g.beginPath(); g.ellipse(w * 0.85, h * 1.04, w * 0.45, h * 0.2, 0, 0, 7); g.fill();
    if (o.extra) o.extra(g, w, h);
    g.strokeStyle = "#f7f3ea"; g.lineWidth = w * 0.045; g.strokeRect(0, 0, w, h);
    g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h * 0.45); g.lineTo(w, h * 0.45); g.stroke();
  };
}
function mix(a, b, k) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k)); return `rgb(${c.join(",")})`; }
const pMirror = (g, w, h) => { g.fillStyle = "#cfe3f2"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,0.7)"; for (const [x, ww] of [[0.25, 0.08], [0.42, 0.03]]) { g.save(); g.translate(w * x, 0); g.rotate(0.35); g.fillRect(0, -h * 0.2, w * ww, h * 1.4); g.restore(); } g.strokeStyle = "#c8a24a"; g.lineWidth = w * 0.06; g.strokeRect(0, 0, w, h); };
const pPoster = (txt, bg, fg) => (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = `900 ${h * 0.22}px Inter, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; txt.split("\n").forEach((l, i, arr) => g.fillText(l, w / 2, h / 2 + (i - (arr.length - 1) / 2) * h * 0.26)); };
const pFacade = (col, win) => (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); const nx = Math.max(2, Math.round(w / h * 3)), ny = 3;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const x = (i + 0.2) * w / nx, y = (j + 0.2) * h / ny, ww = w / nx * 0.6, hh = h / ny * 0.55; g.fillStyle = win ?? "#a9d8ff"; g.fillRect(x, y, ww, hh); g.strokeStyle = "#20180f"; g.lineWidth = w * 0.006; g.strokeRect(x, y, ww, hh); g.beginPath(); g.moveTo(x + ww / 2, y); g.lineTo(x + ww / 2, y + hh); g.stroke(); } };
function pFootball(t) { return (g, w, h) => { g.fillStyle = "#3f9a45"; g.fillRect(0, 0, w, h); g.strokeStyle = "#fff"; g.lineWidth = w * 0.01; g.strokeRect(w * 0.05, h * 0.08, w * 0.9, h * 0.84); g.beginPath(); g.moveTo(w / 2, h * 0.08); g.lineTo(w / 2, h * 0.92); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, h * 0.16, 0, 7); g.stroke();
  const bx = w * (0.5 + 0.35 * Math.sin(t * 1.7)), by = h * (0.5 + 0.25 * Math.sin(t * 2.3)); g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, h * 0.05, 0, 7); g.fill();
  for (const [c, k] of [["#e8453c", 0], ["#2f6fd6", 1]]) for (let i = 0; i < 3; i++) { g.fillStyle = c; g.beginPath(); g.arc(w * (0.25 + k * 0.5 + 0.08 * Math.sin(t + i * 2)), h * (0.3 + i * 0.2), h * 0.04, 0, 7); g.fill(); } }; }
function pDogTV(t, jump) { return (g, w, h) => { g.fillStyle = "#ffe8b0"; g.fillRect(0, 0, w, h); g.fillStyle = "#7bc96f"; g.fillRect(0, h * 0.75, w, h * 0.25);
  const y = h * 0.62 - (jump ? Math.abs(Math.sin(t * 9)) * h * 0.25 : 0); g.fillStyle = "#c98a4b"; g.strokeStyle = "#20180f"; g.lineWidth = w * 0.01;
  g.beginPath(); g.ellipse(w * 0.45, y, w * 0.12, h * 0.1, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(w * 0.6, y - h * 0.1, h * 0.1, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "#8a5a2b"; g.beginPath(); g.ellipse(w * 0.66, y - h * 0.2, w * 0.025, h * 0.08, 0.5, 0, 7); g.fill(); g.fillStyle = "#20180f"; g.beginPath(); g.arc(w * 0.62, y - h * 0.12, h * 0.015, 0, 7); g.fill();
  if (jump) { g.fillStyle = "#20180f"; g.font = `900 ${h * 0.14}px Inter, sans-serif`; g.fillText("!", w * 0.7, y - h * 0.3); } }; }

// ================================================================= новые локации
function bathroom(sc, t, o = {}) {
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 0, 4], [-3, 0, 4]], "#e9eef2", false);
  sc.plane([[-3, 3, -2], [-3, 3, 4], [3, 3, 4], [3, 3, -2]], "#f4f4f0");
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 3, -2], [-3, 3, -2]], "#9fd3e0");
  sc.plane([[-3, 0, 4], [-3, 0, -2], [-3, 3, -2], [-3, 3, 4]], "#8cc6d4");
  sc.plane([[3, 0, -2], [3, 0, 4], [3, 3, 4], [3, 3, -2]], "#8cc6d4");
  for (let x = -2.7; x < 3; x += 0.3) sc.bg.push({ pts: [[x, 0.001, -2], [x + 0.01, 0.001, -2], [x + 0.01, 0.001, 4], [x, 0.001, 4]], col: "rgba(120,140,150,0.35)", line: false });
  sc.decal([0.3, 1.25, -1.985], 3.6, 0.9, 0, pTiles, "btiles", { frame: false, zb: 0 });
  sc.decal([0.3, 1.95, -1.98], 0.95, 0.85, 0, pMirror, "mirror", { zb: 0, lw: 4 });
  sc.box([0.3, 0.42, -1.75], [0.9, 0.84, 0.5], "#f4f4f0", { zb: 0.3 }); sc.box([0.3, 0.86, -1.72], [0.95, 0.06, 0.55], "#e2e8ec", { zb: 0.2 });
  sc.box([0.3, 0.88, -1.72], [0.5, 0.02, 0.32], "#b8c2cc", { zb: 0.15 }); sc.box([0.3, 1.0, -1.93], [0.05, 0.25, 0.05], "#c9ccd1", { zb: 0.1 });
  sc.box([0.7, 0.99, -1.8], [0.1, 0.18, 0.1], "#2f9e9a", { zb: 0.08 });
  sc.box([0.68, 1.13, -1.8], [0.015, 0.16, 0.015], "#d6453d", { line: false, zb: 0.07 }); sc.box([0.73, 1.12, -1.8], [0.015, 0.15, 0.015], "#2f6fd6", { line: false, zb: 0.07 });
  sc.box([-1.9, 0.3, -1.4], [1.6, 0.6, 0.8], "#ffffff", { zb: 0.3 }); sc.box([-1.9, 0.62, -1.4], [1.4, 0.04, 0.6], "#9fd3e0", { line: false, zb: 0.25 });
  sc.box([1.6, 1.4, -1.97], [0.08, 0.08, 0.04], "#c9ccd1", { zb: 0.1 }); sc.box([1.6, 1.05, -1.93], [0.45, 0.7, 0.04], "#e8453c", { zb: 0.1 });
  sc.box([2.4, 1.6, -1.85], [0.6, 0.05, 0.25], "#ffffff", { zb: 0.2 }); sc.box([2.3, 1.7, -1.85], [0.12, 0.16, 0.1], "#f2c230", { zb: 0.1 }); sc.box([2.5, 1.7, -1.85], [0.1, 0.2, 0.1], "#8f63d2", { zb: 0.1 });
  sc.box([0.3, 2.62, -1.9], [0.7, 0.08, 0.1], "#fff2b8", { glow: 0.25, shadow: false });
  sc.box([1.3, 0.35, -1.7], [0.35, 0.7, 0.35], "#f4f4f0", { zb: 0.3 }); sc.box([1.3, 0.75, -1.75], [0.38, 0.1, 0.3], "#f4f4f0", { zb: 0.3 });
}
function bedroom(sc, t, o = {}) {
  const WALL = o.wall ?? "#c9b5e8";
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 0, 4], [-3, 0, 4]], "#b98b5e", false);
  sc.plane([[-3, 3, -2], [-3, 3, 4], [3, 3, 4], [3, 3, -2]], "#efe8da");
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 3, -2], [-3, 3, -2]], WALL);
  sc.plane([[-3, 0, 4], [-3, 0, -2], [-3, 3, -2], [-3, 3, 4]], shadeHex(WALL, 0.9));
  sc.plane([[3, 0, -2], [3, 0, 4], [3, 3, 4], [3, 3, -2]], shadeHex(WALL, 0.9));
  sc.plane([[-3, 0, -1.99], [3, 0, -1.99], [3, 0.1, -1.99], [-3, 0.1, -1.99]], "#7a4a2c");
  sc.bg.push({ pts: [[-1.0, 0.002, -1.3], [1.2, 0.002, -1.3], [1.2, 0.002, 0.3], [-1.0, 0.002, 0.3]], col: "#f2c230", line: true });
  sc.decal([0.2, 1.75, -1.985], 1.25, 1.0, 0, o.window ?? pSky(t, {}), null, { live: true, zb: 0 });
  sc.decal([-1.5, 1.8, -1.985], 0.6, 0.8, 0, pPoster("SPACE", "#20335a", "#f5c518"), "poster", { zb: 0 });
  sc.decal([2.0, 1.8, -1.985], 0.5, 0.5, 0, pClock, "clockB", { frame: false, zb: 0 });
  // кровать
  sc.box([-1.6, 0.25, -1.0], [1.1, 0.5, 2.0], "#8a5a3c", { zb: 0.3 });
  sc.box([-1.6, 0.55, -1.0], [1.05, 0.12, 1.95], "#f7f3ea", { zb: 0.25 });
  sc.box([-1.6, 0.66, -0.75], [1.08, 0.12, 1.4], "#3aa676", { zb: 0.2 });
  sc.box([-1.6, 0.68, -1.75], [0.7, 0.15, 0.35], "#ffffff", { zb: 0.2 });
  sc.box([-1.6, 0.8, -1.98], [1.1, 0.6, 0.06], "#7a4a2c", { zb: 0.3 });
  // стол, лампа, тумбочка
  sc.box([1.9, 0.72, -1.6], [1.2, 0.05, 0.6], "#b8784a", { zb: 0.25 });
  for (const dx of [-0.55, 0.55]) sc.box([1.9 + dx, 0.36, -1.6], [0.06, 0.72, 0.55], "#7a4a2c", { shadow: false, zb: 0.3 });
  sc.box([2.2, 0.95, -1.7], [0.04, 0.4, 0.04], "#2a2d33", { zb: 0.1 }); sc.box([2.2, 1.18, -1.65], [0.25, 0.14, 0.2], o.lamp === false ? "#555" : "#fff2b8", { glow: o.lamp === false ? 0 : 0.3, zb: 0.1 });
  sc.box([1.6, 0.8, -1.6], [0.3, 0.12, 0.22], "#2f6fd6", { zb: 0.1 });
  sc.box([-0.75, 0.28, -1.75], [0.45, 0.56, 0.4], "#8a5a3c", { zb: 0.3 });
  sc.box([-0.75, 0.62, -1.75], [0.16, 0.12, 0.1], "#d6453d", { zb: 0.1 });
}
function street(sc, t, o = {}) {
  const night = o.night ?? 0;
  sc.plane([[-30, 0, -6], [30, 0, -6], [30, 0, 10], [-30, 0, 10]], mix("#6b6f78", "#2a2c33", night), false);
  sc.plane([[-30, 0.001, -3.5], [30, 0.001, -3.5], [30, 0.001, -1.2], [-30, 0.001, -1.2]], mix("#c9c2b4", "#4a4740", night), true);
  for (let x = -20; x < 20; x += 3) sc.bg.push({ pts: [[x, 0.002, 1.2], [x + 1.5, 0.002, 1.2], [x + 1.5, 0.002, 1.35], [x, 0.002, 1.35]], col: mix("#f2f2f2", "#777", night), line: false });
  sc.plane([[-30, 0, -9], [30, 0, -9], [30, 18, -9], [-30, 18, -9]], mix("#8fd0ff", "#0b1030", night), false);
  const houses = [[-6, 3.2, "#e8a87c"], [-2.2, 4.2, "#8fb8de"], [1.6, 3.6, "#f2c94c"], [5.4, 4.6, "#c38fd6"], [9.2, 3.4, "#9cc59a"]];
  for (const [x, h, c] of houses) { sc.box([x, h / 2, -4.5], [3.6, h, 1.8], c, { zb: 0.5 });
    sc.decal([x, h / 2 + 0.2, -3.595], 3.4, h - 0.6, 0, pFacade(c, night > 0.5 ? "#ffd27a" : "#a9d8ff"), "fac" + x + night, { frame: false, zb: 0.45 });
    sc.box([x, h + 0.25, -4.5], [3.8, 0.5, 2.0], shadeHex(c, 0.7), { zb: 0.5 }); }
  for (const x of [-4.2, 0.0, 3.5, 7.4]) { sc.box([x, 0.9, -3.0], [0.18, 1.8, 0.18], "#7a4a2c", { zb: 0.2 });
    sc.sprite([x, 2.3, -3.0], 0.1, (g, X, Y, k) => { g.fillStyle = mix("#4fa35a", "#1f3a27", night); g.strokeStyle = INKC; g.lineWidth = 3; for (const [dx, dy, r] of [[0, 0, 0.75], [-0.45, 0.25, 0.5], [0.45, 0.25, 0.5]]) { g.beginPath(); g.arc(X + dx * k, Y + dy * k, r * k, 0, 7); g.fill(); g.stroke(); } }); }
  sc.box([2.2, 2.0, -2.0], [0.1, 4.0, 0.1], "#3a3d44", { zb: 0.2 }); sc.box([2.0, 4.0, -2.0], [0.5, 0.12, 0.25], night > 0.5 ? "#ffe9a8" : "#d8d8d8", { glow: night > 0.5 ? 0.6 : 0, shadow: false });
  if (!o.noCars) for (const [x, c] of (o.cars ?? [[-3.0, "#d6453d"], [4.6, "#2f6fd6"]])) { const cx = typeof x === "function" ? x(t) : x;
    sc.box([cx, 0.45, 0.2], [2.2, 0.6, 1.0], c, { zb: 0.2 }); sc.box([cx - 0.1, 0.95, 0.2], [1.2, 0.45, 0.9], c, { zb: 0.19 });
    sc.decal([cx - 0.1, 0.95, 0.655], 1.1, 0.38, 0, (g, w, h) => { g.fillStyle = "#bfe6ff"; g.fillRect(0, 0, w, h); g.strokeStyle = "#20180f"; g.lineWidth = w * 0.02; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); }, "carwin", { zb: 0.15 });
    for (const dx of [-0.7, 0.7]) sc.box([cx + dx, 0.18, 0.7], [0.36, 0.36, 0.1], "#20180f", { zb: 0.1, shadow: false }); }
}
function bigTable(sc, t, o = {}) {   // мир муравья: стол — это «пол», предметы огромные
  sc.plane([[-30, 0, -20], [30, 0, -20], [30, 0, 4], [-30, 0, 4]], "#c98f5a", false);
  for (let x = -6; x < 6; x += 0.9) sc.bg.push({ pts: [[x, 0.001, -20], [x + 0.02, 0.001, -20], [x + 0.02, 0.001, 4], [x, 0.001, 4]], col: "rgba(120,70,30,0.3)", line: false });
  sc.plane([[-30, 0, -20], [30, 0, -20], [30, 30, -20], [-30, 30, -20]], "#f2c9a0", false);
  sc.box([-2.5, 2.2, -6], [3.0, 4.4, 3.0], "#e8453c", { zb: 0.5 });   // кружка
  sc.box([-2.5, 4.45, -6], [2.6, 0.1, 2.6], "#5a3a22", { zb: 0.45, line: false });
  sc.box([3.8, 0.35, -5], [7.0, 0.7, 0.7], "#f2c230", { rotY: 0.4, zb: 0.4 });   // карандаш
  sc.box([0.2, 0.15, -9], [4, 0.3, 2.6], "#ffffff", { zb: 0.5 });   // тетрадь
}

// ================================================================= спрайты
const loc = (fx, ty, k) => (x, z) => [fx + x * k, ty + (PLANE_H - z) * k];
function drawBook(g, x, y, k, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = "#2f6fd6"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.16 * k, -0.11 * k, 0.32 * k, 0.22 * k, 4); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.fillRect(-0.15 * k, -0.1 * k, 0.14 * k, 0.2 * k); g.fillRect(0.01 * k, -0.1 * k, 0.14 * k, 0.2 * k); g.strokeStyle = "#999"; g.lineWidth = 1.5; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-0.13 * k, (-0.06 + i * 0.04) * k); g.lineTo(-0.03 * k, (-0.06 + i * 0.04) * k); g.moveTo(0.03 * k, (-0.06 + i * 0.04) * k); g.lineTo(0.13 * k, (-0.06 + i * 0.04) * k); g.stroke(); } g.restore(); }
function drawToothbrush(g, x, y, k, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = "#2f9e9a"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.02 * k, -0.2 * k, 0.04 * k, 0.24 * k, 4); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.fillRect(-0.025 * k, -0.24 * k, 0.05 * k, 0.05 * k); g.strokeRect(-0.025 * k, -0.24 * k, 0.05 * k, 0.05 * k); g.restore(); }
function drawCandy(g, x, y, k) { g.save(); g.translate(x, y); g.fillStyle = "#e8453c"; g.strokeStyle = INKC; g.lineWidth = 3; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 0.05 * k, 0); g.lineTo(s * 0.11 * k, -0.04 * k); g.lineTo(s * 0.11 * k, 0.04 * k); g.closePath(); g.fill(); g.stroke(); } g.beginPath(); g.ellipse(0, 0, 0.06 * k, 0.045 * k, 0, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "#fff"; g.lineWidth = 3; g.beginPath(); g.moveTo(-0.03 * k, -0.02 * k); g.lineTo(0.03 * k, 0.02 * k); g.stroke(); g.restore(); }
function drawChameleon(g, x, y, k, t, o = {}) {   // k = пикселей на метр; хамелеон ~0.35 м
  g.save(); g.translate(x, y); if (o.flip) g.scale(-1, 1);
  g.strokeStyle = INKC; g.lineWidth = Math.max(2, k * 0.008); g.lineJoin = "round";
  g.fillStyle = "#6b4a2a"; g.beginPath(); g.roundRect(-0.3 * k, 0.04 * k, 0.6 * k, 0.03 * k, 4); g.fill(); g.stroke();   // ветка
  g.strokeStyle = INKC; g.fillStyle = "#56b35c";
  g.beginPath(); g.moveTo(-0.17 * k, -0.02 * k); g.bezierCurveTo(-0.3 * k, 0.02 * k, -0.28 * k, 0.12 * k, -0.2 * k, 0.1 * k); g.stroke();   // хвост
  g.beginPath(); g.ellipse(-0.02 * k, -0.03 * k, 0.16 * k, 0.07 * k, 0, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(0.1 * k, -0.08 * k); g.lineTo(0.22 * k, -0.04 * k); g.lineTo(0.12 * k, 0.02 * k); g.closePath(); g.fill(); g.stroke();   // голова
  for (const dx of [-0.08, 0.06]) { g.beginPath(); g.moveTo(dx * k, 0.02 * k); g.lineTo(dx * k + 0.02 * k, 0.05 * k); g.stroke(); }
  g.fillStyle = "#8ed16f"; g.beginPath(); g.ellipse(-0.04 * k, -0.06 * k, 0.1 * k, 0.025 * k, 0, 0, 7); g.fill();
  const eyes = o.eyes ?? [Math.sin(t * 2.1) * 1.2, Math.sin(t * 1.3 + 2) * 1.2];
  [[0.14, -0.06, eyes[0]], [0.16, -0.035, eyes[1]]].forEach(([ex, ey, a], i) => { g.fillStyle = "#56b35c"; g.beginPath(); g.arc(ex * k, ey * k, 0.03 * k, 0, 7); g.fill(); g.stroke();
    g.fillStyle = INKC; g.beginPath(); g.arc(ex * k + Math.cos(a) * 0.015 * k, ey * k + Math.sin(a) * 0.015 * k, 0.01 * k, 0, 7); g.fill(); });
  if (o.tongue > 0) { const L = o.tongue * 0.5 * k; g.strokeStyle = "#e8768a"; g.lineWidth = Math.max(2, k * 0.012); g.beginPath(); g.moveTo(0.21 * k, -0.04 * k); g.lineTo(0.21 * k + L, -0.04 * k - L * 0.15); g.stroke(); g.fillStyle = "#e8768a"; g.beginPath(); g.arc(0.21 * k + L, -0.04 * k - L * 0.15, 0.018 * k, 0, 7); g.fill(); }
  g.restore();
}
function drawRings(g, x, y, k, t, o = {}) {   // звуковые волны
  const n = o.n ?? 3, col = o.col ?? "rgba(120,220,255,0.9)", dir = o.dir ?? 0, span = o.span ?? Math.PI * 0.7;
  g.save(); g.strokeStyle = col; g.lineWidth = o.lw ?? 6; g.lineCap = "round";
  for (let i = 0; i < n; i++) { const ph = ((t * (o.speed ?? 1.6) + i / n) % 1), r = (o.r0 ?? 0.05) * k + ph * (o.r1 ?? 0.35) * k; g.globalAlpha = 1 - ph; g.beginPath(); g.arc(x, y, r, dir - span / 2, dir + span / 2); g.stroke(); }
  g.restore();
}
function drawBat(g, x, y, k, t) { g.save(); g.translate(x, y); const f = Math.sin(t * 18); g.fillStyle = "#3b3350"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, k * 0.01);
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(s * 0.12 * k, (-0.1 - f * 0.06) * k, s * 0.24 * k, (-0.02 - f * 0.08) * k); g.quadraticCurveTo(s * 0.18 * k, 0.02 * k, s * 0.14 * k, 0.05 * k); g.quadraticCurveTo(s * 0.08 * k, 0.02 * k, 0, 0.04 * k); g.closePath(); g.fill(); g.stroke(); }
  g.beginPath(); g.ellipse(0, 0.01 * k, 0.04 * k, 0.05 * k, 0, 0, 7); g.fill(); g.stroke();
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 0.015 * k, -0.03 * k); g.lineTo(s * 0.035 * k, -0.07 * k); g.lineTo(s * 0.04 * k, -0.025 * k); g.fill(); g.stroke(); }
  g.fillStyle = "#ffd23f"; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 0.015 * k, -0.01 * k, 0.008 * k, 0, 7); g.fill(); } g.restore(); }
function drawLego(g, x, y, k) { g.save(); g.translate(x, y); g.fillStyle = "#e8453c"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.06 * k, -0.035 * k, 0.12 * k, 0.035 * k, 2); g.fill(); g.stroke(); for (const dx of [-0.035, 0, 0.035]) { g.beginPath(); g.roundRect((dx - 0.012) * k, -0.05 * k, 0.024 * k, 0.016 * k, 2); g.fill(); g.stroke(); } g.restore(); }
function drawEnvelope(g, x, y, k, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = "#fffbe6"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.rect(-0.12 * k, -0.08 * k, 0.24 * k, 0.16 * k); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-0.12 * k, -0.08 * k); g.lineTo(0, 0.01 * k); g.lineTo(0.12 * k, -0.08 * k); g.stroke(); g.fillStyle = "#d6453d"; g.beginPath(); g.arc(0, 0.01 * k, 0.015 * k, 0, 7); g.fill(); g.restore(); }
function drawFlashlight(g, x, y, k, ang, on) { g.save(); g.translate(x, y); g.rotate(ang);
  if (on) { const gr = g.createLinearGradient(0, 0, 1.6 * k, 0); gr.addColorStop(0, "rgba(255,245,190,0.75)"); gr.addColorStop(1, "rgba(255,245,190,0)"); g.fillStyle = gr; g.beginPath(); g.moveTo(0.08 * k, -0.025 * k); g.lineTo(1.6 * k, -0.45 * k); g.lineTo(1.6 * k, 0.45 * k); g.lineTo(0.08 * k, 0.025 * k); g.closePath(); g.fill(); }
  g.fillStyle = "#3a3d44"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.08 * k, -0.02 * k, 0.16 * k, 0.04 * k, 3); g.fill(); g.stroke(); g.fillStyle = "#f2c230"; g.beginPath(); g.roundRect(0.06 * k, -0.03 * k, 0.04 * k, 0.06 * k, 3); g.fill(); g.stroke(); g.restore(); }
function drawThought(g, x, y, w, h, tailX, tailY, inner, alpha = 1) {   // облачко мысли
  g.save(); g.globalAlpha = alpha; g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 6;
  const bumps = 9; g.beginPath(); for (let i = 0; i < bumps; i++) { const a = (i / bumps) * Math.PI * 2; g.moveTo(x + Math.cos(a) * w / 2 + w * 0.13, y + Math.sin(a) * h / 2); g.arc(x + Math.cos(a) * w / 2, y + Math.sin(a) * h / 2, w * 0.13, 0, 7); } g.fill(); g.stroke();
  g.beginPath(); g.ellipse(x, y, w / 2, h / 2, 0, 0, 7); g.fill();
  for (const [f, r] of [[0.35, 0.05], [0.65, 0.03]]) { g.beginPath(); g.arc(x + (tailX - x) * f + 0, y + h / 2 + (tailY - y - h / 2) * f, w * r, 0, 7); g.fill(); g.stroke(); }
  if (inner) inner(g, x, y, Math.min(w, h)); g.restore();
}
function drawDino(g, x, y, s, col = "#6cc46b") { g.save(); g.translate(x, y); g.fillStyle = col; g.strokeStyle = INKC; g.lineWidth = Math.max(2, s * 0.04);
  g.beginPath(); g.moveTo(-0.5 * s, 0.1 * s); g.quadraticCurveTo(-0.9 * s, 0.05 * s, -1.0 * s, -0.15 * s); g.quadraticCurveTo(-0.6 * s, -0.05 * s, -0.3 * s, -0.15 * s); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(-0.1 * s, 0, 0.42 * s, 0.3 * s, 0, 0, 7); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(0.35 * s, -0.42 * s, 0.25 * s, 0.17 * s, -0.2, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0.15 * s, -0.25 * s); g.lineTo(0.2 * s, -0.42 * s); g.stroke();
  for (const dx of [-0.3, 0.1]) { g.beginPath(); g.roundRect(dx * s, 0.2 * s, 0.13 * s, 0.25 * s, 4); g.fill(); g.stroke(); }
  g.fillStyle = INKC; g.beginPath(); g.arc(0.45 * s, -0.47 * s, 0.035 * s, 0, 7); g.fill();
  g.strokeStyle = INKC; g.lineWidth = Math.max(1.5, s * 0.03); g.beginPath(); g.moveTo(0.38 * s, -0.36 * s); g.quadraticCurveTo(0.48 * s, -0.31 * s, 0.56 * s, -0.37 * s); g.stroke();
  g.fillStyle = "#f2c230"; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo((-0.35 + i * 0.15) * s, -0.27 * s); g.lineTo((-0.28 + i * 0.15) * s, -0.4 * s); g.lineTo((-0.21 + i * 0.15) * s, -0.27 * s); g.fill(); g.stroke(); } g.restore(); }
function drawPizza(g, x, y, s) { g.save(); g.translate(x, y); g.fillStyle = "#f2c230"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, s * 0.05); g.beginPath(); g.moveTo(0, -0.5 * s); g.lineTo(0.35 * s, 0.4 * s); g.lineTo(-0.35 * s, 0.4 * s); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#c98a4b"; g.beginPath(); g.roundRect(-0.38 * s, 0.35 * s, 0.76 * s, 0.12 * s, 6); g.fill(); g.stroke(); g.fillStyle = "#d6453d"; for (const [dx, dy] of [[0, -0.1], [-0.1, 0.15], [0.12, 0.2]]) { g.beginPath(); g.arc(dx * s, dy * s, 0.07 * s, 0, 7); g.fill(); g.stroke(); } g.restore(); }
function drawNotebook(g, x, y, s, pages, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); for (let i = Math.min(pages, 12) - 1; i >= 0; i--) { g.fillStyle = i ? "#f4f0e6" : "#fff"; g.strokeStyle = INKC; g.lineWidth = Math.max(1.5, s * 0.01); g.beginPath(); g.rect(-0.5 * s + i * 2, -0.35 * s - i * 3, s, 0.7 * s); g.fill(); g.stroke(); }
  g.strokeStyle = "#9cc0e8"; g.lineWidth = Math.max(1, s * 0.008); for (let i = 1; i < 7; i++) { g.beginPath(); g.moveTo(-0.45 * s, -0.35 * s + i * 0.1 * s); g.lineTo(0.45 * s, -0.35 * s + i * 0.1 * s); g.stroke(); } g.restore(); }
function drawIceCream(g, x, y, k, scoop = true) { g.save(); g.translate(x, y); g.fillStyle = "#e3b265"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.moveTo(-0.045 * k, 0); g.lineTo(0.045 * k, 0); g.lineTo(0, 0.14 * k); g.closePath(); g.fill(); g.stroke();
  if (scoop) { g.fillStyle = "#f7a8c4"; g.beginPath(); g.arc(0, -0.035 * k, 0.055 * k, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.arc(-0.02 * k, -0.05 * k, 0.012 * k, 0, 7); g.fill(); } g.restore(); }
function drawScoop(g, x, y, k, splat) { g.save(); g.translate(x, y); g.fillStyle = "#f7a8c4"; g.strokeStyle = INKC; g.lineWidth = 3; if (splat) { g.beginPath(); g.ellipse(0, 0, 0.09 * k, 0.03 * k, 0, 0, 7); g.fill(); g.stroke(); } else { g.beginPath(); g.arc(0, 0, 0.055 * k, 0, 7); g.fill(); g.stroke(); } g.restore(); }
function drawDrop(g, x, y, r, o = {}) { g.save(); g.translate(x, y); g.fillStyle = o.fill ?? "rgba(140,210,255,0.55)"; g.strokeStyle = "#2a6fb0"; g.lineWidth = Math.max(2, r * 0.04);
  g.beginPath(); g.moveTo(0, -r * (o.tall ? 1.6 : 1)); g.bezierCurveTo(r * 0.9, -r * 0.3, r, r * 0.4, 0, r * 0.75); g.bezierCurveTo(-r, r * 0.4, -r * 0.9, -r * 0.3, 0, -r * (o.tall ? 1.6 : 1)); g.fill(); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(-r * 0.3, -r * 0.2, r * 0.12, r * 0.25, 0.4, 0, 7); g.fill(); g.restore(); }
function drawStone(g, x, y, s) { g.save(); g.translate(x, y); g.fillStyle = "#8d939b"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, s * 0.06); g.beginPath(); g.moveTo(-0.5 * s, 0.1 * s); g.lineTo(-0.35 * s, -0.35 * s); g.lineTo(0.2 * s, -0.45 * s); g.lineTo(0.5 * s, -0.05 * s); g.lineTo(0.3 * s, 0.35 * s); g.lineTo(-0.3 * s, 0.35 * s); g.closePath(); g.fill(); g.stroke(); g.restore(); }
function drawLeaf(g, x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = "#e46b2b"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, s * 0.05); g.beginPath(); g.moveTo(-0.5 * s, 0); g.quadraticCurveTo(0, -0.4 * s, 0.5 * s, 0); g.quadraticCurveTo(0, 0.4 * s, -0.5 * s, 0); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-0.5 * s, 0); g.lineTo(0.45 * s, 0); g.stroke(); g.restore(); }
function drawAnt(g, x, y, s, t) { g.save(); g.translate(x, y); g.fillStyle = "#3a2418"; g.strokeStyle = INKC; g.lineWidth = Math.max(1.5, s * 0.05);
  for (let i = -1; i <= 1; i++) for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(i * 0.15 * s, 0); g.lineTo(i * 0.15 * s + sd * 0.1 * s + Math.sin(t * 20 + i) * 0.03 * s, 0.25 * s); g.stroke(); }
  for (const [dx, r] of [[-0.35, 0.18], [0, 0.12], [0.3, 0.13]]) { g.beginPath(); g.ellipse(dx * s, -0.05 * s, r * s, r * 0.8 * s, 0, 0, 7); g.fill(); g.stroke(); }
  g.beginPath(); g.moveTo(0.38 * s, -0.12 * s); g.quadraticCurveTo(0.5 * s, -0.35 * s, 0.6 * s, -0.3 * s); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.arc(0.35 * s, -0.1 * s, 0.03 * s, 0, 7); g.fill(); g.restore(); }
function drawCrumb(g, x, y, s) { g.save(); g.translate(x, y); g.fillStyle = "#d9a05b"; g.strokeStyle = INKC; g.lineWidth = Math.max(2, s * 0.03); g.beginPath(); g.moveTo(-0.5 * s, 0.3 * s); g.lineTo(-0.4 * s, -0.25 * s); g.lineTo(0.1 * s, -0.4 * s); g.lineTo(0.5 * s, -0.1 * s); g.lineTo(0.45 * s, 0.3 * s); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#6b3f2a"; for (const [dx, dy] of [[-0.15, -0.05], [0.2, 0.05], [0.0, 0.15]]) { g.beginPath(); g.arc(dx * s, dy * s, 0.06 * s, 0, 7); g.fill(); } g.restore(); }
function drawThermo(g, x, y, s, level) { g.save(); g.translate(x, y); g.fillStyle = "#fff"; g.strokeStyle = INKC; g.lineWidth = 5; g.beginPath(); g.roundRect(-0.08 * s, -0.5 * s, 0.16 * s, 0.85 * s, 0.08 * s); g.fill(); g.stroke(); g.beginPath(); g.arc(0, 0.42 * s, 0.14 * s, 0, 7); g.fill(); g.stroke();
  const col = level > 0.4 ? "#e8453c" : "#3d8bff"; g.fillStyle = col; g.beginPath(); g.arc(0, 0.42 * s, 0.1 * s, 0, 7); g.fill(); g.fillRect(-0.035 * s, 0.42 * s - (0.15 + level * 0.7) * s, 0.07 * s, (0.15 + level * 0.7) * s);
  g.strokeStyle = INKC; g.lineWidth = 2; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(0.08 * s, (-0.4 + i * 0.12) * s); g.lineTo(0.13 * s, (-0.4 + i * 0.12) * s); g.stroke(); } g.restore(); }
function drawGlobe(g, x, y, r, t, o = {}) { g.save(); g.translate(x, y);
  g.fillStyle = "#2f6fd6"; g.strokeStyle = INKC; g.lineWidth = Math.max(3, r * 0.03); g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.save(); g.beginPath(); g.arc(0, 0, r, 0, 7); g.clip(); g.fillStyle = "#4fb35a"; const sh = ((o.rot ?? t * 0.3) % 2) * r * 2;
  for (const [cx, cy, w, h] of [[-0.6, -0.3, 0.5, 0.35], [0.1, 0.2, 0.35, 0.5], [0.7, -0.4, 0.4, 0.3], [-0.2, 0.6, 0.3, 0.2]]) for (const off of [-2, 0, 2]) { g.beginPath(); g.ellipse(cx * r + sh + off * r, cy * r, w * r, h * r, 0.3, 0, 7); g.fill(); }
  g.fillStyle = "rgba(255,255,255,0.15)"; g.beginPath(); g.arc(-r * 0.35, -r * 0.35, r * 0.7, 0, 7); g.fill(); g.fillStyle = "rgba(0,0,30,0.35)"; g.beginPath(); g.arc(r * 0.5, r * 0.4, r * 1.0, 0, 7); g.fill(); g.restore();
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); g.restore(); }
function spaceBg(g, t, seed = 1) { g.fillStyle = "#070a1c"; g.fillRect(0, 0, W, H); g.fillStyle = "#fff"; for (let i = 0; i < 160; i++) { const x = ((i * 7919 + seed * 13) % 1080), y = ((i * 104729) % 1920), r = (i % 5 === 0) ? 3 : 1.6; g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2 + i); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } g.globalAlpha = 1; }
function goshaSprite(g, x, y, h, pose) {   // плоский Гоша для экранных сцен (космос, схемы)
  const cv = drawSprite._c || (drawSprite._c = Object.assign(document.createElement("canvas"), { width: CW, height: CH }));
  drawDoodle(cv.getContext("2d"), GOSHA_LOOK, Object.assign({ expr: "neutral", blink: false, bonk: 0, breathe: 0 }, pose));
  g.drawImage(cv, x - (h * PLANE_W / PLANE_H) / 2, y - h, h * PLANE_W / PLANE_H, h);
}
function drawSprite() {}
