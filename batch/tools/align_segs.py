# Пословные тайминги по карте пауз (отрезки речи), с подбором границ динамическим программированием.
# Каждый отрезок речи получает подряд идущие слова; границы отрезков тянутся к знакам препинания,
# число слогов в отрезке — к его длительности.
#   python3 tools/align_segs.py NAME   (читает NN_name.txt и voice/segments.json; темп 1.1)
import json, re, sys
name = sys.argv[1]; SPEED = 1.1
txt = open(f"{name}.txt", encoding="utf-8").read().strip()
seg = json.load(open("voice/segments.json"))[name]
segs = [tuple(float(x) / SPEED for x in s.split("-")) for s in seg["segs"].split()]
segs = [s for s in segs if s[1] - s[0] >= 0.06]
paras = [re.sub(r"\s+[—–-]\s+", "— ", p).split() for p in re.split(r"\n\s*\n", txt)]
words = [(w, pi) for pi, p in enumerate(paras) for w in p if re.search(r"\w", w)]
V = lambda w: max(1, len(re.findall(r"[аеёиоуыэюя]", w.lower()))) + 0.35
syl = [V(w) for w, _ in words]; cum = [0.0]
for s in syl: cum.append(cum[-1] + s)
n, m = len(words), len(segs)
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
    dur = segs[j - 1][1] - segs[j - 1][0]
    for b in range(j, n - (m - j) + 1):
        best, bi = INF, 0
        for a in range(j - 1, b):
            if D[j - 1][a] >= INF: continue
            exp = (cum[b] - cum[a]) / rate
            c = D[j - 1][a] + (exp - dur) ** 2 / max(0.5, dur) + pen(b)
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
json.dump(res, open(f"voice/{name}_words.json", "w"), ensure_ascii=False, indent=0)
# субтитры
groups, cur = [], []
for k, w in enumerate(res):
    cur.append(w); L = sum(len(x["t"]) for x in cur); nxt = res[k + 1] if k + 1 < len(res) else None
    if re.search(r"[.,:!?…—]$", w["t"]) or len(cur) >= 3 or L > 13 or nxt is None or nxt["p"] != w["p"]:
        groups.append({"text": " ".join(x["t"] for x in cur).replace("—", "").replace("  ", " ").strip(), "s": cur[0]["s"], "e": min(cur[-1]["e"] + 0.05, cur[0]["s"] + 2.5)}); cur = []
for a_, b_ in zip(groups, groups[1:]): a_["e"] = min(max(a_["e"], a_["s"] + 0.25), b_["s"])
total = round(seg["dur"] / SPEED + 0.7, 2)
open(f"render/cap_{name}.js", "w").write(f"const CAPTIONS = {json.dumps(groups, ensure_ascii=False)};\nconst TOTAL_T = {total};\n")
print(name, "длина", total, "с")
for p in range(len(paras)):
    ws = [w for w in res if w["p"] == p]
    print(f"  {p}: " + " ".join(f"{w['s']:.1f}·{w['t']}" for w in ws))
