import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Bishop extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Bishop', 'consecutive');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = this.consecutiveMoveSearch(currentBoard, false, true);
        }
        return this.legalMoves;
    }
}
