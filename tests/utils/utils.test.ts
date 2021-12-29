import { separateFEN } from '../../src/utils/utils';

test('FEN separates correctly', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const separated = separateFEN(fen);
    expect(separated.piecePlacement).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    expect(separated.activeColor).toBe('w');
    expect(separated.castlingAvailability).toBe('KQkq');
    expect(separated.enPassantTargetSquare).toBe('-');
    expect(separated.halfMoveClock).toEqual(0);
    expect(separated.fullMoveNumber).toEqual(1);
});
