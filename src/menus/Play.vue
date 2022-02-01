<template>
    <div id="app" class="d-flex flex-row">
        <div class="side-menu mt-1 align-self-center">
            <div class="w-100">
                <h1>Simply Chess</h1>
                <p>Piece Placement: {{ engine.fen.piecePlacement }}</p>
                <p>Active Color: {{ engine.fen.activeColor }}</p>
                <p>Castling Availability: {{ engine.fen.castlingAvailability }}</p>
                <p>En Passant Target Square: {{ engine.fen.enPassantTargetSquare }}</p>
                <p>Half Move Clock: {{ engine.fen.halfMoveClock }}</p>
                <p>Full Move Number: {{ engine.fen.fullMoveNumber }}</p>
                <p>Check Status: {{ engine.checkStatus }}</p>
                <p>Check Mate Status: {{ engine.checkMateStatus }}</p>
                <p>Tie Status: {{ engine.tie }}</p>
                <p>Selected Piece: {{ selectedPiece }}</p>
                <p>Legal Moves: {{ legalMoves }}</p>
            </div>
            <div class="w-100" v-if="engine.checkMateStatus">
                <h2>Winner: {{ engine.checkStatus === 'light' ? 'dark' : 'light' }}</h2>
                <button @click="restart">Restart?</button>
            </div>
            <div class="w-100" v-if="engine.tie">
                <h2>Tie game!</h2>
                <button @click="restart">Restart?</button>
            </div>
        </div>
        <div class="float-end" :style="`width: ${containerWidth}px; height: ${containerHeight}px`">
            <canvas-board
                v-if="isMounted"
                :container-height="containerHeight"
                :container-width="containerWidth"
                :current-board-representation="fenString"
                :legal-moves-for-selection="legalMoves"
                @selected="calculateLegalMoves"
                @deselected="clearLegalMoves"
                @move="makeMove"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CanvasBoard from '@/board/CanvasBoard.vue';
import { Selection } from '@/board/BoardUtils';
import { FEN } from '@/utils/utils';
import { Chess } from '@/engine/Chess';
import AI from '@/engine/ai/AI';
import { RandomMover } from '@/engine/ai/RandomMover';
import { MatrixEvaluator } from '@/engine/ai/MatrixEvaluator';

interface AppData {
    containerHeight: number,
    containerWidth: number,
    isMounted: boolean,
    legalMoves: string[],
    startingFen: string,
    fenString: string,
    fen: FEN,
    useAi: boolean,
    ai: null | AI,
    engine: Chess,
    selectedPiece: string,
}

interface MovePayload {
    from: string,
    to: string,
    piece: string,
}

export default defineComponent({
    name: 'Play',
    components: {
        CanvasBoard,
    },
    data(): AppData {
        return {
            containerHeight: 300,
            containerWidth: 300,
            isMounted: false,
            legalMoves: [],
            startingFen: '',
            fenString: '',
            fen: {
                piecePlacement: '',
                activeColor: '',
                castlingAvailability: '',
                enPassantTargetSquare: '',
                halfMoveClock: 0,
                fullMoveNumber: 0,
            },
            useAi: false,
            ai: null,
            engine: new Chess(),
            selectedPiece: '',
        };
    },
    mounted() {
        this.fenString = String(this.$route.query.fen);
        this.startingFen = this.fenString;
        this.useAi = this.$route.query.ai === 'true';
        if (this.useAi) {
            console.log('Creating AI player');
            if (this.$route.query.aiType === 'RandomMover') {
                this.ai = new RandomMover('dark');
            }
            else if (this.$route.query.aiType === 'MatrixEvaluator') {
                this.ai = new MatrixEvaluator('dark');
            }
        }
        this.engine = new Chess(this.fenString);
        console.log('created new engine');
        this.onResize();
        window.addEventListener('resize', this.onResize);
        this.isMounted = true;
    },
    methods: {
        onResize() {
            this.containerHeight = window.innerHeight;
            this.containerWidth = window.innerWidth * 0.6;
        },
        calculateLegalMoves(selection: Selection) {
            this.selectedPiece = `${selection.piece}, ${selection.place}`;
            this.legalMoves = this.engine.getLegalMoves(selection.place);
        },
        clearLegalMoves() {
            this.selectedPiece = '';
            this.legalMoves.length = 0;
        },
        makeMove(payload: MovePayload) {
            this.fenString = this.engine.move(payload.from, payload.to);
            if (this.ai && this.engine.fen.activeColor === 'b') {
                // @ts-ignore
                const move = this.ai.move(this.engine.boardMap, this.engine.fen, this.engine.piecesByColor.dark);
                console.log(`AI move: from ${move.from} to ${move.to}`);
                this.fenString = this.engine.move(move.from, move.to);
            }
        },
        restart() {
            this.fenString = this.startingFen;
            this.engine = new Chess(this.fenString);
        },
    },
});
</script>

<style>
#app {
    overflow: hidden;
}
.side-menu {
    width: 33vw;
}
</style>
