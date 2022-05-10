let cols = 150;
let rows = 150;
let nodes = Array(cols * rows);
let currentNodes = [];
let spaceNodes = [];
let startNode;
let endNode;
function init() {
	spaceNodes = [];
	currentNodes = [];
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let w = width / cols;
			let h = height / rows;
			let x = i * w;
			let y = j * h;
			let index = i + cols * j;
			let node = new Node(index, x, y, w, h);
			nodes[index] = node;
			if (mapImg.get(x, y) == "0,0,0,0") {
				node.obstacle = true;
			} else {
				spaceNodes.push(node);
			}
		}
	}
	
	startNode = spaceNodes[int(random(spaceNodes.length))];
	endNode = spaceNodes[int(random(spaceNodes.length))];
	
	startNode.distance = 0;
	currentNodes.push(startNode);
	loop();
	background(255);
}
function setup() {
	let container = "canvas-container";
	let cnv;
	if (window.innerWidth < window.innerHeight) {
		cnv = createCanvas(window.innerWidth, window.innerWidth);
	} else {
		cnv = createCanvas(window.innerHeight, window.innerHeight);
	}
	let div = document.querySelector("#" + container);
	div.style.height = height + 2 + "px";
	cnv.parent(container);
	mapImg.resize(width, height);
	noStroke();
	init();
}
function draw() {
	let find = [...currentNodes];
	currentNodes = [];
	for (let node of find) {
		node.pathfind();
	}
	image(mapImg, 0, 0);
	for (let node of nodes) {
		fill(255, 255, 0);
		node.render();
	}
}
function mousePressed() {
	if (mouseX > 0 && mouseX < width) {
		if (mouseY > 0 && mouseY < height) {
			init();
		}
	}
}
