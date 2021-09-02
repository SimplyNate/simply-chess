import * as PIXI from 'pixi.js';

export class Chessboard {
    private containerWidth: number;
    private containerHeight: number;
    private squareLength: number;
    private app: PIXI.Application;

    constructor(target: Element, width: number, height: number, pixelRatio: number = 1) {
        this.containerWidth = width;
        this.containerHeight = height;
        this.app = new PIXI.Application({
            width: this.containerWidth,
            height: this.containerHeight,
            antialias: true,
            resolution: pixelRatio,
        });
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
        return square;
    }

    drawPiece() {

    }

    setWidth(newWidth: number): void {
        this.containerWidth = newWidth;
    }

    setHeight(newHeight: number): void {
        this.containerHeight = newHeight;
    }
}
