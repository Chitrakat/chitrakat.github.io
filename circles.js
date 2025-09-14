/*
_HY5_p5_hydra // cc teddavis.org 2024
pass p5 with type into hydra
docs: https://github.com/ffd8/hy5
*/

let libs = ['https://unpkg.com/hydra-synth', 'includes/libs/hydra-synth.js', 'https://cdn.jsdelivr.net/gh/ffd8/hy5@main/hy5.js', 'includes/libs/hy5.js']

// sandbox - start
H.pixelDensity(0.4) // 2x = retina, set <= 1 if laggy

let random1, random2, random3;

let maxCircle, minCircle;

let randShade, opacity;
let value = 100;
let o1 = 40;

let n1;

s0.initP5() // send p5 to hydra
P5.toggle(0) // hide p5

function preload() {
    n1 = random(0,1,0.1);
}

src(s0)
.add(src(o0).scale(0.91), 0.85)
.modulateScale(noize(0.1), 0.2, ) // 1, 0.1, (0.05), 0.08, 1 and 1 is sick 
.out()
// sandbox - end


function setup() {
	createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(14);
    noCursor();

    rectMode(CENTER);
	textAlign(CENTER, CENTER);

    random1 = random(width/3);
    random2 = random(width/3);
    random3 = random(width/3);

    maxCircle = windowHeight/5;
    minCircle = windowHeight/10;

    randShade = random(-20, 150);
    // randShade = 0;

    opacity = o1;
    // noMouseCursor();
}



function draw() {
    frameRate(14);
    opacity = o1; // reset opacity
    value = 100;

    if(mouseIsPressed){
        value = 255;
        opacity = 500;
        // frameCount *= 10;
        frameRate(3);
        randShade = random(-20, 150);
        clear();
    }
    // if(mouseReleased){
    //     frameRate(10);
    // }
    // else{
    //     value = 100;
    //     opacity = o1;
    // }
	blendMode(DIFFERENCE); // set blend mode to DIFFERENCE
    background(0, 40); // set background color with transparency

    // Colors 
	textSize(windowHeight/15);
    noStroke();

    let b = (sin(frameCount * 0.01) * 0.5 + 0.5) * 100 + randShade;
    fill(b, 0, 190-b, 40); 
    
    // Mouse Circles
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        circle(mouseX, mouseY, height/5);
        // circle(width-mouseX, height-mouseY, height/3);
    }
    
    // Middle Circle
    let rSize = (sin(frameCount * 0.025/1.5)) * maxCircle + minCircle;
    fill(100,0,b, 20);
    noStroke();
    circle(width/2, height/2, height/2 + rSize);

    // Moving texts
    let tx, ty;
    let fontSize = height/5;
    // fill(200);

    tx = constrain(noise(100 + frameCount * 0.0006) * width, 0, width);
    // Create moving objects if not already created
    if (!window.movingObjs) {
        window.movingObjs = [
            new movingObject(random(1000), random(1000), fontSize/2, 'design'),
            new movingObject(random(1000), random(1000), fontSize/2, 'photography'),
            new movingObject(random(1000), random(1000), fontSize/2, 'creative\ncoding'),
            // new movingObject(random(1000), random(1000), fontSize/2, 'drawing'),
            // new movingObject(random(1000), random(1000), fontSize/1.5, 'game\n design'),
            // new movingObject(random(1000), random(1000), fontSize/1.1, 'plotter'),
        ];
    }

    // Update each moving object
    for (let obj of window.movingObjs) {
        obj.update();
    }

    // Separate overlapping objects
    movingObject.separateAll(window.movingObjs);

    // Display each moving object
    for (let obj of window.movingObjs) {
        obj.display();
    }

    // addFuzzyNoise(0.00001); // Adjust the amount (0.01 - 0.2) for more/less noise
}

class movingObject{
    // Check and separate overlapping objects
    static separateAll(objs) {
        let maxTries = 10; // Prevent infinite loops
        for (let tries = 0; tries < maxTries; tries++) {
            let moved = false;
            for (let i = 0; i < objs.length; i++) {
                for (let j = i + 1; j < objs.length; j++) {
                    let a = objs[i];
                    let b = objs[j];
                    let dx = a.x - b.x;
                    let dy = a.y - b.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    let minDist = (a.size + b.size) * 0.45; // 0.45: text is not a circle, but this works visually
                    if (dist < minDist && dist > 0.1) {
                        // Move each object away from the other
                        let repulsionStrength = 2; // Increase for stronger repulsion
                        let overlap = (minDist - dist) / 2 * repulsionStrength;
                        let nx = dx / dist;
                        let ny = dy / dist;
                        a.x += nx * overlap;
                        a.y += ny * overlap;
                        b.x -= nx * overlap;
                        b.y -= ny * overlap;
                        moved = true;
                    }
                }
            }
            if (!moved) break;
        }
    }
    constructor(xNoiseSeed, yNoiseSeed, size, label) {
        this.xNoiseSeed = xNoiseSeed;
        this.yNoiseSeed = yNoiseSeed;
        this.size = size;
        this.label = label;
        this.x = 0;
        this.y = 0;
    }

    update() {
        // Use the same logic as the text movement
        this.x = constrain(noise(this.xNoiseSeed + frameCount * 0.06) * width, 0, width);
        this.y = constrain(noise(this.yNoiseSeed + frameCount * 0.0065) * height, 0, height);
    }

    display() {
        noStroke();

        // Calculate text box size
        textSize(this.size/1.5);
        let tw = textWidth(this.label);
        let th = this.size;

        // Draw text
        rectMode(CENTER);
        fill(100, opacity);
        // stroke(0)
        // strokeWeight(2);
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);
    }
}

// Handle window resizing for responsive canvas and elements
function windowResized() {
    resizeCanvas(windowWidth-10, windowHeight-10);
    H.pixelDensity(0.3);
    // Optionally, re-calculate any values that depend on width/height
    // e.g., update random1, random2, random3 if needed
}