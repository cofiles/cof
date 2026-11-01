"""Печатает строки таблицы для files.html.

Запуск из папки сайта: python make_hashes.py
Скопируй вывод в tbody таблицы на странице files.html и допиши описание.
"""
import hashlib
from html import escape
from pathlib import Path
from urllib.parse import quote

FOLDER = Path(__file__).parent / "files"


def human(size: int) -> str:
    for unit in ("Б", "КБ", "МБ", "ГБ"):
        if size < 1024 or unit == "ГБ":
            return f"{size:.0f} {unit}" if unit == "Б" else f"{size:.1f} {unit}"
        size /= 1024


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


for p in sorted(FOLDER.iterdir()):
    if not p.is_file():
        continue
    size = p.stat().st_size
    warn = "  <!-- больше 100 МБ: GitHub не примет, используй Releases -->\n" if size > 100 * 1024 * 1024 else ""
    print(f'<tr class="item">\n{warn}  <td><a href="files/{quote(p.name)}" download>{escape(p.name)}</a></td>\n'
          f'  <td>{human(size)}</td>\n  <td><code>{sha256(p)}</code></td>\n  <td>Описание</td>\n</tr>\n')
