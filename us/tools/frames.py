# Рендер американского ролика: кадры из браузера → ffmpeg (в 2 процесса); звук: голос (если есть) + музыка.
#   python3 tools/frames.py still NAME 3.0 5.5 ...   → checks/NAME_t03.00.png
#   python3 tools/frames.py video NAME               → out/NAME.mp4
import base64, os, pathlib, subprocess, sys, time
from multiprocessing import Process
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent

def open_page(p, name):
    b = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH")); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((ROOT / f"render/index_{name}.html").as_uri()); pg.evaluate("window.ready")
    return b, pg, errs

def grab(pg, t, fmt, q):
    return base64.b64decode(pg.evaluate(f"(renderFrame({t}), document.getElementById('c').toDataURL('image/{fmt}', {q}))").split(",", 1)[1])

def worker(name, a, b_, out):
    with sync_playwright() as p:
        b, pg, errs = open_page(p, name)
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
        for i in range(a, b_): ff.stdin.write(grab(pg, i / 30, "jpeg", 0.93))
        ff.stdin.close(); ff.wait()
        if errs: print("ERR", name, errs[:3], flush=True)
        b.close()

if __name__ == "__main__":
    mode, name = sys.argv[1], sys.argv[2]
    if mode == "still":
        (ROOT / "checks").mkdir(exist_ok=True)
        with sync_playwright() as p:
            b, pg, errs = open_page(p, name)
            for t in sys.argv[3:]: (ROOT / f"checks/{name}_t{float(t):05.2f}.png").write_bytes(grab(pg, float(t), "png", 1))
            print("stills ok" if not errs else ("ERR", errs[:3])); b.close()
        sys.exit()
    with sync_playwright() as p:
        b, pg, errs = open_page(p, name); total = pg.evaluate("window.TOTAL"); b.close()
        if errs: print("ERR", errs); sys.exit(1)
    n = int(round(total * 30)); nw = 2; cuts = [round(i * n / nw) for i in range(nw + 1)]
    parts = [str(ROOT / f"out/_{name}_{i}.mp4") for i in range(nw)]; t0 = time.time()
    ps = [Process(target=worker, args=(name, cuts[i], cuts[i + 1], parts[i])) for i in range(nw)]
    for pr in ps: pr.start()
    for pr in ps: pr.join()
    lst = ROOT / f"out/_{name}.txt"; lst.write_text("".join(f"file '{x}'\n" for x in parts))
    vid = str(ROOT / f"out/_{name}_v.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", vid], check=True)
    (ROOT / "out").mkdir(exist_ok=True)
    voice = ROOT / f"voice/{name}.mp3"; music = str(ROOT / "voice/music.wav")
    if voice.exists():
        fc = f"[1:a]anull[v];[2:a]volume=0.11,afade=t=in:d=0.7,afade=t=out:st={total - 1.5}:d=1.5[m];[v][m]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]"
        ins = ["-i", str(voice), "-stream_loop", "-1", "-i", music]
    else:
        fc = f"[1:a]volume=0.5,afade=t=in:d=0.7,afade=t=out:st={total - 1.5}:d=1.5[a]"; ins = ["-stream_loop", "-1", "-i", music]
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", vid, *ins, "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-t", f"{total}", str(ROOT / f"out/{name}.mp4")], check=True)
    print("готово", name, "голос" if voice.exists() else "без голоса", f"{time.time() - t0:.0f} с", flush=True)
