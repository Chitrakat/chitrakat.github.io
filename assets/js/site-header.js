(function () {
  function getHomeProjectOrder() {
    return [
      'design/lines.html',
      'photography/america.html',
      'p5js/senior-finals.html',
      'design/vol56-1.html',
      'p5js/interrupting-the-grid.html',
      'p5js/photographing-particles.html',
      'design/vol56-2.html',
      'design/x-journal.html',
      'p5js/p5js4.html',
      'design/vol55-2.html'
    ];
  }

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

  function ensureProjectPagerStyles() {
    if (document.getElementById('project-pager-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'project-pager-styles';
    style.textContent = [
      '.project-pager {',
      '  max-width: 1800px;',
      '  margin: 40px auto 24px;',
      '  padding: 0 20px;',
      '}',
      '.project-pager__inner {',
      '  display: flex;',
      '  justify-content: space-between;',
      '  gap: 12px;',
      '  border-top: 1px solid #ddd;',
      '  padding-top: 14px;',
      '}',
      '.project-pager__link, .project-pager__disabled {',
      '  font-size: 0.9rem;',
      '  letter-spacing: 0.03em;',
      '  text-transform: lowercase;',
      '}',
      '.project-pager__link {',
      '  color: #777777;',
      '  text-decoration: none;',
      '}',
      '.project-pager__link:hover, .project-pager__link:focus {',
      '  color: #ff004c;',
      '}',
      '.project-pager__disabled {',
      '  color: #b9b9b9;',
      '}',
      '@media (max-width: 700px) {',
      '  .project-pager { padding: 0 12px; }',
      '}'
    ].join('');

    document.head.appendChild(style);
  }

  function renderProjectPager() {
    const body = document.body;
    if (
      body &&
      (body.classList.contains('gen-art-page') || body.classList.contains('design-publication-page'))
    ) {
      return;
    }

    if (document.querySelector('[data-project-pager-mounted]')) {
      return;
    }

    const order = getHomeProjectOrder();
    const pathname = window.location.pathname.toLowerCase();
    const currentIndex = order.findIndex(function (path) {
      return pathname.endsWith('/' + path.toLowerCase());
    });

    if (currentIndex === -1) {
      return;
    }

    const main = document.querySelector('main');
    if (!main || !main.parentNode) {
      return;
    }

    const config = getConfig();
    const prevPath = currentIndex > 0 ? order[currentIndex - 1] : null;
    const nextPath = currentIndex < order.length - 1 ? order[currentIndex + 1] : null;

    function resolveHref(path) {
      return config.root + '/' + path;
    }

    ensureProjectPagerStyles();

    const pager = document.createElement('nav');
    pager.className = 'project-pager';
    pager.setAttribute('aria-label', 'Project navigation');
    pager.setAttribute('data-project-pager-mounted', 'true');
    pager.innerHTML = [
      '<div class="project-pager__inner">',
      prevPath
        ? '<a class="project-pager__link" href="' + resolveHref(prevPath) + '">\u2190 previous project</a>'
        : '<span class="project-pager__disabled" aria-hidden="true">\u2190 previous project</span>',
      nextPath
        ? '<a class="project-pager__link" href="' + resolveHref(nextPath) + '">next project \u2192</a>'
        : '<span class="project-pager__disabled" aria-hidden="true">next project \u2192</span>',
      '</div>'
    ].join('');

    main.parentNode.insertBefore(pager, main.nextSibling);
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
    renderProjectPager();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader, { once: true });
    return;
  }

  renderHeader();
}());