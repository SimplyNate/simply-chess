import AI from './AI';
import { Color, Piece } from '../pieces/Piece';

export class RandomMover extends AI {
    name: string;

    constructor(color: Color) {
        super(color);
        this.name = 'Random Mover';
    }

    evaluateMove(piece: Piece, move: string): number {
        return Math.floor(Math.random() * 10);
    }
}
