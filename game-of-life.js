'use strict'

//neighbor positions
const nx = [-1, 0, 1, -1, 1, -1, 0, 1];
const ny = [-1, -1, -1, 0, 0, 1, 1, 1];


class GameOfLife {
    constructor(id, width, height, cellSize, rule=[2, 3, 3, 3]) {
        this.app = document.getElementById(id);
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.ctx = this.canvas.getContext("2d");
        
        this.canvas.width = width * cellSize;
        this.canvas.height = height * cellSize;
        
        this.playBtn = this.app.getElementsByClassName("play-button")[0];
        this.stepBtn = this.app.getElementsByClassName("step-button")[0];

        this.run = this.run.bind(this);
        
        this.worldWidth = width;
        this.worldHeight = height;
        this.world = matrix(width, height);
        this.cellSize = cellSize;
        this.rule = rule;
        
        this.running = false;
        this.drawMode = -1;
        
        this.timeStep = 15;//frames per step
        this.sinceStep = 0;

        this.canvas.addEventListener("mousedown", this.drawStart.bind(this));
        this.canvas.addEventListener("mouseup", this.drawEnd.bind(this));
        this.canvas.addEventListener("mousemove", this.drawCells.bind(this));
        
        
        this.canvas.addEventListener("contextmenu", function(e) {
            if (e.button == 2) {
                e.preventDefault();
            }
        })
        
        this.render();
    }

    step() {
        let newWorld = matrix(this.worldWidth, this.worldHeight);
        let neighbors = matrix(this.worldWidth, this.worldHeight, 0);
        
        //count neighbors
        for (let y = 0; y < this.worldHeight; y++) {
            for (let x = 0; x < this.worldWidth; x++) {
                if (this.world[y][x]) {
                    //add to neighbor count of all surrounding cells
                    for (let pos = 0; pos < 8; pos++) {
                        let xp = x+nx[pos];
                        let yp = y+ny[pos];
                        if (xp < this.worldWidth && xp >= 0 && yp < this.worldHeight && yp >= 0) {
                            neighbors[yp][xp]++;
                        }
                    }
                }
            }
        }
    
        //update state
        for (let y = 0; y < this.worldHeight; y++) {
            for (let x = 0; x < this.worldWidth; x++) {
                newWorld[y][x] = this.newState(this.world[y][x], neighbors[y][x]);
            }
        }
        
        this.world = newWorld;
        
        this.render();
    }
    
    newState(state, neighbors) {
        if (state) {
            return (neighbors >= this.rule[0] && neighbors <= this.rule[1]);
        } else {
            return (neighbors >= this.rule[2] && neighbors <= this.rule[3]);;
        }
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#db3";
        for (let y = 0; y < this.worldHeight; y++) {
            for (let x = 0; x < this.worldWidth; x++) {
                if (this.world[y][x]) {
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
                }
            }
        }
    }
    
    run() {
        this.sinceStep++;
        if (this.sinceStep >= this.timeStep) {
            this.sinceStep = 0;
            this.step();
        }
        if (this.running) {
            window.requestAnimationFrame(this.run);
        }
    }
    
    drawStart(event) {
        let y = event.clientY - this.canvas.getBoundingClientRect().top;
        let x = event.clientX - this.canvas.getBoundingClientRect().left;
        
        let cellx = Math.floor(x / this.cellSize);
        let celly = Math.floor(y / this.cellSize);
    
        this.drawMode = 1;
        if (this.world[celly][cellx] || event.button == 2) {
            this.drawMode = 0;
        }
    
        this.drawCells(event);
    }
    
    drawCells(event) {
        //called when mouse moves
        if (this.drawMode == -1) {
            return;
        }
        let y = event.clientY - this.canvas.getBoundingClientRect().top;
        let x = event.clientX - this.canvas.getBoundingClientRect().left;
        
        let cellx = Math.floor(x / this.cellSize);
        let celly = Math.floor(y / this.cellSize);
        
        this.world[celly][cellx] = this.drawMode == 1;
        this.render();
    }
    
    drawEnd(event) {
        this.drawMode = -1;
    }
    
    toggleRunning() {
        this.running = !this.running;
        if (this.running) {
            this.playBtn.textContent = "Pause";
            this.stepBtn.disabled = true;
            this.run();
        } else {
            this.playBtn.textContent = "Play";
            this.stepBtn.disabled = false;
        }
    }
    
    speedUp() {
        if (this.timeStep > 1) {
            this.timeStep /= 2;
        }
    }
    
    slowDown() {
        if (this.timeStep < 30) {
            this.timeStep *= 2;
        }
    }
    
    randomizeWorld() {
        this.world = matrix(this.worldWidth, this.worldHeight, "r");
        this.render();
    }
    
    clearWorld() {
        this.world = matrix(this.worldWidth, this.worldHeight);
        this.render();
    }

    setMinA(x) {
        this.rule[0] = x;
    }
    setMaxA(x) {
        this.rule[1] = x;
    }
    setMinD(x) {
        this.rule[2] = x;
    }
    setMaxD(x) {
        this.rule[3] = x;
    }
}


function matrix(width, height, fill=false, weight=0.3) {
    let m = [];
    let content = fill;

    for (let y = 0; y < height; y++) {
        let n = [];
        for (let x = 0; x < width; x++) {
            if (fill == "r") {
                content = Math.random() < weight;
            }
            n.push(content);
        }
        m.push(Array.from(n));
    }
    return m;
}


let gameOfLife = new GameOfLife("game-of-life", 32, 32, 16);
let gameOfLifeAdvanced = new GameOfLife("game-of-life-advanced", 32, 32, 16);
