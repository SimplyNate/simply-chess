import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

export class MatrixEvaluator extends AI {
    name: string;
    scores = {
        capture: {
            multiplier: 2,
            Pawn: 1,
            Knight: 2,
            Bishop: 3,
            Rook: 3,
            Queen: 4,
            King: 5,
        },
        pressure: {
            multiplier: 1.5,
            Pawn: 1,
            Knight: 2,
            Bishop: 3,
            Rook: 3,
            Queen: 4,
            King: 5,
        },
        danger: {
            multiplier: -1,
        },
        defending: {
            multiplier: 1,
        },
        defended: {
            multiplier: 1,
        },
    }

    constructor(color: Color) {
        super(color);
        this.name = 'Matrix Evaluator';
    }

    move(board: BoardMap, fen: FEN, pieces: Piece[]): { from: string, to: string } {
        const allMoves = [];
        for (const piece of pieces) {
            if (piece.color === this.color) {
                for (const move of piece.getLegalMoves(board, fen)) {
                    const score = this.evaluateMove(move, board, fen, pieces);
                    allMoves.push({ from: piece.position, to: move, score });
                }
            }
        }
        if (allMoves.length > 0) {
            // Sort in ascending order
            allMoves.sort((a, b) => a.score - b.score);
            return { from: allMoves[allMoves.length - 1].from, to: allMoves[allMoves.length - 1].to };
        }
        return { from: '', to: '' };
    }

    evaluateMove(move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        return 5;
    }
}
