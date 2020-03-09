'use strict'

class Evolution {
    constructor(id, width=512, height=512, population=32) {
        this.app = document.getElementById(id);
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        
        this.init(population);
    }
    
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.agents.length; i++) {
            const agent = this.agents[i];
            this.circle(agent.posX, agent.posY, 10, agent.genes.colour);
            agent.update();
        }
        window.requestAnimationFrame(this.update.bind(this));
    }
    
    init(population) {
        this.startPop = population;
        this.agents = [];
        for (let i = 0; i < population; i++) {
            this.agents.push(new Agent(generateGenes(), Math.floor(Math.random() * this.canvas.width), Math.floor(Math.random() * this.canvas.height)));
        }
    }
    
    circle(x, y, radius, colour) {
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = colour;
        this.ctx.strokeStyle = colour;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.stroke();
    }
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
    constructor(genes, x, y) {
        this.genes = genes;
        this.direction = Math.random() * Math.PI * 2;
        this.posX = x;
        this.posY = y;
    }

    update() {
        this.posX += Math.cos(this.direction) + 512;
        this.posY += Math.sin(this.direction) + 512;

        this.posX %= 512;
        this.posY %= 512;
    }
}

let evolution = new Evolution("evolution", 512, 512);

evolution.update();
