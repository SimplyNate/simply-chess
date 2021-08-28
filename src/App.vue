<template>
    <div id="#app">
        <board :container-height="containerHeight" :container-width="containerWidth" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Board from '@/board/Board.vue';

export default defineComponent({
    name: 'App',
    components: {
        Board,
    },
    data() {
        return {
            containerHeight: 0,
            containerWidth: 0,
        };
    },
    mounted() {
        this.containerHeight = window.innerHeight;
        window.addEventListener('resize', this.onResize);
    },
    methods: {
        onResize() {
            this.containerHeight = window.innerHeight;
            this.containerWidth = window.innerWidth;
        },
    },
});
</script>

<style>
body {
    margin: 0;
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
    height: 100vh;
}
</style>
