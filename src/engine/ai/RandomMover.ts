import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

export class RandomMover extends AI {
    name: string;

    constructor(color: Color) {
        super(color);
        this.name = 'Random Mover';
    }

    move(board: BoardMap, fen: FEN, pieces: Piece[]): { from: string, to: string } {
        const allMoves = [];
        for (const piece of pieces) {
            for (const move of piece.getLegalMoves(board, fen)) {
                allMoves.push({ from: piece.position, to: move });
            }
        }
        if (allMoves.length > 0) {
            const randInt = Math.floor(Math.random() * allMoves.length);
            return allMoves[randInt];
        }
        return { from: '', to: '' };
    }
}
