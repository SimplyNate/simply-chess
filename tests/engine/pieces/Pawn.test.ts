import Pawn from '../../../src/engine/pieces/Pawn';
import { parsePlacementToMap, separateFEN } from '../../../src/utils/utils';

describe('Pawn', function () {
    test('constructs light correctly in starting position', () => {
        const pawn = new Pawn('light', 'a-2');
        expect(pawn.color).toBe('light');
        expect(pawn.position).toBe('a-2');
        expect(pawn.moveType).toBe('consecutive');
        expect(pawn.rank).toEqual(2);
        expect(pawn.file).toBe('a');
        expect(pawn.direction).toEqual(1);
        expect(pawn.inStartingPosition).toBeTruthy();
    });
    test('constructs light correctly not in starting position', () => {
        const pawn = new Pawn('light', 'a-3');
        expect(pawn.rank).toEqual(3);
        expect(pawn.inStartingPosition).toBeFalsy();
    });
    test('constructs dark correctly in starting position', () => {
        const pawn = new Pawn('dark', 'a-7');
        expect(pawn.rank).toEqual(7);
        expect(pawn.direction).toEqual(-1);
        expect(pawn.inStartingPosition).toBeTruthy();
    });
    test('constructs dark correctly not in starting position', () => {
        const pawn = new Pawn('dark', 'a-6');
        expect(pawn.rank).toEqual(6);
        expect(pawn.inStartingPosition).toBeFalsy();
    });
    // nonsense fen string for testing purposes only
    const testFEN = 'rnbqkbnr/1p6/4pp2/pP3p1p/1pPp2P1/2P3p1/PP1P1P1P/RNBQKBNR w KQkq a6 0 1';
    const fen = separateFEN(testFEN);
    const boardMap = parsePlacementToMap(fen.piecePlacement);
    test('moves 2 places forward in starting position', () => {
        const pawn = new Pawn('light', 'a-2');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves).toBe(pawn.legalMoves);
        expect(moves.sort()).toEqual(['a-3', 'a-4'].sort());
    });
    test('moves 1 place forward in starting position', () => {
        const pawn = new Pawn('light', 'b-2');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves.sort()).toEqual(['b-3'].sort());
    });
    test('capture left, capture right, no move forward', () => {
        const pawn = new Pawn('light', 'c-3');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves.sort()).toEqual(['b-4', 'd-4'].sort());
    });
    test('en passant left', () => {
        const pawn = new Pawn('light', 'b-5');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves.sort()).toEqual(['b-6', 'a-6'].sort());
    });
    test('en passant right', () => {
        const tf = 'rnbqkbnr/1p6/4pp2/pP3p1p/1pPp2P1/2P3p1/PP1P1P1P/RNBQKBNR w KQkq d5 0 1';
        const f = separateFEN(tf);
        const bm = parsePlacementToMap(f.piecePlacement);
        const pawn = new Pawn('light', 'c-4');
        const moves = pawn.getLegalMoves(bm, f);
        expect(moves.sort()).toEqual(['c-5', 'd-5'].sort());
    });
    test('capture right, 2 moves forward', () => {
        const pawn = new Pawn('light', 'f-2');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves.sort()).toEqual(['f-3', 'f-4', 'g-3'].sort());
    });
    test('capture left, 2 moves forward', () => {
        const pawn = new Pawn('light', 'h-2');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves.sort()).toEqual(['g-3', 'h-3', 'h-4'].sort());
    });
    test('capture left and right, move up one', () => {
        const pawn = new Pawn('light', 'g-4');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves.sort()).toEqual(['g-5', 'f-5', 'h-5'].sort());
    });

    // test names assume flipped board
    const darkFen = 'rnbqkbnr/p1p1p1pp/1P3p2/1p2PpP1/P1P3pP/2PP4/4P1P1/RNBQKBNR w KQkq h3 0 1';
    const dfen = separateFEN(darkFen);
    const darkBM = parsePlacementToMap(dfen.piecePlacement);
    test('dark moves 2 places forward in starting position', () => {
        const pawn = new Pawn('dark', 'h-7');
        const moves = pawn.getLegalMoves(darkBM, dfen);
        expect(moves.sort()).toEqual(['h-6', 'h-5'].sort());
    });
    test('dark moves 1 place forward in starting position', () => {
        const pawn = new Pawn('dark', 'g-7');
        const moves = pawn.getLegalMoves(darkBM, dfen);
        expect(moves.sort()).toEqual(['g-6'].sort());
    });
    test('dark capture left, capture right, no move forward', () => {
        const pawn = new Pawn('dark', 'f-6');
        const moves = pawn.getLegalMoves(darkBM, dfen);
        expect(moves.sort()).toEqual(['g-5', 'e-5'].sort());
    });
    test('dark en passant left', () => {
        const pawn = new Pawn('dark', 'g-4');
        const moves = pawn.getLegalMoves(darkBM, dfen);
        expect(moves.sort()).toEqual(['h-3', 'g-3'].sort());
    });
    test('dark en passant right', () => {
        const tf = 'rnbqkbnr/p1p1p1pp/1P3p2/1p2PpP1/P1P3pP/2PP4/4P1P1/RNBQKBNR w KQkq e4 0 1';
        const f = separateFEN(tf);
        const bm = parsePlacementToMap(f.piecePlacement);
        const pawn = new Pawn('dark', 'f-5');
        const moves = pawn.getLegalMoves(bm, f);
        expect(moves.sort()).toEqual(['f-4', 'e-4'].sort());
    });
    test('dark capture right, 2 moves forward', () => {
        const pawn = new Pawn('dark', 'c-7');
        const moves = pawn.getLegalMoves(darkBM, dfen);
        expect(moves.sort()).toEqual(['c-6', 'c-5', 'b-6'].sort());
    });
    test('dark capture left, 2 moves forward', () => {
        const pawn = new Pawn('dark', 'a-7');
        const moves = pawn.getLegalMoves(darkBM, dfen);
        expect(moves.sort()).toEqual(['b-6', 'a-6', 'a-5'].sort());
    });
    test('dark capture left and right, move up one', () => {
        const pawn = new Pawn('dark', 'b-5');
        const moves = pawn.getLegalMoves(darkBM, dfen);
        expect(moves.sort()).toEqual(['c-4', 'b-4', 'a-4'].sort());
    });
});
