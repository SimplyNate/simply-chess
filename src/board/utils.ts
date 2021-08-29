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
        halfMoveClock,
        fullMoveNumber,
    };
}
