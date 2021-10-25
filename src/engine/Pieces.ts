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

    // Check if in check, as well as en passant
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
export class Bishop extends Piece implements IPiece {
    name = 'Bishop';

    getLegalMoves(currentBoard: BoardMap): string[] {
        const moves = [];
        const fileCode = this.file.charCodeAt(0);
        let fileCodeUp = fileCode + 1;
        let fileCodeDown = fileCode - 1;
        for (let i = this.rank; i <= 8; i++) {
            moves.push(`${}-${}`);
        }
        for (let i = this.rank; i >= 1; i--) {

        }
        return moves;
    }

    get code(): string {
        return this.color === 'dark' ? 'b' : 'B';
    }
}
export class Rook extends Piece implements IPiece {
    name = 'Rook';
    canCastle: boolean;
    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position);
        if (this.position === 'a-1' && castlingAvailability.includes('Q')) {
            this.canCastle = true;
        }
        else if (this.position === 'h-1' && castlingAvailability.includes('K')) {
            this.canCastle = true;
        }
        else if (this.position === 'a-8' && castlingAvailability.includes('q')) {
            this.canCastle = true;
        }
        else this.canCastle = this.position === 'h-8' && castlingAvailability.includes('k');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }

    get code(): string {
        return this.color === 'dark' ? 'r' : 'R';
    }
}
export class King implements IPiece {}
export class Queen implements IPiece {}
export class Knight implements IPiece {}
