abstract class Piece {
    abstract fullName: string;
    abstract charCode: string;
    abstract color: 'light' | 'dark';
    abstract position: string | null;
}

export class Pawn extends Piece {}
export class Bishop extends Piece {}
export class Rook extends Piece {}
export class King extends Piece {}
export class Queen extends Piece {}
export class Knight extends Piece {}
