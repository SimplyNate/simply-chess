import { BoardMap, FEN } from '../../utils/utils';
import { Color, Piece } from './Piece';

export default class Rook extends Piece {
    canCastle: boolean;
    castleSide: string;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'Rook', 'consecutive');
        if (castlingAvailability.includes('q') && position === 'a-8' && this.color === 'dark') {
            this.canCastle = true;
            this.castleSide = 'q';
        }
        else if (castlingAvailability.includes('k') && position === 'h-8' && this.color === 'dark') {
            this.canCastle = true;
            this.castleSide = 'k';
        }
        else if (castlingAvailability.includes('Q') && position === 'a-1' && this.color === 'light') {
            this.canCastle = true;
            this.castleSide = 'Q';
        }
        else if (castlingAvailability.includes('K') && position === 'h-1' && this.color === 'light') {
            this.canCastle = true;
            this.castleSide = 'K';
        }
        else {
            this.canCastle = false;
            this.castleSide = '-';
        }
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = this.consecutiveMoveSearch(currentBoard, true, false);
        }
        return this.legalMoves;
    }
}
