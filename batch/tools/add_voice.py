# Утром: добавить голос в готовые ролики без перерендера видео.
#   python3 tools/add_voice.py gosha_voices.zip   (или папка с NN_name.mp3)
import json, pathlib, subprocess, sys, zipfile
ROOT = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1])
if src.suffix == ".zip":
    with zipfile.ZipFile(src) as z: z.extractall(ROOT / "voice")
seg = json.load(open(ROOT / "voice/segments.json"))
for name, info in seg.items():
    v = ROOT / f"voice/{name}.mp3"; vid = ROOT / f"out/_{name}_v.mp4"
    if not v.exists() or not vid.exists(): print("нет файла:", name); continue
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(v)], capture_output=True, text=True).stdout)
    if abs(dur - info["dur"]) > 0.3: print(f"ВНИМАНИЕ {name}: длина голоса {dur:.2f} с, ожидалось {info['dur']} с — другой вариант озвучки?")
    total = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(vid)], capture_output=True, text=True).stdout)
    fc = f"[1:a]atempo=1.1[v];[2:a]volume=0.11,afade=t=in:d=0.7,afade=t=out:st={total - 1.5}:d=1.5[m];[v][m]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(vid), "-i", str(v), "-stream_loop", "-1", "-i", str(ROOT / "voice/music.wav"), "-filter_complex", fc,
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-t", f"{total}", str(ROOT / f"out/gosha_{name}.mp4")], check=True)
    print("готово:", f"out/gosha_{name}.mp4")
