/*
	_canvas_small // cc teddavis.org 2020
	demo for working with SMALLER canvas than fullscreen
	= set position of small canvas and disable windowResized
	bonus: press 'S' to saveGif!
*/

function setup() {
	let cvn = createCanvas(300, 300)
	cvn.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2)
	background(0) // set initial background to see diff to canvas
	windowResized = null // remove built-in resizing
}

function draw() {
	background(0, 0, 255, 15)
	stroke(255)
	noFill()
	beginShape()
	let lc = 8
	for(let i = 0; i < lc; i++) {
		let x = noise(i * 15 + frameCount * .01) * width
		let y = noise(i * 15 + frameCount * .011) * height
		vertex(x, y)
	}
	endShape(CLOSE)
}

function keyPressed() {
	if(key == 'S') { // uppercase S
	
		// save 2sec of animation! + show notifications for 1 sec
		saveGif('P5L_canvas_small', 2, {
			silent: false,
			notificationDuration: 1
		})
	}
}