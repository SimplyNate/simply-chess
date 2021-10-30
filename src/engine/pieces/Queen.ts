import { BoardMap } from '@/board/utils';
import { Color, IPiece, Piece } from '@/engine/pieces/Piece';

export class Queen extends Piece implements IPiece {
    name = 'Queen';

    constructor(color: Color, position: string) {
        super(color, position, 'Queen');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }
}
