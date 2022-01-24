<template>
    <div class="fullscreen">
        <div class="container position-absolute top-50 start-50 translate-middle">
            <h1 class="pb-3 pt-3 text-large">Simply Chess</h1>
            <div class="row">
                <div class="col border border-light rounded-1 ms-3 me-3">
                    <h3 class="pt-3">Start a New Game</h3>
                    <p class="pt-3">Start a new game in default starting position.</p>
                    <button class="btn btn-success mb-3" @click="startGame">New Game</button>
                </div>
                <div class="col border border-light rounded-1 ms-3 me-3">
                    <h3 class="pt-3">Load a Game</h3>
                    <p class="pt-3">Load an existing game using a FEN string.</p>
                    <div class="input-group mb-3">
                        <input class="form-control" type="text" v-model="load" placeholder="Input FEN string here." />
                        <button class="btn btn-success" @click="startGame">Load Game</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col border border-light rounded-1 ms-3 me-3 mt-3">
                    <h3>Additional Settings</h3>
                    <div>Play as:
                        <select v-model="playAs">
                            <option>light</option>
                            <option>dark</option>
                        </select>
                    </div>
                    <div style="margin-bottom: .1em;"><input type="checkbox" v-model="useAi" /> Use AI?</div>
                    <select v-if="useAi" style="margin-bottom: .2em;" v-model="selectedAi">
                        <option v-for="ai of aiList" :key="ai">{{ ai }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MainMenu',
    data() {
        return {
            load: null,
            useAi: false,
            aiList: [
                'RandomMover',
            ],
            selectedAi: 'RandomMover',
            playAs: 'light',
        };
    },
    methods: {
        validateFen(): boolean {
            if (this.load) {
                return true;
            }
            return true;
        },
        startGame() {
            if (this.validateFen()) {
                const game = this.load ? this.load : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0';
                this.$router.push(`/play?fen=${game}&playAs=${this.playAs}&ai=${this.useAi}&aiType=${this.selectedAi}`);
            }
        },
    },
});
</script>

<style scoped>
.fullscreen {
    width: 100vw;
    height: 100vh;
}
.text-large {
    font-weight: bold;
    font-size: 10em;
}
</style>
