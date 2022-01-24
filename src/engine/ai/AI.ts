import { Color, Piece } from '../pieces/Piece';
import { BoardMap, FEN } from '../../utils/utils';

export abstract class AI {
    color: Color;

    protected constructor(color: Color) {
        this.color = color;
    }

    move(board: BoardMap, fen: FEN, pieces: Piece[]): { from: string, to: string } {
        return { from: '', to: '' };
    }
}

export default AI;
