import { Color, Piece } from '../../../src/engine/pieces/Piece';
import King from '../../../src/engine/pieces/King';
import Pawn from '../../../src/engine/pieces/Pawn';
import Rook from '../../../src/engine/pieces/Rook';
import Knight from '../../../src/engine/pieces/Knight';
import Bishop from '../../../src/engine/pieces/Bishop';
import Queen from '../../../src/engine/pieces/Queen';
import { BoardMap, separateFEN, parsePlacementToMap } from '../../../src/utils/utils';

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

    public testIsMoveCapture(move: string, currentBoard: BoardMap): boolean {
        return this.isMoveCapture(move, currentBoard);
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
    test('filterValidMoves', () => {
        const fen = '3P3P/8/8/2p5/2PQ2P1/8/1P1p4/6P1 w - - 0 1';
        const parsed = separateFEN(fen);
        const boardMap = parsePlacementToMap(parsed.piecePlacement);
        const piece = new TestPiece('light', 'd-4');
        const moves = [
            'd-5', 'd-1', 'c-7', 'b-3', 'a-6', 'e-8', 'f-5', 'g-3', 'g-2', 'h-1', 'c-4', 'b-2', 'g-1', 'g-4', 'd-8', 'h-8',
        ];
        const expectation = ['d-5', 'd-1', 'c-7', 'b-3', 'a-6', 'e-8', 'f-5', 'g-3', 'g-2', 'h-1'];
        const filtered = piece.testFilterValidMoves(moves, boardMap);
        expect(filtered.sort()).toEqual(expectation.sort());
    });
    describe('isValidMovePosition and isMoveCapture', () => {
        const fen = '3P3P/8/8/2p5/2PQ2P1/8/1P1p4/6P1 w - - 0 1';
        const parsed = separateFEN(fen);
        const boardMap = parsePlacementToMap(parsed.piecePlacement);
        const piece = new TestPiece('light', 'd-4');
        test('empty spots should return true', () => {
            expect(piece.testIsValidMovePosition('d-5', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('d-1', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('c-7', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('b-3', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('a-6', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('e-8', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('f-5', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('g-3', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('g-2', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('h-1', boardMap)).toBeTruthy();
        });
        test('enemy spots should return true', () => {
            expect(piece.testIsValidMovePosition('c-5', boardMap)).toBeTruthy();
            expect(piece.testIsValidMovePosition('d-2', boardMap)).toBeTruthy();
        });
        test('friendly spots should return false', () => {
            expect(piece.testIsValidMovePosition('c-4', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('b-2', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('g-1', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('g-4', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('d-8', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('h-8', boardMap)).toBeFalsy();
        });
        test('non-existent points should return false', () => {
            expect(piece.testIsValidMovePosition('', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('A-4', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('A4', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('i40', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('-43', boardMap)).toBeFalsy();
            expect(piece.testIsValidMovePosition('~/\t', boardMap)).toBeFalsy();
        });
        test('light on dark returns true', () => {
            expect(piece.testIsMoveCapture('c-5', boardMap)).toBeTruthy();
            expect(piece.testIsMoveCapture('d-2', boardMap)).toBeTruthy();
        });
        test('light on light returns false', () => {
            expect(piece.testIsMoveCapture('c-4', boardMap)).toBeFalsy();
            expect(piece.testIsMoveCapture('b-2', boardMap)).toBeFalsy();
            expect(piece.testIsMoveCapture('g-1', boardMap)).toBeFalsy();
            expect(piece.testIsMoveCapture('e-6', boardMap)).toBeFalsy();
            expect(piece.testIsMoveCapture('f-1', boardMap)).toBeFalsy();
        });
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
        test('straight moves no blocks', () => {
            const fen = '8/8/8/8/3R4/8/8/8 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, true, false);
            expect(moves.sort()).toEqual(
                ['a-4', 'b-4', 'c-4', 'e-4', 'f-4', 'g-4', 'h-4',
                    'd-1', 'd-2', 'd-3', 'd-5', 'd-6', 'd-7', 'd-8'].sort());
        });
        test('straight moves with blocks as friendlies', () => {
            const fen = '3P4/8/8/8/1P1R2P1/3P4/8/8 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, true, false);
            expect(moves.sort()).toEqual(
                ['c-4', 'e-4', 'f-4', 'd-7', 'd-6', 'd-5'].sort());
        });
        test('straight moves with blocks as enemies', () => {
            const fen = '3p4/8/8/8/1p1R2p1/3p4/8/8 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, true, false);
            expect(moves.sort()).toEqual(
                ['c-4', 'e-4', 'f-4', 'd-7', 'd-6', 'd-5', 'b-4', 'd-3', 'd-8', 'g-4'].sort());
        });
        test('diagonal moves no blocks', () => {
            const fen = '8/8/8/8/3B4/8/8/8 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, false, true);
            expect(moves.sort()).toEqual(
                ['a-1', 'a-7', 'b-2', 'b-6', 'c-3', 'c-5', 'e-3', 'e-5', 'f-2', 'f-6', 'g-1', 'g-7', 'h-8'].sort());
        });
        test('diagonal moves with blocks as friendlies', () => {
            const fen = '7P/8/8/2P5/3B4/8/1P6/6P1 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, false, true);
            expect(moves.sort()).toEqual(
                ['c-3', 'e-3', 'e-5', 'f-2', 'f-6', 'g-7'].sort());
        });
        test('diagonal moves with blocks as enemies', () => {
            const fen = '7p/8/8/2p5/3B4/8/1p6/6p1 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, false, true);
            expect(moves.sort()).toEqual(
                ['c-3', 'e-3', 'e-5', 'f-2', 'f-6', 'g-7', 'b-2', 'c-5', 'g-1', 'h-8'].sort());
        });
        test('combined no blocks', () => {
            const fen = '8/8/8/8/3Q4/8/8/8 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, true, true);
            expect(moves.sort()).toEqual(
                ['a-4', 'b-4', 'c-4', 'e-4', 'f-4', 'g-4', 'h-4', 'd-1', 'd-2', 'd-3', 'd-5', 'd-6', 'd-7', 'd-8',
                    'a-1', 'a-7', 'b-2', 'b-6', 'c-3', 'c-5', 'e-3', 'e-5', 'f-2', 'f-6', 'g-1', 'g-7', 'h-8'].sort());
        });
        test('combined with blocks as friendly', () => {
            const fen = '3P3P/8/8/2P5/2PQ2P1/8/1P1P4/6P1 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, true, true);
            expect(moves.sort()).toEqual(
                ['c-3', 'd-3', 'd-5', 'd-6', 'd-7', 'e-3', 'e-4', 'e-5', 'f-2', 'f-4', 'f-6', 'g-7'].sort());
        });
        test('combined with blocks as enemies', () => {
            const fen = '3p3p/8/8/2p5/2pQ2p1/8/1p1p4/6p1 w - - 0 1';
            const parsed = separateFEN(fen);
            const boardMap = parsePlacementToMap(parsed.piecePlacement);
            const piece = new TestPiece('light', 'd-4');
            const moves = piece.testConsecutiveMoveSearch(boardMap, true, true);
            expect(moves.sort()).toEqual(
                ['c-3', 'd-3', 'd-5', 'd-6', 'd-7', 'e-3', 'e-4', 'e-5', 'f-2', 'f-4', 'f-6', 'g-7',
                    'b-2', 'c-4', 'c-5', 'd-2', 'd-8', 'g-1', 'g-4', 'h-8'].sort());
        });
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
