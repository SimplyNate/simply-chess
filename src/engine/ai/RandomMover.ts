import AI, { MoveEvaluation } from './AI';
import { Color, Piece } from '../pieces/Piece';

export class RandomMover extends AI {
    constructor(color: Color) {
        super(color, 'Random Mover', new Promise<boolean>((resolve) => {
            resolve(true);
        }));
    }

    async evaluateMoves(pieces: Piece[]): Promise<MoveEvaluation[]> {
        const moveEvaluations = [];
        for (const piece of pieces) {
            for (const move of piece.getLegalMoves(this.board, this.fen)) {
                const score = this.evaluateMove();
                moveEvaluations.push({
                    from: piece.position,
                    to: move.split('-')[1],
                    score,
                });
            }
        }
        return moveEvaluations;
    }

    evaluateMove(): number {
        return Math.floor(Math.random() * 10);
    }
}
