(function () {
  'use strict';
  var dictionary = window.SITE_TRANSLATIONS || {};
  var bindings = [];
  window.siteText = function (text) {
    return document.documentElement.lang === 'en' && Object.prototype.hasOwnProperty.call(dictionary, text) ? dictionary[text] : text;
  };
  function capture(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.parentElement && node.parentElement.closest('script,style,code,pre,option')) continue;
      var original = node.nodeValue;
      if (Object.prototype.hasOwnProperty.call(dictionary, original.trim())) bindings.push({node:node, original:original});
    }
    root.querySelectorAll('[placeholder],[aria-label],[title],meta[name="description"]').forEach(function (element) {
      ['placeholder','aria-label','title','content'].forEach(function (attr) {
        if (!element.hasAttribute(attr)) return;
        var original = element.getAttribute(attr);
        if (Object.prototype.hasOwnProperty.call(dictionary, original)) bindings.push({node:element, attr:attr, original:original});
      });
    });
    // Options in requirements mode are user-facing, unlike code previews.
    root.querySelectorAll('#req-mode option').forEach(function (option) {
      bindings.push({node:option.firstChild, original:option.textContent});
    });
  }
  function updateTheme() {
    var light = document.documentElement.dataset.theme === 'light';
    var button = document.getElementById('site-theme');
    if (button) {
      button.textContent = siteText(light ? 'Тёмная тема' : 'Светлая тема');
      button.setAttribute('aria-pressed', String(light));
    }
  }
  function apply(lang) {
    document.documentElement.lang = lang;
    bindings.forEach(function (binding) {
      var value = binding.original.replace(/\S[\s\S]*\S|\S/, function (text) { return siteText(text); });
      if (binding.attr) binding.node.setAttribute(binding.attr, value);
      else binding.node.nodeValue = value;
    });
    updateTheme();
    document.dispatchEvent(new CustomEvent('site-language-change'));
  }
  document.addEventListener('DOMContentLoaded', function () {
    capture(document.documentElement);
    var selector = document.getElementById('site-language');
    if (selector) {
      selector.value = document.documentElement.lang;
      selector.addEventListener('change', function () {
        sitePreference('language', selector.value);
        apply(selector.value);
      });
    }
    var button = document.getElementById('site-theme');
    if (button) button.addEventListener('click', function () {
      var theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = theme;
      sitePreference('theme', theme);
      updateTheme();
    });
    apply(document.documentElement.lang);
  });
})();
