let projectW = true;
let WProj = 1;
let ZProj = 1700;

class vector4{
	constructor(x = 0, y = 0, z = 0, w = 0){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
	getMag(){
		let result = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2));
		return result;
	}
	shift(vector){
		let result = new vector4();

		result.x = this.x + vector.x;
		result.y = this.y + vector.y;
		result.z = this.z + vector.z;
		result.w = this.w + vector.w;

		return result;
	}
	scale(factor){
		let result = new vector4();

		result.x = this.x * factor;
		result.y = this.y * factor;
		result.z = this.z * factor;
		result.w = this.w * factor;

		return result;
	}
	matMult(matrix){
		let result = new vector4();

		result.x += matrix.matrix[0][0] * this.x;
		result.x += matrix.matrix[0][1] * this.y;
		result.x += matrix.matrix[0][2] * this.z;
		result.x += matrix.matrix[0][3] * this.w;

		result.y += matrix.matrix[1][0] * this.x;
		result.y += matrix.matrix[1][1] * this.y;
		result.y += matrix.matrix[1][2] * this.z;
		result.y += matrix.matrix[1][3] * this.w;

		result.z += matrix.matrix[2][0] * this.x;
		result.z += matrix.matrix[2][1] * this.y;
		result.z += matrix.matrix[2][2] * this.z;
		result.z += matrix.matrix[2][3] * this.w;

		result.w += matrix.matrix[3][0] * this.x;
		result.w += matrix.matrix[3][1] * this.y;
		result.w += matrix.matrix[3][2] * this.z;
		result.w += matrix.matrix[3][3] * this.w;

		return result;
	}
}



class matrix4{
	constructor(row1 = [0, 0, 0, 0], row2 = [0, 0, 0, 0], row3 = [0, 0, 0, 0], row4 = [0, 0, 0, 0]){
		this.matrix = [row1, row2, row3, row4];
	}
	scale(factor){
		let result = new matrix4
		for(let i = 0; i < 4; i++){
			for(let j = 0; j < 4; j++){
				result.matrix[i][j] = this.matrix[i][j] * factor;
			}
		}
		return result;
	}
	mult(matrix){
		let result = new matrix4();
		for(let i = 0; i < 4; i++){
			for(let j = 0; j < 4; j++){
				for(let a = 0; a < 4; a++){
					result.matrix[i][j] += this.matrix[i][a] * matrix.matrix[a][j];
				}
			}
		}
		return result;
	}
}



class object{
	constructor(vrtx = [], edge = []){
		this.vrtx = vrtx;
		this.edge = edge;
	}
	addVertex(vertex){
		this.vrtx.push(vertex);
	}
	addEdge(vrtx1, vrtx2){
		this.edge.push([vrtx1, vrtx2]);
	}
	scale(factor){
		let result = new object();

		for(let i = 0; i < this.vrtx.length; i++){
			result.addVertex(this.vrtx[i].scale(factor));
		}
		result.edge = this.edge.slice();

		return result;
	}
	shift(vector){
		let result = new object();

		for(let i = 0; i < this.vrtx.length; i++){
			result.addVertex(this.vrtx[i].shift(vector));
		}
		result.edge = this.edge.slice();

		return result;
	}
	matMult(matrix){
		let result = new object;

		for(let i = 0; i < this.vrtx.length; i++){
			result.addVertex(this.vrtx[i].matMult(matrix));
		}
		result.edge = this.edge.slice();

		return result;
	}
	draw(ctx, translation, color, width){
		for(let i = 0; i < this.edge.length; i++){
			let p;
			let vrtx1 = this.vrtx[this.edge[i][0]];
			if(projectW == true){
				p = WProj / (vrtx1.w + translation.w);
				vrtx1 = vrtx1.matMult(new matrix4(
					[p, 0, 0, 0],
					[0, p, 0, 0],
					[0, 0, p, 0],
					[0, 0, 0, 0]
				));
			}
			p = ZProj / (vrtx1.z + translation.z);
			vrtx1 = vrtx1.matMult(new matrix4(
				[p, 0, 0, 0],
				[0, p, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			));

			let vrtx2 = this.vrtx[this.edge[i][1]];
			if(projectW == true){
				p = WProj / (vrtx2.w + translation.w);
				vrtx2 = vrtx2.matMult(new matrix4(
					[p, 0, 0, 0],
					[0, p, 0, 0],
					[0, 0, p, 0],
					[0, 0, 0, 0]
				));
			}
			p = ZProj / (vrtx2.z + translation.z);
			vrtx2 = vrtx2.matMult(new matrix4(
				[p, 0, 0, 0],
				[0, p, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			));

			vrtx1.scale(width / 800);
			vrtx2.scale(width / 800);
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.moveTo(vrtx1.x + translation.x, vrtx1.y + translation.y);
			ctx.lineTo(vrtx2.x + translation.x, vrtx2.y + translation.y);
			ctx.stroke();
		}
	}
}



class Window4D{
	constructor(width = window.innerWidth - 20, height = window.innerHeight - 20){
		this.canvas = document.createElement("CANVAS");
		this.canvas.width = width;
		this.canvas.height = height;
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
		this.translation = new vector4();
	}
	setTranslation(vector){
		this.translation = vector;
	}
	translate(vector){
		this.translation = this.translation.shift(vector);
	}
	clear(){
		this.ctx.beginPath();
		this.ctx.fillStyle = "#ffffff";
		this.ctx.strokeStyle = "#000000";
		this.ctx.rect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
		this.ctx.fill();
		this.ctx.stroke();
	}
	draw(rendering, color = "#000000"){
		rendering.draw(this.ctx, this.translation, color, this.width);
	}
}
