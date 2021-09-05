import * as PIXI from 'pixi.js';
import { BoardMap, separateFEN, parsePlacementToMap } from '@/board/utils';

interface Pieces {
    [index: string]: PIXI.Sprite,
}

export class Chessboard {
    private parentWidth: number;
    private parentHeight: number;
    private containerLength: number = 0;
    private squareLength: number = 0;
    private boardContainer: PIXI.Container;
    private app: PIXI.Application;
    private pieces: Pieces = {};
    private fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
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

    constructor(target: Element, width: number, height: number, pixelRatio: number = 1, fen: string | null = null) {
        this.parentWidth = width;
        this.parentHeight = height;
        this.app = new PIXI.Application({
            width: this.parentWidth,
            height: this.parentHeight,
            antialias: true,
            resolution: pixelRatio,
        });
        if (fen) {
            this.fen = fen;
        }
        this.calculateContainerLength();
        this.calculateSquareLength();
        this.loadSprites();
        const container = new PIXI.Container();
        container.x = this.app.screen.width / 2;
        container.y = this.app.screen.height / 2;
        this.app.stage.addChild(container);
        this.boardContainer = container;
        target.appendChild(this.app.view);
        this.drawBoard(this.fen);
    }

    drawBoard(fen: string): void {
        let x = 0;
        let y = 0;
        for (const row of this.row) {
            for (const rank of this.rank) {

            }
        }
    }

    loadSprites(): void {
        for (const piece of Object.keys(this.pieceMap)) {
            const texture = PIXI.Texture.from('../assets/pieces/' + piece + '.svg');
            this.pieces[piece] = new PIXI.Sprite(texture);
        }
    }

    placePieces(boardMap: BoardMap): void {

    }

    drawSquare(x: number, y: number, color: number) {
        const square = new PIXI.Graphics();
        square.beginFill(color);
        square.drawRect(x, y, this.squareLength, this.squareLength);
        square.endFill();
        return square;
    }

    drawPiece(): void {

    }

    setWidth(newWidth: number): void {
        this.parentWidth = newWidth;
    }

    setHeight(newHeight: number): void {
        this.parentHeight = newHeight;
    }

    private calculateContainerLength() {
        this.containerLength = this.parentWidth > this.parentHeight ? this.parentHeight : this.parentWidth;
    }

    private calculateSquareLength() {
        this.squareLength = this.containerLength / this.row.length;
    }
}
