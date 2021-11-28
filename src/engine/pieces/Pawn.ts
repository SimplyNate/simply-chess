import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Pawn extends Piece {
    inStartingPosition: boolean;

    constructor(color: Color, position: string) {
        super(color, position, 'Pawn');
        this.inStartingPosition = (this.rank === 7 && this.color === 'dark') || (this.rank === 2 && this.color === 'light');
    }

    // Check if in check, as well as en passant
    getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (this.legalMoves.length === 0) {
            const moves = [];
            const direction = this.color === 'dark' ? -1 : 1;
            if (this.inStartingPosition) {
                moves.push(`${this.file}-${this.rank += (2 * direction)}`);
            }
            moves.push(`${this.file}-${this.rank += (1 * direction)}`);
            this.legalMoves = moves;
        }
        return this.legalMoves;
    }
}
