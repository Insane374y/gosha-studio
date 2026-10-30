# Муха: время раскадровки «старое» — переводим в время голоса через TIMEMAP.
import json, pathlib, re, numpy as np
_txt = (pathlib.Path(__file__).resolve().parents[2] / "fly-short/render/captions.js").read_text(encoding="utf-8")
_pairs = json.loads(re.search(r"const TIMEMAP = (\[.*?\]);", _txt, re.S).group(1))
_old = np.array([p[0] for p in _pairs]); _new = np.array([p[1] for p in _pairs])
def TIME_MAP(t): return float(np.interp(t, _old, _new, left=t + (_new[0] - _old[0]), right=t + (_new[-1] - _old[-1])))
_C = [
    (0.4, "buzz", 0.6, {"d": 2.0}), (1.75, "sparkle", 0.6),
    (2.6, "whoosh", 0.45, {"d": 4.8, "f0": 150, "f1": 900}), (2.6, "buzz", 0.35, {"d": 5.8}), (4.9, "snore", 0.3, {"d": 0.7}), (7.4, "whoosh", 0.6, {"d": 0.6}), (8.3, "thud", 0.5, {"f": 70, "d": 0.3}),
    (9.0, "sparkle", 0.5), (10.6, "drip", 0.5), (10.9, "bloop", 0.25, 300), (12.0, "boing", 0.3, {"d": 1.0, "f": 160}),
    (15.5, "flicker", 0.6, {"d": 2.2}), (17.7, "tick", 0.6), (18.4, "tick", 0.6), (19.1, "tick", 0.6), (19.8, "tick", 0.6),
    (22.2, "boing", 0.4, {"d": 0.4, "f": 260}), (24.6, "sparkle", 0.4),
    (26.75, "boing", 0.35, {"d": 0.35, "f": 400}), (28.85, "shutter", 0.5), (31.0, "drip", 0.5), (33.0, "bloop", 0.3, 300),
    (35.0, "buzz", 0.35, {"d": 6.0}),
    (42.4, "whoosh", 0.4, {"d": 0.7}), (43.4, "zip_away", 0.7), (44.35, "smack", 0.9), (44.5, "buzz", 0.3, {"d": 2.0}),
    (47.4, "whoosh", 0.5, {"d": 2.2, "f0": 200, "f1": 1200}), (47.4, "buzz", 0.3, {"d": 2.0}), (49.2, "zip_away", 0.6), (50.6, "whoosh", 0.6, {"d": 0.5}), (51.3, "thud", 0.6, {"f": 80, "d": 0.3}), (51.6, "sad_trombone", 0.3),
]
CUES = [(TIME_MAP(c[0]),) + tuple(c[1:]) for c in _C]
