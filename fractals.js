'use strict'


class FractalTree {
    constructor(id, iterations, mod) {
        this.app = document.getElementById(id);
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = 512;
        this.canvas.height = 448;
        this.ctx = this.canvas.getContext("2d");
        
        this.iterations = iterations;
        this.mod = mod;
        this.angle = Math.PI * 0.2;

        this.update = true;
        
        this.palette = ["#430", "#440", "#450", "#460", "#470", "#480", "#080"];
        
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this.click.bind(this));
    }
    
    static vector(l, angle) {
        return {
            x: Math.cos(angle) * l,
            y: Math.sin(angle) * l
        };
    }
    
    tree(x, y, length, i, angle) {
        if (i==0) { return; }
        
        let dir = FractalTree.vector(length * this.mod, angle + this.angle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineWidth = i;
        this.ctx.strokeStyle = this.palette[this.iterations-i];
        this.ctx.lineTo(x + dir.x, y - dir.y);
        this.ctx.stroke();
        
        this.tree(x + dir.x, y - dir.y, length*this.mod, i-1, angle - this.angle);
        this.tree(x + dir.x, y - dir.y, length*this.mod, i-1, angle + this.angle);
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tree(256, this.canvas.height-64, 128, this.iterations, Math.PI/2 - this.angle);
    }
    
    mouseMove(event) {
        if (this.update) {
            let x = event.clientX - this.canvas.getBoundingClientRect().left;
            this.angle = x * Math.PI / this.canvas.width;
            this.render();
        }
    }

    click(event) {
        this.update = !this.update;
        if (this.update) {
            let x = event.clientX - this.canvas.getBoundingClientRect().left;
            this.angle = x * Math.PI / this.canvas.width;
            this.render();
        }
    }
    
    setIter(i) {
        this.iterations = i;
        this.render();
    }
    
    setMod(m) {
        this.mod = m;
        this.render();
    }
}

class Mandelbrot {
    constructor(id, iter=255, width=512, height=512, minX=-2, minY=-1.5, maxX=1, maxY=1.5) {
        this.app = document.getElementById(id);
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");

        this.renderBtn = this.app.getElementsByClassName("controlbar")[0].getElementsByTagName("button")[0];
        this.renderBtn2 = this.app.getElementsByClassName("controlbar")[0].getElementsByTagName("button")[1];
        
        this.init(minX, minY, maxX, maxY);
        this.iter = iter;
        this.maxIter = iter;
        
        this.palette = [16, 32, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184, 192, 200, 208, 216, 224, 232, 240, 248];
    }
    
    init(minX, minY, maxX, maxY) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        
        this.scaleX = (maxX - minX) / this.canvas.width;
        this.scaleY = (maxY - minY) / this.canvas.height;
    }

    reScaleX(x) {
        return x * this.scaleX + this.minX;
    }

    reScaleY(y) {
        return y * this.scaleY + this.minY;
    }
    
    point(xPos, yPos) {
        let x0 = this.reScaleX(xPos);
        let y0 = this.reScaleY(yPos);
        let x = 0, y = 0;
        let i = 0;
        let x2 = 0, y2 = 0;
        while (x2+y2 <= 4 && i < this.iter) {
            y = 2*x*y + y0;
            x = x2 - y2 + x0;
            x2 = x*x;
            y2 = y*y;
            i++;
        }
        return i;
    }
    
    render() {
        this.iter = this.maxIter;
        let start = new Date();
        let result = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
        let px = 0;
        for (let yPos = 0; yPos < this.canvas.height; yPos++) {
            for (let xPos = 0; xPos < this.canvas.width; xPos++) {
                let i = this.point(xPos, yPos);
                if (i != this.iter) {
                    let col = this.palette[Math.min(i, this.palette.length-1)]
                    result.data[px+1] = col;
                    result.data[px+2] = col;
                } else {
                    result.data[px] = 0;
                    result.data[px+1] = 0;
                    result.data[px+2] = 0;
                }
                result.data[px+3] = 255;
                px += 4;
            }
        }
        this.ctx.putImageData(result, 0, 0);
        this.renderBtn.textContent = `Render ${new Date() - start}ms`;
    }
}

class Multibrot extends Mandelbrot {
    constructor(id, power, iter=255, width=512, height=512, minX=-2, minY=-1.5, maxX=1, maxY=1.5) {
        super(id, iter, width, height, minX, minY, maxX, maxY);
        this.power = power;
    }
    
    point(xPos, yPos) {
        let x0 = this.reScaleX(xPos);
        let y0 = this.reScaleY(yPos);
        let x = 0, y = 0;
        let i = 0;
        let xtmp, xxyyn, atn;
        let n2 = this.power/2;
        while (x*x + y*y <= 4 && i < this.iter) {
            xxyyn = (x*x+y*y)**(n2);
            atn = this.power*Math.atan2(y, x);
            xtmp = xxyyn * Math.cos(atn) + x0;
            y = xxyyn * Math.sin(atn) + y0;
            x = xtmp;
            i++;
        }
        return i;
    }
}

class Julia extends Mandelbrot {
    constructor(id, iter=255, width=512, height=512, minX=-2, minY=-1.5, maxX=1, maxY=1.5) {
        super(id, iter, width, height, minX, minY, maxX, maxY);
        this.posX = 0;
        this.posY = 0;
        
        this.update = true;

        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this.click.bind(this));
    }

    click(event) {
        this.update = !this.update;
        this.mouseMove(event);
    }

    mouseMove(event) {
        if (this.update) {
            this.posX = event.clientX - this.canvas.getBoundingClientRect().left;
            this.posY = event.clientY - this.canvas.getBoundingClientRect().top;
            this.render();
        }
    }

    point(xPos, yPos) {
        let zx = this.reScaleX(xPos);
        let zy = this.reScaleY(yPos);
        let cx = this.reScaleX(this.posX);
        let cy = this.reScaleY(this.posY);
        let i = 0;
        let zx2 = zx*zx, zy2 = zy*zy;
        while (zx2 + zy2 < 4 && i < this.iter) {
            let xtmp = zx2 - zy2;
            zy = 2*zx*zy + cy;
            zx = xtmp + cx;
            zx2 = zx*zx;
            zy2 = zy*zy;
            i++;
        }
        return i;
    }
}

let fractalTree = new FractalTree("fractal-tree", 12, 0.75);
let mandelbrot = new Mandelbrot("mandelbrot");
let multibrot = new Multibrot("multibrot", 4);
let juliaSet = new Julia("julia-set", 256, 512, 512, -2, -2, 2, 2);

fractalTree.render();
mandelbrot.render();
juliaSet.render();