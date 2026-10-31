# Рендер аватарки и шапки канала: python3 render_art.py  → avatar_1500.png, banner_2560x1440.png
import os, pathlib
from playwright.sync_api import sync_playwright
here = pathlib.Path(__file__).resolve().parent
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH"))
    for mode, size, out in [("avatar", (1500, 1500), "avatar_1500.png"), ("banner", (2560, 1440), "banner_2560x1440.png")]:
        pg = b.new_page(viewport={"width": size[0], "height": size[1]}); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((here / "channel_art.html").as_uri() + f"?mode={mode}"); pg.wait_for_function("document.title === 'done'", timeout=60000)
        pg.locator("#c").screenshot(path=str(here / out)); print(out, "errors:", errs)
    b.close()
