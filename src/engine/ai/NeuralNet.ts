import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import * as tf from '@tensorflow/tfjs';

export class NeuralNet extends AI {
    model: tf.LayersModel | null = null;

    constructor(color: Color) {
        super(color, 'Neural Net', new Promise((resolve, reject) => {
            tf.loadLayersModel(require('./model.json')).then((model) => {
                this.model = model;
                resolve(true);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        }));
    }

    evaluateMove(piece: Piece, move: string): number {
        return Math.floor(Math.random() * 10);
    }
}
