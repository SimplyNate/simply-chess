<template>
    <div id="app" class="d-flex flex-row">
        <div class="side-menu mt-1 align-self-center">
            <div class="w-100">
                <h1>Simply Chess</h1>
                <p>Piece Placement: {{ engine.fen.piecePlacement }}</p>
                <p>Active Color: {{ engine.fen.activeColor }}</p>
                <p>Castling Availability: {{ engine.fen.castlingAvailability }}</p>
                <p>En Passant Target Square: {{ engine.fen.enPassantTargetSquare }}</p>
                <p>Half Move Clock: {{ engine.fen.halfMoveClock }}</p>
                <p>Full Move Number: {{ engine.fen.fullMoveNumber }}</p>
                <p>Check Status: {{ engine.checkStatus }}</p>
                <p>Check Mate Status: {{ engine.checkMateStatus }}</p>
                <p>Tie Status: {{ engine.tie }}</p>
                <p>Selected Piece: {{ selectedPiece }}</p>
                <p>Legal Moves: {{ legalMoves }}</p>
                <div>
                    <span>Light Promotion: </span>
                    <select v-model="lightPromotionChoice">
                        <option v-for="promo of promotionChoices" :key="promo">
                            {{ promo }}
                        </option>
                    </select>
                </div>
                <div>
                    <span>Dark Promotion: </span>
                    <select v-model="darkPromotionChoice">
                        <option v-for="promo of promotionChoices" :key="promo">
                            {{ promo }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="w-100" v-if="engine.checkMateStatus">
                <h2>Winner: {{ engine.checkStatus === 'light' ? 'dark' : 'light' }}</h2>
                <button @click="restart">Restart?</button>
            </div>
            <div class="w-100" v-if="engine.tie">
                <h2>Tie game!</h2>
                <button @click="restart">Restart?</button>
            </div>
        </div>
        <div class="float-end" :style="`width: ${containerWidth}px; height: ${containerHeight}px`">
            <canvas-board
                v-if="isMounted"
                :container-height="containerHeight"
                :container-width="containerWidth"
                :current-board-representation="fenString"
                :legal-moves-for-selection="legalMoves"
                @selected="calculateLegalMoves"
                @deselected="clearLegalMoves"
                @move="playerMove"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CanvasBoard from '@/board/CanvasBoard.vue';
import { Selection } from '@/board/BoardUtils';
import { FEN } from '@/utils/utils';
import { Chess } from '@/engine/Chess';
import AI from '@/engine/ai/AI';
import { RandomMover } from '@/engine/ai/RandomMover';
import { MatrixEvaluator } from '@/engine/ai/MatrixEvaluator';
import { Deterministic } from '@/engine/ai/Deterministic';
import { NeuralNet } from '@/engine/ai/NeuralNet';

interface AppData {
    containerHeight: number,
    containerWidth: number,
    isMounted: boolean,
    legalMoves: string[],
    startingFen: string,
    fenString: string,
    fen: FEN,
    engine: Chess,
    selectedPiece: string,
    lightPlayer: string | AI,
    darkPlayer: string | AI,
    aiDelay: number,
    promotionChoices: string[]
    lightPromotionChoice: string,
    darkPromotionChoice: string,
}

interface MovePayload {
    from: string,
    to: string,
    piece: string,
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
            startingFen: '',
            fenString: '',
            fen: {
                piecePlacement: '',
                activeColor: '',
                castlingAvailability: '',
                enPassantTargetSquare: '',
                halfMoveClock: 0,
                fullMoveNumber: 0,
            },
            engine: new Chess(),
            selectedPiece: '',
            lightPlayer: '',
            darkPlayer: '',
            aiDelay: 100,
            promotionChoices: [
                'Knight',
                'Rook',
                'Bishop',
                'Queen',
            ],
            lightPromotionChoice: 'Queen',
            darkPromotionChoice: 'Queen',
        };
    },
    watch: {
        lightPromotionChoice() {
            this.engine.lightPromotionChoice = this.lightPromotionChoice;
        },
        darkPromotionChoice() {
            this.engine.darkPromotionChoice = this.darkPromotionChoice;
        },
    },
    async mounted() {
        this.fenString = String(this.$route.query.fen);
        this.startingFen = this.fenString;
        this.lightPlayer = String(this.$route.query.lightPlayer);
        if (this.lightPlayer === 'AI') {
            console.log('Creating light AI player');
            const lightAi = String(this.$route.query.lightAi);
            if (lightAi === 'RandomMover') {
                this.lightPlayer = new RandomMover('light');
            }
            else if (lightAi === 'MatrixEvaluator') {
                this.lightPlayer = new MatrixEvaluator('light');
            }
            else if (lightAi === 'Deterministic') {
                this.lightPlayer = new Deterministic('light');
            }
            else if (lightAi === 'Neural Net') {
                this.lightPlayer = new NeuralNet('light');
            }
            else {
                this.lightPlayer = new RandomMover('light');
            }
            await this.lightPlayer.ready;
        }
        this.darkPlayer = String(this.$route.query.darkPlayer);
        if (this.darkPlayer === 'AI') {
            console.log('Creating dark AI player');
            const darkAi = String(this.$route.query.darkAi);
            if (darkAi === 'RandomMover') {
                this.darkPlayer = new RandomMover('dark');
            }
            else if (darkAi === 'MatrixEvaluator') {
                this.darkPlayer = new MatrixEvaluator('dark');
            }
            else if (darkAi === 'Deterministic') {
                this.darkPlayer = new Deterministic('dark');
            }
            else if (darkAi === 'Neural Net') {
                this.darkPlayer = new NeuralNet('dark');
            }
            else {
                this.darkPlayer = new RandomMover('dark');
            }
            await this.darkPlayer.ready;
        }
        this.engine = new Chess(this.fenString);
        console.log('created new engine');
        this.onResize();
        window.addEventListener('resize', this.onResize);
        this.isMounted = true;
        this.checkAiMove();
    },
    methods: {
        onResize() {
            this.containerHeight = window.innerHeight;
            this.containerWidth = window.innerWidth * 0.6;
        },
        calculateLegalMoves(selection: Selection) {
            this.selectedPiece = `${selection.piece}, ${selection.place}`;
            this.legalMoves = this.engine.getLegalMoves(selection.place);
        },
        clearLegalMoves() {
            this.selectedPiece = '';
            this.legalMoves.length = 0;
        },
        aiMove(ai: AI) {
            const move = ai.move(this.engine.boardMap, this.engine.fen, this.engine.getAllPieces());
            console.log(`${ai.color} AI move: from ${move.from} to ${move.to}`);
            this.fenString = this.engine.move(move.from, move.to);
            // noinspection SuspiciousTypeOfGuard
            if (this.darkPlayer instanceof AI && this.lightPlayer instanceof AI) {
                setTimeout(this.checkAiMove, this.aiDelay);
            }
        },
        checkAiMove() {
            if (!this.engine.checkMateStatus) {
                // noinspection SuspiciousTypeOfGuard
                if (this.engine.fen.activeColor === 'w' && this.lightPlayer instanceof AI) {
                    this.aiMove(this.lightPlayer);
                }
                else { // noinspection SuspiciousTypeOfGuard
                    if (this.engine.fen.activeColor === 'b' && this.darkPlayer instanceof AI) {
                        this.aiMove(this.darkPlayer);
                    }
                }
            }
        },
        playerMove(payload: MovePayload) {
            this.fenString = this.engine.move(payload.from, payload.to);
            this.checkAiMove();
        },
        restart() {
            this.fenString = this.startingFen;
            this.engine = new Chess(this.fenString);
            this.checkAiMove();
        },
    },
});
</script>

<style>
#app {
    overflow: hidden;
}
.side-menu {
    width: 33vw;
}
</style>
