'use strict'

class FractalTree {
    constructor(iterations, mod) {
        this.app = document.getElementById("fractal-tree");
        this.canvas = this.app.getElementsByTagName("canvas")[0];
        this.canvas.width = 512;
        this.canvas.height = 448;
        this.ctx = this.canvas.getContext("2d");
        
        this.iterations = iterations;
        this.mod = mod;
        this.angle = Math.PI*0.375;
        
        this.palette = [
            "#440",
            "#480",
            "#4a0",
            "#0c0",
            "#0e4",
            "#0f4",
        ];
        
        this.render();
        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
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
        this.ctx.lineWidth = i;//Math.min(i, 3);
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
        let x = event.clientX - this.canvas.getBoundingClientRect().left;
        this.angle = x * Math.PI / this.canvas.width;
        this.render();
    }
    
    setIter(i) {
        this.iterations = i;
    }
}


let fractalTree = new FractalTree(12, 0.75);