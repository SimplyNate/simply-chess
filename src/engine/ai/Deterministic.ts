import AI, { MoveEvaluation } from './AI';
import { Color, Piece } from '../pieces/Piece';

export class Deterministic extends AI {
    constructor(color: Color) {
        super(color, 'Deterministic', new Promise<boolean>((resolve) => {
            resolve(true);
        }));
    }

    async evaluateMoves(pieces: Piece[]): Promise<MoveEvaluation[]> {
        const moveEvaluations = [];
        for (const piece of pieces) {
            for (const move of piece.getLegalMoves(this.board, this.fen)) {
                const score = this.evaluateMove(piece, move);
                moveEvaluations.push({
                    from: piece.position,
                    to: move.split('-')[1],
                    score,
                });
            }
        }
        return moveEvaluations;
    }

    evaluateMove(piece: Piece, move: string): number {
        if (piece.name === 'Pawn') {
            return this.evaluatePawn(piece, move);
        }
        else if (piece.name === 'Knight') {
            return this.evaluateKnight(piece, move);
        }
        else if (piece.name === 'Bishop') {
            return this.evaluateBishop(piece, move);
        }
        else if (piece.name === 'Rook') {
            return this.evaluateRook(piece, move);
        }
        else if (piece.name === 'Queen') {
            return this.evaluateQueen(piece, move);
        }
        else if (piece.name === 'King') {
            return this.evaluateKing(piece, move);
        }
        return 0;
    }

    evaluatePawn(piece: Piece, move: string): number {
        return 1;
    }

    evaluateKnight(piece: Piece, move: string): number {
        return 1;
    }

    evaluateBishop(piece: Piece, move: string): number {
        return 1;
    }

    evaluateRook(piece: Piece, move: string): number {
        return 1;
    }

    evaluateQueen(piece: Piece, move: string): number {
        return 1;
    }

    evaluateKing(piece: Piece, move: string): number {
        return 1;
    }
}
