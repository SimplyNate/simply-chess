<template>
    <div class="fullscreen">
        <div class="container">
            <h1 class="pb-3 pt-3">Simply Chess</h1>
            <div class="row">
                <div class="col border border-light rounded-1">
                    <h3 class="pt-3">Start a New Game</h3>
                    <p class="pt-3">Start a new game as white.</p>
                    <button class="btn btn-success mb-3" @click="startGame">New Game</button>
                </div>
                <div class="col border border-light rounded-1">
                    <h3 class="pt-3">Load a Game</h3>
                    <p class="pt-3">Load an existing game using a FEN string.</p>
                    <input class="form-control" type="text" v-model="load" placeholder="Input FEN string here." />
                    <button class="btn btn-success mb-3" @click="startGame">Load Game</button>
                </div>
            </div>
        </div>
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
            this.$router.push(`/play/${game}`);
        },
    },
});
</script>

<style scoped>
.fullscreen {
    width: 100vw;
    height: 100vh;
}
</style>
