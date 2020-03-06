'use strict'

let cellapp = document.getElementById("cell-noise");
let cellcanvas = cellapp.getElementsByTagName("canvas")[0];
cellcanvas.width = 512;
cellcanvas.height = 512;
let cellctx = cellcanvas.getContext("2d");

let points = [];

for (let i = 0; i < 32; i++) {
    let x = Math.floor(Math.random() * cellcanvas.width);
    let y = Math.floor(Math.random() * cellcanvas.height);
    points.push({x:x, y:y});
}

function gradient(x, y) {
    let mindist = 999999;
    let mini = -1;
    for (let p = 0; p < points.length; p++) {//find closest point
        const point = points[p];
        let dist = (point.x-x)**2 + (point.y-y)**2;
        if (dist < mindist) {
            mindist = dist;
            mini = p;
        }
    }
    return mindist; 
}

function render() {
    for (let y = 0; y < cellcanvas.height; y++) {
        for (let x = 0; x < cellcanvas.width; x++) {
            let val = gradient(x, y)/50;
            cellctx.fillStyle = "rgb(0,"+val+","+val+")";
            cellctx.fillRect(x, y, 1, 1);
        }
    }
}

function mouseMove(event) {
    points.pop();
    let x = event.clientX - cellcanvas.getBoundingClientRect().left;
    let y = event.clientY - cellcanvas.getBoundingClientRect().top;
    points.push({x:x, y:y});
    render();
}

render();

cellcanvas.addEventListener("mousemove", mouseMove);