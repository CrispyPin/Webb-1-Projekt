'use strict'


class WorleyNoise {
    constructor(width, height, n) {
        this.app = document.getElementById("worley-noise");
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");

        this.renderBtn = this.app.getElementsByClassName("controlbar")[0].getElementsByTagName("button")[0];

        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this.click.bind(this));

        this.nPoints = n;
        this.generatePoints();
        this.render();
    }

    mouseMove(event) {
        this.points.pop();
        let x = event.clientX - this.canvas.getBoundingClientRect().left;
        let y = event.clientY - this.canvas.getBoundingClientRect().top;
        this.points.push({x:x, y:y});
        this.render()
    }
    
    click(event) {
        let x = event.clientX - this.canvas.getBoundingClientRect().left;
        let y = event.clientY - this.canvas.getBoundingClientRect().top;
        this.points.push({x:x, y:y});
        this.distances.push(40 + Math.random() * 60);
        this.render()
    }
    
    generatePoints() {
        this.points = [];
        this.distances = []
        for (let i = 0; i < this.nPoints; i++) {
            let x = Math.floor(Math.random() * this.canvas.width);
            let y = Math.floor(Math.random() * this.canvas.height);
            this.points.push({x:x, y:y});
            let d = 40 + Math.random() * 60;
            this.distances.push(d);
        }
    }
    
    render() {
        let start = new Date();
        let result = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
        let px = 0;
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                let val = this.gradient(x, y);
                //this.ctx.fillStyle = "rgb(0,"+val+","+val+")";
                //this.ctx.fillRect(x, y, 1, 1);
                result.data[px+1] = val;
                result.data[px+2] = val;
                result.data[px+3] = 255;
                px += 4;
            }
        }
        this.ctx.putImageData(result, 0, 0);
        this.renderBtn.textContent = "Render " + (new Date() - start) + "ms";
    }
    
    gradient(x, y) {
        let mindist = 999999;
        for (let p = 0; p < this.points.length; p++) {//find closest point
            let point = this.points[p];
            let dist = (point.x-x)**2 + (point.y-y)**2;
            dist /= this.distances[p];
            if (dist < mindist) {
                mindist = dist;
            }
        }
        return mindist;
    }
}

let worleyNoise = new WorleyNoise(512, 512, 32);
