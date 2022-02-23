import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import * as tf from '@tensorflow/tfjs';
import { convertFenToOneHot, convertMoveToOneHot } from '@/engine/ai/encoder';

export class NeuralNet extends AI {
    model: tf.LayersModel | null = null;

    constructor(color: Color) {
        super(color, 'Neural Net', new Promise((resolve, reject) => {
            tf.loadLayersModel('http://127.0.0.1:8000/model.json').then((model) => {
                this.model = model;
                resolve(true);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        }));
    }

    async evaluateMove(piece: Piece, move: string): Promise<number> {
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
        const body = JSON.stringify({ fen: this.fen, move: uciMove });
        const output = await fetch('http://127.0.0.1:8000/model/predict', { method: 'POST', body: body });
        /*
        const encodedFen = convertFenToOneHot(this.fen);
        const encodedMove = convertMoveToOneHot(uciMove);
        const input = [...encodedFen, ...encodedMove];
        const tensors = [];
        for (const enc of input) {
            tensors.push(tf.tensor([[[enc]]]));
        }
        const output = this.model?.predict(tensors);
         */
        return Number(output);
    }
}
