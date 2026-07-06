(function () {
  'use strict';

  var p5ProjectSequence = [
    { file: 'p5js1.html', title: 'Interactive Identity for X-Journal I' },
    { file: 'p5js3.html', title: 'Interactive Identity for X-Journal II' },
    { file: 'p5js4.html', title: 'Hierarchy' },
    { file: 'interrupting-the-grid.html', title: 'No Meaning Required' },
    { file: 'photographing-particles.html', title: 'Photographing Particles' },
    { file: 'senior-finals.html', title: 'Senior Finals' }
  ];

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
      return;
    }
    fn();
  }

  function getCurrentFileName() {
    var path = window.location.pathname || '';
    var normalizedPath = path.toLowerCase();
    return normalizedPath.slice(normalizedPath.lastIndexOf('/') + 1);
  }

  function createSequenceLink(item, isNext) {
    var link = document.createElement('a');
    link.className = 'project-sequence-link';
    link.href = item.file;
    link.textContent = isNext
      ? 'Next: ' + item.title + ' \u2192'
      : '\u2190 Previous: ' + item.title;
    return link;
  }

  function renderProjectSequenceNav() {
    var body = document.body;
    var layout = document.querySelector('.gen-art-layout');
    var main = document.querySelector('main.gen-art-layout');
    if (!body || !body.classList.contains('gen-art-page') || !layout || !main) {
      return;
    }

    if (document.querySelector('.project-sequence-nav[data-project-sequence-mounted="p5js"]')) {
      return;
    }

    var currentFile = getCurrentFileName();
    var currentIndex = p5ProjectSequence.findIndex(function (project) {
      return project.file === currentFile;
    });

    if (currentIndex === -1) {
      return;
    }

    var previousProject = currentIndex > 0 ? p5ProjectSequence[currentIndex - 1] : null;
    var nextProject = currentIndex < p5ProjectSequence.length - 1 ? p5ProjectSequence[currentIndex + 1] : null;

    var nav = document.createElement('nav');
    nav.className = 'project-sequence-nav';
    nav.setAttribute('aria-label', 'Project navigation');
    nav.setAttribute('data-project-sequence-mounted', 'p5js');

    var previousSlot = document.createElement('div');
    previousSlot.className = 'project-sequence-slot project-sequence-slot-prev';
    if (previousProject) {
      previousSlot.appendChild(createSequenceLink(previousProject, false));
    } else {
      previousSlot.classList.add('is-empty');
      previousSlot.setAttribute('aria-hidden', 'true');
    }

    var nextSlot = document.createElement('div');
    nextSlot.className = 'project-sequence-slot project-sequence-slot-next';
    if (nextProject) {
      nextSlot.appendChild(createSequenceLink(nextProject, true));
    } else {
      nextSlot.classList.add('is-empty');
      nextSlot.setAttribute('aria-hidden', 'true');
    }

    nav.appendChild(previousSlot);
    nav.appendChild(nextSlot);
    main.insertAdjacentElement('afterend', nav);
  }

  onReady(function () {
    var body = document.body;
    if (!body || !body.classList.contains('gen-art-page')) {
      return;
    }

    renderProjectSequenceNav();

    var lightbox = document.getElementById('gen-lightbox');
    var lightboxImg = document.getElementById('gen-lightbox-img');
    var closeBtn = document.getElementById('gen-lightbox-close');
    var items = Array.from(document.querySelectorAll('.gen-art-item img'));

    if (!lightbox || !lightboxImg || items.length === 0) {
      return;
    }

    function open(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      lightboxImg.alt = '';
      document.body.style.overflow = '';
    }

    items.forEach(function (img) {
      img.addEventListener('click', function () {
        open(img.src, img.alt);
      });
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        close();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }

    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('open')) {
        return;
      }

      if (event.key === 'Escape') {
        close();
      }
    });
  });
}());
