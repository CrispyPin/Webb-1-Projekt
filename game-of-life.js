'use strict'

let app = document.getElementById("game-of-life");
let canvas = app.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");

let playBtn = document.getElementById("play-button");
let stepBtn = document.getElementById("step-button");

//neighbor positions
const nx = [-1, 0, 1, -1, 1, -1, 0, 1];
const ny = [-1, -1, -1, 0, 0, 1, 1, 1];

let worldWidth = 32;
let worldHeight = 32;
let world = matrix(worldWidth, worldHeight, "r");
let running = false;

let drawMode = -1;

let cellSize = 24;

canvas.width = worldWidth * cellSize;
canvas.height = worldHeight * cellSize;

let timeStep = 15;//frames per step
let sinceStep = 0;

function matrix(width, height, fill=false) {
    let m = [];
    let content = fill;

    for (let y = 0; y < height; y++) {
        let n = [];
        for (let x = 0; x < width; x++) {
            if (fill == "r") {
                content = Math.random() < 0.3;
            }
            n.push(content);
        }
        m.push(Array.from(n));
    }
    return m;
}


function step() {
    let newWorld = matrix(worldWidth, worldHeight);
    let neighbors = matrix(worldWidth, worldHeight, 0);
    
    //count neighbors
    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            if (world[y][x]) {
                //add to neighbor count of all surrounding cells
                for (let pos = 0; pos < 8; pos++) {
                    let xp = x+nx[pos];
                    let yp = y+ny[pos];
                    if (xp < worldWidth && xp >= 0 && yp < worldHeight && yp >= 0) {
                        neighbors[yp][xp]++;
                    }
                }
            }
        }
    }

    //update state
    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            newWorld[y][x] = newState(world[y][x], neighbors[y][x]);
        }
    }
    
    world = newWorld;
    
    render();
}

function newState(state, neighbors) {
    if (state) {
        return (neighbors > 1 && neighbors < 4);
    } else {
        return neighbors == 3;
    }
}

function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0bb";
    for (let y = 0; y < worldHeight; y++) {
        for (let x = 0; x < worldWidth; x++) {
            if (world[y][x]) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1)
            }
        }
    }
}

function run() {
    sinceStep++;
    if (sinceStep >= timeStep) {
        sinceStep = 0;
        step();
    }
    if (running) {
        window.requestAnimationFrame(run);
    }
}

function drawStart(event) {
    let y = event.clientY - canvas.getBoundingClientRect().top;
    let x = event.clientX - canvas.getBoundingClientRect().left;
    
    let cellx = Math.floor(x / cellSize);
    let celly = Math.floor(y / cellSize);

    drawMode = 1;
    if (world[celly][cellx] || event.button == 2) {
        drawMode = 0;
    }

    drawCells(event);
}

function drawCells(event) {
    //called when mouse moves
    if (drawMode == -1) {
        return;
    }
    let y = event.clientY - canvas.getBoundingClientRect().top;
    let x = event.clientX - canvas.getBoundingClientRect().left;
    
    let cellx = Math.floor(x / cellSize);
    let celly = Math.floor(y / cellSize);
    
    world[celly][cellx] = drawMode == 1;
    render();
}

function drawEnd(event) {
    drawMode = -1;
}

function keyPress(event) {
    if (event.code == "Space") {
        toggleRunning();
    }
}


function toggleRunning() {
    running = !running;
    if (running) {
        playBtn.textContent = "PAUSE";
        stepBtn.hidden = true;
        run();
    } else {
        playBtn.textContent = "PLAY";
        stepBtn.hidden = false;
    }
}

function speedUp() {
    if (timeStep > 1) {
        timeStep /= 2;
    }
}

function slowDown() {
    if (timeStep < 30) {
        timeStep *= 2;
    }
}

function randomizeWorld() {
    world = matrix(worldWidth, worldHeight, "r");
    render();
}

function clearWorld() {
    world = matrix(worldWidth, worldHeight);
    render();
}

canvas.addEventListener("mousedown", drawStart);
canvas.addEventListener("mouseup", drawEnd);
canvas.addEventListener("mousemove", drawCells);
document.addEventListener("keypress", keyPress);


canvas.addEventListener("contextmenu", function(e) {
    if (e.button == 2) {
        e.preventDefault();
    }
})

render();
