// «Что если Гоша будет видеть, как муха» — локации, шоты, титр, субтитры. Время — секунды голоса.
const GOSHA_LOOK = { body: "#f5c518", stripe: "#1f3a6e", hair: "curly", hairColor: "#a0522d", glasses: "#d6334a", backpack: "#3aa676", shoes: "#2f6fd6", plaster: true };
const TOTAL = 51.9;

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
  g.fillStyle = "#fff"; g.font = `900 ${h * 0.17}px Inter, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ОКТЯБРЬ", w / 2, h * 0.15);
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
  g.fillStyle = "#20180f"; g.font = `800 ${h * 0.035}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("КУПИТЬ", 0, -h * 0.015); g.fillText("МУХОБОЙКУ", 0, h * 0.035); g.restore();
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
    if (choppy) { g.fillStyle = "rgba(0,0,0,0.55)"; g.fillRect(w * 0.03, h * 0.05, w * 0.32, h * 0.16); g.fillStyle = "#fff"; g.font = `800 ${h * 0.09}px Inter, sans-serif`; g.textBaseline = "middle"; g.fillText("❚❚ кадр " + (Math.floor(t / 0.7) % 9 + 1), w * 0.05, h * 0.13); }
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
    g.font = `800 ${w * 0.11}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("240 к/с", w / 2, h * 0.88);
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
  sc.decal([1.35, 1.12, -1.81], 1.14, 0.66, 0, pTV(t, o.choppy), null, { live: true, frame: false, zb: 0.2 });
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

// ================================================================= Гоша и шоты
const gosha = (extra) => Object.assign({ id: "gosha", seed: 3, lookStyle: GOSHA_LOOK, pos: [0, 0, 0] }, extra);
const lerpPath = (t, t0, t1, a, b) => v3.lerp(a, b, clamp((t - t0) / (t1 - t0), 0, 1));
const fly = (sc, t, p, o = {}) => sc.sprite(p, -0.05, (g, x, y, k) => drawFly(g, x + Math.sin(t * 23) * 2, y + Math.cos(t * 19) * 2, k, t, o));
const buzz = (t, c, r = 0.12, sp = 2.2) => [c[0] + Math.sin(t * sp) * r, c[1] + Math.sin(t * sp * 1.7) * r * 0.5, c[2] + Math.cos(t * sp) * r * 0.6];
const slipper = (sc, p, rot, trail) => sc.sprite(p, -0.06, (g, x, y, k) => { if (trail) motionLines(g, x, y, trail[0], trail[1], 90); drawSlipper(g, x, y, k, rot); });

const HZ = HEAD_ZM;
const SHOTS = [
  // 0. Титр: крупный план, муха перед лицом, линзы превращаются в мушиные глаза
  { t0: 0, t1: 2.5, cam: [[0, [-1.15, 0.88, 0.8], [-1.3, 0.92, -0.9], 60], [2.5, [-1.2, 0.88, 0.5], [-1.3, 0.92, -0.9], 58]], focus: [-1.3, 0.98, -0.9],
    build(sc, t) { kitchen(sc, t, { noTable: true });
      drawActor(sc, t, gosha({ pos: [-1.3, 0, -0.9], expr: [[0, "neutral"], [1.0, "blank"], [1.9, "realize"]], look: [[0, 0.7], [0.6, -0.6], [1.2, 0.4], [1.9, 0]], flyEyes: [[0, 0, 0], [1.7, 0, 0], [2.2, 1, 0]] }));
      fly(sc, t, buzz(t, [-1.05, 0.97, -0.3], 0.1, 3), { scale: 1.3 }); } },
  // 1. Тапок летит в слоумо, Гоша зевает, чешет щёку и отходит
  { t0: 2.5, t1: 8.61, cam: [[2.5, [1.7, 1.32, 2.5], [-0.6, 1.0, -0.9], 70], [8.61, [1.35, 1.28, 2.2], [-0.5, 1.0, -0.9], 70]], focus: [-0.3, 1.0, -0.2],
    build(sc, t) { kitchen(sc, t);
      drawActor(sc, t, gosha({ walk: [[2.5, -0.35, -0.2], [7.0, -0.35, -0.2], [7.7, 0.45, -0.2]],
        expr: [[2.5, "smug"], [3.4, "grin"], [4.3, "smug"], [4.6, "blank"], [5.8, "smug"], [7.0, "grin"], [7.8, "proud"]],
        mouth: [[4.9, ["open", 1]], [5.6, undefined]],
        handF: [[4.7, ...REST_FM], [4.9, -0.32, HZ - 0.1], [5.5, -0.32, HZ - 0.1], [5.7, ...REST_FM]],
        handB: [[5.8, ...REST_BM], [6.0, 0.34, HZ - 0.08], [6.2, 0.36, HZ - 0.02], [6.4, 0.34, HZ - 0.08], [6.6, 0.36, HZ - 0.02], [6.8, ...REST_BM]],
        look: [[2.5, -0.8], [4.6, 0], [7.0, -0.8]], tilt: [[4.9, 0.12], [5.6, 0]] }));
      const HEADP = [-0.35, 1.05, -0.12];
      const p = t < 7.4 ? lerpPath(t, 2.6, 7.4, [-2.2, 1.3, -1.6], HEADP) : lerpPath(t, 7.4, 8.6, HEADP, [0.95, 0.88, 0.95]);
      if (t > 2.6) slipper(sc, p, -0.2 + (t - 2.6) * 0.22, [1, 0.12]);
      fly(sc, t, buzz(t, [0.1, 1.35, -0.3], 0.25)); } },
  // 2. Мушиные глаза. Вода как мёд. Мяч за окном ползёт
  { t0: 8.61, t1: 14.66, cam: [[8.61, [1.45, 1.22, 0.65], [0.35, 1.2, -1.6], 62], [14.66, [1.3, 1.25, 0.55], [0.25, 1.35, -1.6], 62]], focus: [0.75, 1.0, -1.15],
    build(sc, t) { kitchen(sc, t, { noTable: true, ball: t > 12.0 ? clamp((t - 12.0) / 6, 0, 1) : null });
      drawActor(sc, t, gosha({ pos: [0.75, 0, -1.15], expr: [[8.61, "blank"], [9.6, "realize"], [10.7, "shock"], [11.9, "grin"], [12.4, "realize"], [13.2, "laugh"], [14.2, "holdlaugh"]],
        flyEyes: [[9.0, 0, 0], [9.7, 1, 0], [10.6, 1, 0], [11.0, 0, 0]], look: [[8.61, 0], [10.7, -0.9], [12.1, -0.6]],
        handF: [...pointKeysM(10.9, -0.7, 0.1, 1.0, "f"), ...pointKeysM(12.45, -0.6, 0.9, 1.3, "f")] }));
      if (t > 10.6) sc.sprite([0.2, 1.3, -1.62], -0.02, (g, x, y, k) => {
        const end = sc.cam.P([0.2, 0.98, -1.62]); if (!end) return; const len = clamp((t - 10.6) / 1.6, 0, 1) * (end[1] - y);
        g.fillStyle = "rgba(240,190,70,0.85)"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath();
        for (let i = 0; i <= 16; i++) { const yy = y + (len * i) / 16; const ww = (0.03 + 0.016 * Math.sin(i * 0.9 - t * 3)) * k; g[i ? "lineTo" : "moveTo"](x + ww, yy); }
        for (let i = 16; i >= 0; i--) { const yy = y + (len * i) / 16; const ww = (0.03 + 0.016 * Math.sin(i * 0.9 - t * 3)) * k; g.lineTo(x - ww, yy); }
        g.closePath(); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(x - 0.008 * k, y + 4, 0.006 * k, len * 0.8); });
      fly(sc, t, buzz(t, [0.7, 1.55, -1.1], 0.2)); } },
  // 3. Лампа мигает — Гоша «на дискотеке»
  { t0: 14.66, t1: 17.7, cam: [[14.66, [0.05, 1.1, 2.75], [0.3, 1.5, -0.8], 72], [17.7, [0.15, 1.1, 2.55], [0.3, 1.45, -0.8], 72]], focus: [0.3, 1.0, 0.3],
    strobe: (t) => (t > 15.5 ? (Math.floor(t * 9) % 2) : -1),
    build(sc, t) { const on = t < 15.5 ? 1 : Math.floor(t * 9) % 2;
      kitchen(sc, t, { lamp: on, noBowl: false });
      const dance = t > 16.9;
      drawActor(sc, t, gosha({ pos: [0.3, 0, 0.3], expr: [[14.66, "neutral"], [15.6, "stern"], [16.5, "holdlaugh"], [16.9, "laugh"], [17.3, "proud"]],
        look: [[14.66, 0.3]], hop: dance ? [16.9 + Math.floor((t - 16.9) / 0.4) * 0.4, 0.4] : null,
        handF: dance ? [[16.9, -0.42, HZ + 0.25], [17.1, -0.3, 0.55], [17.3, -0.42, HZ + 0.25], [17.5, -0.3, 0.55], [17.7, -0.42, HZ + 0.25]] : [[15.6, ...REST_FM], [15.8, -0.36, HZ + 0.1], [16.8, -0.36, HZ + 0.1]],
        handB: dance ? [[16.9, 0.3, 0.55], [17.1, 0.42, HZ + 0.25], [17.3, 0.3, 0.55], [17.5, 0.42, HZ + 0.25], [17.7, 0.3, 0.55]] : null }));
      fly(sc, t, buzz(t, [0.8, 1.5, 0.2], 0.25)); } },
  // 3б. Мультик рывками
  { t0: 17.7, t1: 20.46, cam: [[17.7, [-1.1, 1.2, 1.7], [0.7, 1.0, -1.3], 70], [20.46, [-0.85, 1.18, 1.5], [0.7, 1.0, -1.3], 70]], focus: [-0.2, 1.0, -0.6],
    build(sc, t) { livingRoom(sc, t, { choppy: true });
      drawActor(sc, t, gosha({ pos: [-0.2, 0, -0.6], expr: [[17.7, "blank"], [18.1, "realize"], [19.1, "stern"], [19.7, "smug"]], look: [[17.7, 0.9]],
        handB: pointKeysM(18.15, 0.9, 0.3, 1.4, "b") })); } },
  // 4. Супербыстрый? Нет. Глаза снимают больше кадров
  { t0: 20.46, t1: 26.68, cam: [[20.46, [0.25, 1.15, 1.45], [0, 1.0, -0.8], 66], [26.68, [0.1, 1.1, 1.15], [0, 1.0, -0.8], 64]], focus: [0, 1.0, -0.6],
    build(sc, t) { livingRoom(sc, t, { choppy: false });
      drawActor(sc, t, gosha({ pos: [0, 0, -0.6], hop: [22.2, 0.35],
        expr: [[20.46, "realize"], [21.4, "smug"], [22.2, "proud"], [22.9, "blank"], [23.5, "nervous"], [24.1, "realize"], [25.0, "grin"], [25.8, "proud"]],
        lean: [[21.4, 0, 0], [22.0, 0.1, 0], [22.9, 0.1, 0], [23.3, -0.06, 0], [24.1, 0, 0]],
        handF: [[21.4, ...REST_FM], [21.7, -0.3, 0.6], [22.9, -0.3, 0.6], [23.2, ...REST_FM]],
        handB: [[21.4, ...REST_BM], [21.7, 0.3, 0.6], [22.9, 0.3, 0.6], [23.2, ...REST_BM], [24.5, ...REST_BM], [24.75, 0.4, HZ + 0.02], [25.9, 0.4, HZ + 0.02], [26.2, ...REST_BM]],
        bendF: [[21.4, -0.35], [23.2, 0.12]], bendB: [[21.4, 0.35], [23.2, -0.12], [24.5, 0.3]],
        flyEyes: [[24.6, 0, 0], [25.0, 1, 0], [26.0, 1, 0], [26.5, 0, 0]] }));
      if (t > 20.5 && t < 22.9) sc.overlay([0.3, 1.62, -0.6], (g, x, y) => { g.save(); g.globalAlpha = clamp((22.9 - t) / 0.3, 0, 1); bubbleLabel(g, x, y, "?", t, 20.55, { size: 120, tail: -50 }); g.restore(); });
      if (t > 22.9 && t < 23.9) sc.overlay([0.3, 1.62, -0.6], (g, x, y) => bubbleLabel(g, x, y, "НЕТ.", t, 22.92, { size: 80, tail: -60 })); } },
  // 5. Замедленная съёмка: телефон на штативе, капля падает вечность
  { t0: 26.68, t1: 33.08, cam: [[26.68, [0.55, 1.2, 0.95], [0.72, 1.1, -1.6], 62], [33.08, [0.5, 1.18, 0.75], [0.68, 1.1, -1.6], 60]], focus: [0.62, 1.15, -1.5],
    build(sc, t) { kitchen(sc, t, { noTable: true });
      const sc0 = bonkAt(t, 26.75);
      sc.box([0.62, 1.06, -1.5], [0.03, 0.2, 0.03], "#2a2d33", { zb: 0.02 });
      sc.decal([0.62, 1.34, -1.49], 0.2 * sc0, 0.36 * sc0, 0, pPhone(t, 31.0), null, { live: true, zb: -0.02, lw: 4 });
      drawActor(sc, t, gosha({ pos: [1.0, 0, -1.15], expr: [[26.68, "grin"], [28.8, "proud"], [30.0, "realize"], [31.1, "shock"], [32.3, "blank"]], look: [[26.68, -0.8]],
        handF: pointKeysM(28.85, -0.9, 0.5, 1.2, "f"), lean: [[30.5, 0, 0], [31.2, -0.12, 0], [33, -0.12, 0]] }));
      if (t > 30.9) { const k = clamp((t - 30.9) / 2.4, 0, 1); const p = [0.2, 1.29 - k * 0.3, -1.62];
        sc.sprite(p, -0.03, (g, x, y, kk) => { const s = 0.035 * kk; g.fillStyle = "#7cc8ff"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y - s * 1.5); g.quadraticCurveTo(x + s, y, x, y + s * 0.8); g.quadraticCurveTo(x - s, y, x, y - s * 1.5); g.fill(); g.stroke(); }); } } },
  // 6. 60 кадров против 250
  { t0: 33.08, t1: 41.83, cam: [[33.08, [0.2, 1.28, 1.75], [0.15, 0.98, -0.6], 60], [41.83, [0.15, 1.24, 1.5], [0.18, 0.96, -0.6], 58]], focus: [0.1, 1.0, -0.5],
    build(sc, t) { kitchen(sc, t, { noBowl: true, noFrontLegs: true });
      drawActor(sc, t, gosha({ pos: [-0.12, 0, -0.55], expr: [[33.08, "neutral"], [34.3, "proud"], [36.0, "nervous"], [37.3, "shock"], [38.8, "stern"], [40.2, "nervous"]], look: [[33.08, 0.6], [34.3, 0], [36.0, 0.8]],
        handF: [[33.6, ...REST_FM], [33.9, -0.05, 0.62], [35.2, -0.05, 0.62], [35.5, ...REST_FM]], bendF: [[33.6, -0.5], [35.5, 0.12]],
        handB: [[38.7, ...REST_BM], [39.0, 0.42, HZ + 0.22], [39.6, 0.43, HZ + 0.2], [41.8, 0.45, 0.95]] }));
      fly(sc, t, [0.35, 0.81, -0.45], { scale: 1.1 });
      if (t > 34.2) sc.overlay([-0.15, 1.55, -0.55], (g, x, y) => bubbleLabel(g, x, y, "60 к/с", t, 34.3, { size: 66 }));
      if (t > 37.2) sc.overlay([0.42, 1.12, -0.45], (g, x, y) => bubbleLabel(g, x + 60, y, "250 к/с", t, 37.3, { size: 74, bg: "#f5c518", rot: 0.05 }));
      if (t > 40.2) sc.overlay([0.42, 1.12, -0.45], (g, x, y) => bubbleLabel(g, x + 60, y - 110, "×¼ скорость", t, 40.2, { size: 44, rot: -0.03 })); } },
  // 7. Замах — муха уже улетела; хлопок по пустому столу
  { t0: 41.83, t1: 47.2, cam: [[41.83, [0.25, 1.22, 1.45], [0.2, 1.0, -0.6], 58], [44.3, [0.22, 1.2, 1.25], [0.2, 0.98, -0.6], 56], [44.45, [0.25, 1.15, 1.27], [0.2, 0.95, -0.6], 56], [47.2, [0.2, 1.2, 1.4], [0.25, 1.0, -0.6], 58]], focus: [0.1, 1.0, -0.5],
    build(sc, t) { kitchen(sc, t, { noBowl: true, noFrontLegs: true });
      drawActor(sc, t, gosha({ pos: [-0.12, 0, -0.55], expr: [[41.83, "stern"], [43.4, "nervous"], [44.4, "shock"], [45.1, "stern"], [46.0, "blank"]], look: [[41.83, 0.6], [43.4, 0.9]],
        handB: [[41.83, 0.45, 0.95], [42.4, 0.4, HZ + 0.28], [44.2, 0.42, HZ + 0.3], [44.35, 0.47, 0.8], [45.6, 0.47, 0.8], [45.9, ...REST_BM]] }));
      let fp;
      if (t < 43.4) fp = [0.35, 0.81, -0.45];
      else if (t < 44.3) fp = lerpPath(t, 43.4, 44.3, [0.35, 0.81, -0.45], [0.95, 1.45, -0.7]);
      else fp = buzz(t, [0.95, 1.45, -0.7], 0.12, 3);
      fly(sc, t, fp, { scale: 1.1, rot: t > 43.4 && t < 44.3 ? -0.6 : 0 });
      if (t > 44.35 && t < 44.9) sc.sprite([0.35, 0.8, -0.45], -0.2, (g, x, y, k) => { const a = 1 - (t - 44.35) / 0.55; g.save(); g.globalAlpha = a; g.strokeStyle = "#fff"; g.lineWidth = 6; for (let i = 0; i < 8; i++) { const an = (i / 8) * Math.PI * 2; g.beginPath(); g.moveTo(x + Math.cos(an) * 40, y + Math.sin(an) * 22); g.lineTo(x + Math.cos(an) * 90, y + Math.sin(an) * 50); g.stroke(); } g.restore(); }); } },
  // 8. Финал: тапок промахивается дважды
  { t0: 47.2, t1: TOTAL, cam: [[47.2, [1.7, 1.32, 2.5], [-0.4, 1.0, -0.6], 70], [TOTAL, [1.5, 1.3, 2.3], [-0.15, 1.0, -0.6], 70]], focus: [-0.3, 1.0, -0.2],
    build(sc, t) { kitchen(sc, t);
      drawActor(sc, t, gosha({ walk: [[47.2, 0.3, 0.45], [50.0, 0.3, 0.45], [50.45, 0.9, 0.45]],
        expr: [[47.2, "smug"], [48.6, "realize"], [49.6, "grin"], [50.3, "nervous"], [50.8, "proud"]], look: [[47.2, -0.8], [50.8, -0.5]] }));
      const FLY0 = [-0.35, 1.45, 0.1], FLY1 = [-0.6, 1.85, 0.2];
      fly(sc, t, t < 49.2 ? buzz(t, FLY0, 0.05, 4) : t < 49.6 ? lerpPath(t, 49.2, 49.6, FLY0, FLY1) : buzz(t, FLY1, 0.08, 3), { scale: 1.3 });
      if (t > 47.4) { const A = [-2.2, 1.3, -1.6], B = [-0.35, 1.42, 0.1], C = [0.3, 1.05, 0.47], D = [0.25, 0.06, 0.85];
        const p = t < 49.6 ? lerpPath(t, 47.4, 49.6, A, B) : t < 50.6 ? lerpPath(t, 49.6, 50.6, B, C) : lerpPath(t, 50.6, 51.3, C, D);
        slipper(sc, p, t < 51.3 ? -0.3 + (t - 47.4) * 0.3 : 1.2, t < 51.3 ? [1, 0.05] : null); } } },
];
function bonkAt(t, t0, amt = 0.35) { const tb = (t - t0) * 30; return tb > 0 ? 1 + amt * Math.exp(-tb / 3.5) * Math.cos(tb * 1.25) : tb > -1 ? 0.01 : 0.01; }

// ================================================================= кадр
const cvs = document.getElementById("c"), G = cvs.getContext("2d");
// время голоса (новое) → время раскадровки: шоты поставлены по словам, карта сопоставляет одни и те же слова
function toOld(tn) {
  const M = TIMEMAP;
  if (tn <= M[0][1]) return M[0][0] + (tn - M[0][1]);
  for (let i = 1; i < M.length; i++) if (tn <= M[i][1]) { const [o0, n0] = M[i - 1], [o1, n1] = M[i]; return n1 - n0 < 1e-6 ? o1 : o0 + ((tn - n0) / (n1 - n0)) * (o1 - o0); }
  const [ol, nl] = M[M.length - 1]; return ol + (tn - nl);
}
function renderFrame(tn) {
  const t = toOld(tn);
  const sh = SHOTS.find((s) => t >= s.t0 && t < s.t1) ?? SHOTS[SHOTS.length - 1];
  const [, p, l, fov] = camAt(t, sh.cam);
  const shake = sh === SHOTS[8] ? 0 : 0;
  const pos = [p[0] + Math.sin(t * 0.9) * 0.012, p[1] + Math.sin(t * 1.3) * 0.008 + shake, p[2]];
  const cam = makeCam(pos, l, fov);
  G.setTransform(1, 0, 0, 1, 0, 0); G.filter = "none"; G.globalAlpha = 1;
  G.fillStyle = "#000"; G.fillRect(0, 0, W, H);
  const sc = new Scene(cam, sh.focus);
  sh.build(sc, t);
  sc.render(G);
  // свет: окно слева и лампа
  warmLight(G, W * 0.15, H * 0.3, H * 0.6, "rgba(255,220,170,A)", 0.22);
  if (sh.strobe) { const s = sh.strobe(t); if (s === 0) { G.fillStyle = "rgba(10,10,40,0.62)"; G.fillRect(0, 0, W, H); } else if (s === 1) { warmLight(G, W * 0.55, H * 0.12, H * 0.7, "rgba(255,240,170,A)", 0.45); G.fillStyle = `rgba(${[255, 80, 200][Math.floor(t * 4.5) % 3]},${[60, 200, 90][Math.floor(t * 4.5) % 3]},${[200, 255, 80][Math.floor(t * 4.5) % 3]},0.12)`; G.fillRect(0, 0, W, H); } }
  vignette(G, 0.42);
  overlays(t);
  captions(tn);
  // короткая вспышка-склейка между шотами
  const cut = SHOTS.find((s) => s.t0 > 0 && t >= s.t0 && t < s.t0 + 0.08); if (cut) { G.fillStyle = "rgba(255,255,255,0.18)"; G.fillRect(0, 0, W, H); }
}
function overlays(t) {
  // титр
  if (t < 2.5) {
    const out = clamp((t - 2.25) / 0.25, 0, 1);
    G.save(); G.globalAlpha = 1 - out;
    const s1 = popScale(t, 0.35), s2 = popScale(t, 1.0);
    if (s1 > 0) { G.save(); G.translate(W / 2, 250); G.scale(s1, s1); outlinedText(G, "ЧТО ЕСЛИ", 0, 0, 132, "#ffffff", 22, "center", -0.04); G.restore(); }
    if (s2 > 0) { G.save(); G.translate(W / 2, 410); G.scale(s2, s2); outlinedText(G, "ГОША ВИДИТ,", 0, 0, 112, "#f5c518", 20, "center", 0.02); outlinedText(G, "КАК МУХА", 0, 135, 124, "#f5c518", 20, "center", -0.02); G.restore(); }
    G.restore();
  }
  // слоумо-рамка у тапка в начале
  if (t > 2.6 && t < 8.4) { const a = Math.min(1, (t - 2.6) / 0.3, (8.4 - t) / 0.3); G.save(); G.globalAlpha = a * 0.9; G.fillStyle = "#ff3b30"; G.beginPath(); G.arc(70, 120, 16, 0, 7); G.fill(); G.font = `900 46px ${FONT_TITLE}`; G.fillStyle = "#fff"; G.textBaseline = "middle"; G.lineWidth = 8; G.strokeStyle = "#000"; G.strokeText("ГЛАЗА МУХИ", 100, 122); G.fillText("ГЛАЗА МУХИ", 100, 122); G.restore(); }
}
function captions(t) {
  if (t < 2.5) return;
  const g = CAPTIONS.find((c) => t >= c.s && t < Math.max(c.e, c.s + 0.2));
  if (!g) return;
  const k = clamp((t - g.s) / 0.18, 0, 1), sc = 0.72 + 0.28 * easeOutBack(k, 2.0);
  G.save(); G.translate(W / 2, H - 540); G.scale(sc, sc);
  G.font = `900 92px ${FONT_TITLE}`; G.textAlign = "center"; G.textBaseline = "middle"; G.lineJoin = "round";
  const lines = wrap(g.text.toUpperCase(), 940);
  lines.forEach((ln, i) => { const y = (i - (lines.length - 1) / 2) * 100;
    G.fillStyle = "rgba(0,0,0,0.55)"; G.fillText(ln, 0, y + 7); G.lineWidth = 18; G.strokeStyle = "#000"; G.strokeText(ln, 0, y); G.fillStyle = "#fff"; G.fillText(ln, 0, y); });
  G.restore();
}
function wrap(txt, maxW) {
  const words = txt.split(" "), out = []; let cur = "";
  for (const w of words) { const tryS = cur ? cur + " " + w : w; if (G.measureText(tryS).width > maxW && cur) { out.push(cur); cur = w; } else cur = tryS; }
  if (cur) out.push(cur); return out;
}
window.renderFrame = renderFrame; window.TOTAL = 54.5;
