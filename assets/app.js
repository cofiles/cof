(function () {
  "use strict";

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // Поиск и фильтр по темам
  function initFilter() {
    var input = $("#search");
    var items = $$(".item[data-tags], tr.item");
    if (!input || !items.length) return;
    var chipBox = $("#chips");
    var count = $("#count");
    var groups = $$(".group");
    var active = "";
    var chips = [];

    function tagsOf(it) { return (it.getAttribute("data-tags") || "").split(/\s+/).filter(Boolean); }

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (it) {
        var okTag = !active || tagsOf(it).indexOf(active) !== -1;
        var okText = !q || it.textContent.toLowerCase().indexOf(q) !== -1;
        it.hidden = !(okTag && okText);
        if (!it.hidden) shown++;
      });
      groups.forEach(function (g) {
        g.hidden = !$$(".item", g).some(function (it) { return !it.hidden; });
      });
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-tag") === active)); });
      if (count) count.textContent = "Показано: " + shown + " из " + items.length;
    }

    if (chipBox) {
      var seen = {};
      items.forEach(function (it) { tagsOf(it).forEach(function (t) { seen[t] = true; }); });
      [""].concat(Object.keys(seen)).forEach(function (t) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.setAttribute("data-tag", t);
        b.textContent = t || "Все";
        b.addEventListener("click", function () { active = t; apply(); });
        chipBox.appendChild(b);
        chips.push(b);
      });
    }
    input.addEventListener("input", apply);
    apply();
  }

  // Генератор requirements.txt
  function initPackages() {
    var boxes = $$("input.pkg");
    if (!boxes.length) return;
    var preview = $("#req-preview");
    var counter = $("#req-count");
    var mode = $("#req-mode");

    function lines() {
      return boxes.filter(function (b) { return b.checked; }).map(function (b) {
        var item = b.closest(".item");
        var v = item ? item.getAttribute("data-version") : "";
        if (mode.value === "pin" && v) return b.value + "==" + v;
        if (mode.value === "min" && v) return b.value + ">=" + v;
        return b.value;
      }).sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
    }
    function text() { var l = lines(); return l.length ? l.join("\n") + "\n" : ""; }
    function refresh() {
      var t = text();
      preview.textContent = t || "Отметь пакеты в списке";
      counter.textContent = "Выбрано: " + lines().length;
    }

    boxes.forEach(function (b) { b.addEventListener("change", refresh); });
    mode.addEventListener("change", refresh);

    $$("[data-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-set");
        boxes.forEach(function (b) {
          var item = b.closest(".item");
          var sets = ((item && item.getAttribute("data-sets")) || "").split(/\s+/);
          if (sets.indexOf(name) !== -1) b.checked = true;
        });
        refresh();
      });
    });

    $("#req-clear").addEventListener("click", function () {
      boxes.forEach(function (b) { b.checked = false; });
      refresh();
    });

    $("#req-download").addEventListener("click", function () {
      var t = text();
      if (!t) { preview.textContent = "Сначала отметь пакеты"; return; }
      var url = URL.createObjectURL(new Blob([t], { type: "text/plain;charset=utf-8" }));
      var a = document.createElement("a");
      a.href = url;
      a.download = "requirements.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });

    var copyBtn = $("#req-copy");
    copyBtn.addEventListener("click", function () {
      var t = text();
      if (!t) return;
      function done() { copyBtn.textContent = "Скопировано"; setTimeout(function () { copyBtn.textContent = "Копировать"; }, 1500); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = t;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* ничего */ }
        ta.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(done, fallback);
      } else { fallback(); }
    });
    refresh();
  }

  document.addEventListener("DOMContentLoaded", function () { initFilter(); initPackages(); });
})();
