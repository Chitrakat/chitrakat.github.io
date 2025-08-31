let frameWidth = 200;
let frameHeight = 280;
let frameGap = 10;

let offsetX = 0;
let offsetY = 0;

const edgeMargin = 300;
const scrollSpeed = 10;


// Infinite grid: no rectangles array, draw on the fly
function getRectType(col, row) {
  // Deterministic pseudo-random type based on col/row
  // Use a simple hash for repeatability
  let n = (col * 928371 + row * 123457) % 5;
  return ((n + 5) % 5); // always 0-4
}
let popupVisible = false;
let popupContent = '';

// Preload cover images for each type
let coverImages = [];
const coverImagePaths = [
  'assets/img/design-cover/vol55-2.png',
  'assets/img/design-cover/vol56-1.png',
  'assets/img/design-cover/vol56-2.png',
  'assets/img/design-cover/vol57-1.png',
  'assets/img/design-cover/x.png'
];

function preload() {
  for (let i = 0; i < coverImagePaths.length; i++) {
    coverImages[i] = loadImage(
      coverImagePaths[i],
      // success callback
      undefined,
      // error callback
      function(err) {
        console.error('Failed to load image:', coverImagePaths[i], err);
        coverImages[i] = null;
      }
    );
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function randomColor(seed, alpha = 128) {
  let r = abs(sin(seed) * 16777215) % 256;
  let g = abs(cos(seed) * 16777215) % 256;
  let b = abs(sin(seed * 2) * 16777215) % 256;
  return color(r, g, b, alpha);
}

// No need for generateRectangles

function draw() {
  background(0, 30);

  let cols = ceil(width / (frameWidth + frameGap)) + 2;
  let rows = ceil(height / (frameHeight + frameGap)) + 2;
  let startCol = floor(offsetX / (frameWidth + frameGap));
  let startRow = floor(offsetY / (frameHeight + frameGap));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let gridCol = col + startCol;
      let gridRow = row + startRow;
      let gridX = gridCol * (frameWidth + frameGap) - offsetX;
      let gridY = gridRow * (frameHeight + frameGap) - offsetY;
      let type = getRectType(gridCol, gridRow);
      let img = coverImages[type];
      if (img) {
        image(img, gridX, gridY, frameWidth, frameHeight);
      } else {
        // fallback: colored rect if image not loaded
        switch (type) {
          case 0:
            fill(255, 100, 100, 60);
            break;
          case 1:
            fill(100, 255, 100, 60);
            break;
          case 2:
            fill(100, 100, 255, 60);
            break;
          case 3:
            fill(255, 255, 100, 60);
            break;
          case 4:
            fill(255, 100, 255, 60);
            break;
        }
        rect(gridX, gridY, frameWidth, frameHeight);
        noFill();
      }

      noFill();
      noStroke();
      rect(gridX, gridY, frameWidth, frameHeight);
    }
  }

  // Infinite grid navigation with mouse near edges
  if (mouseX < edgeMargin) {
    offsetX = max(0, offsetX - scrollSpeed);
  } else if (mouseX > width - edgeMargin) {
    offsetX += scrollSpeed;
  }
  if (mouseY < edgeMargin) {
    offsetY = max(0, offsetY - scrollSpeed);
  } else if (mouseY > height - edgeMargin) {
    offsetY += scrollSpeed;
  }
}

function mousePressed() {
  // Find which rectangle was clicked
  let col = floor((mouseX + offsetX) / (frameWidth + frameGap));
  let row = floor((mouseY + offsetY) / (frameHeight + frameGap));
  let type = getRectType(col, row);
  showPopup(type);
}
// Make popup scrollable and prevent event propagation to canvas
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('custom-popup');
    const content = document.getElementById('popup-content');
    if (popup) {
      // Prevent mouse events from propagating to canvas when clicking inside popup
      popup.addEventListener('mousedown', function(e) {
        e.stopPropagation();
      });
      popup.addEventListener('mouseup', function(e) {
        e.stopPropagation();
      });
      // Make popup scrollable with scroll wheel
      popup.addEventListener('wheel', function(e) {
        if (popup.style.display !== 'none') {
          e.stopPropagation();
        }
      }, { passive: false });
    }
    if (content) {
      content.style.maxHeight = '60vh';
      content.style.overflowY = 'auto';
    }
    // Make sure the close X calls hidePopup with event
    const closeBtn = document.querySelector('#custom-popup span[onclick]');
    if (closeBtn) {
      closeBtn.onclick = function(e) { hidePopup(e); };
    }
  });
}

function showPopup(type) {
  popupVisible = true;
  let popup = document.getElementById('custom-popup');
  let content = document.getElementById('popup-content');
  if (popup && content) {
    content.innerHTML = getPopupContent(type);
    popup.style.display = 'block';
  }
}

function hidePopup() {
  popupVisible = false;
  let popup = document.getElementById('custom-popup');
  if (popup) popup.style.display = 'none';
}

function getPopupContent(type) {
  // Table data for each type, with images and updated titles
  const data = [
    {
      title: 'VOL. 55 NO. 2',
      year: '2021',
      kind: 'Poster',
      tools: 'Photoshop, Illustrator',
      collaborators: 'Alice, Bob',
      website: '<a href="https://example.com/0" target="_blank">example.com/0</a>',
      img: '<img src="assets/img/design-cover/vol55-2.png" alt="VOL. 55 NO. 2" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'VOL. 56 NO. 1',
      year: '2022',
      kind: 'Logo',
      tools: 'Figma',
      collaborators: 'Charlie',
      website: '<a href="https://example.com/1" target="_blank">example.com/1</a>',
      img: '<img src="assets/img/design-cover/vol56-1.png" alt="VOL. 56 NO. 1" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'VOL. 56 NO. 2',
      year: '2023',
      kind: 'Web Design',
      tools: 'HTML, CSS, JS',
      collaborators: 'Dana',
      website: '<a href="https://example.com/2" target="_blank">example.com/2</a>',
      img: '<img src="assets/img/design-cover/vol56-2.png" alt="VOL. 56 NO. 2" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'VOL. 57 DOUBLE',
      year: '2024',
      kind: 'Book Cover',
      tools: 'InDesign',
      collaborators: 'Eve',
      website: '<a href="https://example.com/3" target="_blank">example.com/3</a>',
      img: '<img src="assets/img/design-cover/vol57-1.png" alt="VOL. 57 DOUBLE" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'X-JOURNAL',
      year: '2025',
      kind: 'App UI',
      tools: 'Sketch',
      collaborators: 'Frank',
      website: '<a href="https://example.com/4" target="_blank">example.com/4</a>',
      img: '<img src="assets/img/design-cover/x.png" alt="X-JOURNAL" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    }
  ];
  const d = data[type] || {title:'Unknown',year:'',kind:'',tools:'',collaborators:'',website:'',img:''};
  return `
    <h2>${d.title}</h2>
    ${d.img}
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="font-weight:bold;padding:4px 8px;">year</td><td style="padding:4px 8px;">${d.year}</td></tr>
      <tr><td style="font-weight:bold;padding:4px 8px;">kind</td><td style="padding:4px 8px;">${d.kind}</td></tr>
      <tr><td style="font-weight:bold;padding:4px 8px;">tools</td><td style="padding:4px 8px;">${d.tools}</td></tr>
      <tr><td style="font-weight:bold;padding:4px 8px;">collaborators</td><td style="padding:4px 8px;">${d.collaborators}</td></tr>
      <tr><td style="font-weight:bold;padding:4px 8px;">website</td><td style="padding:4px 8px;">${d.website}</td></tr>
    </table>
  `;
}