# Пословные тайминги и субтитры по английскому голосу.
# Паузы в голосе находит сам (ffmpeg silencedetect) — карту отрезков вручную готовить не нужно.
#   python3 tools/align.py NAME      (запускать из папки us/)
#   читает scripts/NAME.md (раздел «Озвучка (EN)») и voice/NAME.mp3
#   пишет voice/NAME_words.json и render/cap_NAME.js (CAPTIONS + TOTAL_T)
import json, pathlib, re, subprocess, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
name = sys.argv[1]


def script_text(name):
    md = (ROOT / f"scripts/{name}.md").read_text(encoding="utf-8")
    m = re.search(r"## Озвучка \(EN\)\n(.*?)(?=\n## |\Z)", md, re.S)
    if not m: sys.exit(f"в scripts/{name}.md нет раздела «## Озвучка (EN)»")
    return m.group(1).strip()


def speech_segments(mp3, noise="-35dB", gap=0.18):
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)], capture_output=True, text=True).stdout)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(mp3), "-af", f"silencedetect=n={noise}:d={gap}", "-f", "null", "-"], capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    segs, cur = [], 0.0
    for s, e in zip(starts, ends + [dur]):
        if s - cur >= 0.06: segs.append((cur, s))
        cur = e
    if dur - cur >= 0.06: segs.append((cur, dur))
    return segs, dur


def syllables(w):   # грубая оценка слогов английского слова
    w = re.sub(r"[^a-z]", "", w.lower())
    if not w: return 1
    if w.isdigit(): return 2
    n = len(re.findall(r"[aeiouy]+", w))
    if w.endswith("e") and not w.endswith(("le", "ee")) and n > 1: n -= 1
    return max(1, n)


txt = script_text(name)
segs, dur = speech_segments(ROOT / f"voice/{name}.mp3")
paras = [re.sub(r"\s+[—–-]\s+", "— ", p).split() for p in re.split(r"\n\s*\n", txt)]
words = [(w, pi) for pi, p in enumerate(paras) for w in p if re.search(r"\w", w)]
syl = [syllables(w) + 0.35 for w, _ in words]; cum = [0.0]
for s in syl: cum.append(cum[-1] + s)
n, m = len(words), len(segs)
if m > n: segs = sorted(segs, key=lambda s: s[1] - s[0], reverse=True)[:n]; segs.sort(); m = n
rate = cum[-1] / sum(e - s for s, e in segs)


def pen(k):  # граница после слова k-1
    if k == n: return 0
    w, p = words[k - 1]
    if words[k][1] != p: return 0
    if re.search(r"[.?!…]$", w): return 0.02
    if re.search(r"[,:;—]$", w): return 0.15
    return 0.9


INF = 1e18
D = [[INF] * (n + 1) for _ in range(m + 1)]; B = [[0] * (n + 1) for _ in range(m + 1)]
D[0][0] = 0
for j in range(1, m + 1):
    sd = segs[j - 1][1] - segs[j - 1][0]
    for b in range(j, n - (m - j) + 1):
        best, bi = INF, 0
        for a in range(j - 1, b):
            if D[j - 1][a] >= INF: continue
            c = D[j - 1][a] + ((cum[b] - cum[a]) / rate - sd) ** 2 / max(0.5, sd) + pen(b)
            if c < best: best, bi = c, a
        D[j][b], B[j][b] = best, bi
cuts = [n]; b = n
for j in range(m, 0, -1): b = B[j][b]; cuts.append(b)
cuts = cuts[::-1]
res = []
for j in range(m):
    a, b = cuts[j], cuts[j + 1]; s, e = segs[j]; tot = cum[b] - cum[a]
    for k in range(a, b):
        res.append({"t": words[k][0], "s": round(s + (e - s) * (cum[k] - cum[a]) / tot, 2), "e": round(s + (e - s) * (cum[k + 1] - cum[a]) / tot, 2), "p": words[k][1]})
json.dump(res, open(ROOT / f"voice/{name}_words.json", "w"), ensure_ascii=False, indent=0)
# субтитры: по 1–3 слова, рвём на знаках препинания
groups, cur = [], []
for k, w in enumerate(res):
    cur.append(w); L = sum(len(x["t"]) for x in cur); nxt = res[k + 1] if k + 1 < len(res) else None
    if re.search(r"[.,:!?…—]$", w["t"]) or len(cur) >= 3 or L > 14 or nxt is None or nxt["p"] != w["p"]:
        groups.append({"text": " ".join(x["t"] for x in cur).replace("—", "").replace("  ", " ").strip(), "s": cur[0]["s"], "e": min(cur[-1]["e"] + 0.05, cur[0]["s"] + 2.5)}); cur = []
for a_, b_ in zip(groups, groups[1:]): a_["e"] = min(max(a_["e"], a_["s"] + 0.25), b_["s"])
total = round(dur + 0.7, 2)
(ROOT / f"render/cap_{name}.js").write_text(f"const CAPTIONS = {json.dumps(groups, ensure_ascii=False)};\nconst TOTAL_T = {total};\n")
print(name, "длина", total, "с; отрезков речи", m, "слов", n)
for p in range(len(paras)):
    ws = [w for w in res if w["p"] == p]
    print(f"  {p}: " + " ".join(f"{w['s']:.1f}·{w['t']}" for w in ws))
