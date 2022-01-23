import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

interface MoveAlgorithm {
    algorithm(board: BoardMap, fen: FEN, pieces: Piece[]): string,
}

export abstract class AI implements MoveAlgorithm {
    color: Color;

    protected constructor(color: Color) {
        this.color = color;
    }

    move(board: BoardMap, fen: FEN, pieces: Piece[]): string {
        return this.algorithm(board, fen, pieces);
    }

    algorithm(board: BoardMap, fen: FEN, pieces: Piece[]): string {
        return '';
    }
}

export default AI;
