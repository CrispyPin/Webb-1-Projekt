'use strict'

class Evolution {
    constructor(id, width=512, height=512, population=32) {
        this.app = document.getElementById(id);
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        
        this.restartBtn = this.app.getElementsByClassName("controlbar")[0].getElementsByTagName("button")[0];

        this.drawSight = true;
        this.startPop = population
        this.restart();

        this.sinceFood = 0;
        this.foodDelay = 180;
    }

    restart() {
        this.food = [];
        this.spawnFood(32);
        this.init(this.startPop);
    }
    
    spawnFood(n) {
        for (let i = 0; i < n; i++) {
            this.food.push(food(Math.random()*this.canvas.width, Math.random()*this.canvas.height, 40))
        }
    }
    
    render() {
        this.ctx.fillStyle = "#040";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#0f0";
        for (let i = 0; i < this.food.length; i++) {
            const food = this.food[i];
            this.circle(food.x, food.y, food.amount/10, "#0c0");
        }

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#fff";
        for (let i = 0; i < this.agents.length; i++) {
            const agent = this.agents[i];
            this.circle(agent.posX, agent.posY, 10, agent.genes.colour);
        }

        if (this.drawSight) {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "#f00";
    
            for (let i = 0; i < this.agents.length; i++) {
                const agent = this.agents[i];
                this.ctx.beginPath();
                this.ctx.arc(agent.posX, agent.posY, agent.genes.sight, 0, Math.PI*2);
                this.ctx.moveTo(agent.posX, agent.posY);
                this.ctx.lineTo(agent.posX + Math.cos(agent.direction) * agent.genes.sight, agent.posY + Math.sin(agent.direction) * agent.genes.sight);
                
                this.ctx.stroke();
            }
        } else {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "#f00";
    
            for (let i = 0; i < this.agents.length; i++) {
                const agent = this.agents[i];
                this.ctx.beginPath();
                this.ctx.moveTo(agent.posX, agent.posY);
                this.ctx.lineTo(agent.posX + Math.cos(agent.direction) * 10, agent.posY + Math.sin(agent.direction) * 10);
                
                this.ctx.stroke();
            }
        }

    }
    
    update() {
        this.sinceFood += 1;
        if (this.sinceFood >= this.foodDelay) {
            this.sinceFood = 0;
            this.spawnFood(16);
        }

        for (let i = 0; i < this.agents.length; i++) {
            const agent = this.agents[i];
            agent.move();
            if (agent.energy <= 0) {
                this.food.push(food(agent.posX, agent.posY, 40));
                this.agents.splice(i, 1);
            } else {
                let mindist = 99999;
                let closest = undefined;
                let fi = -1;
                for (let f = 0; f < this.food.length; f++) {
                    const food = this.food[f];
                    let dist = Math.sqrt((agent.posX-food.x)**2 + (agent.posY-food.y)**2);
                    if (dist < mindist) {
                        mindist = dist;
                        closest = food;
                        fi = f;
                    }
                }
                if (agent.updateFood(closest, mindist)) {
                    this.food.splice(fi, 1);
                }
                let ce = agent.updateChild()
                if (ce) {
                    this.agents.push(new Agent(mutate(agent.genes), ce, this.canvas.width, this.canvas.height, agent.posX, agent.posY));
                }
            }
        }
        this.render();
        this.restartBtn.textContent = "Restart [" + this.agents.length + "]";
        window.requestAnimationFrame(this.update.bind(this));
    }

    snap() {
        this.agents.splice(0,this.agents.length/2);
        
    }
    
    init(population) {
        this.agents = [];
        for (let i = 0; i < population; i++) {
            this.agents.push(new Agent(generateGenes(), 50, this.canvas.width, this.canvas.height));
        }
    }
    
    circle(x, y, radius, colour) {
        this.ctx.fillStyle = colour;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.stroke();
    }
}



class Agent {
    constructor(genes, energy, worldX, worldY, x, y) {
        this.genes = genes;
        if (x != undefined){
            this.posX = x;
            this.posY = y;
        } else {
            this.posX = Math.floor(Math.random() * worldX);
            this.posY = Math.floor(Math.random() * worldY);

        }
        this.worldX = worldX;
        this.worldY = worldY;
        
        this.direction = Math.random() * Math.PI * 2;
        this.energy = energy;
    }

    move() {
        this.posX += 0.02 * this.genes.speed * Math.cos(this.direction);
        this.posX = (this.worldX + this.posX) % this.worldX;
        this.posY += 0.02 * this.genes.speed * Math.sin(this.direction);
        this.posY = (this.worldY + this.posY) % this.worldY;

        this.energy -= (0.02*this.genes.speed)**2/100 + this.genes.sight/1000 + 0.01;
    }
    
    updateFood(closestFood, dist) {
        if (dist > this.genes.sight) {
            return;
        }
        if (dist < 15) {
            this.energy += closestFood.amount;
            this.energy = Math.min(this.energy, 100);
            return true;
        }
        this.direction = Math.PI/2 + Math.atan2(Math.abs(this.posX - closestFood.x), Math.abs(this.posY - closestFood.y));
    }
    
    updateChild() {
        if (this.energy > this.genes.makeChild) {
            this.energy -= this.genes.giveChild;
            return this.genes.giveChild;
        }
    }
}

function mutate(genes, chance) {
    for (const name in genes) {
        const gene = genes[name];
        if (Math.random() <= chance) {
            gene += Math.random()*10 - 5;
        }
    }
    return genes;
}

function generateGenes() {
    let genes = {}
    genes.colour = "#"
    for (let i = 0; i < 6; i++) {
        genes.colour += Math.floor(Math.random()*16).toString(16);
    }
    genes.speed = Math.random() * 100;
    genes.sight = Math.random() * 100;// pixels to scan out for food (radius)
    genes.giveChild = 10 + Math.random() * 40;// amount of energy to give child. could kill parent if more than the parents energy
    genes.makeChild = 80;// genes.givechild + Math.random() * 40;
    
    return genes;
}

function food(x, y, amount) {
    return {
        x: x,
        y: y,
        amount: amount
    };
}

let evolution = new Evolution("evolution", 512, 512);

evolution.update();
