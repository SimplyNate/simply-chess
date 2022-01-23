import AI from './AI';
import { Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

export class RandomMover extends AI {
    algorithm(board: BoardMap, fen: FEN, pieces: Piece[]): string {
        const allMoves = [];
        for (const piece of pieces) {
            allMoves.push(...piece.getLegalMoves(board, fen));
        }
        const randInt = Math.floor(Math.random() * allMoves.length);
        return allMoves[randInt];
    }
}
