import { BoardMap } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class King extends Piece {
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
