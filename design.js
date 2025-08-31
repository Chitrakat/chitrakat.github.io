// design.js

const canvas = document.createElement('canvas');
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.background = 'black';
canvas.style.display = 'block';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

let frameWidth = 200;
let frameHeight = 280;
let frameGap = 40;

let offsetX = 0;
let offsetY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomColor(seed) {
    // Simple seeded random color
    let r = Math.abs(Math.sin(seed) * 16777215) % 256;
    let g = Math.abs(Math.cos(seed) * 16777215) % 256;
    let b = Math.abs(Math.sin(seed * 2) * 16777215) % 256;
    return `rgb(${r|0},${g|0},${b|0})`;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let cols = Math.ceil(canvas.width / (frameWidth + frameGap)) + 2;
    let rows = Math.ceil(canvas.height / (frameHeight + frameGap)) + 2;

    // Find top-left grid index based on offset
    let startCol = Math.floor(offsetX / (frameWidth + frameGap));
    let startRow = Math.floor(offsetY / (frameHeight + frameGap));

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let gridX = (col + startCol) * (frameWidth + frameGap) - offsetX;
            let gridY = (row + startRow) * (frameHeight + frameGap) - offsetY;

            // Random color per frame
            ctx.strokeStyle = randomColor((col + startCol) * 1000 + (row + startRow));
            ctx.lineWidth = 6;
            ctx.strokeRect(gridX, gridY, frameWidth, frameHeight);

            // Placeholder for image: you can draw an image here later
            // ctx.drawImage(img, gridX, gridY, frameWidth, frameHeight);
        }
    }
}

function animate() {
    drawGrid();
    requestAnimationFrame(animate);
}
animate();

// Infinite grid navigation with mouse near edges
const edgeMargin = 200;
const scrollSpeed = 5;

window.addEventListener('mousemove', (e) => {
    if (e.clientX < edgeMargin) {
        offsetX = Math.max(0, offsetX - scrollSpeed);
    } else if (e.clientX > canvas.width - edgeMargin) {
        offsetX += scrollSpeed;
    }
    if (e.clientY < edgeMargin) {
        offsetY = Math.max(0, offsetY - scrollSpeed);
    } else if (e.clientY > canvas.height - edgeMargin) {
        offsetY += scrollSpeed;
    }
});