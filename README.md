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


## View [./test](./test) folder to get some basic API Usage Demo  


### Contact Me
>Email Me : hazru.anurag@gmail.com

>I Am A : Proud Indian

>And Citizen Of : Kolkata

