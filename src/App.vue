<template>
    <div id="#app" :style="`width: ${containerWidth}px; height: ${containerHeight}px`">
        <!-- <board :container-height="containerHeight" :container-width="containerWidth" /> -->
        <canvas-board
            v-if="isMounted"
            :container-height="containerHeight"
            :container-width="containerWidth"
            :legal-moves-for-selection="legalMoves"
            :current-board-representation="fenString"
            @selected="calculateLegalMoves"
            @deselected="clearLegalMoves"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import Board from '@/board/Board.vue';
import CanvasBoard from '@/board/CanvasBoard.vue';

interface AppData {
    containerHeight: number,
    containerWidth: number,
    isMounted: boolean,
    legalMoves: string[],
    fenString: string,
}

export default defineComponent({
    name: 'App',
    components: {
        // Board,
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
        calculateLegalMoves() {
            this.legalMoves.length = 0;
            this.legalMoves.push('d-6');
        },
        clearLegalMoves() {
            this.legalMoves.length = 0;
        },
    },
});
</script>

<style>
body {
    margin: 0;
    padding: 0;
    border: 0;
}
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
