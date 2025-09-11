let frameWidth = 100;
let frameHeight = 140;
let frameGap = 24;

const gridCols = 7;
const gridRows = 3;
let gridRects = [];
let fadeAmounts = [];
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
  background(0);
  noFill();
  // Center grid
  let totalWidth = gridCols * frameWidth + (gridCols - 1) * frameGap;
  let totalHeight = gridRows * frameHeight + (gridRows - 1) * frameGap;
  let startX = (width - totalWidth) / 2;
  let startY = (height - totalHeight) / 2;
  gridRects = [];
  fadeAmounts = [];
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      let x = startX + col * (frameWidth + frameGap);
      let y = startY + row * (frameHeight + frameGap);
      gridRects.push({x, y, col, row, imgIdx: Math.floor(Math.random() * coverImages.length)});
      fadeAmounts.push(255); // fully black
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // recalculate grid positions
}

function randomColor(seed, alpha = 128) {
  let r = abs(sin(seed) * 16777215) % 256;
  let g = abs(cos(seed) * 16777215) % 256;
  let b = abs(sin(seed * 2) * 16777215) % 256;
  return color(r, g, b, alpha);
}

// No need for generateRectangles


function draw() {
  background(0);
  for (let i = 0; i < gridRects.length; i++) {
    let r = gridRects[i];
    let hovered = mouseX > r.x && mouseX < r.x + frameWidth && mouseY > r.y && mouseY < r.y + frameHeight;
    // Fade out black if hovered
    if (hovered) {
      fadeAmounts[i] = max(0, fadeAmounts[i] - 60); // fade out much faster
    } else {
      fadeAmounts[i] = min(255, fadeAmounts[i] + 10); // fade in
    }
    // Draw image
    if (coverImages[r.imgIdx]) {
      image(coverImages[r.imgIdx], r.x, r.y, frameWidth, frameHeight);
    }
    // Draw black overlay
    fill(0, fadeAmounts[i]);
    noStroke();
    rect(r.x, r.y, frameWidth, frameHeight);
  }
}

function mousePressed() {
  // Find which rectangle was clicked
  for (let i = 0; i < gridRects.length; i++) {
    let r = gridRects[i];
    if (mouseX > r.x && mouseX < r.x + frameWidth && mouseY > r.y && mouseY < r.y + frameHeight) {
      showPopup(r.imgIdx);
      break;
    }
  }
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