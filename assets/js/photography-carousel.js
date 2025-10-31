/**
 * Photography Carousel JavaScript
 * Reusable carousel functionality for photography pages
 */

function initializeCarousel() {
  let currentSlide = 0;
  const images = document.querySelectorAll('.carousel-image');
  const totalSlides = images.length;
  
  if (totalSlides === 0) return;
  
  // Initialize display
  images.forEach((img, index) => {
    img.style.display = index === 0 ? 'block' : 'none';
    img.classList.toggle('active', index === 0);
  });
  
  // Update counter
  const currentSlideEl = document.getElementById('current-slide');
  const totalSlidesEl = document.getElementById('total-slides');
  if (currentSlideEl) currentSlideEl.textContent = '1';
  if (totalSlidesEl) totalSlidesEl.textContent = totalSlides.toString();
  
  function showSlide(n) {
    // Hide all images
    images.forEach(img => {
      img.style.display = 'none';
      img.classList.remove('active');
    });
    
    // Calculate new slide index
    currentSlide = (n + totalSlides) % totalSlides;
    
    // Show current image
    if (images[currentSlide]) {
      images[currentSlide].style.display = 'block';
      images[currentSlide].classList.add('active');
    }
    
    // Update counter
    if (currentSlideEl) {
      currentSlideEl.textContent = (currentSlide + 1).toString();
    }
  }
  
  function changeSlide(direction) {
    showSlide(currentSlide + direction);
  }
  
  // Clean up previous event listeners
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (prevBtn) {
    // Remove any existing listeners by cloning the button
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    newPrevBtn.addEventListener('click', () => changeSlide(-1));
  }
  
  if (nextBtn) {
    // Remove any existing listeners by cloning the button
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    newNextBtn.addEventListener('click', () => changeSlide(1));
  }
  
  // Clean up previous keyboard listeners
  if (window.carouselKeyHandler) {
    document.removeEventListener('keydown', window.carouselKeyHandler);
  }
  
  // Add new keyboard navigation
  window.carouselKeyHandler = function(e) {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  };
  
  document.addEventListener('keydown', window.carouselKeyHandler);
  
  // Initialize first slide
  showSlide(0);
}

// Cleanup function for when content changes
function cleanupCarousel() {
  if (window.carouselKeyHandler) {
    document.removeEventListener('keydown', window.carouselKeyHandler);
    window.carouselKeyHandler = null;
  }
}