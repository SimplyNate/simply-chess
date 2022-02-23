import AI from './AI';
import { Color, Piece } from '../pieces/Piece';

export class RandomMover extends AI {
    constructor(color: Color) {
        super(color, 'Random Mover', new Promise<boolean>((resolve) => {
            resolve(true);
        }));
    }

    async evaluateMove(piece: Piece, move: string): Promise<number> {
        return Math.floor(Math.random() * 10);
    }
}
