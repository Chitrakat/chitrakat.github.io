/*
_HY5_p5_hydra // cc teddavis.org 2024
pass p5 with type into hydra
docs: https://github.com/ffd8/hy5

made with hydra-synth.js + hy5.js + p5.js
edited by Suyash Chitrakar
*/

let libs = ['https://unpkg.com/hydra-synth', 'includes/libs/hydra-synth.js', 'https://cdn.jsdelivr.net/gh/ffd8/hy5@main/hy5.js', 'includes/libs/hy5.js']

// sandbox - start
const DISPLAY_HYDRA_DENSITY = 0.4;
H.pixelDensity(DISPLAY_HYDRA_DENSITY) 

let random1, random2, random3;
let mouseBoo = false;

let maxCircle, minCircle;
let mouseCircleSize;

let randShade, randShade1, randShade2;
let value = 100;

let n1;

s0.initP5() // send p5 to hydra
P5.toggle(0) // hide p5

src(s0)
.add(src(o0).scale(3), 0.5) // controls the "glow"
.modulateScale(noize(2), 0.5, 1.5 , 10) 
.out()


// src(s0)
// .add(src(o0).scale(1), 0.01) // controls the "glow"
// .modulateScale(noize(1), 400, 2 , 100) 
// .out()
// 1, 0.1, (0.05), 0.08, 1 and 1 
// sandbox - end

function applyHydraDisplayResolution() {
    H.pixelDensity(DISPLAY_HYDRA_DENSITY);
    if (typeof H.setResolution === 'function') {
        H.setResolution(windowWidth, windowHeight);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    applyHydraDisplayResolution();
}

function randomizeScene() {
    random1 = random(width / 3);
    random2 = random(width / 3);
    random3 = random(width / 3);

    maxCircle = windowHeight / 10;
    minCircle = windowHeight / 20;
    mouseCircleSize = height / 14;

    randShade = random(100);
    randShade1 = random(100);
    randShade2 = random(100);

    window.movingObjs = null;
    clear();
    background(255);
}

window.refreshCircleSketch = randomizeScene;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    frameRate(15);

    applyHydraDisplayResolution();

    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    randomizeScene();
    blendMode(HARD_LIGHT);
    // blendMode(REMOVE);
}


function draw() {
    noStroke();
    // if(mouseBoo){
    //     clear();
    //     background(255);
    // }
    // if(mouseIsPressed){
    //     mouseBoo = !mouseBoo;
    // }

    if(mouseIsPressed){
        millis(500);
        clear();
        background(255);
    }
    
    // Colors for mouse circles
    let r = (sin(frameCount * 0.01) * 1.5 + 0.5) * randShade;
    let g = (sin(frameCount * 0.03) * 0.5 + 0.5) * random(50, 100) + random(randShade1);
    let b = (sin(frameCount * 0.01) * 0.5 + 0.5) * 100 + randShade;
    fill(r, g, b); 
    // stroke(255);
    // strokeWeight(2);
    circle(mouseX, mouseY, mouseCircleSize);
    // square(mouseX, mouseY, mouseCircleSize);

    // Middle SHAPE
    let b2 = ((sin(frameCount * 0.025) * 0.5 + 0.5) * random(randShade));
    let rSize = (sin(frameCount * 0.009)) * maxCircle + minCircle;
    fill(180-b2, (b2*200)%70, (b2*200)%180, 15);
    noStroke();
    // circle(width/2, height/2, random3 + rSize);
    square(width/2, height/2, random3 + rSize);

    // Moving texts
    let tx, ty;
    let fontSize = height/5;
    tx = constrain(noise(100 + frameCount * 0.0006) * width, 0, width);
    if (!window.movingObjs) {
        window.movingObjs = [
            new movingObject(random(1000), random(1000), fontSize/2, 'hi, i\'m Suyash'),
            new movingObject(random(1000), random(1000), fontSize/2, 'kinda lost'),
            new movingObject(random(1000), random(1000), fontSize/2, 'a graphic\ndesigner'),
            new movingObject(random(1000), random(1000), fontSize/4, 'overstimulated'),
            new movingObject(random(1000), random(1000), fontSize/4, 'caffeinated'),
            new movingObject(random(1000), random(1000), fontSize/2, 'photographer'),
            new movingObject(random(1000), random(1000), fontSize/2, 'creative\ncoder'),
            new movingObject(random(1000), random(1000), fontSize/2, 'an artist?'),
        ];
    }

    for (let obj of window.movingObjs) {
        obj.update();
        obj.display();
    }
}

class movingObject{
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
        // separateAll();
    }

    display() {
        textSize(this.size/1.5);
        // Draw text
        rectMode(CENTER);
        fill(255);
        stroke(0);
        strokeWeight(3);
        this.xval = 0.003;
        this.yval = 0.0065;
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);
    }
}