(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
      return;
    }
    fn();
  }

  onReady(function () {
    var body = document.body;
    if (!body || !body.classList.contains('gen-art-page')) {
      return;
    }

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
