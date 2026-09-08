/* Photography project sidebar — full site nav with photography sub-projects nested when active */
(function () {
  function getSiteCategories(root) {
    return [
      { slug: 'about', href: root + '/about.html', label: 'about' },
      { slug: 'publications', href: root + '/design.html', label: 'publications' },
      { slug: 'photography', href: root + '/photography.html', label: 'photography' },
      { slug: 'motion', href: root + '/motion.html', label: 'motion' },
      { slug: 'product-design', href: root + '/product-design.html', label: 'product design' },
      { slug: 'image-making', href: root + '/image-making.html', label: 'image making' },
      { slug: 'poster', href: root + '/poster.html', label: 'poster' }
    ];
  }

  function getPhotographyProjects() {
    return [
      { href: 'america.html', label: 'Empty America' },
      { href: 'stills-from-an-unmade-movie.html', label: 'Still from an unmade film' },
      { href: 'gai-jatra.html', label: 'Gai Jatra' },
      { href: 'nepals-street.html', label: "Nepal's Streets" },
      { href: 'swoyambhu.html', label: 'Swoyambhu' }
    ];
  }

  function getCurrentDivisionSlug() {
    const pathname = (window.location.pathname || '').toLowerCase();

    if (pathname.endsWith('/about.html')) {
      return 'about';
    }
    if (pathname.endsWith('/design.html') || pathname.indexOf('/design/') !== -1) {
      return 'publications';
    }
    if (pathname.endsWith('/photography.html') || pathname.indexOf('/photography/') !== -1) {
      return 'photography';
    }
    if (pathname.endsWith('/motion.html')) {
      return 'motion';
    }
    if (pathname.endsWith('/product-design.html')) {
      return 'product-design';
    }
    if (
      pathname.endsWith('/image-making.html') ||
      pathname.indexOf('/p5js/') !== -1 ||
      pathname.endsWith('/p5js.html')
    ) {
      return 'image-making';
    }
    if (pathname.endsWith('/poster.html')) {
      return 'poster';
    }

    return '';
  }

  function isCurrentPage(href) {
    const pathname = (window.location.pathname || '').toLowerCase();
    return pathname.endsWith('/' + href.toLowerCase());
  }

  function renderSubnav() {
    const items = getPhotographyProjects().map(function (project) {
      const current = isCurrentPage(project.href) ? ' aria-current="page"' : '';
      return '<a href="' + project.href + '" class="photo-sidebar-subnav-link"' + current + '>' + project.label + '</a>';
    }).join('');

    return '<div class="photo-sidebar-subnav">' + items + '</div>';
  }

  function renderNav(container) {
    const root = document.body.dataset.siteRoot || '.';
    const activeSlug = getCurrentDivisionSlug();

    container.innerHTML = getSiteCategories(root).map(function (category) {
      const current = category.slug === activeSlug ? ' aria-current="page"' : '';
      const link = '<a href="' + category.href + '" class="photo-sidebar-nav-link"' + current + '>' + category.label + '</a>';
      // Sub-projects only render for photography, and only while it's the active section.
      const subnav = category.slug === 'photography' && activeSlug === 'photography' ? renderSubnav() : '';
      return link + subnav;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('photo-sidebar-nav');
    if (!container) {
      return;
    }
    renderNav(container);
  });
}());
