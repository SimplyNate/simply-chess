import * as PIXI from 'pixi.js';
import { BoardMap } from '@/board/utils';

interface Pieces {
    [index: string]: PIXI.Sprite,
}

export class Chessboard {
    private parentWidth: number;
    private parentHeight: number;
    private containerLength: number;
    private squareLength: number;
    private boardContainer: PIXI.Container;
    private app: PIXI.Application;
    private pieces: Pieces = {};
    private readonly row = [8, 7, 6, 5, 4, 3, 2, 1];
    private readonly rank = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    private readonly pieceMap = {
        66: 'B',
        75: 'K',
        78: 'N',
        80: 'P',
        81: 'Q',
        82: 'R',
        98: 'b',
        107: 'k',
        110: 'n',
        112: 'p',
        113: 'q',
        114: 'r',
    };

    constructor(target: Element, width: number, height: number, pixelRatio: number = 1) {
        this.parentWidth = width;
        this.parentHeight = height;
        this.app = new PIXI.Application({
            width: this.parentWidth,
            height: this.parentHeight,
            antialias: true,
            resolution: pixelRatio,
        });
        this.loadSprites();
        const container = new PIXI.Container();
        this.containerLength = width > height ? height : width;
        this.squareLength = this.containerLength / this.row.length;
        container.x = this.app.screen.width / 2;
        container.y = this.app.screen.height / 2;
        this.app.stage.addChild(container);
        this.boardContainer = container;
        target.appendChild(this.app.view);
        this.drawBoard();
    }

    drawBoard() {

    }

    loadSprites() {
        for (const piece of Object.keys(this.pieceMap)) {
            const texture = PIXI.Texture.from('../assets/pieces/' + piece + '.svg');
            this.pieces[piece] = new PIXI.Sprite(texture);
        }
    }

    placePieces(boardMap: BoardMap) {

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
