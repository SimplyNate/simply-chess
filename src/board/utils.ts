interface FEN {
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
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (const row of rows) {
        const positions = convertRowToArray(row);
        for (let i = 0; i < positions.length; i++) {
            const column = columns[i];
            map[`${column}-${rank}`] = positions[i];
        }
        rank -= 1;
    }
    return map;
}
