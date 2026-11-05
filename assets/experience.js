/* Scroll-driven light, tactile glass and functional collection exploration. */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
  function mix(a,b,t){return a+(b-a)*t;}
  function smooth(t){return t*t*(3-2*t);}
  function words(ru,en){return document.documentElement.lang==='en'?en:ru;}

  document.addEventListener('DOMContentLoaded',function(){
    // Shared, bounded reactions: no pointer handlers on thousands of catalog records.
    document.querySelectorAll('.home-grid .card,.flow-panel,[data-tilt]').forEach(function(card){
      var pending=0, px=.5,py=.5;
      function render(){pending=0;card.style.setProperty('--tilt-x',((.5-py)*5)+'deg');card.style.setProperty('--tilt-y',((px-.5)*7)+'deg');card.style.setProperty('--shine-x',(px*100)+'%');card.style.setProperty('--shine-y',(py*100)+'%');}
      card.classList.add('tactile');
      card.addEventListener('pointermove',function(e){if(!fine.matches||reduced.matches||document.body.classList.contains('motion-paused'))return;var r=card.getBoundingClientRect();px=clamp((e.clientX-r.left)/r.width,0,1);py=clamp((e.clientY-r.top)/r.height,0,1);if(!pending)pending=requestAnimationFrame(render);});
      function reset(){cancelAnimationFrame(pending);pending=0;px=py=.5;render();}
      card.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);
    });
    document.querySelectorAll('.hero-actions .btn,.console-bottom .btn,.motion-toggle').forEach(function(button){
      button.addEventListener('pointermove',function(e){if(!fine.matches||reduced.matches||document.body.classList.contains('motion-paused'))return;var r=button.getBoundingClientRect();button.style.translate=clamp((e.clientX-r.left-r.width/2)*.12,-7,7)+'px '+clamp((e.clientY-r.top-r.height/2)*.15,-5,5)+'px';});
      function reset(){button.style.translate='0px 0px';}button.addEventListener('pointerleave',reset);button.addEventListener('blur',reset);reduced.addEventListener('change',reset);
    });
    var nav=document.querySelector('.top nav');
    if(nav){
      var lens=document.createElement('span');lens.className='nav-tracker';lens.setAttribute('aria-hidden','true');nav.prepend(lens);
      var active=nav.querySelector('[aria-current="page"]'),target=active;
      function positionLens(){if(!target)return; lens.style.width=target.offsetWidth+'px';lens.style.height=target.offsetHeight+'px';lens.style.transform='translate('+target.offsetLeft+'px,'+target.offsetTop+'px)';}
      nav.querySelectorAll('a').forEach(function(link){link.addEventListener('pointerenter',function(){target=link;positionLens();});link.addEventListener('focus',function(){target=link;positionLens();});});
      nav.addEventListener('pointerleave',function(){target=nav.contains(document.activeElement)&&document.activeElement.matches('a')?document.activeElement:active;positionLens();});
      nav.addEventListener('focusout',function(){requestAnimationFrame(function(){if(!nav.contains(document.activeElement)){target=active;positionLens();}});});
      new ResizeObserver(positionLens).observe(nav);nav.querySelectorAll('a').forEach(function(link){new ResizeObserver(positionLens).observe(link);});positionLens();
    }

    var canvas=document.getElementById('light-stream');if(!canvas)return;
    var ctx=canvas.getContext('2d');if(!ctx)return;
    // Move outside the hero's transformed/isolated stacking context. Only viewport pixels are allocated.
    document.body.prepend(canvas);canvas.classList.add('page-stream');
    var sections=Array.from(document.querySelectorAll('#intro,#journey,#explore'));
    var sectionLinks=Array.from(document.querySelectorAll('.scene-nav a'));
    var panel=document.querySelector('.flow-panel'),heroCopy=document.querySelector('.hero-copy');
    var sceneStops=[],stepStops=[],maxScroll=1,w=0,h=0,frame=0,last=0,phase=0,paused=false;
    var scrollTarget=scrollY,scrollCurrent=scrollY,pointer={x:0,y:0,tx:0,ty:0},velocity=0,lastScroll=scrollY;
    var routeIndex=0,routePulse=0,manualRouteAt=null,currentScene=-1,flowIndex=-1;
    var pauses=Array.from(document.querySelectorAll('.motion-toggle'));
    var flowNodes=Array.from(document.querySelectorAll('.flow-node'));
    var flowRows=Array.from(document.querySelectorAll('.flow-log>div'));
    var routeTabs=Array.from(document.querySelectorAll('.route-tabs [role="tab"]'));
    var routeSteps=Array.from(document.querySelectorAll('.journey-step'));
    var routeView=document.querySelector('#route-view'),routeConsole=document.querySelector('.route-console');
    var routes=[
      {id:'tools',title:['Инструменты под задачу','Tools for the task'],description:['От загрузочной флешки до рабочего окружения.','From a bootable drive to your workspace.'],chips:['Rufus','Ventoy','balenaEtcher'],count:'35 035',label:'TOOLS / COLLECTION',symbol:'↗'},
      {id:'python',title:['Твоё окружение. Твои правила.','Your environment. Your rules.'],description:['Выбери зависимости и собери requirements.txt в один файл.','Select dependencies and build your requirements.txt.'],chips:['requests','numpy','Flask'],count:'35 035',label:'PYTHON / REQUIREMENTS',symbol:'⌘'},
      {id:'repos',title:['Следующая идея — открыта.','Your next idea is open.'],description:['Исследуй проекты, изучай код и находи основу для своего.','Explore projects, study code and find your starting point.'],chips:['Open source','GitHub','17 017'],count:'17 017',label:'GITHUB / DISCOVER',symbol:'⑂'}
    ];
    var viewAnimation=null;
    function selectRoute(index,manual,animate){
      if(!routeView)return;
      var changed=routeIndex!==index;routeIndex=index;var route=routes[index],lang=document.documentElement.lang==='en'?1:0;
      if(manual)manualRouteAt=scrollY;
      routeTabs.forEach(function(tab,i){tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
      routeSteps.forEach(function(step,i){step.classList.toggle('is-current',i===index);step.setAttribute('aria-pressed',String(i===index));});
      routeView.setAttribute('aria-labelledby','route-tab-'+route.id);routeConsole.dataset.route=route.id;
      routeConsole.style.setProperty('--route-index',index);
      routeConsole.querySelector('.route-number').textContent='0'+(index+1)+' / 03';
      routeConsole.querySelector('.route-title').textContent=route.title[lang];routeConsole.querySelector('.route-description').textContent=route.description[lang];
      routeConsole.querySelector('.route-kicker').textContent=route.label;routeConsole.querySelector('.route-core').textContent=route.symbol;
      routeConsole.querySelectorAll('.route-chips span').forEach(function(chip,i){chip.textContent=route.chips[i];});
      routeConsole.querySelector('.route-count').textContent=route.count+words(' записей',' entries');routeConsole.querySelector('.route-link').href=route.id+'.html';
      if(changed){routePulse=1;if(animate&&!reduced.matches&&!paused){if(viewAnimation)viewAnimation.cancel();viewAnimation=routeView.animate([{opacity:.25,transform:'translateY(12px) scale(.98)'},{opacity:1,transform:'none'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});}}
    }
    routeTabs.forEach(function(tab,i){
      tab.addEventListener('click',function(){selectRoute(i,true,true);});
      tab.addEventListener('keydown',function(e){var next=i;if(e.key==='ArrowRight')next=(i+1)%3;else if(e.key==='ArrowLeft')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();selectRoute(next,true,true);routeTabs[next].focus();});
    });
    routeSteps.forEach(function(step,i){step.addEventListener('click',function(){selectRoute(i,true,true);if(innerWidth<=760){var top=routeConsole.getBoundingClientRect().top+scrollY-22;window.siteScroll(top);}});});
    document.addEventListener('site-language-change',function(){selectRoute(routeIndex,false,false);pauseLabels();});selectRoute(0,false,false);
    if(routeConsole)new IntersectionObserver(function(entries){routeConsole.classList.toggle('scene-asleep',!entries[0].isIntersecting);}).observe(routeConsole);

    // Diagram has real, bounded pan/zoom and never captures gestures starting on links.
    var map=document.querySelector('.flow-map'),mapContent=document.querySelector('.flow-map-content');
    var mapX=0,mapY=0,zoom=1,drag=null;
    function renderMap(){mapContent.style.transform='translate('+mapX+'px,'+mapY+'px) scale('+zoom+')';document.querySelector('.map-scale').textContent=Math.round(zoom*100)+'%';}
    map.addEventListener('pointerdown',function(e){if(e.button!==0||e.target.closest('a,button'))return;drag={id:e.pointerId,x:e.clientX-mapX,y:e.clientY-mapY};map.setPointerCapture(e.pointerId);map.classList.add('is-dragging');});
    map.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;mapX=clamp(e.clientX-drag.x,-65,65);mapY=clamp(e.clientY-drag.y,-35,35);renderMap();});
    function release(){drag=null;map.classList.remove('is-dragging');}
    map.addEventListener('pointerup',release);map.addEventListener('pointercancel',release);map.addEventListener('lostpointercapture',release);
    function mapAction(action){if(action==='in')zoom=clamp(zoom+.1,.8,1.4);if(action==='out')zoom=clamp(zoom-.1,.8,1.4);if(action==='reset'){zoom=1;mapX=mapY=0;}renderMap();}
    document.querySelectorAll('[data-map]').forEach(function(button){button.addEventListener('click',function(){mapAction(button.dataset.map);});});
    map.addEventListener('keydown',function(e){if(e.target!==map)return;if(e.key==='ArrowLeft')mapX=clamp(mapX-10,-65,65);else if(e.key==='ArrowRight')mapX=clamp(mapX+10,-65,65);else if(e.key==='ArrowUp')mapY=clamp(mapY-10,-35,35);else if(e.key==='ArrowDown')mapY=clamp(mapY+10,-35,35);else if(e.key==='+'||e.key==='=')mapAction('in');else if(e.key==='-')mapAction('out');else if(e.key==='Home'||e.key==='Escape')mapAction('reset');else return;e.preventDefault();renderMap();});
    mapContent.addEventListener('focusin',function(e){var node=e.target.closest('.flow-node');if(node)node.scrollIntoView({block:'nearest',inline:'nearest'});});
    var focusedFlow=-1;
    flowNodes.forEach(function(node,i){function enter(){focusedFlow=i;updateFlow(i);}function leave(){focusedFlow=-1;}node.addEventListener('pointerenter',enter);node.addEventListener('pointerleave',leave);node.addEventListener('focus',enter);node.addEventListener('blur',leave);});
    function updateFlow(index){if(flowIndex===index)return;flowIndex=index;flowNodes.forEach(function(node,i){node.classList.toggle('is-flowing',i===index);});flowRows.forEach(function(row,i){row.classList.toggle('is-flowing',i===(index+2)%3);});}

    // One scene timeline is shared by the light, section dots and hero parallax.
    function measure(){
      maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      sceneStops=sections.map(function(section,i){return i===0?0:Math.max(0,section.getBoundingClientRect().top+scrollY-innerHeight*.28);});
      stepStops=routeSteps.map(function(step){return step.getBoundingClientRect().top+scrollY-innerHeight*.55;});
    }
    var measureFrame=0;
    function scheduleMeasure(){if(!measureFrame)measureFrame=requestAnimationFrame(function(){measureFrame=0;measure();});}
    new ResizeObserver(scheduleMeasure).observe(document.querySelector('main'));
    addEventListener('scroll',function(){scrollTarget=clamp(scrollY,0,maxScroll);velocity=clamp((scrollY-lastScroll)/100,-1,1);lastScroll=scrollY;if(reduced.matches||paused)updateSections();},{passive:true});
    addEventListener('pointermove',function(e){if(!fine.matches||reduced.matches||paused)return;pointer.tx=e.clientX/innerWidth-.5;pointer.ty=e.clientY/innerHeight-.5;},{passive:true});
    document.documentElement.addEventListener('pointerleave',function(){pointer.tx=pointer.ty=0;});
    document.querySelectorAll('a[href^="#"]').forEach(function(link){link.addEventListener('click',function(e){if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var id=link.getAttribute('href').slice(1),target=document.getElementById(id);if(!target)return;e.preventDefault();var header=document.querySelector('.top'),offset=getComputedStyle(header).position==='sticky'?header.getBoundingClientRect().height+24:25;window.siteScroll(target.getBoundingClientRect().top+scrollY-offset);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});history.replaceState(null,'','#'+id);});});
    function updateSections(){
      var selected=0;sceneStops.forEach(function(stop,i){if(scrollY>=stop-80)selected=i;});
      if(selected!==currentScene){currentScene=selected;sectionLinks.forEach(function(link,i){if(i===selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});document.body.dataset.scene=String(selected);}
      if(manualRouteAt!==null&&Math.abs(scrollY-manualRouteAt)>160)manualRouteAt=null;
      if(innerWidth>760&&manualRouteAt===null&&routeSteps.length&&!routeConsole.contains(document.activeElement)){
        var active=0;stepStops.forEach(function(stop,i){if(scrollY>stop)active=i;});if(active!==routeIndex)selectRoute(active,false,true);
      }
    }
    function sceneProgress(){
      var stops=[0,sceneStops[1],sceneStops[2],maxScroll];
      for(var end=1;end<stops.length;end++){
        if(scrollCurrent<=stops[end]){
          var length=Math.max(1,stops[end]-stops[end-1]);
          return end-1+clamp((scrollCurrent-stops[end-1])/length,0,1);
        }
      }
      return stops.length-1;
    }
    var beam={bend:.43,mirror:0,cy:.55,spread:1,twist:0,alpha:1};
    var keyframes=[
      {bend:.43,mirror:0,cy:.55,spread:1,twist:0,alpha:1},
      {bend:.67,mirror:1,cy:.37,spread:1.5,twist:.12,alpha:.9},
      {bend:.28,mirror:0,cy:.62,spread:1.9,twist:-.13,alpha:.65},
      {bend:.78,mirror:.91,cy:.82,spread:1.15,twist:.18,alpha:.84}
    ];
    function updateBeam(){
      var progress=reduced.matches?0:sceneProgress();
      var index=Math.min(keyframes.length-2,Math.floor(progress));
      var blend=smooth(progress-index);
      Object.keys(beam).forEach(function(key){
        beam[key]=mix(keyframes[index][key],keyframes[index+1][key],blend);
      });
    }
    var strands=46;
    function curve(t,strand){
      var a=strand/(strands-1),spread=a-.5;
      var direction=1-beam.mirror*2;
      var px=beam.bend+direction*.62*Math.pow(Math.abs(2*t-1),1.65);
      var py=beam.cy+(t-.5)*1.45;
      px+=spread*(.035+.13*Math.abs(2*t-1))*beam.spread+Math.sin(t*Math.PI*2)*beam.twist;
      px+=pointer.x*.045+Math.sin(phase*.3)*.009;
      py+=spread*.16*Math.sin(Math.PI*t)+pointer.y*.025+Math.sin(t*11+phase+a*5)*.008*Math.sin(Math.PI*t);
      return [px*w,py*h];
    }
    function stroke(strand,width,alpha){
      ctx.beginPath();for(var k=0;k<=64;k++){var p=curve(k/64,strand);if(k)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);}
      var grad=ctx.createLinearGradient(beam.bend*w,beam.cy*h,w,h*.05);
      grad.addColorStop(0,'rgba(230,255,169,'+alpha+')');grad.addColorStop(.42,'rgba(175,221,83,'+(alpha*.7)+')');grad.addColorStop(1,'rgba(99,163,186,'+(alpha*.4)+')');ctx.strokeStyle=grad;ctx.lineWidth=width;ctx.stroke();
    }
    function draw(){
      if(!w||!h)return;updateBeam();ctx.clearRect(0,0,w,h);
      var light=document.documentElement.dataset.theme==='light';
      ctx.globalAlpha=beam.alpha*(light?.62:1);
      var cx=beam.bend*w,cy=beam.cy*h;
      var glow=ctx.createRadialGradient(cx,cy,0,cx,cy,w*.44);glow.addColorStop(0,'rgba(174,207,66,.23)');glow.addColorStop(.35,'rgba(128,164,44,.075)');glow.addColorStop(1,'rgba(100,140,30,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
      ctx.globalCompositeOperation=light?'source-over':'screen';
      ctx.filter='blur(18px)';stroke(strands*.5,38,.20);ctx.filter='blur(5px)';stroke(strands*.5,12,.35);ctx.filter='none';
      for(var j=0;j<strands;j++)stroke(j,j%9===0?1.5:.65,(.12+(Math.sin(j*12.3)*.5+.5)*.42)*(1+routePulse*.3));
      for(var z=0;z<26;z++){var t=(phase*.042+z*.0384)%1,p=curve(t,(z*17)%strands);ctx.beginPath();ctx.arc(p[0],p[1],z%4===0?1.8:.8,0,Math.PI*2);ctx.fillStyle='rgba(235,255,192,.85)';ctx.fill();}
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    }
    function pauseLabels(){pauses.forEach(function(button){button.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?words('Продолжить анимацию','Resume animation'):words('Остановить анимацию','Pause animation'));});}
    pauses.forEach(function(button){button.addEventListener('click',function(){paused=!paused;document.body.classList.toggle('motion-paused',paused);pauseLabels();if(paused){document.querySelectorAll('.tactile').forEach(function(card){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});}sync();});});
    function tick(now){frame=0;if(document.hidden||paused||reduced.matches)return;if(now-last>=32){var dt=Math.min((now-last)/1000,.06);last=now;phase+=dt*(1+Math.abs(velocity)*.8);velocity*=.88;routePulse*=.92;scrollCurrent=mix(scrollCurrent,scrollTarget,.13);pointer.x=mix(pointer.x,pointer.tx,.08);pointer.y=mix(pointer.y,pointer.ty,.08);draw();updateSections();if(focusedFlow<0)updateFlow(Math.floor(phase*.8)%4);
      var leave=clamp(scrollCurrent/Math.max(h,1),0,1);heroCopy.style.setProperty('--scroll-lift',(-leave*38)+'px');panel.style.setProperty('--scroll-lift',(-leave*65)+'px');
    }frame=requestAnimationFrame(tick);}
    function sync(){cancelAnimationFrame(frame);frame=0;last=performance.now();if(reduced.matches){scrollCurrent=0;pointer.x=pointer.y=pointer.tx=pointer.ty=0;heroCopy.style.setProperty('--scroll-lift','0px');panel.style.setProperty('--scroll-lift','0px');}draw();updateSections();if(!document.hidden&&!paused&&!reduced.matches)frame=requestAnimationFrame(tick);}
    function size(){var rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);w=rect.width;h=rect.height;strands=w<600?30:46;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);measure();scrollTarget=clamp(scrollY,0,maxScroll);sync();}
    new ResizeObserver(size).observe(canvas);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    measure();pauseLabels();updateFlow(0);
  });
})();
