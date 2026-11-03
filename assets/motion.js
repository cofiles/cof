(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var nav = document.querySelector('.top nav');
  if (nav) {
    var links = Array.from(nav.querySelectorAll('a'));
    var current = nav.querySelector('[aria-current="page"]');
    function activate(target) {
      links.forEach(function (link) { link.classList.toggle('is-active', link === target); });
    }
    function labels() {
      links.forEach(function (link) { link.setAttribute('aria-label', link.textContent.trim()); link.title = link.textContent.trim(); });
    }
    labels();
    document.addEventListener('site-language-change', labels);
    activate(current);
    links.forEach(function (link) {
      link.addEventListener('focus', function () { activate(link); });
      link.addEventListener('blur', function () { activate(current); });
      link.addEventListener('click', function (event) {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced.matches) return;
        event.preventDefault();
        activate(link);
        window.setTimeout(function () { window.location.assign(link.href); }, 360);
      });
    });
    if (current) current.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  var canvas = document.getElementById('network-orb');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var points = [], width = 0, height = 0, frame = 0, angle = 0, visible = true;
  var lastTime = 0, pitch = .24, zoom = 1, targetZoom = 1, resetting = false, paused = false, dragging = false, vx = 0, vy = 0, pointerX = 0, pointerY = 0, pulse = 0;
  var scene = canvas.closest('.orb-scene');
  function labelsOrb() {
    var en = document.documentElement.lang === 'en';
    canvas.setAttribute('aria-label', en ? 'Interactive sphere. Drag to rotate, use arrow keys and plus or minus to zoom.' : 'Интерактивная сфера. Вращайте перетаскиванием или стрелками, плюс и минус меняют масштаб.');
    scene.querySelector('.orb-hint').textContent = en ? 'Drag to explore · arrow keys to rotate' : 'Потяни, чтобы вращать · управление стрелками';
    var labels = en ? {pause:paused?'Resume rotation':'Pause rotation',out:'Zoom out',in:'Zoom in',reset:'Reset sphere'} : {pause:paused?'Продолжить вращение':'Остановить вращение',out:'Уменьшить',in:'Увеличить',reset:'Сбросить положение'};
    scene.querySelectorAll('[data-orb]').forEach(function(b){b.title=labels[b.dataset.orb];b.setAttribute('aria-label',labels[b.dataset.orb]);if(b.dataset.orb==='pause'){b.textContent=paused?'▷':'Ⅱ';b.setAttribute('aria-pressed',String(paused));}});
  }
  labelsOrb(); document.addEventListener('site-language-change',labelsOrb);
  function changeZoom(delta){targetZoom=Math.max(.65,Math.min(1.25,targetZoom+delta));if(reduced.matches)zoom=targetZoom;draw();}
  scene.querySelectorAll('[data-orb]').forEach(function(button){button.addEventListener('click',function(){
    var action=button.dataset.orb;
    if(action==='pause'){paused=!paused;vx=vy=0;labelsOrb();}
    if(action==='in')changeZoom(.1);
    if(action==='out')changeZoom(-.1);
    if(action==='reset'){targetZoom=1;vx=vy=0;angle=angle%(Math.PI*2);if(angle>Math.PI)angle-=Math.PI*2;if(angle<-Math.PI)angle+=Math.PI*2;resetting=true;if(reduced.matches){angle=0;pitch=.24;zoom=1;resetting=false;}}
    sync();
  });});
  canvas.addEventListener('pointerdown',function(e){if(e.button!==0)return;dragging=true;resetting=false;vx=vy=0;pointerX=e.clientX;pointerY=e.clientY;pulse=1;canvas.setPointerCapture(e.pointerId);canvas.classList.add('is-dragging');draw();});
  canvas.addEventListener('pointermove',function(e){if(!dragging)return;vx=(e.clientX-pointerX)*.006;vy=(e.clientY-pointerY)*.006;angle+=vx;pitch=Math.max(-1.3,Math.min(1.3,pitch+vy));pointerX=e.clientX;pointerY=e.clientY;draw();});
  function release(){dragging=false;canvas.classList.remove('is-dragging');if(reduced.matches)vx=vy=0;}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',function(e){
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=',' '].indexOf(e.key)<0)return;e.preventDefault();
    if(e.key==='ArrowLeft')angle-=.15;if(e.key==='ArrowRight')angle+=.15;
    if(e.key==='ArrowUp')pitch-=.12;if(e.key==='ArrowDown')pitch+=.12;
    if(e.key==='+'||e.key==='=')changeZoom(.1);if(e.key==='-')changeZoom(-.1);
    if(e.key===' '){paused=!paused;labelsOrb();}draw();
  });
  for (var i = 0; i < 150; i++) {
    var y = 1 - 2 * i / 149, radius = Math.sqrt(1 - y * y), phi = i * Math.PI * (3 - Math.sqrt(5));
    points.push([Math.cos(phi) * radius, y, Math.sin(phi) * radius]);
  }
  var edges = [];
  points.forEach(function (p, i) {
    for (var j = i + 1; j < points.length; j++) {
      var q = points[j];
      if (Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]) < .36) edges.push([i,j]);
    }
  });
  function draw() {
    ctx.clearRect(0,0,width,height);
    if(pulse>0&&!reduced.matches){ctx.strokeStyle='rgba(116,255,237,'+(pulse*.5)+')';ctx.lineWidth=1;ctx.beginPath();ctx.arc(width/2,height/2,Math.min(width,height)*(.3+(1-pulse)*.18),0,Math.PI*2);ctx.stroke();}
    var light = document.documentElement.dataset.theme === 'light';
    var rgb = light ? '0,118,111' : '116,255,237';
    var scale = Math.min(width,height) * .30 * zoom;
    var projected = points.map(function (p) {
      var x = p[0]*Math.cos(angle)+p[2]*Math.sin(angle);
      var z = -p[0]*Math.sin(angle)+p[2]*Math.cos(angle);
      var y = p[1]*Math.cos(pitch)-z*Math.sin(pitch);
      z = p[1]*Math.sin(pitch)+z*Math.cos(pitch);
      return [width/2+x*scale,height/2+y*scale,z];
    });
    edges.forEach(function (edge) {
      var a=projected[edge[0]],b=projected[edge[1]];
      ctx.strokeStyle='rgba('+rgb+','+(.09+(a[2]+b[2]+2)*.09)+')';
      ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
    });
    projected.forEach(function (p,i) {
      ctx.fillStyle='rgba('+rgb+','+(.25+(p[2]+1)*.35)+')';
      ctx.beginPath();ctx.arc(p[0],p[1],i%11===0?2.8:1.3,0,Math.PI*2);ctx.fill();
      if(i%11===0&&p[2]>0){ctx.fillStyle='rgba('+rgb+',.1)';ctx.beginPath();ctx.arc(p[0],p[1],7,0,Math.PI*2);ctx.fill();}
    });
  }
  function tick(time) {
    frame=0;
    if(document.hidden||!visible||reduced.matches)return;
    if(time-lastTime>32){zoom+=(targetZoom-zoom)*.18;if(resetting){angle*=.85;pitch+=(.24-pitch)*.15;if(Math.abs(angle)<.002&&Math.abs(pitch-.24)<.002)resetting=false;}if(!dragging&&!resetting){if(!paused){angle+=.003+vx;pitch=Math.max(-1.3,Math.min(1.3,pitch+vy));}vx*=.94;vy*=.94;}pulse=Math.max(0,pulse-.025);draw();lastTime=time;}
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    if(frame)cancelAnimationFrame(frame);frame=0;
    draw();if(!document.hidden&&visible&&!reduced.matches)frame=requestAnimationFrame(tick);
  }
  new ResizeObserver(function () {
    var rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
    width=rect.width;height=rect.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);sync();
  }).observe(canvas);
  new IntersectionObserver(function (entries) {visible=entries[0].isIntersecting;sync();}).observe(canvas);
  new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
})();
