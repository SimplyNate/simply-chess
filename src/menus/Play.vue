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
            fenString: '',
        };
    },
    async beforeRouteUpdate(to) {
        this.fenString = String(to.params.fen);
    },
    mounted() {
        this.fenString = String(this.$route.params.fen);
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
</style>
