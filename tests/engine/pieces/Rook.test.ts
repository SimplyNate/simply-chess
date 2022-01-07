import Rook from '../../../src/engine/pieces/Rook';
import { BoardMap, separateFEN, parsePlacementToMap } from '../../../src/utils/utils';

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
    });
});
