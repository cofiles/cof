(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var chips = document.getElementById('chips');
    var topic;
    if (chips && chips.querySelector('button')) {
      var label = document.createElement('label');
      label.className = 'topic-picker';
      var title = document.createElement('span');
      topic = document.createElement('select');
      topic.id = 'topic-select';
      var buttons = Array.from(chips.querySelectorAll('button'));
      function updateTopics() {
        title.textContent = siteText('Тема');
        var selected = topic.value;
        topic.replaceChildren();
        buttons.forEach(function (button, i) {
          var option = document.createElement('option');
          option.value = String(i);
          var group = document.querySelectorAll('.group')[i - 1];
          option.textContent = i && group ? Array.from(group.querySelector('h2').childNodes).filter(function (node) { return node.nodeType === 3 || !node.classList.contains('group-toggle'); }).map(function (node) { return node.textContent; }).join('').trim() : button.textContent;
          topic.appendChild(option);
        });
        topic.value = selected || '0';
      }
      label.append(title, topic); chips.before(label);
      chips.hidden = true;
      topic.addEventListener('change', function () { buttons[Number(topic.value)].click(); });
      document.addEventListener('site-language-change', updateTopics);
      updateTopics();
    }
    document.querySelectorAll('[data-scroll]').forEach(function (button) {
      button.addEventListener('click', function () {
        var end = button.dataset.scroll === 'bottom';
        window.siteScroll(end ? document.documentElement.scrollHeight : 0);
        var target = document.querySelector(end ? 'footer' : 'header');
        if (target) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll:true}); }
      });
    });
  });
})();
