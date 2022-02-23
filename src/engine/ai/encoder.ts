import { convertRowToArray, FEN } from '@/utils/utils';

interface GenericObject {
    [index: string]: number[]
}

const pieceOneHot: GenericObject = {
    x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    p: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    n: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    b: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    r: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    q: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    k: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    P: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    N: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    B: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    R: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    Q: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    K: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
};

const activeColorOneHot: GenericObject = {
    w: [0],
    b: [1],
};

const castlingOneHot: GenericObject = {
    KQkq: [1, 1, 1, 1],
    KQk: [1, 1, 1, 0],
    KQ: [1, 1, 0, 0],
    KQq: [1, 1, 0, 1],
    Kkq: [1, 0, 1, 1],
    Kq: [1, 0, 0, 1],
    Kk: [1, 0, 1, 0],
    K: [1, 0, 0, 0],
    Qkq: [0, 1, 1, 1],
    Qk: [0, 1, 1, 0],
    Qq: [0, 1, 0, 1],
    Q: [0, 1, 0, 0],
    kq: [0, 0, 1, 1],
    k: [0, 0, 1, 0],
    q: [0, 0, 0, 1],
    '-': [0, 0, 0, 0],
};

const enPassantOneHot: GenericObject = {
    '-': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    a6: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    b6: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    c6: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    d6: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    e6: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    f6: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    g6: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    h6: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    a3: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    b3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    c3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    d3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    e3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    f3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    g3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    h3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
};

const rankOneHot: GenericObject = {
    1: [0, 0, 0, 0, 0, 0, 0],
    2: [1, 0, 0, 0, 0, 0, 0],
    3: [0, 1, 0, 0, 0, 0, 0],
    4: [0, 0, 1, 0, 0, 0, 0],
    5: [0, 0, 0, 1, 0, 0, 0],
    6: [0, 0, 0, 0, 1, 0, 0],
    7: [0, 0, 0, 0, 0, 1, 0],
    8: [0, 0, 0, 0, 0, 0, 1],
};

const fileOneHot: GenericObject = {
    a: [0, 0, 0, 0, 0, 0, 0],
    b: [1, 0, 0, 0, 0, 0, 0],
    c: [0, 1, 0, 0, 0, 0, 0],
    d: [0, 0, 1, 0, 0, 0, 0],
    e: [0, 0, 0, 1, 0, 0, 0],
    f: [0, 0, 0, 0, 1, 0, 0],
    g: [0, 0, 0, 0, 0, 1, 0],
    h: [0, 0, 0, 0, 0, 0, 1],
};

export function convertFenToOneHot(fen: FEN): number[] {
    const encodedFen = [];
    const rows = fen.piecePlacement.split('/');
    for (const row of rows) {
        const rowArray = convertRowToArray(row);
        for (const token of rowArray) {
            encodedFen.push(...pieceOneHot[token]);
        }
    }
    encodedFen.push(...activeColorOneHot[fen.activeColor]);
    encodedFen.push(...castlingOneHot[fen.castlingAvailability]);
    encodedFen.push(...enPassantOneHot[fen.enPassantTargetSquare]);
    return encodedFen;
}

export function convertMoveToOneHot(move: string): number[] {
    console.log(move);
    const encodedMove = [];
    if (move.length > 4) {
        for (let i = 0; i < move.length; i++) {
            if (i === 0 || i === 2) {
                encodedMove.push(...fileOneHot[move[i]]);
            }
            else if (i === 1 || i === 3) {
                encodedMove.push(...rankOneHot[move[i]]);
            }
            else {
                encodedMove.push(...pieceOneHot[move[i]]);
            }
        }
    }
    else {
        for (let i = 0; i < move.length; i++) {
            if (i === 0 || i === 2) {
                encodedMove.push(...fileOneHot[move[i]]);
            }
            else {
                encodedMove.push(...rankOneHot[move[i]]);
            }
        }
        encodedMove.push(...pieceOneHot.x);
    }
    return encodedMove;
}
