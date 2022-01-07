import Bishop from '../../../src/engine/pieces/Bishop';

describe('Bishop', () => {
    test('bishop constructs correctly', () => {
        const bishop = new Bishop('light', 'c-1');
        expect(bishop.name).toBe('Bishop');
        expect(bishop.moveType).toBe('consecutive');
    });
});
