import * as PIXI from 'pixi.js';

export class Chessboard {
    private width: number;
    private height: number;
    private app: PIXI;

    constructor(width, height): void {
        this.width = width;
        this.height = height;
        this.app = new PIXI.Application({ width: this.width, height: this.height });
    }

    setWidth(newWidth: number): void {
        this.width = newWidth;
    }

    setHeight(newHeight: number): void {
        this.height = newHeight;
    }
}
