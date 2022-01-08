import { Chess } from '../../src/engine/Chess';
import { parsePlacementToMap, separateFEN } from '../../src/utils/utils';

describe('constructor', () => {
    test('creates default chess object as starting position', () => {
        const chess = new Chess();
        const expectedFen = separateFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        expect(chess.fen).toEqual(expectedFen);
        const expectedBoard = parsePlacementToMap(expectedFen.piecePlacement);
        expect(chess.boardMap).toEqual(expectedBoard);
        expect(chess.kings.k.position).toBe('e-8');
        expect(chess.kings.K.position).toBe('e-1');
        expect(Object.keys(chess.piecesByLocation).length).toEqual(32);
        expect(chess.piecesByColor.light.length).toEqual(16);
        expect(chess.piecesByColor.dark.length).toEqual(16);
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('checkmate on light', () => {
        const chess = new Chess('4k3/8/8/8/8/5b2/6q1/6K1 w - - 0 1');
        expect(chess.checkStatus).toBe('light');
        expect(chess.checkMateStatus).toBeTruthy();
    });
    test('checkmate on dark', () => {
        const chess = new Chess('7R/4k3/4Q3/8/8/4R3/8/2K5 b - - 0 1');
        expect(chess.checkStatus).toBe('dark');
        expect(chess.checkMateStatus).toBeTruthy();
    });
    test('check dark not mate', () => {
        const chess = new Chess('2q4R/4k3/4Q3/8/8/4R3/8/1K6 b - - 0 1');
        expect(chess.checkStatus).toBe('dark');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['c-8']).toBeDefined();
        // @ts-ignore
        expect(chess.piecesByLocation['c-8'].legalMoves.length).toEqual(1);
        // @ts-ignore
        expect(chess.piecesByLocation['c-8'].legalMoves[0]).toBe('e-6');
    });
});

describe('updateCastling', () => {

});

describe('updateCheckStatus', () => {

});

describe('updateCheckMate', () => {

});
