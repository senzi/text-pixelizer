class PixelGenerator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockSize = 40; // default: 20 blocks per row
        this.currentIndex = 0;
        this.text = '';
        this.isGenerating = false;
        this.pixels = [];
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return hash;
    }

    generateColors(char) {
        const hash = this.simpleHash(char);
        const colors = [];
        
        for (let i = 0; i < 3; i++) {
            const r = (hash * (i + 1) * 123457) & 255;
            const g = (hash * (i + 1) * 234567) & 255;
            const b = (hash * (i + 1) * 345677) & 255;
            colors.push([r, g, b]);
        }
        
        return colors;
    }

    updateCanvasSize() {
        const blocksPerRow = 800 / this.blockSize;
        const rows = Math.ceil((this.text.length * 3) / blocksPerRow);
        this.canvas.height = rows * this.blockSize;
    }

    drawPixel(x, y, color) {
        this.ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.ctx.fillRect(x * this.blockSize, y * this.blockSize, 
                         this.blockSize, this.blockSize);
    }

    generate(text, blockSize) {
        this.stop();
        this.text = text;
        this.blockSize = blockSize;
        this.currentIndex = 0;
        this.pixels = [];
        
        // Pre-generate all pixels
        for (let char of this.text) {
            const colors = this.generateColors(char);
            this.pixels.push(...colors);
        }
        
        this.updateCanvasSize();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isGenerating = true;
        this.animateNextPixel();
    }

    animateNextPixel() {
        if (!this.isGenerating || this.currentIndex >= this.pixels.length) {
            this.isGenerating = false;
            return;
        }

        const blocksPerRow = 800 / this.blockSize;
        const x = this.currentIndex % blocksPerRow;
        const y = Math.floor(this.currentIndex / blocksPerRow);
        
        this.drawPixel(x, y, this.pixels[this.currentIndex]);
        this.currentIndex++;
        
        setTimeout(() => this.animateNextPixel(), 20);
    }

    stop() {
        this.isGenerating = false;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pixelCanvas');
    const generator = new PixelGenerator(canvas);

    document.getElementById('generate').addEventListener('click', () => {
        const text = document.getElementById('textInput').value;
        const blockSize = parseInt(document.getElementById('blockSize').value);
        generator.generate(text, blockSize);
    });
});