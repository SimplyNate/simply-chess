import { BoardMap, FEN, shiftChar } from '../../utils/utils';
import { Color, Piece } from './Piece';

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
            // Up
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank + 1}`);
            this.legalMoves.push(`${this.file}-${this.rank + 1}`);
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank + 1}`);
            // Down
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank - 1}`);
            this.legalMoves.push(`${this.file}-${this.rank - 1}`);
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank - 1}`);
            // Left
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank}`);
            // Right
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank}`);
            this.legalMoves = this.filterValidMoves(this.legalMoves, currentBoard);
            if (this.canCastleShort && this.canPerformCastleShort(currentBoard)) {
                const castleShortPosition = this.color === 'light' ? 'g-1' : 'g-8';
                this.legalMoves.push(castleShortPosition);
            }
            if (this.canCastleLong && this.canPerformCastleLong(currentBoard)) {
                const castleLongPosition = this.color === 'light' ? 'c-1' : 'c-8';
                this.legalMoves.push(castleLongPosition);
            }
        }
        return this.legalMoves;
    }

    public canPerformCastleShort(currentBoard: BoardMap): boolean {
        return currentBoard[`${shiftChar(this.file, 1)}-${this.rank}`] === 'x' && currentBoard[`${shiftChar(this.file, 2)}-${this.rank}`] === 'x';
    }

    public canPerformCastleLong(currentBoard: BoardMap): boolean {
        return currentBoard[`${shiftChar(this.file, -1)}-${this.rank}`] === 'x' && currentBoard[`${shiftChar(this.file, -2)}-${this.rank}`] === 'x' && currentBoard[`${shiftChar(this.file, -3)}-${this.rank}`] === 'x';
    }

    // TODO: Refactor this to only require currentBoard
    public getCheckStatus(currentBoard: BoardMap): CheckStatus {
        const currentPosition = this.position;
        const direction = this.color === 'light' ? 1 : -1;
        // Check for attacking pawns
        // Check for attacking knights
        // Check for attacking Rook/Queen
        // Check for attacking Bishop/Queen
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
