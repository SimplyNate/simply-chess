import { BoardMap } from '@/board/utils';
import { Color, IPiece, Piece } from '@/engine/pieces/Piece';

export class Pawn extends Piece implements IPiece {
    inStartingPosition: boolean;

    constructor(color: Color, position: string) {
        super(color, position, 'Pawn');
        this.inStartingPosition = (this.rank === 7 && this.color === 'dark') || (this.rank === 2 && this.color === 'light');
    }

    // Check if in check, as well as en passant
    getLegalMoves(currentBoard: BoardMap): string[] {
        const moves = [];
        const direction = this.color === 'dark' ? -1 : 1;
        if (this.inStartingPosition) {
            moves.push(`${this.file}-${this.rank += (2 * direction)}`);
        }
        moves.push(`${this.file}-${this.rank += (1 * direction)}`);
        return moves;
    }
}
