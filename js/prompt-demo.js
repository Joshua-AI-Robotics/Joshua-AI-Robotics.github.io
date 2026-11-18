(function () {
  var demo = document.getElementById('prompt-demo');
  if (!demo) return;
  var variants = demo.querySelectorAll('[data-animated-src]');
  var toggle = document.getElementById('prompt-animation-toggle');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var playing;

  function setPlaying(value) {
    playing = value;
    variants.forEach(function (image) {
      var source = playing ? image.dataset.animatedSrc : image.dataset.staticSrc;
      image.setAttribute(image.tagName === 'SOURCE' ? 'srcset' : 'src', source);
    });
    toggle.textContent = playing ? 'Pause animation' : 'Play animation';
  }

  toggle.addEventListener('click', function () { setPlaying(!playing); });
  reducedMotion.addEventListener('change', function () { setPlaying(!reducedMotion.matches); });
  setPlaying(!reducedMotion.matches);
  toggle.hidden = false;
})();
