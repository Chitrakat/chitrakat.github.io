// Dropdown menu logic for any site header dropdown
(function () {
  function initDropdown(dropdown) {
    if (!dropdown || dropdown.dataset.dropdownReady === 'true') {
      return;
    }

    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (!toggle) {
      return;
    }

    dropdown.dataset.dropdownReady = 'true';

    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function closeDropdowns() {
    document.querySelectorAll('.dropdown.open').forEach(function (dropdown) {
      dropdown.classList.remove('open');
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(initDropdown);
  }

  document.addEventListener('click', function (event) {
    const openDropdown = event.target.closest('.dropdown');
    if (!openDropdown) {
      closeDropdowns();
    }
  });

  window.addEventListener('resize', closeDropdowns);
  document.addEventListener('DOMContentLoaded', initAllDropdowns, { once: true });
  initAllDropdowns();
  window.initSiteDropdowns = initAllDropdowns;
}());
