/* Photography grid lightbox — shared across all project pages */
(function () {
  'use strict';

  var allImages = [];
  var currentIndex = 0;

  function getLightbox() { return document.getElementById('photo-lightbox'); }
  function getLightboxImg() { return document.getElementById('photo-lightbox-img'); }

  function openLightbox(index) {
    currentIndex = index;
    getLightboxImg().src = allImages[index].src;
    getLightboxImg().alt = allImages[index].alt;
    getLightbox().classList.add('open');
  }

  function closeLightbox() {
    getLightbox().classList.remove('open');
    getLightboxImg().src = '';
  }

  function navLightbox(dir) {
    if (allImages.length === 0) return;
    currentIndex = (currentIndex + dir + allImages.length) % allImages.length;
    getLightboxImg().src = allImages[currentIndex].src;
    getLightboxImg().alt = allImages[currentIndex].alt;
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Collect all grid images after page scripts have rendered them */
    setTimeout(function () {
      allImages = Array.from(document.querySelectorAll('.photo-grid-img'));

      allImages.forEach(function (img, i) {
        img.addEventListener('click', function () { openLightbox(i); });
      });

      var lb = getLightbox();
      if (!lb) return;

      lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
      });

      var closeBtn = document.getElementById('photo-lightbox-close');
      var prevBtn  = document.getElementById('photo-lightbox-prev');
      var nextBtn  = document.getElementById('photo-lightbox-next');

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
      if (prevBtn)  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); navLightbox(-1); });
      if (nextBtn)  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); navLightbox(1); });

      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   navLightbox(-1);
        if (e.key === 'ArrowRight')  navLightbox(1);
      });
    }, 50);
  });
}());
