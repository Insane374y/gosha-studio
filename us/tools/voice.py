# Озвучка через Lumean (голоса ElevenLabs). Документация API: https://lumean.app/llms.txt
# Ключ берётся из переменной окружения LUMEAN_API_KEY (в код и в чат его не вставлять).
# Запускать из папки us/:
#   python3 tools/voice.py voices [--gender male] [--search NAME]   → голоса ElevenLabs с американским акцентом
#                                                                       + пробы в voice/samples/ (бесплатно)
#   python3 tools/voice.py info VOICE_ID                             → описание одного голоса ElevenLabs + проба (бесплатно)
#   python3 tools/voice.py setup VOICE_ID                            → шаблон с этим голосом (один раз)
#   python3 tools/voice.py NAME [--speed 1.05] [--no-fit]            → scripts/NAME.md → voice/NAME.mp3 (платно)
#   python3 tools/voice.py fetch NAME ORDER_ID [--no-fit]            → скачать уже готовый заказ (бесплатно, без повторной озвучки)
# После озвучки длина подгоняется к цели 1:10–1:15 лёгким изменением темпа (не больше ±8 %);
# исходник остаётся в voice/NAME_raw.mp3. --no-fit — оставить как есть.
import argparse, json, os, pathlib, re, subprocess, sys, time, urllib.error, urllib.request
ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://api.lumean.app/api/public"
STATE = ROOT / "voice/lumean.json"          # id шаблона и голоса (не секрет)
MODEL = "eleven_multilingual_v2"
TARGET = (70.0, 75.0); TAIL = 0.7; MAX_FIT = 0.08
FINAL = {"completed", "result_delivered"}; FAILED = {"failed", "cancelled", "compensated"}


def key():
    k = os.environ.get("LUMEAN_API_KEY")
    if not k: sys.exit("нет LUMEAN_API_KEY: добавь ключ в секреты облачной среды и открой новый чат")
    return k


def api(method, path, body=None, query=None):
    url = BASE + path + ("?" + "&".join(f"{k}={urllib.request.quote(str(v))}" for k, v in query.items() if v is not None) if query else "")
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"X-API-KEY": key(), "Content-Type": "application/json", "Accept": "application/json", "X-Locale": "ru"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r: res = json.loads(r.read())
    except urllib.error.HTTPError as e:
        try: res = json.loads(e.read())
        except Exception: res = {}
        sys.exit(f"Lumean {method} {path}: HTTP {e.code} {res.get('reason', '')} {res.get('message', '')} {res.get('errors', '')}".strip())
    if not res.get("success"): sys.exit(f"Lumean {method} {path}: {res.get('reason', '')} {res.get('message', '')}")
    return res.get("data")


def download(url, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as r: path.write_bytes(r.read())


def ffdur(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True).stdout)


def cmd_voices(a):
    data = api("GET", "/voices/elevenlabs/library", query={"accent": "american", "gender": a.gender, "search": a.search,
                                                          "use_cases": a.use_case, "page": 0, "page_size": a.limit})
    for i, v in enumerate(data["voices"], 1):
        name = re.sub(r"[^\w-]+", "_", v.get("name", "voice"))[:40]
        print(f"{i:2}. {v.get('name')} | {v.get('gender')}, {v.get('age')}, {v.get('use_case')} | voice_id {v['voice_id']}")
        if v.get("description"): print("     ", v["description"][:140])
        if v.get("preview_url"):
            try: download(v["preview_url"], ROOT / f"voice/samples/{i:02}_{name}.mp3")
            except Exception as e: print("      проба не скачалась:", e)
    print("пробы → voice/samples/")


def cmd_info(a):
    data = api("GET", "/voices/elevenlabs/library", query={"search": a.voice_id, "page": 0, "page_size": 10})
    hit = [v for v in data["voices"] if v["voice_id"] == a.voice_id]
    if not hit: sys.exit(f"голос {a.voice_id} в каталоге ElevenLabs через поиск не найден (найдено других: {len(data['voices'])})")
    v = hit[0]
    for k in ("name", "gender", "age", "accent", "language", "use_case", "category", "descriptive", "description", "cloned_by_count", "usage_character_count_1y", "free_users_allowed", "rate"):
        if v.get(k) not in (None, ""): print(f"{k}: {v[k]}")
    if v.get("preview_url"):
        download(v["preview_url"], ROOT / f"voice/samples/info_{a.voice_id}.mp3"); print("проба → voice/samples/info_" + a.voice_id + ".mp3")


def cmd_setup(a):
    data = api("POST", "/templates", {"service_key": "elevenlabs", "name": "Fobbin narrator", "config": {"tts_settings": {
        "mode": "mode_v1", "model_id": MODEL, "voice_id": a.voice_id, "advanced_voice_settings": True,
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.75, "style": 0.2, "use_speaker_boost": True, "speed": 1.0}}}})
    STATE.parent.mkdir(exist_ok=True)
    STATE.write_text(json.dumps({"template_id": data["id"], "voice_id": a.voice_id, "model_id": MODEL}, indent=1))
    print("шаблон создан:", data["id"], "→", STATE.relative_to(ROOT))


def script_text(name):
    md = (ROOT / f"scripts/{name}.md").read_text(encoding="utf-8")
    m = re.search(r"## Озвучка \(EN\)\n(.*?)(?=\n## |\Z)", md, re.S)
    if not m: sys.exit(f"в scripts/{name}.md нет раздела «## Озвучка (EN)»")
    return m.group(1).strip()


def cmd_say(a):
    if not STATE.exists(): sys.exit("сначала выбери голос: python3 tools/voice.py setup VOICE_ID")
    st = json.loads(STATE.read_text())
    body = {"template_id": st["template_id"], "input_text": script_text(a.name)}
    if a.speed: body["config_override"] = {"tts_settings": {"voice_settings": {"speed": a.speed}}}
    # POST /orders без ключа идемпотентности: при сетевой ошибке НЕ повторяем, а проверяем GET /orders в кабинете
    order = api("POST", "/orders", body)
    oid = order["id"]; print("заказ", oid, "создан, жду…", flush=True)
    for _ in range(240):
        o = api("GET", f"/orders/{oid}"); s = o["status"]
        if s in FINAL: break
        if s in FAILED or s == "partially_completed": sys.exit(f"заказ {oid}: {s} — смотри в кабинете Lumean (повтор оплачивается заново)")
        time.sleep(5)
    else: sys.exit(f"заказ {oid} не завершился за 20 минут — проверь в кабинете")
    finish(a.name, o, a.no_fit)


def cmd_fetch(a):
    o = api("GET", f"/orders/{a.order}")
    if o["status"] not in FINAL: sys.exit(f"заказ {a.order}: статус {o['status']} — ещё не готов или не выполнен")
    finish(a.name, o, a.no_fit)


def finish(name, o, no_fit):
    # скачать готовый файл заказа и подогнать длину; файлы заказа хранятся у Lumean 7 дней (s3.lumean.app)
    url = api("POST", "/storage/url", {"path": o["result"]["files"][0], "download": True})["url"]
    raw = ROOT / f"voice/{name}_raw.mp3"; out = ROOT / f"voice/{name}.mp3"
    download(url, raw)
    dur = ffdur(raw); video = dur + TAIL; tempo = 1.0
    if not no_fit and not TARGET[0] <= video <= TARGET[1]:
        want = (sum(TARGET) / 2) - TAIL
        tempo = min(1 + MAX_FIT, max(1 - MAX_FIT, dur / want))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", f"atempo={tempo:.4f}", "-b:a", "192k", str(out)], check=True)
    fin = ffdur(out) + TAIL
    print(f"голос: {dur:.1f} с, темп ×{tempo:.3f} → ролик {fin:.1f} с" + ("" if TARGET[0] <= fin <= TARGET[1] else " ⚠ вне 1:10–1:15 — поправить текст или --speed"))
    print("дальше: python3 tools/align.py", name)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] not in ("voices", "info", "setup", "fetch", "-h", "--help"):
        p = argparse.ArgumentParser(); p.add_argument("name"); p.add_argument("--speed", type=float); p.add_argument("--no-fit", action="store_true")
        cmd_say(p.parse_args())
    else:
        p = argparse.ArgumentParser(); sub = p.add_subparsers(dest="cmd", required=True)
        v = sub.add_parser("voices"); v.add_argument("--gender", choices=["male", "female"]); v.add_argument("--search")
        v.add_argument("--use-case", default="narrative_story"); v.add_argument("--limit", type=int, default=15)
        i = sub.add_parser("info"); i.add_argument("voice_id")
        s = sub.add_parser("setup"); s.add_argument("voice_id")
        f = sub.add_parser("fetch"); f.add_argument("name"); f.add_argument("order"); f.add_argument("--no-fit", action="store_true")
        a = p.parse_args(); {"voices": cmd_voices, "info": cmd_info, "setup": cmd_setup, "fetch": cmd_fetch}[a.cmd](a)
