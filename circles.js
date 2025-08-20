/*
	_HY5_p5_hydra // cc teddavis.org 2024
	pass p5 with type into hydra
	docs: https://github.com/ffd8/hy5
*/

let libs = ['https://unpkg.com/hydra-synth', 'includes/libs/hydra-synth.js', 'https://cdn.jsdelivr.net/gh/ffd8/hy5@main/hy5.js', 'includes/libs/hy5.js']

// sandbox - start
H.pixelDensity(0.3) // 2x = retina, set <= 1 if laggy

let random1, random2, random3;

s0.initP5() // send p5 to hydra
P5.toggle(0) // hide p5

src(s0)
.add(src(o0).scale(0.91), .9)
.modulateScale(noize(1), 0.1) // 1, 0.1, (0.05), 0.08, 1 and 1 is sick 
.out()
// sandbox - end

function setup() {
	createCanvas(windowWidth - 10, windowHeight - 10);
    background(0);
    frameRate(20);

    rectMode(CENTER);
	textAlign(CENTER, CENTER);

    random1 = random(width/3);
    random2 = random(width/3);
    random3 = random(width/3);
}

function draw() {
	clear();
	blendMode(DIFFERENCE); // set blend mode to DIFFERENCE
    background(0, 200); // set background color with transparency

    // Colors 
	textSize(height/10);
    noStroke();

    let b = (sin(frameCount * 0.01) * 0.5 + 0.5) * 150;
    fill(b, 0, 190-b, 150); 
    
    // Mouse Circles
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        circle(mouseX, mouseY, height/5);
        circle(width-mouseX, height-mouseY, height/3);
    }
    
    // Middle Circle
    let rSize = (sin(frameCount * 0.0025) * 0.5 + 0.5) * 330;
    fill(100,0,b, 100);
    noStroke();
    circle(width/2, height/2, height/2 + rSize);

    // Moving texts
    let tx, ty;
    fill(255, 200);
    // text('design', tx , ty );   
    // noFill();
    // stroke(255);
    // strokeWeight(1);

    // DESIGN
    tx = constrain(noise(100 + frameCount * 0.0006) * width, 0, width);
    // Create moving objects if not already created
    if (!window.movingObjs) {
        window.movingObjs = [
            new movingObject(100, 200, 100, 'design'),
            new movingObject(300, 400, 100, 'photos'),
            new movingObject(500, 600, 100, 'p5')
        ];
    }

    // Update and display each moving object
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
    }

    update() {
        // Use the same logic as the text movement
        this.x = constrain(noise(this.xNoiseSeed + frameCount * 0.006) * width, 0, width);
        this.y = constrain(noise(this.yNoiseSeed + frameCount * 0.0065) * height, 0, height);
    }

    display() {
        noStroke();

        // Calculate text box size
        textSize(this.size/1.5);
        let tw = textWidth(this.label);
        let th = this.size;

        // Draw text
        rectMode(CENTER);fill(255);
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
