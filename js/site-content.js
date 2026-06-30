/**
 * Site listings for the About Us tab.
 * Edit ONLY the JOSHUA_SITE object below — index.html renders from this file.
 */
window.JOSHUA_SITE = {
  about: {
    introHtml:
      '<a We connect researchers, engineers, and partner labs who want robotics software that is modular, reproducible, and practical on real hardware.',
    introFollowHtml:
      'We are based in the San Francisco Bay Area and work with collaborators locally and around the world.',
    founderNote: null,
    coreTeamNote: null,
    contributorsNote: null,
    affiliationsNote: 'Research groups and partners collaborating on Joshua.',
  },

  /** Founder profile. Optional linkedin: full profile URL. Set to null if unused. */
  founder: {
    name: 'Hye-Sung Moon',
    role: 'Founder',
    github: 'hsmoon5458',
    linkedin: 'https://www.linkedin.com/in/hye-sung-moon-03a35514a',
  },

  /** Core team members. { name?, github?, linkedin? } */
  coreTeam: [
    {
      name: 'DJ Kim',
      github: 'donegjookim',
      linkedin: 'https://www.linkedin.com/in/donegjookim',
    },
    {
      name: 'Taesung Heo',
      github: 'heostar',
      linkedin: 'https://www.linkedin.com/in/theo3/',
    },
    {
      name: 'Kangjin Yoon',
      github: 'piscesgh',
      linkedin: 'https://www.linkedin.com/in/kangjin-yoon-595938111/',
    },
  ],

  /** { name?, github?, linkedin? } — github and linkedin are optional. */
  contributors: [
    {
      name: 'Unghee Lee',
      github: 'ungheele',
      linkedin: 'https://www.linkedin.com/in/ung-hee-lee-81732212b/',
    },
  ],

  /**
   * Labs and partners.
   * - image: path under this repo (e.g. assets/images/affiliations/lab.png) or full URL
   * - imageAlt: optional override for the logo alt text (defaults to name)
   * - url / linkLabel: optional website link
   */
  affiliations: [
    {
      name: 'Mind Music Machine (tri-M) Lab',
      description:
        'Interdisciplinary HCI & HRI research at Virginia Tech — Grado Department of Industrial and Systems Engineering.',
      image: 'assets/images/affiliations/trim-lab.png',
      imageAlt: 'Mind Music Machine (tri-M) Lab logo',
      url: 'https://trim.ise.vt.edu/index.html',
      linkLabel: 'Lab website',
    },
  ],
};

(function () {
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function githubAvatar(login) {
    return 'https://github.com/' + encodeURIComponent(login) + '.png';
  }

  function githubProfile(login) {
    return 'https://github.com/' + encodeURIComponent(login);
  }

  var githubIcon =
    '<svg class="link-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

  var linkedinIcon =
    '<svg class="link-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

  function personLinksHtml(entry) {
    var links = '';
    if (entry.github) {
      links +=
        '<a class="person-link person-link-github" href="' +
        githubProfile(entry.github) +
        '" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (' +
        escapeHtml(entry.github) +
        ')">' +
        githubIcon +
        '</a>';
    }
    if (entry.linkedin) {
      links +=
        '<a class="person-link person-link-linkedin" href="' +
        escapeHtml(entry.linkedin) +
        '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">' +
        linkedinIcon +
        '</a>';
    }
    return links ? '<div class="person-links">' + links + '</div>' : '';
  }

  function personInitials(name) {
    var parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function personAvatarHtml(person) {
    if (person.avatar) {
      return (
        '<img class="person-avatar" src="' +
        escapeHtml(person.avatar) +
        '" alt="" width="64" height="64" loading="lazy">'
      );
    }
    if (person.github) {
      return (
        '<img class="person-avatar" src="' +
        escapeHtml(githubAvatar(person.github)) +
        '" alt="" width="64" height="64" loading="lazy">'
      );
    }
    var label = person.name || 'Contributor';
    return (
      '<div class="person-avatar person-avatar-placeholder" role="img" aria-label="' +
      escapeHtml(label) +
      '">' +
      escapeHtml(personInitials(person.name)) +
      '</div>'
    );
  }

  function personCardHtml(person) {
    var displayName = person.name || (person.github ? '@' + person.github : 'Contributor');
    return (
      '<li class="person-card">' +
      personAvatarHtml(person) +
      '<div class="person-info">' +
      '<h3>' +
      escapeHtml(displayName) +
      '</h3>' +
      (person.role ? '<p class="person-role">' + escapeHtml(person.role) + '</p>' : '') +
      personLinksHtml(person) +
      '</div></li>'
    );
  }

  function renderFounder(container, person) {
    if (!person) {
      container.innerHTML = '<p class="panel-note">No founder listed.</p>';
      return;
    }
    container.innerHTML = personCardHtml(person);
  }

  function renderPeopleList(container, list, emptyMessage) {
    if (!list.length) {
      container.innerHTML = '<p class="panel-note">' + escapeHtml(emptyMessage) + '</p>';
      return;
    }
    container.innerHTML = list
      .map(function (entry) {
        var person = typeof entry === 'string' ? { github: entry } : entry;
        return personCardHtml(person);
      })
      .join('');
  }

  function affiliationImageHtml(aff) {
    if (!aff.image) return '';
    var alt = aff.imageAlt || aff.name + ' logo';
    var img =
      '<img class="affiliation-logo" src="' +
      escapeHtml(aff.image) +
      '" alt="' +
      escapeHtml(alt) +
      '" width="160" height="80" loading="lazy">';
    if (aff.url && aff.url !== '#') {
      return (
        '<a class="affiliation-logo-link" href="' +
        escapeHtml(aff.url) +
        '" target="_blank" rel="noopener noreferrer">' +
        img +
        '</a>'
      );
    }
    return '<div class="affiliation-logo-wrap">' + img + '</div>';
  }

  function renderAffiliations(container, list) {
    if (!list.length) {
      container.innerHTML = '<p class="panel-note">No affiliations listed.</p>';
      return;
    }
    container.innerHTML = list
      .map(function (aff) {
        var link =
          aff.url && aff.url !== '#'
            ? '<a href="' +
              escapeHtml(aff.url) +
              '" target="_blank" rel="noopener noreferrer">' +
              escapeHtml(aff.linkLabel || 'Website') +
              '</a>'
            : '';
        return (
          '<li class="affiliation-card">' +
          affiliationImageHtml(aff) +
          '<div class="affiliation-body">' +
          '<h3>' +
          escapeHtml(aff.name) +
          '</h3>' +
          '<p>' +
          escapeHtml(aff.description) +
          '</p>' +
          link +
          '</div></li>'
        );
      })
      .join('');
  }

  function renderAbout() {
    var data = window.JOSHUA_SITE;
    if (!data) return;

    var intro = document.getElementById('about-intro');
    if (intro && data.about.introHtml) intro.innerHTML = data.about.introHtml;

    var introFollow = document.getElementById('about-intro-follow');
    if (introFollow) {
      if (data.about.introFollowHtml) {
        introFollow.innerHTML = data.about.introFollowHtml;
        introFollow.hidden = false;
      } else {
        introFollow.innerHTML = '';
        introFollow.hidden = true;
      }
    }

    var founderNote = document.getElementById('about-founder-note');
    if (founderNote) {
      founderNote.textContent = data.about.founderNote || '';
      founderNote.hidden = !data.about.founderNote;
    }

    var coreTeamNote = document.getElementById('about-core-team-note');
    if (coreTeamNote) {
      coreTeamNote.textContent = data.about.coreTeamNote || '';
      coreTeamNote.hidden = !data.about.coreTeamNote;
    }

    var contributorsNote = document.getElementById('about-contributors-note');
    if (contributorsNote) {
      contributorsNote.textContent = data.about.contributorsNote || '';
      contributorsNote.hidden = !data.about.contributorsNote;
    }

    var affiliationsNote = document.getElementById('about-affiliations-note');
    if (affiliationsNote) {
      affiliationsNote.textContent = data.about.affiliationsNote || '';
      affiliationsNote.hidden = !data.about.affiliationsNote;
    }

    renderFounder(document.getElementById('founder-list'), data.founder || null);
    renderPeopleList(
      document.getElementById('core-team-list'),
      data.coreTeam || [],
      'No core team members listed.'
    );
    renderPeopleList(
      document.getElementById('contributors-list'),
      data.contributors || [],
      'No contributors listed.'
    );
    renderAffiliations(document.getElementById('affiliations-list'), data.affiliations || []);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAbout);
  } else {
    renderAbout();
  }
})();
