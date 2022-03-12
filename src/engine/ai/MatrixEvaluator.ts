import AI, { MoveEvaluation } from './AI';
import { Color, Piece } from '../pieces/Piece';
import { BoardMap } from '@/utils/utils';
import King from '../pieces/King';

interface GenericScore {
    [index: string]: any
}

export class MatrixEvaluator extends AI {
    scores: GenericScore = {
        pieces: {
            Pawn: 1,
            Knight: 2,
            Bishop: 3,
            Rook: 3,
            Queen: 4,
            King: 5,
        },
        capture: {
            multiplier: 2,
        },
        pressure: {
            multiplier: 1.5,
        },
        // Danger scores represent how dangerous it is to lose this piece
        danger: {
            multiplier: -25,
        },
        defending: {
            multiplier: 1.5,
        },
        defended: {
            multiplier: 1.05,
        },
        checks: {
            multiplier: 4,
        },
    }

    constructor(color: Color) {
        super(color, 'Matrix Evaluator', new Promise<boolean>((resolve) => {
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
        let score = 0;
        // If piece is currently in danger, prioritize moving it first
        if (this.pieceIsInAnotherPiecesMoveSet(piece, this.enemies)) {
            score += 10;
        }
        if (this.pieceIsCurrentlyDefended(piece, this.allies)) {
            score -= 1;
        }
        const boardOccupation = this.board[move];
        if (boardOccupation !== 'x') {
            const piece = this.findPieceAtPosition(move, this.pieces);
            if (piece) {
                score += this.scores.pieces[piece.name] * this.scores.capture.multiplier;
            }
        }
        const piecesWithMovesAtPosition = this.findPiecesWithMovesToPosition(move, this.pieces);
        if (piecesWithMovesAtPosition) {
            const defenders = piecesWithMovesAtPosition.filter((piece) => piece.color === this.color);
            const attackers = piecesWithMovesAtPosition.filter((piece) => piece.color !== this.color);
            if (defenders.length > 0) {
                score *= this.scores.defending.multiplier;
            }
            if (attackers.length > 0) {
                score += 1 * this.scores.danger.multiplier;
            }
        }
        if (this.moveIsForward(piece, move)) {
            score += 0;
        }
        // Simulate move and check if it puts king in check
        if (this.movePutsEnemyKingInCheck(piece, move)) {
            score *= this.scores.checks.multiplier;
        }
        return score;
    }

    pieceIsCurrentlyDefended(piece: Piece, allies: Piece[]): boolean {
        for (const ally of allies) {
            for (const defense of ally.defending) {
                if (defense.code === piece.code && defense.position === piece.position) {
                    return true;
                }
            }
        }
        return false;
    }

    pieceIsInAnotherPiecesMoveSet(piece: Piece, enemies: Piece[]): boolean {
        const attackers = this.findPiecesWithMovesToPosition(piece.position, enemies);
        return attackers ? attackers.length > 0 : false;
    }

    findPieceAtPosition(move: string, pieces: Piece[]): Piece | undefined {
        return pieces.find((piece) => piece.position === move);
    }

    findPiecesWithMovesToPosition(move: string, pieces: Piece[]): Piece[] | undefined {
        return pieces.filter((piece) => piece.legalMoves?.includes(move));
    }

    // If move pushes piece towards opposite end
    moveIsForward(evaluatedPiece: Piece, move: string): boolean {
        if (this.color === 'light') {
            return Number(move[2]) > evaluatedPiece.rank;
        }
        return Number(move[2]) < evaluatedPiece.rank;
    }

    movePutsEnemyKingInCheck(piece: Piece, move: string): boolean {
        let ret = false;
        const testBoard: BoardMap = JSON.parse(JSON.stringify(this.board));
        testBoard[move] = piece.code;
        testBoard[piece.position] = 'x';
        const enemyKing = this.pieces.find((p) => p.name === 'King' && p.color !== piece.color);
        if (enemyKing instanceof King) {
            const originalCheckStatus = enemyKing.isInCheck;
            const originalCheckBy = enemyKing.checkBy;
            enemyKing.getCheckStatus(testBoard);
            ret = enemyKing.isInCheck;
            enemyKing.isInCheck = originalCheckStatus;
            enemyKing.checkBy = originalCheckBy;
        }
        return ret;
    }
}
