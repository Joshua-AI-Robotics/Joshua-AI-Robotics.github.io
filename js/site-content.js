/**
 * Site listings for the About Us tab.
 * Edit ONLY the JOSHUA_SITE object below — index.html renders from this file.
 */
window.JOSHUA_SITE = {
  about: {
    introHtml:
      'Project Joshua is maintained by the <a href="https://github.com/Joshua-AI-Robotics" target="_blank" rel="noopener noreferrer">Joshua AI Robotics</a> open-source community—building modular software that bridges AI/ML development and real-world robotic deployment.',
    founderNote: null,
    contributorsNote: 'Additional development from the core Joshua repository team.',
    affiliationsNote: 'Academic labs, research groups, and partner organizations supporting JOSHUA.',
  },

  /** Founder profile. Optional linkedin: full profile URL. Set to null if unused. */
  founder: {
    name: 'Hye-Sung Moon',
    role: 'Founder',
    github: 'hsmoon5458',
    linkedin: 'https://www.linkedin.com/in/hye-sung-moon-03a35514a',
  },

  /** { github, name?, linkedin? } — linkedin is optional full profile URL. */
  contributors: [
    { name: 'DJ Kim', github: 'donegjookim', linkedin: 'https://www.linkedin.com/in/donegjookim' },
    { name: 'Unghee Lee', github: 'ungheele', linkedin: 'https://www.linkedin.com/in/ung-hee-lee-81732212b/' },
    { name: 'Taesung Heo', github: 'heostar', linkedin: 'https://www.linkedin.com/in/theo3/' },
    { name: 'Kangjin Yoon', github: 'piscesgh', linkedin: 'https://www.linkedin.com/in/kangjin-yoon-595938111/' },
  ],

  /**
   * Labs and partners.
   * - image: path under this repo (e.g. assets/images/affiliations/lab.png) or full URL
   * - imageAlt: optional override for the logo alt text (defaults to name)
   * - url / linkLabel: optional website link
   */
  affiliations: [
    {
      name: 'Your Lab or Group Name',
      description: 'Department, university, or institution',
      image: null,
      url: null,
      linkLabel: 'Lab website',
    },
    {
      name: 'Partner Organization',
      description: 'Industry, nonprofit, or community partner',
      image: null,
      url: null,
      linkLabel: 'Learn more',
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

  var linkedinIcon =
    '<svg class="link-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">' +
    '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

  function personLinksHtml(entry) {
    var login = entry.github;
    var links =
      '<a class="person-link" href="' +
      githubProfile(login) +
      '" target="_blank" rel="noopener noreferrer">@' +
      escapeHtml(login) +
      '</a>';
    if (entry.linkedin) {
      links +=
        '<a class="person-link person-link-linkedin" href="' +
        escapeHtml(entry.linkedin) +
        '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">' +
        linkedinIcon +
        '<span>LinkedIn</span></a>';
    }
    return '<div class="person-links">' + links + '</div>';
  }

  function founderCardHtml(person) {
    var login = person.github;
    var avatar = person.avatar || githubAvatar(login);
    return (
      '<li class="person-card">' +
      '<img class="person-avatar" src="' +
      escapeHtml(avatar) +
      '" alt="" width="64" height="64" loading="lazy">' +
      '<div class="person-info">' +
      '<h3>' +
      escapeHtml(person.name) +
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
    container.innerHTML = founderCardHtml(person);
  }

  function renderContributors(container, list) {
    if (!list.length) {
      container.innerHTML = '<p class="panel-note">No contributors listed.</p>';
      return;
    }
    container.innerHTML = list
      .map(function (entry) {
        var person = typeof entry === 'string' ? { github: entry } : entry;
        var title = person.name
          ? '<span class="contributor-name">' + escapeHtml(person.name) + '</span>'
          : '';
        return (
          '<li class="contributor-item">' +
          title +
          personLinksHtml(person) +
          '</li>'
        );
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

    var founderNote = document.getElementById('about-founder-note');
    if (founderNote) {
      founderNote.textContent = data.about.founderNote || '';
      founderNote.hidden = !data.about.founderNote;
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
    renderContributors(document.getElementById('contributors-list'), data.contributors || []);
    renderAffiliations(document.getElementById('affiliations-list'), data.affiliations || []);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAbout);
  } else {
    renderAbout();
  }
})();
