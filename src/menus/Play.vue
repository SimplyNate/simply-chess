<template>
    <div id="app" class="d-flex flex-row">
        <div class="side-menu mt-1 align-self-center">
            <div class="w-100">Top Stuff</div>
            <div class="w-100">
                <h1>Simply Chess</h1>
                <p>FEN String: {{ engine.fenString }}</p>
                <p>Active Color: {{ engine.fen.activeColor }}</p>
                <p>Castling Availability: {{ engine.fen.castlingAvailability }}</p>
                <p>En Passant Target Square: {{ engine.fen.enPassantTargetSquare }}</p>
                <p>Half Move Clock: {{ engine.fen.halfMoveClock }}</p>
                <p>Full Move Number: {{ engine.fen.fullMoveNumber }}</p>
            </div>
            <div class="w-100">Bottom Stuff</div>
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
import { FEN, separateFEN } from '@/utils/utils';
import { Chess } from '@/engine/Chess';

interface AppData {
    containerHeight: number,
    containerWidth: number,
    isMounted: boolean,
    legalMoves: string[],
    fenString: string,
    fen: FEN,
    engine: Chess,
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
            fenString: '',
            fen: {
                piecePlacement: '',
                activeColor: '',
                castlingAvailability: '',
                enPassantTargetSquare: '',
                halfMoveClock: 0,
                fullMoveNumber: 0,
            },
            engine: new Chess(),
        };
    },
    async beforeRouteUpdate(to) {
        this.fenString = String(to.query.fen);
        this.fen = separateFEN(this.fenString);
    },
    mounted() {
        this.fenString = String(this.$route.query.fen);
        this.engine = new Chess(this.fenString);
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
            console.log(`Received: ${selection.piece}, ${selection.place}`);
            this.legalMoves = this.engine.getLegalMoves(selection.place);
        },
        clearLegalMoves() {
            this.legalMoves.length = 0;
        },
        makeMove(payload: MovePayload) {
            const fen = this.engine.move(payload.from, payload.to);
            if (fen !== this.fenString) {
                this.$router.push(`/play?fen=${fen}`);
            }
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
