<template>
    <div class="board" :style="`margin-left: ${margins}px; margin-right: ${margins}px; width: ${sideLength}px`">
        <div class="row m-0 p-0" v-for="(h, i) of height" v-bind:key="i">
            <div
                :class="`col m-0 p-0 ${lightOrDark(w, h)}`"
                :style="`height: ${cellHeight}px`"
                v-for="(w, j) of width"
                v-bind:key="`${i}-${j}`">
                <div v-if="hasPieceInSpace(w, h)">
                    <img
                        draggable="true"
                        :src="importFromMap(w, h)"
                        :class="isSelected(w, h)"
                        :height="cellHeight"
                        :width="cellHeight"
                        alt="piece"
                        ondragstart="event.dataTransfer.setData('text/plain', '')"
                        @dragstart="emitSelection(`${w}-${h}`)"
                        @dragend="emitDeselect(`${w}-${h}`)" />
                </div>
                <div v-else>
                    <div :style="`width: ${cellHeight}; height: ${cellHeight}`" ondragover ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BoardMap, parsePlacementToMap, separateFEN } from '@/utils/utils';

export default defineComponent({
    name: 'Board',
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
    emits: ['selected', 'deselect'],
    computed: {
        cellHeight() {
            return this.sideLength / this.height.length;
        },
        // Return the value with the smallest length
        sideLength() {
            return this.containerWidth > this.containerHeight ? this.containerHeight : this.containerWidth;
        },
    },
    data() {
        return {
            width: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            height: [8, 7, 6, 5, 4, 3, 2, 1],
            margins: 0,
            boardMap: {} as BoardMap,
            selected: '',
        };
    },
    watch: {
        containerHeight() {
            this.calculateMargins();
        },
        containerWidth() {
            this.calculateMargins();
        },
        currentBoardRepresentation() {
            this.placePieces();
        },
    },
    mounted() {
        this.calculateMargins();
        this.placePieces();
    },
    methods: {
        calculateMargins(): void {
            const width = window.innerWidth;
            const diff = width - this.containerHeight;
            if (diff > 0) {
                this.margins = diff / 2;
            }
            else {
                this.margins = 0;
            }
        },
        lightOrDark(column: string, row: number): string {
            const charCode = column.charCodeAt(0);
            if (charCode % 2 !== 0) {
                return row % 2 === 0 ? 'light' : 'dark';
            }
            return row % 2 === 0 ? 'dark' : 'light';
        },
        placePieces(): void {
            const separated = separateFEN(this.currentBoardRepresentation);
            this.boardMap = parsePlacementToMap(separated.piecePlacement);
        },
        importFromMap(column: string, rank: string | number): string | boolean {
            // const baseUrl = '../assets/';
            const value = this.boardMap[`${column}-${rank}`];
            // return require(`${baseUrl}${value.charCodeAt(0)}.svg`);
            return require('../assets/pieces/' + value.charCodeAt(0) + '.svg');
        },
        hasPieceInSpace(column: string, rank: string | number): boolean {
            return !!(this.boardMap[`${column}-${rank}`] && this.boardMap[`${column}-${rank}`] !== 'x');
        },
        isSelected(column: string, rank: string | number): string {
            return this.selected === `${column}-${rank}` ? 'selected' : '';
        },
        emitSelection(selection: string): void {
            this.selected = selection;
            this.$emit('selected', selection);
        },
        emitDeselect(selection: string): void {
            this.selected = '';
            this.$emit('deselect', selection);
        },
    },
});
</script>

<style scoped>
.board {
    margin: 0;
    padding: 0;
}
.dark {
    background-color: #b58863;
}
.light {
    background-color: #f0d9b5;
}
.selected {
    border: 5px solid orange;
}
.validMove {
    border: 5px solid red;
}
.dropTarget {
    border: 5px solid white;
}
</style>
