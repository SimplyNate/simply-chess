import { BoardMap } from '@/board/utils';
import { Color, IPiece, Piece } from '@/engine/pieces/Piece';

export class Bishop extends Piece implements IPiece {

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
