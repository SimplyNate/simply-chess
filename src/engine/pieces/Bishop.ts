import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Bishop extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Bishop');
    }

    getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            const moves = [];
            const fileCode = this.file.charCodeAt(0);
            // let fileCodeUp = fileCode + 1;
            // let fileCodeDown = fileCode - 1;
            for (let i = this.rank; i <= 8; i++) {
                moves.push(`${i}-${i}`);
            }
            for (let i = this.rank; i >= 1; i--) {

            }
            this.legalMoves = moves;
        }
        return this.legalMoves;
    }
}
