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
        if (piece.name === 'Pawn') {
            return this.evaluatePawn(piece, move, board, fen, pieces);
        }
        else if (piece.name === 'Knight') {
            return this.evaluateKnight(piece, move, board, fen, pieces);
        }
    }

    evaluatePawn(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 1;
    }

    evaluateKnight(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 1;
    }

    evaluateBishop(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 1;
    }

    evaluateRook(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 1;
    }

    evaluateQueen(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 1;
    }

    evaluateKing(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 1;
    }
}
