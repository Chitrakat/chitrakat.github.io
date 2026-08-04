(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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
      '  <div class="work-row-thumb">',
      '    <img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '  </div>',
      '</a>'
    ].join('');
  }

  window.renderWorkListing = function renderWorkListing(options) {
    const container = document.getElementById(options.containerId);
    const loadingState = document.getElementById(options.loadingId);
    if (!container) {
      return;
    }

    container.innerHTML = options.items.map(renderRow).join('');
    if (loadingState) {
      loadingState.style.display = 'none';
    }
  };
}());