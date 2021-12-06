import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class King extends Piece {
    canCastleShort: boolean;
    canCastleLong: boolean;
    isInCheck = false;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'King', 'consecutive');
        this.canCastleShort = (castlingAvailability.includes('K') && color === 'light') ||
            (castlingAvailability.includes('k') && color === 'dark');
        this.canCastleLong = (castlingAvailability.includes('Q') && color === 'light') ||
            (castlingAvailability.includes('q') && color === 'dark');
    }

    getLegalMoves(currentBoard: BoardMap, fen: FEN, checkStatus: string): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
        }
        return this.legalMoves;
    }

    getCheckStatus(enemyPieces: Piece[], currentBoard: BoardMap, fen: FEN): boolean {
        for (const piece of enemyPieces) {
            // Use 'none' checkStatus because it would never be any other status
            const legalMoves = piece.getLegalMoves(currentBoard, fen, 'none');
            if (this.position && legalMoves.includes(this.position)) {
                this.isInCheck = true;
                break;
            }
        }
        return this.isInCheck;
    }
}
