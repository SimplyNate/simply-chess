import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

export class Deterministic extends AI {
    name: string;

    constructor(color: Color) {
        super(color);
        this.name = 'Deterministic';
    }

    evaluateMove(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 1;
    }
}
