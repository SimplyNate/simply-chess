import { BoardMap } from '@/board/utils';

type Color = 'light' | 'dark';

interface IPiece {
    getLegalMoves(currentBoard: BoardMap): string[];
}

abstract class Piece {
    name: string;
    color: Color;
    position: string | null;
    rank: number;
    file: string;

    protected constructor(color: Color, position: string, name: string) {
        this.color = color;
        this.position = position;
        this.name = name;
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

    get code(): string {
        if (this.name === 'Knight') {
            return this.color === 'dark' ? this.name[1].toLowerCase() : this.name[1].toUpperCase();
        }
        return this.color === 'dark' ? this.name[0].toLowerCase() : this.name[0].toUpperCase();
    }
}

export class Pawn extends Piece implements IPiece {
    inStartingPosition: boolean;

    constructor(color: Color, position: string) {
        super(color, position, 'Pawn');
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
}
export class Bishop extends Piece implements IPiece {

    constructor(color: Color, position: string) {
        super(color, position, 'Bishop');
    }

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
}

export class Rook extends Piece implements IPiece {
    canCastle: boolean;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'Rook');
        this.canCastle = ((castlingAvailability.includes('Q') || castlingAvailability.includes('K')) && this.color === 'light') ||
            ((castlingAvailability.includes('q') || castlingAvailability.includes('k')) && this.color === 'dark');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }
}
export class King extends Piece implements IPiece {
    canCastle: boolean;
    isInCheck = false;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'King');
        this.canCastle = (castlingAvailability.includes('K') && color === 'light') ||
            (castlingAvailability.includes('k') && color === 'dark');

    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }

    getCheckStatus(): boolean {
        return false;
    }
}

export class Queen extends Piece implements IPiece {
    name = 'Queen';

    constructor(color: Color, position: string) {
        super(color, position, 'Queen');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }
}
export class Knight extends Piece implements IPiece {
    name = 'Knight'

    constructor(color: Color, position: string) {
        super(color, position, 'Knight');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }
}
