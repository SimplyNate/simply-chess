import Knight from '../../../src/engine/pieces/Knight';
import { BoardMap, separateFEN, parsePlacementToMap } from '../../../src/utils/utils';

describe('Knight', function () {
    test('constructs correctly', () => {
        const knight = new Knight('light', 'b-1');
        expect(knight.name).toBe('Knight');
        expect(knight.moveType).toBe('jump');
    });
    test('generates legal moves at various positions on the board', () => {
        const knight = new Knight('light', 'd-4');
        const fen = '8/8/8/8/3N4/8/8/8 w - - 0 1';
        const parsed = separateFEN(fen);
        const boardMap = parsePlacementToMap(parsed.piecePlacement);
        const moves = knight.getLegalMoves(boardMap, parsed);
        expect(moves.sort()).toEqual(['b-3', 'b-5', 'c-2', 'c-6', 'e-2', 'e-6', 'f-3', 'f-5'].sort());
        const sideKnight = new Knight('dark', 'a-4');
        const sideFen = '8/8/8/8/n7/8/8/8 w - - 0 1';
        const sideParsed = separateFEN(sideFen);
        const sideMap = parsePlacementToMap(sideParsed.piecePlacement);
        const sideMoves = sideKnight.getLegalMoves(sideMap, sideParsed);
        expect(sideMoves.sort()).toEqual(['b-6', 'b-2', 'c-3', 'c-5'].sort());
    });
});
