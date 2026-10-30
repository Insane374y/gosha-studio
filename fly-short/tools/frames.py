# Рендер: кадры из браузера (Playwright Chromium) → ffmpeg. Стоп-кадры или полный ролик (в N процессов).
#   python3 tools/frames.py still 3.0 5.5 ...              → checks/t03.00.png …
#   python3 tools/frames.py video out/preview.mp4 [scale] [workers]
import base64, os, pathlib, subprocess, sys, time
from multiprocessing import Process
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent

def open_page(p):
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((ROOT / "render/index.html").as_uri()); pg.evaluate("window.ready")
    return b, pg, errs

def grab(pg, t, fmt, q):
    return base64.b64decode(pg.evaluate(f"(renderFrame({t}), document.getElementById('c').toDataURL('image/{fmt}', {q}))").split(",", 1)[1])

def worker(idx, a, b_, w, h, out):
    with sync_playwright() as p:
        b, pg, errs = open_page(p)
        ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
                               "-vf", f"scale={w}:{h}:flags=lanczos", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
        t0 = time.time()
        for i in range(a, b_):
            ff.stdin.write(grab(pg, i / 30, "jpeg", 0.93))
            if (i - a) % 150 == 0: print(f"[{idx}] кадр {i - a}/{b_ - a}  {time.time() - t0:.0f} с", flush=True)
        ff.stdin.close(); ff.wait()
        if errs: print(f"[{idx}] ERR", errs[:3], flush=True)
        b.close()

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "still":
        with sync_playwright() as p:
            b, pg, errs = open_page(p)
            for t in sys.argv[2:]:
                (ROOT / f"checks/t{float(t):05.2f}.png").write_bytes(grab(pg, float(t), "png", 1)); print("still", t)
            if errs: print("ERR", errs)
            b.close()
        sys.exit()
    out = sys.argv[2]; scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0; nw = int(sys.argv[4]) if len(sys.argv) > 4 else os.cpu_count() or 1
    with sync_playwright() as p:
        b, pg, _ = open_page(p); total = pg.evaluate("window.TOTAL"); b.close()
    n = int(round(total * 30)); w, h = int(1080 * scale) // 2 * 2, int(1920 * scale) // 2 * 2
    cuts = [round(i * n / nw) for i in range(nw + 1)]
    parts = [str(ROOT / f"out/_part{i}.mp4") for i in range(nw)]
    t0 = time.time()
    procs = [Process(target=worker, args=(i, cuts[i], cuts[i + 1], w, h, parts[i])) for i in range(nw)]
    for pr in procs: pr.start()
    for pr in procs: pr.join()
    lst = ROOT / "out/_parts.txt"; lst.write_text("".join(f"file '{x}'\n" for x in parts))
    tmp = str(ROOT / "out/_video.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", tmp], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-i", str(ROOT / "public/voice.mp3"), "-stream_loop", "-1", "-i", str(ROOT / "public/music.wav"),
                    "-filter_complex", f"[2:a]volume=0.11,afade=t=in:d=0.7,afade=t=out:st={total - 1.5}:d=1.5[m];[1:a][m]amix=inputs=2:duration=first:normalize=0,apad[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{total}", out], check=True)
    print("готово", out, f"{time.time() - t0:.0f} с", flush=True)
