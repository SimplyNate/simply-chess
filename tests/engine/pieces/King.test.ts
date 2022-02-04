import King from '../../../src/engine/pieces/King';
import { BoardMap, parsePlacementToMap, separateFEN, shiftChar } from '../../../src/utils/utils';

function findKing(boardMap: BoardMap) {
    const kings = { k: '', K: '' };
    for (const key of Object.keys(boardMap)) {
        if (boardMap[key] === 'k') {
            kings.k = key;
        }
        else if (boardMap[key] === 'K') {
            kings.K = key;
        }
    }
    return kings;
}

function generateTestingEnvironment(fenString: string) {
    const fen = separateFEN(fenString);
    const board = parsePlacementToMap(fen.piecePlacement);
    const kingPositions = findKing(board);
    const K = new King('light', kingPositions.K, '-');
    const k = new King('dark', kingPositions.k, '-');
    return { K, k, board, fen };
}

describe('King', () => {
    test('constructs correctly', () => {
        const king = new King('light', 'e-1', 'KQkq');
        expect(king.name).toBe('King');
        expect(king.moveType).toBe('consecutive');
        expect(king.canCastleLong).toBeTruthy();
        expect(king.canCastleShort).toBeTruthy();
        const kingNoShort = new King('light', 'e-1', 'Qkq');
        expect(kingNoShort.canCastleShort).toBeFalsy();
        expect(kingNoShort.canCastleLong).toBeTruthy();
        const kingNoLong = new King('light', 'e-1', 'Kkq');
        expect(kingNoLong.canCastleShort).toBeTruthy();
        expect(kingNoLong.canCastleLong).toBeFalsy();
        const kingNoCastle = new King('light', 'e-1', 'kq');
        expect(kingNoCastle.canCastleShort).toBeFalsy();
        expect(kingNoCastle.canCastleLong).toBeFalsy();
        const dking = new King('dark', 'e-8', 'KQkq');
        expect(dking.canCastleLong).toBeTruthy();
        expect(dking.canCastleShort).toBeTruthy();
        const dkingNoShort = new King('dark', 'e-8', 'KQq');
        expect(dkingNoShort.canCastleLong).toBeTruthy();
        expect(dkingNoShort.canCastleShort).toBeFalsy();
        const dkingNoLong = new King('dark', 'e-8', 'KQk');
        expect(dkingNoLong.canCastleLong).toBeFalsy();
        expect(dkingNoLong.canCastleShort).toBeTruthy();
        const dkingNoCastle = new King('dark', 'e-8', 'KQ');
        expect(dkingNoCastle.canCastleLong).toBeFalsy();
        expect(dkingNoCastle.canCastleShort).toBeFalsy();
    });
    describe('getLegalMoves', () => {
        const fen = 'r3k2r/8/8/8/8/8/8/R3K2R w Kq - 0 1';
        const parsed = separateFEN(fen);
        const board = parsePlacementToMap(parsed.piecePlacement);
        const K = new King('light', 'e-1', 'K');
        const k = new King('dark', 'e-8', 'q');
        test('long castle available', () => {
            const moves = K.getLegalMoves(board, parsed);
            const expectation = ['d-1', 'd-2', 'e-2', 'f-2', 'f-1', 'g-1'].sort();
            expect(moves.sort()).toEqual(expectation);
        });
        test('short castle available', () => {
            const moves = k.getLegalMoves(board, parsed);
            const expectation = ['d-8', 'd-7', 'e-7', 'f-7', 'f-8', 'c-8'].sort();
            expect(moves.sort()).toEqual(expectation);
        });
        test('k one legal move', () => {
            const { K, k, board, fen } = generateTestingEnvironment('2Q5/8/8/1k1P4/8/R3B3/PPP1PPP1/R3KBN1 b - - 2 21');
            const darkMoves = k.getLegalMoves(board, fen);
            expect(darkMoves).toHaveLength(1);
            expect(darkMoves.includes('b-4')).toBeTruthy();
        });
        test('k one legal move in front of P', () => {
            const { K, k, board, fen } = generateTestingEnvironment('Q3k3/8/5P1p/8/7P/8/8/1NKR4 b - - 2 51');
            const darkMoves = k.getLegalMoves(board, fen);
            expect(darkMoves).toHaveLength(1);
            expect(darkMoves.includes('f-7')).toBeTruthy();
        });
    });
    describe('getLegalMoves castling situations', () => {
        test('castle possible but not available', () => {
            const { K, k, board, fen } = generateTestingEnvironment('3rk2r/8/8/8/8/8/8/R3KR2 w Qk - 0 1');
            const lightMoves = K.getLegalMoves(board, fen);
            const darkMoves = k.getLegalMoves(board, fen);
            expect(lightMoves.includes('c-1')).toBeFalsy();
            expect(lightMoves.includes('d-1')).toBeFalsy();
            expect(darkMoves.includes('f-8')).toBeFalsy();
            expect(darkMoves.includes('g-8')).toBeFalsy();
        });
        test('castle possible but would be in check', () => {
            const { K, k, board, fen } = generateTestingEnvironment('2r1k2r/8/8/8/8/8/8/R3K1R1 w Qk - 0 1');
            const lightMoves = K.getLegalMoves(board, fen);
            const darkMoves = k.getLegalMoves(board, fen);
            expect(lightMoves.includes('c-1')).toBeFalsy();
            expect(lightMoves.includes('d-1')).toBeTruthy();
            expect(darkMoves.includes('f-8')).toBeTruthy();
            expect(darkMoves.includes('g-8')).toBeFalsy();
        });
        test('Both castle available, both blocked by bishops', () => {
            const { K, k, board, fen } = generateTestingEnvironment('r3k2r/8/B6B/8/8/b6b/8/R3K2R w KQkq - 0 1');
            const lightMoves = K.getLegalMoves(board, fen);
            const darkMoves = k.getLegalMoves(board, fen);
            expect(lightMoves.includes('f-1')).toBeFalsy();
            expect(lightMoves.includes('g-1')).toBeFalsy();
            expect(lightMoves.includes('c-1')).toBeFalsy();
            expect(lightMoves.includes('d-1')).toBeTruthy();
            expect(darkMoves.includes('f-8')).toBeFalsy();
            expect(darkMoves.includes('g-8')).toBeFalsy();
            expect(darkMoves.includes('d-8')).toBeTruthy();
            expect(darkMoves.includes('c-8')).toBeFalsy();
        });
        test('Both castle available, blocked by queen', () => {
            const { K, k, board, fen } = generateTestingEnvironment('r3k2r/8/8/2Q5/6q1/8/8/R3K2R w KQkq - 0 1');
            const lightMoves = K.getLegalMoves(board, fen);
            const darkMoves = k.getLegalMoves(board, fen);
            expect(lightMoves.includes('c-1')).toBeFalsy();
            expect(lightMoves.includes('g-1')).toBeFalsy();
            expect(darkMoves.includes('c-8')).toBeFalsy();
            expect(darkMoves.includes('g-8')).toBeFalsy();
        });
        test('Both castle available, blocked by knights', () => {
            const { K, k, board, fen } = generateTestingEnvironment('r3k2r/8/3N2N1/8/8/3n2n1/8/R3K2R w KQkq - 0 1');
            const lightMoves = K.getLegalMoves(board, fen);
            const darkMoves = k.getLegalMoves(board, fen);
            expect(darkMoves.includes('c-8')).toBeFalsy();
            expect(darkMoves.includes('g-8')).toBeFalsy();
            expect(lightMoves.includes('c-1')).toBeFalsy();
            expect(lightMoves.includes('g-1')).toBeFalsy();
        });
        test('Both castle available, blocked by pawns', () => {
            const { K, k, board, fen } = generateTestingEnvironment('r3k2r/2P2P2/8/8/8/8/2p2p2/R3K2R w KQkq - 0 1');
            const darkMoves = k.getLegalMoves(board, fen);
            const lightMoves = K.getLegalMoves(board, fen);
            expect(darkMoves.includes('c-8')).toBeFalsy();
            expect(darkMoves.includes('g-8')).toBeFalsy();
            expect(lightMoves.includes('c-1')).toBeFalsy();
            expect(lightMoves.includes('g-1')).toBeFalsy();
        });
    });
    const noCastle = 'rp2kp1r/8/8/8/8/8/8/R1P1K1PR w - - 0 1';
    const castle = 'r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1';
    const noCastleFen = separateFEN(noCastle);
    const castleFen = separateFEN(castle);
    const noCastleBoard = parsePlacementToMap(noCastleFen.piecePlacement);
    const castleBoard = parsePlacementToMap(castleFen.piecePlacement);
    const king = new King('light', 'e-1', 'KQ');
    const blackKing = new King('dark', 'e-8', 'kq');
    test('canPerformCastleShort', () => {
        expect(king.canPerformCastleShort(castleBoard)).toBeTruthy();
        expect(king.canPerformCastleShort(noCastleBoard)).toBeFalsy();
        expect(blackKing.canPerformCastleShort(castleBoard)).toBeTruthy();
        expect(blackKing.canPerformCastleShort(noCastleBoard)).toBeFalsy();
    });
    test('canPerformCastleLong', () => {
        expect(king.canPerformCastleLong(castleBoard)).toBeTruthy();
        expect(king.canPerformCastleLong(noCastleBoard)).toBeFalsy();
        expect(blackKing.canPerformCastleLong(castleBoard)).toBeTruthy();
        expect(blackKing.canPerformCastleLong(noCastleBoard)).toBeFalsy();
    });
    describe('findAttackersFromPosition', () => {
        const possibleKnightPositions = [
            `${shiftChar('d', 1)}-${4 + 2}`,
            `${shiftChar('d', -1)}-${4 + 2}`,
            `${shiftChar('d', 2)}-${4 + 1}`,
            `${shiftChar('d', -2)}-${4 + 1}`,
            `${shiftChar('d', 2)}-${4 - 1}`,
            `${shiftChar('d', -2)}-${4 - 1}`,
            `${shiftChar('d', 1)}-${4 - 2}`,
            `${shiftChar('d', -1)}-${4 - 2}`,
        ];
        test('should return true with attacking piece', () => {
            const { K, board } = generateTestingEnvironment('rp1k1p1r/8/8/8/3K4/7B/4n3/R1P1R1P1 w - - 0 1');
            expect(K.findAttackersFromPositions(possibleKnightPositions, board, 'n')).toBeTruthy();
            expect(K.isInCheck).toBeTruthy();
            expect(K.checkBy).toBe('e-2');
        });
        test('should return false when no attacking piece', () => {
            const { K, board } = generateTestingEnvironment('rp1k1p1r/8/8/8/3K4/7B/5n2/R1P1R1P1 w - - 0 1');
            expect(K.findAttackersFromPositions(possibleKnightPositions, board, 'n')).toBeFalsy();
            expect(K.isInCheck).toBeFalsy();
            expect(K.checkBy).toBeNull();
        });
    });
    describe('checkDirection', () => {
        const { K, board } = generateTestingEnvironment('1p1k1p1r/8/5b2/8/r2K4/7B/8/R1P1R1P1 w - - 0 1');
        test('should return true for an x position', () => {
            expect(K.checkDirection(board, 'c-4', 'r', 'q')).toBeTruthy();
        });
        test('should return false if position does not exist', () => {
            expect(K.checkDirection(board, 'i-4', 'r', 'q')).toBeFalsy();
        });
        test('should return false if position exists, but non-attacking piece inhabits position', () => {
            expect(K.checkDirection(board, 'd-8', 'r', 'q')).toBeFalsy();
        });
        test('should return false and flip check bit if position exists and attacking piece inhabits position', () => {
            expect(K.checkDirection(board, 'a-4', 'r', 'q')).toBeFalsy();
            expect(K.isInCheck).toBeTruthy();
            expect(K.checkBy).toBe('a-4');
        });
    });
    describe('getCheckStatus', () => {
        test('light not in check, dark in check down', () => {
            const { K, k, board } = generateTestingEnvironment('rp2kp1r/8/8/8/8/8/4R3/R1P1K1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('e-2');
        });
        test('light not in check, dark in check up', () => {
            const { K, k, board } = generateTestingEnvironment('rp2Rp1r/8/4k3/8/8/4K3/8/R1P3P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('e-8');
        });
        test('light not in check, dark in check left', () => {
            const { K, k, board } = generateTestingEnvironment('rp3p1r/8/1R2k3/8/8/4K3/8/R1P3P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('b-6');
        });
        test('light not in check, dark in check right', () => {
            const { K, k, board } = generateTestingEnvironment('rp3p1r/8/4k2R/8/8/4K3/8/R1P3P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('h-6');
        });
        test('light not in check, dark in check upLeft', () => {
            const { K, k, board } = generateTestingEnvironment('rpB2p1r/8/4k3/8/8/4K3/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('c-8');
        });
        test('light not in check, dark in check upRight', () => {
            const { K, k, board } = generateTestingEnvironment('rp3pBr/8/4k3/8/8/4K3/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('g-8');
        });
        test('light not in check, dark in check downLeft', () => {
            const { K, k, board } = generateTestingEnvironment('rp3p1r/8/4k3/8/8/4K3/B7/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('a-2');
        });
        test('light not in check, dark in check downRight', () => {
            const { K, k, board } = generateTestingEnvironment('rp3p1r/8/4k3/8/8/4K2B/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('h-3');
        });
        test('light in check by knight upR1', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/4n3/8/3K4/7B/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('e-6');
        });
        test('light in check by knight upR2', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/8/5n2/3K4/7B/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('f-5');
        });
        test('light in check by knight downR2', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/8/8/3K4/5n1B/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('f-3');
        });
        test('light in check by knight downR1', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/8/8/3K4/7B/4n3/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('e-2');
        });
        test('light in check by knight downL1', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/8/8/3K4/7B/2n5/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('c-2');
        });
        test('light in check by knight downL2', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/8/8/3K4/1n5B/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('b-3');
        });
        test('light in check by knight upL2', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/8/1n6/3K4/7B/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('b-5');
        });
        test('light in check by knight upL1', () => {
            const { K, k, board } = generateTestingEnvironment('rp1k1p1r/8/2n5/8/3K4/7B/8/R1P1R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('c-6');
        });
        test('dark in check by pawn left', () => {
            const { K, k, board } = generateTestingEnvironment('rpnk1p1r/2P5/8/8/3K4/7B/8/R3R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('c-7');
        });
        test('dark in check by pawn right', () => {
            const { K, k, board } = generateTestingEnvironment('rpnk1p1r/4P3/8/8/3K4/7B/8/R3R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe('e-7');
        });
        test('light in check by pawn left', () => {
            const { K, k, board } = generateTestingEnvironment('rpnk3r/8/6P1/2p5/3K4/7B/8/R3R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('c-5');
        });
        test('light in check by pawn right', () => {
            const { K, k, board } = generateTestingEnvironment('rpnk3r/8/6P1/4p3/3K4/7B/8/R3R1P1 w - - 0 1');
            const lightCheckStatus = K.getCheckStatus(board);
            const darkCheckStatus = k.getCheckStatus(board);
            expect(darkCheckStatus.check).toBeFalsy();
            expect(darkCheckStatus.piece).toBeNull();
            expect(lightCheckStatus.check).toBeTruthy();
            expect(lightCheckStatus.piece).toBe('e-5');
        });
    });
});
