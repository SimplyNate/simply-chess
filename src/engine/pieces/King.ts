import { BoardMap } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class King extends Piece {
    canCastleShort: boolean;
    canCastleLong: boolean;
    isInCheck = false;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'King');
        this.canCastleShort = (castlingAvailability.includes('K') && color === 'light') ||
            (castlingAvailability.includes('k') && color === 'dark');
        this.canCastleLong = (castlingAvailability.includes('Q') && color === 'light') ||
            (castlingAvailability.includes('q') && color === 'dark');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }

    getCheckStatus(): boolean {
        return false;
    }
}
