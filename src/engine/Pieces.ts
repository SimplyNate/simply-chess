import { BoardMap } from '@/board/utils';

type Color = 'light' | 'dark';

interface IPiece {
    name: string;
    getLegalMoves(currentBoard: BoardMap): string[];
    get code(): string;
}

abstract class Piece {
    color: Color;
    position: string | null;
    rank: number;
    file: string;

    protected constructor(color: Color, position: string) {
        this.color = color;
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }

    move(position: string): void {
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }
}

export class Pawn extends Piece implements IPiece {
    name = 'Pawn';
    inStartingPosition: boolean;

    constructor(color: Color, position: string) {
        super(color, position);
        this.inStartingPosition = (this.rank === 7 && this.color === 'dark') || (this.rank === 2 && this.color === 'light');
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
export class Bishop implements IPiece {
    name = 'Bishop';
    color: Color;
    position: string | null;
    rank: number;
    file: string;

    constructor(color: Color, position: string) {
        this.color = color;
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }

    move(position: string): void {
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }

    get code(): string {
        return this.color === 'dark' ? 'b' : 'B';
    }
}
export class Rook implements IPiece {}
export class King implements IPiece {}
export class Queen implements IPiece {}
export class Knight implements IPiece {}
