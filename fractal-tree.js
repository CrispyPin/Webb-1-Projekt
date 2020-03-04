'use strict'

let app = document.getElementById("fractal-tree");
let canvas = app.getElementsByTagName("canvas")[0];
canvas.width = 512;
canvas.height = 512;
let ctx = canvas.getContext("2d");

let globalAngle = Math.PI*0.1;
let mod = 0.8;

function vector(l, angle) {
    let x = Math.cos(angle) * l;
    let y = Math.sin(angle) * l;
    if (angle > Math.PI / 2) {
        x = -x;
    }
    return {
        x: x,
        y: y
    };
}

function tree(x, y, length, i, angle) {
    if (i==0) {
        return;
    }
    let right = vector(length * 0.5, angle + globalAngle);
    let left = vector(length * 0.5, angle - globalAngle);
    ctx.lineWidth = Math.min(i, 3);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + left.x, y - left.y);
    ctx.moveTo(x, y);
    ctx.lineTo(x + right.x, y - right.y);
    ctx.stroke();
    tree(x + left.x, y - left.y, length*mod, i-1, angle + globalAngle);
    tree(x + right.x, y - right.y, length*mod, i-1, angle - globalAngle);
}

function render(angle) {
    globalAngle = angle;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#b0b";
    tree(256, 256, 128, 8, Math.PI/2);
}

function mouseMove(event) {
    mod = event.clientY / 1024 + 0.5;
    render(event.clientX * Math.PI / 256 + Math.PI);
}

canvas.addEventListener("mousemove", mouseMove);

render();