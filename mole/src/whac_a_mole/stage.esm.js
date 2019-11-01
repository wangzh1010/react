export default class Stage {
    constructor(cellSize, stageSize) {
        this.cellSize = cellSize;
        this.stageSize = stageSize;
        this.holes = Math.floor(this.stageSize / this.cellSize);
        this.stage = document.createElement('canvas');
        this.cxt = this.stage.getContext('2d');
        this.init();
    }
    init() {
        this.stage.width = this.stageSize;
        this.stage.height = this.stageSize;
        this.cxt.translate(0.5, 0.5);
        this.drawCells();
        this.drawHoles();
    }
    drawCells() {
        this.cxt.strokeStyle = '#9e9e9e';
        this.cxt.beginPath();
        for (let i = 1; i <= this.holes - 1; i++) {
            this.cxt.moveTo(this.cellSize * i, 0);
            this.cxt.lineTo(this.cellSize * i, this.stageSize);
            this.cxt.moveTo(0, this.cellSize * i);
            this.cxt.lineTo(this.stageSize, this.cellSize * i);
        }
        this.cxt.stroke();
    }
    drawHoles() {
        for (let i = 0; i < this.holes; i++) {
            for (let j = 0; j < this.holes; j++) {
                let x = i * this.cellSize + this.cellSize / 2;
                let y = j * this.cellSize + this.cellSize / 2;
                this.cxt.beginPath();
                this.cxt.ellipse(x, y, this.cellSize * 0.48, this.cellSize * 0.3, 0, 0, 2 * Math.PI);
                this.cxt.fillStyle = '#e0e0e0';
                this.cxt.fill();
                this.cxt.beginPath();
                this.cxt.ellipse(x, y, this.cellSize * 0.42, this.cellSize * 0.25, 0, 0, 2 * Math.PI);
                this.cxt.fillStyle = '#757575';
                this.cxt.fill();
            }
        }
    }
    getStage() {
        return this.stage;
    }
}
