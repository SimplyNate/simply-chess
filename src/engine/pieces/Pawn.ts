import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Pawn extends Piece {
    inStartingPosition: boolean;

    constructor(color: Color, position: string) {
        super(color, position, 'Pawn');
        this.inStartingPosition = (this.rank === 7 && this.color === 'dark') || (this.rank === 2 && this.color === 'light');
    }

    private calculateMovesNoCheck(currentBoard: BoardMap, fen: FEN): string[] {
        const moves = [];
        const direction = this.color === 'dark' ? -1 : 1;
        const newRank = this.rank + (1 * direction);
        const move1 = `${this.file}-${newRank}`;
        if ((newRank <= 8 || newRank >= 1) && currentBoard[move1] === 'x') {
            moves.push(move1);
            if (this.inStartingPosition) {
                const move2 = `${this.file}-${this.rank + (2 * direction)}`;
                if (currentBoard[move2] === 'x') {
                    moves.push(move2);
                }
            }
        }
        if (fen.enPassantTargetSquare !== '-') {
            const leftFile = String.fromCharCode(this.file.charCodeAt(0) - 1);
            const rightFile = String.fromCharCode(this.file.charCodeAt(0) + 1);
            const rank = this.rank + (1 * direction);
            const possibleEPSquares = [`${leftFile}-${rank}`, `${rightFile}-${rank}`];
            for (const possibleSquare of possibleEPSquares) {
                if (possibleSquare === fen.enPassantTargetSquare) {
                    moves.push(possibleSquare);
                    break; // There can only ever be one match
                }
            }
        }
        return moves;
    }

    private calculateMovesCheck(currentBoard: BoardMap, fen: FEN): string[] {
        return [];
    }

    // Check if in check, as well as en passant
    getLegalMoves(currentBoard: BoardMap, fen: FEN, checkStatus: string): string[] {
        if (!this.legalMoves) {
            if (checkStatus === this.color) {
                this.legalMoves = this.calculateMovesCheck(currentBoard, fen);
            }
            else {
                this.legalMoves = this.calculateMovesNoCheck(currentBoard, fen);
            }
        }
        return this.legalMoves;
    }
}
