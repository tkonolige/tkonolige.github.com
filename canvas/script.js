//when body loads
$(function() {
    phys = {}; // just hold friction
    var ctx = $('#canvas')[0].getContext('2d');
    var WIDTH = $("#canvas").width();
    var HEIGHT = $("#canvas").height();
    var INTERVAL = 30; // update rate in milliseconds
    var DELTA = 2; // delta between frames
    phys.FRICTION = .95; // velocity *= FRICTION
    var MAXA = .2; // max acceleration
    var particles = []; //hold particles
    var mouseX; // for storing mouse position
    var mouseY;
    var mouseVX;
    var mouseVY;
    var prevMouseX = 0;
    var prevMouseY = 0;
    var mouseDown = false;
    var NUMBER = 200; // number of particles

    //populate particles array
    for (i = 0; i < NUMBER; i++) {
        var p = new Particle();
        p.x = WIDTH / 2 + Math.cos(i) * Math.random() * 10;
        p.y = HEIGHT / 2 + Math.sin(i) * Math.random() * 10;
        p.vx = Math.cos(i) * Math.random() * 15;
        p.vy = Math.sin(i) * Math.random() * 15;
        particles[i] = p;
    }

    //get mouse
    document.onmousemove = onDocMouseMove;
    document.onmousedown = onDocMouseDown;
    document.onmouseup = onDocMouseUp;


    // TODO: use browser update to not draw to often
    return setInterval(draw, INTERVAL); // call draw function continuously

    //draw function
    function draw() {
        //draw over, gives little trails behind each particle
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(8,8,12,.65)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalCompositeOperation = "lighter";

        //mouse positions
        mouseVX = mouseX - prevMouseX;
        mouseVY = mouseY - prevMouseY;
        prevMouseX = mouseX;
        prevMouseY = mouseY;

        //individual partical math
        for (x = 0; x < particles.length; x++) {
            p = particles[x];

            // this uses forward euler, I didn't know anything better at the time
            // compute acceleration
            // mouse functions as a source of gravity
            if (mouseX == undefined) {
                mouseX = WIDTH / 2;
            }
            if (mouseY == undefined) {
                mouseY = HEIGHT / 2;
            }
            dx = mouseX - p.x;
            dy = mouseY - p.y;
            distance = Math.sqrt(dy * dy + dx * dx);
            // the min prevents particles from going too fast
            a = Math.min(100 / distance / p.weight, MAXA);
            if (mouseDown) {
                a *= -10;
            }
            theta = Math.atan2(dy, dx);
            aX = a * Math.cos(theta);
            aY = a * Math.sin(theta);

            //compute velocity
            p.vx += DELTA * aX;
            p.vy += DELTA * aY;
            p.vx *= phys.FRICTION;
            p.vy *= phys.FRICTION;

            //compute position
            p.x += p.vx * DELTA;
            p.y += p.vy * DELTA;
            //bounce off walls
            if (p.x > WIDTH || p.x < 0) {
                p.vx *= -1;
                if (p.x > WIDTH) {
                    p.x = WIDTH;
                } else {
                    p.x = 0;
                }
            }
            if (p.y > HEIGHT || p.y < 0) {
                p.vy *= -1;
                if (p.y > HEIGHT) {
                    p.y = HEIGHT;
                } else {
                    p.y = 0;
                }
            }

            ctx.fillStyle = p.color;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.weight, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();

            /* to show acceleration
			      ctx.beginPath();
      			ctx.moveTo(p.x,p.y);
      			ctx.lineTo(p.x+aX*100,p.y+aY*100);
      			ctx.strokeStyle = "#A4f";
      			ctx.stroke();*/
        }
    }

    //more mouse stuff
    function onDocMouseMove(e) {
        var ev = e ? e: window.event;
        mouseX = ev.clientX - $("#canvas")[0].offsetLeft;
        mouseY = ev.clientY - $("#canvas")[0].offsetTop;
    }
    function onDocMouseDown(e) {
        mouseDown = true;
        return false;
    }

    function onDocMouseUp(e) {
        mouseDown = false;
        return false;
    }

    // particle object
    function Particle() {
        this.color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
        this.y = 0;
        this.x = 0;
        this.vx = 0;
        this.vy = 0;
        this.weight = Math.random() * 2 + 2;
    }
});

