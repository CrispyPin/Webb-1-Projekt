'use strict'

let app = document.getElementById("fractal-tree");
let canvas = app.getElementsByTagName("canvas")[0];
canvas.width = 512;
canvas.height = 448;
let ctx = canvas.getContext("2d");

let globalAngle = Math.PI*0.1;
let mod = 0.75;
let iterations = 11;

let palette = [
    "#440",
    "#480",
    "#4a0",
    "#0c0",
    "#0e4",
    "#0f4",
];

function vector(l, angle) {
    return {
        x: Math.cos(angle) * l,
        y: Math.sin(angle) * l
    };
}

function tree(x, y, length, i, angle) {
    if (i==0) { return; }

    let dir = vector(length * mod, angle + globalAngle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = i;//Math.min(i, 3);
    ctx.strokeStyle = palette[iterations-i];
    ctx.lineTo(x + dir.x, y - dir.y);
    ctx.stroke();

    tree(x + dir.x, y - dir.y, length*mod, i-1, angle - globalAngle);
    tree(x + dir.x, y - dir.y, length*mod, i-1, angle + globalAngle);
}

function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tree(256, canvas.height-64, 128, iterations, Math.PI/2 - globalAngle);
}

function mouseMove(event) {
    let x = event.clientX - canvas.getBoundingClientRect().left;
    globalAngle = x * Math.PI / 256 + Math.PI;
    render();
}

canvas.addEventListener("mousemove", mouseMove);

render();