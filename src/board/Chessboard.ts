import * as PIXI from 'pixi.js';

export class Chessboard {
    private width: number;
    private height: number;
    private squareLength: number;
    private app: PIXI.Application;

    constructor(target: Element, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.app = new PIXI.Application({ width: this.width, height: this.height, antialias: true });
        target.appendChild(this.app.view);
        this.drawBoard();
    }

    drawBoard() {
    }

    drawSquare(x: number, y: number, color: number) {
        const square = new PIXI.Graphics();
        square.beginFill(color);
        square.drawRect(x, y, this.squareLength, this.squareLength);
        square.endFill();
    }

    drawPiece() {

    }

    setWidth(newWidth: number): void {
        this.width = newWidth;
    }

    setHeight(newHeight: number): void {
        this.height = newHeight;
    }
}
