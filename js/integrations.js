(function () {
  var panel = document.getElementById('integrations');
  if (!panel) return;
  var data = null;

  var visible = 10;
  var input = document.getElementById('integration-query');
  var list = document.getElementById('integration-list');
  var more = document.getElementById('integration-more');
  var resultLabel = document.getElementById('integration-result-label');
  var entries = [];
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

  function applyCatalog(next) {
    if (next.schema_version !== 1 || !/^[0-9a-f]{40}$/.test(next.joshua_revision) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(next.snapshot_date)) throw new Error('Invalid catalog');
    ['hardware', 'software'].forEach(function (kind) {
      if (!Array.isArray(next[kind]) || !next[kind].length) throw new Error('Empty catalog');
      var total = next.totals && next.totals[kind];
      if (!total || !Number.isInteger(total.integrated) || !Number.isInteger(total.targets) ||
          total.integrated < 0 || total.targets < 1 || total.integrated > total.targets ||
          total.targets > next[kind].length || !Number.isFinite(total.percentage) ||
          total.percentage < 0 || total.percentage > 100) throw new Error('Invalid totals');
      next[kind].forEach(function (entry) {
        if (!entry.id || !entry.name || !entry.vendor || !entry.category ||
            !Array.isArray(entry.aliases) || !labels[entry.status] ||
            typeof entry.counts_toward_coverage !== 'boolean' ||
            entry.integrated !== (entry.status === 'integrated') ||
            !entry.implementation_url || !entry.implementation_url.startsWith(
              'https://github.com/Joshua-AI-Robotics/Joshua/blob/' + next.joshua_revision + '/')) {
          throw new Error('Invalid catalog entry');
        }
      });
      if (!next[kind].some(function (entry) { return entry.counts_toward_coverage; })) {
        throw new Error('Empty denominator');
      }
    });
    if (data && data.joshua_revision === next.joshua_revision) return;
    data = next;
    entries = data.hardware.map(function (entry) {
      return Object.assign({}, entry, { kind: 'Hardware' });
    }).concat(data.software.map(function (entry) {
      return Object.assign({}, entry, { kind: 'Device software' });
    }));
    ['hardware', 'software'].forEach(function (kind) {
      var total = data.totals[kind];
      document.getElementById('integration-' + kind + '-number').textContent = total.integrated;
      document.getElementById('integration-' + kind + '-coverage').textContent =
        'of ' + total.targets + ' discovered targets · ' +
        total.percentage.toFixed(1) + '% of this snapshot';
    });
    var base = 'https://github.com/Joshua-AI-Robotics/Joshua/tree/' + data.joshua_revision + '/';
    var snapshot = document.getElementById('integration-snapshot');
    snapshot.replaceChildren('Discovery snapshot: ' + data.snapshot_date + '. Joshua directories: ');
    ['docs/hardware_catalog/', 'docs/device_software_catalog/'].forEach(function (directory, index) {
      if (index) snapshot.append(' · ');
      var link = document.createElement('a');
      link.textContent = directory;
      link.href = base + directory;
      snapshot.append(link);
    });
    input.disabled = false;
    results();
  }

  async function refreshCatalog() {
    try {
      var response = await fetch('data/catalog.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Catalog request failed');
      applyCatalog(await response.json());
    } catch (error) {
      if (!data) resultLabel.textContent = 'The catalog is temporarily unavailable. Please try again later.';
    }
  }

  input.addEventListener('input', function () { visible = 10; results(); });
  more.addEventListener('click', function () { visible += 10; results(); });
  refreshCatalog();
  setInterval(refreshCatalog, 24 * 60 * 60 * 1000);
})();
