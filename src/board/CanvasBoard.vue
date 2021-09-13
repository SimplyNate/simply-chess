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

interface Textures {
    [index: string]: PIXI.Texture,
}

interface SVGs {
    [index: string]: PIXI.SVGResource,
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
    textures: Textures,
    svgs: SVGs,
    squareMap: SquareMap,
    boardMap: BoardMap,
    fen: FEN,
    row: number[],
    rank: string[],
    dark: number,
    light: number,
    pieceMap: number[],
    dragReferenceData: null | PIXI.InteractionData,
}

export default defineComponent({
    name: 'CanvasBoard',
    emits: ['selected', 'deselected'],
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
            textures: {},
            svgs: {},
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
            dragReferenceData: null,
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
            this.loadSVGs();
            this.loadTextures();
            const container = new PIXI.Container();
            this.app.stage.addChild(container);
            this.boardContainer = container;
            element.appendChild(this.app.view);
            this.drawBoard();
            this.updateFEN(this.currentBoardRepresentation);
            this.placePieces();
            container.x = this.app.screen.width / 2;
            container.y = this.app.screen.height / 2;
            container.pivot.x = container.width / 2.28;
            container.pivot.y = container.height / 2.28;
        }
        else {
            console.error('Some Error');
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
                    this.squareMap[id].name = id;
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
        loadSVGs(): void {
            this.svgs.B = new PIXI.SVGResource(require('../assets/pieces/66.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.K = new PIXI.SVGResource(require('../assets/pieces/75.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.N = new PIXI.SVGResource(require('../assets/pieces/78.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.P = new PIXI.SVGResource(require('../assets/pieces/80.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.Q = new PIXI.SVGResource(require('../assets/pieces/81.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.R = new PIXI.SVGResource(require('../assets/pieces/82.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.b = new PIXI.SVGResource(require('../assets/pieces/98.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.k = new PIXI.SVGResource(require('../assets/pieces/107.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.n = new PIXI.SVGResource(require('../assets/pieces/110.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.p = new PIXI.SVGResource(require('../assets/pieces/112.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.q = new PIXI.SVGResource(require('../assets/pieces/113.svg'), { width: this.squareLength, height: this.squareLength });
            this.svgs.r = new PIXI.SVGResource(require('../assets/pieces/114.svg'), { width: this.squareLength, height: this.squareLength });
        },
        loadTextures(): void {
            // @ts-ignore TS2345
            this.textures.B = PIXI.Texture.from(this.svgs.B);
            // @ts-ignore TS2345
            this.textures.K = PIXI.Texture.from(this.svgs.K);
            // @ts-ignore TS2345
            this.textures.N = PIXI.Texture.from(this.svgs.N);
            // @ts-ignore TS2345
            this.textures.P = PIXI.Texture.from(this.svgs.P);
            // @ts-ignore TS2345
            this.textures.Q = PIXI.Texture.from(this.svgs.Q);
            // @ts-ignore TS2345
            this.textures.R = PIXI.Texture.from(this.svgs.R);
            // @ts-ignore TS2345
            this.textures.b = PIXI.Texture.from(this.svgs.b);
            // @ts-ignore TS2345
            this.textures.k = PIXI.Texture.from(this.svgs.k);
            // @ts-ignore TS2345
            this.textures.n = PIXI.Texture.from(this.svgs.n);
            // @ts-ignore TS2345
            this.textures.p = PIXI.Texture.from(this.svgs.p);
            // @ts-ignore TS2345
            this.textures.q = PIXI.Texture.from(this.svgs.q);
            // @ts-ignore TS2345
            this.textures.r = PIXI.Texture.from(this.svgs.r);
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
                    const texture = this.textures[piece];
                    // @ts-ignore: TS2345
                    const sprite = new PIXI.Sprite(texture);
                    sprite.interactive = true;
                    sprite.buttonMode = true;
                    sprite.on('pointerdown', this.onDragStart)
                        .on('pointerup', this.onDragEnd)
                        .on('pointerupoutside', this.onDragEnd)
                        .on('pointermove', this.onDragMove)
                        .on('pointerover', this.onPointerOver);
                    sprite.anchor.set(0.5);
                    sprite.name = piece;
                    const boardSquare = this.squareMap[place];
                    boardSquare.addChild(sprite);
                }
            }
        },
        drawSquare(x: number, y: number, color: number): PIXI.Container {
            const squareContainer = new PIXI.Container();
            squareContainer.position.set(x, y);
            if (this.app) {
                const square = new PIXI.Graphics();
                square.beginFill(color);
                square.drawRect(0, 0, this.squareLength, this.squareLength);
                square.endFill();
                square.pivot.x = square.width / 2;
                square.pivot.y = square.height / 2;
                squareContainer.addChild(square);
                this.boardContainer.addChild(squareContainer);
            }
            return squareContainer;
        },
        onDragStart(event: PIXI.InteractionEvent): void {
            const selected = event.currentTarget;
            const piece = selected.name;
            const place = selected.parent.name;
            this.$emit('selected', { piece, place });
            this.dragReferenceData = event.data;
            selected.alpha = 0.5;
        },
        onDragEnd(event: PIXI.InteractionEvent): void {
            const selected = event.currentTarget;
            selected.alpha = 1;
            this.dragReferenceData = event.data;
        },
        onDragMove(event: PIXI.InteractionEvent): void {
            if (this.dragReferenceData) {
                const newPosition = this.dragReferenceData.getLocalPosition(event.currentTarget.parent);
                event.currentTarget.x = newPosition.x;
                event.currentTarget.y = newPosition.y;
            }
        },
        onPointerOver(event: PIXI.InteractionEvent): void {
            const selected = event.currentTarget;
            const piece = selected.name;
            const place = selected.parent.name;
            this.$emit('selected', { piece, place });
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
