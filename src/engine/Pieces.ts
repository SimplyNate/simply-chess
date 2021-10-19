type Color = 'light' | 'dark';

abstract class Piece {
    abstract name: string;
    abstract color: Color;
    abstract position: string | null;
    abstract getLegalMoves(): string[];
    abstract get code(): string;
    abstract move(position: string): void;
}

export class Pawn extends Piece {
    name = 'pawn';
    color: Color;
    position: string | null;

    constructor(color: Color, position = null) {
        super();
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
export class Bishop extends Piece {}
export class Rook extends Piece {}
export class King extends Piece {}
export class Queen extends Piece {}
export class Knight extends Piece {}
