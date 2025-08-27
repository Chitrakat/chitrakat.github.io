// Dropdown menu logic for header
const dropdown = document.querySelector('.dropdown');
const toggle = document.getElementById('dropdownMenuButton');
const menu = document.getElementById('dropdownMenu');

toggle.addEventListener('click', function(e) {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

document.addEventListener('click', function(e) {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});

// Optional: Close dropdown on resize
window.addEventListener('resize', () => {
  dropdown.classList.remove('open');
});
