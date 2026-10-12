// Footer generative sketch — p5 instance mode, mounted to #footer-canvas
// so it doesn't conflict with the landing page hero (circles.js).

new p5(function (p) {
  const FOOTER_HEIGHT = 300;
  const BALL_COUNT = 100;

  let balls = [];
  let maxSpeed = 1;
  let maxSize = 150;
  let bgOpacity = 9;
  let ballOpacity = 2;

  function randomBall(x, y) {
    return new Ball(x, y, p.random(-maxSpeed, maxSpeed), p.random(-maxSpeed, maxSpeed), maxSize);
  }

  function initBalls() {
    balls = [];
    for (let i = 0; i < BALL_COUNT; i++) {
      balls.push(randomBall(p.random(p.width), p.random(p.height)));
    }
  }

  p.setup = function () {
    let canvas = p.createCanvas(p.windowWidth, FOOTER_HEIGHT);
    canvas.parent('footer-canvas');
    p.background(255);
    p.blendMode(p.HARD_LIGHT);
    initBalls();
  };

  p.mouseMoved = function () {
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
      return;
    }
    balls.push(randomBall(p.mouseX, p.mouseY));
  };

  p.draw = function () {
    p.background(255, bgOpacity);

    for (let ball of balls) {
      ball.move();
      ball.bounce();
      ball.show();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, FOOTER_HEIGHT);
    p.background(255);
    initBalls();
  };

  class Ball {
    constructor(x, y, xspeed, yspeed, r) {
      this.x = x;
      this.y = y;
      this.xspeed = xspeed;
      this.yspeed = yspeed;
      this.r = r;
      this.rSize = p.random(this.r / 16, this.r);
    }

    move() {
      this.x += this.xspeed;
      this.y += this.yspeed;
    }

    // only bounces vertically so shapes can exit the sides
    bounce() {
      if (this.y > p.height || this.y < 0) {
        this.yspeed *= -1;
      }
    }

    show() {
      p.noStroke();
      p.rectMode(p.CENTER);
      p.fill(255, p.random(64), p.random(129), ballOpacity);
      p.square(this.x, this.y, this.rSize);
    }
  }
}, 'footer-canvas');
