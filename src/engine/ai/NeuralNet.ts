import AI, { MoveEvaluation } from './AI';
import { Color, Piece } from '../pieces/Piece';
import * as tf from '@tensorflow/tfjs';
import { convertFenToOneHot, convertMoveToOneHot } from '@/engine/ai/encoder';

export class NeuralNet extends AI {
    model: Readonly<tf.LayersModel> | null = null;

    constructor(color: Color) {
        super(color, 'Neural Net', new Promise((resolve, reject) => {
            tf.loadLayersModel('http://127.0.0.1:8000/model/model.json').then((model) => {
                this.model = Object.freeze(model);
                resolve(true);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        }));
    }

    async evaluateMoves(pieces: Piece[]): Promise<MoveEvaluation[]> {
        if (this.model) {
            const uciMoves = [];
            for (const piece of pieces) {
                for (const move of piece.getLegalMoves(this.board, this.fen)) {
                    const isPawnPromotion = piece.name === 'Pawn' && (move.includes('8') || move.includes('1'));
                    let uciMove = `${piece.position}${move}`.replaceAll('-', '');
                    if (isPawnPromotion) {
                        if (piece.color === 'light') {
                            uciMove += 'Q';
                        }
                        else {
                            uciMove += 'q';
                        }
                    }
                    uciMoves.push(uciMove);
                }
            }
            // return await this.remoteEvaluate(uciMoves);
            return await this.localEvaluate(uciMoves);
        }
        return [];
    }

    createUnscoredEvaluations(uciMoves: string[]): MoveEvaluation[] {
        const moveEvaluations = [];
        for (const move of uciMoves) {
            const from = `${move[0]}-${move[1]}`;
            const to = `${move[2]}-${move[3]}`;
            moveEvaluations.push({ from, to, score: 0 });
        }
        return moveEvaluations;
    }

    async localEvaluate(uciMoves: string[]): Promise<MoveEvaluation[]> {
        const encodedFen = convertFenToOneHot(this.fen);
        const moveEvaluations = [];
        const preprocessed = [];
        for (const move of uciMoves) {
            const encodedMove = convertMoveToOneHot(move);
            const input = [...encodedFen, ...encodedMove];
            preprocessed.push(input);
            const from = `${move[0]}-${move[1]}`;
            const to = `${move[2]}-${move[3]}`;
            moveEvaluations.push({ from, to, score: 0 });
        }
        const tensor = tf.tensor(preprocessed, [preprocessed.length, 829], 'int32');
        const output = this.model?.predict(tensor);
        // @ts-ignore
        const values = await output.data();
        for (let i = 0; i < values.length; i++) {
            moveEvaluations[i].score = values[i];
        }
        return moveEvaluations;
    }

    async remoteEvaluate(uciMoves: string[]): Promise<MoveEvaluation[]> {
        const body = JSON.stringify({ fen: this.fenString, moves: uciMoves });
        const output = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            body: body,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const scores = await output.json() as number[];
        const moveEvaluations = this.createUnscoredEvaluations(uciMoves);
        for (let i = 0; i < moveEvaluations.length; i++) {
            moveEvaluations[i].score = scores[i];
        }
        return moveEvaluations;
    }
}
