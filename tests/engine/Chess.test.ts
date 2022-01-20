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
        expect(chess.piecesByLocation['c-8'].legalMoves?.length).toEqual(1);
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
    test('Q d1 to a4, p d7 defends k', () => {
        chess.move('d-1', 'a-4');
        expect(chess.fenString).toBe('r1b1kb1r/1p1ppp1p/nq5n/2p3p1/Q1P5/B1N5/P2PPPPP/R3KBNR b KQkq - 0 7');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('r a8 to a7', () => {
        chess.move('a-8', 'a-7');
        expect(chess.fenString).toBe('2b1kb1r/rp1ppp1p/nq5n/2p3p1/Q1P5/B1N5/P2PPPPP/R3KBNR w KQk - 0 8');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('K e1 to c1 queen side castle', () => {
        chess.move('e-1', 'c-1');
        expect(chess.fenString).toBe('2b1kb1r/rp1ppp1p/nq5n/2p3p1/Q1P5/B1N5/P2PPPPP/2KR1BNR b k - 0 8');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('b f8 to g7', () => {
        chess.move('f-8', 'g-7');
        expect(chess.fenString).toBe('2b1k2r/rp1pppbp/nq5n/2p3p1/Q1P5/B1N5/P2PPPPP/2KR1BNR w k - 0 9');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('N g1 to f3', () => {
        chess.move('g-1', 'f-3');
        expect(chess.fenString).toBe('2b1k2r/rp1pppbp/nq5n/2p3p1/Q1P5/B1N2N2/P2PPPPP/2KR1B1R b k - 0 9');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('b g7 to c3', () => {
        chess.move('g-7', 'c-3');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp1p/nq5n/2p3p1/Q1P5/B1b2N2/P2PPPPP/2KR1B1R w k - 0 10');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('P g2 to g4', () => {
        chess.move('g-2', 'g-4');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp1p/nq5n/2p3p1/Q1P3P1/B1b2N2/P2PPP1P/2KR1B1R b k g3 0 10');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('n h6 to g4', () => {
        chess.move('h-6', 'g-4');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp1p/nq6/2p3p1/Q1P3n1/B1b2N2/P2PPP1P/2KR1B1R w k - 0 11');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('R h1 to g1', () => {
        chess.move('h-1', 'g-1');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp1p/nq6/2p3p1/Q1P3n1/B1b2N2/P2PPP1P/2KR1BR1 b k - 0 11');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('p h7 to h5', () => {
        chess.move('h-7', 'h-5');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp2/nq6/2p3pp/Q1P3n1/B1b2N2/P2PPP1P/2KR1BR1 w k - 0 12');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('R g1 to g4 capture n', () => {
        chess.move('g-1', 'g-4');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp2/nq6/2p3pp/Q1P3R1/B1b2N2/P2PPP1P/2KR1B2 b k - 0 12');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('p h5 to h4', () => {
        chess.move('h-5', 'h-4');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp2/nq6/2p3p1/Q1P3Rp/B1b2N2/P2PPP1P/2KR1B2 w k - 0 13');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('R g4 to g5 capture p, k cannot castle', () => {
        chess.move('g-4', 'g-5');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp2/nq6/2p3R1/Q1P4p/B1b2N2/P2PPP1P/2KR1B2 b k - 0 13');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
        expect(chess.kings.k.legalMoves?.includes('g-8')).toBeFalsy();
        expect(chess.kings.k.legalMoves).toHaveLength(2);
    });
    test('n a6 to b4', () => {
        chess.move('a-6', 'b-4');
        expect(chess.fenString).toBe('2b1k2r/rp1ppp2/1q6/2p3R1/QnP4p/B1b2N2/P2PPP1P/2KR1B2 w k - 0 14');
        expect(chess.kings.k.legalMoves?.includes('g-8')).toBeFalsy();
        expect(chess.kings.k.legalMoves).toHaveLength(2);
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('R g5 to g8, k in check, 1 legal move for dark to make', () => {
        chess.move('g-5', 'g-8');
        expect(chess.fenString).toBe('2b1k1Rr/rp1ppp2/1q6/2p5/QnP4p/B1b2N2/P2PPP1P/2KR1B2 b - - 0 14');
        expect(chess.kings.k.legalMoves).toHaveLength(0);
        expect(chess.checkStatus).toBe('dark');
        expect(chess.checkMateStatus).toBeFalsy();
        for (const darkPiece of chess.piecesByColor.dark) {
            if (darkPiece.position === 'h-8') {
                expect(darkPiece.legalMoves).toHaveLength(1);
                expect(darkPiece.legalMoves?.includes('g-8')).toBeTruthy();
            }
            else {
                expect(darkPiece.legalMoves).toHaveLength(0);
            }
        }
    });
    test('r h8 to g8 capture R', () => {
        chess.move('h-8', 'g-8');
        expect(chess.fenString).toBe('2b1k1r1/rp1ppp2/1q6/2p5/QnP4p/B1b2N2/P2PPP1P/2KR1B2 w - - 0 15');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.kings.k.legalMoves).toHaveLength(2);
        expect(chess.kings.k.canCastleShort).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toBeDefined();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('N f3 to h4 p capture', () => {
        chess.move('f-3', 'h-4');
        expect(chess.fenString).toBe('2b1k1r1/rp1ppp2/1q6/2p5/QnP4N/B1b5/P2PPP1P/2KR1B2 b - - 0 15');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('n b4 to d3 K in check', () => {
        chess.move('b-4', 'd-3');
        expect(chess.fenString).toBe('2b1k1r1/rp1ppp2/1q6/2p5/Q1P4N/B1bn4/P2PPP1P/2KR1B2 w - - 0 16');
        expect(chess.checkStatus).toBe('light');
        expect(chess.checkMateStatus).toBeTruthy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
        for (const lightPiece of chess.piecesByColor.light) {
            if (lightPiece.position === 'c-1') {
                expect(lightPiece.legalMoves).toHaveLength(1);
                expect(lightPiece.legalMoves?.includes('c-2')).toBeTruthy();
            }
            else if (lightPiece.position === 'e-2') {
                expect(lightPiece.legalMoves).toHaveLength(1);
                expect(lightPiece.legalMoves?.includes('d-3')).toBeTruthy();
            }
            else {
                expect(lightPiece.legalMoves).toHaveLength(0);
            }
        }
    });
    test('P e2 to d3 capture n', () => {
        chess.move('e-2', 'd-3');
        expect(chess.fenString).toBe('2b1k1r1/rp1ppp2/1q6/2p5/Q1P4N/B1bP4/P2P1P1P/2KR1B2 b - - 0 16');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
    });
    test('b c3 to b2, K in check', () => {
        chess.move('c-3', 'b-2');
        expect(chess.fenString).toBe('2b1k1r1/rp1ppp2/1q6/2p5/Q1P4N/B2P4/Pb1P1P1P/2KR1B2 w - - 0 17');
        expect(chess.checkStatus).toBe('none');
        expect(chess.checkMateStatus).toBeFalsy();
        expect(chess.piecesByLocation['d-7'].legalMoves).toHaveLength(0);
        for (const lightPiece of chess.piecesByColor.light) {
            if (lightPiece.position === 'c-1') {
                expect(lightPiece.legalMoves).toHaveLength(2);
                expect(lightPiece.legalMoves?.sort()).toEqual(['b-1', 'c-2']);
            }
            else if (lightPiece.position === 'a-3') {
                expect(lightPiece.legalMoves).toHaveLength(1);
                expect(lightPiece.legalMoves?.includes('b-2')).toBeTruthy();
            }
            else {
                expect(lightPiece.legalMoves).toHaveLength(0);
            }
        }
    });
    test('B a3 to b2');
});
