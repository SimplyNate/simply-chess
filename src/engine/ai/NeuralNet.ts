import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import * as tf from '@tensorflow/tfjs';
import { convertFenToOneHot, convertMoveToOneHot } from '@/engine/ai/encoder';

export class NeuralNet extends AI {
    model: tf.LayersModel | null = null;

    constructor(color: Color) {
        super(color, 'Neural Net', new Promise((resolve, reject) => {
            tf.loadLayersModel(require('./model/model.json')).then((model) => {
                this.model = model;
                resolve(true);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        }));
    }

    evaluateMove(piece: Piece, move: string): number {
        const isPawnPromotion = piece.name === 'Pawn' && (move.includes('8') || move.includes('1'));
        let uciMove = `${piece.position}${move}`;
        if (isPawnPromotion) {
            if (piece.color === 'light') {
                uciMove += 'Q';
            }
            else {
                uciMove += 'q';
            }
        }
        const encodedFen = convertFenToOneHot(this.fen);
        const encodedMove = convertMoveToOneHot(uciMove);
        const input = tf.tensor([encodedFen, encodedMove]);
        const output = this.model?.predict(input);
        return Number(output);
    }
}
