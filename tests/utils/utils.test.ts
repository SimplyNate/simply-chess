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

describe('parsePlacementToMap', () => {
    test('parses fen string to map', () => {
        const placement = 'rnbqkb1r/pp2pppp/5n2/2pp4/3P4/2N1PP2/PPP3PP/R1BQKBNR';
        const expectation = {
            'a-8': 'r', 'b-8': 'n', 'c-8': 'b', 'd-8': 'q', 'e-8': 'k', 'f-8': 'b', 'g-8': 'x', 'h-8': 'r',
            'a-7': 'p', 'b-7': 'p', 'c-7': 'x', 'd-7': 'x', 'e-7': 'p', 'f-7': 'p', 'g-7': 'p', 'h-7': 'p',
            'a-6': 'x', 'b-6': 'x', 'c-6': 'x', 'd-6': 'x', 'e-6': 'x', 'f-6': 'n', 'g-6': 'x', 'h-6': 'x',
            'a-5': 'x', 'b-5': 'x', 'c-5': 'p', 'd-5': 'p', 'e-5': 'x', 'f-5': 'x', 'g-5': 'x', 'h-5': 'x',
            'a-4': 'x', 'b-4': 'x', 'c-4': 'x', 'd-4': 'P', 'e-4': 'x', 'f-4': 'x', 'g-4': 'x', 'h-4': 'x',
            'a-3': 'x', 'b-3': 'x', 'c-3': 'N', 'd-3': 'x', 'e-3': 'P', 'f-3': 'P', 'g-3': 'x', 'h-3': 'x',
            'a-2': 'P', 'b-2': 'P', 'c-2': 'P', 'd-2': 'x', 'e-2': 'x', 'f-2': 'x', 'g-2': 'P', 'h-2': 'P',
            'a-1': 'R', 'b-1': 'x', 'c-1': 'B', 'd-1': 'Q', 'e-1': 'K', 'f-1': 'B', 'g-1': 'N', 'h-1': 'R',
        };
        expect(parsePlacementToMap(placement)).toEqual(expectation);
    });
});

describe('filterAndSortPositionsToArray', () => {
    test('returns a filtered and sorted array by letter', () => {
        const positions = ['a-1', 'b-1', 'c-1', 'd-1', 'e-1', 'f-1', 'g-1', 'h-1', 'd-2', 'c-2', 'b-2', 'f-2', 'h-2', 'a-2', 'e-2', 'g-2'];
        const expectation = ['a-2', 'b-2', 'c-2', 'd-2', 'e-2', 'f-2', 'g-2', 'h-2'];
        expect(filterAndSortPositionsToArray(positions, '2')).toEqual(expectation);
    });
});

describe('splitBoardMapToArray', () => {
    test('splits board into sorted nested array of positions');
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
