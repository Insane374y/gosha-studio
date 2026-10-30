# Автоприглушение эффектов под голосом: в каждом окне 40 мс эффекты не громче голоса минус 8 дБ.
#   python3 duck.py sfx.wav voice.mp3 atempo(1|0)
import os, sys, subprocess, tempfile, numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d, minimum_filter1d
sfx_p, voice_p, tempo = sys.argv[1], sys.argv[2], sys.argv[3] == "1"
tmp = os.path.join(tempfile.gettempdir(), "duckv.wav")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", voice_p, "-af", "atempo=1.1" if tempo else "anull", "-ar", "44100", "-ac", "1", tmp], check=True)
sr, v = wavfile.read(tmp); v = v.astype(np.float32) / 32768
sr, s = wavfile.read(sfx_p); s = s.astype(np.float32); mono = s[:, 0]
n = len(mono); v = np.pad(v, (0, max(0, n - len(v))))[:n]
W = int(0.04 * sr); nw = n // W
vr = np.sqrt(np.mean(v[: nw * W].reshape(nw, W) ** 2, 1) + 1e-12); sr_ = np.sqrt(np.mean(mono[: nw * W].reshape(nw, W) ** 2, 1) * 0.25 + 1e-12)
vdb = 20 * np.log10(vr); vdb = uniform_filter1d(np.maximum.accumulate(vdb[::-1])[::-1] * 0 + vdb, 3)
active = vdb > -42
target = np.where(active, 10 ** ((vdb - 8) / 20) / sr_, 1.0)
g = np.minimum(1.0, target); g = minimum_filter1d(g, 5); g = uniform_filter1d(g, 5)
gs = np.interp(np.arange(n), np.arange(nw) * W + W / 2, g)
s *= gs[:, None]
wavfile.write(sfx_p, sr, s.astype(np.float32))
print(f"приглушено окон: {(g < 0.95).sum()} из {nw}")
