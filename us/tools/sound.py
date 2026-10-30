# Звук ролика: голос + музыка + эффекты → out/NAME.mp4 (видео берётся из out/_NAME_v.mp4).
#   python3 tools/sound.py NAME          (запускать из папки us/; frames.py video вызывает его сам)
# Эффекты двух видов:
#   • авто: свуш на каждую вылетающую плашку, мягкий вжух на склейках и на титре. Моменты берутся
#     прямо из ролика в браузере, поэтому сдвиг шотов (крючок) и правки таймингов учитываются сами;
#   • сюжетные: sfx/NAME.py → CUES = [(время, "эффект", громкость, параметры?), ...] — скрип двери,
#     шаги, ветер… Список эффектов — ../sfx/sfx.py. Там же можно задать MUSIC = "playful" | "tense" | "calm".
# Чтобы не перебарщивать: свуши не чаще раза в 0.35 с, вжух на склейке пропускается рядом со свушем,
# все эффекты приглушаются под голосом (../sfx/duck.py) и лежат ниже голоса по громкости.
import importlib.util, os, pathlib, subprocess, sys
import numpy as np
from scipy.io import wavfile
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
SFX = ROOT.parent / "sfx"
sys.path.insert(0, str(SFX))
import sfx as S
from mix import render

SWOOSH = 0.30          # свуш на плашку
CUT = 0.20             # вжух на склейке
TITLE = 0.40           # вжух на титре
MIN_GAP = 0.35         # свуши не чаще
FX_LEVEL = 0.55        # общая громкость эффектов в миксе (голос = 1)
MUSIC_LEVEL = 0.11


def ffdur(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True).stdout)


def video_events(name):
    """Когда в ролике вылетают плашки и где склейки — по самому ролику, кадр за кадром."""
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH")); pg = b.new_page(viewport={"width": 1080, "height": 1920})
        pg.goto((ROOT / f"render/index_{name}.html").as_uri()); pg.evaluate("window.ready")
        ev = pg.evaluate("""(() => {
            const seen = new Set(), labels = [], orig = window.bubbleLabel; let T = 0;
            // плашка рисуется с локальным временем шота: момент появления = кадр − (t − t0)
            window.bubbleLabel = function (g, x, y, txt, t, t0, o) {
                if (t >= t0 && !seen.has(txt + "@" + t0)) { seen.add(txt + "@" + t0); labels.push(T - (t - t0)); }
                return orig.apply(this, arguments); };
            for (T = 0; T < window.VIDEO.total; T += 1 / 30) renderFrame(T);
            window.bubbleLabel = orig;
            return { labels, cuts: window.VIDEO.shots.map((s) => s.t0).filter((x) => x > 0), total: window.VIDEO.total };
        })()""")
        b.close()
    return ev


def auto_cues(ev):
    cues, last = [(0.0, "whoosh_title", TITLE)], 0.0
    for t in sorted(ev["labels"]):
        if t - last >= MIN_GAP: cues.append((max(0.0, t - 0.05), "swish", SWOOSH)); last = t
    swooshes = [c[0] for c in cues]
    for t in ev["cuts"]:
        if all(abs(t - s) > 0.3 for s in swooshes): cues.append((max(0.0, t - 0.15), "whoosh", CUT, {"d": 0.35}))
    return cues


def story_cues(name):
    f = ROOT / f"sfx/{name}.py"
    if not f.exists(): return [], "playful"
    spec = importlib.util.spec_from_file_location("cues", f); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.CUES, getattr(m, "MUSIC", "playful")


def main(name):
    vid = ROOT / f"out/_{name}_v.mp4"
    if not vid.exists(): sys.exit(f"нет {vid} — сначала python3 tools/frames.py video {name}")
    total = ffdur(vid)
    ev = video_events(name)
    auto = auto_cues(ev); story, mood = story_cues(name)
    fx = render(auto + story, total)
    fx_wav = ROOT / f"out/_{name}_sfx.wav"
    wavfile.write(fx_wav, S.SR, np.stack([fx, fx], 1).astype(np.float32))
    voice = ROOT / f"voice/{name}.mp3"
    if voice.exists(): subprocess.run([sys.executable, str(SFX / "duck.py"), str(fx_wav), str(voice), "0"], check=True, capture_output=True)
    music = ROOT / f"out/_{name}_music.wav"
    subprocess.run(["node", str(ROOT / "tools/music.mjs"), f"{total + 1:.1f}", mood, str(music)], check=True, cwd=ROOT, capture_output=True)
    fo = max(0.0, total - 1.5)
    ins = ["-i", str(vid)]
    if voice.exists(): ins += ["-i", str(voice)]
    ins += ["-i", str(music), "-i", str(fx_wav)]
    k = 2 if voice.exists() else 1
    fc = (f"[{k}:a]volume={MUSIC_LEVEL},afade=t=in:d=0.7,afade=t=out:st={fo}:d=1.5[m];[{k + 1}:a]volume={FX_LEVEL}[s];"
          + ("[1:a]anull[v];[v][m][s]amix=inputs=3" if voice.exists() else "[m][s]amix=inputs=2")
          + ":duration=longest:normalize=0,apad,loudnorm=I=-14:TP=-1.5:LRA=11[a]")
    out = ROOT / f"out/{name}.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", fc, "-map", "0:v", "-map", "[a]",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-t", f"{total}", str(out)], check=True)
    print(f"звук {name}: свушей на плашки {sum(1 for c in auto if c[1] == 'swish')}, на склейки {sum(1 for c in auto if c[1] == 'whoosh')}, "
          f"сюжетных {len(story)}, музыка «{mood}», {'с голосом' if voice.exists() else 'без голоса'} → {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main(sys.argv[1])
