import { BoardMap } from '@/board/utils';
import { Color, IPiece, Piece } from '@/engine/pieces/Piece';

export class Knight extends Piece implements IPiece {
    name = 'Knight'

    constructor(color: Color, position: string) {
        super(color, position, 'Knight');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }
}
