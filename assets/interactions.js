(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  var ease = 'cubic-bezier(.22,1,.36,1)';
  function animate(node, frames, options) {
    if (!node || reduced.matches || !node.animate) return;
    return node.animate(frames, Object.assign({duration:420,easing:ease}, options));
  }
  var scrollFrame = 0;
  function stopScroll() { cancelAnimationFrame(scrollFrame); }
  window.siteScroll = function (target) {
    stopScroll();
    var start=scrollY, end=Math.max(0,Math.min(target,document.documentElement.scrollHeight-innerHeight));
    if(reduced.matches){scrollTo(0,end);return;}
    var time=performance.now(), duration=Math.min(1100,450+Math.abs(end-start)*.045);
    function step(now){var p=Math.min(1,(now-time)/duration),v=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;scrollTo(0,start+(end-start)*v);if(p<1)scrollFrame=requestAnimationFrame(step);}
    scrollFrame=requestAnimationFrame(step);
  };
  ['wheel','touchstart','keydown'].forEach(function(type){addEventListener(type,stopScroll,{passive:true});});
  document.addEventListener('DOMContentLoaded', function () {
    var main=document.querySelector('main');
    animate(main,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:560});
    var progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
    var progressPending=false;
    function updateProgress(){progressPending=false;var max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')';}
    addEventListener('scroll',function(){if(!progressPending){progressPending=true;requestAnimationFrame(updateProgress);}},{passive:true});
    addEventListener('resize',updateProgress);new ResizeObserver(updateProgress).observe(document.body);updateProgress();

    // Observe only rendered cards; off-screen content never runs animations.
    var reveal=new IntersectionObserver(function(entries){
      var stagger=0;
      entries.forEach(function(entry){if(!entry.isIntersecting)return;reveal.unobserve(entry.target);animate(entry.target,[{opacity:0,transform:'translateY(18px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:480,delay:Math.min(stagger++*30,150)});});
    },{threshold:.06});
    document.querySelectorAll('.list .item').forEach(function(item){reveal.observe(item);});
    document.querySelectorAll('.list').forEach(function(list){
      new MutationObserver(function(records){records.forEach(function(record){record.removedNodes.forEach(function(node){if(node.nodeType===1)reveal.unobserve(node);});record.addedNodes.forEach(function(node){if(node.nodeType===1&&node.matches('.item'))reveal.observe(node);});});}).observe(list,{childList:true});
    });

    document.addEventListener('pointermove',function(event){
      if(!fine.matches||reduced.matches)return;
      var card=event.target.closest('.item.card,.panel');if(!card)return;
      var rect=card.getBoundingClientRect();card.style.setProperty('--pointer-x',(event.clientX-rect.left)+'px');card.style.setProperty('--pointer-y',(event.clientY-rect.top)+'px');
    },{passive:true});
    document.addEventListener('pointerdown',function(event){
      var button=event.target.closest('.btn,.chip,.scroll-controls button,.top nav a,.group-toggle');
      if(!button||button.disabled||reduced.matches)return;
      var rect=button.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='click-ripple';ripple.setAttribute('aria-hidden','true');ripple.style.left=(event.clientX-rect.left)+'px';ripple.style.top=(event.clientY-rect.top)+'px';button.append(ripple);
      var a=animate(ripple,[{transform:'translate(-50%,-50%) scale(0)',opacity:.35},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:620});
      if(a)a.finished.then(function(){ripple.remove();}).catch(function(){ripple.remove();});else ripple.remove();
    });
    document.addEventListener('change',function(event){
      if(event.target.matches('.pkg')){
        var item=event.target.closest('.item');animate(item,[{transform:'scale(.985)'},{transform:'scale(1)'}],{duration:320});
      }
      if(event.target.matches('select,#popular-only'))animate(document.querySelector('#count'),[{opacity:.2,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}]);
    });
    var count=document.getElementById('req-count');
    if(count)new MutationObserver(function(){animate(count,[{color:'var(--accent)',transform:'scale(1.04)'},{color:'var(--muted)',transform:'scale(1)'}]);}).observe(count,{childList:true});

    // Native controls keep their keyboard behavior; theme changes get a crossfade.
    var theme=document.getElementById('site-theme'),changingTheme=false;
    if(theme)theme.addEventListener('click',function(event){
      if(changingTheme||reduced.matches||!document.startViewTransition)return;
      event.stopImmediatePropagation();changingTheme=true;
      try{document.startViewTransition(function(){theme.click();changingTheme=false;});}catch(_){theme.click();changingTheme=false;}
    },true);
    document.addEventListener('site-language-change',function(){animate(main,[{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:330});updateToggleLabels();});

    var toggles=[];
    document.querySelectorAll('.group').forEach(function(group){
      var heading=group.querySelector('h2');if(!heading)return;
      var button=document.createElement('button');button.type='button';button.className='group-toggle';button.setAttribute('aria-expanded','true');
      var body=document.createElement('div');body.className='group-body';body.id='group-body-'+toggles.length;
      var inner=document.createElement('div');inner.className='group-inner';
      while(heading.nextSibling)inner.append(heading.nextSibling);
      body.append(inner);group.append(body);heading.append(button);button.setAttribute('aria-controls',body.id);
      toggles.push(button);
      button.addEventListener('click',function(){
        var open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));body.classList.toggle('is-collapsed',open);inner.inert=open;updateToggleLabels();
      });
    });
    function updateToggleLabels(){toggles.forEach(function(button){var expanded=button.getAttribute('aria-expanded')==='true';button.textContent=expanded?'−':'+';button.setAttribute('aria-label',document.documentElement.lang==='en'?(expanded?'Collapse group':'Expand group'):(expanded?'Свернуть группу':'Развернуть группу'));button.title=button.getAttribute('aria-label');});}
    updateToggleLabels();
    // A new filter should expose its results, including previously collapsed groups.
    ['search','topic-select','popular-only'].forEach(function(id){var input=document.getElementById(id);if(input)input.addEventListener(id==='search'?'input':'change',function(){toggles.forEach(function(button){if(button.getAttribute('aria-expanded')==='false')button.click();});});});
    document.addEventListener('keydown',function(event){
      var typing=event.target.matches('input,textarea,select,[contenteditable=true]');
      var search=document.getElementById('search');
      if(event.key==='/'&&!typing&&search&&!event.metaKey&&!event.ctrlKey&&!event.altKey){event.preventDefault();search.focus();search.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});}
      if(event.key==='Escape'&&event.target===search){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
    });
    var navigating=false;
    document.addEventListener('click',function(event){
      var link=event.target.closest('a[href]');
      if(!link||event.defaultPrevented||event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
      var url=new URL(link.href,location.href);
      if(url.origin!==location.origin||!url.pathname.endsWith('.html')||url.hash||reduced.matches)return;
      event.preventDefault();if(navigating)return;navigating=true;
      if(document.startViewTransition){location.assign(url.href);return;}
      var animation=animate(main,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-10px)'}],{duration:180,fill:'forwards'});
      if(animation)animation.finished.then(function(){location.assign(url.href);});else location.assign(url.href);
    });
    addEventListener('pageshow',function(event){navigating=false;if(event.persisted&&main)main.getAnimations().forEach(function(a){a.cancel();});});
  });
})();
