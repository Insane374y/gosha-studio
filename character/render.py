import sys, pathlib
from playwright.sync_api import sync_playwright
src, out, w, h = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + str(pathlib.Path(src).resolve())); pg.wait_for_timeout(500)
    pg.locator('#c').screenshot(path=out); print('errors:', errs); b.close()
