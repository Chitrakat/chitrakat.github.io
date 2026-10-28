/*
_HY5_p5_hydra // cc teddavis.org 2024
pass p5 with type into hydra
docs: https://github.com/ffd8/hy5

made with hydra-synth.js + hy5.js + p5.js
edited by Suyash Chitrakar
*/

const DISPLAY_HYDRA_DENSITY = 0.9;

const DECOY_COUNT = 2;

const WORD_INTERVAL = 2000;
const MAX_WORDS = 10;
const WORD_LIFETIME = 8000;
const WORD_BLACK_MS = 1580;
const MOUSE_TRAIL_INTERVAL = 50;

let libs = ['https://unpkg.com/hydra-synth', 'includes/libs/hydra-synth.js', 'https://cdn.jsdelivr.net/gh/ffd8/hy5@main/hy5.js', 'includes/libs/hy5.js']

H.pixelDensity(DISPLAY_HYDRA_DENSITY) 

let random1, random2, random3;
let mouseBoo = false;
let lastMouseTrailAt = 0;
window.mouseDraggedEnabled = true;
window.mouseMovedEnabled = false;

let maxCircle, minCircle;
let mouseCircleSize;
let mouseCircleWaveAmount = 0.5;

let randShade, randShade1, randShade2;
let value = 100;

let n1;

s0.initP5() // send p5 to hydra
P5.toggle(0) // hide p5

src(s0)
.add(src(o0).scale(0.07), 0.2) // controls the "glow", how intense reapet happens
.modulateScale(noize(3.2), 0.8, 1 , 10) 
.out()

// src(s0)
// .add(src(o0).scale(0.07), 0.2) // controls the "glow", how intense reapet happens
// .modulateScale(noize(5), 0.5, 1 , 10) 
// .out()


function applyHydraDisplayResolution() {
    H.pixelDensity(DISPLAY_HYDRA_DENSITY);
    if (typeof H.setResolution === 'function') {
        H.setResolution(windowWidth, windowHeight);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    applyHydraDisplayResolution();
    // Re-bind the source so its texture is reallocated at the new canvas size
    s0.initP5();
    P5.toggle(0);
    initSquares();
}

function randomizeScene() {
    random1 = random(width / 3);
    random2 = random(width / 3);
    random3 = random(width / 3);

    maxCircle = windowHeight / 5;
    minCircle = windowHeight / 20;
    mouseCircleSize = height / 6;

    randShade = random(100);
    randShade1 = random(100);
    randShade2 = random(100);
    mouseCircleWaveAmount = random(0.3, 0.7);

    window.movingObjs = null;
    decoys = null;
    clear();
    background(255);
}

window.refreshCircleSketch = randomizeScene;

function keyPressed() {
    if (event && (event.ctrlKey || event.metaKey || event.altKey)) return;
    if (key === '1') {
        const btn = document.getElementById('drag-toggle-btn');
        if (btn) btn.click();
        return;
    }
    if (key !== 'r' && key !== 'R') return;
    // Only reset while the hero page is in view
    if (window.scrollY > windowHeight / 2) return;
    randomizeScene();
}

function setup() {
    const heroCanvas = createCanvas(windowWidth, windowHeight);
    heroCanvas.parent('page1');
    background(255);
    frameRate(14);

    applyHydraDisplayResolution();

    strokeCap(SQUARE);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    randomizeScene();
    initSquares();
    blendMode(HARD_LIGHT);
}


function draw() {
    drawSquares();
    noStroke();















    // ==================== Mouse Circles ==========================
    blendMode(DIFFERENCE);
    let r = (sin(frameCount * 0.01) * 1.5 + 0.5) * randShade;
    let g = (sin(frameCount * 0.03) * 0.5 + 0.5) * random(50, 100) + random(randShade1);
    let b = (sin(frameCount * 0.01) * 0.5 + 0.5) * 100 + randShade;
    
    if (width>1080) {
        mouseCircleSize = 1.5*height / 4;
        
        fill(g, r, b, 20); 
    } else {
        mouseCircleSize = height / 10;
        fill(g, r, b, 20); 
    }
    
    let mouseWavePhase = frameCount * 0.03;
    let mouseWaveX = sin(mouseWavePhase) * mouseCircleSize * mouseCircleWaveAmount;
    let mouseWaveY = cos(mouseWavePhase) * mouseCircleSize * mouseCircleWaveAmount;
    circle(mouseX + mouseWaveX, mouseY + mouseWaveY, mouseCircleSize);
    // rect(mouseX + mouseWaveX, mouseY + mouseWaveY, mouseCircleSize);
    drawDecoyCircles(g, r, b);

















    // ======================= Middle CICRLE =========================
    blendMode(HARD_LIGHT);
    let b2 = ((sin(frameCount * 0.05) * 0.5 + 40) * random(randShade));
    let rSize = (sin(frameCount * 0.009)) * maxCircle + minCircle;
    // print   (rSize);
    fill(180-b2, (b2*20)%100, (b2*200)%180, 10);
    noStroke();
    circle(width/2 +rSize, height/2, random3 + rSize);
    
















    // Moving texts
    let tx, ty;
    let fontSize = height/3.5;
    tx = constrain(noise(100 + frameCount * 0.06) * width, 0, width);
    if (!window.movingObjs) {
        window.movingObjs = [
            new movingObject(random(1000), random(1000), fontSize/2, 'Hi, I\'m Suyash'),
            new movingObject(random(1000), random(1000), fontSize/2, 'kinda lost'),
            new movingObject(random(1000), random(1000), fontSize/2, 'in the surreal'),
            new movingObject(random(1000), random(1000), fontSize/2, 'designer'),
            new movingObject(random(1000), random(1000), fontSize/2, 'seeking security'),
            new movingObject(random(1000), random(1000), fontSize/2, 'who am i?'),
            new movingObject(random(1000), random(1000), fontSize/2, 'technologist'),
            new movingObject(random(1000), random(1000), fontSize/4, 'overstimulated'),
            new movingObject(random(1000), random(1000), fontSize/4, 'caffeinated'),
            new movingObject(random(1000), random(1000), fontSize/4, 'photographer?'),
            new movingObject(random(1000), random(1000), fontSize/4, 'anxious'),
            new movingObject(random(1000), random(1000), fontSize/2, 'photographer'),
            new movingObject(random(1000), random(1000), fontSize/2, 'creative\ncoder'),
            new movingObject(random(1000), random(1000), fontSize/2, 'artist?'),
            new movingObject(random(1000), random(1000), fontSize/2, 'hopeful?'),
            new movingObject(random(1000), random(1000), fontSize/3, 'immigrant'),
            new movingObject(random(1000), random(1000), fontSize/3, '#openToWork'),
        ];
    }






    updateWordSchedule(window.movingObjs);





    for (let obj of window.movingObjs) {
        if (obj.state === 'hidden') continue;
        obj.update();
        obj.display();
    }
}

// Decoy circles: each reacts to the mouse in its own unpredictable way
let decoys = null;

function makeDecoys() {
    decoys = [];
    for (let i = 0; i < DECOY_COUNT; i++) {
        decoys.push({
            x: random(width), y: random(height),
            mode: floor(random(5)),
            lag: random(0.02, 0.12),
            seed: random(1000),
            orbit: random(80, min(width, height) / 2),
            dir: random() < 0.5 ? -1 : 1,
            size: random(0.3, 1.4),
            chaos: random(0.2, 0.5),
            vx: random(-3, 3),
            vy: random(-3, 3)
        });
    }
}

function drawDecoyCircles(g, r, b) {
    if (!decoys) makeDecoys();
    const t = frameCount;
    const mouseDX = mouseX - pmouseX;
    const mouseDY = mouseY - pmouseY;
    const speed = dist(mouseX, mouseY, pmouseX, pmouseY);
    for (let i = 0; i < decoys.length; i++) {
        const d = decoys[i];
        let tx, ty;
        switch (d.mode) {
            case 0: // mirrored through the center
                tx = width - mouseX; ty = height - mouseY; break;
            case 1: // orbits the cursor, radius pulses with speed
                tx = mouseX + cos(t * 0.03 * d.dir + d.seed) * (d.orbit + speed * 3);
                ty = mouseY + sin(t * 0.03 * d.dir + d.seed) * (d.orbit + speed * 3);
                break;
            case 2: // drawn to a drifting point, mouse only nudges it
                tx = noise(d.seed, t * 0.004) * width * 0.7 + mouseX * 0.3;
                ty = noise(d.seed + 50, t * 0.004) * height * 0.7 + mouseY * 0.3;
                break;
            case 3: // swapped axes
                tx = mouseY / height * width; ty = mouseX / width * height; break;
            default: // flees the cursor, then wanders
                tx = d.x + (d.x - mouseX) * 0.05 + (noise(d.seed, t * 0.02) - 0.5) * 60;
                ty = d.y + (d.y - mouseY) * 0.05 + (noise(d.seed + 9, t * 0.02) - 0.5) * 60;
        }

        const wobbleX = (noise(d.seed + 100, t * 0.07) - 0.5) * 18 * d.chaos;
        const wobbleY = (noise(d.seed + 200, t * 0.07) - 0.5) * 18 * d.chaos;
        const pull = d.lag * (0.35 + noise(d.seed, t * 0.04));
        d.vx = d.vx * 0.78 + (tx - d.x) * pull + wobbleX;
        d.vy = d.vy * 0.78 + (ty - d.y) * pull + wobbleY;

        if (speed > 8 && random() < 0.12) {
            d.vx += mouseDX * random(0.4, 1.2);
            d.vy += mouseDY * random(0.4, 1.2);
        }
        if (random() < 0.025) {
            d.vx += random(-12, 12) * d.chaos;
            d.vy += random(-12, 12) * d.chaos;
        }
        if (random() < 0.008) d.mode = floor(random(5));

        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > width) {
            d.x = constrain(d.x, 0, width);
            d.vx *= -0.8;
        }
        if (d.y < 0 || d.y > height) {
            d.y = constrain(d.y, 0, height);
            d.vy *= -0.8;
        }

        fill((i % 2 ? g : b) + random(30), (i % 3 ? r : g), (i % 2 ? b : r), 30);
        circle(d.x, d.y, mouseCircleSize * d.size * (0.6 + noise(d.seed, t * 0.02)));
    }
}

let nextAppear = 0;

function updateWordSchedule(objs) {
    const now = millis();
    if (!objs[0].initialized) {
        objs.forEach(o => { o.state = 'hidden'; o.initialized = true; });
        objs[0].state = 'visible';
        objs[0].shownAt = now;
        nextAppear = now + WORD_INTERVAL;
    }

    // finish words that have been black long enough
    for (let o of objs) {
        if (o.state === 'fading' && now - o.fadeStart >= WORD_BLACK_MS) o.state = 'hidden';
    }

    // censor words whose lifetime is up
    for (let o of objs) {
        if (o.state === 'visible' && now - o.shownAt >= WORD_LIFETIME) {
            o.state = 'fading';
            o.fadeStart = now;
        }
    }

    if (now >= nextAppear) {
        const visibleCount = objs.filter(o => o.state === 'visible').length;
        const pool = objs.filter(o => o.state === 'hidden');
        if (visibleCount < MAX_WORDS && pool.length) {
            const o = random(pool);
            o.state = 'visible';
            o.shownAt = now;
        }
        nextAppear = now + WORD_INTERVAL;
    }
}


// Block text selection while dragging inside the hero (canvas or anything over it)
(function () {
    let dragging = false;
    document.addEventListener('mousedown', (e) => {
        const hero = document.getElementById('page1');
        const startedInHero = hero && hero.contains(e.target);
        const startedOnDragToggle = e.target instanceof Element && e.target.closest('#drag-toggle-btn');
        if (startedInHero || startedOnDragToggle) {
            dragging = true;
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
        }
    });
    document.addEventListener('mouseup', () => {
        dragging = false;
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
    });
    document.addEventListener('selectstart', (e) => {
        if (dragging) e.preventDefault();
    });
    document.addEventListener('dragstart', (e) => {
        if (dragging) e.preventDefault();
    });
})();

function drawMouseTrail() {
    const now = millis();
    if (lastMouseTrailAt && now - lastMouseTrailAt < MOUSE_TRAIL_INTERVAL) return;
    lastMouseTrailAt = now;
    // strokeCap(ROUND);

    blendMode(SCREEN);
    // stroke(random(0,255), random(90,210));
    // stroke(random(30, 255));
    
    stroke(255, 130);
    // strokeWeight(1);
    noFill();


    if(width>720){
        strokeWeight(random(1,30));
    } else {
        strokeWeight(random(1,30));
    }


    // rotate(random(-0.06,0.06));
    // RectMode(CENTER);
    rect(mouseX, mouseY, random(width-100 ), random(height-100));
    
    // strokeWeight(random(1, 10));
    line(random(width), random(height), mouseX, mouseY);

}

function mouseMoved() {
    if (!window.mouseMovedEnabled) return;
    drawMouseTrail();
}

function mouseDragged() {
    drawMouseTrail();
}

class movingObject{
    constructor(xNoiseSeed, yNoiseSeed, size, label) {
        this.xNoiseSeed = xNoiseSeed;
        this.yNoiseSeed = yNoiseSeed;
        this.size = size;
        this.label = label;
        this.x = random(width + 100, width - 100);
        this.y = random(height + 100, height - 100);
        
        this.yval = 0.007;
        this.xval = 0.007;
    }

    update() {
        // Use the same logic as the text movement
        this.x = constrain(noise(this.xNoiseSeed + frameCount * this.xval) * width, 0, width);
        this.y = constrain(noise(this.yNoiseSeed + frameCount * this.yval) * height, 0, height);
    }

    display() {
        textSize(this.size);
        // Draw text
        rectMode(CENTER);
        fill(255);
        stroke(0, 120);
        strokeWeight(3);
        textAlign(CENTER, CENTER);
        if (this.state === 'fading') {
            // censor bar fades in over the word's bounding box while the text fades out
            const k = constrain((millis() - this.fadeStart) / (WORD_BLACK_MS / 2), 0, 1);
            const lines = this.label.split('\n');
            const w = Math.max(...lines.map(l => textWidth(l))) + 24;
            const h = lines.length * textSize() * 1.2 + 12;
            fill(255, 255 * (1 - k));
            stroke(0, 120 * (1 - k));
            text(this.label, this.x, this.y);
            fill(200, 255 * k);
            noStroke();
            rect(this.x, this.y, w, h);
            return;
        }
        text(this.label, this.x, this.y);
    }
}