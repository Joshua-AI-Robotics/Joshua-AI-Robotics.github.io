(function () {
  var demo = document.getElementById('prompt-demo');
  if (!demo) return;
  var variants = demo.querySelectorAll('[data-animated-src]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function render() {
    variants.forEach(function (image) {
      var source = reducedMotion.matches ? image.dataset.staticSrc : image.dataset.animatedSrc;
      image.setAttribute(image.tagName === 'SOURCE' ? 'srcset' : 'src', source);
    });
  }

  reducedMotion.addEventListener('change', render);
  render();
})();
