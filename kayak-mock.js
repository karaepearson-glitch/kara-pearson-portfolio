(function () {
  var ws;
  function fit() {
    ws.forEach(function (w) {
      var s = w.clientWidth / 1000;
      w.querySelectorAll('.kx').forEach(function (k) { k.style.transform = 'scale(' + s + ')'; });
    });
  }

  var hero = document.querySelector('.hero-pf .kxw');
  var src = document.querySelectorAll('.walk .wfr .kx');
  var steps = [
    ['Start a trip', 380, 263],
    ['Invite', 692, 451],
    ['Overview', 149, 159],
    ['Location', 929, 286],
    ['Dates', 940, 234],
    ['Budget', 142, 452],
    ['Itinerary', 467, 197],
    ['Add activity', 380, 283]
  ];

  if (hero && src.length === steps.length) {
    hero.classList.add('tour');
    hero.setAttribute('aria-label', 'Animated walkthrough of the KAYAK trip planning screens');
    hero.innerHTML = '';
    var layers = [];
    src.forEach(function (k) {
      var c = k.cloneNode(true);
      c.classList.add('tl');
      hero.appendChild(c);
      layers.push(c);
    });
    var cur = document.createElement('div');
    cur.className = 'tcur';
    cur.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 2l14 9-6.2 1.4L16 20l-3 1.2-3.2-7.6L5 17z" fill="#192024" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><i></i>';
    var lab = document.createElement('div');
    lab.className = 'tlab';
    var bar = document.createElement('div');
    bar.className = 'tbar';
    bar.innerHTML = '<span></span>';
    hero.appendChild(cur);
    hero.appendChild(lab);
    hero.appendChild(bar);

    var i = 0, timer = null;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var DUR = 3600;
    function pos(x, y) { cur.style.left = (x / 10) + '%'; cur.style.top = (y / 6.4) + '%'; }

    function show(n) {
      i = n;
      layers.forEach(function (l, j) { l.classList.toggle('on', j === n); });
      lab.innerHTML = '<b>' + String(n + 1).padStart(2, '0') + '</b> ' + steps[n][0];
      var b = bar.firstChild;
      b.style.transition = 'none';
      b.style.width = (n / steps.length * 100) + '%';
      void b.offsetWidth;
      b.style.transition = 'width ' + (DUR - 300) + 'ms linear';
      b.style.width = ((n + 1) / steps.length * 100) + '%';
      cur.classList.remove('click');
      setTimeout(function () { pos(steps[n][1], steps[n][2]); }, 250);
      setTimeout(function () { cur.classList.add('click'); }, 2100);
    }

    function start() {
      if (timer) return;
      timer = setInterval(function () { show((i + 1) % steps.length); }, DUR);
    }
    function stop() { clearInterval(timer); timer = null; }

    if (still) {
      show(2);
      cur.style.display = 'none';
      bar.style.display = 'none';
    } else {
      pos(60, 520);
      show(0);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) start(); else stop();
        }, { threshold: 0.25 }).observe(hero);
      } else {
        start();
      }
    }
  }

  ws = document.querySelectorAll('.kxw');
  if (!ws.length) return;
  fit();
  window.addEventListener('resize', fit);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(fit);
    ws.forEach(function (w) { ro.observe(w); });
  }
})();

(function () {
  var tog = document.querySelector('.vtog');
  var walk = document.querySelector('.walk');
  if (!tog || !walk) return;
  walk.querySelectorAll('.wfr').forEach(function (f, i) {
    var im = document.createElement('img');
    im.className = 'wimg';
    im.src = 'img/kayak/flow/g' + (i + 1) + '.png';
    im.alt = 'Original Figma design, screen ' + (i + 1);
    im.loading = 'lazy';
    f.appendChild(im);
  });
  tog.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    walk.classList.toggle('mine', b.getAttribute('data-v') === 'mine');
    tog.querySelectorAll('button').forEach(function (x) {
      var on = x === b;
      x.classList.toggle('on', on);
      x.setAttribute('aria-pressed', on);
    });
    window.dispatchEvent(new Event('resize'));
  });
})();
