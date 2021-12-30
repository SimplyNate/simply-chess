export interface FEN {
    piecePlacement: string,
    activeColor: string,
    castlingAvailability: string,
    enPassantTargetSquare: string,
    halfMoveClock: number,
    fullMoveNumber: number,
}

export function separateFEN(fen: string): FEN {
    const [
        piecePlacement,
        activeColor,
        castlingAvailability,
        enPassantTargetSquare,
        halfMoveClock,
        fullMoveNumber,
    ] = fen.split(' ');
    return {
        piecePlacement,
        activeColor,
        castlingAvailability,
        enPassantTargetSquare,
        halfMoveClock: Number(halfMoveClock),
        fullMoveNumber: Number(fullMoveNumber),
    };
}

export function stringifyFEN(fen: FEN): string {
    return `${fen.piecePlacement} ${fen.activeColor} ${fen.castlingAvailability} ${fen.enPassantTargetSquare} ${fen.halfMoveClock} ${fen.fullMoveNumber}`;
}

function convertRowToArray(row: string): string[] {
    const positions = row.split('');
    for (let i = 0; i < positions.length; i++) {
        const char = positions[i].charCodeAt(0);
        if (char > 48 && char < 58) {
            const number = char - 48;
            const fillArray = Array(number).fill('x');
            positions.splice(i, 1, ...fillArray);
        }
    }
    return positions;
}

export interface BoardMap {
    [index: string]: string,
}

export function parsePlacementToMap(piecePlacement: string): BoardMap {
    const map: BoardMap = {};
    const rows = piecePlacement.split('/');
    let rank = 8;
    for (const row of rows) {
        const positions = convertRowToArray(row);
        for (let i = 0; i < positions.length; i++) {
            const f = file[i];
            map[`${f}-${rank}`] = positions[i];
        }
        rank -= 1;
    }
    return map;
}

export function filterAndSortPositionsToArray(positions: string[], rank: string): string[] {
    return positions.filter(position => position.includes(rank)).sort((a, b) => Number(a[2]) - Number(b[2]));
}

export function splitBoardMapToArray(boardMap: BoardMap): string[][] {
    const positions = Object.keys(boardMap);
    return [
        filterAndSortPositionsToArray(positions, '8'),
        filterAndSortPositionsToArray(positions, '7'),
        filterAndSortPositionsToArray(positions, '6'),
        filterAndSortPositionsToArray(positions, '5'),
        filterAndSortPositionsToArray(positions, '4'),
        filterAndSortPositionsToArray(positions, '3'),
        filterAndSortPositionsToArray(positions, '2'),
        filterAndSortPositionsToArray(positions, '1'),
    ];
}

export function rebuildPlacementFromMap(boardMap: BoardMap): string {
    let piecePlacement = '';
    const positions = splitBoardMapToArray(boardMap);
    for (let r = 0; r < positions.length; r++) {
        const rank = positions[r];
        let localAccumulator = 0;
        for (let i = 0; i < rank.length; i++) {
            const piece = boardMap[rank[i]];
            if (piece === 'x') {
                localAccumulator += 1;
            }
            else if (localAccumulator > 0) {
                piecePlacement = `${piecePlacement}${localAccumulator}${piece}`;
                localAccumulator = 0;
            }
            else {
                piecePlacement = `${piecePlacement}${piece}`;
            }
        }
        if (r < positions.length - 1) {
            piecePlacement = `${piecePlacement}/`;
        }
    }
    return piecePlacement;
}

export function shiftChar(char: string, by: number) {
    return String.fromCharCode(char.charCodeAt(0) + by);
}

export const rank = [8, 7, 6, 5, 4, 3, 2, 1];
export const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const pieceMap = [66, 75, 78, 80, 81, 82, 98, 107, 110, 112, 113, 114];
export const rankAndFile = [
    'a-1', 'a-2', 'a-3', 'a-4', 'a-5', 'a-6', 'a-7', 'a-8',
    'b-1', 'b-2', 'b-3', 'b-4', 'b-5', 'b-6', 'b-7', 'b-8',
    'c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6', 'c-7', 'c-8',
    'd-1', 'd-2', 'd-3', 'd-4', 'd-5', 'd-6', 'd-7', 'd-8',
    'e-1', 'e-2', 'e-3', 'e-4', 'e-5', 'e-6', 'e-7', 'e-8',
    'f-1', 'f-2', 'f-3', 'f-4', 'f-5', 'f-6', 'f-7', 'f-8',
    'g-1', 'g-2', 'g-3', 'g-4', 'g-5', 'g-6', 'g-7', 'g-8',
    'h-1', 'h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8',
];
