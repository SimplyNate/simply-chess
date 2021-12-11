import { BoardMap, FEN } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';
import King from '@/engine/pieces/King';

export default class Knight extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Knight', 'jump');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN, king: King, enemyPieces: Piece[]): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
        }
        return this.legalMoves;
    }
}
