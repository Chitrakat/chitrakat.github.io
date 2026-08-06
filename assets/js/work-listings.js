(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getVideoMimeType(src) {
    const value = String(src || '').toLowerCase();
    if (value.endsWith('.webm')) {
      return 'video/webm';
    }
    if (value.endsWith('.ogg') || value.endsWith('.ogv')) {
      return 'video/ogg';
    }
    return 'video/mp4';
  }

  function renderThumb(item) {
    const title = escapeHtml(item.title || 'Project preview');
    const image = escapeHtml(item.image || '');

    if (!item.video) {
      return '<img src="' + image + '" alt="' + title + '" loading="lazy">';
    }

    const videoSrc = escapeHtml(item.video);
    const mimeType = escapeHtml(getVideoMimeType(item.video));

    return [
      '<img class="work-row-thumb-poster" src="' + image + '" alt="' + title + '" loading="lazy">',
      '<video class="work-row-thumb-video-el" muted loop playsinline preload="none" poster="' + image + '" aria-hidden="true">',
      '  <source src="' + videoSrc + '" type="' + mimeType + '">',
      '</video>'
    ].join('');
  }

  function renderRow(item) {
    const disabledAttrs = item.href ? '' : ' aria-disabled="true" tabindex="-1"';
    const href = item.href || '#';
    const kicker = item.kicker ? '<p class="work-row-kicker">' + escapeHtml(item.kicker) + '</p>' : '';
    const desc = item.description ? '<p class="work-row-desc">' + escapeHtml(item.description) + '</p>' : '';

    return [
      '<a class="work-row" href="' + href + '"' + disabledAttrs + '>',
      '  <div class="work-row-meta">',
      '    ' + kicker,
      '    <h2 class="work-row-title">' + escapeHtml(item.title) + '</h2>',
      '    ' + desc,
      '  </div>',
      '  <div class="work-row-thumb' + (item.video ? ' work-row-thumb-video' : '') + '">',
      '    ' + renderThumb(item),
      '  </div>',
      '</a>'
    ].join('');
  }

  function bindVideoPreviews(container) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const isTouchDevice = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const visibilityObserver = isTouchDevice && 'IntersectionObserver' in window
      ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          const thumb = entry.target;
          const video = thumb.querySelector('.work-row-thumb-video-el');
          if (!video) {
            return;
          }

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            thumb.classList.add('is-video-active');
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(function () {});
            }
            return;
          }

          video.pause();
          try {
            video.currentTime = 0;
          } catch (error) {
            // Some browsers can block currentTime updates before metadata is available.
          }
          thumb.classList.remove('is-video-active');
        });
      }, {
        threshold: [0, 0.6, 1]
      })
      : null;

    const videoThumbs = container.querySelectorAll('.work-row-thumb-video');
    videoThumbs.forEach(function (thumb) {
      const video = thumb.querySelector('.work-row-thumb-video-el');
      if (!video || thumb.dataset.videoPreviewBound === 'true') {
        return;
      }

      thumb.dataset.videoPreviewBound = 'true';

      function activatePreview() {
        thumb.classList.add('is-video-active');
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      function resetPreview() {
        video.pause();
        try {
          video.currentTime = 0;
        } catch (error) {
          // Some browsers can block currentTime updates before metadata is available.
        }
        thumb.classList.remove('is-video-active');
      }

      if (isTouchDevice) {
        if (visibilityObserver) {
          visibilityObserver.observe(thumb);
        }
      } else {
        thumb.addEventListener('mouseenter', activatePreview);
        thumb.addEventListener('mouseleave', resetPreview);
      }

      thumb.addEventListener('focusin', activatePreview);
      thumb.addEventListener('focusout', function (event) {
        if (thumb.contains(event.relatedTarget)) {
          return;
        }
        resetPreview();
      });
    });
  }

  window.renderWorkListing = function renderWorkListing(options) {
    const container = document.getElementById(options.containerId);
    const loadingState = document.getElementById(options.loadingId);
    if (!container) {
      return;
    }

    container.innerHTML = options.items.map(renderRow).join('');
    bindVideoPreviews(container);
    if (loadingState) {
      loadingState.style.display = 'none';
    }
  };
}());