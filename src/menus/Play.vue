<template>
    <div id="app" class="d-flex flex-row">
        <div class="side-menu mt-1 align-self-center">
            <h1>Simply Chess</h1>
            <p>Active Color: {{fen.activeColor}}</p>
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
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CanvasBoard from '@/board/CanvasBoard.vue';
import { Selection } from '@/board/BoardUtils';
import { FEN, separateFEN } from '@/utils/utils';

interface AppData {
    containerHeight: number,
    containerWidth: number,
    isMounted: boolean,
    legalMoves: string[],
    fenString: string,
    fen: FEN,
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
        };
    },
    async beforeRouteUpdate(to) {
        this.fenString = String(to.query.fen);
        this.fen = separateFEN(this.fenString);
    },
    mounted() {
        this.fenString = String(this.$route.query.fen);
        this.fen = separateFEN(this.fenString);
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
            this.legalMoves.length = 0;
        },
        clearLegalMoves() {
            this.legalMoves.length = 0;
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
