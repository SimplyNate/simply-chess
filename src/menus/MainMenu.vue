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
                    <h3 class="mt-3">Additional Settings</h3>
                    <div class="row mb-3">
                        <div class="col border border-light rounded-1 ms-3 me-3 mt-1 pt-2 pb-2">
                            <h5>Light Player</h5>
                            <div>
                                <span>Player type: </span>
                                <select style="margin-bottom: .2em;" v-model="lightPlayerType">
                                    <option>Human</option>
                                    <option>AI</option>
                                </select>
                            </div>
                            <div v-if="lightPlayerType === 'AI'">
                                <span>AI Engine: </span>
                                <select style="margin-bottom: .2em;" v-model="lightAi">
                                    <option v-for="ai of aiList" :key="ai">{{ ai }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col border border-light rounded-1 ms-3 me-3 mt-1 mt-1 pt-2 pb-2">
                            <h5>Dark Player</h5>
                            <div>
                                <span>Player type: </span>
                                <select style="margin-bottom: .2em;" v-model="darkPlayerType">
                                    <option>Human</option>
                                    <option>AI</option>
                                </select>
                            </div>
                            <div v-if="darkPlayerType === 'AI'">
                                <span>AI Engine: </span>
                                <select style="margin-bottom: .2em;" v-model="darkAi">
                                    <option v-for="ai of aiList" :key="ai">{{ ai }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
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
            aiList: [
                'RandomMover',
                'MatrixEvaluator',
                'Deterministic',
            ],
            lightPlayerType: 'Human',
            darkPlayerType: 'AI',
            lightAi: 'MatrixEvaluator',
            darkAi: 'MatrixEvaluator',
        };
    },
    methods: {
        validateFen(): boolean {
            if (this.load) {
                return true;
            }
            return true;
        },
        buildParams(fenString: string): string {
            let params = `?fen=${fenString}&lightPlayer=${this.lightPlayerType}`;
            if (this.lightPlayerType === 'AI') {
                params += `&lightAi=${this.lightAi}`;
            }
            params += `&darkPlayer=${this.darkPlayerType}`;
            if (this.darkPlayerType === 'AI') {
                params += `&darkAi=${this.darkAi}`;
            }
            return params;
        },
        startGame() {
            if (this.validateFen()) {
                const game = this.load ? this.load : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0';
                const params = this.buildParams(game);
                this.$router.push(`/play${params}`);
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
