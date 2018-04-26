"use strict";
/**
 *  @name Verlet.js
 *  @version 1.2.4
 *  @author Anurag Hazra (hazru.anurag&commat;gmail.com)
 *  @copyright BasicHTMLPro © 2018
 *  @constructor Verlet()
 *  @license MIT
 */
function Verlet() {

if(!(this instanceof Verlet)) {
	return new Verlet();
};

/* _PRIVATE_FUNCTIONS */
/** 	
 	*  Compute Distance Between Two Object
 	*	@private 
	* @method _distance
	*	@param {object} p0
	*	@param {object} p1
	*	@return {number:distance} 
	*/	
this._distance = function _distance(p0,p1) {
	const dx = p0.x - p1.x;
	const dy = p0.y - p1.y;
	return Math.sqrt(dx*dx + dy*dy);
};
/** 	
 	*  Throttles Events
 	*	@private 
	* @method throttle
	*	@param {callback} func
	*	@param {number} time
	*/	
this.throttle = function throttle(func,time) {
	let wait = false;
	return function() {
		if(!wait) {
			func.apply(null,arguments);
			wait = true;
			setTimeout(function() {
				wait = false;
			},time);
		}
	}
}

/* Variables */
const imageSmoothing = false;
const imageSmoothingQuality = 'low';

/* Constructor */
const self = this;
this.gravity = 0.8;
this.friction = 1;
this.stiffness = 1;
this.bounce = 0.90;
this.canvas = undefined;
this.ctx = undefined;
this.handle = undefined;
this.handleIndex = null;
this.osCanvas = document.createElement('canvas');
this.osCanvas.id = "osCanvas";

/** 
*	@method init
*	@param {number} cw canvasWidth
*	@param {number} ch canvasHeight
*	@param {string} canvas canvas id
*	@param {float} gravity gravity[-1,1]
*	@param {float} friction friction[0.1,1]
*	@param {float} stiffness stiffness[0.1,1]
* @return {object}
*/ 
this.init = function(cw,ch,canvas,gravity,friction,stiffness) {
	let appendStr = canvas;
	if(typeof cw === 'string') { 
		appendStr = cw;
	};
	this.canvas = document.querySelector(appendStr);

	let width,height;
	if(typeof cw === 'string') {
		width = this.canvas.parentElement.getBoundingClientRect().width;
		height = this.canvas.parentElement.getBoundingClientRect().height;
	}

	this.canvas.width = width || cw;
	this.canvas.height = height || ch;
	this.ctx = this.canvas.getContext('2d');
	this.gravity = gravity;
	this.friction = friction;
	this.stiffness = stiffness || 1;
	//obj.canvas.style.border = '1px solid gray';
	this.osCanvas.width = this.canvas.width;
	this.osCanvas.height = this.canvas.height;

	this.ctx.imageSmoothingEnabled = imageSmoothing;
	this.ctx.imageSmoothingQuality = imageSmoothingQuality;
	this.osCanvas.getContext('2d').imageSmoothingEnabled = false;
	this.osCanvas.getContext('2d').imageSmoothingQuality = imageSmoothingQuality;

	const dataToReturn = {
		canvas : this.canvas,
		ctx : this.ctx,
		osCanvas : this.osCanvas,
		gravity : this.gravity,
		friction : this.friction,
		stiffness : this.stiffness
	}

	return dataToReturn;
};


/**
 *  predifined methods for creating models 
 * 	functions => 
 * 	@description bind(), box(), triangle(), hexagon(), map(), beam(), rope(), advanceCloth(), cloth()
 *  @method Poly
 *  @type object
 */
this.Poly = {
	dots : undefined,
	cons : undefined,
	/** 	
	 * Binds Points And Constrains Array To This Object
	 * @method bind
	 * @param {array} dots
	 * @param {array} cons
	 */
	bind : function(dots,cons) {
		this.dots = dots;
		this.cons = cons;
	},
	/** 	
	 *	Create A Box
	 *	@method box
	 *	@param {object} opt
	 *	@param {array} dots
	 *	@param {array} cons
	 */
	box : function createBox(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;
		// (dots.length < 1) ? pls = 0 : pls = dots.length;
		let clone = opt.clone || 1;
		if ( opt.x 			=== undefined ) { opt.x	 			= 100 };
		if ( opt.y 			=== undefined ) { opt.y 			= 100 };
		if ( opt.width 	=== undefined ) { opt.width 	= 100 };
		if ( opt.height === undefined ) { opt.height 	= 100 };

		if(clone !== undefined) {
			for(let i = 0; i < clone; i++) {
				let vx = opt.vx || 0;
				let vy = opt.vy || 0;
				let pls = dots.length;
				let width = opt.x + (opt.width);
				let height = opt.y + (opt.height);
				let twoWidth = opt.x + (opt.width*2);
				let twoHeight = opt.y + (opt.height*2);
				self.create([
					[width,height,width + vx,height + vy],
					[twoWidth,height,twoWidth,height],
					[twoWidth,twoHeight,twoWidth,twoHeight],
					[width,twoHeight,width,twoHeight]
				],dots);
				self.clamp([
					[0+pls,1+pls],
					[1+pls,2+pls],
					[2+pls,3+pls],
					[3+pls,0+pls],
					[0+pls,2+pls,true],
					[1+pls,3+pls,true],
				],cons,dots);
			}
		}
	},
	/** 	
	 *	Create A Triangle
	 *	@method box
	 *	@param {object} opt
	 *	@param {array} dots
	 *	@param {array} cons
	 */
	triangle : function(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;
		let pls = dots.length;
		let clone = opt.clone || 1;
		if ( opt.x 			=== undefined ) { opt.x 			= 100 };
		if ( opt.y 			=== undefined ) { opt.y 			= 100 };
		if ( opt.width 	=== undefined ) { opt.width 	= 100 };
		if ( opt.height === undefined ) { opt.height 	= 150 };

		if(clone !== undefined) {
			for(let i = 0; i < clone; i++) {
				let tri_x = opt.x; //x
				let tri_y = opt.y; //y
				let tri_height = opt.height; //height
				let tri_width = opt.width; //width
				let tri_center = (tri_x + tri_y + tri_width) / 2; //center
				(dots.length < 1) ? pls = 0 : pls = dots.length;
				self.create([
					[tri_x,tri_y,tri_x + (opt.vx || 0),tri_y + (opt.vy || 0)],
					[(tri_x + tri_width),tri_y,(tri_x + tri_width),tri_y],
					[tri_center,tri_height,tri_center,tri_height]
				],dots);
				self.clamp([
					[0+pls,1+pls],
					[1+pls,2+pls],
					[0+pls,2+pls]
				],cons,dots)
			}
		}
	},
	/** 	
	 *	Create A Hexagon
	 *	@method hexagon
	 *	@param {object} opt
	 *	@param {array} dots
	 *	@param {array} cons
	 */
	hexagon : function(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;
		let clone = opt.clone || 1;
		if ( opt.x 			=== undefined ) { opt.x 			= 100 };
		if ( opt.y 			=== undefined ) { opt.y 			= 100 };
		if ( opt.vx 		=== undefined ) { opt.vx 			= opt.x };
		if ( opt.vy 		=== undefined ) { opt.vy 			= opt.y };
		if ( opt.radius === undefined ) { opt.radius 	= 50 	};
		if ( opt.slice1 === undefined ) { opt.slice1 	= 1 	};
		if ( opt.slice2 === undefined ) { opt.slice2 	= 6 	};
		if ( opt.sides 	=== undefined ) { opt.sides 	= 8 	};

		if(clone !== undefined) {
			for(let i = 0; i < clone; i++) {
				let pls = dots.length;
				let tmpDots = [],
					tmpCons = [],
					splice = 0,
					angle = 0;
				let n = opt.sides,
						x = opt.x,
						y = opt.y,
						vx = opt.vx,
						vy = opt.vy,
						radius = opt.radius,
						slice1 = opt.slice1,
						slice2 = opt.slice2;
				
				for(let i = 0; i < n; i++) {
					splice += Math.PI*2 / n;
					angle += Math.PI*2 / n;
					let outer = (Math.cos((angle)) * radius);
					let inner = (Math.sin((angle)) * radius);
					tmpDots.push([
						outer+x,inner+y,outer+vx,inner+vy
					])
					tmpCons.push([
						(i + dots.length),((i + slice1) % n) + dots.length,
					]);
					tmpCons.push([
						(i + dots.length),((i + slice2) % n) + dots.length
					]);
				}
				if(opt.center) {
					tmpDots.push([
						x,y,x,y
					])
					for(let j = 0; j < tmpDots.length-1; j++) {
						tmpCons.push([
							(tmpDots.length-1)+dots.length,
							((j+1)%tmpDots.length-1) + dots.length
						])
					}
				}
				self.create(tmpDots,dots);
				self.clamp(tmpCons,cons,dots);
				tmpDots = [];
				tmpCons = [];
			}
		}
	},
	/** 	
	 *	Create A Charecter Map
	 *	@method map
	 *	@param {object} opt
	 *	@param {array} dots
	 *	@param {array} cons
	 */
	map : function map(opt,dot) {
		let dots = dot || this.dots;
		let tmpDots = [];
		let w = self.canvas.width / opt.sizeX;
		let h = self.canvas.height / opt.sizeY;

		for (let i = 0; i < opt.data.length; i++) {
			const info = opt.data[i];
			for (let j = 0; j < info.length; j++) {
				if(info.charAt(j) !== " ") {
					tmpDots.push([
						opt.x + w * j,
						opt.y + h * i,
						opt.x + w * j,
						opt.y + h * i
					]);
				}
			}
		}
		self.create(tmpDots,dots);
	},
	/** 	
	 *	Create A Bridge Beam
	 *	@method beam
	 *	@param {object} opt
	 *	@param {array} dots
	 *	@param {array} cons
	 */
	beam : function Beam(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;
		let clone = opt.clone || 1;
		if ( opt.x 			=== undefined ) { opt.x 			= 100 };
		if ( opt.y 		 	=== undefined ) { opt.y 			= 100 };
		if ( opt.width 	=== undefined ) { opt.width 	= 50 	};
		if ( opt.height === undefined ) { opt.height 	= 50 	};
		if ( opt.segs 	=== undefined ) { opt.segs 		= 6 	};

		if(clone !== undefined) {
			for(let i = 0; i < clone; i++) {
				let pls = dots.length;
				let beamDots = [];
				let beamCons = [];
				let oldx = opt.x;
				let cols = 2;
				let rows = opt.segs;
				let x = opt.x;
				let y = opt.y;
				let width = opt.width;
				let height = opt.height;
				for (let i = 0; i < cols; i++) {
					for (let j = 0; j < rows; j++) {
						beamDots.push([
							x,y,x,y
						])
						x += width;
					}
					x = oldx;
					y += height;
				}
				for (let j = 0; j < cols*rows-1; j++) {
					if( (j+1)%rows > 0 ) {
						beamCons.push([
							(j)+pls,(j+1)%rows+pls
						])
					}
				}
				for (let j = 0; j < rows; j++) {
					beamCons.push([
						(j)+pls,(j+rows)+pls
					]);
				}
				for (let k = 0; k < rows-1; k++) {
					beamCons.push([(rows+k)+pls,(rows+k+1)+pls]);
				}
		
				self.create(beamDots,dots);
				self.clamp(beamCons,cons,dots);
			}
		}
	},
	/**
	 *  Create A Rope
	 *	@method rope
	 *  @param {object} opt
	 *	@param {number} opt_x
	 *	@param {number} opt_y
	 *	@param {number} opt_parts
	 *	@param {number} opt_len
	 *  @param {array} dot
	 *  @param {array} con
	 *	@return {object} 
	 */	
	rope : function createRope(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;
		let clone = opt.clone || 1;
		if ( opt.x 			=== undefined ) {opt.x 		= 100	};
		if ( opt.y 			=== undefined ) {opt.y 		= 100 };
		if ( opt.segs 	=== undefined ) {opt.segs = 15  };
		if ( opt.gap 		=== undefined ) {opt.gap 	= 20  };

		if(clone !== undefined) {
			for(let i = 0; i < clone; i++) {	
				let rope = [];
				let ropeClamp = [];
				let cIndex = 0;
				let attr;
				let y = opt.y,
					x = opt.x,
					vy = opt.vy || opt.y,
					vx = opt.vx || opt.x;
				for (let i = 0; i < opt.segs; i++) {
					attr = (i === 0) ? [true,'crimson'] : [false,null] 
					x += opt.gap;
					vx += opt.gap;
					rope.push([
						x,y,vx,vy,attr[0],attr[1]
					]);
					cIndex = (cIndex + 1) % opt.segs;
					ropeClamp.push([
						(i + dots.length), (cIndex + dots.length),
						false,
						[(i + dots.length),(cIndex + dots.length)]
					]);
				}
				ropeClamp.pop();
				self.create(rope,dots);
				self.clamp(ropeClamp,cons,dots);
				rope = [];
				ropeClamp = [];
			}
		}
	},
		
	/**
	 *  Create A advanceCloth
	 *	@method advanceCloth
	 *  @param {object} opt
	 *	@param {number} opt_x
	 *	@param {number} opt_y
	 *	@param {number} opt_gridX
	 *	@param {number} opt_gridY
	 *	@param {number} opt_gap
	 *	@param {number} opt_segs
	 *  @param {array} dot
	 *  @param {array} con
	 */			
	advanceCloth : function advanceCloth(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;
		let delta = 1;
		let pls = dots.length;
		for (let i = 0; i < opt.segs; i++) {
			let p = {
				x : (opt.x - opt.gridX/opt.gap * delta + (i%opt.gridX) * delta * opt.gap),
				y : (opt.y - opt.gridY/opt.gap * delta + (i/opt.gridY) * delta * opt.gap),
				oldx : (opt.x - opt.gridX/opt.gap * delta + (i%opt.gridX) * delta * opt.gap),
				oldy : (opt.y - opt.gridY/opt.gap * delta + (i/opt.gridY) * delta * opt.gap) + Math.random() * opt.gap
			};
			dots.push(p);
		}
		for (let i = 0; i < (dots.length-1); i++) {
			if(((i+1)%opt.gridX) > 0){
						let link = {
							p0: dots[(i+pls)], 
							p1: dots[(i+1)+pls],
							len : self._distance(dots[i+pls],dots[(i+1)+pls]),
							id : [i+pls,(i+1)+pls]
						};
						cons.push(link);
				}
		}
		for (let i = 0; i < (dots.length-opt.gridX); i++) {
				let link = {
					p0: dots[i+pls], 
					p1: dots[(i+opt.gridX)+pls],
					len : self._distance(dots[i+pls],dots[(i+opt.gridX)+pls]),
					id : [i+pls,(i+opt.gridX)+pls],
				};
				cons.push(link);
			}
	},
		
	/**
	 *  Create A Cloth
	 *	@method cloth
	 *  @param {object} opt
	 *	@param {number} opt_x
	 *	@param {number} opt_y
	 *	@param {number} opt_gap
	 *	@param {number} opt_segs
	 *	@param {number} opt_pinRatio
	 *	@param {number} opt_clone
	 *  @param {array} dot
	 *  @param {array} con
	 */	
	cloth : function cloth(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;
		let clone = opt.clone || 1;
		if ( opt.x 				=== undefined ) { opt.x 				= 100	};
		if ( opt.y 				=== undefined ) { opt.y					= 100	};
		if ( opt.segs 		=== undefined ) { opt.segs 			= 20	};
		if ( opt.gapX 		=== undefined ) { opt.gapX 			= 15	};
		if ( opt.gapY 		=== undefined ) { opt.gapY 			= 15	};
		if ( opt.pinRatio === undefined ) { opt.pinRatio 	= 7		};
		if ( opt.tear		  === undefined ) { opt.tear 		  = false };

		if(clone !== undefined) {
			for(let i = 0; i < clone; i++) {
				let x = opt.x,
					y = opt.y,
					gapx = opt.gapX,
					gapy = opt.gapY,
					segs = opt.segs;
				let pls = dots.length;

				let oldx = x;
				let tmpDots = [];
				let tmpCons = [];
				for (let i = 0; i < segs; i++) {
					for (let j = 0; j < segs; j++) {
						tmpDots.push([
							x,y,x,y
						])
						x += gapx;
					}
					x = oldx;
					y += gapy;
				}
				for (let j = 0; j < tmpDots.length-1; j++) {
					if( (j+1)%segs > 0 ) {
						tmpCons.push([
							(j)+pls,(j+1)+pls
						])
					}
				}
				for (let j = 0; j < tmpDots.length-segs; j++) {
					tmpCons.push([
						(j)+pls,(j+segs)+pls
					]);
				}
				let pinRatio = opt.pinRatio;
				for (let l = 0; l < segs; l+=pinRatio) {
					tmpDots[l][4] = true;
				}
				tmpDots[segs-1][4] = true;
				
				
				self.create(tmpDots,dots);
				self.clamp(tmpCons,cons,dots);

				let tearIndex = [
					(dots.length-tmpDots.length)+2,
					tmpDots.length-1 + (dots.length-tmpDots.length)
				];

				tmpDots = [];
				tmpCons = [];

				/* tearThe Cloth
				 * IN DEVELOPMENT STAGE 1
				 */
				if(opt.tear === true) {
					function tear() {
						for (let i = tearIndex[0]; i < tearIndex[1]; i++) {
							if(cons[i].p1.x - cons[i].p0.x > 30 ||
								cons[i].p1.y - cons[i].p0.y > 60) {
									cons.splice(i, 1);
							}
						}
					}
					self.canvas.addEventListener('mousemove',tear);
				}

			}
		}
	},

	//tearCloth
	tearCloth : function(arr, cons) {

	},

	/**
	 *  Creates a line from given data
	 *	@method line
	 *  @param {object} opt
	 *	@param {array} opt_data
	 *	@param {boolean} opt_joinEnd
	 *  @param {array} dot
	 *  @param {array} con
	 */	
	line : function(opt,dot,con) {
		let dots = dot || this.dots;
		let cons = con || this.cons;

		console.log(opt.constructor)
		if (opt.constructor.toString().match('Array')) {
			opt = {
				data : opt
			};
		}
		console.log(opt)

    if(!opt.data) {
      opt.data = [
        [100,100],
        [200,100],
      ]
    }

		self.create(opt.data,dots);
    let joinArr = [];
		let i;
		let optlength = opt.data.length;
    if(opt.joinEnd === true) {
      optlength = optlength;
    } else {
      optlength = optlength-1;
		}
    for (i = 0; i < optlength; i++) {
			joinArr.push([
				(i)%opt.data.length+dots.length-opt.data.length,
				((i+1))%opt.data.length+dots.length-opt.data.length
			]);
		}
		
    self.clamp(joinArr,cons,dots);
    joinArr = null;
    i = null;
  }
};

/** 	
 *	Interact With Points In Real-Time
 *  @version v1.7.3
 *	@method Interact
 *	@param {array} dots
 *	@param {array} cons
 *	@param {number} detect
 */
this.Interact = {
	hoverPoint : undefined,
	draw : function(color) {
		if(this.hoverPoint) {
			self.ctx.beginPath();
			self.ctx.lineWidth = 2;
			self.ctx.strokeStyle = color || 'white';
			self.ctx.arc(this.hoverPoint.x,this.hoverPoint.y,8,0,Math.PI*2);
			self.ctx.stroke();
			self.ctx.closePath();
		}
	},
	move : function(dots,color) {
		let isDown = false;
		let parent = this;
		let pointOffsetX = null, 
				pointOffsetY = null;
		
		/** Detect Nearby Points */
		let ox,oy,index;
		function moveListner(e) {
			if(isDown) return;
			parent.hoverPoint = undefined;
			index = null;
			ox = e.offsetX - 15,
			oy = e.offsetY - 15;

			for(let i = 0; i < dots.length; i++) {
				let dist = colDetect(ox,oy,dots[i]);
				if(dist < 30) {
					parent.hoverPoint = dots[i];
					index = i;
				}
			}
			self.handle = parent.hoverPoint;
			self.handleIndex = index;	
		}

		self.canvas.onmousemove = function(e) {
			moveListner(e);
			if(!isDown) return;
			mouseMove(e); // move selected point 			
		};
		//touch devices
		self.canvas.ontouchmove = function(e) {
			e.preventDefault();
			moveListner(e.touches[0]);
			if(!isDown) return;
			mouseMove(e.touches[0]); // move selected point 	
		}
		
		// is Mouse down
		let isAlreadyPinned = false;
		function mouseDown(e) {
			if(self.handle) {
				isDown = true;
				pointOffsetX = ox - self.handle.x;
				pointOffsetY = oy - self.handle.y;
				if(self.handle.pinned === false) {
					isAlreadyPinned = false;
					self.handle.pinned = true;
				} else {
					isAlreadyPinned = true;
				}
			}
		}
		//on mouseup and out reset
		self.canvas.onmousedown = mouseDown;
		self.canvas.onmouseup = function(e) { mouseUp(e) };
		self.canvas.onmouseout = function(e) { mouseUp(e) };

		self.canvas.ontouchstart = mouseDown;
		self.canvas.ontouchend = function(e) { mouseUp(e) };
		
		//pin and unpin
		window.onkeydown = function(e) { if(e.which === 32) { e.preventDefault(); } } //prevent scoll on spacebar
		document.body.onkeydown = self.throttle(function(e) {
			if(parent.hoverPoint) {
				if(e.which === 32) { //Space
					isAlreadyPinned = true;
					parent.hoverPoint.pinned = true;
					parent.hoverPoint.color = 'crimson';
				}
				if(e.which === 18) { //ALT
					e.preventDefault();
					parent.hoverPoint.pinned = false;
					parent.hoverPoint.color = color;
				}
			}
		},150);

		let canvasDims = self.canvas.getBoundingClientRect();

		//move and drag the dot
		function mouseMove(e) {
			if(self.handle) {
				//use canvasDims to justify the clientX,Y for touch devices
				self.handle.x = (e.offsetX || (e.clientX-canvasDims.x)) - 15 - pointOffsetX;
				self.handle.y =	(e.offsetY || (e.clientY-canvasDims.y)) - 15 - pointOffsetY;
				self.handle.oldx = self.handle.x;
				self.handle.oldy = self.handle.y;
			}
		}

		//remove pinning and stop dragging
		function mouseUp() {
			isDown = false;	
			if(self.handle) {
				if(isAlreadyPinned === false) {
					self.handle.pinned = false;
				}
			}
		}

		//utils
		function colDetect(x,y,circle) {
			const dx = x - circle.x;
			const dy = y - circle.y;
			return Math.sqrt(dx*dx + dy*dy);
		}
	}
} 

/** 	
 *	Functions For Drawing In Canvas
 *	@method Draw
 */
this.Draw = {
	/** 	
	 *	Create A Circle Or Arc
	 *	@method arc
	 *	@param {number} x
	 *	@param {number} y
	 *	@param {number} radius,
	 *	@param {string} color,
	 *	@param {Boolean} bool,
	 */
	arc : function(x,y,radius,color,line,bool) {
		let col = color || 'black';
		self.ctx.save();
		self.ctx.beginPath();
		self.ctx.lineWidth = line || 1;
		(bool === false) ? (self.ctx.fillStyle = col) : (self.ctx.strokeStyle = col);
		self.ctx.arc(x,y,radius,0,Math.PI*2);
		(bool === false) ? self.ctx.fill() : self.ctx.stroke();
		self.ctx.closePath();
		self.ctx.restore();
	}
};


/** 	
  *	Setup a studio with basic settings
	*	@method Studio
*/
this.Studio = {
	/**
	 * initialize studio markups and visuals
	 * @method init
	 * @param {string} id
	 */
	init : function(id) {
		const div = document.querySelector(id);
		div.style.display = 'flex';
		div.style.flexWrap = 'wrap';

		const newdiv = document.createElement('div');
		newdiv.id = 'Verlet-Studio';
		newdiv.innerHTML = `<div class="ui_panel" style="width : ${self.canvas.width-20}px; margin: 5px 0 0 0">
		<h2>Verlet Studio</h2>
		<hr><p>Physics Options</p>
		<div class="ui_settings_labels">
			<span>Physics Accuracy</span> <span>Gravity</span> <span>Friction</span>
		</div>
		<div class="ui_settings">
			<input step="1" placeholder="Physics Acuuracy" value="20" title="Physics Acuuracy" type="number" id="vls-Iterrations">
			<input step="0.1" placeholder="Gravity" value="${self.gravity}" title="gravity" type="number" id="vls-gravity">
			<input step="0.01" placeholder="Friction" value="${self.friction}" title="friction" type="number" id="vls-friction">
		</div>
		<p>Render Options</p>
		<div class="ui_checkboxes">
			<label>
				<input type="checkbox" checked id="vls-dots">
				<span>Dots</span>
			</label>
			<label>
				<input type="checkbox" checked id="vls-lines">
				<span>Lines</span>
			</label>
			<label>
				<input type="checkbox" id="vls-stressOpt">
				<span>Stress</span>
			</label>
			<label>
				<input type="checkbox" id="vls-pointIndex">
				<span>Index</span>
			</label>
			<label>
				<input type="checkbox" id="vls-hidden-lines">
				<span>Hidden</span>
			</label>
			<label>
				<input type="checkbox" id="vls-shapes">
				<span>Shapes</span>
			</label>
		</div>
		<hr>
		<span>Preset</span>
		<select id="vls-preset">
			<option value="shadowRed">shadowRed</option>
			<option value="shadowPink">shadowPink</option>
			<option value="shadowBlue">shadowBlue</option>
			<option value="shadowGreen">shadowGreen</option>
		</select>
	</div>`;

let style = `.ui_panel {
	font-family: 'Segoe UI';
	color : #252525;
	box-shadow: 0 0 5px #00000080;
	border-radius: 5px;
	padding: 10px;
}
.ui_panel * {box-sizing : border-box;}
.ui_panel p {
	font-size: 18px; margin: 5px;
	margin-bottom: 10px;
}
.ui_panel > h2 {
padding: 0;margin: 5px;
margin-bottom: 10px;
}
.ui_panel hr { border: 1px solid lightgray;}
.ui_panel .ui_settings_labels {display: flex;padding: 10px 10px 0;}
.ui_panel .ui_settings {display: flex;padding: 10px;}
.ui_panel .ui_settings_labels span { flex: 1; }
.ui_panel .ui_settings input {
	flex: 1;
	margin-top: 0px;
	margin-right: 10px;
	width: 100%;
	outline: none;
	border: 1px solid gray;
	padding: 8px;
	border-radius: 5px;
}
.ui_panel .ui_checkboxes {
	display: flex;
	flex-wrap: wrap;
	box-shadow: 0 0 2px #00000080;
	border-radius: 5px;
	padding-bottom: 10px;
	padding-top: 10px;
}
.ui_panel .ui_checkboxes label {flex-grow: 1; cursor: pointer;}
.ui_panel .ui_checkboxes label input {
	margin-left: 20px;
	width: auto; cursor: pointer;
}
.ui_panel select {
	padding: 5px; width: 100%; margin-top: 5px;
}`;
		
		let studioStyle,studioElt;
		if(document.createStyleSheet) {
			studioStyle = document.createStyleSheet();
		} else {
			let head = document.getElementsByTagName('head')[0];
			studioElt = document.createElement('style');
			studioElt.id = 'verlet_studi_ui';
			head.appendChild(studioElt);
			studioStyle = document.styleSheets[document.styleSheets.length - 1];
		} 
		if(studioElt) {
			studioElt.innerHTML = style;
		} else {
			studioStyle.cssText = style;
		}
		div.appendChild(newdiv);
	},

	/**
	 * updates studio settings
	 * @method update
	 * @description opt takes points, cons, forms
	 *  and option takes pointRadius, pointColor, lineWidth, lineColor, fontColor,font
	 * 	hiddenLineWidth, hiddenLineColor
	 * @param {object} opt {}
	 * @param {object} option {options : {}}
	 */
	update : function(opt) {
		if(opt.renderSettings === undefined) {
			opt.renderSettings = {};
		}

		const PhysicsAccuracy = document.getElementById('vls-Iterrations'),
					dotOpt 					= document.getElementById('vls-dots'),
					LineOpt 				= document.getElementById('vls-lines'),
					hiddenLineOpt 	= document.getElementById('vls-hidden-lines'),
					IndexOpt 				= document.getElementById('vls-pointIndex'),
					shapeOpt 				= document.getElementById('vls-shapes'),
					gravity 				= document.getElementById('vls-gravity'),
					friction 				= document.getElementById('vls-friction'),
					vlsPreset 			= document.getElementById('vls-preset'),
					stressOpt 			= document.getElementById('vls-stressOpt');
		

		self.gravity = parseFloat(gravity.value || 0);
		self.friction = parseFloat(friction.value || 1);

		
		let isRenderDots 				= dotOpt.checked;
		let isRenderLines 			= LineOpt.checked;
		let isRenderHiddenLines = hiddenLineOpt.checked;
		let isRenderIndex 			= IndexOpt.checked;
		let isRenderStress 			= stressOpt.checked;
		let preset 							= vlsPreset.value;


		//console handling
		opt.renderSettings.renderDots 				= isRenderDots;
		opt.renderSettings.renderLines 				= isRenderLines;
		opt.renderSettings.renderHiddenLines 	= isRenderHiddenLines;
		opt.renderSettings.renderPointIndex 	= isRenderIndex;
		opt.renderSettings.renderStress 			= isRenderStress;
		opt.renderSettings.preset 						= preset;

		self.superUpdate(	opt.dots,
											opt.cons,
											PhysicsAccuracy.value,
											{ hoverColor : opt.hoverColor }
										);
		self.superRender(opt.dots,opt.cons,opt.renderSettings);
				
		if(opt.forms) {
			(shapeOpt.checked === true) ? self.renderShapes(opt.forms) : false;
		}								
	}
};


/** 	
 *	Simulate Some Basic Motions With Trigonometry
 *	@method Motion
 */
this.Motion = {
	/** 	
	 *	Back And Forword In X Axis
	 *	@method occilateX
	 *	@param {array|number} index
	 *	@param {array} dots
	 *	@param {object} option optional
	 */
	occilate : function(index, dots, option) {
		//defaults
		option = (typeof option !== 'object') ? {} : option;
		let speed  = option.speed || 500;
		let size = option.size || 4;
		let axis = option.axis || 'x';

		if (!option.timingFunction) {
			option.timingFunction = {};
		}
		let tfuncName = option.timingFunction.name || 'ease';
		let tfuncAmount = option.timingFunction.amount || 1.5;
		let tfuncDelay = option.timingFunction.delay || 1.5;
		let tfuncStep = option.timingFunction.step || 1;

		function timing(fraction, timing) {
			if (timing === 'linear') {
			
				return Math.pow(fraction, tfuncAmount) * ((tfuncStep) * fraction)
			
			} else if (timing === 'ease') {

				return fraction/tfuncAmount;
			
			} else if (timing === 'elastic') {
			
				return Math.pow(tfuncDelay, 10 * (fraction - 1)) * Math.cos(20 * Math.PI * tfuncAmount / 3 * fraction);
			
			}
		}

		//refactor the code
		let date = new Date();
		function doMove(ittr) {
			let x = dots[ittr].x;
			let y = dots[ittr].y;
			let loop = date.valueOf()/speed;
			if(axis === 'y') {
			
				dots[ittr].y = y + timing( Math.sin(loop),tfuncName ) * size;
			
			} else if(axis === 'xy') {
			
				dots[ittr].x = x + timing( Math.sin(loop),tfuncName ) * size;
				dots[ittr].y = y + timing( Math.sin(loop),tfuncName ) * size;
			
			} else if(axis === 'yx') {
			
				dots[ittr].y = y - timing( Math.sin(loop),tfuncName ) * size;
				dots[ittr].x = x + timing( Math.sin(loop),tfuncName ) * size;
			
			} else {
			
				dots[ittr].x = x + timing( Math.sin(loop),tfuncName ) * size;
			
			}
		}

		if (typeof index === 'number') {
			doMove(index)			
		} else {
			for (let i = 0; i < index.length; i++) {
				doMove(index[i])
			}
		}

	},

	/** 	
	 *	circular Motion
	 *	@method Verlet.Motion.circular()
	 *	@param {array|number} index
	 *	@param {array} dots
	 *	@param {object} option optional
	 */
	circular : function circular(index, dots, option) {
		option = (typeof option !== 'object') ? {} : option;		
		let speed  = option.speed || 500;
		let radius = option.size || 3;
		let reverse = option.reverse || false;
		//refactor the code
		let date = new Date();		
		function doMove(ittr) {
			let rev = null;
			let dynamic = date.valueOf()/speed;
			let moX = (dots[ittr].x + Math.cos(dynamic) * radius);
			let moY = (dots[ittr].y + Math.sin(dynamic) * radius);
			if(reverse) {
				moX = (dots[ittr].x - Math.cos(dynamic) * radius);
			}
			dots[ittr].x = moX;
			dots[ittr].y = moY;
			dots[ittr].oldx = dots[ittr].x;
			dots[ittr].oldy = dots[ittr].y;
		}

		if (typeof index === 'number') {
			doMove(index)			
		} else {
			for (let i = 0; i < index.length; i++) {
				doMove(index[i])
			}
		}

	},
	/** 	
	 *	Wind Motion
	 *	@method Verlet.Motion.wind()
	 *	@param {array|number} index
	 *	@param {array} dots
	 *	@param {object} option optional
	 */
	wind : function wind(index, dots, option) {
		option = (typeof option !== 'object') ? {} : option;		
		let speed  = option.speed || 500;
		let radius = option.size || 3;
		let axis = option.axis || 'x';

		//refactor the code
		let date = new Date();		
		function doMove(ittr) {
			let dynamic = date.valueOf()/speed;
			let moX = 3+(dots[ittr].x + Math.sin(Math.asin(.3)*dynamic) * radius);

			if(axis === 'y') {
				dots[ittr].y = moX;
			} else {
				dots[ittr].x = moX;
			}
			dots[ittr].oldx = dots[ittr].x;
			dots[ittr].oldy = dots[ittr].y;
		}

		if (typeof index === 'number') {
			doMove(index)			
		} else {
			for (let i = 0; i < index.length; i++) {
				doMove(index[i])
			}
		}

	}
};


/** 	
 *	Simple Effects
 *	@method Effect
 */
this.Effect = {
	/** 	
	 *	Prevent The Verlet Points From Going Inside A Circle
	 *	@method hole
	 *	@param {array} dots
	 *	@param {object} option
	 */
	hole : function(dots,option) {
		option = (typeof option !== 'object') ? {} : option;	
		
		let type = option.type || 'blow';
		let x = option.x || 100;
		let y = option.y || 100;
		let radius = option.radius || 50;

		
		for (let i = 0; i < dots.length; i++) {
			let p = dots[i];
			let cdx = p.x - x,
					cdy = p.y - y;
			let Diff = cdx*cdx + cdy*cdy;
			if(Diff < radius*radius) {
				let depth = Math.sqrt(radius*radius / Diff);
				
				if(type === 'suck') {
					cdx /= depth;
					cdy /= depth;
				} else {
					cdx *= depth;
					cdy *= depth;
				}
				p.x = cdx + x;
				p.y = cdy + y;
			}
		}
	}
};


/** 	
 *	Update Simulations
	*	@method Engine
*/
this.Engine = {
	/** 	
	 *	Update Verlet Points And Compute SPEED And OLDSPEED
		*	@method update
		*	@param {array} dots
	*/
	update : function updatePoints(dots) {
		for(let i = 0; i < dots.length; i++) {
				let p = dots[i];
			if(!p.pinned) {	
				let vx = (p.x - p.oldx) * self.friction;
				let vy = (p.y - p.oldy) * self.friction;
				
				p.oldx = p.x;
				p.oldy = p.y;
				p.x += vx;
				p.y += vy;
				p.y += self.gravity;
			}
		}
	},

	/** 	
	 *	Separetly Compute Collision Bounds For Asyn Update
		*	@method constrain
		*	@param {array} dots
	*/
	constrain : function constrainPoints(dots) {
		let width = self.canvas.width,
				height = self.canvas.height;
		for (let i = 0; i < dots.length; i++) {
			let p = dots[i];
			if(!p.pinned) {
				let vx = (p.x - p.oldx) * 0.99,
						vy = (p.y - p.oldy) * 0.99;

				//Boundry
				if(p.x > width) {
					p.x = width;
					p.oldx = p.x + vx * self.bounce;
				} else if(p.x < 0) {
					p.x = 0;
					p.oldx = p.x + vx * self.bounce;
				}
				if(p.y > height) {
					p.y = height;
					p.oldy = p.y + vy * self.bounce;
				} else if(p.y < 0) {
					p.y = 0;
					p.oldy = p.y + vy * self.bounce;
				}
				//BoundryEnd
			}
		}
	},

	/** 	
	 *	====== Verlet Integration ======
		*  @name <<<<<<---Algorithm--->>>>>>
		* 
	  *  @description Step1 : Compute distance between two points (Pythogoream Theorm)
		* 		>>>>>>>>>>>>>>>>>>>>>
		*			Step1 :	|| dx = p1.x - p2.x;
		*					|| dy = p1.y - p2.y;
		*					|| distance = Math.sqrt(dx*dx + dy*dy);
		*			>>>>>>>>>>>>>>>>>>>>>
		*
		*	Step2 : Compute the difference between precomputed Length of the points
		*			and distance of two points (p.len - dist)
		*			and devide it by distance.
		*			>>>>>>>>>>>>>>>>>>>>>
		*			Step2 :	|| difference = (p1.x - p2.x) OR Length - distance / distance;
		*			>>>>>>>>>>>>>>>>>>>>>
		*
		*	Step3 : And To Calculate correctionX and correctionY
		*			devide the distanceX by 2 and distanceY by 2
		*			and multiply it by diffrence
		*			>>>>>>>>>>>>>>>>>>>>>
		*			Step3 :	|| correctionX = dx / 2 * difference 
		*					|| correctionY = dy / 2 * difference
		*			>>>>>>>>>>>>>>>>>>>>>
		*
		*	@method bakePhysics
		*	@param {array} cons
	*/
	bakePhysics : function VerletPoints(cons) {
		for(let i = 0; i < cons.length; i++) {
			const p = cons[i];
			const dx = (p.p1.x - p.p0.x),
						dy = (p.p1.y - p.p0.y),
						dist = Math.sqrt(dx*dx + dy*dy);
						
			const diffrence = (dist - p.len) / dist;
			const adjustX =  (dx * 0.5 * diffrence) * self.stiffness;
			const adjustY =  (dy * 0.5 * diffrence) * self.stiffness;

			if(!p.p0.pinned) {
				p.p0.x += adjustX;
				p.p0.y += adjustY;
			}
			if(!p.p1.pinned) {
				p.p1.x -= adjustX;
				p.p1.y -= adjustY;
			}
		}
	}
}
};//Verlet


/* prototypes starts here */

/**
 * @method CORE_PROTOTYPES
 */

/** 	
 *	Clear The Canvas And Set A BackgroundColor
 *	@method clear
 *	@param {string} color
 */
Verlet.prototype.clear = function(color) {
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	if(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	}
};



/* ==== ARRAY HANDLING AND COMPIILING METHODS ==== */

/** 	
 *	Push Values In VERLET POINTS
 *	@method create
 *	@param {array} dots
 *	@param {array} newD
 */
Verlet.prototype.create = function (newD,dots) {
	for(let j = 0; j < newD.length; j++) {
		dots.push({
			x : newD[j][0],
			y : newD[j][1],
			oldx : newD[j][2] || newD[j][0],
			oldy : newD[j][3] || newD[j][1],
			pinned : newD[j][4] ? newD[j][4] : false,
			color : newD[j][5] ? newD[j][5] : null
		});
	}
};

/** 	
 *	Push Values In VERLET CONSTRAINS
 *	@method clamp
 *	@param {array} newJ
 *	@param {array} joints
 *	@param {array} dots
 */
Verlet.prototype.clamp = function(newJ,joints,dots) {
	for(let j = 0; j < newJ.length; j++) {
		joints.push({
			p0 : dots[newJ[j][0]],
			p1 : dots[newJ[j][1]],
			len : this._distance(dots[newJ[j][0]],dots[newJ[j][1]]),
			hidden : newJ[j][2] || false,
			id : [newJ[j][0],newJ[j][1]]
		});
	}
};

/** 	
 *	Push Paths In SHAPES ARRAY FOR CREATING FORMS
 *	@method shape
 *	@param {array} arr
 *	@param {array} forms
 *	@param {array} dots
 *	@param {string} color
 */
Verlet.prototype.shape = function(arr,forms,dots) {
	let tmpArr = [];
	let tmpId = [];
	let color = arr[arr.length-1];
	if(typeof color === 'string') {
		arr.pop();
	}
	for (let i = 0; i < arr.length; i++) {
		tmpArr.push(dots[arr[i]]);
	}
	forms.push({
		id : arr,
		paths : tmpArr,
		color : color
	});
};

/**
 * shortcut for Verlet.create() and Verlet.clamp();
 * @param {array} newd
 * @param {array} newc
 * @param {array} dots
 * @param {array} cons
 */
Verlet.prototype.bake = function(newd,newc,dots,cons) {
	this.create(newd,dots);
	this.clamp(newc,cons,dots);
}




/** 	
 *	Simulates And Updates Given Objects
 *	@method superUpdate
 *	@param {array} dots
 *	@param {array} cons
 *	@param {number} accu
 */
Verlet.prototype.superUpdate = function(dots,cons,accu,opt) {
	let option;
	if(opt === undefined) {
		option = {};
	} else {
		option = opt;
	}
	let hoverColor = option.hoverColor || 'black';
	this.Engine.update(dots);
	for (let i = 0; i < accu; i++) {
		this.Engine.constrain(dots);
		this.Engine.bakePhysics(cons);
	}
	this.Interact.draw(hoverColor);
};

/*=======================================
* =========== RENDER PROTOTYPES =========  
/*======================================*/


/** 	
 *	Render Circles At Points
 *	@method renderDots
 *	@param {array} dots
 *	@param {number} radius
 *	@param {string} color
 */
Verlet.prototype.renderDots = function(dots,radius,color) {
	let PI2 = Math.PI*2;
	let rad = radius || 5;
	for (let i = 0, j = dots.length; i < j; i++) {
		let p = dots[i];
		if(!p.hidden) {
			let fill = (p.color || color || 'black');
			this.ctx.beginPath();
			this.ctx.fillStyle = fill;
			this.ctx.arc(p.x,p.y,rad,0,PI2);
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
};

/**	Render Box At Points Insted Of Circles
 *	@method renderDotsAsBox
 *	@param {array} dots
 *	@param {number} radius
 *	@param {string} color
 */
Verlet.prototype.renderDotsAsBox = function(dots,radius,color) {
	for (let i = 0; i < dots.length; i++) {
		let p = dots[i];
		if(!p.hidden) {
			this.ctx.fillStyle = p.color || color || 'black';
			this.ctx.fillRect(p.x-(radius/2),p.y-(radius/2),radius,radius);
		}
	}
};

/** 	
 *	Render Point Indexes (Debug Pourposes)
*	@method renderPointIndex
*	@param {array} dots
*	@param {string} fonts
*	@param {string} color
*/
Verlet.prototype.renderPointIndex = function(dots,font,color) {
	let osctx = this.osCanvas.getContext('2d');
	osctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	osctx.font = font || '10px Arial';
	osctx.fillStyle = color || 'black';
	for (let i = 0; i < dots.length; i++) {
		let p = dots[i];
		osctx.fillText(i,(p.x-10).toFixed(1),(p.y-10).toFixed(1));
	}
	osctx.fill();
	this.ctx.drawImage(this.osCanvas,0,0);
};

/** 	
 *	Render Given Objects With renderDots(),renderLines(),
*  renderHiddenLines(), renderPointIndex(); 
*	@method superDebugRender
*	@param {array} dots
*	@param {array} cons
*/
Verlet.prototype.superDebugRender = function(dots,cons) {
	this.renderDots(dots);
	this.renderLines(cons);
	this.renderHiddenLines(cons,0.7,'red');
	this.renderPointIndex(dots);
}

/** 	
 *	Render Lines Between Constrains
*	@method renderLines
*	@param {array} cons
*	@param {number} lineWidth
*	@param {string} color
*/
Verlet.prototype.renderLines = function(cons,linewidth,color,showHidden) {
	if(!showHidden) {showHidden = false;}
	if(cons.length > 0) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = (color || 'black');
		this.ctx.lineWidth = linewidth || 1;
		for(let i = 0; i < cons.length; i++) {
			let c = cons[i];
			if(!c.hidden) {
				this.ctx.moveTo(c.p0.x,c.p0.y);
				this.ctx.lineTo(c.p1.x,c.p1.y);
			}
			if(showHidden === true) {
				if(c.hidden) {
					this.ctx.moveTo(c.p0.x,c.p0.y);
					this.ctx.lineTo(c.p1.x,c.p1.y);
				}
			}
		}
		this.ctx.stroke();
		this.ctx.closePath();
	}
}

/** 	
 *	Render Stress Between Constrains
*	@method renderStress
*	@param {array} cons
*/
Verlet.prototype.renderStress = function(cons) {
	for(let i = 0; i < cons.length; i++) {
		let p = cons[i];
		let diff = p.len - this._distance(p.p1,p.p0);
		let color_diff = Math.round( diff*diff*384 );
		let color = 'rgba(' + (128+color_diff) + ', ' + (128-color_diff) + ', ' + (128-color_diff) + ', 1)';
		
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;

		if(color_diff <= 1) {
			this.ctx.strokeStyle = 'limegreen';
		} else {
			this.ctx.strokeStyle = color;
		}

		this.ctx.moveTo((cons[i].p0.x).toFixed(1),(cons[i].p0.y).toFixed(1));
		this.ctx.lineTo((cons[i].p1.x).toFixed(1),(cons[i].p1.y).toFixed(1));
		this.ctx.stroke();
		this.ctx.closePath();
	}
}

/** 	
 *	Render Hidden Lines Between Constrains
*	@method renderHiddenLines
*	@param {array} cons
*	@param {number} lineWidth
*	@param {string} color
*/
Verlet.prototype.renderHiddenLines = function(cons,linewidth,color) {
	this.ctx.beginPath();
	this.ctx.strokeStyle = (color || 'red');
	this.ctx.lineWidth = linewidth || 1;
	for(let i = 0; i < cons.length; i++) {
		let p = cons[i];
		if(p.hidden) {
			this.ctx.moveTo((cons[i].p0.x).toFixed(1),(cons[i].p0.y).toFixed(1));
			this.ctx.lineTo((cons[i].p1.x).toFixed(1),(cons[i].p1.y).toFixed(1));
		}
	}
	this.ctx.stroke();
	this.ctx.closePath();
};

/** 	
 *	Render Shapes
*	@method renderShapes
*	@param {array} shape
*/
Verlet.prototype.renderShapes = function(shape) {
	if(shape.length > 2) {
		for (let i = 0; i < shape.length; i++) {
			this.ctx.beginPath();
			this.ctx.fillStyle = shape[i].color;
			this.ctx.moveTo(shape[i].paths[0].x,shape[i].paths[0].y);
			for(let j = 1; j < shape[i].paths.length; j++) {
				this.ctx.lineTo(shape[i].paths[j].x,shape[i].paths[j].y);
			}
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
};

/** 	
 *	Render Coordinates of points
*	@method renderCoords
*	@param {array} dots
*	@param {array} cons
*/
Verlet.prototype.renderCoords = function(dots, specific) {
	let osctx = this.osCanvas.getContext('2d');
	osctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	
	osctx.font = '10px Arial';
	osctx.fillStyle = 'black';

	let len = dots.length;
	let only = false;
	if (specific) {
		len = specific.length;
		only = true;
	}
	
	for (let i = 0; i < len; i++) {
		let start = i;
		if(only) {
			start = specific[i];
		}
		let p = dots[start];
		
		let string = 'x'+(p.x).toFixed()+' , y'+(p.y).toFixed();

		osctx.fillText(string,(p.x+10).toFixed(1),(p.y).toFixed(1));
	}
	osctx.fill();
	this.ctx.drawImage(this.osCanvas,0,0);
}


/**
 * updates studio settings
 * @method superRender
 * @param {object} dots []
 * @param {object} cons []
 * @param {object} opt {}
 * 
 * @param {number} opt.pointRadius
 * @param {string} opt.pointColor
 * @param {number} opt.lineWidth
 * @param {string} opt.lineColor
 * @param {string} opt.fontColor
 * @param {string} opt.font
 * @param {number} opt.hiddenLineWidth
 * @param {string} opt.hiddenLineColor
 * @param {boolean} opt.renderDots = true
 * @param {boolean} opt.renderDotsAsBox = false
 * @param {boolean} opt.renderPointHiddelLInes = false
 * @param {boolean} opt.renderLines = true
 * @param {boolean} opt.renderPointIndex = false
 */
Verlet.prototype.superRender = function (dots,cons,opt) {
	// optional settings if undefined set to {}
	let option;
	option = (!opt) ? {} : opt;

	//variables
	let dotsRadius,dotsColor,
			font,fontColor,
			lineWidth,lineColor,
			hiddenLineWidth,hiddenLineColor,
			preset = option.preset;

	// conditional variables
	let renderDots 				= option.renderDots;
	let renderDotsAsBox 	= option.renderDotsAsBox 		|| false;
	let renderLines 			= option.renderLines;
	let renderPointIndex 	= option.renderPointIndex 	|| false;
	let renderHiddenLines = option.renderHiddenLines 	|| false;
	let renderShapes 			= option.renderShapes 			|| false;
	let renderStress 			= option.renderStress 			|| false;
	let renderImages 			= option.renderImages 			|| false;
	let renderCoords 			= option.renderCoords 			|| false;
	let showFps 					= option.showFps 						|| false;

	if(renderDots === undefined) {renderDots = true};
	if(renderLines === undefined) {renderLines = true};
	
	//Setup and load presets
	function setPreset(pr,pcol,lw,lc,f,fc,hlw,hlc) {
		dotsRadius = option.pointRadius || pr;
		dotsColor = option.pointColor || pcol;
		lineWidth = option.lineWidth || lw;
		lineColor = option.lineColor || lc;
		font = option.font || f;
		fontColor = option.fontColor || fc;
		hiddenLineWidth = option.hiddenLineWidth || hlw;
		hiddenLineColor = option.hiddenLineColor || hlc;
	}
	const load = {
		default 		:	[5, 'black',		0.5, 'black',				 '10px Arial',					'black',			0.5, 'red'],
		shadowBlue 	:	[5, 'white',		0.5, 'deepskyblue',	 '10px Century Gothic', 'limegreen',	0.5, 'oragered'],
		shadowRed 	: [5, '#ff5b5b',	0.5, '#ff2e2e',			 '10px Century Gothic', 'slategray',	0.5, 'green'],
		shadowPink 	: [5, 'hotpink',	0.5, 'mediumpurple', '10px Century Gothic', 'slategray',	0.5, 'green'],
		shadowGreen : [5, '#8acf00',	0.5, 'green',				 '10px Century Gothic', 'slategray',	0.5, 'green']
	}
	if(preset) {
		setPreset.apply(null,load[preset]);
	} else {
		setPreset.apply(null,load['default']);
	}

	// is {debug : true}
	if(option.debug) {
		renderPointIndex = option.renderPointIndex || true;
		renderHiddenLines = option.renderHiddenLines || true;
	}

	//renderDots
	if(renderDots) {
		//if point length is greater than 2000 then render boxes
		if(renderDotsAsBox) {
			this.renderDotsAsBox(dots,dotsRadius,dotsColor);
		} else {
			if(dots.length > 2000) {
				this.renderDotsAsBox(dots,dotsRadius,dotsColor);
			} else {
				this.renderDots(dots,dotsRadius,dotsColor);
			}
		}
	}

	//renderHiddenLines
	if(renderHiddenLines) { this.renderHiddenLines(cons,hiddenLineWidth,hiddenLineColor); }

	//renderLines
	if(renderLines){ this.renderLines(cons,lineWidth,lineColor); }

	//renderPointIndex
	if(renderPointIndex) { this.renderPointIndex(dots,font,fontColor); }

	//renderStress
	if(renderStress) { this.renderStress(cons); }

	//renderShapes
	if(option.forms) {
		if(renderShapes) { this.renderShapes(option.forms || []); }
	}

	//renderImages
	if(option.images) { 
		if(renderImages) { this.renderImages(option.images); }
	}
	
	//renderCoords
	if(renderCoords) {
		let specific = (renderCoords === true) ? undefined : renderCoords;
		this.renderCoords(dots,specific);
	}

	//showFps
	if(showFps) { 
		this.showFps(showFps); 
	}	
};

/**
 * Verlet Quick Setup API
 * @description Very Fast Quick Start 
 * @method quickSetup
 * @param {object} option {width,height,gravity,friction,stiffness,append}
 * @param {function} callback returns as parameters => (dots[],cons[])
 */
Verlet.prototype.quickSetup = function(callback,option) {
	if(option === undefined) {option = {}};

	let width 	=  option.width 	|| document.body.offsetWidth;
	let height 	=  option.height || window.innerHeight - 20;
	let grav 		=	(option.gravity 	=== undefined) ? 1 : option.gravity;
	let fri 		=	(option.friction 	=== undefined) ? 1 : option.friction;
	let stiff   =	(option.stiffness === undefined) ? 1 : option.stiffness;
	let append 	=	 option.append || document.body;
	let id 			=	 option.id;
	let studio 	=	 option.initStudio || false;
	
	if(id === undefined) id = 'quicksetup';
	if(typeof append === 'string') {append = document.querySelector(append)}

	let canvas = document.createElement('canvas');
	canvas.id = id;
	canvas.width = width;
	canvas.height = height;
	console.log(append)
	append.appendChild(canvas);

	let verlet = new Verlet();
	let dots = [];
	let cons = [];
	//init
	verlet.init(width,height,'#'+id,grav,fri,stiff);
	
	//main callback
	callback.call(verlet,dots,cons);
	
	//studio
	if(studio) { verlet.Studio.init(option.append); };
	verlet.Interact.move(dots);
	function animate() {
		verlet.frame(animate,option.bg || null);
		
		//isStudio
		if(studio) {
			verlet.Studio.update({
				dots : dots,
				cons : cons,
				renderSettings : option.renderSettings
			});
		} else {
			verlet.superUpdate(dots,cons,option.physicsAccuracy || 10);
			verlet.superRender(dots,cons,option.renderSettings || {preset : option.preset} || {});
		}
		
		if(option.animateScope) {
			option.animateScope.call(verlet,dots,cons);
		}
	}
	animate();
}

/**
 * updated and clears the canvas
 * @param {function} func 
 * @param {string} color optional 
 */
Verlet.prototype.frame = function(func,color) {
	this.clear(color);
	let frame = window.requestAnimationFrame 
							|| window.webkitRequestAnimationFrame 
							|| window.msRequestAnimationFrame 
							|| window.mozRequestAnimationFrame;
	frame(func);
}

/**
 * DEVELOPMENT DONE
 * STAGE : 4
 */

/**
 * creates an array contains a verlet image data 
 * @method throwImage
 * @param {array} ids [1,2,3,4],
 * @param {string} imgsrc image_path
 * @param {array} imgArr empty array
 * @param {array} dots dots
 */
Verlet.prototype.throwImage = function(ids,imgsrc,imgArr,dots) {
	let paths = [];
	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		paths.push(dots[id]);
	}
	imgArr.push({ paths : paths, img : loadImg(imgsrc) });

	function loadImg(str) {
		let img = new Image();
		img.src = str;
		return img;
	}
}

/**
 * Render verlet image data from given array
 * @method renderImages
 * @param {array} images image_array
 */
Verlet.prototype.renderImages = function (images) {
	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		let w = -this._distance(image.paths[0],image.paths[1]);
		let h = this._distance(image.paths[0],image.paths[3]);
		let dx = image.paths[0].x - image.paths[1].x;
		let dy = image.paths[0].y - image.paths[1].y;
		let angle = Math.atan2(dy,dx);
		
		this.ctx.save();
		this.ctx.translate(image.paths[0].x,image.paths[0].y);
		this.ctx.rotate(angle);
		this.ctx.drawImage(image.img,0,0,w,h);
		this.ctx.restore(angle);
	}
}

/**
 * DEVELOPMENT IN PROGRESS
 * STAGE : 3
 */

/**
 * Renders a text from two points
 * @method placeholder
 * @param {array} ids id array
 * @param {string} text image_array
 * @param {array} dots dots array
 * @param {object} offset x and y offsets {x,y}
 */
Verlet.prototype.placeholder = function(ids,text,dots,offset) {
	let w = this._distance(dots[ids[0]],dots[ids[1]]);
	let h = this._distance(dots[ids[0]],dots[ids[1]]);

	if(!offset) {
		offset = {x : 0, y : 0};
	} else {
		if (offset.x === undefined) {
			offset.x = 0;
		}
		if (offset.y === undefined) {
			offset.y = 0;
		}
	}

	let adjustX = w/2-50 + offset.x;
	let adjustY = h/4 + offset.y;

	let dx = dots[ids[1]].x - dots[ids[0]].x;
	let dy = dots[ids[1]].y - dots[ids[0]].y;
	let angle = Math.atan2(dy,dx);

	this.ctx.save();
	this.ctx.translate(dots[ids[0]].x,dots[ids[0]].y);
	this.ctx.rotate(angle);
	this.ctx.font = offset.font || '25px Agency FB';
	this.ctx.fillStyle = offset.color || 'black';
	this.ctx.fillText(text,adjustX,adjustY);
	this.ctx.fill();
	this.ctx.restore(angle);
}

/**
 * shows current framerate 
 * @method showFps
 * @param {object} option 
 */
Verlet.prototype.fpsScope = {
	fps : null,
	bar_vx : 0,
	lastframe : null,
	fpsBars : []
};
Verlet.prototype.showFps = function(option) {
	option = (!option) ? {} : option;
	
	let x = (option.x !== undefined) ? option.x : 10;
	let y = (option.y !== undefined) ? option.y : 10;
	let updateSpeed = (option.updateSpeed !== undefined) ? option.updateSpeed : 3;

	let date = new Date();
	if(!this.fpsScope.lastframe) {
		this.fpsScope.lastframe = date.valueOf();
		this.fpsScope.fps = 0;
		return;
	}

	let delta = (date.valueOf() - this.fpsScope.lastframe) / 1000;
	let frametime = (date.valueOf() - this.fpsScope.lastframe);
	this.fpsScope.lastframe = date.valueOf();

	
	//bar_vx variable for moving bars in x axis
	this.fpsScope.bar_vx++;
	if(this.fpsScope.bar_vx > updateSpeed) {
		this.fpsScope.bar_vx = 0;
	}
	
	//if bar_vx variable is equal to 1 then roundup the fps
	if(this.fpsScope.bar_vx === 0) {
		this.fpsScope.fps = (1/delta).toFixed(1);
	}

	//render
	let color = 'green';
	if (this.fpsScope.fps < 40) { color = 'orange' };
	if (this.fpsScope.fps < 20) { color  = 'red'; };

	this.fpsScope.fpsBars.push({
		x : x+(this.fpsScope.bar_vx),
		y : this.fpsScope.fps/2,
		color : color
	});
	
	if (this.fpsScope.fpsBars.length > 87) { 
		this.fpsScope.fpsBars.shift();
	}
	

	let ctx = this.ctx;
	function drawFpsMeter() {
		ctx.beginPath();

		//bounds
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 0.5;
		ctx.strokeRect(x-5,y-5,100,60);
		ctx.stroke();
		
		//fps
		ctx.fillStyle = '#555';
		ctx.font = option.font || '10px Arial';
		ctx.fillText('FPS : ' + this.fpsScope.fps, x, y+10);
	
		//bars
		ctx.save();
		ctx.scale(1,-1); //rotate
		for (let i = 0; i < this.fpsScope.fpsBars.length; i++) {
			ctx.fillStyle = this.fpsScope.fpsBars[i].color;
			this.fpsScope.fpsBars[i].x += 1;
			ctx.fillRect( this.fpsScope.fpsBars[i].x-2, -50-y, 1.2, this.fpsScope.fpsBars[i].y );
		}
		ctx.restore();
		
		//60fps line
		ctx.strokeStyle = 'crimson';
		ctx.moveTo(x,y+20);
		ctx.lineTo(x+90,y+20);
		ctx.lineWidth = 1;
		ctx.stroke();
		
		ctx.closePath();
	}
	drawFpsMeter.call(this, null);
	
	return this.fpsScope.fps;
}
