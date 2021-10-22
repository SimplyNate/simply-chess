import { FEN, BoardMap, separateFEN } from '@/board/utils';

type Color = 'light' | 'dark';

interface Piece {
    name: string;
    color: Color;
    position: string | null;
    getLegalMoves(currentBoard: BoardMap): string[];
    get code(): string;
    move(position: string): void;
}

export class Pawn implements Piece {
    name = 'pawn';
    color: Color;
    position: string | null;
    rank: number;
    file: string;
    inStartingPosition: boolean;

    constructor(color: Color, position: string) {
        this.color = color;
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
        this.inStartingPosition = (this.rank === 7 && this.color === 'dark') || (this.rank === 2 && this.color === 'light');
    }

    move(position: string): void {
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        const moves = [];
        const direction = this.color === 'dark' ? -1 : 1;
        if (this.inStartingPosition) {
            moves.push(`${this.file}-${this.rank += (2 * direction)}`);
        }
        moves.push(`${this.file}-${this.rank += (1 * direction)}`);
        return moves;
    }

    get code(): string {
        return this.color === 'dark' ? 'p' : 'P';
    }
}
export class Bishop implements Piece {}
export class Rook implements Piece {}
export class King implements Piece {}
export class Queen implements Piece {}
export class Knight implements Piece {}
