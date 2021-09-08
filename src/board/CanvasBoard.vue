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
    app: null | PIXI.Application,
    containerLength: number,
    squareLength: number,
    boardContainer: null | PIXI.Container,
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
    data() {
        return {
            app: null,
            containerLength: 0,
            squareLength: 0,
            boardContainer: null,
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
        } as ICanvasBoard;
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
            for (const piece of this.pieceMap) {
                const texture = PIXI.Texture.from('../assets/pieces/' + piece + '.svg');
                this.pieces[piece] = new PIXI.Sprite(texture);
            }
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
                    boardSquare.addChild(sprite);
                }
            }
        },
        drawSquare(x: number, y: number, color: number): PIXI.Container {
            const squareContainer = new PIXI.Container();
            if (this.app) {
                this.app.stage.addChild(squareContainer);
                const square = new PIXI.Graphics();
                square.beginFill(color);
                square.drawRect(x, y, this.squareLength, this.squareLength);
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
