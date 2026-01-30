/*
_HY5_p5_hydra // cc teddavis.org 2024
pass p5 with type into hydra
docs: https://github.com/ffd8/hy5

made with hydra-synth.js + hy5.js + p5.js
edited by Suyash Chitrakar
*/

let libs = ['https://unpkg.com/hydra-synth', 'includes/libs/hydra-synth.js', 'https://cdn.jsdelivr.net/gh/ffd8/hy5@main/hy5.js', 'includes/libs/hy5.js']

// sandbox - start
H.pixelDensity(0.5) // 2x = retina, set <= 1 if laggy

let random1, random2, random3;

let maxCircle, minCircle;
let mouseCircleSize;

let randShade, randShade1, randShade2, opacity;
let value = 100;
let o1 = 40;

let n1;

s0.initP5() // send p5 to hydra
P5.toggle(0) // hide p5

src(s0)
.add(src(o0).scale(0.6), 0.4) // controls the "glow"
.modulateScale(noize(3), 0.9, 1 , 0.1) 
.out()
// 1, 0.1, (0.05), 0.08, 1 and 1 
// sandbox - end

function windowResized() {
    resizeCanvas(windowWidth-10, windowHeight-10);
    H.pixelDensity(0.5);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(20);

    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    random1 = random(width/3);
    random2 = random(width/3);
    random3 = random(width/3);

    maxCircle = windowHeight/7;
    minCircle = windowHeight/10;
    mouseCircleSize = height/4;
    
    randShade = random(100);
    randShade1 = random(100);
    randShade2 = random(100);
    opacity = o1;
}


function draw() {
    blendMode(HARD_LIGHT);
    if(mouseIsPressed){
        clear();
    }
    

    // Colors for mouse circles
    let r = (sin(frameCount * 0.01) * 1.5 + 0.5) * randShade;
    let g = (sin(frameCount * 0.003) * 0.5 + 0.5) * 10 + random(randShade1);
    let b = (sin(frameCount * 0.001) * 0.5 + 0.5) * 100 + randShade;
    fill(r, g, b, 70); 
    noStroke();
    
    // Mouse Circles
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        circle(mouseX, mouseY, mouseCircleSize);
        // circle(windowWidth-mouseX, windowHeight-mouseY, mouseCircleSize % 100);
    }
    

    // Middle Circle
    let b2 = ((sin(frameCount * 0.025) * 0.5 + 0.5) * randShade);
    console.log(b2);
    fill(180 -b2/2, 0, b2, 10);
    noStroke();

    let rSize = (sin(frameCount * 0.05)) * maxCircle + minCircle;
    circle(width/2, height/2, height/2 + rSize);


    // Moving texts
    let tx, ty;
    let fontSize = height/5;
    
    // fill(200);

    tx = constrain(noise(100 + frameCount * 0.0006) * width, 0, width);
    // Create moving objects if not already created
    if (!window.movingObjs) {
        window.movingObjs = [
            new movingObject(random(1000), random(1000), fontSize/2, 'Hi, I\'m Suyash'),
            // new movingObject(random(1000), random(1000), fontSize/2, 'Hi, I\'m Suyash'),
            
            new movingObject(random(1000), random(1000), fontSize/2, 'I\'m a'),
            new movingObject(random(1000), random(1000), fontSize/2, 'I\'m a'),
            new movingObject(random(1000), random(1000), fontSize/2, 'I\'m\n kinda lost'),
            new movingObject(random(1000), random(1000), fontSize/2, 'graphic\ndesigner'),
            new movingObject(random(1000), random(1000), fontSize/2, 'photographer'),
            new movingObject(random(1000), random(1000), fontSize/2, 'photographer'),
            new movingObject(random(1000), random(1000), fontSize/2, 'creative\ncoder'),
            new movingObject(random(1000), random(1000), fontSize/2, 'artist?'),
            new movingObject(random(1000), random(1000), fontSize/1.5, 'game\n designer'),
        ];
    }

    for (let obj of window.movingObjs) {
        obj.update();
    }
    for (let obj of window.movingObjs) {
        obj.display();
    }
    movingObject.separateAll(window.movingObjs);

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
                        let repulsionStrength = 1; // Increase for stronger repulsion
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
        this.xval = 0.006;
        this.yval = 0.00065;
    }

    update() {
        // Use the same logic as the text movement
        this.x = constrain(noise(this.xNoiseSeed + frameCount * this.xval) * width, 0, width);
        this.y = constrain(noise(this.yNoiseSeed + frameCount * this.yval) * height, 0, height);
    }

    display() {
        textSize(this.size/1.5);
        // Draw text
        rectMode(CENTER);
        fill(0);
        this.xval = 0.006;
        this.yval = 0.00065;
        stroke(0);
        strokeWeight(4);
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);
    }
}