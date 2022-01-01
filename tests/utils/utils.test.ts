import {
    separateFEN,
    stringifyFEN,
    convertRowToArray,
    parsePlacementToMap,
    filterAndSortPositionsToArray,
    splitBoardMapToArray,
    rebuildPlacementFromMap,
    shiftChar,
    FEN,
} from '../../src/utils/utils';

describe('separateFEN & stringifyFEN', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    let separated: FEN;
    test('separateFEN', () => {
        separated = separateFEN(fen);
        expect(separated.piecePlacement).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        expect(separated.activeColor).toBe('w');
        expect(separated.castlingAvailability).toBe('KQkq');
        expect(separated.enPassantTargetSquare).toBe('-');
        expect(separated.halfMoveClock).toEqual(0);
        expect(separated.fullMoveNumber).toEqual(1);
    });

    test('stringifyFEN', () => {
        expect(stringifyFEN(separated)).toBe(fen);
    });
});

describe('convertRowToArray', () => {
    test('converts filled row', () => {
        const row = 'rnbqkbnr';
        expect(convertRowToArray(row)).toEqual(['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']);
    });
    test('converts empty row', () => {
        const row = '8';
        expect(convertRowToArray(row)).toEqual(['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x']);
    });
    test('converts various semi-filled rows', () => {
        const one = 'p7';
        const two = 'pp6';
        const three = 'ppp5';
        const four = 'pppp4';
        const five = 'ppppp3';
        const six = 'pppppp2';
        const seven = 'ppppppp1';
        expect(convertRowToArray(one)).toEqual(['p', 'x', 'x', 'x', 'x', 'x', 'x', 'x']);
        expect(convertRowToArray(two)).toEqual(['p', 'p', 'x', 'x', 'x', 'x', 'x', 'x']);
        expect(convertRowToArray(three)).toEqual(['p', 'p', 'p', 'x', 'x', 'x', 'x', 'x']);
        expect(convertRowToArray(four)).toEqual(['p', 'p', 'p', 'p', 'x', 'x', 'x', 'x']);
        expect(convertRowToArray(five)).toEqual(['p', 'p', 'p', 'p', 'p', 'x', 'x', 'x']);
        expect(convertRowToArray(six)).toEqual(['p', 'p', 'p', 'p', 'p', 'p', 'x', 'x']);
        expect(convertRowToArray(seven)).toEqual(['p', 'p', 'p', 'p', 'p', 'p', 'p', 'x']);
        const oone = '7p';
        const otwo = '6pp';
        const othr = '5ppp';
        const ofou = '4pppp';
        const ofiv = '3ppppp';
        const osix = '2pppppp';
        const osev = '1ppppppp';
        expect(convertRowToArray(oone)).toEqual(['x', 'x', 'x', 'x', 'x', 'x', 'x', 'p']);
        expect(convertRowToArray(otwo)).toEqual(['x', 'x', 'x', 'x', 'x', 'x', 'p', 'p']);
        expect(convertRowToArray(othr)).toEqual(['x', 'x', 'x', 'x', 'x', 'p', 'p', 'p']);
        expect(convertRowToArray(ofou)).toEqual(['x', 'x', 'x', 'x', 'p', 'p', 'p', 'p']);
        expect(convertRowToArray(ofiv)).toEqual(['x', 'x', 'x', 'p', 'p', 'p', 'p', 'p']);
        expect(convertRowToArray(osix)).toEqual(['x', 'x', 'p', 'p', 'p', 'p', 'p', 'p']);
        expect(convertRowToArray(osev)).toEqual(['x', 'p', 'p', 'p', 'p', 'p', 'p', 'p']);
        const multi = 'p2p3p';
        expect(convertRowToArray(multi)).toEqual(['p', 'x', 'x', 'p', 'x', 'x', 'x', 'p']);
    });
});

describe('shiftChar', () => {
    const char = 'c';
    test('shifts up', () => {
        expect(shiftChar(char, 1)).toBe('d');
        expect(shiftChar(char, 2)).toBe('e');
    });
    test('shifts down', () => {
        expect(shiftChar(char, -1)).toBe('b');
        expect(shiftChar(char, -2)).toBe('a');
    });
    test('does nothing with shift 0', () => {
        expect(shiftChar(char, 0)).toBe('c');
    });
});
