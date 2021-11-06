<template>
    <div id="app" :style="`width: ${containerWidth}px; height: ${containerHeight}px`">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CanvasBoard from '@/board/CanvasBoard.vue';
import { Selection } from '@/board/BoardUtils';

interface AppData {
    containerHeight: number,
    containerWidth: number,
    isMounted: boolean,
    legalMoves: string[],
    fenString: string,
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
            fenString: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        };
    },
    mounted() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
        this.isMounted = true;
    },
    methods: {
        onResize() {
            this.containerHeight = window.innerHeight;
            this.containerWidth = window.innerWidth;
        },
        calculateLegalMoves(selection: Selection) {
            console.log(`Received: ${selection.piece}, ${selection.place}`);
            this.legalMoves.length = 0;
            this.legalMoves.push('b-6');
            this.legalMoves.push('c-6');
            this.legalMoves.push('d-6');
            this.legalMoves.push('e-6');
            this.legalMoves.push('f-6');
            this.legalMoves.push('g-6');
            this.legalMoves.push('b-5');
            this.legalMoves.push('c-5');
            this.legalMoves.push('d-5');
            this.legalMoves.push('e-5');
            this.legalMoves.push('f-5');
            this.legalMoves.push('g-5');
            this.legalMoves.push('b-4');
            this.legalMoves.push('c-4');
            this.legalMoves.push('d-4');
            this.legalMoves.push('e-4');
            this.legalMoves.push('f-4');
            this.legalMoves.push('g-4');
        },
        clearLegalMoves() {
            this.legalMoves.length = 0;
        },
    },
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #222222;
    color: ghostwhite;
    border: 0;
    padding: 0;
    margin: 0;
    overflow: hidden;
}
</style>
