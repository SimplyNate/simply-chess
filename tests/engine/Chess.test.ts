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

describe('Full game test', () => {
    const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    test('engine constructs starting positions', () => {
        expect(chess.fenString).toBe(startingFen);
        expect(Object.keys(chess.piecesByLocation).length).toEqual(32);
        expect(chess.kings.k).toBeDefined();
        expect(chess.kings.K).toBeDefined();
        expect(chess.piecesByColor.light.length).toBe(16);
        expect(chess.piecesByColor.dark.length).toBe(16);
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('P b2 to b4', () => {
        chess.move('b-2', 'b-4');
        expect(chess.fenString).toBe('rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('p c7 to c5', () => {
        chess.move('c-7', 'c-5');
        expect(chess.fenString).toBe('rnbqkbnr/pp1ppppp/8/2p5/1P6/8/P1PPPPPP/RNBQKBNR w KQkq c6 0 2');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('P b4 to b5', () => {
        chess.move('b-4', 'b-5');
        expect(chess.fenString).toBe('rnbqkbnr/pp1ppppp/8/1Pp5/8/8/P1PPPPPP/RNBQKBNR b KQkq - 0 2');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('p a7 to a5', () => {
        chess.move('a-7', 'a-5');
        expect(chess.fenString).toBe('rnbqkbnr/1p1ppppp/8/pPp5/8/8/P1PPPPPP/RNBQKBNR w KQkq a6 0 3');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('P b5 to a6 en passant capture', () => {
        chess.move('b-5', 'a-6');
        expect(chess.fenString).toBe('rnbqkbnr/1p1ppppp/P7/2p5/8/8/P1PPPPPP/RNBQKBNR b KQkq a6 0 3');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
});
