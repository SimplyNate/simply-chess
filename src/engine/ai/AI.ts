import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN, stringifyFEN } from '@/utils/utils';

export interface MoveEvaluation {
    from: string,
    to: string,
    score: number,
}

export abstract class AI {
    color: Color;
    name: string;
    ready: Promise<boolean>;
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

    protected constructor(color: Color, name: string, readyPromise: Promise<boolean>) {
        this.color = color;
        this.name = name;
        this.ready = readyPromise;
    }

    async move(board: BoardMap, fen: FEN, pieces: Piece[]): Promise<{ from: string, to: string }> {
        this.board = board;
        this.fen = fen;
        this.pieces = pieces;
        this.enemies = this.pieces.filter((piece) => piece.color !== this.color);
        this.allies = this.pieces.filter((piece) => piece.color === this.color);
        const ret = { from: '', to: '' };
        const scores = await this.evaluateMoves(this.allies);
        if (scores.length > 0) {
            // Sort in ascending order
            scores.sort((a, b) => a.score - b.score);
            const highScore = scores[scores.length - 1].score;
            const maxMoveScores = scores.filter((move) => move.score === highScore);
            const randInt = Math.floor(Math.random() * maxMoveScores.length);
            ret.from = maxMoveScores[randInt].from;
            ret.to = maxMoveScores[randInt].to;
        }
        return ret;
    }

    async evaluateMoves(pieces: Piece[]): Promise<MoveEvaluation[]> {
        return [];
    }

    get allyMoves(): string[] {
        const moves = [];
        for (const ally of this.allies) {
            if (ally.legalMoves) {
                moves.push(...ally.legalMoves);
            }
        }
        return moves;
    }

    get enemyMoves(): string[] {
        const moves = [];
        for (const enemy of this.enemies) {
            if (enemy.legalMoves) {
                moves.push(...enemy.legalMoves);
            }
        }
        return moves;
    }

    get fenString(): string {
        return stringifyFEN(this.fen);
    }
}

export default AI;
