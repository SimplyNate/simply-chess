<template>
    <div class="container board" :style="`margin-left: ${margins}px; margin-right: ${margins}px; width: ${containerHeight}px`">
        <div class="row m-0 p-0" v-for="(h, i) of height" v-bind:key="i">
            <div class="col m-0 p-0 cell" :style="`height: ${cellHeight}px`" v-for="(w, j) of width" v-bind:key="`${i}-${j}`">
                {{ w }}-{{ h }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Board',
    props: {
        currentBoardRepresentation: String,
        containerHeight: {
            type: Number,
            default: 100,
        },
        containerWidth: {
            type: Number,
            default: 100,
        },
    },
    computed: {
        cellHeight() {
            return this.containerHeight / this.height.length;
        },
    },
    data() {
        return {
            width: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            height: [8, 7, 6, 5, 4, 3, 2, 1],
            margins: 0,
        };
    },
    watch: {
        containerHeight() {
            this.calculateMargins();
        },
        containerWidth() {
            this.calculateMargins();
        },
    },
    mounted() {
        this.calculateMargins();
    },
    methods: {
        calculateMargins() {
            const width = window.innerWidth;
            const diff = width - this.containerHeight;
            this.margins = diff / 2;
        },
    },
});
</script>

<style scoped>
.board {
    margin: 0;
    padding: 0;
}
.cell {
    border: 1px solid white;
}
</style>
