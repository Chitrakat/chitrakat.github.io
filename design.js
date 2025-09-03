// Utility to enable/disable pointer events on the canvas
function setCanvasPointerEvents(enabled) {
  let c = document.querySelector('canvas');
  if (c) c.style.pointerEvents = enabled ? 'auto' : 'none';
}
let frameWidth = 200;
let frameHeight = 280;
let frameGap = 80;

let offsetX = 0;
let offsetY = 0;

// Remove mouse interaction, use smooth button navigation
const scrollSpeed = 0.15; // for lerp
let targetOffsetX = 0;


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
  'assets/img/design-cover/x.png',
  'assets/img/design-cover/lines.jpg'
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

function getHeaderHeight() {
  const header = document.querySelector('.main-header');
  return header ? header.offsetHeight : 0;
}

function setup() {
  let headerH = getHeaderHeight();
  createCanvas(windowWidth, windowHeight - headerH);
  noFill();
  // Move canvas below header
  let c = document.querySelector('canvas');
  if (c) c.style.position = 'absolute';
  if (c) c.style.top = headerH + 'px';
}

function windowResized() {
  let headerH = getHeaderHeight();
  resizeCanvas(windowWidth, windowHeight - headerH);
  let c = document.querySelector('canvas');
  if (c) c.style.top = headerH + 'px';
}

function randomColor(seed, alpha = 128) {
  let r = abs(sin(seed) * 16777215) % 256;
  let g = abs(cos(seed) * 16777215) % 256;
  let b = abs(sin(seed * 2) * 16777215) % 256;
  return color(r, g, b, alpha);
}

// No need for generateRectangles

function draw() {
  background(255);
  // Smoothly animate offsetX toward targetOffsetX
  offsetX = lerp(offsetX, targetOffsetX, scrollSpeed);

  // Infinite horizontal row, centered vertically, with dynamic spacing
  let coversCount = coverImages.length;
  let minScale = 0.5;
  let maxScale = 2.2; // much larger center
  let minAlpha = 60;
  let maxAlpha = 255;
  let centerY = height / 2;
  let centerX = width / 2;

  // How many covers to show (enough to fill screen)
  let visibleCovers = 9;
  let totalWidth = frameWidth + frameGap;
  let centerCol = Math.round(targetOffsetX / totalWidth);

  // Compute positions dynamically so no overlap
  let positions = [];
  let scales = [];
  let alphas = [];
  // Center cover
  positions[0] = centerX;
  scales[0] = maxScale;
  alphas[0] = maxAlpha;
  // To the right
  for (let i = 1; i <= Math.floor(visibleCovers/2); i++) {
    let norm = i / (visibleCovers/2);
    let scale = lerp(maxScale, minScale, norm);
    let alpha = lerp(maxAlpha, minAlpha, norm);
    let prevX = positions[i-1];
    let prevW = frameWidth * scales[i-1];
    let thisW = frameWidth * scale;
    let gap = frameGap * lerp(1, 0.7, norm);
    positions[i] = prevX + (prevW/2) + gap + (thisW/2);
    scales[i] = scale;
    alphas[i] = alpha;
  }
  // To the left
  for (let i = 1; i <= Math.floor(visibleCovers/2); i++) {
    let norm = i / (visibleCovers/2);
    let scale = lerp(maxScale, minScale, norm);
    let alpha = lerp(maxAlpha, minAlpha, norm);
    let prevX = positions[-(i-1)] !== undefined ? positions[-(i-1)] : positions[0];
    let prevW = frameWidth * (scales[-(i-1)] !== undefined ? scales[-(i-1)] : scales[0]);
    let thisW = frameWidth * scale;
    let gap = frameGap * lerp(1, 0.7, norm);
    positions[-i] = prevX - (prevW/2) - gap - (thisW/2);
    scales[-i] = scale;
    alphas[-i] = alpha;
  }

  imageMode(CENTER);
  for (let i = -Math.floor(visibleCovers/2); i <= Math.floor(visibleCovers/2); i++) {
    let gridCol = centerCol + i;
    let imgIdx = ((gridCol % coversCount) + coversCount) % coversCount;
    let img = coverImages[imgIdx];
    let scale = scales[i];
    let alpha = alphas[i];
    let boxW = frameWidth * scale;
    let boxH = frameHeight * scale;
    let boxCenterY = centerY;
    let boxCenterX = positions[i];
    if (boxCenterX + boxW/2 < 0 || boxCenterX - boxW/2 > width) continue;
    // Draw box
    noFill();
    noStroke();
    rectMode(CENTER);
    rect(boxCenterX, boxCenterY, boxW, boxH);
    rectMode(CORNER);
    // Draw image
    if (img) {
      let imgScale = Math.min(boxW / img.width, boxH / img.height, 1);
      let drawW = img.width * imgScale;
      let drawH = img.height * imgScale;
      push();
      tint(255, alpha);
      image(img, boxCenterX, boxCenterY, drawW, drawH);
      pop();
    }
  }
  imageMode(CORNER);

  // Infinite row navigation with mouse near edges (horizontal only)
  if (mouseX < edgeMargin) {
    offsetX = max(0, offsetX - scrollSpeed);
  } else if (mouseX > width - edgeMargin) {
    offsetX += scrollSpeed;
  }
}

// Remove mouse interaction for carousel
// Add button event listeners for carousel navigation
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function() {
    const leftBtn = document.getElementById('carousel-left');
    const rightBtn = document.getElementById('carousel-right');
    let totalWidth = frameWidth + frameGap;
    if (leftBtn) {
      leftBtn.onclick = function() {
        targetOffsetX -= totalWidth;
      };
    }
    if (rightBtn) {
      rightBtn.onclick = function() {
        targetOffsetX += totalWidth;
      };
    }
  });
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
  content.style.maxHeight = '75vh';
  content.style.overflowY = 'visible';
  content.style.width = '90vw';
  content.style.maxWidth = '1200px';
  content.style.minHeight = '400px';
  content.style.padding = '0';
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
    setCanvasPointerEvents(false); // Disable canvas interaction when popup is open
  }
}

function hidePopup() {
  popupVisible = false;
  let popup = document.getElementById('custom-popup');
  if (popup) popup.style.display = 'none';
  setCanvasPointerEvents(true); // Enable canvas interaction when popup is closed
}

function getPopupContent(type) {
  // Table data for each type, with images and updated titles
  const data = [
    {
      title: 'Catch Magazine: VOL. 55 NO. 2',
      year: '2023',
      kind: 'Book Design, Spread Design, Typography, Layout, Stickers',
      tools: 'InDesign, Photoshop, Illustrator',
      collaborators: 'none',
      website: '<a href="https://www.knoxcatch.org/vol-55-no-2" target="_blank">link</a>',
      img: '<img src="assets/img/design-cover/vol55-2.png" alt="VOL. 55 NO. 2" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'Catch Magazine: VOL. 56 NO. 1',
      year: '2023',
      kind: 'Book Design, Spread Design, Typography, Layout',
      tools: 'InDesign, Photoshop, Illustrator',
      collaborators: 'none',
      website: '<a href="https://www.knoxcatch.org/vol-56-no-1" target="_blank">link</a>',
      img: '<img src="assets/img/design-cover/vol56-1.png" alt="VOL. 56 NO. 1" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'Catch Magazine: VOL. 56 NO. 2',
      year: '2024',
      kind: 'Book Design, Spread Design, Typography, Layout,',
      tools: 'InDesign, Photoshop, Illustrator',
      collaborators: 'Kevin Kox, 26',
      website: '<a href="https://www.knoxcatch.org/vol-56-no-2" target="_blank">link</a>',
      img: '<img src="assets/img/design-cover/vol56-2.png" alt="VOL. 56 NO. 2" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'Catch Magazine: VOL. 57 NO. 1 and VOL. 57 NO. 2',
      year: '2025',
      kind: 'Layout Design, Typography',
      tools: 'InDesign, Photoshop, Illustrator',
      collaborators: 'Eve',
      website: '<a href="https://www.knoxcatch.org/vol-57-no-1" target="_blank">link</a>',
      img: '<img src="assets/img/design-cover/vol57-1.png" alt="VOL. 57 DOUBLE" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'X-JOURNAL',
      year: '2025',
      kind: 'Art Photographer, Book Design, Spread Design, Typography, Layout',
      tools: 'InDesign, Photoshop, Illustrator',
      collaborators: 'none',
      website: '<a href="https://example.com/4" target="_blank">example.com/4</a>',
      img: '<img src="assets/img/design-cover/x.png" alt="X-JOURNAL" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    },
    {
      title: 'Lines in The Shed, Ryan Tracy',
      year: '2025',
      kind: 'Typography, Book Design, Product Photography',
      tools: 'InDesign, Photoshop, Illustrator',
      collaborators: 'none',
      website: '<a href="https://www.ryantracy.com/books" target="_blank">link</a>',
      img: '<img src="assets/img/design-cover/lines.jpg" alt="Lines in The Shed" style="width:100%;margin-bottom:12px;border-radius:8px;">'
    }
  ];
  const d = data[type] || {title:'Unknown',year:'',kind:'',tools:'',collaborators:'',website:'',img:''};
  return `
    <div style="display:flex;flex-direction:row;align-items:stretch;width:90vw;max-width:1200px;height:75vh;min-height:400px;gap:40px;box-sizing:border-box;">
      <div style="flex:1;min-width:0;max-width:25vw;overflow:auto;box-sizing:border-box;padding:40px 16px 40px 40px;background:rgba(255,255,255,0.98);z-index:1;">
        <h2 style='margin-top:0;font-size:2.1em;'>${d.title}</h2>
        <table style="width:100%;border-collapse:separate;border-spacing:0 8px;">
          <tr style="border-bottom:1px solid #000000ff;"><td style="font-weight:bold;padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">year</td><td style="padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">${d.year}</td></tr>
          <tr style="border-bottom:1px solid #000000ff;"><td style="font-weight:bold;padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">kind</td><td style="padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">${d.kind}</td></tr>
          <tr style="border-bottom:1px solid #000000ff;"><td style="font-weight:bold;padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">tools</td><td style="padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">${d.tools}</td></tr>
          <tr style="border-bottom:1px solid #000000ff;"><td style="font-weight:bold;padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">collaborators</td><td style="padding:8px 12px;vertical-align:top;border-bottom:1px solid #eee;">${d.collaborators}</td></tr>
          <tr><td style="font-weight:bold;padding:8px 12px;vertical-align:top;">website</td><td style="padding:8px 12px;vertical-align:top;">${d.website}</td></tr>
        </table>
      </div>
      <div style="flex:3;min-width:0;max-width:65vw;display:flex;align-items:center;justify-content:center;overflow:hidden;box-sizing:border-box;padding:40px 40px 40px 0;">
        <img src="${d.img.match(/src=\"([^\"]+)/)[1]}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;box-shadow:none;display:block;background:#fff;border-radius:12px;" />
      </div>
    </div>
  `;
}
