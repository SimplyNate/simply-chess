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
        expect(chess.fenString).toBe('rnbqkbnr/1p1ppppp/P7/2p5/8/8/P1PPPPPP/RNBQKBNR b KQkq - 0 3');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.boardMap['a-5']).toBe('x');
        expect(chess.piecesByLocation['a-5']).toBeUndefined();
    });
    test('n b8 to a6 P capture', () => {
        chess.move('b-8', 'a-6');
        expect(chess.fenString).toBe('r1bqkbnr/1p1ppppp/n7/2p5/8/8/P1PPPPPP/RNBQKBNR w KQkq - 0 4');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['a-6'].code).toBe('n');
        expect(chess.piecesByLocation['b-8']).toBeUndefined();
    });
    test('B c1 to a3', () => {
        chess.move('c-1', 'a-3');
        expect(chess.fenString).toBe('r1bqkbnr/1p1ppppp/n7/2p5/8/B7/P1PPPPPP/RN1QKBNR b KQkq - 0 4');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['a-3'].code).toBe('B');
        expect(chess.piecesByLocation['c-1']).toBeUndefined();
    });
    test('q d8 to b6', () => {
        chess.move('d-8', 'b-6');
        expect(chess.fenString).toBe('r1b1kbnr/1p1ppppp/nq6/2p5/8/B7/P1PPPPPP/RN1QKBNR w KQkq - 0 5');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('P c2 to c4', () => {
        chess.move('c-2', 'c-4');
        expect(chess.fenString).toBe('r1b1kbnr/1p1ppppp/nq6/2p5/2P5/B7/P2PPPPP/RN1QKBNR b KQkq c3 0 5');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('p g7 to g5', () => {
        chess.move('g-7', 'g-5');
        expect(chess.fenString).toBe('r1b1kbnr/1p1ppp1p/nq6/2p3p1/2P5/B7/P2PPPPP/RN1QKBNR w KQkq g6 0 6');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('N b1 to c3', () => {
        chess.move('b-1', 'c-3');
        expect(chess.fenString).toBe('r1b1kbnr/1p1ppp1p/nq6/2p3p1/2P5/B1N5/P2PPPPP/R2QKBNR b KQkq - 0 6');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('n g8 to h6', () => {
        chess.move('g-8', 'c-3');
        expect(chess.fenString).toBe('r1b1kb1r/1p1ppp1p/nq5n/2p3p1/2P5/B1N5/P2PPPPP/R2QKBNR w KQkq - 0 7');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('Q d1 to a4', () => {
        chess.move('d-1', 'a-4');
        expect(chess.fenString).toBe('r1b1kb1r/1p1ppp1p/nq5n/2p3p1/Q1P5/B1N5/P2PPPPP/R3KBNR b KQkq - 0 7');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('r a8 to a7', () => {
        chess.move('a-8', 'a-7');
        expect(chess.fenString).toBe('2b1kb1r/rp1ppp1p/nq5n/2p3p1/Q1P5/B1N5/P2PPPPP/R3KBNR w KQk - 0 8');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
    test('K e1 to c1 queen side castle', () => {
        chess.move('e-1', 'c-1');
        expect(chess.fenString).toBe('2b1kb1r/rp1ppp1p/nq5n/2p3p1/Q1P5/B1N5/P2PPPPP/2KR1BNR b k - 0 8');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
    });
});
