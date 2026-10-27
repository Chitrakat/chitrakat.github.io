// Tangent-square sketch, drawn on top of the hero canvas by circles.js
const SQ_R = 50;
let sqAngles = [];
let sqAnglesV = [];
let sqRot = 0;
let sqWeight = 2;
let sqSize = SQ_R * 8;
let sqStroke;

function initSquares() {
    const r = random(35, 65);
    sqWeight = random(0.7, 1.4);
    sqSize = r * random(4, 7);
    sqStroke = color(random(100, 200), random(25, 45));
    sqRot = 0;
    const total = floor(width / (r * 2.5));
    sqAngles = [];
    sqAnglesV = [];
    for (let i = 0; i < total; i++) {
        sqAngles[i] = 0;
        sqAnglesV[i] = 0.004 + i * 0.0002;
    }
}

function drawSquares() {
    push();
    // blendMode(BLEND);
    translate(width / 2, height / 2);
    sqRot = lerp(sqRot, map(mouseX, 0, width, -0.12, 0.12), 0.04);
    rotate(sqRot);
    // translate(mouseY, mouseY);

    noFill();
    strokeWeight(sqWeight);
    stroke(sqStroke);

    for (let i = 0; i < sqAngles.length; i++) {
        const y = map(i, 0, sqAngles.length - 1, -height / 2, height / 2);
        const x = map(tan(sqAngles[i]), -1, 1, -width / 2, width / 2);
        square(x, y, sqSize);
        sqAngles[i] += sqAnglesV[i];
    }
    pop();
}
