import Rook from '../../../src/engine/pieces/Rook';

describe('Rook', () => {
    test('rook constructs correctly', () => {
        const rook = new Rook('light', 'a-1', 'KQkq');
        expect(rook.castleSide).toBe('Q');
        expect(rook.canCastle).toBeTruthy();
        expect(rook.moveType).toBe('consecutive');
        const r2 = new Rook('light', 'a-1', 'Kkq');
        expect(r2.canCastle).toBeFalsy();
        expect(r2.castleSide).toBe('-');
        const r3 = new Rook('light', 'h-1', 'KQkq');
        expect(r3.canCastle).toBeTruthy();
        expect(r3.castleSide).toBe('K');
        const r4 = new Rook('light', 'h-1', 'Qkq');
        expect(r4.canCastle).toBeFalsy();
        expect(r4.castleSide).toBe('-');
        const r5 = new Rook('dark', 'a-8', 'KQkq');
        expect(r5.canCastle).toBeTruthy();
        expect(r5.castleSide).toBe('q');
        const r6 = new Rook('dark', 'a-8', 'KQk');
        expect(r6.canCastle).toBeFalsy();
        expect(r6.castleSide).toBe('-');
        const r7 = new Rook('dark', 'h-8', 'KQk');
        expect(r7.canCastle).toBeTruthy();
        expect(r7.castleSide).toBe('k');
        const r8 = new Rook('dark', 'h-8', 'KQ');
        expect(r8.canCastle).toBeFalsy();
        expect(r8.castleSide).toBe('-');
    });
});
