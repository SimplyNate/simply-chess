import { Color, Piece } from '../../../src/engine/pieces/Piece';
import King from '../../../src/engine/pieces/King';
import Pawn from '../../../src/engine/pieces/Pawn';
import Rook from '../../../src/engine/pieces/Rook';
import Knight from '../../../src/engine/pieces/Knight';
import Bishop from '../../../src/engine/pieces/Bishop';
import Queen from '../../../src/engine/pieces/Queen';
import { BoardMap } from '../../../src/utils/utils';

class TestPiece extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'TestPiece', 'consecutive');
    }
}

describe('Piece', () => {
    test('constructs as expected', () => {
        const piece = new TestPiece('light', 'a-2');
        expect(piece.name).toBe('TestPiece');
        expect(piece.code).toBe('T');
        expect(piece.color).toBe('light');
        expect(piece.position).toBe('a-2');
        expect(piece.rank).toEqual(2);
        expect(piece.file).toBe('a');
        expect(piece.legalMoves).toBeNull(); // Abstract class won't generate legal moves
        expect(piece.moveType).toBe('consecutive');
    });
    test('move', () => {
        const piece = new TestPiece('light', 'a-2');
        piece.move('b-3');
        expect(piece.lastPosition).toBe('a-2');
        expect(piece.position).toBe('b-3');
        expect(piece.rank).toEqual(3);
        expect(piece.file).toBe('b');
    });
    test('filterMovesCheck no check', () => {
        const king = new King('light', 'e-1', '-');
        const enemyPieces = [
            new Pawn('dark', 'a-7'),
        ];
    });
    test('filterMovesCheck in check', () => {

    });
});
