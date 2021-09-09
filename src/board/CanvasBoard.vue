<template>
    <div id="board" ref="board"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as PIXI from 'pixi.js';
import { BoardMap, separateFEN, parsePlacementToMap, FEN } from '@/board/utils';

interface Pieces {
    [index: string]: PIXI.Sprite,
}

interface SquareMap {
    [index: string]: PIXI.Container,
}

interface ICanvasBoard {
    app: PIXI.Application,
    containerLength: number,
    squareLength: number,
    boardContainer: PIXI.Container,
    pieces: Pieces,
    squareMap: SquareMap,
    boardMap: BoardMap,
    fen: FEN,
    row: number[],
    rank: string[],
    dark: number,
    light: number,
    pieceMap: number[],
}

export default defineComponent({
    name: 'CanvasBoard',
    props: {
        currentBoardRepresentation: {
            type: String,
            default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        },
        containerHeight: {
            type: Number,
            default: 100,
        },
        containerWidth: {
            type: Number,
            default: 100,
        },
        legalMovesForSelection: {
            type: Array,
            default: () => [],
        },
    },
    data(): ICanvasBoard {
        return {
            app: new PIXI.Application(),
            containerLength: 0,
            squareLength: 0,
            boardContainer: new PIXI.Container(),
            pieces: {},
            squareMap: {},
            boardMap: {},
            fen: {
                piecePlacement: '',
                activeColor: '',
                castlingAvailability: '',
                enPassantTargetSquare: '',
                halfMoveClock: 0,
                fullMoveNumber: 0,
            },
            row: [8, 7, 6, 5, 4, 3, 2, 1],
            rank: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            dark: 0xb58863,
            light: 0xf0d9b5,
            pieceMap: [66, 75, 78, 80, 81, 82, 98, 107, 110, 112, 113, 114],
        };
    },
    watch: {
    },
    mounted() {
        const element = document.getElementById('board');
        if (element) {
            element.style.width = this.containerWidth + 'px';
            element.style.height = this.containerHeight + 'px';
            this.app = new PIXI.Application({
                antialias: true,
                resolution: window.devicePixelRatio,
                backgroundAlpha: 0,
                resizeTo: element,
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
            element.appendChild(this.app.view);
            this.drawBoard();
            this.updateFEN(this.currentBoardRepresentation);
            this.placePieces();
        }
        else {
            console.error('');
        }
    },
    methods: {
        drawBoard(): void {
            for (let y = 0; y < this.row.length; y++) {
                for (let x = 0; x < this.rank.length; x++) {
                    const id = `${this.rank[x]}-${this.row[y]}`;
                    const startX = x * this.squareLength;
                    const startY = y * this.squareLength;
                    const color = this.getColorForSquare(this.rank[x], this.row[y]);
                    this.squareMap[id] = this.drawSquare(startX, startY, color);
                }
            }
        },
        getColorForSquare(rank: string, row: number): number {
            const charCode = rank.charCodeAt(0);
            if (charCode % 2 !== 0) {
                return row % 2 === 0 ? this.light : this.dark;
            }
            return row % 2 === 0 ? this.dark : this.light;
        },
        loadSprites(): void {
            this.pieces[String.fromCharCode(66)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/66.svg')));
            this.pieces[String.fromCharCode(75)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/75.svg')));
            this.pieces[String.fromCharCode(78)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/78.svg')));
            this.pieces[String.fromCharCode(80)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/80.svg')));
            this.pieces[String.fromCharCode(81)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/81.svg')));
            this.pieces[String.fromCharCode(82)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/82.svg')));
            this.pieces[String.fromCharCode(98)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/98.svg')));
            this.pieces[String.fromCharCode(107)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/107.svg')));
            this.pieces[String.fromCharCode(110)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/110.svg')));
            this.pieces[String.fromCharCode(112)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/112.svg')));
            this.pieces[String.fromCharCode(113)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/113.svg')));
            this.pieces[String.fromCharCode(114)] = new PIXI.Sprite(PIXI.Texture.from(require('../assets/pieces/114.svg')));
            console.log(this.pieces);
        },
        updateFEN(fen: string): void {
            this.fen = separateFEN(fen);
            this.boardMap = parsePlacementToMap(this.fen.piecePlacement);
            this.placePieces();
        },
        placePieces(): void {
            for (const place of Object.keys(this.boardMap)) {
                const piece = this.boardMap[place];
                if (piece !== 'x') {
                    const sprite = this.pieces[piece];
                    const boardSquare = this.squareMap[place];
                    // @ts-ignore: TS2345
                    boardSquare.addChild(sprite);
                }
            }
        },
        drawSquare(x: number, y: number, color: number): PIXI.Container {
            const squareContainer = new PIXI.Container();
            squareContainer.position.set(x, y);
            if (this.app) {
                this.app.stage.addChild(squareContainer);
                const square = new PIXI.Graphics();
                square.beginFill(color);
                square.drawRect(0, 0, this.squareLength, this.squareLength);
                square.endFill();
                squareContainer.addChild(square);
            }
            return squareContainer;
        },
        calculateContainerLength(): void {
            this.containerLength = this.parentWidth() > this.parentHeight() ? this.parentHeight() : this.parentWidth();
        },
        parentWidth(): number {
            return this.app ? this.app.view.width : 0;
        },
        parentHeight(): number {
            return this.app ? this.app.view.height : 0;
        },
        calculateSquareLength(): void {
            this.squareLength = this.containerLength / this.row.length;
        },
    },
});
</script>

<style scoped>

</style>
