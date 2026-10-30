"""Поиск роликов на американском YouTube: просмотры, возраст, длина, канал.

Пример:
    python3 tools/yt_search.py "stickman animation" "what if animation"
    python3 tools/yt_search.py --period today --shorts "what if you"

--period: today | week (по умолчанию) | month
--shorts: только ролики до 3 минут
Сортировка — по числу просмотров.
"""
import argparse
import json
import re
import urllib.parse
import urllib.request

# sp-фильтры YouTube: сортировка по просмотрам + дата загрузки
PERIODS = {"today": "CAMSAggC", "week": "CAMSAggD", "month": "CAMSAggE"}


def text(v, key):
    o = v.get(key, {})
    return o.get("simpleText") or "".join(r.get("text", "") for r in o.get("runs", []))


def seconds(dur):
    s = 0
    for part in dur.split(":"):
        s = s * 60 + int(part) if part.isdigit() else s
    return s


def search(query, period):
    url = ("https://www.youtube.com/results?search_query=" + urllib.parse.quote(query)
           + "&sp=" + PERIODS[period] + "&gl=US&hl=en")
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
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)

    walk(json.loads(m.group(1)))
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("queries", nargs="+")
    p.add_argument("--period", choices=PERIODS, default="week")
    p.add_argument("--shorts", action="store_true")
    p.add_argument("--limit", type=int, default=15)
    a = p.parse_args()
    for q in a.queries:
        print("##", q)
        rows = search(q, a.period)
        if a.shorts:
            rows = [r for r in rows if r["duration"] and seconds(r["duration"]) <= 180]
        for r in rows[:a.limit]:
            print(f"{r['views']:>18} | {r['age']:<12} | {r['duration']:<6} | {r['channel'][:25]:<25} | "
                  f"{r['title'][:90]} | https://youtu.be/{r['id']}")


if __name__ == "__main__":
    main()
