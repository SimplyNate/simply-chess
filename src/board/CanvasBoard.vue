<template>
    <div id="board"></div>
</template>

<script>
import { defineComponent } from 'vue';

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
});
</script>

<style scoped>

</style>
