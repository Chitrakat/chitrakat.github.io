// Tangent-square sketch, drawn on top of the hero canvas by circles.js
const SQ_R = 50;
let sqAngles = [];
let sqAnglesV = [];
let sqRot = 0;
let sqWeight = 1;
let sqSize = SQ_R * 8;

function initSquares() {
    const div = random(100, 1000);
    const r = random(30, 80); // randomized radius
    sqWeight = random(0.5, 3);
    sqSize = r * random(4, 10);
    sqRot = 0;
    const total = floor(width / (r * 2));
    sqAngles = [];
    sqAnglesV = [];
    for (let i = 0; i < total; i++) {
        sqAngles[i] = 0;
        sqAnglesV[i] = 1 + i / div;
    }
}

function drawSquares() {
    push();
    // blendMode(BLEND);
    translate(width / 2, height / 2);
    // smooth rotation: ease toward the mouse target instead of jumping
    sqRot = lerp(sqRot, mouseX * 0.3, 0.05);
    rotate(sqRot);
    // translate(mouseY, mouseY);

    noFill();
    strokeWeight(sqWeight);

    // stroke(255, 64, 129);
    stroke(random(255), random(20, 80));
    // stroke(255, random(10,100))

    for (let i = 0; i < sqAngles.length; i++) {
        const y = map(i, 0, sqAngles.length - 1, -height / 2, height / 2);
        const x = map(tan(sqAngles[i]), -1, 1, -width / 2, width / 2);
        square(x, y, sqSize);
        sqAngles[i] += sqAnglesV[i];
    }
    pop();
}
