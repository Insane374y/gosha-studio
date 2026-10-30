# Точные тайминги: каждая фраза привязана к своему отрезку речи (по паузам), слова внутри фразы — по слогам.
#   python3 tools/align2.py public/voice.mp3 script/voice.txt
import json, re, subprocess, sys
audio, spoken_f = sys.argv[1:3]
# начало/конец каждой фразы в public/voice.mp3 (сверено с паузами silencedetect)
ANCH = [(0.00, 2.20), (2.75, 4.78), (5.09, 8.00), (8.49, 8.92), (9.27, 10.83), (11.20, 12.88), (13.35, 15.34), (15.85, 18.55),
        (19.06, 21.29), (21.70, 22.67), (23.06, 24.37), (24.74, 25.11), (25.53, 26.46), (26.72, 28.65), (29.28, 31.00), (31.43, 35.20),
        (35.68, 38.30), (38.59, 40.79), (41.35, 44.01), (44.43, 47.22), (47.66, 49.33), (49.80, 51.89), (52.21, 53.48)]
out = subprocess.run(["ffmpeg", "-i", audio, "-af", "silencedetect=noise=-35dB:d=0.1", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
sil = list(zip(st, en))
paras = [p.split() for p in re.split(r"\n\s*\n", open(spoken_f, encoding="utf-8").read().strip())]
words = [(w, pi) for pi, p in enumerate(paras) for w in p if re.search(r"\w", w)]
sents, cur = [], []
for w in words:
    cur.append(w)
    if re.search(r"[.?!:]$", w[0]): sents.append(cur); cur = []
if cur: sents.append(cur)
assert len(sents) == len(ANCH), (len(sents), len(ANCH))
V = lambda w: max(1, len(re.findall(r"[аеёиоуыэюя]", w.lower()))) + 0.35
res = []
for (s0, s1), sw in zip(ANCH, sents):
    # голосовые куски внутри фразы (вычитаем внутренние паузы)
    segs, t = [], s0
    for a, b in sil:
        if a > s0 + 0.05 and b < s1 - 0.05: segs.append((t, a)); t = b
    segs.append((t, s1))
    voiced = sum(b - a for a, b in segs); syl = [V(w) for w, _ in sw]; tot = sum(syl)
    def at(x):  # доля голоса x∈[0,1] → время
        need = x * voiced
        for a, b in segs:
            if need <= b - a + 1e-9: return a + need
            need -= b - a
        return segs[-1][1]
    c = 0
    for (w, pi), sy in zip(sw, syl):
        res.append({"t": w, "s": round(at(c / tot), 2), "e": round(at((c + sy) / tot), 2), "p": pi}); c += sy
json.dump(res, open("audio/words.json", "w"), ensure_ascii=False, indent=1)
print(len(res), "слов; абзацы:", [next(w["s"] for w in res if w["p"] == p) for p in range(len(paras))])
