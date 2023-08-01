let tx, ty, tz, gap, rows, cols, depths;
let w3D, h3D, d3D;



function setup() {
	createCanvas(windowWidth,windowHeight,WEBGL);
	camera();
	
//	ortho();
	
	let cube = 100 ;
	
	tx = cube;
	ty = cube;
	tz = cube;
	
	gap = 50;
	
	rows = 5;
	cols = 5;
	depths = 5;
	
	theta = 0;
	
	w3D = tx * (cols-1);
	h3D = ty * (rows-1);
	d3D = tz * (depths-1);
	
}

function draw() {

	
	background(255);
	
	orbitControl();
	
	camera(0, 0, 400+mouseY/10 , 0, 0, 0, 0, 1, 0);


	
	rotateZ(theta/5+(mouseY/5500)); //OK
	rotateY(theta/5+(mouseX/5500)); //OK
	rotateX(theta/5); //OK
	
	
	
	translate(-w3D/2,-h3D/2, d3D/2);
	
	noFill()
	//fill(0);
	//noStroke();
	stroke(0);
	strokeWeight(0.5)
	
	for(let i=0;i<cols;i++){
		
		push();
		
		translate(tx*i,0,0);
		
		for(let j=0;j<rows;j++){
			push();
			translate(0,ty*j,0);
			
			for(let k=0;k<depths;k++){

				push();
				translate(0,0,(tz*k)-d3D);
			
				box(tx-gap,ty-gap,tz-gap);
				
				pop();
			}
			
			pop();
		}
		pop();
	}
	
	theta += 0.001;
	
	print(rows)
}