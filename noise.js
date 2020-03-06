'use strict'


class WorleyNoise {
    constructor(width, height, n) {
        this.app = document.getElementById("worley-noise");
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");

        this.generatePoints(n);
        this.render();
    }
    
    generatePoints(n) {
        this.points = [];
        for (let i = 0; i < n; i++) {
            let x = Math.floor(Math.random() * this.canvas.width);
            let y = Math.floor(Math.random() * this.canvas.height);
            this.points.push({x:x, y:y});
        }
    }

    render() {
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                let val = this.gradient(x, y)/50;
                this.ctx.fillStyle = "rgb(0,"+val+","+val+")";
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    }
    
    gradient(x, y) {
        let mindist = 999999;
        for (let p = 0; p < this.points.length; p++) {//find closest point
            let point = this.points[p];
            let dist = (point.x-x)**2 + (point.y-y)**2;
            if (dist < mindist) {
                mindist = dist;
            }
        }
        return mindist; 
    }
}

let worleyNoise = new WorleyNoise(512, 512, 32);
