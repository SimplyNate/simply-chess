<template>
    <div id="board" ref="board"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import * as PIXI from 'pixi.js';
import { separateFEN, parsePlacementToMap } from '@/board/utils';
import { ICanvasBoard, BoardConfig } from '@/board/CanvasBoard';

export default defineComponent({
    name: 'CanvasBoard',
    emits: ['move'],
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
        boardConfig: {
            type: Object as PropType<BoardConfig>,
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
            },
            placedPieces: [],
        };
    },
    watch: {
        currentBoardRepresentation() {
            this.updateFEN(this.currentBoardRepresentation);
        },
    },
    mounted() {
        this.applyConfig();
        // @ts-ignore TS2322
        const element: HTMLDivElement = this.$refs.board;
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
    },
    methods: {
        applyConfig() {
            if (this.boardConfig) {
                if (this.boardConfig.light) {
                    this.light = this.boardConfig.light;
                }
                if (this.boardConfig.dark) {
                    this.dark = this.boardConfig.dark;
                }
            }
        },
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
            this.clearPieces();
            this.placePieces();
        },
        isPieceInteractive(piece: string): boolean {
            return (this.fen.activeColor === 'w' && piece.charCodeAt(0) < 97) ||
                (this.fen.activeColor === 'b' && piece.charCodeAt(0) > 97);
        },
        isColliding(): PIXI.DisplayObject[] {
            const collisions = [];
            if (this.drag.dragNode) {
                const dragX = this.drag.dragNode.x;
                const dragY = this.drag.dragNode.y;
                // @ts-ignore TS2339
                const dragW = this.drag.dragNode.width;
                // @ts-ignore TS2339
                const dragH = this.drag.dragNode.height;
                const dragX2 = dragX + dragW;
                const dragY2 = dragY + dragH;
                for (const place of Object.keys(this.squareMap)) {
                    if (place === 'x') {
                        const square = this.squareMap[place];
                        const { x, y, width, height } = square;
                        const x2 = x + width;
                        const y2 = y + height;
                        if (dragX < x2 && dragX2 > x && dragY < y2 && dragY2 > y) {
                            collisions.push(square);
                        }
                    }
                }
            }
            // @ts-ignore TS2322
            return collisions;
        },
        sortCollisionsByNearest(collisions: PIXI.DisplayObject[], currentX: number, currentY: number): void {
            collisions.sort((a, b) => {
                const aParams = {
                    x1: a.x,
                    // @ts-ignore TS2339
                    x2: a.x + a.width,
                    y1: a.y,
                    // @ts-ignore TS2339
                    y2: a.y + a.height,
                };
                const bParams = {
                    x1: b.x,
                    // @ts-ignore TS2339
                    x2: b.x + b.width,
                    y1: b.y,
                    // @ts-ignore TS2339
                    y2: b.y + b.height,
                };
                const aCenter = {
                    x: aParams.x2 - aParams.x1,
                    y: aParams.y2 - aParams.y1,
                };
                const bCenter = {
                    x: bParams.x2 - bParams.x1,
                    y: bParams.y2 - bParams.y1,
                };
                const aDelta = {
                    x: Math.abs(currentX - aCenter.x),
                    y: Math.abs(currentY - aCenter.y),
                };
                const aHypotenuse = Math.hypot(aDelta.x, aDelta.y);
                const bDelta = {
                    x: Math.abs(currentX - bCenter.x),
                    y: Math.abs(currentY - bCenter.y),
                };
                const bHypotenuse = Math.hypot(bDelta.x, bDelta.y);
                return aHypotenuse - bHypotenuse;
            });
        },
        clearPieces(): void {
            for (let i = this.placedPieces.length - 1; i >= 0; i--) {
                const piece = this.placedPieces.pop();
                if (piece) {
                    piece.destroy();
                }
            }
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
                            .on('pointerover', this.onPointerOver)
                            .on('pointerout', this.onPointerLeave);
                    }
                    sprite.anchor.set(0.5);
                    sprite.name = piece;
                    const boardSquare = this.squareMap[place];
                    boardSquare.addChild(sprite);
                    this.placedPieces.push(sprite);
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
                    this.placedPieces.push(sprite);
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
                if (this.highlight.closestTarget?.name) {
                    const movePayload = {
                        to: this.highlight.closestTarget.name,
                        from: this.highlight.originalPlace?.parent.name,
                        piece: this.drag.dragNode.name,
                    };
                    this.$emit('move', movePayload);
                    console.log(movePayload);
                }
                else {
                    // @ts-ignore TS2345
                    this.drag.dragNode.setParent(this.drag.originalParent);
                }
                this.drag.dragNode.x = 0;
                this.drag.dragNode.y = 0;
            }
            if (this.highlight.originalPlace) {
                this.highlight.originalPlace.destroy();
            }
            if (this.highlight.closestTarget) {
                this.highlight.closestTarget.destroy();
            }
            this.clearDrag();
            this.clearHighlight();
        },
        onDragMove(): void {
            if (this.drag.dragNode && this.drag.dragData) {
                // @ts-ignore TS2345
                const newPosition = this.drag.dragData.getLocalPosition(this.drag.dragNode.parent);
                this.drag.dragNode.x = newPosition.x;
                this.drag.dragNode.y = newPosition.y;
                // Check which position mouse is closest to
                const collisions = this.isColliding();
                if (collisions.length > 0) {
                    this.sortCollisionsByNearest(collisions, newPosition.x, newPosition.y);
                    const closestCollision = collisions[0];
                    if (this.boardMap[closestCollision.parent.name] === 'x') {
                        // TODO: Fix this interaction
                        this.highlight.closestTarget = this.createHighlight(0x0000ff);
                        // @ts-ignore TS2345
                        closestCollision.parent.addChild(this.highlight.closestTarget);
                    }
                }
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
        },
        onPointerLeave(): void {
            console.log('left');
        },
        clearDrag(): void {
            this.drag.dragNode = null;
            this.drag.dragData = null;
            this.drag.originalParent = null;
        },
        clearHighlight(): void {
            this.highlight.originalPlace = null;
            this.highlight.closestTarget = null;
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
