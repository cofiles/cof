<div align="center">

# ✳ Сборник · Collection

**Полезные инструменты. Один каталог. / Useful tools. One catalog.**

Статический каталог программ, Python-пакетов, технологий и репозиториев с интерактивным интерфейсом.

A static directory of software, Python packages, technologies and repositories with an interactive interface.

[![HTML5](https://img.shields.io/badge/HTML5-171F44?style=for-the-badge&logo=html5&logoColor=E34F26)](index.html)
[![CSS](https://img.shields.io/badge/CSS-171F44?style=for-the-badge&logo=css&logoColor=74FFED)](assets/style.css)
[![Vanilla JavaScript](https://img.shields.io/badge/Vanilla_JavaScript-171F44?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](assets/interactions.js)
[![RU / EN](https://img.shields.io/badge/RU_%2F_EN-171F44?style=for-the-badge&logo=googletranslate&logoColor=74FFED)](assets/translations.js)
[![Dark / Light](https://img.shields.io/badge/Dark_%2F_Light-171F44?style=for-the-badge&logo=darkreader&logoColor=74FFED)](#features)
[![No build step](https://img.shields.io/badge/No_build_step-171F44?style=for-the-badge&logo=github&logoColor=74FFED)](#quick-start)

[Запуск / Run](#quick-start) · [Возможности / Features](#features) · [Публикация / Deploy](#deploy) · [Редактирование / Edit](#edit) · [Проверки / Checks](#checks)

</div>

> **RU:** Это README сайта, а не инструкция по установке всех перечисленных программ. Каталог хранит ссылки и метаданные; скачивание ПО происходит на сайтах проектов.
>
> **EN:** This README describes the website, not how to install every listed program. The catalog contains links and metadata; software downloads are hosted by their respective projects.

<a id="quick-start"></a>
## 🚀 Быстрый запуск / Quick start

**RU:** Скачай репозиторий, открой терминал в папке с `index.html` и запусти локальный сервер. Нужен Python 3.9+ для комплектных проверок. Установка зависимостей и сборка не требуются.

**EN:** Download the repository, open a terminal in the folder containing `index.html`, and start a local server. Bundled validation requires Python 3.9+. No dependencies or build step are required.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Windows:

```powershell
py -3 -m http.server 8000 --bind 127.0.0.1
```

Открой / Open **http://127.0.0.1:8000/**. Остановить сервер / Stop server: `Ctrl+C`.

**RU:** `index.html` можно открыть напрямую, но локальный сервер удобнее для проверки переходов, копирования и публикации.

**EN:** You can open `index.html` directly, but a local server is preferable for testing navigation, clipboard behavior and deployment.

<a id="features"></a>
## ✨ Возможности / Features

| Функция / Feature | Что делает / What it does |
|---|---|
| RU / EN | Переключение языка интерфейса / Interface language switching |
| Dark / Light | Две темы, сохранение языка и темы локально / Two themes; language and theme saved locally |
| Поиск / Search | Поиск по всем записям раздела, включая другие страницы / Searches all entries in the current catalog, including other pages |
| Темы / Topics | Фильтрация по подгруппе, сворачивание групп / Topic filtering and collapsible groups |
| Популярное / Popular | Метки для проектов от 10 000 GitHub stars в снимке / Labels for projects with at least 10,000 GitHub stars in the snapshot |
| requirements.txt | Выбор пакетов, версии, копирование и скачивание / Package selection, version modes, copy and download |
| Навигация / Navigation | Расширяющиеся вкладки, переходы страниц и плавная прокрутка / Expanding tabs, page transitions and smooth scrolling |
| Сфера / Sphere | Перетаскивание, инерция, масштаб, пауза и сброс / Dragging, inertia, zoom, pause and reset |
| Мобильная версия / Mobile | Адаптивная сетка и сенсорное управление / Responsive layout and touch controls |
| Доступность / Accessibility | Клавиатура, видимый фокус, reduced motion / Keyboard controls, visible focus and reduced motion |

### Управление / Controls

| Действие / Action | Управление / Control |
|---|---|
| Фокус поиска / Focus search | `/`, когда курсор вне поля ввода / outside editable fields |
| Очистить поиск / Clear search | `Esc` в поле поиска / in the search field |
| Свернуть группу / Collapse group | `−` рядом с заголовком / beside the heading |
| Развернуть группу / Expand group | `+` рядом с заголовком / beside the heading |
| Начало / конец / Top / bottom | Плавающие кнопки `↑` / `↓` / floating buttons |
| Вращать сферу / Rotate sphere | Перетаскивание мышью или пальцем / mouse or touch drag |
| Сфера с клавиатуры / Keyboard sphere | Фокус через `Tab`, затем стрелки / focus with `Tab`, then arrow keys |
| Масштаб сферы / Sphere zoom | `+` / `−` при фокусе на сфере или кнопки / while focused, or buttons |
| Пауза сферы / Pause sphere | `Space` при фокусе или кнопка `Ⅱ` / while focused, or `Ⅱ` button |
| Сброс сферы / Reset sphere | `↺` |

**RU:** Настройка системы «уменьшение движения» отключает декоративные анимации. Межстраничные эффекты зависят от поддержки браузером View Transitions; функциональность ссылок сохраняется.

**EN:** The system’s reduced-motion preference disables decorative animation. Cross-page effects depend on browser support for View Transitions; links remain functional.

## 📊 Каталог / Catalog

Снимок поставляемой версии / Bundled snapshot:

| Раздел / Section | Подгруппы / Groups | Записи / Entries |
|---|---:|---:|
| Программы / Software | 35 | 35,035 |
| Python | 35 | 35,035 |
| Языки / Languages | 17 | 17,017 |
| GitHub | 17 | 17,017 |
| Windows | 5 | 5,005 |
| **Всего / Total** | **109** | **109,109** |

**RU:** В каждой подгруппе — 1 001 запись. Всего 85 468 различных URL; один ресурс может входить в несколько тем. Это число размещений, а не число уникальных продуктов. Подгруппы Windows включают связанную документацию и инструменты. Классификация расширена и автоматизирована; возможны неточные совпадения. Звёзды и версии не обновляются в реальном времени.

**EN:** Each group contains 1,001 entries. There are 85,468 distinct URLs; a resource may appear under multiple topics. Entry counts are placements, not unique products. Windows groups include related documentation and tools. Classification is broadened and automated, so imperfect matches are possible. Stars and versions are not updated live.

Происхождение данных / Data provenance: [SOURCES.md](SOURCES.md) · [Источники на сайте / Website sources](sources.html) · [Аудит / Audit](catalog-audit.json).

## 🐍 Генератор requirements.txt / Requirements generator

1. Открой / Open [python.html](python.html).
2. Выбери пакеты или готовый набор / Select packages or a preset.
3. Выбери режим версий / Choose a version mode: без версий / unpinned, `==`, `>=`.
4. Нажми «Скачать» или «Копировать» / Click Download or Copy.

**RU:** «Выбрать все пакеты» выбирает все **32 329 уникальных пакетов**, даже при активном поиске или фильтре. Повторы объединяются по нормализованному имени. «Очистить» снимает весь выбор. Выбор пакетов не сохраняется после перезагрузки страницы.

**EN:** Select all packages selects all **32,329 unique packages**, even with search or filters active. Duplicates are merged by normalized package name. Clear removes the entire selection. Package selection does not persist after a reload.

**RU:** Генератор не разрешает зависимости и не проверяет совместимость выбранных пакетов. Полный каталог не является совместимым окружением; выбирай зависимости под свой проект. Если версия в снимке отсутствует, строка останется без ограничения версии.

**EN:** The generator does not resolve dependencies or verify compatibility. The complete catalog is not a compatible environment; select dependencies for your project. Entries without a snapshot version remain unpinned.

<a id="deploy"></a>
## 🌍 GitHub Pages

**RU:** Загрузи содержимое папки сайта в корень репозитория: `index.html`, `assets/`, остальные страницы и скрытый файл `.nojekyll`. Не загружай ZIP вместо распакованных файлов.

**EN:** Upload the website folder’s contents to the repository root: `index.html`, `assets/`, the other pages and the hidden `.nojekyll` file. Upload extracted files, not the ZIP archive.

1. Открой / Open **Settings → Pages**.
2. Выбери / Select **Build and deployment → Source → Deploy from a branch**.
3. Укажи ветку с файлами, например `main`, и `/(root)` / Choose the branch containing the files, such as `main`, and `/(root)`.
4. Нажми / Click **Save**.
5. Дождись публикации и открой адрес из настроек Pages / Wait for deployment and open the URL shown in Pages settings.

**RU:** Для обычного репозитория адрес имеет вид `https://USERNAME.github.io/REPOSITORY/`. Относительные пути сайта подходят для такого размещения. Результат публикации проверяй во вкладке Actions.

**EN:** A project repository typically uses `https://USERNAME.github.io/REPOSITORY/`. The site uses relative paths suitable for this layout. Check deployment results in the Actions tab.

[Официальная инструкция / Official publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

<a id="edit"></a>
## 🛠 Структура и редактирование / Structure and editing

| Файл / File | Назначение / Purpose |
|---|---|
| `index.html` | Главная и интерактивная сфера / Home and interactive sphere |
| `tools.html`, `windows.html`, `python.html`, `languages.html`, `repos.html` | Каталоги / Catalog pages |
| `articles.html`, `articles/` | Статьи и шаблон / Articles and template |
| `files.html`, `files/` | Страница загрузок и файлы / Downloads page and files |
| `assets/catalog-*.js` | Импортированные данные по разделам / Imported catalog data |
| `assets/catalog.js` | Поиск, страницы, выбор пакетов / Search, pagination, package selection |
| `assets/style.css` | Палитра, адаптивность, CSS-анимации / Palette, responsive layout, CSS animations |
| `assets/motion.js` | Вкладки и сфера / Tabs and sphere |
| `assets/interactions.js` | Переходы, раскрытие, эффекты и клавиши / Transitions, disclosure, effects and shortcuts |
| `assets/interface.js` | Выбор темы каталога и прокрутка / Catalog topic selector and scrolling |
| `assets/preferences.js` | Начальные настройки языка и оформления / Initial language and theme preferences |
| `assets/i18n.js`, `assets/translations.js` | Механизм перевода и словарь / Translation engine and dictionary |
| `assets/app.js` | Поведение страниц без расширенного каталога / Behavior for pages without expanded catalogs |
| `validate_site.py` | Проверка данных и структуры / Data and structure validation |
| `check_links.py` | Проверка внешних ссылок из HTML / External link checks for HTML |
| `make_hashes.py` | SHA-256 и строки таблицы загрузок / SHA-256 and download table rows |
| `404.html`, `.nojekyll` | Страница ошибки и настройка статической публикации / Error page and static publishing configuration |

### Добавление записей / Adding entries

**RU:** В существующую подгруппу добавляй объект в `entries` соответствующего файла `assets/catalog-*.js`. Порядок групп в данных должен совпадать с порядком `.group` в HTML. Сохраняй настоящие URL, источник, описания области темы `expanded_ru` / `expanded_en` и устраняй повторы внутри группы. Существующие HTML-записи тоже участвуют в подсчёте.

**EN:** Add an object to the relevant group’s `entries` in `assets/catalog-*.js`. Data groups must remain in the same order as `.group` sections in HTML. Preserve real URLs, source attribution and `expanded_ru` / `expanded_en` scope descriptions, and remove duplicates within each group. Existing HTML entries also count.

```js
{
  "name": "requests",
  "url": "https://pypi.org/project/requests/",
  "summary": "HTTP library for Python",
  "source": "pypi",
  "language": "Python"
}
```

**RU:** Это пример формата: `requests` уже есть в каталоге, не добавляй дубликат. Поля `version`, `stars`, `topics` указывай только при наличии данных. При изменении состава обнови `catalog-audit.json`, статистику страниц и README. Валидатор текущего снимка ожидает 109 групп; добавление новой группы требует обновления этой проверки.

**EN:** This illustrates the format: `requests` already exists, so do not duplicate it. Include `version`, `stars` and `topics` only when supported by data. Update `catalog-audit.json`, page statistics and this README when changing the catalog. The snapshot validator expects 109 groups; adding groups requires updating that check.

### Тексты, статьи и файлы / Text, articles and downloads

- **RU:** Добавляй новый русский текст и его английский перевод в `assets/translations.js`. Динамические подписи также должны учитывать выбранный язык.
  **EN:** Add new Russian text and its English translation to `assets/translations.js`. Dynamic labels must also respect the selected language.
- **RU:** Для статьи скопируй `articles/_template.html`, заполни её и добавь ссылку в `articles.html`.
  **EN:** Copy `articles/_template.html`, fill it in, and link it from `articles.html`.
- **RU:** Для загрузки положи файл в `files/`, запусти `python3 make_hashes.py`, вставь нужные строки в `files.html` и добавь описание с переводом. Скрипт сам HTML не редактирует.
  **EN:** Put a download in `files/`, run `python3 make_hashes.py`, insert the relevant rows in `files.html`, and add a bilingual description. The script does not edit HTML automatically.

<a id="checks"></a>
## ✅ Проверки / Checks

Из корня сайта / From the website root:

```bash
python3 validate_site.py
```

**RU:** Проверяет локальные ссылки и ресурсы, повторяющиеся ID, наличие переводов статических текстов, число групп, минимальные объёмы и дубликаты URL внутри подгрупп. Не заменяет визуальную проверку и не подтверждает доступность внешних сайтов.

**EN:** Checks local links and assets, duplicate IDs, static text translation coverage, group counts, minimum catalog sizes and duplicate URLs within groups. It does not replace visual testing or verify external website availability.

```bash
python3 check_links.py
```

**RU:** Дополнительная сетевая проверка ссылок **из HTML**. Импортированные URL из `catalog-*.js` она не обходит. Отчёт записывается в `broken_links.txt`; коды `403` / `429` могут означать блокировку автоматических запросов. Скрипт возвращает код 0 даже при проблемах — прочитай отчёт.

**EN:** An optional network check of links **in HTML**. It does not scan imported URLs in `catalog-*.js`. Results are written to `broken_links.txt`; `403` / `429` may indicate automated-request blocking. The script exits with code 0 even when problems are found, so read its report.

Перед публикацией / Before publishing:

- [ ] Проверка `validate_site.py` проходит / Validation passes.
- [ ] RU / EN и обе темы работают / RU / EN and both themes work.
- [ ] Поиск, фильтры и страницы каталога работают / Search, filters and pagination work.
- [ ] Выбор, очистка и скачивание requirements работают / Requirements selection, clearing and download work.
- [ ] Проверены мобильный экран и клавиатура / Mobile layout and keyboard navigation checked.
- [ ] Новые источники указаны в `SOURCES.md` / New sources credited in `SOURCES.md`.

## 🔧 Решение проблем / Troubleshooting

| Проблема / Problem | Решение / Solution |
|---|---|
| После обновления старый дизайн / Old design after update | Обнови страницу без кеша / Perform a hard refresh |
| Pages показывает 404 / Pages returns 404 | Проверь ветку, папку публикации и наличие `index.html` / Check publishing branch, folder and `index.html` |
| Не загружаются стили / Missing styles | Проверь папку `assets/`, регистр имён и относительные пути / Check `assets/`, filename casing and relative paths |
| Копирование не работает / Copy fails | Используй localhost / HTTPS или кнопку скачивания / Use localhost / HTTPS or Download |
| Мало карточек на экране / Few cards visible | На странице группы выводится до 24 записей; используй пагинацию / Groups show up to 24 entries per page; use pagination |
| Сфера не вращается сама / Sphere is not rotating | Проверь паузу и системную настройку reduced motion / Check pause and system reduced-motion settings |
| Ошибка установки пакетов / Package installation fails | Проверь версии и совместимость выбранных зависимостей / Check selected dependency versions and compatibility |

## 🤝 Участие и лицензии / Contributing and licensing

**RU:** Для предложения исправления укажи страницу, название записи, проблему и проверенный источник. Для ошибки интерфейса добавь браузер, размер экрана, язык и тему. Перед PR запускай валидатор и проверяй изменённые сценарии.

**EN:** When suggesting a correction, include the page, entry name, issue and a verifiable source. For UI bugs, include browser, screen size, language and theme. Run validation and test the affected interactions before opening a PR.

**RU:** Отдельная лицензия кода сайта пока не объявлена. Лицензии метаданных и программ различаются: смотри [SOURCES.md](SOURCES.md) и страницы оригинальных проектов. Нельзя считать весь каталог лицензированным под MIT или CC BY только из-за одного источника.

**EN:** A separate license for the website code has not been declared. Metadata and software licenses differ: see [SOURCES.md](SOURCES.md) and the original project pages. A single source’s MIT or CC BY license does not apply to the entire catalog.
