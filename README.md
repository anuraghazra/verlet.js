<!-- # Verlet.js -->

![Verlet.js Logo](./src/images/logo.png)

*Verlet.js* is a javascript library for creating rapid and fast **verlet physics** based models and structures.. Its API Is Amazing....check this out..

> **``The Awsome API``**

> **``You can create a cloth in just 3 lines of javascript``**

# Get Started

### Create A Cloth In 3 Lines Of Code
```javascript
  Verlet().quickSetup(function(dots,cons) {
    this.Poly.cloth({},dots,cons)
  })
```

### All Poly Objects
* Verlet.Poly.box({},dots,cons)
* Verlet.Poly.triangle({},dots,cons)
* Verlet.Poly.beam({},dots,cons)
* Verlet.Poly.hexagon({},dots,cons)
* Verlet.Poly.rope({},dots,cons)
* Verlet.Poly.cloth({},dots,cons)

<hr>

## Main API Usage
check out the demo [here](./tests/main_api_usage.html)

<hr>


### .html

```html 
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Verlet.js API Usage</title>
  <script src="js/verlet.js"></script>
</head>
<body>
  
  <canvas id="c"></canvas>

</body>
</html>
```
<hr>

### .js
```javascript
//on loaded
window.onload = function() {

  //create a new instance
  const verlet = new Verlet();

  // verlet.init(width, height, canvasid, gravity, friction, stiffness)
  verlet.init(500,500,'#c',1,1,1);

  // need two arrays for points and constrains
  let dots = [];
  let cons = [];

  //verlet.Poly.box({width,height,x,y}, cons[], dots[])
  verlet.Poly.box({
    width : 150, 
    height : 100,
    x : 100, y : 100
  },dots, cons)

  //to interact with points in realtime
  verlet.Interact.move(dots)
  function animate() {
    //clears the canvas every time
    verlet.clear();
    
    //verlet.superUpdate(dots[], cons[], physicsAccuracy)
    verlet.superUpdate(dots,cons,10);

    //verlet.superRender(dots[], cons[], {})
    verlet.superRender(dots,cons,{});

    //loop
    requestAnimationFrame(animate)
  }
  animate();
}
```

<hr>

## Poly Objects Options

### Creating And Modifying Poly Models

check out the demo [here](./tests/poly_objects_demo.html)


```javascript
// If You Dont Specify Any Properties The Defaults Will Be Applied

//verlet.Poly.box({x,y,width,height}, cons[], dots[])
verlet.Poly.box({
  x : 100,
  y : 100,
  width : 100, 
  height : 100,
},dots, cons);

//verlet.Poly.triangle({x,y,width,height}, cons[], dots[])
verlet.Poly.triangle({
  x : 100,
  y : 100,
  width : 100,
  height : 150
},dots, cons);

//verlet.Poly.hexagon({x,y,radius,sides,slice1,slice2,center}, cons[], dots[])
verlet.Poly.hexagon({
  x : 100,
  y : 100,
  radius : 50,
  sides : 16,
  slice1 : 1,
  slice2 : 12,
  center : true
},dots, cons);

//verlet.Poly.beam({x,y,width,height,segs}, cons[], dots[])
verlet.Poly.beam({
  x : 100,
  y : 100,
  width : 50,
  height : 50,
  segs : 10,
},dots, cons);

//verlet.Poly.rope({x,y,segs,gap}, cons[], dots[])
verlet.Poly.rope({
  x : 100,
  y : 100,
  segs : 25,
  gap : 15 
},dots, cons);

//verlet.Poly.cloth({x,y,segs,gap,pinRatio}, cons[], dots[])
verlet.Poly.cloth({
  x : 100,
  y : 100,
  segs : 20,
  gap : 15,
  pinRatio : 10
},dots, cons);

```

<hr>

## Creating Your Own Models

check out the demo [here](./tests/custom_models.html)

```javascript
window.onload = function() {
  const verlet = new Verlet();
  verlet.init(window.innerWidth-10,500,'#c',1,1,1);

  let dots = [];
  let cons = [];
  
  // custom points
  // [[x,y,velocityX,velocityY,pinned]]
  // vx,vy,pinned is optional
  let myModel_dots = [
    [100,100],
    [200,100],
    [200,200],
    [100,200],
  ];

  //custom constrains
  // [[index,index]]
  let myModel_cons = [
    [0,1],
    [1,2],
    [2,3],
    [3,0],
    [3,1],
  ];


  //verlet.create(newDots[],oldDots[]);
  verlet.create(myModel_dots,dots);

  //verlet.clamp(newCons[],cons[],dots[])
  verlet.clamp(myModel_cons,cons,dots);


  verlet.Interact.move(dots)
  function animate() {
    verlet.clear();
    
    verlet.superUpdate(dots,cons,25);
    verlet.superRender(dots,cons,{
      preset : 'shadowRed'
    });

    requestAnimationFrame(animate);
  }
  animate();
}
```

<hr>

## Render Settings

`You can also use some render presets`

### Render Options You Can Tweak
* pointRadius : 5
* pointColor : 'crimson'
* lineWidth : 1
* lineColor : 'blue'
* fontColor : 'green'
* font : 'Arial 8px'
* hiddenLineWidth : 1
* hiddenLineColor : 'red'
* renderDots : true
* renderDotsAsBox : false
* renderPointIndex : false
* renderLines : true
* renderPointHiddelLInes : false
* debug : false

### Render Preset Names
* default
* shadowRed
* shadowPink
* shadowBlue
* shadowGreen

```javascript
window.onload = function() {
  const verlet = new Verlet();
  verlet.init(500,500,'#c',1,1,1);

  let dots = [];
  let cons = [];

  verlet.Poly.box({
    width : 150, 
    height : 100,
    x : 100, y : 100
  },dots, cons)


  verlet.Interact.move(dots)
  function animate() {
    verlet.clear();
    
    verlet.superUpdate(dots,cons,10);


    /* ==== render Settings ====*/
    verlet.superRender(dots,cons,{
      pointRadius : 5
      pointColor : 'crimson'
      lineColor : 'deepskyblue'
      preset : 'shadowRed'
    });


    requestAnimationFrame(animate)
  }
  animate();
}

```

<hr>

## quickSetup Settings
check out the demo [here](./tests/quickSetup_demo.html)

```javascript

//quickSetup Settings Parameters Are Optional

Verlet().quickSetup(function(dots,cons) {
    this.Poly.cloth({},dots,cons);
  },{
    renderSettings : {
      preset : 'shadowRed'
    },
    width : 500,
    height : 500,
    gravity : 0,
    friction : 0.94,
    stiffness : 0.99,
    append : document.body
  });
```

## Browse [./tests](./tests) Folder To See API Usage Demos  


### Contact Me
>Email Me : hazru.anurag@gmail.com

>I Am A : Proud Indian

>And Citizen Of : Kolkata

