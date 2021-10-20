type Color = 'light' | 'dark';

interface Piece {
    name: string;
    color: Color;
    position: string | null;
    getLegalMoves(): string[];
    get code(): string;
    move(position: string): void;
}

export class Pawn implements Piece {
    name = 'pawn';
    color: Color;
    position: string | null;

    constructor(color: Color, position = null) {
        this.color = color;
        this.position = position;
    }

    move(position: string): void {
        this.position = position;
    }

    getLegalMoves(): string[] {
        return [];
    }

    get code(): string {
        return this.color === 'light' ? 'p' : 'P';
    }
}
export class Bishop implements Piece {}
export class Rook implements Piece {}
export class King implements Piece {}
export class Queen implements Piece {}
export class Knight implements Piece {}
