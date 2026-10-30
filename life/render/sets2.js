// Локации и фоновые персонажи для жизненных роликов.
const LOOK = {
  dad: { body: "#4a5d7a", hair: "bald", hairColor: "#5a4a40", mustache: "#3b2a20", tie: "#8a2a2a", shoes: "#2a2a2a" },
  mom: { body: "#d65a7a", hair: "long", hairColor: "#7a4a2c", shoes: "#a33a4a" },
  girl: { body: "#8fd0c0", hair: "long", hairColor: "#2a1a14", bow: "#ff6b9a", shoes: "#ff6b9a" },
  girl2: { body: "#c38fd6", hair: "long", hairColor: "#d9a441", bow: "#f5c518", shoes: "#8f63d2" },
  marina: { body: "#3aa676", hair: "long", hairColor: "#b5653a", apron: "#6b3f2a", shoes: "#2a2a2a" },
  boss: { body: "#5a5f6a", hair: "slick", hairColor: "#2a2a2a", tie: "#2f6fd6", shoes: "#222" },
  room: { body: "#e46b2b", hair: "spiky", hairColor: "#20180f", shoes: "#333" },
  c1: { body: "#8fb8de", hair: "slick", hairColor: "#4a3a30", shoes: "#333" },
  c2: { body: "#e8a87c", hair: "long", hairColor: "#20180f", shoes: "#555" },
  c3: { body: "#9cc59a", hair: "spiky", hairColor: "#6b4a2a", shoes: "#333" },
  c4: { body: "#f2c94c", hair: "bald", hairColor: "#888", mustache: "#888", shoes: "#333" },
  driver: { body: "#2a2d33", hair: "slick", hairColor: "#20180f", mustache: "#20180f", shoes: "#111" },
};
const GOSHA_WORK = Object.assign({}, GOSHA_LOOK, { apron: "#6b3f2a", backpack: null });
const person = (id, look, extra) => Object.assign({ id, seed: id.length * 7 + 1, lookStyle: LOOK[look] ?? look, pos: [0, 0, 0] }, extra);
const HANDS_HOLD = { handF: [[0, -0.1, 0.62], [999, -0.1, 0.62]], handB: [[0, 0.12, 0.62], [999, 0.12, 0.62]], bendF: [[0, -0.4]], bendB: [[0, 0.4]] };
const talkMouth = (t0, t1, step = 0.18) => { const k = []; for (let t = t0, i = 0; t < t1; t += step, i++) k.push([t, i % 2 ? ["open", 0.7] : ["o", 0.4]]); k.push([t1, undefined]); return k; };
const nod = (t0, t1, step = 0.35) => { const k = []; for (let t = t0, i = 0; t < t1; t += step, i++) k.push([t, i % 2 ? 0.08 : -0.04]); k.push([t1, 0]); return k; };

// ---------------------------------------------------------------- картинки
const pDoorClosed = (num) => (g, w, h) => { g.fillStyle = "#8a5a3c"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = w * 0.02; g.strokeRect(w * 0.12, h * 0.08, w * 0.76, h * 0.38); g.strokeRect(w * 0.12, h * 0.52, w * 0.76, h * 0.4);
  g.fillStyle = "#e3c27a"; g.beginPath(); g.arc(w * 0.82, h * 0.52, w * 0.04, 0, 7); g.fill(); g.fillStyle = "#f6f3ea"; g.fillRect(w * 0.38, h * 0.14, w * 0.24, h * 0.07); g.fillStyle = "#222"; g.font = `900 ${h * 0.055}px Inter, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(num, w / 2, h * 0.177); };
const pDoorOpen = (g, w, h) => { g.fillStyle = "#3b3350"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,220,160,0.45)"; g.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.9); g.fillStyle = "#8a5a3c"; g.strokeStyle = "#20180f"; g.lineWidth = w * 0.02; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * 0.2, h * 0.04); g.lineTo(w * 0.2, h * 0.97); g.lineTo(0, h); g.closePath(); g.fill(); g.stroke(); };
const pBoard = (lines, o = {}) => (g, w, h) => { g.fillStyle = o.bg ?? "#14171f"; g.fillRect(0, 0, w, h); g.font = `800 ${h / (lines.length + 1.5) * 0.62}px Inter, sans-serif`; g.textBaseline = "middle";
  lines.forEach((ln, i) => { const y = h * (i + 1) / (lines.length + 1); g.fillStyle = o.hi === i ? "#ff6b6b" : (o.fg ?? "#ffd23f"); g.textAlign = "left"; g.fillText(ln[0], w * 0.05, y); g.textAlign = "right"; g.fillText(ln[1], w * 0.95, y); }); };
const pSign = (txt, bg, fg, sz = 0.55) => (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = `900 ${h * sz}px Inter, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 2); };
const pMenu = (g, w, h) => { g.fillStyle = "#20231f"; g.fillRect(0, 0, w, h); g.strokeStyle = "#c9b08a"; g.lineWidth = w * 0.015; g.strokeRect(w * 0.03, h * 0.05, w * 0.94, h * 0.9); g.fillStyle = "#f2efe6"; g.font = `800 ${h * 0.11}px Inter, sans-serif`; g.textAlign = "left"; g.textBaseline = "middle";
  [["КАПУЧИНО", "180"], ["ЛАТТЕ", "190"], ["ЧАЙ", "90"], ["КРУАССАН", "150"]].forEach(([a, b], i) => { g.fillText(a, w * 0.1, h * (0.24 + i * 0.18)); g.textAlign = "right"; g.fillText(b, w * 0.9, h * (0.24 + i * 0.18)); g.textAlign = "left"; }); };
const pRules = (n) => (g, w, h) => { g.fillStyle = "#fffbe6"; g.fillRect(0, 0, w, h); g.fillStyle = "#d6453d"; g.font = `900 ${h * 0.09}px Inter, sans-serif`; g.textAlign = "center"; g.fillText("ПРАВИЛА КОМНАТЫ", w / 2, h * 0.13); g.fillStyle = "#20180f"; g.textAlign = "left"; g.font = `800 ${h * 0.07}px Inter, sans-serif`;
  ["23:00 — ТИШИНА", "ГОСТИ — ДО 22:00", "УБОРКА — ПН, ЧТ", "ЧУЖОЕ — СПРОСИ"].slice(0, n).forEach((l, i) => g.fillText("• " + l, w * 0.07, h * (0.32 + i * 0.17))); };
const pPoolSky = (g, w, h) => { const s = g.createLinearGradient(0, 0, 0, h); s.addColorStop(0, "#8fd0ff"); s.addColorStop(1, "#d9f1ff"); g.fillStyle = s; g.fillRect(0, 0, w, h); };

// ---------------------------------------------------------------- локации
function hallway(sc, t, o = {}) {
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 0, 4], [-3, 0, 4]], "#b9a99a", false);
  for (let x = -2.7; x < 3; x += 0.5) sc.bg.push({ pts: [[x, 0.001, -2], [x + 0.01, 0.001, -2], [x + 0.01, 0.001, 4], [x, 0.001, 4]], col: "rgba(80,60,40,0.3)", line: false });
  sc.plane([[-3, 3, -2], [-3, 3, 4], [3, 3, 4], [3, 3, -2]], "#efe8da");
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 3, -2], [-3, 3, -2]], "#9cc0a8");
  sc.plane([[-3, 0, 4], [-3, 0, -2], [-3, 3, -2], [-3, 3, 4]], "#8ab296");
  sc.plane([[3, 0, -2], [3, 0, 4], [3, 3, 4], [3, 3, -2]], "#8ab296");
  sc.plane([[-3, 0, -1.99], [3, 0, -1.99], [3, 1.0, -1.99], [-3, 1.0, -1.99]], "#6f9a7e");
  sc.decal([0, 1.05, -1.985], 1.0, 2.1, 0, o.open ? pDoorOpen : pDoorClosed("42"), o.open ? "dOpen" : "dClosed", { zb: 0.2 });
  sc.box([-0.72, 1.25, -1.95], [0.08, 0.12, 0.04], "#e8e3d6", { zb: 0.1 });
  sc.bg.push({ pts: [[-0.5, 0.003, -1.9], [0.5, 0.003, -1.9], [0.5, 0.003, -1.4], [-0.5, 0.003, -1.4]], col: "#7a4a2c", line: true });
  sc.box([1.6, 0.2, -1.7], [0.3, 0.4, 0.3], "#b5653a", { zb: 0.2 });
  for (let i = 0; i < 6; i++) sc.box([1.6 + Math.cos(i) * 0.08, 0.65, -1.7 + Math.sin(i) * 0.08], [0.06, 0.55, 0.02], "#3f8a4b", { rotY: i, line: false, zb: 0.19 });
  sc.box([-1.7, 0.6, -1.95], [0.5, 0.7, 0.06], "#c9ccd1", { zb: 0.2 });   // почтовые ящики
  for (let i = 0; i < 3; i++) sc.box([-1.7, 0.4 + i * 0.22, -1.91], [0.42, 0.015, 0.02], "#8d939b", { line: false, zb: 0.15 });
  sc.decal([-1.7, 1.75, -1.985], 0.6, 0.4, 0, pSign("ЭТАЖ 4", "#f6f3ea", "#20180f", 0.4), "floor4", { zb: 0.2 });
  sc.box([0, 2.85, -0.6], [0.5, 0.1, 0.25], "#fff2b8", { glow: 0.3, shadow: false });
}
function dining(sc, t, o = {}) {
  livingRoom(sc, t, o);
  sc.box([0, 0.74, -0.75], [1.8, 0.06, 0.9], "#b8784a", { zb: 0.25 });
  for (const [dx, dz] of [[-0.82, -0.38], [0.82, -0.38], [-0.82, 0.38], [0.82, 0.38]]) sc.box([dx, 0.36, -0.75 + dz], [0.06, 0.72, 0.06], "#7a4a2c", { shadow: false, zb: 0.3 });
  sc.box([0, 0.775, -0.75], [1.7, 0.01, 0.82], "#f7f3ea", { line: false, zb: 0.24 });
  if (!o.noCake) { sc.box([0, 0.86, -0.8], [0.32, 0.16, 0.32], "#f7a8c4", { zb: 0.1 }); sc.box([0, 0.95, -0.8], [0.32, 0.03, 0.32], "#ffffff", { zb: 0.09 }); }
  sc.box([-0.55, 0.85, -0.85], [0.16, 0.16, 0.16], "#2f6fd6", { zb: 0.1 }); sc.box([-0.45, 0.88, -0.85], [0.08, 0.04, 0.03], "#2f6fd6", { zb: 0.09 });
  for (const dx of [-0.35, 0.35, 0.6]) sc.box([dx, 0.8, -0.55], [0.1, 0.07, 0.1], "#ffffff", { zb: 0.08 });
}
function cafe(sc, t, o = {}) {
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 0, 4], [-3, 0, 4]], "#7a4a2c", false);
  for (let x = -2.7; x < 3; x += 0.6) sc.bg.push({ pts: [[x, 0.001, -2], [x + 0.015, 0.001, -2], [x + 0.015, 0.001, 4], [x, 0.001, 4]], col: "rgba(40,20,10,0.35)", line: false });
  sc.plane([[-3, 3, -2], [-3, 3, 4], [3, 3, 4], [3, 3, -2]], "#2a2d33");
  sc.plane([[-3, 0, -2], [3, 0, -2], [3, 3, -2], [-3, 3, -2]], "#e9d9bf");
  sc.plane([[-3, 0, 4], [-3, 0, -2], [-3, 3, -2], [-3, 3, 4]], "#d9c6a8");
  sc.plane([[3, 0, -2], [3, 0, 4], [3, 3, 4], [3, 3, -2]], "#d9c6a8");
  sc.plane([[-3, 0, -1.99], [3, 0, -1.99], [3, 1.0, -1.99], [-3, 1.0, -1.99]], "#3a5a4a");
  sc.decal([0.2, 2.1, -1.985], 1.6, 0.9, 0, pMenu, "menu", { zb: 0.2, lw: 4 });
  sc.decal([-1.9, 2.25, -1.985], 0.9, 0.35, 0, pSign("КОФЕ", "#3a5a4a", "#f5c518"), "cafesign", { zb: 0.2 });
  sc.decal([2.0, 2.35, -1.985], 0.42, 0.42, 0, pClock, "clockC", { frame: false, zb: 0.2 });
  // стойка
  sc.box([0, 0.33, -0.9], [3.2, 0.66, 0.5], "#3a5a4a", { zb: 0.2 }); sc.box([0, 0.69, -0.9], [3.3, 0.06, 0.6], "#c9a77a", { zb: 0.15 });
  sc.box([-1.2, 0.8, -0.95], [0.32, 0.18, 0.28], "#2a2d33", { zb: 0.1 }); sc.box([-1.2, 0.93, -1.0], [0.28, 0.12, 0.04], "#7cc8ff", { zb: 0.09, glow: 0.2 });   // касса
  sc.box([1.15, 0.97, -1.0], [0.5, 0.5, 0.35], "#c9ccd1", { metal: 0.4, zb: 0.1 }); sc.box([1.15, 0.8, -0.84], [0.16, 0.06, 0.1], "#2a2d33", { zb: 0.09 });   // кофемашина
  for (let i = 0; i < 4; i++) sc.box([0.5 + i * 0.07, 0.78, -1.0], [0.06, 0.12, 0.06], "#ffffff", { zb: 0.08 });
  sc.box([-1.9, 1.5, -1.85], [1.2, 0.04, 0.3], "#7a4a2c", { zb: 0.2 }); for (let i = 0; i < 5; i++) sc.box([-2.35 + i * 0.22, 1.6, -1.85], [0.12, 0.16, 0.12], ["#d6453d", "#f2c230", "#2f6fd6", "#3aa676", "#e46b2b"][i], { zb: 0.15 });
  for (const x of [-1.2, 0.2, 1.4]) { sc.box([x, 2.75, -0.9], [0.02, 0.5, 0.02], "#20180f", { line: false, shadow: false }); sc.box([x, 2.45, -0.9], [0.25, 0.18, 0.25], "#f2c230", { glow: 0.3, shadow: false }); }
  if (o.door) sc.decal([-2.985, 1.05, 0.6], 0.95, 2.1, Math.PI / 2, pDoor, "doorC", { zb: 0 });
}
function airport(sc, t, o = {}) {
  sc.plane([[-30, 0, -6], [30, 0, -6], [30, 0, 10], [-30, 0, 10]], "#d8dde3", false);
  for (let x = -12; x < 12; x += 1.2) sc.bg.push({ pts: [[x, 0.001, -6], [x + 0.02, 0.001, -6], [x + 0.02, 0.001, 10], [x, 0.001, 10]], col: "rgba(120,130,140,0.3)", line: false });
  sc.plane([[-30, 0, -4], [30, 0, -4], [30, 5, -4], [-30, 5, -4]], "#bfe0ff", false);
  for (let x = -12; x < 12; x += 2) sc.box([x, 2.5, -3.95], [0.12, 5, 0.12], "#8d939b", { zb: 0.5, shadow: false });
  sc.box([0, 4.6, -3.0], [30, 0.2, 2], "#eef1f4", { zb: 0.5, shadow: false });
  sc.decal([0.3, 2.9, -3.9], 3.2, 1.3, 0, o.board ?? pBoard([["РЕЙС", "ВЫЛЕТ"], ["SU 2450  ПАРИЖ", "29.10"], ["DL 116  РИМ", "29.10"], ["TK 412  СТАМБУЛ", "29.10"]]), o.boardKey ?? "board1", { zb: 0.4, lw: 5 });
  sc.decal([-3.4, 3.2, -3.9], 1.4, 0.45, 0, pSign("ВЫЛЕТ ✈", "#2f6fd6", "#fff"), "vylet", { zb: 0.4 });
  for (const x of [-2.6, -1.9, 2.6, 3.3]) { sc.box([x, 0.25, -2.6], [0.5, 0.5, 0.5], "#2f6fd6", { zb: 0.3 }); sc.box([x, 0.55, -2.83], [0.5, 0.5, 0.06], "#2f6fd6", { zb: 0.3 }); }
  if (o.taxiSign) sc.decal([2.6, 2.6, -3.9], 1.0, 0.45, 0, pSign("TAXI ✓", "#f2c230", "#20180f"), "taxisign", { zb: 0.4 });
}
function foreignStreet(sc, t, o = {}) {
  street(sc, t, Object.assign({ noCars: true }, o));
  sc.decal([-2.2, 2.2, -3.59], 1.8, 0.45, 0, pSign("BOULANGERIE", "#d6453d", "#fff", 0.45), "fs1", { zb: 0.3 });
  sc.decal([1.6, 2.5, -3.59], 1.4, 0.45, 0, pSign("HÔTEL LUNE", "#20335a", "#f5c518", 0.45), "fs2", { zb: 0.3 });
  sc.decal([5.4, 2.6, -3.59], 1.4, 0.45, 0, pSign("FARMACIA +", "#3aa676", "#fff", 0.42), "fs3", { zb: 0.3 });
}
function dormRoom(sc, t, o = {}) {
  sc.plane([[-1.6, 0, -2], [1.6, 0, -2], [1.6, 0, 3], [-1.6, 0, 3]], "#b98b5e", false);
  sc.plane([[-1.6, 2.8, -2], [-1.6, 2.8, 3], [1.6, 2.8, 3], [1.6, 2.8, -2]], "#efe8da");
  sc.plane([[-1.6, 0, -2], [1.6, 0, -2], [1.6, 2.8, -2], [-1.6, 2.8, -2]], "#d9e3c2");
  sc.plane([[-1.6, 0, 3], [-1.6, 0, -2], [-1.6, 2.8, -2], [-1.6, 2.8, 3]], "#c8d4ad");
  sc.plane([[1.6, 0, -2], [1.6, 0, 3], [1.6, 2.8, 3], [1.6, 2.8, -2]], "#c8d4ad");
  sc.decal([0, 1.75, -1.985], 0.9, 0.8, 0, pSky(t, {}), "dormwin", { zb: 0.3 });
  for (const s of [-1, 1]) { sc.box([s * 1.15, 0.22, -0.6], [0.8, 0.44, 1.9], "#8d939b", { zb: 0.3 }); sc.box([s * 1.15, 0.5, -0.6], [0.76, 0.12, 1.86], s < 0 ? "#2f6fd6" : "#e8453c", { zb: 0.25 }); sc.box([s * 1.15, 0.6, -1.35], [0.5, 0.12, 0.3], "#ffffff", { zb: 0.2 }); }
  sc.box([0, 0.72, -1.7], [0.9, 0.05, 0.5], "#b8784a", { zb: 0.3 }); for (const dx of [-0.4, 0.4]) sc.box([dx, 0.36, -1.7], [0.05, 0.72, 0.45], "#7a4a2c", { shadow: false, zb: 0.32 });
  sc.box([-0.25, 0.8, -1.75], [0.25, 0.1, 0.18], "#2f6fd6", { zb: 0.1 }); sc.box([0.25, 0.85, -1.75], [0.12, 0.2, 0.12], "#f2c230", { zb: 0.1 });
  sc.decal([-1.585, 1.6, -0.6], 0.8, 0.55, Math.PI / 2, pPoster("ФИЗИКА\n2 КУРС", "#20335a", "#fff"), "dormposter", { zb: 0.2 });
  sc.box([0, 2.7, -0.4], [0.4, 0.08, 0.4], "#fff2b8", { glow: 0.3, shadow: false });
  if (o.rules) sc.decal([1.585, 1.5, 0.9], 0.6, 0.75, -Math.PI / 2, pRules(o.rules), "rules" + o.rules, { zb: 0.2 });
  if (o.fish) { sc.box([1.2, 0.75, 0.6], [0.35, 0.06, 0.35], "#2a2d33", { zb: 0.1 }); }
}
function busStop(sc, t, o = {}) {
  street(sc, t, Object.assign({ noCars: true }, o));
  sc.box([-0.2, 1.25, -2.2], [2.6, 0.08, 1.0], "#3a3d44", { zb: 0.3 });
  sc.box([-0.2, 1.25, -2.66], [2.6, 2.5, 0.04], "#bfe6ff", { zb: 0.35, dark: 1.05 });
  for (const dx of [-1.45, 1.05]) sc.box([-0.2 + dx + 0.2, 1.25, -2.2], [0.06, 2.5, 0.06], "#3a3d44", { zb: 0.3 });
  sc.box([-0.2, 2.52, -2.2], [2.8, 0.12, 1.1], "#3a3d44", { zb: 0.3 });
  sc.box([-0.2, 0.45, -2.45], [1.8, 0.06, 0.35], "#d07a3a", { zb: 0.3 });
  sc.decal([1.25, 2.85, -2.2], 0.6, 0.6, 0, pSign("A", "#2f6fd6", "#fff", 0.7), "busA", { zb: 0.2 });
  sc.box([1.25, 1.4, -2.2], [0.06, 2.8, 0.06], "#3a3d44", { zb: 0.25 });
}

// ---------------------------------------------------------------- предметы в руках
const drawCakeBox = (g, x, y, k) => { g.save(); g.translate(x, y); g.fillStyle = "#fffbe6"; g.strokeStyle = INKC; g.lineWidth = 3; g.fillRect(-0.12 * k, -0.08 * k, 0.24 * k, 0.12 * k); g.strokeRect(-0.12 * k, -0.08 * k, 0.24 * k, 0.12 * k); g.strokeStyle = "#ff6b9a"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -0.08 * k); g.lineTo(0, 0.04 * k); g.moveTo(-0.12 * k, -0.02 * k); g.lineTo(0.12 * k, -0.02 * k); g.stroke(); g.beginPath(); g.ellipse(-0.025 * k, -0.1 * k, 0.025 * k, 0.015 * k, 0, 0, 7); g.ellipse(0.025 * k, -0.1 * k, 0.025 * k, 0.015 * k, 0, 0, 7); g.stroke(); g.restore(); };
const drawFlowers = (g, x, y, k) => { g.save(); g.translate(x, y); g.strokeStyle = "#3f8a4b"; g.lineWidth = 4; for (const a of [-0.3, 0, 0.3]) { g.beginPath(); g.moveTo(0, 0.06 * k); g.lineTo(Math.sin(a) * 0.1 * k, -0.12 * k); g.stroke(); } g.fillStyle = "#c9e6ff"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.moveTo(-0.05 * k, -0.02 * k); g.lineTo(0.05 * k, -0.02 * k); g.lineTo(0.02 * k, 0.08 * k); g.lineTo(-0.02 * k, 0.08 * k); g.closePath(); g.fill(); g.stroke(); for (const [a, c] of [[-0.3, "#ff6b9a"], [0, "#f5c518"], [0.3, "#e8453c"]]) { g.fillStyle = c; g.beginPath(); g.arc(Math.sin(a) * 0.1 * k, -0.14 * k, 0.035 * k, 0, 7); g.fill(); g.stroke(); } g.restore(); };
const drawPhone = (g, x, y, k, screen) => { g.save(); g.translate(x, y); g.fillStyle = "#20232a"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.04 * k, -0.075 * k, 0.08 * k, 0.15 * k, 6); g.fill(); g.stroke(); g.fillStyle = screen ?? "#7cc8ff"; g.fillRect(-0.033 * k, -0.065 * k, 0.066 * k, 0.13 * k); g.restore(); };
const drawPassport = (g, x, y, k) => { g.save(); g.translate(x, y); g.fillStyle = "#8a2a2a"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.roundRect(-0.055 * k, -0.075 * k, 0.11 * k, 0.15 * k, 4); g.fill(); g.stroke(); g.strokeStyle = "#e3c27a"; g.lineWidth = 2; g.beginPath(); g.arc(0, -0.01 * k, 0.025 * k, 0, 7); g.stroke(); g.fillStyle = "#e3c27a"; g.fillRect(-0.035 * k, 0.03 * k, 0.07 * k, 0.008 * k); g.restore(); };
const drawSuitcase = (g, x, y, k) => { g.save(); g.translate(x, y); g.fillStyle = "#e8453c"; g.strokeStyle = INKC; g.lineWidth = 4; g.beginPath(); g.roundRect(-0.18 * k, -0.5 * k, 0.36 * k, 0.5 * k, 10); g.fill(); g.stroke(); g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 3; for (const dx of [-0.08, 0, 0.08]) { g.beginPath(); g.moveTo(dx * k, -0.46 * k); g.lineTo(dx * k, -0.04 * k); g.stroke(); } g.strokeStyle = INKC; g.lineWidth = 4; g.beginPath(); g.moveTo(-0.06 * k, -0.5 * k); g.lineTo(-0.06 * k, -0.68 * k); g.lineTo(0.06 * k, -0.68 * k); g.lineTo(0.06 * k, -0.5 * k); g.stroke(); g.fillStyle = "#20180f"; for (const dx of [-0.13, 0.13]) { g.beginPath(); g.arc(dx * k, 0.01 * k, 0.025 * k, 0, 7); g.fill(); } g.restore(); };
const drawCup = (g, x, y, k, foam = true, label) => { g.save(); g.translate(x, y); g.fillStyle = "#ffffff"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.moveTo(-0.045 * k, -0.05 * k); g.lineTo(0.045 * k, -0.05 * k); g.lineTo(0.035 * k, 0.05 * k); g.lineTo(-0.035 * k, 0.05 * k); g.closePath(); g.fill(); g.stroke(); if (foam) { g.fillStyle = "#f2e2c6"; g.beginPath(); g.ellipse(0, -0.05 * k, 0.045 * k, 0.015 * k, 0, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "#a0522d"; g.lineWidth = 2; g.beginPath(); g.arc(0, -0.05 * k, 0.012 * k, 0, 7); g.stroke(); } g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.arc(0.055 * k, 0, 0.02 * k, -1.2, 1.2); g.stroke(); g.restore(); };
const drawPlate = (g, x, y, k) => { g.save(); g.translate(x, y); g.fillStyle = "#ffffff"; g.strokeStyle = INKC; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(0, -i * 0.018 * k, 0.11 * k, 0.03 * k, 0, 0, 7); g.fill(); g.stroke(); } g.restore(); };
const drawPan = (g, x, y, k, t) => { g.save(); g.translate(x, y); g.fillStyle = "#2a2d33"; g.strokeStyle = INKC; g.lineWidth = 3; g.beginPath(); g.ellipse(0, 0, 0.13 * k, 0.04 * k, 0, 0, 7); g.fill(); g.stroke(); g.fillRect(0.12 * k, -0.01 * k, 0.15 * k, 0.02 * k); g.fillStyle = "#c9a07a"; g.beginPath(); g.ellipse(-0.01 * k, -0.012 * k, 0.08 * k, 0.025 * k, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0.07 * k, -0.012 * k); g.lineTo(0.1 * k, -0.035 * k); g.lineTo(0.1 * k, 0.01 * k); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = "rgba(150,170,90,0.75)"; g.lineWidth = 5; for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; g.globalAlpha = 1 - ph; g.beginPath(); for (let j = 0; j <= 10; j++) { const yy = -0.05 * k - ph * 0.35 * k - j * 0.02 * k; const xx = (i - 1) * 0.05 * k + Math.sin(j * 0.9 + t * 4 + i) * 0.02 * k; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore(); };
const drawHeart = (g, x, y, s, beat = 1) => { g.save(); g.translate(x, y); g.scale(s * beat, s * beat); g.fillStyle = "#ff4d6d"; g.strokeStyle = "#000"; g.lineWidth = 0.06; g.beginPath(); g.moveTo(0, 0.35); g.bezierCurveTo(-0.6, -0.05, -0.35, -0.55, 0, -0.25); g.bezierCurveTo(0.35, -0.55, 0.6, -0.05, 0, 0.35); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.ellipse(-0.2, -0.22, 0.08, 0.05, -0.6, 0, 7); g.fill(); g.restore(); };
function phoneScreen(g, t, t0, draw, o = {}) {   // большой телефон на экране
  const s = popScale(t, t0, 0.4); if (s <= 0) return; const x = o.x ?? 540, y = o.y ?? 760, w = o.w ?? 460, h = o.h ?? 780;
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.rot ?? 0.04);
  g.fillStyle = "#20232a"; g.strokeStyle = "#000"; g.lineWidth = 10; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 50); g.fill(); g.stroke();
  g.save(); g.beginPath(); g.roundRect(-w / 2 + 22, -h / 2 + 40, w - 44, h - 80, 26); g.clip(); g.fillStyle = "#f4f6fa"; g.fillRect(-w / 2, -h / 2, w, h); draw(g, -w / 2 + 22, -h / 2 + 40, w - 44, h - 80); g.restore();
  g.restore();
}
