'use strict'


class ValueNoise {
    constructor(id, width=512, height=512, scale=32) {
        this.app = document.getElementById(id);
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        
        this.initScale = scale;

        this.renderBtn = this.app.getElementsByClassName("controlbar")[0].getElementsByTagName("button")[0];
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let start = new Date();
        let result = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
        result.data.fill(255);
        let px = 0;


        for (let scale = this.initScale; scale > 1; scale/=2) {
            let points = [];// value points to interpolate between
            
            // create points
            for (let y = 0; y <= this.canvas.height/scale; y++) {
                let row = [];
                for (let x = 0; x <= this.canvas.width/scale; x++) {
                    row.push(Math.floor(Math.random() * 256));
                }
                points.push(row);
            }
            //console.log(points);
            
            for (let y = 0; y < this.canvas.height; y++) {
                let yp = Math.floor(y/scale);
                for (let x = 0; x < this.canvas.width; x++) {
                    let xp = Math.floor(x/scale)
                    let top = lerp(points[yp][xp], points[yp+1][xp], (y%scale)/scale);
                    let btm = lerp(points[yp][xp+1], points[yp+1][xp+1], (y%scale)/scale);
                    let val = lerp(top, btm, (x%scale)/scale)
                    result.data[px]   = (result.data[px]  +val)/2;// * (this.initScale/scale);
                    result.data[px+1] = (result.data[px+1]+val)/2;// * (this.initScale/scale);
                    result.data[px+2] = (result.data[px+2]+val)/2;// * (this.initScale/scale);
                    result.data[px+3] = 255;
                    px += 4;
                }
            }
        }
        this.ctx.putImageData(result, 0, 0);
        this.renderBtn.textContent = "Render " + (new Date() - start) + "ms";
        }
    }

class WorleyNoise {
    constructor(id, width, height, n) {
        this.app = document.getElementById(id);
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");

        this.renderBtn = this.app.getElementsByClassName("controlbar")[0].getElementsByTagName("button")[0];

        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this.click.bind(this));

        this.nPoints = n;
        this.generatePoints();
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

class WorleyFractal extends WorleyNoise {
    constructor(id, width=512, height=512, n) {
        super(id, width, height, n);
    }
}

function lerp(a, b, x) {
    return (b - a) * x + a;
}

let worleyNoise = new WorleyNoise("worley-noise", 512, 512, 32);
let valueNoise = new ValueNoise("value-noise", 512, 256);

worleyNoise.render();
valueNoise.render();
