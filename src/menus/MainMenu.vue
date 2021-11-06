<template>
    <div>
        <button class="btn btn-success" @click="startGame">New Game</button>
        <button class="btn btn-success" @click="startGame">Load Game</button>
        <input class="form-control" type="text" v-model="load" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MainMenu',
    data() {
        return {
            load: null,
        };
    },
    methods: {
        startGame() {
            const game = this.load ? this.load : 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
            this.$emit('start', game);
        },
    },
});
</script>

<style scoped>

</style>
