import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

export abstract class AI {
    color: Color;
    board: BoardMap = {};
    fen: FEN = {
        activeColor: '',
        castlingAvailability: '',
        enPassantTargetSquare: '',
        fullMoveNumber: 0,
        halfMoveClock: 0,
        piecePlacement: '',
    };

    pieces: Piece[] = [];
    enemies: Piece[] = [];
    allies: Piece[] = [];

    protected constructor(color: Color) {
        this.color = color;
    }

    move(board: BoardMap, fen: FEN, pieces: Piece[]): { from: string, to: string } {
        this.board = board;
        this.fen = fen;
        this.pieces = pieces;
        this.enemies = this.pieces.filter((piece) => piece.color !== this.color);
        this.allies = this.pieces.filter((piece) => piece.color === this.color);
        const ret = { from: '', to: '' };
        const allMoves = [];
        for (const piece of pieces) {
            if (piece.color === this.color) {
                for (const move of piece.getLegalMoves(board, fen)) {
                    const score = this.evaluateMove(piece, move);
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

    evaluateMove(piece: Piece, move: string): number {
        return 0;
    }
}

export default AI;
