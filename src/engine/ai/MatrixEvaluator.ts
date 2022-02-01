import AI from './AI';
import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

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
            multiplier: -1,
        },
        defending: {
            multiplier: 1.5,
        },
        defended: {
            multiplier: 1.5,
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
            return { from: maxMoveScores[randInt].from, to: maxMoveScores[randInt].to };
        }
        return { from: '', to: '' };
    }

    evaluateMove(evaluatedPiece: Piece, move: string, board: BoardMap, fen: FEN, pieces: Piece[]): number {
        let score = 0;
        const boardOccupation = board[move];
        if (boardOccupation !== 'x') {
            const piece = this.findPieceAtPosition(move, pieces);
            if (piece) {
                score += this.scores.pieces[piece.name] * this.scores.capture.multiplier;
            }
            const piecesWithMovesAtPosition = this.findPiecesWithMovesToPosition(move, pieces);
            if (piecesWithMovesAtPosition) {
                const defenders = piecesWithMovesAtPosition.filter((piece) => piece.color === this.color);
                const attackers = piecesWithMovesAtPosition.filter((piece) => piece.color !== this.color);
                for (const attacker of attackers) {
                    score += this.scores.pieces[attacker.name] * this.scores.danger.multiplier;
                }
                for (const defender of defenders) {
                    score += this.scores.pieces[defender.name] * this.scores.defending.multiplier;
                }
            }
            if (this.moveIsForward(evaluatedPiece, move)) {
                score += 1;
            }
        }
        return score;
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
}
