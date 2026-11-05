(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function text(ru, en) { return document.documentElement.lang === 'en' ? en : ru; }

  document.addEventListener('DOMContentLoaded', function () {
    // Preserve existing filtering listeners and IDs when adding Focus Morph.
    var input = document.getElementById('search');
    if (input) {
      var toolbar = input.closest('.toolbar');
      var morph = toolbar.closest('.search-morph');
      if (!morph) {
        var heading = document.querySelector('main > h1');
        morph = document.createElement('div'); morph.className = 'search-morph';
        var intro = document.createElement('div'); intro.className = 'search-intro';
        var inner = document.createElement('div'); inner.className = 'search-intro-inner';
        if (heading && heading.parentElement === toolbar.parentElement) {
          heading.before(morph);
          while (morph.nextSibling && morph.nextSibling !== toolbar) inner.append(morph.nextSibling);
        } else toolbar.before(morph);
        intro.append(inner); morph.append(intro, toolbar);
      }
      var field = document.createElement('div'); field.className = 'search-field';
      input.before(field); field.append(input);
      var cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'search-cancel'; cancel.tabIndex = -1;
      toolbar.append(cancel);
      var introBlock = morph.querySelector('.search-intro');
      function setSearching(on) {
        morph.classList.toggle('is-searching', on);
        cancel.tabIndex = on ? 0 : -1;
        cancel.setAttribute('aria-hidden', String(!on));
        if (introBlock) introBlock.inert = on;
      }
      function resetSearch() {
        input.value = ''; input.dispatchEvent(new Event('input', {bubbles:true}));
        setSearching(false);
        input.blur();
        var title = morph.querySelector('h1,h2');
        if (title) {title.tabIndex = -1; title.focus({preventScroll:true});}
      }
      input.addEventListener('focus', function () { setSearching(true); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Escape') {e.preventDefault(); resetSearch();} });
      cancel.addEventListener('click', resetSearch);
      morph.addEventListener('focusout', function () {
        requestAnimationFrame(function () { if (!morph.contains(document.activeElement) && !input.value) setSearching(false); });
      });
      var cards = Array.from(document.querySelectorAll('.home-grid .item'));
      function filterHome() {
        if (!cards.length) return;
        var q = input.value.trim().toLocaleLowerCase();
        cards.forEach(function (card) {card.hidden = !card.textContent.toLocaleLowerCase().includes(q);});
        var found = cards.filter(function (card) {return !card.hidden;}).length;
        document.getElementById('home-search-status').textContent = q ? (found ? text('Разделов найдено: ', 'Sections found: ') + found : text('Ничего не найдено. Попробуй «Python» или «Файлы».', 'No results. Try “Python” or “Files”.')) : '';
      }
      input.addEventListener('input', filterHome);
      function labels() {cancel.textContent = text('Отмена', 'Cancel'); filterHome();}
      document.addEventListener('site-language-change', labels); labels(); setSearching(false);
    }

    // Refraction is progressive enhancement; standard blur works without SVG backdrop support.
    var lensCanvas = document.createElement('canvas'); lensCanvas.width = lensCanvas.height = 128;
    var lensCtx = lensCanvas.getContext('2d');
    if (lensCtx) {
      var pixels = lensCtx.createImageData(128,128);
      for (var y=0;y<128;y++) for(var x=0;x<128;x++) {
        var nx=(x-63.5)/63.5, ny=(y-63.5)/63.5;
        var r=Math.max(Math.abs(nx),Math.abs(ny)), edge=Math.pow(Math.max(0,(r-.65)/.35),2);
        var i=(y*128+x)*4;
        pixels.data[i]=128+nx*edge*100; pixels.data[i+1]=128+ny*edge*100; pixels.data[i+2]=128; pixels.data[i+3]=255;
      }
      lensCtx.putImageData(pixels,0,0);
      var ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg');
      svg.setAttribute('width','0'); svg.setAttribute('height','0'); svg.setAttribute('aria-hidden','true'); svg.style.position='absolute';
      var defs=document.createElementNS(ns,'defs'), filter=document.createElementNS(ns,'filter');
      filter.id='liquid-lens'; filter.setAttribute('x','0%'); filter.setAttribute('y','0%'); filter.setAttribute('width','100%');filter.setAttribute('height','100%');filter.setAttribute('color-interpolation-filters','sRGB');
      var map=document.createElementNS(ns,'feImage');map.setAttribute('href',lensCanvas.toDataURL());map.setAttribute('width','100%');map.setAttribute('height','100%');map.setAttribute('preserveAspectRatio','none');map.setAttribute('result','lens-map');
      var displacement=document.createElementNS(ns,'feDisplacementMap');displacement.setAttribute('in','SourceGraphic');displacement.setAttribute('in2','lens-map');displacement.setAttribute('scale','9');displacement.setAttribute('xChannelSelector','R');displacement.setAttribute('yChannelSelector','G');
      filter.append(map,displacement);defs.append(filter);svg.append(defs);document.body.append(svg);
      if (CSS.supports('backdrop-filter','url("#liquid-lens")')) document.documentElement.classList.add('has-refraction');
      document.querySelectorAll('.top nav,.site-settings .chip,.search-field,.scroll-controls').forEach(function (control) {
        var layer=document.createElement('span');layer.className='lens-layer';layer.setAttribute('aria-hidden','true');control.prepend(layer);
      });
    }

  });
})();
