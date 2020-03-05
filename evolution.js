'use strict'

let app = document.getElementById("evolution");
let canvas = document.createElement("canvas");
app.appendChild(canvas);
let ctx = canvas.getContext("2d");


let agents = [];
let population = 32;



function circle(x, y, radius, colour) {
    ctx.lineWidth = 1;
    ctx.fillStyle = colour;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
}

function generateGenes() {
    let genes = "#"
    for (let i = 0; i < 6; i++) {
        genes += Math.floor(Math.random()*16).toString(16);
    }
    
    console.log(genes);
    
    return genes;
}

class Agent {
    constructor(genes) {
        this.genes = genes;
        this.age = 0;
        this.direction = Math.random() * Math.PI * 2;
        this.posx = Math.floor(Math.random() * canvas.width);
        this.posy = Math.floor(Math.random() * canvas.height);
    }

    update() {
        circle(this.posx, this.posy, 10, this.genes);

        this.age++;
        this.posx += Math.cos(this.direction) + canvas.width;
        this.posy += Math.sin(this.direction) + canvas.height;

        this.posx %= canvas.width;
        this.posy %= canvas.height;
    }
}

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        agent.update();
    }
    window.requestAnimationFrame(main);
}

function init() {
    for (let i = 0; i < population; i++) {
        agents.push(new Agent(generateGenes()));
    }
}

init();
main();