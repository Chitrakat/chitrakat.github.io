// design-p5.js
// p5.js version of the grid scroll effect

let frameWidth = 200;
let frameHeight = 280;
let frameGap = 40;
let offsetX = 0;
let offsetY = 0;
const scrollSpeed = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(6);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function randomColor(seed, alpha = 128) {
  // Simple seeded random color with alpha (0-255)
  let r = Math.abs(Math.sin(seed) * 16777215) % 256;
  let g = Math.abs(Math.cos(seed) * 16777215) % 256;
  let b = Math.abs(Math.sin(seed * 2) * 16777215) % 256;
  return color(r, g, b, alpha);
}

function draw() {
  background(0);
  let cols = ceil(width / (frameWidth + frameGap)) + 2;
  let rows = ceil(height / (frameHeight + frameGap)) + 2;
  let startCol = floor(offsetX / (frameWidth + frameGap));
  let startRow = floor(offsetY / (frameHeight + frameGap));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let gridX = (col + startCol) * (frameWidth + frameGap) - offsetX;
      let gridY = (row + startRow) * (frameHeight + frameGap) - offsetY;
      stroke(randomColor((col + startCol) * 1000 + (row + startRow), 128));
      rect(gridX, gridY, frameWidth, frameHeight);
    }
  }

  // Infinite scroll wrap
  let gridWidth = frameWidth + frameGap;
  let gridHeight = frameHeight + frameGap;
  offsetX = (offsetX + scrollSpeed) % gridWidth;
  offsetY = (offsetY + scrollSpeed) % gridHeight;
}
