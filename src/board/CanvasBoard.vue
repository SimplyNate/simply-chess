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

interface IDrag {
    dragData: null | PIXI.InteractionData,
    dragNode: null | PIXI.DisplayObject,
    originalParent: null | PIXI.DisplayObject,
    tempContainer: PIXI.Container,
}

interface IHighlight {
    originalPlace: null | PIXI.Graphics,
    closestTarget: null | PIXI.Graphics,
    legalTargets: PIXI.Graphics[]
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
    drag: IDrag,
    highlight: IHighlight,
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
            drag: {
                dragData: null,
                dragNode: null,
                tempContainer: new PIXI.Container(),
                originalParent: null,
            },
            highlight: {
                originalPlace: null,
                closestTarget: null,
                legalTargets: [],
            },
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
            // @ts-ignore TS2345
            this.app.stage.addChild(this.drag.tempContainer);
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
        isPieceInteractive(piece: string): boolean {
            return (this.fen.activeColor === 'w' && piece.charCodeAt(0) < 97) ||
                (this.fen.activeColor === 'b' && piece.charCodeAt(0) > 97);
        },
        placePieces(): void {
            for (const place of Object.keys(this.boardMap)) {
                const piece = this.boardMap[place];
                if (piece !== 'x') {
                    const texture = this.textures[piece];
                    // @ts-ignore: TS2345
                    const sprite = new PIXI.Sprite(texture);
                    if (this.isPieceInteractive(piece)) {
                        sprite.interactive = true;
                        sprite.buttonMode = true;
                        sprite.on('pointerdown', this.onDragStart)
                            .on('pointerup', this.onDragEnd)
                            .on('pointerupoutside', this.onDragEnd)
                            .on('pointermove', this.onDragMove)
                            .on('pointerover', this.onPointerOver);
                    }
                    sprite.anchor.set(0.5);
                    sprite.name = piece;
                    const boardSquare = this.squareMap[place];
                    boardSquare.addChild(sprite);
                }
                else {
                    const sprite = new PIXI.Sprite();
                    sprite.interactive = true;
                    sprite.on('pointerover', this.onPointerOver);
                    sprite.anchor.set(0.5);
                    sprite.width = this.squareLength;
                    sprite.height = this.squareLength;
                    sprite.alpha = 0;
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
                square.on('pointerover', this.onPointerOver);
                squareContainer.addChild(square);
                this.boardContainer.addChild(squareContainer);
            }
            return squareContainer;
        },
        onDragStart(event: PIXI.InteractionEvent): void {
            this.drag.dragData = event.data;
            this.drag.dragNode = event.currentTarget;
            this.drag.originalParent = this.drag.dragNode.parent;
            this.highlight.originalPlace = this.createHighlight(0xffffff);
            // @ts-ignore TS2339
            this.drag.originalParent.addChild(this.highlight.originalPlace);
            const selected = event.currentTarget;
            const piece = selected.name;
            const place = selected.parent.name;
            this.$emit('selected', { piece, place });
            this.drag.dragNode.alpha = 0.5;
            // @ts-ignore TS2345
            this.drag.dragNode.setParent(this.drag.tempContainer);
            this.onDragMove();
        },
        createHighlight(color: number): PIXI.Graphics {
            const highlight = new PIXI.Graphics();
            highlight.beginFill(color);
            highlight.drawRect(0, 0, this.squareLength, this.squareLength);
            highlight.endFill();
            highlight.pivot.x = highlight.width / 2;
            highlight.pivot.y = highlight.height / 2;
            highlight.beginHole();
            highlight.drawRect(this.squareLength / 20, this.squareLength / 20, this.squareLength - (this.squareLength / 10), this.squareLength - (this.squareLength / 10));
            highlight.endHole();
            return highlight;
        },
        onDragEnd(): void {
            if (this.drag.dragNode) {
                this.drag.dragNode.alpha = 1;
                // @ts-ignore TS2345
                this.drag.dragNode.setParent(this.drag.originalParent);
                this.drag.dragNode.x = 0;
                this.drag.dragNode.y = 0;
            }
            if (this.highlight.originalPlace) {
                this.highlight.originalPlace.destroy();
            }
            if (this.highlight.closestTarget) {
                this.highlight.closestTarget.destroy();
            }
            for (let i = this.highlight.legalTargets.length - 1; i >= 0; i--) {
                const node = this.highlight.legalTargets[i];
                node.destroy();
                this.highlight.legalTargets.pop();
            }
            this.drag.dragNode = null;
            this.drag.dragData = null;
            this.drag.originalParent = null;
            this.highlight.originalPlace = null;
            this.highlight.closestTarget = null;
        },
        onDragMove(): void {
            if (this.drag.dragNode && this.drag.dragData) {
                // @ts-ignore TS2345
                const newPosition = this.drag.dragData.getLocalPosition(this.drag.dragNode.parent);
                this.drag.dragNode.x = newPosition.x;
                this.drag.dragNode.y = newPosition.y;
            }
        },
        onPointerOver(event: PIXI.InteractionEvent): void {
            if (this.highlight.closestTarget) {
                this.highlight.closestTarget.destroy();
                this.highlight.closestTarget = null;
            }
            const selected = event.currentTarget;
            const piece = selected.name;
            const place = selected.parent.name;
            console.log(piece, place);
            this.$emit('selected', { piece, place });
            if (this.drag.dragNode) {
                // We are dragging so highlight closest drop point
                // If selected is blank according to boardMap
                if (this.boardMap[place] === 'x') {
                    this.highlight.closestTarget = this.createHighlight(0x0000ff);
                    // @ts-ignore TS2345
                    selected.parent.addChild(this.highlight.closestTarget);
                }
            }
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
