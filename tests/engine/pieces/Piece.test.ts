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

    public testFilterValidMoves(moves: string[], currentBoard: BoardMap): string[] {
        return this.filterValidMoves(moves, currentBoard);
    }

    public testIsValidMovePosition(move: string, currentBoard: BoardMap): boolean {
        return this.isValidMovePosition(move, currentBoard);
    }

    public testOppositeColor(pieceCode: string): boolean {
        return this.isOppositeColor(pieceCode);
    }

    public testConsecutiveMoveSearch(currentBoard: BoardMap, straight: boolean, diagonal: boolean): string[] {
        return this.consecutiveMoveSearch(currentBoard, straight, diagonal);
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
    test('filterValidMoves', () => {

    });
    test('isValidMovePosition', () => {

    });
    test('isOppositeColor', () => {
        const light = new TestPiece('light', 'a-4');
        const dark = new TestPiece('dark', 'a-6');
        expect(light.testOppositeColor(dark.code)).toBeTruthy();
        expect(light.testOppositeColor(light.code)).toBeFalsy();
        expect(dark.testOppositeColor(light.code)).toBeTruthy();
        expect(dark.testOppositeColor(dark.code)).toBeFalsy();
    });
    describe('consecutiveMoveSearch', () => {
        test('straight moves no blocks');
        test('straight moves with blocks');
        test('diagonal moves no blocks');
        test('diagonal moves with blocks');
    });
    test('resetLegalMoves', () => {
        const piece = new TestPiece('light', 'a-2');
        piece.legalMoves = [];
        piece.resetLegalMoves();
        expect(piece.legalMoves).toBeNull();
    });
    test('parseCode', () => {
        const P = new Pawn('light', 'a-2');
        const p = new Pawn('dark', 'a-2');
        const B = new Bishop('light', 'a-2');
        const b = new Bishop('dark', 'a-2');
        const K = new King('light', 'a-2', '-');
        const k = new King('dark', 'a-2', '-');
        const N = new Knight('light', 'a-2');
        const n = new Knight('dark', 'a-2');
        const Q = new Queen('light', 'a-2');
        const q = new Queen('dark', 'a-2');
        const R = new Rook('light', 'a-2', '-');
        const r = new Rook('dark', 'a-2', '-');
        expect(P.code).toBe('P');
        expect(p.code).toBe('p');
        expect(B.code).toBe('B');
        expect(b.code).toBe('b');
        expect(K.code).toBe('K');
        expect(k.code).toBe('k');
        expect(N.code).toBe('N');
        expect(n.code).toBe('n');
        expect(Q.code).toBe('Q');
        expect(q.code).toBe('q');
        expect(R.code).toBe('R');
        expect(r.code).toBe('r');
    });
});
