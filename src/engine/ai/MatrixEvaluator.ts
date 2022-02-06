import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';
import King from '../pieces/King';

interface GenericScore {
    [index: string]: any
}

export class MatrixEvaluator extends AI {
    name: string;
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
        super(color);
        this.name = 'Matrix Evaluator';
    }

    move(board: BoardMap, fen: FEN, pieces: Piece[]): { from: string, to: string } {
        const ret = { from: '', to: '' };
        const allMoves = [];
        for (const piece of pieces) {
            if (piece.color === this.color) {
                for (const move of piece.getLegalMoves(board, fen)) {
                    const score = this.evaluateMove(piece, move, board, fen, pieces);
                    allMoves.push({ from: piece.position, to: move, score });
                }
            }
        }
        if (allMoves.length > 0) {
            // Sort in ascending order
            allMoves.sort((a, b) => a.score - b.score);
            const highScore = allMoves[allMoves.length - 1].score;
            const maxMoveScores = allMoves.filter((move) => move.score === highScore);
            const randInt = Math.floor(Math.random() * maxMoveScores.length);
            ret.from = maxMoveScores[randInt].from;
            ret.to = maxMoveScores[randInt].to;
        }
        return ret;
    }

    evaluateMove(evaluatedPiece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        let score = 0;
        const enemies = pieces.filter((piece) => piece.color !== this.color);
        const allies = pieces.filter((piece) => piece.color === this.color);
        // If piece is currently in danger, prioritize moving it first
        if (this.pieceIsInAnotherPiecesMoveSet(evaluatedPiece, enemies)) {
            score += 10;
        }
        if (this.pieceIsCurrentlyDefended(evaluatedPiece, allies)) {
            score -= 1;
        }
        const boardOccupation = board[move];
        if (boardOccupation !== 'x') {
            const piece = this.findPieceAtPosition(move, pieces);
            if (piece) {
                score += this.scores.pieces[piece.name] * this.scores.capture.multiplier;
            }
        }
        const piecesWithMovesAtPosition = this.findPiecesWithMovesToPosition(move, pieces);
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
        if (this.moveIsForward(evaluatedPiece, move)) {
            score += 0;
        }
        // Simulate move and check if it puts king in check
        if (this.movePutsEnemyKingInCheck(evaluatedPiece, move, board, fen, pieces)) {
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

    movePutsEnemyKingInCheck(piece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): boolean {
        let ret = false;
        const testBoard: BoardMap = JSON.parse(JSON.stringify(board));
        testBoard[move] = piece.code;
        testBoard[piece.position] = 'x';
        const enemyKing = pieces.find((p) => p.name === 'King' && p.color !== piece.color);
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
