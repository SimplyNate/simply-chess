import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

export class RandomMover extends AI {
    name: string;

    constructor(color: Color) {
        super(color);
        this.name = 'Random Mover';
    }

    evaluateMove(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return Math.floor(Math.random() * 10);
    }
}
