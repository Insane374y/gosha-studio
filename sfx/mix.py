# Звуковая дорожка эффектов для ролика: авто (склейки, всплывающие надписи, титр) + ручные сюжетные события.
#   python3 mix.py <video_js> <cues_py> <out_sfx_wav> <duration>
import os, re, sys, importlib.util, json
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sfx as S

def auto_cues(js_text, time_map=None):
    tm = time_map or (lambda x: x)
    cues = [(0.05, "whoosh_title", 0.55), (tm(0.3), "pop", 0.5, 1.0), (tm(0.9), "pop", 0.5, 1.25)]
    shots = [float(x) for x in re.findall(r"\{\s*t0:\s*([\d.]+)", js_text)]
    for i, t0 in enumerate(sorted(set(shots))):
        if t0 > 0.5: cues.append((tm(t0) - 0.18, "swish" if i % 2 else "whoosh", 0.32))
    pops = set()
    for pat in [r"tag\(sc, \[[^\]]*\], (?:\"[^\"]*\"|txt), t, ([\d.]+)", r"bubbleLabel\([^;]*?, t, ([\d.]+)", r"popScale\(t, ([\d.]+)", r"cloud\(g, t, ([\d.]+)", r"thoughtIcons\(g, t, ([\d.]+)"]:
        for m in re.findall(pat, js_text): pops.add(round(float(m), 2))
    for i, t0 in enumerate(sorted(pops)): cues.append((tm(t0), "pop", 0.32, [1.0, 1.2, 0.9, 1.35][i % 4]))
    return cues

def render(cues, dur):
    out = np.zeros(int((dur + 2) * S.SR))
    cache = {}
    for c in cues:
        t, name, gain = c[0], c[1], c[2]; arg = c[3] if len(c) > 3 else None
        key = (name, json.dumps(arg))
        if key not in cache:
            if name == "whoosh_title": clip = S.whoosh(0.6, 200, 3000)
            elif arg is None: clip = getattr(S, name)()
            elif isinstance(arg, dict): clip = getattr(S, name)(**arg)
            else: clip = getattr(S, name)(arg)
            cache[key] = clip
        clip = cache[key]; s = int(max(0, t) * S.SR); e = min(len(out), s + len(clip)); out[s:e] += clip[: e - s] * gain
    out = out[: int(dur * S.SR)]
    peak = np.max(np.abs(out)); out = out / max(1.0, peak / 0.95)
    return out

if __name__ == "__main__":
    js, cues_py, out_wav, dur = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
    spec = importlib.util.spec_from_file_location("cues", cues_py); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    tm = getattr(m, "TIME_MAP", None)
    cues = auto_cues(open(js, encoding="utf-8").read(), tm) + m.CUES
    x = render(cues, dur)
    wavfile.write(out_wav, S.SR, np.stack([x, x], 1).astype(np.float32))
    print(f"эффектов: {len(cues)} → {out_wav}")
