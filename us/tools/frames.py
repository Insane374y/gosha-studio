# Рендер ролика: кадры из браузера → ffmpeg (в 2 процесса); звук (голос + музыка + эффекты) — tools/sound.py.
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
    (ROOT / "out").mkdir(exist_ok=True)
    n = int(round(total * 30)); nw = 2; cuts = [round(i * n / nw) for i in range(nw + 1)]
    parts = [str(ROOT / f"out/_{name}_{i}.mp4") for i in range(nw)]; t0 = time.time()
    ps = [Process(target=worker, args=(name, cuts[i], cuts[i + 1], parts[i])) for i in range(nw)]
    for pr in ps: pr.start()
    for pr in ps: pr.join()
    lst = ROOT / f"out/_{name}.txt"; lst.write_text("".join(f"file '{x}'\n" for x in parts))
    vid = str(ROOT / f"out/_{name}_v.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", vid], check=True)
    subprocess.run([sys.executable, str(ROOT / "tools/sound.py"), name], check=True)   # голос + музыка + эффекты
    print("готово", name, f"out/{name}.mp4", f"{time.time() - t0:.0f} с", flush=True)
