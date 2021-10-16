<template>
    <div id="board" ref="board"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import * as PIXI from 'pixi.js';
import { separateFEN, parsePlacementToMap, rank, file } from '@/board/utils';
import { ICanvasBoard, BoardConfig, LegalMovesForSelection } from '@/board/BoardUtils';
import { getPointerCollision } from '@/board/Collision';

export default defineComponent({
    name: 'CanvasBoard',
    emits: ['selected', 'deselected', 'move'],
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
        legalMovesForSelection: {
            type: Array as PropType<LegalMovesForSelection>,
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
            dark: 0xb58863,
            light: 0xf0d9b5,
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
            placedPieces: [],
            freeSpaces: [],
            globalOffset: {
                x: 0,
                y: 0,
            },
            cachedCollision: null,
        };
    },
    watch: {
        currentBoardRepresentation() {
            this.updateFEN(this.currentBoardRepresentation);
        },
        legalMovesForSelection: {
            deep: true,
            handler() {
                this.highlightLegalMoves();
            },
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
        container.interactive = true;
        container.on('pointermove', this.onDragMove);
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
        this.calculateGlobalOffset();
    },
    methods: {
        calculateGlobalOffset(): void {
            this.globalOffset.x = this.boardContainer.x - (this.boardContainer.width / 2);
            this.globalOffset.y = this.boardContainer.y - (this.boardContainer.height / 2);
        },
        applyConfig(): void {
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
            for (let y = 0; y < rank.length; y++) {
                for (let x = 0; x < file.length; x++) {
                    const id = `${file[x]}-${rank[y]}`;
                    const startX = x * this.squareLength;
                    const startY = y * this.squareLength;
                    const color = this.getColorForSquare(file[x], rank[y]);
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
        findFreeSpaces(): void {
            const boardArray = Object.keys(this.boardMap);
            const filtered = [];
            for (const place of boardArray) {
                if (this.boardMap[place] === 'x') {
                    filtered.push(this.squareMap[place]);
                }
            }
            this.freeSpaces = filtered;
        },
        isPieceInteractive(piece: string): boolean {
            return (this.fen.activeColor === 'w' && piece.charCodeAt(0) < 97) ||
                (this.fen.activeColor === 'b' && piece.charCodeAt(0) > 97);
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
                            .on('pointerupoutside', this.onDragEnd);
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
                squareContainer.addChild(square);
                this.boardContainer.addChild(squareContainer);
            }
            return squareContainer;
        },
        onDragStart(event: PIXI.InteractionEvent): void {
            this.drag.dragData = event.data;
            // @ts-ignore TS2740
            this.drag.dragNode = event.currentTarget;
            // @ts-ignore TS2322
            this.drag.originalParent = this.drag.dragNode?.parent;
            this.highlight.originalPlace = this.createHighlight(0xffffff);
            // @ts-ignore TS2339
            this.drag.originalParent.addChild(this.highlight.originalPlace);
            const selected = event.currentTarget;
            const piece = selected.name;
            const place = selected.parent.name;
            this.$emit('selected', { piece, place });
            // @ts-ignore TS2531
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
                if (this.highlight.closestTarget) {
                    const movePayload = {
                        to: this.highlight.closestTarget.parent.name,
                        from: this.highlight.originalPlace?.parent.name,
                        piece: this.drag.dragNode.name,
                    };
                    this.$emit('move', movePayload);
                    console.log(movePayload);
                }
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
            this.clearDrag();
            this.clearHighlight();
            this.$emit('deselected', true);
        },
        onDragMove(): void {
            if (this.drag.dragNode) {
                // @ts-ignore TS2345
                const newPosition = this.drag.dragData.getLocalPosition(this.drag.dragNode.parent);
                if (newPosition.x > this.containerWidth) {
                    this.drag.dragNode.x = this.containerWidth;
                }
                else if (newPosition.x < 0) {
                    this.drag.dragNode.x = 0;
                }
                else {
                    this.drag.dragNode.x = newPosition.x;
                }
                if (newPosition.y > this.containerHeight) {
                    this.drag.dragNode.y = this.containerHeight;
                }
                else if (newPosition.y < 0) {
                    this.drag.dragNode.y = 0;
                }
                else {
                    this.drag.dragNode.y = newPosition.y;
                }
                this.clearCollision();
                // Check which position mouse is closest to
                // @ts-ignore TS2345
                const collision = getPointerCollision(newPosition.x, newPosition.y, this.highlight.legalTargets, this.globalOffset);
                this.cachedCollision = collision;
                if (collision) {
                    const highlight = this.createHighlight(0x0000ff);
                    // @ts-ignore TS2345
                    collision.parent.addChild(highlight);
                    // @ts-ignore TS2740
                    this.highlight.closestTarget = highlight;
                }
            }
        },
        clearDrag(): void {
            this.drag.dragNode = null;
            this.drag.dragData = null;
            this.drag.originalParent = null;
        },
        clearHighlight(): void {
            this.highlight.originalPlace = null;
            this.highlight.closestTarget = null;
            this.clearLegalMoves();
            this.clearCollision();
        },
        highlightLegalMoves(): void {
            for (const move of this.legalMovesForSelection) {
                const square = this.squareMap[move];
                const highlight = this.createHighlight(0x00ff00);
                square.addChild(highlight);
                this.highlight.legalTargets.push(highlight);
            }
        },
        clearLegalMoves(): void {
            for (let i = this.highlight.legalTargets.length - 1; i >= 0; i--) {
                const node = this.highlight.legalTargets[i];
                node.destroy();
                this.highlight.legalTargets.pop();
            }
        },
        clearCollision(): void {
            if (this.highlight.closestTarget) {
                this.highlight.closestTarget.destroy();
                this.highlight.closestTarget = null;
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
            this.squareLength = this.containerLength / rank.length;
        },
    },
});
</script>

<style scoped>

</style>
