import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';
import King from '@/engine/pieces/King';

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

    getLegalMoves(currentBoard: BoardMap, fen: FEN, king: King, enemyPieces: Piece[]): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
        }
        return this.legalMoves;
    }
}
