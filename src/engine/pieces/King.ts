import { BoardMap } from '@/board/utils';
import { Color, IPiece, Piece } from '@/engine/pieces/Piece';

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
