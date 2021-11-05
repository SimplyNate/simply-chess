import { BoardMap } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Rook extends Piece {
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
