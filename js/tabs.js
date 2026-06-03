(function () {
  var buttons = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');

  function activate(name) {
    buttons.forEach(function (btn) {
      var on = btn.dataset.tab === name;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      var on = panel.id === 'panel-' + name;
      panel.classList.toggle('active', on);
      panel.hidden = !on;
    });
    if (location.hash !== '#' + name) {
      history.replaceState(null, '', '#' + name);
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activate(btn.dataset.tab);
    });
  });

  var initial = (location.hash || '#project').slice(1);
  if (initial !== 'project' && initial !== 'about') initial = 'project';
  activate(initial);
})();
