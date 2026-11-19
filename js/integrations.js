(function () {
  var panel = document.getElementById('integrations');
  var data = window.JOSHUA_INTEGRATIONS;
  if (!panel || !data) return;

  var visible = 10;
  var input = document.getElementById('integration-query');
  var list = document.getElementById('integration-list');
  var more = document.getElementById('integration-more');
  var resultLabel = document.getElementById('integration-result-label');
  var entries = data.hardware.map(function (entry) {
    return Object.assign({}, entry, { kind: 'Hardware' });
  }).concat(data.software.map(function (entry) {
    return Object.assign({}, entry, { kind: 'Device software' });
  }));
  var labels = {
    integrated: 'Integrated', candidate: 'Candidate', unsupported: 'Unsupported', retired: 'Retired'
  };

  function searchable(entry) {
    return [entry.id, entry.catalog_id || '', entry.name, entry.vendor, entry.category, entry.description || '',
      entry.kind, labels[entry.status]].concat(entry.aliases, entry.capabilities || []).join(' ').toLocaleLowerCase();
  }

  function results() {
    var words = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    var matches = entries.filter(function (entry) {
      if (!words.length) return entry.integrated;
      var text = searchable(entry);
      return words.every(function (word) { return text.includes(word); });
    });
    matches.sort(function (a, b) {
      return Number(b.integrated) - Number(a.integrated) ||
        a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name);
    });
    list.replaceChildren();
    matches.slice(0, visible).forEach(function (entry) {
      var row = document.createElement('li');
      var identity = document.createElement('div');
      var link = document.createElement('a');
      link.textContent = entry.name;
      link.href = entry.implementation_url || entry.source_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      var note = document.createElement('p');
      note.textContent = entry.kind + ' · ' + entry.vendor +
        (entry.description ? ' · ' + entry.description : '');
      identity.append(link, note);
      var status = document.createElement('span');
      status.className = 'integration-status';
      status.textContent = labels[entry.status];
      row.append(identity, status);
      list.append(row);
    });
    if (input.value.trim()) {
      resultLabel.textContent = matches.length ?
        matches.length + (matches.length === 1 ? ' result' : ' results') :
        'No matching targets. Try another device, driver, vendor, or status.';
    } else {
      resultLabel.textContent = 'Integrated hardware and device software';
    }
    more.hidden = matches.length <= visible;
    if (!more.hidden) more.textContent = 'Show more (' + (matches.length - visible) + ' remaining)';
  }

  ['hardware', 'software'].forEach(function (kind) {
    var targets = data[kind].filter(function (entry) { return entry.counts_toward_coverage; });
    var count = targets.filter(function (entry) { return entry.integrated; }).length;
    document.getElementById('integration-' + kind + '-number').textContent = count;
    document.getElementById('integration-' + kind + '-coverage').textContent =
      'of ' + targets.length + ' discovered targets · ' +
      (100 * count / targets.length).toFixed(1) + '% of this snapshot';
  });
  input.addEventListener('input', function () { visible = 10; results(); });
  more.addEventListener('click', function () { visible += 10; results(); });
  var base = 'https://github.com/Joshua-AI-Robotics/Joshua/tree/' + data.joshua_revision + '/';
  var snapshot = document.getElementById('integration-snapshot');
  snapshot.append('Discovery snapshot: ' + data.snapshot_date + '. Joshua directories: ');
  ['docs/hardware_catalog/', 'robot/', 'firmware/', 'tools/'].forEach(function (directory, index) {
    if (index) snapshot.append(' · ');
    var link = document.createElement('a');
    link.textContent = directory;
    link.href = base + directory;
    snapshot.append(link);
  });
  input.disabled = false;
  results();
})();
