import { BoardMap, FEN, shiftChar } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Rook extends Piece {
    canCastle: boolean;
    castleSide: string;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'Rook', 'consecutive');
        this.canCastle = ((castlingAvailability.includes('Q') || castlingAvailability.includes('K')) && this.color === 'light') ||
            ((castlingAvailability.includes('q') || castlingAvailability.includes('k')) && this.color === 'dark');
        if (castlingAvailability.includes('q') && position === 'a-8') {
            this.castleSide = 'q';
        }
        else if (castlingAvailability.includes('k') && position === 'h-8') {
            this.castleSide = 'k';
        }
        else if (castlingAvailability.includes('Q') && position === 'a-1') {
            this.castleSide = 'Q';
        }
        else if (castlingAvailability.includes('K') && position === 'h-1') {
            this.castleSide = 'K';
        }
        else {
            this.castleSide = '-';
        }
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
            for (let i = this.rank; i <= 8; i++) {
                const newPosition = `${this.file}-${i}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    this.legalMoves.push(newPosition);
                }
                else {
                    break;
                }
            }
            for (let i = this.rank; i >= 1; i--) {
                const newPosition = `${this.file}-${i}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    this.legalMoves.push(newPosition);
                }
                else {
                    break;
                }
            }
            const fileNumber = this.file.charCodeAt(0);
            let fileLowerBound = 65;
            let fileUpperBound = 72;
            if (this.color === 'dark') {
                fileLowerBound = 97;
                fileUpperBound = 104;
            }
            for (let i = fileNumber - 1; i >= fileLowerBound; i--) {
                const newPosition = `${String.fromCharCode(i)}-${this.rank}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    this.legalMoves.push(newPosition);
                }
                else {
                    break;
                }
            }
            for (let i = fileNumber + 1; i <= fileUpperBound; i++) {
                const newPosition = `${String.fromCharCode(i)}-${this.rank}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    this.legalMoves.push(newPosition);
                }
                else {
                    break;
                }
            }
            // Don't need to filter valid moves since it is being checked at each move calculation
            // this.filterValidMoves(this.legalMoves, currentBoard);
        }
        return this.legalMoves;
    }
}
