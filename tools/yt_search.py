"""Поиск роликов на американском YouTube: просмотры, возраст, длина, канал.

Пример:
    python3 tools/yt_search.py "stickman animation" "what if animation"
    python3 tools/yt_search.py --period today --shorts "what if you"

--period: today | week (по умолчанию) | month
--shorts: только Shorts, загруженные за этот период. YouTube не отдаёт у них
          точную дату и канал (там «?»), но все они не старше периода.
Сортировка — по числу просмотров.
"""
import argparse
import json
import re
import urllib.parse
import urllib.request

# sp-фильтры YouTube. Обычный поиск: сортировка по просмотрам + дата загрузки.
PERIODS = {"today": "CAMSAggC", "week": "CAMSAggD", "month": "CAMSAggE"}
# Shorts: с сортировкой по просмотрам YouTube отдаёт пустую выдачу,
# поэтому берём релевантность + дата + тип Shorts и сортируем сами.
SHORTS = {"today": "CAASBAgCEAk%3D", "week": "CAASBAgDEAk%3D", "month": "CAASBAgEEAk%3D"}
LIMITS = {"today": "≤1 дня", "week": "≤7 дн.", "month": "≤30 дн."}


def text(v, key):
    o = v.get(key, {})
    return o.get("simpleText") or "".join(r.get("text", "") for r in o.get("runs", []))


def view_count(s):
    m = re.match(r"([\d.,]+)\s*(thousand|million|billion|K|M|B)?", s or "")
    if not m:
        return 0
    n = float(m.group(1).replace(",", ""))
    mult = {"thousand": 1e3, "K": 1e3, "million": 1e6, "M": 1e6, "billion": 1e9, "B": 1e9}
    return int(n * mult.get(m.group(2), 1))


def search(query, sp):
    url = ("https://www.youtube.com/results?search_query=" + urllib.parse.quote(query)
           + "&sp=" + sp + "&gl=US&hl=en")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "en-US"})
    html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "ignore")
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not m:
        return []
    out = []

    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                out.append(dict(id=v["videoId"], title=text(v, "title"), channel=text(v, "ownerText"),
                                views=text(v, "viewCountText"), age=text(v, "publishedTimeText"),
                                duration=text(v, "lengthText")))
            elif "shortsLockupViewModel" in o:
                # полка Shorts: название и просмотры есть только в accessibilityText
                v = o["shortsLockupViewModel"]
                vid = v.get("onTap", {}).get("innertubeCommand", {}).get("reelWatchEndpoint", {}).get("videoId")
                m = re.match(r"(.*), ([^,]*views?) - play Short$", v.get("accessibilityText", ""))
                if vid and m:
                    out.append(dict(id=vid, title=m.group(1), channel="?", views=m.group(2),
                                    age="?", duration="short"))
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)

    walk(json.loads(m.group(1)))
    seen, uniq = set(), []
    for r in out:
        if r["id"] not in seen:
            seen.add(r["id"])
            uniq.append(r)
    return uniq


def main():
    p = argparse.ArgumentParser()
    p.add_argument("queries", nargs="+")
    p.add_argument("--period", choices=PERIODS, default="week")
    p.add_argument("--shorts", action="store_true")
    p.add_argument("--limit", type=int, default=15)
    a = p.parse_args()
    for q in a.queries:
        print("##", q)
        rows = search(q, SHORTS[a.period] if a.shorts else PERIODS[a.period])
        if a.shorts:
            for r in rows:
                if r["age"] == "?":
                    r["age"] = LIMITS[a.period]
        rows.sort(key=lambda r: view_count(r["views"]), reverse=True)
        for r in rows[:a.limit]:
            print(f"{r['views']:>18} | {r['age']:<12} | {r['duration']:<6} | {r['channel'][:25]:<25} | "
                  f"{r['title'][:90]} | https://youtu.be/{r['id']}")


if __name__ == "__main__":
    main()
