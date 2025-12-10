let img;

function setup() {
  createCanvas(windowWidth,windowWidth);
  frameRate(0.5);
  ellipseMode(CORNER);
}

function preload(){
  img = loadImage("1 .jpg");
  img.resize(width,height);
}

function draw() {
  background(0);
  fill(255);
//   noStroke();
  
  let tilesX = 3 ;
  let tilesY = 3;
  let tileW = width/tilesX;
  let tileH = height/ tilesY;
  
  for(let x = 0; x<tilesX ; x++){
    for(let y = 0; y <tilesY ; y++){
		let selector = int(random(4));
		
		if (selector == 0){
			push();
			translate(x * tileW,y * tileH);
			fill(255,121,25);
			stroke(255,121,25);
			rect(0,0,tileW,tileH);
			pop();
		}
		else if(selector == 1){
			let sx =  int(x * tileW);
			let sy =  int(x * tileH);
			let sw =  int(tileW);
			let sh =  int(x * tileH);
		}
		else if(selector ==2){
			fill('#ffffff');
			stroke('#ffffff');
			rect(0,0,tileW,tileH);
		}
		else if (selector ==3){
			fill(255,121,25);
			stroke(255,121,25);
			ellipse(0,0,tileW , tileH);
		}
      
    }
  }
}