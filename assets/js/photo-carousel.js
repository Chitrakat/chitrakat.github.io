async function loadCarouselImages() {
  const carousel = document.querySelector('.photo-carousel');
  if (!carousel) return;
  
  const track = document.getElementById('carousel-track');
  const folder = carousel.dataset.folder;
  
  if (!track || !folder) return;
  
  // Clear existing content
  track.innerHTML = '';
  
  let images = [];
  
  // If images are specified in data-images, use those
  if (carousel.dataset.images) {
    images = carousel.dataset.images.split(',').map(name => name.trim());
  } else {
    // Smart discovery based on folder name
    images = await smartDiscoverImages(folder);
  }
  
  // Create image elements
  let loadedCount = 0;
  for (let i = 0; i < images.length; i++) {
    const imageName = images[i];
    const img = document.createElement('img');
    img.src = `${folder}${imageName}.jpg`;
    img.alt = `${document.querySelector('h2').textContent} ${i + 1}`;
    img.className = `carousel-image${i === 0 ? ' active' : ''}`;
    
    // Only add images that actually load
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 1) {
        // Initialize carousel after first image loads
        initializeCarousel();
      }
    };
    
    img.onerror = () => {
      // Remove failed images
      img.remove();
    };
    
    track.appendChild(img);
  }
}

async function smartDiscoverImages(folder) {
  const folderName = folder.split('/').filter(x => x).pop(); // Get last folder name
  const images = [];
  
  // Targeted discovery based on folder patterns
  let patterns = [];
  
  if (folderName === 'gai-jatra') {
    patterns = [
      { prefix: 'gai-jatra-', numbers: [1,2,3,4,5,6,7,8,9,11,12,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64] }
    ];
  } else if (folderName === 'america') {
    patterns = [
      { prefix: 'ununited-', numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67] }
    ];
  } else if (folderName === 'nepals-street') {
    patterns = [
      { prefix: 'sammy-', numbers: [73, 122, 123, 124, 125, 126, 127, 128, 134, 135, 136, 137, 139, 147, 155, 156, 158, 159, 160, 161, 164, 166, 169, 176, 351] }
    ];
  } else if (folderName === 'swoyambhu') {
    patterns = [
      { prefix: 'sammy-', numbers: [112, 114, 189, 192, 193, 194, 197, 198, 335, 350, 352, 353, 354, 359, 361] }
    ];
  } else if (folderName === 'moving-by') {
    patterns = [
      { prefix: 'sammy-', numbers: [21, 45, 46, 57, 59, 60, 63] },
      { prefix: 'usa-', numbers: [3] }
    ];
  } else if (folderName === 'abstractions') {
    patterns = [
      { prefix: 'sammy-', numbers: [18, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34] }
    ];
  }
  
  // Build image list from patterns
  for (const pattern of patterns) {
    for (const num of pattern.numbers) {
      const paddedNum = (pattern.prefix === 'usa-' || pattern.prefix === 'ununited-' || pattern.prefix === 'gai-jatra-') ? num.toString().padStart(2, '0') : num.toString().padStart(3, '0');
      const imageName = `${pattern.prefix}${paddedNum}`;
      
      // Check if image exists
      const exists = await imageExists(`${folder}${imageName}.jpg`);
      if (exists) {
        images.push(imageName);
      }
    }
  }
  
  return images;
}

function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Carousel functionality
function initializeCarousel() {
  let currentSlide = 0;
  const images = document.querySelectorAll('.carousel-image');
  const totalSlides = images.length;
  
  if (totalSlides === 0) return;
  
  // Initialize display - hide all except first
  images.forEach((img, index) => {
    img.style.display = index === 0 ? 'block' : 'none';
    img.classList.toggle('active', index === 0);
  });
  
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
  }
  
  function changeSlide(direction) {
    showSlide(currentSlide + direction);
  }
  
  // Add event listeners to buttons
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => changeSlide(-1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => changeSlide(1));
  }
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });
}

// Auto-load when DOM is ready (for direct page access)
document.addEventListener('DOMContentLoaded', loadCarouselImages);

// Make functions available globally for dynamic loading
window.loadCarouselImages = loadCarouselImages;
window.initializeCarousel = initializeCarousel;