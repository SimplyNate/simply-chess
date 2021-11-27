import { BoardMap } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Knight extends Piece {

    constructor(color: Color, position: string) {
        super(color, position, 'Knight');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }
}
