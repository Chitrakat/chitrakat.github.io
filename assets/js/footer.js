// Footer generative sketch — p5 instance mode
// Mounted to #footer-canvas so it doesn't conflict with the landing page hero (circles.js).
// mouseX / mouseY are footer-canvas-local in instance mode.

new p5(function (p) {
  const FOOTER_HEIGHT = 300;
//   const r = FOOTER_HEIGHT / 10;
  const r = 20;
  let angles = [];
  let anglesV = [];

  function initArrays() {
    angles = [];
    anglesV = [];
    frameRate(20);
    // let div = p.random(1000, 10000);
    let div = 10000;
    // let total = p.floor(p.width / (r * 2));
    let total = 10;
    for (let i = 0; i < total; i++) { // Initialize angles and velocities for each square
      angles[i] = 100;
      anglesV[i] = 0.0009 + i / div;
    }
  }

  p.setup = function () {
    let canvas = p.createCanvas(p.windowWidth, FOOTER_HEIGHT);
    canvas.parent('footer-canvas');
    p.frameRate(60);
    p.background(255);
    initArrays();
  };

  p.draw = function () {
    p.translate(p.width / 2, p.height / 2);
    p.rotate(p.mouseX * 0.01);
    p.translate(p.mouseY , p.mouseY);

    p.fill(255);
    p.background(255, 255, 255, 7);
    // p.displayMode(HARD_LIGHT);

    for (let i = 0; i < angles.length; i++) {
      let y = p.map(i, 0, angles.length - 1, -p.height / 2, p.height / 2);
      let x = p.map(p.tan(angles[i]), -1, 1, -p.width / 2, p.width / 2);

      p.strokeWeight(1);
      p.stroke(255, 64, 129);
      p.square(x, y, r*2);

      angles[i] += anglesV[i];
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, FOOTER_HEIGHT);
    initArrays();
  };
}, 'footer-canvas');
