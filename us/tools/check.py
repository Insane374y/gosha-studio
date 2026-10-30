# Автопроверка американского ролика перед сборкой.
#   python3 tools/check.py NAME          (запускать из папки us/)
# Проверяет:
#   1. длину: по голосу voice/NAME.mp3, а если его ещё нет — оценку по числу слов в scripts/NAME.md;
#      норма 1:00–1:10 (правило канала);
#   2. титр: titleEnd ≤ 1.0 с;
#   3. надписи: в text_NAME.js у каждого ключа есть en и в en нет кириллицы; в кадре нет ключей-заглушек «?ключ?»;
#   (браузер: если Playwright не находит свой Chromium — укажи путь в CHROMIUM_PATH)
#   4. крючок: сохраняет кадры 0.0 / 0.5 / 1.0 / 2.0 с в checks/ — посмотреть глазами, есть ли действие с первого кадра.
import json, os, pathlib, re, subprocess, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
MIN_S, MAX_S = 60.0, 70.0
WPM = (150, 175)   # обычный и быстрый темп английского голоса, слов в минуту
name = sys.argv[1]
problems, notes = [], []


def words_in_script():
    md = ROOT / f"scripts/{name}.md"
    if not md.exists(): return None
    m = re.search(r"## Озвучка \(EN\)\n(.*?)(?=\n## |\Z)", md.read_text(encoding="utf-8"), re.S)
    return len(re.findall(r"[A-Za-z0-9’']+", m.group(1))) if m else None


# 1. длина
voice = ROOT / f"voice/{name}.mp3"
if voice.exists():
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(voice)], capture_output=True, text=True).stdout)
    notes.append(f"длина голоса: {dur:.1f} с")
    if dur < MIN_S: problems.append(f"голос короче минуты ({dur:.1f} с) — добавить событие или ставку, не «воду»")
    if dur > MAX_S: problems.append(f"голос длиннее 1:10 ({dur:.1f} с) — сократить объяснения")
else:
    n = words_in_script()
    if n is None: problems.append(f"нет ни voice/{name}.mp3, ни раздела «Озвучка (EN)» в scripts/{name}.md")
    else:
        slow, fast = n / WPM[0] * 60, n / WPM[1] * 60
        notes.append(f"голоса ещё нет; {n} слов ≈ {fast:.0f}–{slow:.0f} с")
        if slow < MIN_S: problems.append(f"даже при медленном темпе ролик короче минуты ({slow:.0f} с) — добавить ~{int((MIN_S - slow) / 60 * WPM[0]) + 1} слов")
        elif fast < MIN_S: notes.append(f"при быстром голосе (175 сл/мин) будет {fast:.0f} с — может не дотянуть до минуты")
        if fast > MAX_S: problems.append(f"даже при быстром темпе длиннее 1:10 ({fast:.0f} с) — сократить")

# 2–4. страница ролика
page = ROOT / f"render/index_{name}.html"
if page.exists():
    (ROOT / "checks").mkdir(exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH")); pg = b.new_page(viewport={"width": 1080, "height": 1920})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(page.as_uri()); pg.evaluate("window.ready")
        info = pg.evaluate("({title: window.VIDEO.titleEnd ?? 1.0, total: window.VIDEO.total, text: TEXT, caps: CAPTIONS.length})")
        if info["title"] > 1.0: problems.append(f"титр {info['title']} с — должен быть не дольше 1 с")
        for k, v in info["text"]["labels"].items():
            if not v.get("en"): problems.append(f"надпись «{k}» без английского текста")
            elif re.search("[А-Яа-яЁё]", v["en"]): problems.append(f"в английской надписи «{k}» кириллица: {v['en']}")
        if not info["caps"]: notes.append("субтитров ещё нет — их создаст tools/align.py после записи голоса")
        for t in (0.0, 0.5, 1.0, 2.0):
            pg.evaluate(f"renderFrame({t})")
            pg.locator("#c").screenshot(path=str(ROOT / f"checks/{name}_t{t:04.1f}.png"))
        # ключи-заглушки: прогоняем ролик и ловим L() с несуществующим ключом
        bad = pg.evaluate("""(() => { const bad = new Set(); const fill = CanvasRenderingContext2D.prototype.fillText;
            CanvasRenderingContext2D.prototype.fillText = function (s, ...a) { if (/^\\?.+\\?$/.test(String(s))) bad.add(String(s)); return fill.call(this, s, ...a); };
            for (let t = 0; t < window.VIDEO.total; t += 0.25) renderFrame(t);
            CanvasRenderingContext2D.prototype.fillText = fill; return [...bad]; })()""")
        for s in bad: problems.append(f"в кадре надпись-заглушка {s}: такого ключа нет в text_{name}.js")
        if errs: problems.append(f"ошибки JS: {errs[:3]}")
        b.close()
    notes.append(f"кадры крючка сохранены: checks/{name}_t00.0.png … _t02.0.png")
else:
    notes.append(f"render/index_{name}.html ещё нет — проверены только сценарий и голос")

print(f"Проверка {name}")
for x in notes: print("  •", x)
if problems:
    print("ПРОБЛЕМЫ:")
    for x in problems: print("  ✗", x)
    sys.exit(1)
print("  ✓ всё в порядке")
