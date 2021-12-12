import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

interface CheckStatus {
    check: boolean,
    piece: Piece | null,
}

export default class King extends Piece {
    canCastleShort: boolean;
    canCastleLong: boolean;
    isInCheck = false;
    checkBy: Piece | null = null;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'King', 'consecutive');
        this.canCastleShort = (castlingAvailability.includes('K') && color === 'light') ||
            (castlingAvailability.includes('k') && color === 'dark');
        this.canCastleLong = (castlingAvailability.includes('Q') && color === 'light') ||
            (castlingAvailability.includes('q') && color === 'dark');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
        }
        return this.legalMoves;
    }

    public getCheckStatus(enemyPieces: Piece[], currentBoard: BoardMap, fen: FEN): CheckStatus {
        for (const piece of enemyPieces) {
            // Use 'none' checkStatus because it would never be any other status
            const legalMoves = piece.getLegalMoves(currentBoard, fen);
            if (this.position && legalMoves.includes(this.position)) {
                this.isInCheck = true;
                this.checkBy = piece;
                break;
            }
        }
        return { check: this.isInCheck, piece: this.checkBy };
    }
}
