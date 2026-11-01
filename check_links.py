"""Проверка внешних ссылок сайта.

Запуск из папки сайта: python check_links.py
Результат печатается в консоль и сохраняется в broken_links.txt.
Часть сайтов блокирует скрипты и отвечает 403 или 429. Такие ссылки открой вручную.
"""
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).parent
URL_RE = re.compile(r'href="(https?://[^"]+)"')
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}

links = {}
for page in sorted(ROOT.rglob("*.html")):
    for url in URL_RE.findall(page.read_text(encoding="utf-8")):
        links.setdefault(url, set()).add(page.name)


def check(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as r:
            return url, r.status
    except urllib.error.HTTPError as e:
        return url, e.code
    except Exception as e:
        return url, str(e)[:60]


print(f"Проверяю ссылок: {len(links)}")
with ThreadPoolExecutor(12) as pool:
    results = list(pool.map(check, links))

lines = []
for url, status in results:
    if status != 200:
        kind = "проверь вручную" if status in (401, 403, 429, 999) else "не работает"
        lines.append(f"{status}\t{kind}\t{url}\t{', '.join(sorted(links[url]))}")
text = "\n".join(lines) if lines else "Все ссылки отвечают"
(ROOT / "broken_links.txt").write_text(text, encoding="utf-8")
print(text)
sys.exit(0)
