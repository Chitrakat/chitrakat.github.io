// Interactive Photo Gallery JavaScript

class InteractivePhotoGallery {
  constructor() {
    this.photoGrid = document.getElementById('photoGrid');
    this.images = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.proximityDistance = 400;
    this.enlargedOverlay = null;
    this.customCursor = null;
    
    this.init();
  }
  
  async init() {
    // console.log('Initializing InteractivePhotoGallery');
    this.createCustomCursor();
    this.showLoading();
    await this.loadImages();
    // console.log('Images loaded, count:', this.images.length);
    this.hideLoading();
    this.createOverlay();
    this.setupEventListeners();
    this.updateImageStates();
  }
  
  showLoading() {
    this.photoGrid.innerHTML = '<div class="loading">Loading Gai Jatra photographs...</div>';
  }
  
  hideLoading() {
    // Only remove loading message, not all content
    const loadingDiv = this.photoGrid.querySelector('.loading');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }
  
  createCustomCursor() {
    this.customCursor = document.createElement('div');
    this.customCursor.className = 'custom-cursor';
    document.body.appendChild(this.customCursor);
  }
  
  updateCursor() {
    if (this.customCursor) {
      this.customCursor.style.left = this.mouseX + 'px';
      this.customCursor.style.top = this.mouseY + 'px';
    }
  }
  
  async loadImages() {
    // console.log('Starting to load images...');
    // Gai Jatra images are numbered 33-64
    const imageNumbers = [];
    for (let i = 33; i <= 64; i++) {
      imageNumbers.push(i);
    }
    // console.log('Image numbers to load:', imageNumbers);
    
    // Test: Create a simple div first
    // const testDiv = document.createElement('div');
    // testDiv.className = 'photo-item';
    // testDiv.innerHTML = 'TEST ITEM';
    // testDiv.style.background = 'purple';
    // this.photoGrid.appendChild(testDiv);
    // console.log('Test div added');
    
    const imagePromises = imageNumbers.map(num => this.createImageElement(num));
    // console.log('Created image promises, count:', imagePromises.length);
    
    const results = await Promise.all(imagePromises);
    // console.log('Promise.all resolved, results count:', results.length);
    
    this.images = results.filter(result => result !== null);
    // console.log('After filtering, images count:', this.images.length);
    
    // Add all images to the grid
    this.images.forEach((imgData, index) => {
      // console.log('Adding image to grid:', index, imgData.number, imgData.element);
      this.photoGrid.appendChild(imgData.element);
      
      // Add click event listener to image
      if (imgData.img) {
        imgData.img.addEventListener('click', (e) => {
          e.stopPropagation();
          this.clickX = e.clientX;
          this.clickY = e.clientY;
          this.enlargeImage(imgData.img.src);
        });
      }
      
      // Debug: Check if image is actually there
      // setTimeout(() => {
      //   const rect = imgData.element.getBoundingClientRect();
      //   console.log(`Image ${imgData.number} dimensions:`, {
      //     width: rect.width,
      //     height: rect.height,
      //     hasImg: !!imgData.img,
      //     visible: window.getComputedStyle(imgData.element).opacity
      //   });
      // }, 100);
    });
    
    // console.log('All images added to grid');
  }
  
  createImageElement(number) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const container = document.createElement('div');
      container.className = 'photo-item';
      
      const imagePath = `assets/img/photography/gai-jatra/gai-jatra-${number}.jpg`;
      // console.log('Loading image:', imagePath);
      
      img.onload = () => {
        // console.log('Successfully loaded:', imagePath);
        container.appendChild(img);
        resolve({
          element: container,
          number: number,
          img: img
        });
      };
      
      img.onerror = (e) => {
        // console.error('Failed to load image:', imagePath, e);
        // Create a placeholder for failed images
        container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">Image ${number}<br>Failed to load</div>`;
        resolve({
          element: container,
          number: number,
          img: null
        });
      };
      
      img.src = imagePath;
      img.alt = `Gai Jatra ${number}`;
    });
  }
  
  createOverlay() {
    this.enlargedOverlay = document.createElement('div');
    this.enlargedOverlay.className = 'image-overlay';
    document.body.appendChild(this.enlargedOverlay);
    
    // Click outside image to close
    this.enlargedOverlay.addEventListener('click', (e) => {
      if (e.target === this.enlargedOverlay) {
        this.closeEnlargedImage();
      }
    });
  }
  
  enlargeImage(imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    
    // Position image at click coordinates
    img.style.left = this.clickX + 'px';
    img.style.top = this.clickY + 'px';
    
    // Add mouse leave event to the image itself
    img.addEventListener('mouseleave', () => {
      this.closeEnlargedImage();
    });
    
    img.addEventListener('click', () => {
      this.closeEnlargedImage();
    });
    
    this.enlargedOverlay.innerHTML = '';
    this.enlargedOverlay.appendChild(img);
    this.enlargedOverlay.classList.add('visible');
  }
  
  closeEnlargedImage() {
    this.enlargedOverlay.classList.remove('visible');
    setTimeout(() => {
      this.enlargedOverlay.innerHTML = '';
    }, 300);
  }
  
  setupEventListeners() {
    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.updateCursor();
      this.updateImageStates();
    });
    
    // Add hover effects for cursor
    this.photoGrid.addEventListener('mouseenter', () => {
      if (this.customCursor) {
        this.customCursor.classList.add('hover');
      }
    });
    
    this.photoGrid.addEventListener('mouseleave', () => {
      if (this.customCursor) {
        this.customCursor.classList.remove('hover');
      }
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.updateImageStates();
    });
    
    // ESC key to close enlarged image
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeEnlargedImage();
      }
    });
  }
  
  updateImageStates() {
    this.images.forEach(imgData => {
      if (!imgData.img) return;
      
      const rect = imgData.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(this.mouseX - centerX, 2) + 
        Math.pow(this.mouseY - centerY, 2)
      );
      
      if (distance <= this.proximityDistance) {
        imgData.element.classList.add('mouse-nearby');
      } else {
        imgData.element.classList.remove('mouse-nearby');
      }
    });
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new InteractivePhotoGallery();
});