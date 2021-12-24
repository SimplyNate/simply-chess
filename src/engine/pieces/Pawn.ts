import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';
import King from '@/engine/pieces/King';

export default class Pawn extends Piece {
    inStartingPosition: boolean;
    direction: number;

    constructor(color: Color, position: string) {
        super(color, position, 'Pawn', 'consecutive');
        this.direction = this.color === 'dark' ? -1 : 1;
        this.inStartingPosition = (this.rank === 7 && this.color === 'dark') || (this.rank === 2 && this.color === 'light');
    }

    // Check if in check, as well as en passant
    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        console.log('Calculating moves for pawn');
        if (!this.legalMoves) {
            const moves = [];
            const newRank = this.rank + (this.direction);
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
            if (fen.enPassantTargetSquare !== '-') {
                const leftFile = String.fromCharCode(this.file.charCodeAt(0) - 1);
                const rightFile = String.fromCharCode(this.file.charCodeAt(0) + 1);
                const rank = this.rank + this.direction;
                const possibleEPSquares = [`${leftFile}-${rank}`, `${rightFile}-${rank}`];
                for (const possibleSquare of possibleEPSquares) {
                    if (possibleSquare === fen.enPassantTargetSquare) {
                        moves.push(possibleSquare);
                        break; // There can only ever be one match
                    }
                }
            }
            console.log(moves);
            this.legalMoves = moves;
        }
        return this.legalMoves;
    }
}
