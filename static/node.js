class Node {
	constructor(index, x, y, w, h) {
		this.i = index;
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.distance = cols * rows;
		this.isPath = false;
		this.visited = false;
		this.obstacle = false;
		this.neighbors = [];
		this.prevNode;
	}
	addNeighbors() {
		let top = this.i - cols;
		let right = (this.i + 1) % cols > 0 ? this.i + 1 : nodes.length;
		let bottom = this.i + cols;
		let left = (this.i - 1) % cols < cols - 1 ? this.i - 1 : nodes.length;
		let topRight = (top + 1) % cols > 0 ? top + 1 : nodes.length;
		let bottomRight = (bottom + 1) % cols > 0 ? bottom + 1 : nodes.length;
		let bottomLeft = (bottom - 1) % cols < cols - 1 ? bottom - 1 : nodes.length;
		let topLeft = (top - 1) % cols < cols - 1 ? top - 1 : nodes.length;
		let indices = [top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft];
		for (let index of indices) {
			if (nodes[index]) {
				let neighbor = nodes[index];
				if (!neighbor.visited && !neighbor.obstacle) {
					this.neighbors.push(neighbor);
				}
			}
		}
	}
	path() {
		this.isPath = true;
		if (this.prevNode) {
			this.prevNode.path();
		} else {
			noLoop();
		}
	}
	pathfind() {
		this.addNeighbors();
		for (let node of this.neighbors) {
			let totalDistance = this.distance + 1;
			if (node == endNode) {
				this.path();
			} else if (totalDistance < node.distance) {
				node.distance = totalDistance;
				node.prevNode = this;
				currentNodes.push(node);
			}
		}
		this.visited = true;
		this.neighbors = [];
	}
	render() {
		if (this.visited && this != startNode && this != endNode) {
			fill(0, 255, 0);
			rect(this.x, this.y, this.w, this.h);
		}
		if (this.isPath) {
			fill(255, 0, 0);
			rect(this.x, this.y, this.w, this.h);
		}
		if (this == startNode) {
			fill(0);
			rect(this.x, this.y, this.w, this.h);
		} else if (this == endNode) {
			fill(0, 0, 255);
			rect(this.x, this.y, this.w, this.h);
		}
	}
}