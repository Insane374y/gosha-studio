"""Обложки роликов американского YouTube одной картинкой — чтобы «увидеть» графику и крючок конкурентов.

Сами видео, субтитры и раскадровку YouTube из облака не отдаёт (просит войти «не бот»),
а обложки (i.ytimg.com) — отдаёт. Картинку потом можно открыть инструментом Read.

Пример:
    python3 tools/yt_thumbs.py --period month --top 8 "what if animation" "how to survive tsunami animation"
    python3 tools/yt_thumbs.py --ids alkJ7xScBiw 8RPK5KwYhgA
Результат: checks/thumbs_<запрос>.png (по одной картинке на запрос) — сетка обложек с подписями:
номер, просмотры, возраст, длина, название.
"""
import argparse
import io
import pathlib
import re
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from yt_search import PERIODS, SHORTS, search, view_count  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
TW, TH, CAP = 480, 360, 92


def font(size):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"):
        if pathlib.Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def thumb(vid):
    for q in ("maxresdefault", "hqdefault"):
        try:
            with urllib.request.urlopen(f"https://i.ytimg.com/vi/{vid}/{q}.jpg", timeout=20) as r:
                im = Image.open(io.BytesIO(r.read())).convert("RGB")
                if im.width > 200:
                    return im
        except Exception:
            pass
    return Image.new("RGB", (TW, TH), (40, 40, 40))


def sheet(rows, out):
    cols = 4 if len(rows) > 6 else 3 if len(rows) > 4 else max(1, len(rows))
    n_rows = (len(rows) + cols - 1) // cols
    img = Image.new("RGB", (cols * TW, n_rows * (TH + CAP)), (18, 18, 22))
    d, f1, f2 = ImageDraw.Draw(img), font(22), font(18)
    for i, r in enumerate(rows):
        x, y = (i % cols) * TW, (i // cols) * (TH + CAP)
        im = thumb(r["id"]); im.thumbnail((TW, TH)); img.paste(im, (x + (TW - im.width) // 2, y + (TH - im.height) // 2))
        d.rectangle([x, y, x + 46, y + 34], fill=(245, 197, 24)); d.text((x + 8, y + 5), str(i + 1), font=f1, fill=(0, 0, 0))
        d.text((x + 8, y + TH + 6), f"{r['views']} · {r['age']} · {r['duration']}", font=f1, fill=(245, 197, 24))
        title = r["title"][:44] + ("…" if len(r["title"]) > 44 else "")
        d.text((x + 8, y + TH + 36), title, font=f2, fill=(230, 230, 230))
        d.text((x + 8, y + TH + 62), f"{r['channel'][:30]} · youtu.be/{r['id']}", font=f2, fill=(150, 150, 150))
    out.parent.mkdir(parents=True, exist_ok=True); img.save(out)
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("queries", nargs="*")
    p.add_argument("--ids", nargs="*", default=[])
    p.add_argument("--period", choices=PERIODS, default="month")
    p.add_argument("--shorts", action="store_true")
    p.add_argument("--top", type=int, default=8)
    a = p.parse_args()
    if a.ids:
        rows = [dict(id=v, title="", channel="", views="", age="", duration="") for v in a.ids]
        print(sheet(rows, ROOT / "checks/thumbs_ids.png").relative_to(ROOT))
    for q in a.queries:
        rows = search(q, SHORTS[a.period] if a.shorts else PERIODS[a.period])
        rows.sort(key=lambda r: view_count(r["views"]), reverse=True)
        rows = rows[:a.top]
        out = ROOT / f"checks/thumbs_{re.sub(r'[^a-z0-9]+', '_', q.lower()).strip('_')[:40]}.png"
        print(sheet(rows, out).relative_to(ROOT))
        for i, r in enumerate(rows, 1):
            print(f"  {i}. {r['views']} | {r['age']} | {r['duration']} | {r['channel']} | {r['title']} | https://youtu.be/{r['id']}")


if __name__ == "__main__":
    main()
