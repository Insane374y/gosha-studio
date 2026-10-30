# Пословные тайминги без whisper: паузы (ffmpeg silencedetect) + слоги.
# Речь разбивается на отрезки между паузами; слова раскладываются по отрезкам пропорционально слогам,
# границы отрезков притягиваются к концам фраз (знаки препинания).
#   python3 tools/align.py public/voice.mp3 script/voice.txt script/voice_display.txt
import json, re, subprocess, sys

audio, spoken_f, display_f = sys.argv[1:4]
out = subprocess.run(["ffmpeg", "-i", audio, "-af", "silencedetect=noise=-35dB:d=0.12", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio],
                           capture_output=True, text=True).stdout)
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
sil = list(zip(starts, ends + [dur] * (len(starts) - len(ends))))
segs, t = [], 0.0
for s, e in sil:
    if s - t > 0.05: segs.append([t, s])
    t = e
if dur - t > 0.05: segs.append([t, dur])
segs = [s for s in segs if s[1] - s[0] > 0.08]

def paras(f):
    return [p.split() for p in re.split(r"\n\s*\n", open(f, encoding="utf-8").read().strip())]
P = paras(spoken_f)
words = [(w, pi) for pi, p in enumerate(P) for w in p if re.search(r"\w", w)]
V = lambda w: max(1, len(re.findall(r"[аеёиоуыэюяaeiou]", w.lower())))
syl = [V(w) + 0.35 for w, _ in words]
cum = [0.0]
for s in syl: cum.append(cum[-1] + s)
total_voiced = sum(e - s for s, e in segs)
rate = cum[-1] / total_voiced
# граница отрезка → индекс слова (конец слова), с притяжением к пунктуации и к концам абзацев
bounds, acc, prev = [0], 0.0, 0
for si, (s, e) in enumerate(segs[:-1]):
    acc += (e - s) * rate
    best, bi = 1e9, prev + 1
    for k in range(prev + 1, len(words)):
        w, pi = words[k - 1]
        nxt_pi = words[k][1] if k < len(words) else -1
        bonus = 4.0 if nxt_pi != pi else 2.2 if re.search(r"[.!?…]$", w) else 1.4 if re.search(r"[,:;—]$", w) else 0
        cost = abs(cum[k] - acc) - bonus
        if cost < best: best, bi = cost, k
        if cum[k] - acc > 8: break
    bounds.append(bi); prev = bi
    acc = cum[bi]   # пересинхронизация по выбранной границе
bounds.append(len(words))
res = []
for si, (s, e) in enumerate(segs):
    a, b = bounds[si], bounds[si + 1]
    if b <= a: continue
    tot = cum[b] - cum[a]
    for k in range(a, b):
        ws = s + (e - s) * (cum[k] - cum[a]) / tot
        we = s + (e - s) * (cum[k + 1] - cum[a]) / tot
        res.append({"t": words[k][0], "s": round(ws, 2), "e": round(we, 2), "p": words[k][1]})
# слова для субтитров: числа цифрами (заменяем по совпадению)
json.dump(res, open("audio/words.json", "w"), ensure_ascii=False, indent=1)
pst = {}
for w in res: pst.setdefault(w["p"], w["s"])
print("отрезков речи:", len(segs), " слов:", len(res), " длительность:", round(dur, 2))
for pi in sorted(pst): print(f"абзац {pi}: {pst[pi]:.2f}  «{' '.join(P[pi][:5])}…»")
print(" | ".join(f"{w['s']:.1f} {w['t']}" for w in res))
