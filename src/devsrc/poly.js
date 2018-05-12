/**
 * @name Poly.js
 * @version 1.0.0
 * @description First SAT Collision Detection Code. 
 * Distrubted Under Verlet.js
 * Basic SAT Test Implementation
 *  @author Anurag Hazra (hazru.anurag&commat;gmail.com)
 *  @copyright BasicHTMLPro © 2018
 *  @constructor Poly()
 *  @license MIT
 */
function Poly(dots, ctx) {
  this.ctx = ctx;
  this.normals = [];
  this.dots = dots;
  this.findNormals();
}

Poly.prototype.render = function(color) {
  this.ctx.beginPath();
  this.ctx.strokeStyle = color;
  this.ctx.moveTo(this.dots[0].x, this.dots[0].y);
  for (let i = 0; i < this.dots.length; i++) {
    this.ctx.lineTo(this.dots[i].x, this.dots[i].y);
  }
  this.ctx.lineTo(this.dots[0].x, this.dots[0].y);
  this.ctx.stroke();
  this.ctx.closePath();
}

Poly.prototype.renderIndex = function() {
  for (let i = 0; i < this.dots.length; i++) {
    this.ctx.fillText(i, this.dots[i].x, this.dots[i].y)
  }
}

//find the surface axis normals
Poly.prototype.findNormals = function() {
  
  function findStraightAxis(vec) {
    // return new Vector(vec.y, -vec.x).unit();
    let  l = Math.sqrt(vec.x*vec.x + vec.y*vec.y)
    return { x : vec.y / l, y : -vec.x / l }
  }
  let n = this.dots.length;

  for (var i = 0; i < n; i++) {
    crt = this.dots[i];
    nxt = this.dots[(i + 1) % this.dots.length];
    let norm = {
      x : crt.x - nxt.x,
      y : crt.y - nxt.y
    }
    this.normals[i] = findStraightAxis(norm);
  }
  console.log(this.normals)
}

//dot product
Poly.prototype.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
}

//projection
Poly.prototype.project = function(n) {
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < this.dots.length; i++) {
    let p = this.dots[i];

    //project onto each axis / normals
    let proj = this.dot(p, n);
    if(proj < min) { min = proj }
    if(proj > max) { max = proj }
  }
  return {min: min, max: max};
}

//collidion detection
Poly.prototype.isColliding = function (poly2) {
  let _self = this;
  let p1normals = this.normals;
  let p2normals = poly2.normals;

  let normals = p2normals.concat(p1normals);

  //if every element is staisfy the condition the return true
  let detected = true;
  for (let i = 0; i < normals.length; i++) {
    let n = normals[i];

    let p1 = _self.project(n);
    let p2 = poly2.project(n);
    
    if(p2.min > p1.max || p2.max < p1.min) {
      detected = false
    }
  }
  return detected
}

