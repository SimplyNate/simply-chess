import { BoardMap } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Queen extends Piece {
    name = 'Queen';

    constructor(color: Color, position: string) {
        super(color, position, 'Queen');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }
}
