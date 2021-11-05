import { BoardMap } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Bishop extends Piece {

    constructor(color: Color, position: string) {
        super(color, position, 'Bishop');
    }

    getLegalMoves(currentBoard: BoardMap): string[] {
        const moves = [];
        const fileCode = this.file.charCodeAt(0);
        let fileCodeUp = fileCode + 1;
        let fileCodeDown = fileCode - 1;
        for (let i = this.rank; i <= 8; i++) {
            moves.push(`${}-${}`);
        }
        for (let i = this.rank; i >= 1; i--) {

        }
        return moves;
    }
}
