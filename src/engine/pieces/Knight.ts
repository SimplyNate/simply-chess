import { BoardMap, FEN, shiftChar } from '../../utils/utils';
import { Color, Piece } from './Piece';

export default class Knight extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Knight', 'jump');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
            // rank + 2
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank + 2}`);
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank + 2}`);
            // rank + 1
            this.legalMoves.push(`${shiftChar(this.file, 2)}-${this.rank + 1}`);
            this.legalMoves.push(`${shiftChar(this.file, -2)}-${this.rank + 1}`);
            // rank - 1
            this.legalMoves.push(`${shiftChar(this.file, 2)}-${this.rank - 1}`);
            this.legalMoves.push(`${shiftChar(this.file, -2)}-${this.rank - 1}`);
            // rank - 2
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank - 2}`);
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank - 2}`);
            this.legalMoves = this.filterValidMoves(this.legalMoves, currentBoard);
        }
        return this.legalMoves;
    }
}
