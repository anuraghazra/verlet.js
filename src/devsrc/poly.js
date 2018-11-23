/**
 * @name Poly.js
 * @version 1.0.0
 * @description My First SAT Collision Detection Code 
 */
function Poly(dots, constra, ctx) {
  let tmparr = [];
  for (let i = 0; i < dots.length; i++) {
    tmparr.push(new Vector(dots[i][0], dots[i][1]))
  }
  this.ctx = ctx;
  this.normals = [];
  this.dots = tmparr;
  this.mass = 1.0;
  this.cons = constra;
  this.edges = [];
  this.center = new Vector(0, 0);  
  this.findNormals();

  this.collisionInfo = {
    depth: 0,
    normal: new Vector(0, 0),
    edge: undefined,
    vertex: undefined
  }

  this.vertexCount = this.dots.length;
  this.edgeCount = this.edges.length;
  this.calculateCenter();
  // console.log(this.edgeCount)
}


Poly.prototype.render = function (color, fill) {
  this.ctx.beginPath();
  this.ctx.strokeStyle = color;
  this.ctx.fillStyle = fill;
  this.ctx.moveTo(this.dots[0].x, this.dots[0].y);
  for (let i = 0; i < this.dots.length; i++) {
    this.ctx.lineTo(this.dots[i].x, this.dots[i].y);
  }
  this.ctx.lineTo(this.dots[0].x, this.dots[0].y);
  this.ctx.fill();
  this.ctx.stroke();
  this.ctx.closePath();
}

Poly.prototype.renderIndex = function () {
  for (let i = 0; i < this.dots.length; i++) {
    this.ctx.fillText(i, this.dots[i].x - 5, this.dots[i].y - 5)
  }
}

//try to render normals
Poly.prototype.renderNormals = function () {
  this.ctx.beginPath();
  this.ctx.strokeStyle = 'black';
  for (let i = 0; i < this.normals.length; i++) {
    const n = this.normals[i];
    for (let k = 0; k < this.dots.length; k++) {
      if (k == i) {
        this.ctx.moveTo(n.x + this.dots[k].x, n.y + this.dots[k].y)
        this.ctx.lineTo(15 * n.x + this.dots[k].x, 15 * n.y + this.dots[k].y)
      }
    }
  }
  this.ctx.stroke();
  this.ctx.closePath();
}

//find the surface axis normals
Poly.prototype.findNormals = function () {
  function findStraightAxis(vec) {
    return new Vector(vec.y, -vec.x).unit();
  }

  let n = this.dots.length;

  for (let i = 0; i < n; i++) {
    let crt = this.dots[i];
    let nxt = this.dots[(i + 1) % this.dots.length];
    let nrm = Vector.sub(crt, nxt);
    this.normals[i] = findStraightAxis(nrm.unit());
  }
  for (let j = 0; j < this.cons.length; j++) {
    let c_crt = this.cons[j];
    this.edges[j] = c_crt;
    this.edges[j].parent = this;
  }
}

//dot product
Poly.prototype.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
}

//projection
Poly.prototype.project = function (n) {
  let proj = this.dot(this.dots[0], n);
  let min = max = proj;
  for (let i = 0; i < this.dots.length; i++) {
    let p = this.dots[i];

    //project onto each axis / normals
    proj = this.dot(p, n);
    if (proj < min) { min = proj }
    if (proj > max) { max = proj }
  }
  return { min: min, max: max };
}

/**
 * Calculates the center of mass
 */
Poly.prototype.calculateCenter = function () {
  let minX = 99999;
  let minY = 99999;
  let maxX = -99999;
  let maxY = -99999;

  for (let i = 0; i < this.dots.length; i++) {
    this.center.x += this.dots[i].x;
    this.center.y += this.dots[i].y;

    minX = Math.min(minX, this.dots[i].x);
    minY = Math.min(minY, this.dots[i].y);
    maxX = Math.max(maxX, this.dots[i].x);
    maxY = Math.max(maxY, this.dots[i].y);
  }

  this.center.x /= this.dots.length;
  this.center.y /= this.dots.length;
  return this.center;

}