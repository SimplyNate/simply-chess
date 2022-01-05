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
    const testFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const fen = separateFEN(testFEN);
    const boardMap = parsePlacementToMap(fen.piecePlacement);
    test('generates legal moves for light piece, starting position, no capture, 2 forward moves', () => {
        const pawn = new Pawn('light', 'a-2');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves).toBe(pawn.legalMoves);
        expect(moves).toEqual(['a-3', 'a-4']);
    });
    test('generates legal moves for light piece, starting position, no capture, 1 forward moves', () => {
        const pawn = new Pawn('light', 'a-2');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves).toEqual(['a-3']);
    });
    test('generates legal moves for light piece, starting position, no capture, 0 forward moves', () => {
        const pawn = new Pawn('light', 'a-2');
        const moves = pawn.getLegalMoves(boardMap, fen);
        expect(moves).toEqual([]);
    });
    test('generates legal moves for light piece, starting position, l capture, 2 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, l capture, 1 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, l capture, 0 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, r capture, 2 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, r capture, 1 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, r capture, 0 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, lr capture, 2 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, lr capture, 1 forward moves', () => {

    });
    test('generates legal moves for light piece, starting position, lr capture, 0 forward moves', () => {

    });
    test('generates legal moves for light piece, no starting position, no capture, 1 forward move', () => {

    });
    test('generates legal moves for light piece, no starting position, no capture, 0 forward move', () => {

    });
    test('generates legal moves for light piece, no starting position, l capture, 1 forward move', () => {

    });
    test('generates legal moves for light piece, no starting position, l capture, 0 forward move', () => {

    });
    test('generates legal moves for light piece, no starting position, r capture, 1 forward move', () => {

    });
    test('generates legal moves for light piece, no starting position, r capture, 0 forward move', () => {

    });
    test('generates legal moves for light piece, no starting position, lr capture, 1 forward move', () => {

    });
    test('generates legal moves for light piece, no starting position, lr capture, 0 forward move', () => {

    });
    test('generates legal moves for dark piece en passant');
});
