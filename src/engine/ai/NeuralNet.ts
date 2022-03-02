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
            /*
            const body = JSON.stringify({ fen: this.fenString, move: [uciMove] });
            const output = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                body: body,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const score = await output.json();
             */
            const encodedFen = convertFenToOneHot(this.fen);
            const moveEvaluations = [];
            for (const move of uciMoves) {
                const encodedMove = convertMoveToOneHot(move);
                const input = [...encodedFen, ...encodedMove];
                const tensor = tf.tensor(input, [829], 'int32').expandDims(0);
                const output = this.model.predict(tensor);
                // @ts-ignore
                const value = await output.data();
                moveEvaluations.push({ from: move.slice(0, 2), to: move.slice(2, 4), score: value });
            }
            return moveEvaluations;
        }
        return [];
    }
}
