import { BoardMap, FEN, shiftChar } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';
import King from '@/engine/pieces/King';

export default class Bishop extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Bishop', 'consecutive');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
            for (let i = this.rank; i < 8; i++) {
                this.legalMoves.push(`${shiftChar(this.file, i)}-${i}`);
                this.legalMoves.push(`${shiftChar(this.file, i * -1)}-${i}`);
            }
            for (let i = this.rank; i > 1; i--) {
                this.legalMoves.push(`${shiftChar(this.file, i)}-${i}`);
                this.legalMoves.push(`${shiftChar(this.file, i * -1)}-${i}`);
            }
            this.filterValidMoves(this.legalMoves, currentBoard);
        }
        return this.legalMoves;
    }
}
