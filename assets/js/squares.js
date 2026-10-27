// Tangent-square sketch, drawn on top of the hero canvas by circles.js
const SQ_R = 50;
let sqAngles = [];
let sqAnglesV = [];

function initSquares() {
    const div = random(100, 1000);
    const total = floor(width / (SQ_R * 2));
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
    rotate(mouseX*0.3);
    // translate(mouseY, mouseY);

    noFill();
    strokeWeight(1);

    // stroke(255, 64, 129);
    stroke(random(255), 40);
    // stroke(255, random(10,100))

    for (let i = 0; i < sqAngles.length; i++) {
        const y = map(i, 0, sqAngles.length - 1, -height / 2, height / 2);
        const x = map(tan(sqAngles[i]), -1, 1, -width / 2, width / 2);
        square(x, y, SQ_R * 8);
        sqAngles[i] += sqAnglesV[i];
    }
    pop();
}
