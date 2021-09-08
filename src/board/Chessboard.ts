import * as PIXI from 'pixi.js';
import { BoardMap, separateFEN, parsePlacementToMap, FEN } from '@/board/utils';

interface Pieces {
    [index: string]: PIXI.Sprite,
}

interface SquareMap {
    [index: string]: PIXI.Container,
}

export class Chessboard {
    private containerLength: number = 0;
    private squareLength: number = 0;
    private boardContainer: PIXI.Container;
    private app: PIXI.Application;
    private pieces: Pieces = {};
    private squareMap: SquareMap = {};
    private boardMap: BoardMap = {};
    private fen: FEN = {
        piecePlacement: '',
        activeColor: '',
        castlingAvailability: '',
        enPassantTargetSquare: '',
        halfMoveClock: 0,
        fullMoveNumber: 0,
    };

    private readonly row = [8, 7, 6, 5, 4, 3, 2, 1];
    private readonly rank = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    private readonly dark = 0xb58863;
    private readonly light = 0xf0d9b5
    private readonly pieceMap = {
        B: 66,
        K: 75,
        N: 78,
        P: 80,
        Q: 81,
        R: 82,
        b: 98,
        k: 107,
        n: 110,
        p: 112,
        q: 113,
        r: 114,
    };

    constructor(target: HTMLElement, pixelRatio: number = 1, fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        this.app = new PIXI.Application({
            antialias: true,
            resolution: pixelRatio,
            backgroundAlpha: 0,
            resizeTo: target,
        });
        this.calculateContainerLength();
        this.calculateSquareLength();
        this.loadSprites();
        const container = new PIXI.Container();
        container.x = this.app.screen.width / 2;
        container.y = this.app.screen.height / 2;
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;
        this.app.stage.addChild(container);
        this.boardContainer = container;
        target.appendChild(this.app.view);
        this.drawBoard();
        this.updateFEN(fen);
        this.placePieces();
    }

    private drawBoard(): void {
        for (let y = 0; y < this.row.length; y++) {
            for (let x = 0; x < this.rank.length; x++) {
                const id = `${this.rank[x]}-${this.row[y]}`;
                const startX = x * this.squareLength;
                const startY = y * this.squareLength;
                const color = this.getColorForSquare(this.rank[x], this.row[y]);
                this.squareMap[id] = this.drawSquare(startX, startY, color);
            }
        }
    }

    private getColorForSquare(rank: string, row: number) {
        const charCode = rank.charCodeAt(0);
        if (charCode % 2 !== 0) {
            return row % 2 === 0 ? this.light : this.dark;
        }
        return row % 2 === 0 ? this.dark : this.light;
    }

    private loadSprites(): void {
        for (const piece of Object.keys(this.pieceMap)) {
            const texture = PIXI.Texture.from('./assets/pieces/66.svg');
            this.pieces[piece] = new PIXI.Sprite(texture);
        }
        console.log(this.pieces);
    }

    public updateFEN(fen: string): void {
        this.fen = separateFEN(fen);
        this.boardMap = parsePlacementToMap(this.fen.piecePlacement);
        this.placePieces();
    }

    private placePieces(): void {
        for (const place of Object.keys(this.boardMap)) {
            const piece = this.boardMap[place];
            if (piece !== 'x') {
                console.log(piece, place);
                const sprite = this.pieces[piece];
                const boardSquare = this.squareMap[place];
                boardSquare.addChild(sprite);
            }
        }
    }

    private drawPiece(): void {

    }

    private drawSquare(x: number, y: number, color: number) {
        const squareContainer = new PIXI.Container();
        this.app.stage.addChild(squareContainer);
        const square = new PIXI.Graphics();
        square.beginFill(color);
        square.drawRect(x, y, this.squareLength, this.squareLength);
        square.endFill();
        squareContainer.addChild(square);
        return squareContainer;
    }

    private calculateContainerLength() {
        this.containerLength = this.parentWidth > this.parentHeight ? this.parentHeight : this.parentWidth;
    }

    get parentWidth() {
        return this.app.view.width;
    }

    get parentHeight() {
        return this.app.view.height;
    }

    private calculateSquareLength() {
        this.squareLength = this.containerLength / this.row.length;
    }
}
