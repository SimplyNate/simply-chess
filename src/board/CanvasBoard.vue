<template>
    <div id="board" ref="board"></div>
</template>

<script>
import { defineComponent } from 'vue';
import { Chessboard } from '@/board/Chessboard';

export default defineComponent({
    name: 'CanvasBoard',
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
    data() {
        return {
            chessboard: null,
        };
    },
    watch: {
    },
    mounted() {
        const element = this.$refs.board;
        element.style.width = this.containerWidth + 'px';
        element.style.height = this.containerHeight + 'px';
        this.chessboard = new Chessboard(element, window.devicePixelRatio);
        console.log(this.chessboard.app.view.width, this.chessboard.app.view.height);
    },
    methods: {
    },
});
</script>

<style scoped>

</style>
