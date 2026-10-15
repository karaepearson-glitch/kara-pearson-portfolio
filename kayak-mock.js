(function () {
  var ws = document.querySelectorAll('.kxw');
  if (!ws.length) return;
  function fit() {
    ws.forEach(function (w) {
      var k = w.querySelector('.kx');
      if (k) k.style.transform = 'scale(' + w.clientWidth / 1000 + ')';
    });
  }
  fit();
  window.addEventListener('resize', fit);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(fit);
    ws.forEach(function (w) { ro.observe(w); });
  }
})();
