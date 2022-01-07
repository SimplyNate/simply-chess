import Queen from '../../../src/engine/pieces/Queen';

describe('Queen', () => {
    test('queen constructs correctly', () => {
        const queen = new Queen('light', 'd-1');
        expect(queen.name).toBe('Queen');
        expect(queen.moveType).toBe('consecutive');
    });
});
