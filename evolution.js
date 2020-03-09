'use strict'

class Evolution {
    constructor(id, width=512, height=512, population=32) {
        this.app = document.getElementById(id);
        this.canvas = document.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext("2d");
        
        this.init(population);
    }
    
    update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < agents.length; i++) {
            const agent = agents[i];
            agent.render();
            agent.update();
        }
        window.requestAnimationFrame(this.update);
    }
    
    init(population) {
        this.population = population;
        this.agents = [];
        for (let i = 0; i < population; i++) {
            agents.push(new Agent(generateGenes()));
        }
    }
}


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
    let genes = {}
    genes.colour = "#"
    for (let i = 0; i < 6; i++) {
        genes.colour += Math.floor(Math.random()*16).toString(16);
    }
    
    return genes;
}

class Agent {
    constructor(genes) {
        this.genes = genes;
        this.direction = Math.random() * Math.PI * 2;
        this.posx = Math.floor(Math.random() * canvas.width);
        this.posy = Math.floor(Math.random() * canvas.height);
    }

    render() {
        circle(this.posx, this.posy, 10, this.genes.colour);
    }

    update() {
        this.posx += Math.cos(this.direction) + canvas.width;
        this.posy += Math.sin(this.direction) + canvas.height;

        this.posx %= canvas.width;
        this.posy %= canvas.height;
    }
}

let evolution = new Evolution("evolution", 512, 512);

evolution.update();
