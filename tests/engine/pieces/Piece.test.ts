import { Color, Piece } from '../../../src/engine/pieces/Piece';

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
        const king = ''
    });
    test('filterMovesCheck in check', () => {

    });
});
