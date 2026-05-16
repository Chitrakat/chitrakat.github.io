(function () {
  function getConfig() {
    const body = document.body;
    const root = body.dataset.siteRoot || '.';
    const section = body.dataset.siteSection || '';

    return {
      root,
      section,
      menuLabel: body.dataset.siteHeaderLabel || 'All Works'
    };
  }

  function buildLinks(root, activeSection) {
    const links = [
      { slug: 'design', href: root + '/design.html', label: 'design' },
      { slug: 'photography', href: root + '/photography.html', label: 'photography' },
      { slug: 'p5js', href: root + '/p5js.html', label: 'p5.js' }
    ];

    return links.map(function (link) {
      const current = link.slug === activeSection ? ' aria-current="page"' : '';
      return '<a href="' + link.href + '" class="dropdown-item"' + current + '>' + link.label + '</a>';
    }).join('');
  }

  function renderHeader() {
    if (document.querySelector('[data-site-header-mounted]')) {
      return;
    }

    const config = getConfig();
    const header = document.createElement('header');
    header.className = 'site-shell-header';
    header.setAttribute('data-site-header-mounted', 'true');
    header.innerHTML = [
      '<a href="' + config.root + '/index.html" class="site-shell-header__title">Suyash Chitrakar</a>',
      '<div class="site-shell-header__right">',
      '  <div class="dropdown" data-dropdown-root>',
      '    <button class="dropdown-toggle" type="button" aria-expanded="false">' + config.menuLabel + '</button>',
      '    <div class="dropdown-menu">' + buildLinks(config.root, config.section) + '</div>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.classList.add('has-site-header');
    document.body.insertBefore(header, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader, { once: true });
    return;
  }

  renderHeader();
}());