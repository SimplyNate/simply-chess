import King from '../../../src/engine/pieces/King';
import { parsePlacementToMap, separateFEN } from '../../../src/utils/utils';
import Rook from '../../../src/engine/pieces/Rook';
import Pawn from '../../../src/engine/pieces/Pawn';

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
    describe('getCheckStatus', () => {
        test('light not in check, dark in check', () => {
            const fenString = 'rp2kp1r/8/8/8/8/8/4R3/R1P1K1P1 w - - 0 1';
            const fen = separateFEN(fenString);
            const board = parsePlacementToMap(fen.piecePlacement);
            const K = new King('light', 'e-1', '-');
            const k = new King('dark', 'e-8', '-');
            const lightPieces = [
                new Rook('light', 'a-1', '-'),
                new Pawn('light', 'c-1'),
                new Rook('light', 'e-2', '-'),
                new Pawn('light', 'g-1'),
                K,
            ];
            const darkPieces = [
                new Rook('dark', 'a-8', '-'),
                new Pawn('dark', 'b-8'),
                new Pawn('dark', 'f-8'),
                new Rook('dark', 'h-8', '-'),
                k,
            ];
            for (const piece of lightPieces) {
                piece.getLegalMoves(board, fen);
            }
            for (const piece of darkPieces) {
                piece.getLegalMoves(board, fen);
            }
            const lightCheckStatus = K.getCheckStatus(darkPieces, board, fen);
            expect(lightCheckStatus.check).toBeFalsy();
            expect(lightCheckStatus.piece).toBeNull();
            const darkCheckStatus = k.getCheckStatus(lightPieces, board, fen);
            expect(darkCheckStatus.check).toBeTruthy();
            expect(darkCheckStatus.piece).toBe(lightPieces[2]);
        });
    });
});
