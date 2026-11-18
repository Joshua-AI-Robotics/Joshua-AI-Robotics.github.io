(function () {
  var buttons = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');

  function activate(name, fragment) {
    buttons.forEach(function (btn) {
      var on = btn.dataset.tab === name;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      btn.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (panel) {
      var on = panel.id === 'panel-' + name;
      panel.classList.toggle('active', on);
      panel.hidden = !on;
    });
    var hash = '#' + (fragment || name);
    if (location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activate(btn.dataset.tab);
    });
    btn.addEventListener('keydown', function (event) {
      var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (keys.indexOf(event.key) === -1) return;
      event.preventDefault();
      var index = Array.prototype.indexOf.call(buttons, btn);
      var next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      activate(buttons[next].dataset.tab);
      buttons[next].focus();
    });
  });

  function tabFromHash() {
    var fragment = (location.hash || '#project').slice(1);
    var name = fragment === 'integrations' ? 'project' : fragment;
    if (!Array.prototype.some.call(buttons, function (btn) { return btn.dataset.tab === name; })) name = 'project';
    activate(name, fragment === 'integrations' ? fragment : name);
    if (fragment === 'integrations') document.getElementById('integrations').scrollIntoView();
  }

  window.addEventListener('hashchange', tabFromHash);
  tabFromHash();
})();
