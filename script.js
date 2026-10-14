// Typed headline
const typed = document.getElementById('typed');
if (typed) {
  const text = "hi, i'm kara";
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    typed.textContent = text;
  } else {
    let i = 0;
    const type = () => {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 90 + Math.random() * 110);
    };
    setTimeout(type, 600);
  }
}

// Animated headline words (used on case study pages)
document.querySelectorAll('.split').forEach(el => {
  el.innerHTML = el.textContent.split(' ')
    .map((w, i) => `<span class="w" style="animation-delay:${i * 0.06}s">${w}</span>`)
    .join(' ');
});

// Scroll reveal + count-up
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    const n = e.target.querySelector('[data-count]');
    if (n) countUp(n);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

function countUp(el) {
  const target = +el.dataset.count;
  const start = performance.now();
  const tick = t => {
    const p = Math.min((t - start) / 1200, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Scroll progress bar
const bar = document.querySelector('.progress');
if (bar) addEventListener('scroll', () => {
  bar.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
});

// Case study side navigation
const cs = document.querySelector('.cs');
if (cs) {
  const heads = [...cs.querySelectorAll('h2')];
  if (heads.length) {
    const toc = document.createElement('aside');
    toc.className = 'toc';
    toc.innerHTML = '<div class="links">' + heads.map((h, i) => {
      h.id = h.id || 'sec-' + i;
      return `<a href="#${h.id}">${h.textContent}</a>`;
    }).join('') + '</div>';
    const top = document.createElement('div');
    top.className = 'toc-top';
    const btn = document.createElement('button');
    btn.className = 'toc-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-controls', 'toc-links');
    const setOpen = open => {
      toc.classList.toggle('closed', !open);
      cs.classList.toggle('toc-closed', !open);
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Collapse sections' : 'Expand sections');
      const frame = '<rect x="1.5" y="2.5" width="13" height="11" rx="2"/><path d="M6 2.5v11"/>';
      const arrow = open ? '<path d="M11 6l-2 2 2 2"/>' : '<path d="M9 6l2 2-2 2"/>';
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${frame}${arrow}</svg>`;
      localStorage.setItem('toc-open', open ? '1' : '0');
    };
    btn.onclick = () => setOpen(toc.classList.contains('closed'));
    top.append(btn);
    const orig = cs.querySelector('.back');
    if (orig) {
      const nb = document.createElement('a');
      nb.className = 'pane-back';
      nb.href = orig.getAttribute('href');
      nb.title = 'All work';
      nb.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4"/></svg><span>All work</span>';
      top.prepend(nb);
    }
    toc.prepend(top);
    toc.querySelector('.links').id = 'toc-links';
    setOpen(localStorage.getItem('toc-open') !== '0');
    cs.prepend(toc);
    const links = [...toc.querySelectorAll('.links a')];
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.hash === '#' + e.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach(h => spy.observe(h));
  }
}

const cursor = document.querySelector('.cursor');
if (cursor) {
  addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a,.case').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });
}

// 3D tilt on project thumbnails
document.querySelectorAll('.tilt').forEach(card => {
  const thumb = card.querySelector('.thumb');
  card.addEventListener('mousemove', e => {
    const r = thumb.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    thumb.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => thumb.style.transform = '');
});

// Typed-in captions on the About photo circles
document.querySelectorAll('.snap').forEach(function(snap){
  var tp=snap.querySelector('textPath'); if(!tp) return;
  var full=tp.textContent, timer;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;
  function center(){ var p=snap.querySelector('path'); tp.textContent=full; tp.setAttribute('text-anchor','start'); tp.setAttribute('startOffset',Math.max(0,(p.getTotalLength()-tp.getComputedTextLength())/2)); tp.textContent=''; }
  (document.fonts?document.fonts.ready:Promise.resolve()).then(center);
  function type(){
    clearInterval(timer); var i=0; tp.textContent='';
    timer=setInterval(function(){
      i++; tp.textContent=full.slice(0,i);
      if(i>=full.length) clearInterval(timer);
    },40);
  }
  function reset(){ clearInterval(timer); tp.textContent=''; }
  snap.addEventListener('mouseenter',type);
  snap.addEventListener('mouseleave',reset);
  snap.addEventListener('focusin',type);
  snap.addEventListener('focusout',reset);
});

(function(){var cv=document.querySelector('.mb-canvas');if(!cv)return;var k=cv.querySelector('.c3');var drift=[['21%','62%'],['30%','45%'],['58%','70%'],['40%','28%']];
cv.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();cv.classList.add('live');k.style.left=((e.clientX-r.left)/r.width*100)+'%';k.style.top=((e.clientY-r.top)/r.height*100)+'%';});
cv.addEventListener('mouseleave',function(){cv.classList.remove('live');});})();

(function(){document.querySelectorAll('.dive').forEach(function(d){var ds=[].slice.call(d.querySelectorAll(':scope>details'));if(!ds.length)return;
var nav=document.createElement('div');nav.className='dv-nav';var pl=document.createElement('span');pl.className='plane';pl.innerHTML='<svg viewBox="0 0 24 24" fill="#ff6a00"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)"/></svg>';nav.setAttribute('role','tablist');
function go(i){pl.style.left=(i<0?2:((i+.5)*100/ds.length))+'%';pl.classList.remove('fly');void pl.offsetWidth;pl.classList.add('fly');ds.forEach(function(x,j){x.classList.toggle('act',j===i);x.open=j===i;});[].slice.call(nav.children).forEach(function(b,j){b.classList.toggle('on',j===i);b.classList.toggle('past',j<i);b.setAttribute('aria-selected',j===i);});}
ds.forEach(function(x,i){var s=x.querySelector('summary'),b=document.createElement('button');b.setAttribute('role','tab');
b.innerHTML='<span class="n">'+s.querySelector('.st-n').textContent+'</span><b>'+s.querySelector('.st-t b').textContent+'</b><em>'+s.querySelector('.st-t em').textContent+'</em>';
b.addEventListener('click',function(){go(i)});nav.appendChild(b);});
nav.appendChild(pl);d.insertBefore(nav,d.firstChild);d.classList.add('tabbed');go(-1);});})();
