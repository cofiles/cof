(function () {
  'use strict';
  var lang = 'ru', theme = 'dark';
  try {
    if (localStorage.getItem('site-language') === 'en') lang = 'en';
    if (localStorage.getItem('site-theme') === 'light') theme = 'light';
  } catch (_) { /* Storage may be disabled in private or local-file mode. */ }
  document.documentElement.lang = lang;
  document.documentElement.dataset.theme = theme;
  window.sitePreference = function (key, value) {
    try { localStorage.setItem('site-' + key, value); } catch (_) {}
  };
})();
