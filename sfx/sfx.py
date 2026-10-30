# Библиотека синтезированных звуковых эффектов (без внешних файлов и лицензий).
import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(7)
T = lambda d: np.arange(int(d * SR)) / SR

def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x * (peak / m)
def env_ad(n, a=0.005, d=None, curve=4.0):
    t = np.arange(n) / SR; a = max(a, 1e-4); d = d or (n / SR - a)
    e = np.where(t < a, t / a, np.exp(-curve * (t - a) / max(d, 1e-4)))
    return e
def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], "band"); return signal.lfilter(b, a, x)
def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "low"); return signal.lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "high"); return signal.lfilter(b, a, x)
def noise(d): return rng.standard_normal(int(d * SR))
def sweep_tone(f0, f1, d, kind="sine"):
    t = T(d); f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    if kind == "sine": return np.sin(ph)
    if kind == "saw": return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if kind == "square": return np.sign(np.sin(ph))
def var_bp(x, fc, q=2.0, step=256):   # фильтр с переменной частотой (для вжухов)
    out = np.zeros_like(x); zi = None
    for i in range(0, len(x), step):
        f = float(np.clip(fc[min(i, len(fc) - 1)], 60, SR / 2 - 500)); bw = f / q
        b, a = signal.butter(2, [max(30, f - bw / 2) / (SR / 2), min(SR / 2 - 200, f + bw / 2) / (SR / 2)], "band")
        if zi is None: zi = signal.lfilter_zi(b, a) * 0
        out[i:i + step], zi = signal.lfilter(b, a, x[i:i + step], zi=zi)
    return out

# ---------------------------------------------------------------- звуки
def whoosh(d=0.45, f0=300, f1=4000, peak=0.8):
    n = noise(d); t = T(d); fc = f0 * (f1 / f0) ** (np.sin(np.pi * t / d * 0.5)); x = var_bp(n, fc, q=1.5)
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.6; return norm(x * e, peak)
def whoosh_long(d=1.2): return whoosh(d, 200, 2200, 0.8)
def swish(d=0.22): return whoosh(d, 1500, 7000, 0.6)
def pop(pitch=1.0, d=0.12):
    t = T(d); f = 900 * pitch * np.exp(-t * 28) + 250 * pitch; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32)
    c = hp(noise(0.006), 2000) * 0.4; x[:len(c)] += c; return norm(x, 0.8)
def boing(d=0.5, f=220):
    t = T(d); fr = f * (1 + 0.35 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 6)); x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 6)
    return norm(x + 0.3 * np.sin(4 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 9), 0.8)
def knock1():
    d = 0.18; t = T(d); body = np.sin(2 * np.pi * 150 * t) * np.exp(-t * 38) + 0.6 * np.sin(2 * np.pi * 310 * t) * np.exp(-t * 55)
    hit = bp(noise(d), 300, 2500) * np.exp(-t * 90) * 0.9; return norm(body + hit, 0.9)
def knocks(n=3, gap=0.22):
    out = np.zeros(int((gap * (n - 1) + 0.25) * SR))
    for i in range(n): k = knock1() * (1 - 0.08 * i); s = int(i * gap * SR); out[s:s + len(k)] += k
    return norm(out, 0.9)
def creak(d=0.8):
    t = T(d); f = 180 + 60 * np.sin(2 * np.pi * 1.3 * t) + 40 * rng.standard_normal(len(t)).cumsum() / np.sqrt(len(t)) * 3
    x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * (rng.random(len(t)) > 0.3)); x = bp(x, 400, 3000)
    return norm(x * np.sin(np.pi * t / d) ** 0.7, 0.6)
def tick():
    d = 0.05; t = T(d); return norm(bp(noise(d), 2500, 8000) * np.exp(-t * 200) + 0.5 * np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 120), 0.7)
def clock_ticks(n=4, gap=0.5): return seq([tick()] * n, gap)
def seq(clips, gap):
    out = np.zeros(int((gap * (len(clips) - 1)) * SR) + max(len(c) for c in clips))
    for i, c in enumerate(clips): s = int(i * gap * SR); out[s:s + len(c)] += c
    return out
def thud(f=70, d=0.35):
    t = T(d); x = np.sin(2 * np.pi * (f + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 12) + lp(noise(d), 600) * np.exp(-t * 40) * 0.5
    return norm(x, 0.9)
def clink(f=2600):
    d = 0.5; t = T(d); x = sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * (8 + 6 * m)) / m for m in [1, 1.51, 2.37]); return norm(x, 0.6)
def plates(): return norm(seq([clink(2400), clink(2900), clink(2100)], 0.12), 0.6)
def ding(f1=1320, f2=1760):
    d = 0.7; t = T(d); a = np.sin(2 * np.pi * f1 * t) * np.exp(-t * 6); b = np.sin(2 * np.pi * f2 * t) * np.exp(-t * 6)
    out = np.zeros(int(0.9 * SR)); out[:len(a)] += a; s = int(0.12 * SR); out[s:s + len(b)] += b; return norm(out, 0.6)
def sparkle(n=6):
    clips = [np.sin(2 * np.pi * f * T(0.25)) * np.exp(-T(0.25) * 14) for f in np.geomspace(1600, 4200, n)]; return norm(seq(clips, 0.05), 0.5)
def shimmer(d=2.0):
    t = T(d); x = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) for f in [1800, 2400, 3100, 3700]) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t))
    return norm(x * np.sin(np.pi * t / d), 0.35)
def heartbeat(n=6, gap=0.75):
    one = thud(55, 0.25) * 0.9; two = thud(48, 0.3) * 0.7; beat = np.zeros(int(0.5 * SR)); beat[:len(one)] += one; s = int(0.17 * SR); beat[s:s + len(two)] += two
    return norm(seq([beat] * n, gap), 0.9)
def boom(d=1.4):
    t = T(d); x = np.sin(2 * np.pi * (40 + 80 * np.exp(-t * 5)) * t) * np.exp(-t * 3) + lp(noise(d), 300) * np.exp(-t * 4) * 0.8; return norm(x, 0.95)
def splash(d=0.9):
    t = T(d); x = bp(noise(d), 600, 7000) * (np.exp(-t * 6)) * (1 + 0.5 * np.sin(2 * np.pi * 9 * t)) + lp(noise(d), 400) * np.exp(-t * 10) * 0.6; return norm(x, 0.8)
def splat():
    d = 0.4; t = T(d); x = lp(noise(d), 1200) * np.exp(-t * 18) + np.sin(2 * np.pi * (300 * np.exp(-t * 20) + 80) * t) * np.exp(-t * 15) * 0.6; return norm(x, 0.85)
def buzz(d=1.0, f=210, move=True):
    t = T(d); fr = f * (1 + 0.06 * np.sin(2 * np.pi * 7 * t) + (0.1 * np.sin(2 * np.pi * 0.9 * t) if move else 0)); x = signal.sawtooth(2 * np.pi * np.cumsum(fr) / SR)
    x = bp(x, 300, 4000) * (0.6 + 0.4 * np.sin(2 * np.pi * 1.7 * t) ** 2); e = np.minimum(1, np.minimum(t / 0.08, (d - t) / 0.12)); return norm(x * e, 0.5)
def zip_away(d=0.35):
    t = T(d); x = signal.sawtooth(2 * np.pi * np.cumsum(220 + 900 * t / d) / SR); x = bp(x, 300, 5000) * np.exp(-t * 4); return norm(x, 0.55)
def engine(d=3.0, rpm=28, rise=0.0):
    t = T(d); f = rpm * (1 + rise * t / d) * (1 + 0.03 * np.sin(2 * np.pi * 0.7 * t)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 12)) + 0.5 * lp(noise(d), 300); x = lp(x, 900) * (0.8 + 0.2 * np.sign(np.sin(ph * 0.5)))
    e = np.minimum(1, np.minimum(t / 0.3, (d - t) / 0.4)); return norm(x * e, 0.7)
def car_pass(d=2.2):
    t = T(d); c = d / 2; dist = np.sqrt(((t - c) * 14) ** 2 + 4); f = 45 * (1 + 0.15 * np.tanh((c - t) * 2)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 10)) + 0.6 * bp(noise(d), 200, 3000); x = lp(x, 1500) / dist; return norm(x, 0.8)
def brakes(d=1.0):
    t = T(d); x = np.sin(2 * np.pi * (2600 + 150 * np.sin(2 * np.pi * 11 * t)) * t) * 0.5 + bp(noise(d), 1500, 5000) * 0.4; e = np.minimum(1, t / 0.05) * np.exp(-t * 2.2); return norm(x * e, 0.55)
def shutter():
    a = bp(noise(0.03), 1000, 8000) * np.exp(-T(0.03) * 150); out = np.zeros(int(0.14 * SR)); out[:len(a)] += a; s = int(0.08 * SR); out[s:s + len(a)] += a * 0.7; return norm(out, 0.8)
def scribble(d=1.2):
    t = T(d); x = bp(noise(d), 2000, 7000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 6 * t + np.sin(2 * np.pi * 1.3 * t) * 3))); return norm(x * np.sin(np.pi * t / d) ** 0.3, 0.45)
def page_flip(): return norm(whoosh(0.25, 2000, 6000) + 0.3 * hp(noise(0.25), 3000) * np.exp(-T(0.25) * 20), 0.5)
def footsteps(n=4, gap=0.35): return norm(seq([thud(110, 0.15) * 0.8 + 0.3 * bp(noise(0.15), 800, 3000) * np.exp(-T(0.15) * 50)] * n, gap), 0.7)
def pocket(): return norm(bp(noise(0.3), 400, 3000) * np.sin(np.pi * T(0.3) / 0.3), 0.5)
def pat(n=3, gap=0.18): return norm(seq([bp(noise(0.06), 300, 2500) * np.exp(-T(0.06) * 60)] * n, gap), 0.6)
def sizzle(d=3.0):
    t = T(d); x = hp(noise(d), 2500) * 0.25; cr = (rng.random(len(t)) > 0.9985).astype(float); x += bp(cr, 1500, 9000) * 6
    e = np.minimum(1, np.minimum(t / 0.3, (d - t) / 0.4)); return norm(x * e, 0.45)
def sad_trombone():
    clips = []; for_f = [(392, 0.35), (370, 0.35), (349, 0.35), (330, 1.0)]
    for f, d in for_f:
        t = T(d); fr = f * (1 + (0.03 * np.sin(2 * np.pi * 6 * t) if d > 0.5 else 0)); x = signal.sawtooth(2 * np.pi * np.cumsum(fr) / SR); x = lp(x, 1400) * np.minimum(1, np.minimum(t / 0.03, (d - t) / 0.08)); clips.append(x)
    return norm(np.concatenate(clips), 0.5)
def error_buzz(): t = T(0.4); return norm(lp(signal.square(2 * np.pi * 140 * t), 2500) * np.minimum(1, (0.4 - t) / 0.05), 0.45)
def success(): return norm(seq([np.sin(2 * np.pi * f * T(0.35)) * np.exp(-T(0.35) * 7) for f in [880, 1108, 1318]], 0.09), 0.55)
def hum_crowd(d=4.0):   # гул людей
    t = T(d); x = sum(bp(noise(d), 250 + 90 * k, 900 + 120 * k) * (0.6 + 0.4 * np.sin(2 * np.pi * (0.7 + 0.3 * k) * t + k)) for k in range(4)); return norm(x * np.minimum(1, np.minimum(t / 0.5, (d - t) / 0.5)), 0.35)
def room_tone(d=4.0): t = T(d); return norm(lp(noise(d), 500) * np.minimum(1, np.minimum(t / 0.5, (d - t) / 0.5)), 0.2)
def doorbell(): return ding(659, 523)

# ---------------------------------------------------------------- дополнительные звуки
def whine(d=2.0, f=5200):
    t = T(d); x = np.sin(2 * np.pi * (f + 300 * np.sin(2 * np.pi * 5 * t)) * t); return norm(x * np.minimum(1, np.minimum(t / 0.1, (d - t) / 0.2)), 0.35)
def siren(d=2.2):
    t = T(d); f = 1100 + 700 * (0.5 + 0.5 * np.sin(2 * np.pi * 2.5 * t)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * signal.sawtooth(2 * np.pi * np.cumsum(f) / SR)
    return norm(lp(x, 4000) * np.minimum(1, np.minimum(t / 0.05, (d - t) / 0.2)), 0.5)
def beep(f=3000, d=0.12): t = T(d); return norm(np.sin(2 * np.pi * f * t) * np.minimum(1, np.minimum(t / 0.005, (d - t) / 0.01)), 0.5)
def beeps(n=3, gap=0.25, f=3200): return seq([beep(f)] * n, gap)
def whistle(d=1.0, f=1900):
    t = T(d); x = np.sin(2 * np.pi * (f + 40 * np.sin(2 * np.pi * 6 * t)) * t) + 0.15 * bp(noise(d), f * 0.8, f * 1.2); return norm(x * np.minimum(1, np.minimum(t / 0.06, (d - t) / 0.15)), 0.45)
def squeak(n=3, gap=0.18):
    clips = []
    for i in range(n): t = T(0.12); f = 2600 + 900 * np.sin(np.pi * t / 0.12) + i * 200; clips.append(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.12))
    return norm(seq(clips, gap), 0.45)
def sonar(): t = T(0.25); f = 6000 - 4000 * t / 0.25; return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14), 0.4)
def crickets(d=6.0):
    t = T(d); x = np.zeros(len(t))
    for k, (f, r) in enumerate([(4300, 3.1), (4700, 2.4)]): gate = (np.sin(2 * np.pi * 28 * t) > 0) * (np.sin(2 * np.pi * r * t + k) > 0.3); x += np.sin(2 * np.pi * f * t) * gate
    return norm(lp(x, 6000) * np.minimum(1, np.minimum(t / 0.5, (d - t) / 0.5)), 0.2)
def flaps(n=6, gap=0.13): return norm(seq([bp(noise(0.09), 200, 1500) * np.sin(np.pi * T(0.09) / 0.09)] * n, gap), 0.5)
def wind(d=6.0):
    t = T(d); fc = 500 + 300 * np.sin(2 * np.pi * 0.25 * t) + 200 * np.sin(2 * np.pi * 0.11 * t); x = var_bp(noise(d), fc, q=3); return norm(x * np.minimum(1, np.minimum(t / 0.8, (d - t) / 0.8)), 0.4)
def power_down(d=1.2): t = T(d); return norm(signal.sawtooth(2 * np.pi * np.cumsum(220 * np.exp(-t * 2.5) + 25) / SR) * np.exp(-t * 1.5) * 0.6 + lp(noise(d), 300) * np.exp(-t * 3) * 0.3, 0.7)
def scrub(d=4.8):
    t = T(d); x = bp(noise(d), 2500, 8000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 2.3 * t))); return norm(x * np.minimum(1, np.minimum(t / 0.1, (d - t) / 0.2)), 0.4)
def thwip(d=0.25): t = T(d); return norm(np.sin(2 * np.pi * np.cumsum(300 + 2500 * t / d) / SR) * np.exp(-t * 10), 0.6)
def smack(): d = 0.25; t = T(d); return norm(bp(noise(d), 500, 6000) * np.exp(-t * 45) + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 30) * 0.6, 0.9)
def fall_whistle(d=1.5, f0=2200, f1=500): t = T(d); return norm(np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (t / d)) / SR) * np.minimum(1, np.minimum(t / 0.05, (d - t) / 0.1)), 0.4)
def shrink(d=0.7): return norm(sweep_tone(1400, 120, d, "saw") * np.exp(-T(d) * 2) * 0.5 + whoosh(d, 3000, 400) * 0.6, 0.7)
def squelch(d=0.45): t = T(d); return norm(lp(noise(d), 900) * np.sin(np.pi * t / d) * (0.5 + 0.5 * np.sin(2 * np.pi * 22 * t)) + np.sin(2 * np.pi * np.cumsum(140 + 120 * t / d) / SR) * np.sin(np.pi * t / d) * 0.5, 0.7)
def stomp(n=2, gap=0.5): return norm(seq([thud(45, 0.5)] * n, gap), 0.95)
def roll(d=2.5): t = T(d); x = lp(noise(d), 700) * (0.7 + 0.3 * (np.sin(2 * np.pi * 9 * t) > 0)); return norm(x * np.minimum(1, np.minimum(t / 0.2, (d - t) / 0.3)), 0.4)
def chime_ann(): return norm(seq([np.sin(2 * np.pi * f * T(0.6)) * np.exp(-T(0.6) * 5) for f in [784, 659, 523]], 0.28), 0.5)
def kaching(): return norm(np.concatenate([pat(1) * 0.6, ding(2093, 2637)]), 0.6)
def steam(d=1.8): t = T(d); return norm(hp(noise(d), 3000) * (0.6 + 0.4 * np.sin(2 * np.pi * 13 * t)) * np.minimum(1, np.minimum(t / 0.1, (d - t) / 0.3)) + lp(noise(d), 200) * 0.4 * (np.sin(2 * np.pi * 4 * t) > 0.6), 0.45)
def birds(d=6.0):
    out = np.zeros(int(d * SR))
    for i in range(int(d * 1.5)):
        s = int(rng.random() * (d - 0.4) * SR); dd = 0.08 + rng.random() * 0.1; t = T(dd); f = 3000 + rng.random() * 1500
        c = np.sin(2 * np.pi * np.cumsum(f + 800 * np.sin(np.pi * t / dd)) / SR) * np.sin(np.pi * t / dd); out[s:s + len(c)] += c * (0.5 + rng.random() * 0.5)
    return norm(out, 0.25)
def street_amb(d=6.0): return norm(room_tone(d) * 1.2 + birds(d) * 0.8 + 0.6 * np.pad(car_pass(min(d, 3.0)), (int(min(d, 3.0) * 0.2 * SR), 0))[: int(d * SR)].__array__() if d >= 3 else room_tone(d), 0.3)
def rumble(d=2.5): t = T(d); return norm(lp(noise(d), 120) * np.minimum(1, np.minimum(t / 0.3, (d - t) / 0.5)) + np.sin(2 * np.pi * 35 * t) * 0.4, 0.9)
def wave(d=1.8): t = T(d); return norm(bp(noise(d), 300, 4000) * np.sin(np.pi * t / d) ** 0.6 * (1 + 0.3 * np.sin(2 * np.pi * 3 * t)), 0.7)
def zipper(d=0.6): t = T(d); return norm(bp(noise(d), 1500, 7000) * (0.5 + 0.5 * (np.sin(2 * np.pi * 60 * t) > 0)) * np.sin(np.pi * t / d), 0.5)
def flicker(d=2.2, rate=9):
    t = T(d); on = (np.floor(t * rate) % 2 == 0).astype(float); x = lp(signal.square(2 * np.pi * 100 * t), 800) * 0.2 * on
    clicks = np.zeros(len(t)); idx = (np.arange(0, d, 1 / rate) * SR).astype(int); clicks[idx[idx < len(t)]] = 1; x += bp(clicks, 1000, 8000) * 4; return norm(x, 0.5)
def msg(): return ding(1568, 2093)
def typing(n=6, gap=0.1): return norm(seq([bp(noise(0.02), 2000, 8000) * np.exp(-T(0.02) * 200)] * n, gap), 0.5)
def snore(d=1.6): t = T(d); return norm(lp(noise(d), 400) * np.sin(np.pi * t / d) ** 2 * (0.7 + 0.3 * np.sin(2 * np.pi * 30 * t)), 0.6)
def growl(d=1.2): t = T(d); return norm(lp(signal.sawtooth(2 * np.pi * np.cumsum(80 + 20 * np.sin(2 * np.pi * 5 * t)) / SR) * (0.6 + 0.4 * rng.random(len(t))), 700) * np.sin(np.pi * t / d), 0.8)
def jet(d=3.0): t = T(d); return norm(lp(noise(d), 700) * 0.7 + 0.3 * np.sin(2 * np.pi * (1800 + 200 * t / d) * t), 0.5) * np.minimum(1, np.minimum(t / 0.6, (d - t) / 0.8))
def cash(): return kaching()
def bloop(f=500): t = T(0.18); return norm(np.sin(2 * np.pi * np.cumsum(f + 900 * t / 0.18) / SR) * np.exp(-t * 18), 0.6)
def drip(): return bloop(900)
