import { BoardMap, FEN, shiftChar } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Pawn extends Piece {
    inStartingPosition: boolean;
    direction: number;

    constructor(color: Color, position: string) {
        super(color, position, 'Pawn', 'consecutive');
        this.direction = this.color === 'dark' ? -1 : 1;
        this.inStartingPosition = (this.rank === 7 && this.color === 'dark') || (this.rank === 2 && this.color === 'light');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            const moves = [];
            const newRank = this.rank + this.direction;
            const move1 = `${this.file}-${newRank}`;
            if ((newRank <= 8 || newRank >= 1) && currentBoard[move1] === 'x') {
                moves.push(move1);
                if (this.inStartingPosition) {
                    const move2 = `${this.file}-${this.rank + (2 * this.direction)}`;
                    if (currentBoard[move2] === 'x') {
                        moves.push(move2);
                    }
                }
            }
            const leftFile = shiftChar(this.file, -1);
            const rightFile = shiftChar(this.file, 1);
            const possibleEPSquares = [`${leftFile}-${newRank}`, `${rightFile}-${newRank}`];
            for (const possibleSquare of possibleEPSquares) {
                const enPassantCheck = possibleSquare[0] + possibleSquare[2];
                if (enPassantCheck === fen.enPassantTargetSquare || (currentBoard[possibleSquare] && currentBoard[possibleSquare] !== 'x' && this.isOppositeColor(currentBoard[possibleSquare]))) {
                    moves.push(`${possibleSquare}`);
                }
            }
            this.legalMoves = moves;
        }
        return this.legalMoves;
    }
}
