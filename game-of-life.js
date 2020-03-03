'use strict'

let app = document.getElementById("game-of-life");
let canvas = app.getElementsByTagName("canvas")[0];
canvas.width = 512;
canvas.height = 512;
let ctx = canvas.getContext("2d");

let playBtn = document.getElementById("play-button");

//neighbor positions
const nx = [-1, 0, 1, -1, 1, -1, 0, 1];
const ny = [-1, -1, -1, 0, 0, 1, 1, 1];

let worldWidth = 32;
let worldHeight = 32;
let world = matrix(worldWidth, worldHeight, "r");
let running = false;

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
                //add to neighbor count of all surrounding tiles
                for (let pos = 0; pos < 8; pos++) {
                    let xp = x+nx[pos];
                    let yp = y+ny[pos];
                    if (xp < worldWidth && xp > 0 && yp < worldHeight && yp > 0) {
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
                ctx.fillRect(x*16, y*16, 16, 16)
            }
        }
    }
}

function run() {
    sinceStep++;
    if (sinceStep >= timeStep) {
        sinceStep = 0;
        step();
        render();
    }
    if (running) {
        window.requestAnimationFrame(run);
    }
}

function clickCell(event) {
    console.log(event.clientX, event.clientY);
    
}

function toggle() {
    running = !running;
    if (running) {
        playBtn.textContent = "PAUSE";
        run();
    } else {
        playBtn.textContent = "PLAY";
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

function randomise() {
    world = matrix(worldWidth, worldHeight, "r");
    render();
}

canvas.addEventListener("mousedown", clickCell);

render();
