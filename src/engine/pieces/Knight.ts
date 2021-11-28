import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Knight extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Knight');
    }

    getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
        }
        return this.legalMoves;
    }
}
