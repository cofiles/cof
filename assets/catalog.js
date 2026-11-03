/* Paginated, searchable catalog. Original entries remain available without JavaScript. */
(function () {
  'use strict';
  var PAGE_SIZE = 24;
  var selected = new Map();
  var allPackages = new Map();
  var groups = [];
  var reverseTranslations = new Map(Object.entries(window.SITE_TRANSLATIONS || {}).map(function (pair) { return [pair[1], pair[0]]; }));
  var active = '', query = '', popularOnly = false;
  var popularity = new Map();
  (window.CATALOG_ADDITIONS || []).forEach(function (group) { (group.entries || []).forEach(function (record) { if (record.stars) popularity.set(record.url.toLowerCase().replace(/\/$/, ''), record.stars); }); });
  function starsOf(record) { return record.stars || popularity.get(record.url.toLowerCase().replace(/\/$/, '')) || 0; }
  function decorate(node, record) {
    node.querySelectorAll('.entry-badges').forEach(function (old) { old.remove(); });
    var badges = el('span', 'entry-badges');
    var stars = starsOf(record);
    if (stars >= 10000) {
      var badge = el('span', 'tracker-badge popular', bilingual('ПОПУЛЯРНОЕ', 'POPULAR'));
      badge.title = bilingual('Не менее 10 000 звёзд GitHub в снимке каталога: ', 'At least 10,000 GitHub stars in the catalog snapshot: ') + stars.toLocaleString(document.documentElement.lang);
      badges.appendChild(badge);
    }
    if (record.source === 'microsoft') badges.appendChild(el('span', 'tracker-badge docs', bilingual('ДОКУМЕНТАЦИЯ', 'DOCUMENTATION')));
    if (record.source === 'pypi') badges.appendChild(el('span', 'tracker-badge package', 'PYPI'));
    var heading = node.querySelector('h3') || node.querySelector('.pick');
    if (heading && badges.childNodes.length) heading.appendChild(badges);
    return node;
  }
  function bilingual(ru, en) { return document.documentElement.lang === 'en' ? en : ru; }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function key(name) { return name.toLowerCase().replace(/[-_.]+/g, '-'); }
  function packageChange(record, checked) {
    if (checked) selected.set(key(record.name), record);
    else selected.delete(key(record.name));
    document.querySelectorAll('input.pkg').forEach(function (input) {
      if (key(input.value) === key(record.name)) input.checked = checked;
    });
    refreshRequirements();
  }
  function recordNode(record, group) {
    if (record.node) {
      var input = record.node.querySelector('input.pkg');
      if (input) input.checked = selected.has(key(record.name));
      return decorate(record.node, record);
    }
    var article = el('article', 'item imported');
    var link = el('a', '', record.name);
    link.href = record.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    var title = el('h3');
    if (record.source === 'pypi') {
      var pick = el('div', 'pick');
      var box = el('input', 'pkg');
      box.type = 'checkbox'; box.value = record.name;
      box.id = 'extra-' + group.index + '-' + key(record.name);
      box.checked = selected.has(key(record.name));
      var label = el('label', '', record.name); label.htmlFor = box.id;
      box.addEventListener('change', function () { packageChange(record, box.checked); });
      pick.append(box, label); article.appendChild(pick);
      link.textContent = 'PyPI';
    } else { title.appendChild(link); article.appendChild(title); }
    var description = bilingual('Пакет PyPI', 'PyPI package');
    if (record.source === 'github') description = bilingual('Репозиторий GitHub', 'GitHub repository');
    if (record.source === 'microsoft') description = bilingual('Документация Microsoft', 'Microsoft documentation');
    if (record.language) description += ' · ' + record.language;
    article.appendChild(el('p', '', description));
    if (record.stars) article.appendChild(el('p', 'muted', '★ ' + record.stars.toLocaleString(document.documentElement.lang)));
    var topics = (record.topics || []).filter(function (t) { return /^[a-z0-9.+#_-]+$/i.test(t); }).slice(0, 3);
    if (topics.length) article.appendChild(el('p', 'muted', topics.join(' · ')));
    if (record.source === 'pypi') article.appendChild(link);
    if (record.version) article.appendChild(el('span', 'ver', record.version));
    return decorate(article, record);
  }
  function renderGroup(group) {
    group.list.replaceChildren();
    var slice = group.matches.slice(group.page * PAGE_SIZE, (group.page + 1) * PAGE_SIZE);
    slice.forEach(function (record) { group.list.appendChild(recordNode(record, group)); });
    var pageCount = Math.max(1, Math.ceil(group.matches.length / PAGE_SIZE));
    group.status.textContent = bilingual('Записей: ', 'Entries: ') + group.matches.length +
      bilingual(' · Страница ', ' · Page ') + (group.page + 1) + ' / ' + pageCount;
    group.previous.textContent = bilingual('Назад', 'Previous');
    group.next.textContent = bilingual('Далее', 'Next');
    group.previous.disabled = group.page === 0;
    group.next.disabled = group.page + 1 >= pageCount;
    group.pager.hidden = pageCount <= 1;
    if (group.scope) group.scope.textContent = bilingual(group.expanded_ru, group.expanded_en);
  }
  function apply(reset) {
    var total = 0, found = 0;
    groups.forEach(function (group) {
      total += group.records.length;
      group.matches = active && active !== group.tag ? [] : group.records.filter(function (record) { return (!popularOnly || starsOf(record) >= 10000) && (!query || record.search.includes(query)); });
      found += group.matches.length;
      group.element.hidden = !group.matches.length;
      if (reset) group.page = 0;
      renderGroup(group);
    });
    document.querySelectorAll('#chips button').forEach(function (button) {
      button.textContent = siteText(button.dataset.tag || 'Все');
      button.setAttribute('aria-pressed', String(button.dataset.tag === active));
    });
    var count = document.getElementById('count');
    if (count) count.textContent = bilingual('Найдено: ', 'Found: ') + found + bilingual(' из ', ' of ') + total;
    var empty = document.getElementById('catalog-empty');
    empty.hidden = found > 0;
    empty.textContent = siteText('Ничего не найдено. Измените запрос или фильтр.');
  }
  function requirements() {
    var mode = document.getElementById('req-mode');
    return Array.from(selected.values()).sort(function (a,b) { return a.name.localeCompare(b.name); }).map(function (record) {
      var suffix = record.version && mode.value !== 'none' ? (mode.value === 'pin' ? '==' : '>=') + record.version : '';
      return record.name + suffix;
    }).join('\n');
  }
  function refreshRequirements() {
    var preview = document.getElementById('req-preview');
    if (!preview) return;
    preview.textContent = requirements() || siteText('Отметь пакеты в списке');
    document.getElementById('req-count').textContent = siteText('Выбрано: ') + selected.size;
  }
  function initRequirements() {
    var mode = document.getElementById('req-mode');
    if (!mode) return;
    mode.addEventListener('change', refreshRequirements);
    document.querySelectorAll('[data-set]').forEach(function (button) {
      button.addEventListener('click', function () {
        allPackages.forEach(function (record) {
          if ((record.sets || []).includes(button.dataset.set)) selected.set(key(record.name), record);
        });
        apply(false); refreshRequirements();
      });
    });
    document.getElementById('req-all').addEventListener('click', function () {
      allPackages.forEach(function (record, packageKey) { selected.set(packageKey, record); });
      apply(false); refreshRequirements();
    });
    document.getElementById('req-clear').addEventListener('click', function () { selected.clear(); apply(false); refreshRequirements(); });
    document.getElementById('req-download').addEventListener('click', function () {
      var value = requirements();
      if (!value) { document.getElementById('req-preview').textContent = siteText('Сначала отметь пакеты'); return; }
      var url = URL.createObjectURL(new Blob([value + '\n'], {type:'text/plain;charset=utf-8'}));
      var a = el('a'); a.href = url; a.download = 'requirements.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    var copy = document.getElementById('req-copy');
    copy.addEventListener('click', async function () {
      var value = requirements(); if (!value) return;
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value + '\n');
        else {
          var text = el('textarea'); text.value = value + '\n'; document.body.appendChild(text); text.select();
          var success = document.execCommand('copy'); text.remove();
          if (!success) throw new Error('copy');
        }
        copy.textContent = siteText('Скопировано');
      } catch (_) { copy.textContent = bilingual('Выделите текст для копирования', 'Select the text to copy'); }
      setTimeout(function () { copy.textContent = siteText('Копировать'); }, 1800);
    });
    refreshRequirements();
  }
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.CATALOG_ADDITIONS) return;
    var input = document.getElementById('search');
    document.querySelectorAll('.group').forEach(function (element, index) {
      var list = element.querySelector('.list');
      if (!list) return;
      var data = window.CATALOG_ADDITIONS[index] || {};
      var original = Array.from(list.querySelectorAll('.item')).map(function (node) {
        var checkbox = node.querySelector('input.pkg');
        var name = checkbox ? checkbox.value : node.querySelector('h3').textContent.trim();
        var record = {name:name, url:node.querySelector('a').href, version:node.dataset.version || '',
          sets:(node.dataset.sets || '').split(/\s+/), source:checkbox ? 'pypi' : 'original', node:node};
        // Search both languages even while the other language is selected.
        var body = node.textContent;
        var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), textNode;
        while ((textNode = walker.nextNode())) {
          var text = textNode.nodeValue.trim();
          body += ' ' + ((window.SITE_TRANSLATIONS || {})[text] || '') + ' ' + (reverseTranslations.get(text) || '');
        }
        record.search = (body + ' ' + name).toLowerCase();
        if (checkbox) checkbox.addEventListener('change', function () { packageChange(record, checkbox.checked); });
        return record;
      });
      var seen = new Set(original.map(function (record) { return record.url.replace(/\/$/, '').toLowerCase(); }));
      var additions = (data.entries || []).filter(function (record) {
        var url = record.url.replace(/\/$/, '').toLowerCase();
        if (seen.has(url)) return false;
        seen.add(url); return true;
      }).map(function (record) {
        record.search = (record.name + ' ' + (record.summary || '') + ' ' + (record.language || '') + ' ' + (record.topics || []).join(' ') + ' ' + (data.expanded_ru || '') + ' ' + (data.expanded_en || '')).toLowerCase();
        return record;
      });
      var tag = original.length ? original[0].node.dataset.tags.split(/\s+/)[0] : String(index);
      var pager = el('div', 'catalog-pager');
      var previous = el('button', 'chip'), next = el('button', 'chip');
      previous.type = next.type = 'button';
      var status = el('p', 'muted'); status.setAttribute('aria-live','polite');
      pager.append(previous, next); list.after(status, pager);
      var group = {index:index, element:element, list:list, records:original.concat(additions), matches:[], page:0, tag:tag, pager:pager, previous:previous, next:next, status:status, expanded_ru:data.expanded_ru, expanded_en:data.expanded_en};
      if (data.expanded_ru) { group.scope = el('p', 'catalog-scope muted'); list.before(group.scope); }
      previous.addEventListener('click', function () { group.page--; renderGroup(group); window.siteScroll(element.getBoundingClientRect().top + window.scrollY - 24); });
      next.addEventListener('click', function () { group.page++; renderGroup(group); window.siteScroll(element.getBoundingClientRect().top + window.scrollY - 24); });
      group.records.forEach(function (record) { if (record.source === 'pypi' && !allPackages.has(key(record.name))) allPackages.set(key(record.name), record); });
      groups.push(group);
    });
    var chips = document.getElementById('chips');
    if (chips) [''].concat(groups.map(function (g) { return g.tag; })).forEach(function (tag) {
      var button = el('button', 'chip'); button.type='button'; button.dataset.tag=tag;
      button.addEventListener('click', function () { active=tag; apply(true); }); chips.appendChild(button);
    });
    var empty = el('p', 'notice'); empty.id='catalog-empty'; document.getElementById('count').after(empty);
    input.addEventListener('input', function () { query=input.value.trim().toLowerCase(); apply(true); });
    document.addEventListener('site-language-change', function () { apply(false); refreshRequirements(); });
    var popularControl = document.getElementById('popular-only');
    if (popularControl) popularControl.addEventListener('change', function () { popularOnly = popularControl.checked; apply(true); });
    initRequirements(); apply(true);
  });
})();
