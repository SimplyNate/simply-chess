import { BoardMap, FEN, shiftChar } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';
import King from '@/engine/pieces/King';

export default class Knight extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Knight', 'jump');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
            /*
            rank + 2
                file + 1
                file - 1
            rank + 1
                file + 2
                file - 2
            rank - 1
                file + 2
                file - 2
            rank - 2
                file + 1
                file - 1
             */
        }
        return this.legalMoves;
    }
}
